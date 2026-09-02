const Redis = require('ioredis');
const env = require('./env');

// maxRetriesPerRequest: null es requerido por BullMQ para sus conexiones,
// y no hace daño para uso como caché.
const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  tls: env.REDIS_TLS ? {} : undefined,
  maxRetriesPerRequest: null,
  lazyConnect: false,
});

redis.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log('[redis] conectado exitosamente');
});

redis.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('[redis] error:', err.message);
});

function estaConectado() {
  return redis.status === 'ready';
}

module.exports = redis;
module.exports.estaConectado = estaConectado;
