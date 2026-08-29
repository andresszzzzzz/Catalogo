const Proveedor = require('./proveedor.model');
const Producto = require('../productos/producto.model');

async function listar({ filtro, skip, limit }) {
  const [data, total] = await Promise.all([
    Proveedor.find(filtro).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Proveedor.countDocuments(filtro),
  ]);
  return { data, total };
}

function porId(id) {
  return Proveedor.findById(id);
}

function porSlug(slug) {
  return Proveedor.findOne({ slug: String(slug).trim().toLowerCase() });
}

function porNombre(nombre) {
  return Proveedor.findOne({ nombre });
}

function crear(datos) {
  return Proveedor.create(datos);
}

async function actualizar(id, datos) {
  const proveedor = await Proveedor.findById(id);
  if (!proveedor) return null;
  Object.assign(proveedor, datos);
  await proveedor.save();
  return proveedor;
}

function eliminar(id) {
  return Proveedor.findByIdAndDelete(id);
}

function contarProductosDe(proveedorId) {
  return Producto.countDocuments({ proveedorId });
}

module.exports = {
  listar,
  porId,
  porSlug,
  porNombre,
  crear,
  actualizar,
  eliminar,
  contarProductosDe,
};
