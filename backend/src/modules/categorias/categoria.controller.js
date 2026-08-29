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

async function actualizar(req, res, next) {
  try {
    const categoria = await categoriaService.actualizarCategoria(req.params.id, req.body || {});
    res.status(200).json(categoria);
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, obtenerPorSlug, actualizar };
