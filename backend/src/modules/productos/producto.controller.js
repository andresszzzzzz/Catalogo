const productoService = require('./producto.service');

async function listar(req, res, next) {
  try {
    const resultado = await productoService.listarProductos(req.query);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
}

async function stats(req, res, next) {
  try {
    const resultado = await productoService.statsProductos();
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
}

async function obtener(req, res, next) {
  try {
    const producto = await productoService.obtenerProducto(req.params.id);
    res.status(200).json(producto);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const producto = await productoService.crearProducto(req.body || {});
    res.status(201).json(producto);
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const producto = await productoService.actualizarProducto(req.params.id, req.body || {});
    res.status(200).json(producto);
  } catch (error) {
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    await productoService.eliminarProducto(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, stats, obtener, crear, actualizar, eliminar };
