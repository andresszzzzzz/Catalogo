const multer = require('multer');
const AppError = require('../errors/AppError');

/**
 * Middleware de errores centralizado. Debe registrarse último, después de
 * todas las rutas. Traduce errores conocidos (Mongo, Multer, validación)
 * a respuestas tipadas; cualquier otro error se responde como 500 genérico.
 */
// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, next) {
  // Error tipado propio de la app
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      codigo: err.codigo,
      mensaje: err.mensaje,
    });
  }

  // Duplicado de índice único en Mongo
  if (err && err.code === 11000) {
    const campo = Object.keys(err.keyValue || {})[0] || 'campo';
    return res.status(409).json({
      status: 'error',
      codigo: 'DUPLICADO',
      mensaje: `Ya existe un registro con ese ${campo}`,
    });
  }

  // Errores de validación de Mongoose
  if (err && err.name === 'ValidationError') {
    const mensaje = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ');
    return res.status(400).json({
      status: 'error',
      codigo: 'VALIDACION',
      mensaje: mensaje || 'Datos inválidos',
    });
  }

  // ObjectId con formato inválido
  if (err && err.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      codigo: 'ID_INVALIDO',
      mensaje: `Identificador inválido: ${err.value}`,
    });
  }

  // Errores de Multer (tamaño de archivo, etc.)
  if (err instanceof multer.MulterError) {
    const statusCode = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(statusCode).json({
      status: 'error',
      codigo: err.code,
      mensaje: err.message,
    });
  }

  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({
      status: 'error',
      codigo: 'JSON_INVALIDO',
      mensaje: 'El cuerpo de la petición no es JSON válido',
    });
  }

  // eslint-disable-next-line no-console
  console.error('[error no controlado]', err);
  return res.status(500).json({
    status: 'error',
    codigo: 'SERVER_ERROR',
    mensaje: 'Error interno del servidor',
  });
};
