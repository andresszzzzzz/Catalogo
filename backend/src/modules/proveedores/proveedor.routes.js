const express = require('express');
const proveedorController = require('./proveedor.controller');
const auth = require('../../middlewares/auth');
const rol = require('../../middlewares/rol');

const router = express.Router();

/**
 * @openapi
 * /api/proveedores:
 *   get:
 *     tags: [Proveedores]
 *     summary: Listar proveedores (paginado)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista paginada de proveedores }
 *   post:
 *     tags: [Proveedores]
 *     summary: Crear proveedor (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Proveedor creado }
 *       400: { description: Validación }
 *       409: { description: nombre o slug duplicado }
 */
router.get('/', proveedorController.listar);
router.post('/', auth, rol('admin'), proveedorController.crear);

/**
 * @openapi
 * /api/proveedores/{id}:
 *   get:
 *     tags: [Proveedores]
 *     summary: Obtener un proveedor por id
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Proveedor }
 *       404: { description: No existe }
 *   put:
 *     tags: [Proveedores]
 *     summary: Actualizar proveedor (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Actualizado }
 *       404: { description: No existe }
 *   delete:
 *     tags: [Proveedores]
 *     summary: Eliminar proveedor (solo admin, solo si no tiene productos)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Eliminado }
 *       404: { description: No existe }
 *       409: { description: Tiene productos asociados }
 */
router.get('/:id', proveedorController.obtener);
router.put('/:id', auth, rol('admin'), proveedorController.actualizar);
router.delete('/:id', auth, rol('admin'), proveedorController.eliminar);

module.exports = router;
