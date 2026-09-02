const categoriaService = require('./categoria.service');

async function listar(req, res, next) {
  try {
    const categorias = await categoriaService.listarCategorias();
    res.status(200).json(categorias);
  } catch (error) {
    next(error);
  }
}

async function obtenerPorSlug(req, res, next) {
  try {
    const categoria = await categoriaService.obtenerPorSlug(req.params.slug);
    res.status(200).json(categoria);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const categoria = await categoriaService.crearCategoria(req.body || {});
    res.status(201).json({ msg: 'Categoría creada exitosamente', ...categoria.toJSON() });
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const categoria = await categoriaService.actualizarCategoria(req.params.id, req.body || {});
    res.status(200).json({ msg: 'Categoría actualizada exitosamente', ...categoria.toJSON() });
  } catch (error) {
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    await categoriaService.eliminarCategoria(req.params.id);
    res.status(200).json({ msg: 'Categoría eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, obtenerPorSlug, crear, actualizar, eliminar };