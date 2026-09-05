const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const env = require('./config/env');
const db = require('./config/db');
const redis = require('./config/redis');
const swaggerSpec = require('./config/swagger');
const { apiLimiter } = require('./middlewares/rateLimit');
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./errors/AppError');

const authRoutes = require('./modules/auth/auth.routes');
const productoRoutes = require('./modules/productos/producto.routes');
const proveedorRoutes = require('./modules/proveedores/proveedor.routes');
const categoriaRoutes = require('./modules/categorias/categoria.routes');
const usuarioRoutes = require('./modules/usuarios/usuario.routes');

function crearApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(apiLimiter);

  // Sirve el frontend ya compilado (frontend/dist copiado aqui como backend/public).
  // Como el router del frontend usa hash (#/...), no hace falta una ruta
  // "catch-all" para el enrutado del lado del cliente: basta con servir index.html
  // en "/" y los assets estáticos; el resto lo maneja el JS en el navegador.
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use('/api/usuarios', usuarioRoutes);

  /**
   * @openapi
   * /health:
   *   get:
   *     tags: [Health]
   *     summary: Estado del servicio y sus dependencias
   *     responses:
   *       200: { description: Todo operativo }
   *       503: { description: Mongo o Redis caídos }
   */
  app.get('/health', (req, res) => {
    const mongoUp = db.estaConectado();
    const redisUp = redis.estaConectado();
    const status = mongoUp && redisUp ? 200 : 503;

    res.status(status).json({
      status: status === 200 ? 'ok' : 'error',
      mongo: mongoUp ? 'up' : 'down',
      redis: redisUp ? 'up' : 'down',
    });
  });

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/api/auth', authRoutes);
  app.use('/api/productos', productoRoutes);
  app.use('/api/proveedores', proveedorRoutes);
  app.use('/api/categorias', categoriaRoutes);

  // Cualquier ruta no definida.
  app.use((req, res, next) => {
    next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404, 'NO_ENCONTRADO'));
  });

  // Debe ser el último middleware.
  app.use(errorHandler);

  return app;
}

module.exports = crearApp;
