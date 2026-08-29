const importService = require('./import.service');

async function crear(req, res, next) {
  try {
    const resultado = await importService.crearImport(req);
    res.status(202).json(resultado);
  } catch (error) {
    next(error);
  }
}

module.exports = { crear };
