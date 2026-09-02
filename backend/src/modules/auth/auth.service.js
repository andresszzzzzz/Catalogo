const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('./usuario.model');
const AppError = require('../../errors/AppError');
const env = require('../../config/env');

const SALT_ROUNDS = 10;

async function registrar({ email, password, rol }) {
  if (!email || !password) {
    throw new AppError('email y password son requeridos', 400, 'VALIDACION');
  }

  const existente = await Usuario.findOne({ email: String(email).toLowerCase() });
  if (existente) {
    throw new AppError('El email ya está registrado', 409, 'EMAIL_DUPLICADO');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const usuario = await Usuario.create({
    email,
    password: passwordHash,
    rol: rol === 'admin' ? 'admin' : 'user',
  });

  return { id: usuario._id, email: usuario.email, rol: usuario.rol };
}

async function login(email, password) {
  if (!email || !password) {
    throw new AppError('email y password son requeridos', 400, 'VALIDACION');
  }

  const usuario = await Usuario.findOne({ email: String(email).toLowerCase() }).select(
    '+password'
  );
  if (!usuario) {
    throw new AppError('Credenciales inválidas', 401, 'CREDENCIALES_INVALIDAS');
  }

  const passwordValido = await bcrypt.compare(password, usuario.password);
  if (!passwordValido) {
    throw new AppError('Credenciales inválidas', 401, 'CREDENCIALES_INVALIDAS');
  }

  const token = jwt.sign({ sub: usuario._id.toString(), rol: usuario.rol }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN || '1h',
  });

  return { token };
}

module.exports = { registrar, login };
