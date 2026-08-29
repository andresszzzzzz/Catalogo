const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../errors/AppError');

/**
 * Verifica el JWT del header Authorization y adjunta req.usuario = { id, rol }.
 */
module.exports = function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No autorizado: token faltante', 401, 'UNAUTHORIZED'));
  }

  const token = authHeader.slice('Bearer '.length).trim();
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.usuario = { id: decoded.sub, rol: decoded.rol };
    return next();
  } catch (error) {
    return next(new AppError('Token inválido o expirado', 401, 'INVALID_TOKEN'));
  }
};
