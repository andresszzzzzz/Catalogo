const AppError = require('../errors/AppError');

/**
 * Exige que req.usuario.rol esté entre los roles permitidos.
 * Debe usarse siempre después del middleware auth.
 * Uso: rol('admin') o rol('admin', 'user')
 */
module.exports = function rol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return next(new AppError('No autorizado', 401, 'UNAUTHORIZED'));
    }
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return next(
        new AppError('No tienes permisos para realizar esta acción', 403, 'FORBIDDEN')
      );
    }
    return next();
  };
};
