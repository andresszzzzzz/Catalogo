/**
 * Cola de BullMQ para procesar imports en segundo plano.
 *
 * ESTADO: pendiente de implementación (Fase 2 del proyecto).
 * Se deja el esqueleto listo para no romper la estructura de carpetas
 * obligatoria (sección 4 del enunciado) y para que import.service.js
 * pueda encolar jobs en cuanto se implemente el worker.
 */
const { Queue } = require('bullmq');
const env = require('../config/env');

const NOMBRE_COLA = 'import-catalogo';

const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
};

let importQueue = null;

function getImportQueue() {
  if (!importQueue) {
    importQueue = new Queue(NOMBRE_COLA, { connection });
  }
  return importQueue;
}

module.exports = { getImportQueue, NOMBRE_COLA };
