// En pruebas usamos .env.test (apunta a una base de datos separada) si existe.
const path = require('path');
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
require('dotenv').config({ path: path.resolve(process.cwd(), envFile) });
// Si .env.test no existe todavía, caemos de vuelta a .env para no romper.
require('dotenv').config();

// Todas las variables son obligatorias (sección 3 del proyecto).
// El proceso NO debe arrancar con valores hardcodeados: si falta alguna,
// fallamos temprano con un mensaje explícito.
const REQUIRED_VARS = [
  'PORT',
  'MONGO_URI',
  'REDIS_HOST',
  'REDIS_PORT',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'MAX_FILE_SIZE_MB',
  'BATCH_SIZE',
  'CACHE_TTL_SECONDS',
  'IMPORT_ERRORS_CAP',
];

const faltantes = REQUIRED_VARS.filter((key) => {
  const value = process.env[key];
  return value === undefined || value === null || value === '';
});

if (faltantes.length > 0) {
  // eslint-disable-next-line no-console
  console.error(
    `[env] Faltan variables de entorno obligatorias: ${faltantes.join(', ')}. ` +
      'Revisa tu archivo .env (usa .env.example como referencia). Abortando arranque.'
  );
  process.exit(1);
}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT),
  MONGO_URI: process.env.MONGO_URI,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: Number(process.env.REDIS_PORT),
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  MAX_FILE_SIZE_MB: Number(process.env.MAX_FILE_SIZE_MB),
  BATCH_SIZE: Number(process.env.BATCH_SIZE),
  CACHE_TTL_SECONDS: Number(process.env.CACHE_TTL_SECONDS),
  IMPORT_ERRORS_CAP: Number(process.env.IMPORT_ERRORS_CAP),
};

module.exports = env;
