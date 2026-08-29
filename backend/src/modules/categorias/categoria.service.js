const mongoose = require('mongoose');
const categoriaRepository = require('./categoria.repository');
const AppError = require('../../errors/AppError');

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

module.exports = { listarCategorias, obtenerPorSlug, actualizarCategoria };
