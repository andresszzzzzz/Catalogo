const rateLimit = require('express-rate-limit');

// Rate limit estricto para login/registro: mitiga fuerza bruta.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    codigo: 'RATE_LIMIT',
    mensaje: 'Demasiados intentos, intenta más tarde.',
  },
});

// Rate limit estricto para subir imports: son operaciones costosas.
const importLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    codigo: 'RATE_LIMIT',
    mensaje: 'Demasiadas importaciones en poco tiempo, intenta más tarde.',
  },
});

// Rate limit general para el resto de la API.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    codigo: 'RATE_LIMIT',
    mensaje: 'Demasiadas peticiones desde esta IP, intenta más tarde.',
  },
});

module.exports = { authLimiter, importLimiter, apiLimiter };
