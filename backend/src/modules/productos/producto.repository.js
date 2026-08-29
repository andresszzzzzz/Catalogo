const Producto = require('./producto.model');

async function listar({ filtro, skip, limit }) {
  const [data, total] = await Promise.all([
    Producto.find(filtro).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Producto.countDocuments(filtro),
  ]);
  return { data, total };
}

async function stats() {
  const [totalProductos, promedio, porCategoria] = await Promise.all([
    Producto.countDocuments(),
    Producto.aggregate([{ $group: { _id: null, promedio: { $avg: '$precio' } } }]),
    Producto.aggregate([
      { $group: { _id: '$categoria', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, categoria: '$_id', count: 1 } },
    ]),
  ]);

  const precioPromedio = promedio.length > 0 ? Math.round(promedio[0].promedio * 100) / 100 : 0;

  return { totalProductos, precioPromedio, porCategoria };
}

function porId(id) {
  return Producto.findById(id);
}

function porSku(sku) {
  return Producto.findOne({ sku: String(sku).trim().toUpperCase() });
}

function crear(datos) {
  return Producto.create(datos);
}

async function actualizar(id, datos) {
  const producto = await Producto.findById(id);
  if (!producto) return null;
  Object.assign(producto, datos);
  await producto.save();
  return producto;
}

function eliminar(id) {
  return Producto.findByIdAndDelete(id);
}

module.exports = {
  listar,
  stats,
  porId,
  porSku,
  crear,
  actualizar,
  eliminar,
};
