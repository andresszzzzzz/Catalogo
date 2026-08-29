/**
 * ESTADO: pendiente de implementación completa (Fase 3): subir archivo,
 * crear el ImportJob en pending, encolarlo en BullMQ y responder de
 * inmediato (202). Se deja el esqueleto para no romper la estructura de
 * carpetas obligatoria (sección 4) mientras se completan las Fases 2-4.
 */
const AppError = require('../../errors/AppError');

async function crearImport() {
  throw new AppError(
    'La importación de catálogos se implementa en la Fase 3 del proyecto (aún no disponible)',
    501,
    'NO_IMPLEMENTADO'
  );
}

module.exports = { crearImport };
