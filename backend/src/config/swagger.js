const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CatálogoBulk API',
      version: '1.0.0',
      description:
        'Sistema de importación masiva de productos con procesamiento asíncrono. ' +
        'Documentación de los endpoints de Auth, Productos, Proveedores y Categorías (Fases 0-1).',
    },
    servers: [{ url: '/', description: 'Servidor actual' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../modules/**/*.routes.js'),
    path.join(__dirname, '../app.js'),
  ],
};

module.exports = swaggerJsdoc(options);
