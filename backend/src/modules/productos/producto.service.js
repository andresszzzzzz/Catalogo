const mongoose = require('mongoose');
const productoRepository = require('./producto.repository');
const proveedorRepository = require('../proveedores/proveedor.repository');
const AppError = require('../../errors/AppError');

function clampLimit(limit) {
  const n = Number(limit) || 20;
  return Math.min(Math.max(n, 1), 100);
}

function clampPage(page) {
  const n = Number(page) || 1;
  return Math.max(n, 1);
}

async function listarProductos(query) {
  const page = clampPage(query.page);
  const limit = clampLimit(query.limit);
  const filtro = {};

  if (query.categoria) {
    filtro.categoria = String(query.categoria).trim().toLowerCase();
  }

  if (query.disponible !== undefined) {
    filtro.disponible = query.disponible === 'true' || query.disponible === true;
  }

  if (query.activo !== undefined) {
    filtro.activo = query.activo === 'true' || query.activo === true;
  }

  if (query.proveedor) {
    if (mongoose.isValidObjectId(query.proveedor)) {
      filtro.proveedorId = query.proveedor;
    } else {
      const proveedor = await proveedorRepository.porSlug(query.proveedor);
      // Si el slug no existe, el filtro no debe devolver nada (id imposible).
      filtro.proveedorId = proveedor ? proveedor._id : new mongoose.Types.ObjectId();
    }
  }

  const skip = (page - 1) * limit;
  const { data, total } = await productoRepository.listar({ filtro, skip, limit });

  return { data, page, limit, total };
}

function statsProductos() {
  return productoRepository.stats();
}

async function obtenerProducto(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Identificador inválido', 400, 'ID_INVALIDO');
  }
  const producto = await productoRepository.porId(id);
  if (!producto) {
    throw new AppError('Producto no encontrado', 404, 'NO_ENCONTRADO');
  }
  return producto;
}

async function crearProducto(datos) {
  const { sku, nombre, precio, stock, categoria, proveedorId, descripcion, imagenUrl } = datos;

  if (!sku || !nombre || precio === undefined || !categoria || !proveedorId) {
    throw new AppError(
      'sku, nombre, precio, categoria y proveedorId son requeridos',
      400,
      'VALIDACION'
    );
  }

  if (!mongoose.isValidObjectId(proveedorId)) {
    throw new AppError('proveedorId inválido', 400, 'VALIDACION');
  }

  const proveedor = await proveedorRepository.porId(proveedorId);
  if (!proveedor) {
    throw new AppError('El proveedor indicado no existe', 404, 'PROVEEDOR_NO_EXISTE');
  }

  const existente = await productoRepository.porSku(sku);
  if (existente) {
    throw new AppError('sku duplicado', 409, 'SKU_DUPLICADO');
  }

  return productoRepository.crear({
    sku,
    nombre,
    precio,
    stock: stock ?? 0,
    categoria,
    proveedorId,
    descripcion: descripcion ?? null,
    imagenUrl: imagenUrl ?? null,
  });
}

async function actualizarProducto(id, datos) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Identificador inválido', 400, 'ID_INVALIDO');
  }

  if (datos.sku) {
    const existente = await productoRepository.porSku(datos.sku);
    if (existente && existente._id.toString() !== id) {
      throw new AppError('sku duplicado', 409, 'SKU_DUPLICADO');
    }
  }

  if (datos.proveedorId) {
    if (!mongoose.isValidObjectId(datos.proveedorId)) {
      throw new AppError('proveedorId inválido', 400, 'VALIDACION');
    }
    const proveedor = await proveedorRepository.porId(datos.proveedorId);
    if (!proveedor) {
      throw new AppError('El proveedor indicado no existe', 404, 'PROVEEDOR_NO_EXISTE');
    }
  }

  const actualizado = await productoRepository.actualizar(id, datos);
  if (!actualizado) {
    throw new AppError('Producto no encontrado', 404, 'NO_ENCONTRADO');
  }
  return actualizado;
}

async function desactivarProducto(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Identificador inválido', 400, 'ID_INVALIDO');
  }
  const actualizado = await productoRepository.actualizar(id, { activo: false });
  if (!actualizado) {
    throw new AppError('Producto no encontrado', 404, 'NO_ENCONTRADO');
  }
  return actualizado;
}

async function activarProducto(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Identificador inválido', 400, 'ID_INVALIDO');
  }
  const actualizado = await productoRepository.actualizar(id, { activo: true });
  if (!actualizado) {
    throw new AppError('Producto no encontrado', 404, 'NO_ENCONTRADO');
  }
  return actualizado;
}

module.exports = {
  listarProductos,
  statsProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  desactivarProducto,
  activarProducto,
};