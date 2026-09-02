const mongoose = require('mongoose');
const categoriaRepository = require('./categoria.repository');
const AppError = require('../../errors/AppError');

function slugify(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generarSlugUnico(nombre) {
  const base = slugify(nombre) || 'categoria';
  let candidato = base;
  let sufijo = 2;
  while (await categoriaRepository.porSlug(candidato)) {
    candidato = `${base}-${sufijo}`;
    sufijo += 1;
  }
  return candidato;
}

function listarCategorias() {
  return categoriaRepository.listar();
}

async function obtenerPorSlug(slug) {
  const categoria = await categoriaRepository.porSlug(slug);
  if (!categoria) {
    throw new AppError('Categoría no encontrada', 404, 'NO_ENCONTRADA');
  }
  return categoria;
}

async function crearCategoria(datos) {
  const { nombre, descripcion, imagenUrl } = datos;
  if (!nombre) {
    throw new AppError('nombre es requerido', 400, 'VALIDACION');
  }

  const slug = await generarSlugUnico(nombre);

  return categoriaRepository.crear({
    nombre,
    slug,
    descripcion: descripcion ?? null,
    imagenUrl: imagenUrl ?? null,
  });
}

async function actualizarCategoria(id, datos) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Identificador inválido', 400, 'ID_INVALIDO');
  }
  // El slug es la llave que une con los productos: no se edita.
  const { nombre, descripcion, imagenUrl } = datos;
  const cambios = {};
  if (nombre !== undefined) cambios.nombre = nombre;
  if (descripcion !== undefined) cambios.descripcion = descripcion;
  if (imagenUrl !== undefined) cambios.imagenUrl = imagenUrl;

  const actualizada = await categoriaRepository.actualizar(id, cambios);
  if (!actualizada) {
    throw new AppError('Categoría no encontrada', 404, 'NO_ENCONTRADA');
  }
  return actualizada;
}

async function eliminarCategoria(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Identificador inválido', 400, 'ID_INVALIDO');
  }
  const eliminada = await categoriaRepository.eliminar(id);
  if (!eliminada) {
    throw new AppError('Categoría no encontrada', 404, 'NO_ENCONTRADA');
  }
}

module.exports = {
  listarCategorias,
  obtenerPorSlug,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
};