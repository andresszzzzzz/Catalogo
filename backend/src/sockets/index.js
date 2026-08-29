/**
 * Inicializa Socket.io sobre el servidor HTTP y (en Fase 4) hace de relay
 * entre los QueueEvents de BullMQ y los clientes conectados, para reportar
 * progreso de imports en tiempo real.
 *
 * ESTADO: pendiente de implementación completa (Fase 4). Se deja el
 * arranque básico para no romper la estructura de carpetas obligatoria.
 */
const { Server } = require('socket.io');

function inicializarSockets(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    // TODO (Fase 4): unir al socket a la sala del importJobId que le interese
    // y reenviar los eventos progress/completed/failed de BullMQ.
    socket.on('disconnect', () => {});
  });

  return io;
}

module.exports = inicializarSockets;
