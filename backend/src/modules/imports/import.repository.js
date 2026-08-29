const ImportJob = require('./importJob.model');

function crear(datos) {
  return ImportJob.create(datos);
}

function porId(id) {
  return ImportJob.findById(id);
}

async function listar({ filtro, skip, limit }) {
  const [data, total] = await Promise.all([
    ImportJob.find(filtro).skip(skip).limit(limit).sort({ createdAt: -1 }),
    ImportJob.countDocuments(filtro),
  ]);
  return { data, total };
}

module.exports = { crear, porId, listar };
