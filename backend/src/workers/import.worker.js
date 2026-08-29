/**
 * Worker de procesamiento de imports. Corre como proceso separado
 * (node src/workers/import.worker.js), NUNCA dentro del API server.
 *
 * ESTADO: pendiente de implementación (Fases 2-4 del proyecto):
 *   - Fase 2: parseo por streams (CSV/JSON), validación y normalización.
 *   - Fase 3: persistencia por lotes (BATCH_SIZE) y actualización de
 *             progreso del ImportJob.
 *   - Fase 4: eventos de progreso en tiempo real vía QueueEvents -> Socket.io.
 *
 * Se deja el arranque mínimo (conexión a Mongo/Redis + Worker de BullMQ
 * vacío) para respetar la estructura de carpetas obligatoria y para que
 * el proceso pueda arrancarse con `npm run worker` sin fallar.
 */
const { Worker } = require('bullmq');
const env = require('./../config/env');
const { conectarDB } = require('../config/db');
const { NOMBRE_COLA } = require('../queues/import.queue');

const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
};

async function procesarJob(job) {
  // TODO (Fase 2-4): leer job.data.importJobId, hacer streaming del archivo,
  // validar/normalizar cada fila, insertar por lotes y reportar progreso.
  // eslint-disable-next-line no-console
  console.log(`[worker] job recibido (sin procesar todavía): ${job.id}`);
}

async function iniciar() {
  await conectarDB();
  const worker = new Worker(NOMBRE_COLA, procesarJob, { connection });

  worker.on('completed', (job) => {
    // eslint-disable-next-line no-console
    console.log(`[worker] job ${job.id} completado`);
  });
  worker.on('failed', (job, err) => {
    // eslint-disable-next-line no-console
    console.error(`[worker] job ${job && job.id} falló:`, err.message);
  });

  // eslint-disable-next-line no-console
  console.log('[worker] escuchando la cola', NOMBRE_COLA);
}

if (require.main === module) {
  iniciar().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('[worker] no se pudo iniciar:', error);
    process.exit(1);
  });
}

module.exports = { iniciar };
