/**
 * Rutas de imports (sección 7.5). El endpoint POST /api/imports queda
 * scaffoldeado pero responde 501 hasta la Fase 3, cuando se conecte a
 * BullMQ. No se monta en app.js todavía para no confundir con un contrato
 * "vivo"; se deja listo para activarse en la siguiente fase.
 */
const express = require('express');
const importController = require('./import.controller');
const auth = require('../../middlewares/auth');
const rol = require('../../middlewares/rol');
const upload = require('../../middlewares/upload');
const { importLimiter } = require('../../middlewares/rateLimit');

const router = express.Router();

router.post(
  '/',
  auth,
  rol('admin'),
  importLimiter,
  upload.single('archivo'),
  importController.crear
);

module.exports = router;
