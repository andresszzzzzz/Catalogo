const http = require('http');
const env = require('./config/env');
const crearApp = require('./app');
const { conectarDB } = require('./config/db');
require('./config/redis'); // fuerza la conexión compartida a Redis
const inicializarSockets = require('./sockets');

async function main() {
  await conectarDB();

  const app = crearApp();
  const server = http.createServer(app);

  inicializarSockets(server);

  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] CatálogoBulk API escuchando en http://localhost:${env.PORT}`);
    // eslint-disable-next-line no-console
    console.log(`[server] Swagger disponible en http://localhost:${env.PORT}/api/docs`);
  });
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('[server] error fatal al iniciar:', error);
  process.exit(1);
});
