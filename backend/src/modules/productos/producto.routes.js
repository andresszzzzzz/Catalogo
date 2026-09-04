const express = require('express');
const productoController = require('./producto.controller');
const auth = require('../../middlewares/auth');
const rol = require('../../middlewares/rol');

const router = express.Router();

/**
 * @openapi
 * /api/productos:
 *   get:
 *     tags: [Productos]
 *     summary: Listar productos (paginado, filtrable)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: categoria
 *         schema: { type: string }
 *       - in: query
 *         name: proveedor
 *         schema: { type: string }
 *       - in: query
 *         name: disponible
 *         schema: { type: boolean }
 *     responses:
 *       200: { description: Lista paginada de productos }
 *   post:
 *     tags: [Productos]
 *     summary: Crear producto (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Producto creado }
 *       400: { description: Validación }
 *       404: { description: proveedorId no existe }
 *       409: { description: sku duplicado }
 */
router.get('/', productoController.listar);
router.post('/', auth, rol('admin'), productoController.crear);

/**
 * @openapi
 * /api/productos/stats:
 *   get:
 *     tags: [Productos]
 *     summary: Estadísticas del catálogo
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Estadísticas agregadas }
 */
router.get('/stats', productoController.stats);

/**
 * @openapi
 * /api/productos/{id}:
 *   get:
 *     tags: [Productos]
 *     summary: Obtener un producto por id
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Producto }
 *       404: { description: No existe }
 *   put:
 *     tags: [Productos]
 *     summary: Actualizar producto (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Actualizado }
 *       404: { description: No existe }
 *       409: { description: sku duplicado }
 *   delete:
 *     tags: [Productos]
 *     summary: Desactivar producto (solo admin, no lo borra de la base de datos)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Desactivado }
 *       404: { description: No existe }
 */
router.get('/:id', productoController.obtener);
router.put('/:id', auth, rol('admin'), productoController.actualizar);
router.delete('/:id', auth, rol('admin'), productoController.desactivar);

/**
 * @openapi
 * /api/productos/{id}/activar:
 *   put:
 *     tags: [Productos]
 *     summary: Reactivar un producto previamente desactivado (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Activado }
 *       404: { description: No existe }
 */
router.put('/:id/activar', auth, rol('admin'), productoController.activar);

module.exports = router;