const mongoose = require('mongoose');
const env = require('./env');

mongoose.set('strictQuery', true);

/**
 * Conecta a MongoDB reintentando con backoff fijo.
 * docker-compose "depends_on" solo garantiza el orden de arranque de los
 * contenedores, no que Mongo ya acepte conexiones, así que reintentamos
 * en vez de morir en el primer intento fallido.
 */
async function conectarDB({ retries = 10, delayMs = 2000 } = {}) {
  for (let intento = 1; intento <= retries; intento += 1) {
    try {
      await mongoose.connect(env.MONGO_URI);
      // eslint-disable-next-line no-console
      console.log('[mongo] conectado exitosamente');
      return mongoose.connection;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `[mongo] intento ${intento}/${retries} fallido: ${error.message}`
      );
      if (intento === retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return null;
}

function estaConectado() {
  return mongoose.connection.readyState === 1; // 1 = connected
}

module.exports = { conectarDB, estaConectado, mongoose };
