const Categoria = require('./categoria.model');

function listar() {
  return Categoria.find().sort({ nombre: 1 });
}

function porId(id) {
  return Categoria.findById(id);
}

function porSlug(slug) {
  return Categoria.findOne({ slug: String(slug).trim().toLowerCase() });
}

async function actualizar(id, datos) {
  const categoria = await Categoria.findById(id);
  if (!categoria) return null;
  Object.assign(categoria, datos);
  await categoria.save();
  return categoria;
}

/**
 * Crea las categorías que falten a partir de una lista de slugs distintos.
 * Se usa desde el proceso de import (sección 6.5): upsert con datos mínimos.
 */
async function upsertFaltantes(slugs) {
  const operaciones = slugs.map((slug) => ({
    updateOne: {
      filter: { slug },
      update: {
        $setOnInsert: {
          slug,
          nombre: slug.charAt(0).toUpperCase() + slug.slice(1),
          descripcion: null,
          imagenUrl: null,
        },
      },
      upsert: true,
    },
  }));
  if (operaciones.length === 0) return;
  await Categoria.bulkWrite(operaciones);
}

module.exports = { listar, porId, porSlug, actualizar, upsertFaltantes };
