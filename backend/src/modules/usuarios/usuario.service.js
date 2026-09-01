const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const usuarioRepository = require('./usuario.repository');
const AppError = require('../../errors/AppError');

const SALT_ROUNDS = 10;
const ROLES_VALIDOS = ['admin', 'user'];

function normalizarRol(rol) {
  return rol === 'admin' ? 'admin' : 'user';
}

function listarUsuarios() {
  return usuarioRepository.listar();
}

async function obtenerUsuario(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Identificador inválido', 400, 'ID_INVALIDO');
  }
  const usuario = await usuarioRepository.porId(id);
  if (!usuario) {
    throw new AppError('Usuario no encontrado', 404, 'NO_ENCONTRADO');
  }
  return usuario;
}

async function crearUsuario(datos) {
  const { nombre, email, password, rol } = datos;

  if (!nombre || !email || !password) {
    throw new AppError('nombre, email y password son requeridos', 400, 'VALIDACION');
  }

  const existente = await usuarioRepository.porEmail(email);
  if (existente) {
    throw new AppError('El email ya está registrado', 409, 'EMAIL_DUPLICADO');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const usuario = await usuarioRepository.crear({
    nombre: String(nombre).trim(),
    email: String(email).toLowerCase().trim(),
    password: passwordHash,
    rol: normalizarRol(rol),
  });

  return usuarioRepository.porId(usuario._id);
}

async function actualizarUsuario(id, datos, solicitante) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Identificador inválido', 400, 'ID_INVALIDO');
  }

  const usuario = await usuarioRepository.porId(id);
  if (!usuario) {
    throw new AppError('Usuario no encontrado', 404, 'NO_ENCONTRADO');
  }

  const cambios = {};

  if (datos.nombre !== undefined) {
    cambios.nombre = String(datos.nombre).trim();
  }

  if (datos.email !== undefined && datos.email !== usuario.email) {
    const nuevoEmail = String(datos.email).toLowerCase().trim();
    const existente = await usuarioRepository.porEmail(nuevoEmail);
    if (existente && existente._id.toString() !== id) {
      throw new AppError('El email ya está registrado', 409, 'EMAIL_DUPLICADO');
    }
    cambios.email = nuevoEmail;
  }

  if (datos.rol !== undefined) {
    const nuevoRol = normalizarRol(datos.rol);
    if (usuario.rol === 'admin' && nuevoRol !== 'admin') {
      const otrosAdmins = await usuarioRepository.contarAdmins(id);
      if (otrosAdmins === 0) {
        throw new AppError(
          'No puedes quitarle el rol admin al último administrador',
          409,
          'ULTIMO_ADMIN'
        );
      }
    }
    cambios.rol = nuevoRol;
  }

  if (datos.password) {
    cambios.password = await bcrypt.hash(datos.password, SALT_ROUNDS);
  }

  await usuarioRepository.actualizar(id, cambios);

  return usuarioRepository.porId(id);
}

async function eliminarUsuario(id, solicitante) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Identificador inválido', 400, 'ID_INVALIDO');
  }

  const usuario = await usuarioRepository.porId(id);
  if (!usuario) {
    throw new AppError('Usuario no encontrado', 404, 'NO_ENCONTRADO');
  }

  if (solicitante && solicitante.id === id) {
    throw new AppError('No puedes eliminar tu propia cuenta', 409, 'AUTOELIMINACION');
  }

  if (usuario.rol === 'admin') {
    const otrosAdmins = await usuarioRepository.contarAdmins(id);
    if (otrosAdmins === 0) {
      throw new AppError('No puedes eliminar al último administrador', 409, 'ULTIMO_ADMIN');
    }
  }

  await usuarioRepository.eliminar(id);
}

module.exports = { listarUsuarios, obtenerUsuario, crearUsuario, actualizarUsuario, eliminarUsuario };