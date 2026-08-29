class AppError extends Error {
  /**
   * @param {string} mensaje mensaje legible para el cliente
   * @param {number} statusCode código HTTP
   * @param {string} codigo código corto identificando el tipo de error
   */
  constructor(mensaje, statusCode = 500, codigo = 'SERVER_ERROR') {
    super(mensaje);
    this.name = 'AppError';
    this.mensaje = mensaje;
    this.statusCode = statusCode;
    this.codigo = codigo;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
