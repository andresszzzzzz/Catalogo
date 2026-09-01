const express = require('express');
const usuarioController = require('./usuario.controller');
const auth = require('../../middlewares/auth');
const rol = require('../../middlewares/rol');

const router = express.Router();

router.use(auth, rol('admin'));

router.get('/', usuarioController.listar);
router.post('/', usuarioController.crear);
router.get('/:id', usuarioController.obtener);
router.put('/:id', usuarioController.actualizar);
router.delete('/:id', usuarioController.eliminar);

module.exports = router;