const proveedorService = require('./proveedor.service');

async function listar(req, res, next) {
  try {
    const resultado = await proveedorService.listarProveedores(req.query);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
}

async function obtener(req, res, next) {
  try {
    const proveedor = await proveedorService.obtenerProveedor(req.params.id);
    res.status(200).json(proveedor);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const proveedor = await proveedorService.crearProveedor(req.body || {});
    res.status(201).json(proveedor);
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const proveedor = await proveedorService.actualizarProveedor(req.params.id, req.body || {});
    res.status(200).json(proveedor);
  } catch (error) {
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    await proveedorService.eliminarProveedor(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
