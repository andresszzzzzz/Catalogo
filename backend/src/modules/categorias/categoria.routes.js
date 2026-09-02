const express = require('express');
const categoriaController = require('./categoria.controller');
const auth = require('../../middlewares/auth');
const rol = require('../../middlewares/rol');

const router = express.Router();

/**
 * @openapi
 * /api/categorias:
 *   get:
 *     tags: [Categorías]
 *     summary: Listar categorías (sin paginar)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de categorías }
 *   post:
 *     tags: [Categorías]
 *     summary: Crear categoría (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Categoría creada }
 *       400: { description: Validación }
 */
router.get('/', categoriaController.listar);
router.post('/', auth, rol('admin'), categoriaController.crear);

/**
 * @openapi
 * /api/categorias/{slug}:
 *   get:
 *     tags: [Categorías]
 *     summary: Obtener una categoría por slug
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Categoría }
 *       404: { description: No existe }
 */
router.get('/:slug', categoriaController.obtenerPorSlug);

/**
 * @openapi
 * /api/categorias/{id}:
 *   put:
 *     tags: [Categorías]
 *     summary: Actualizar metadatos de categoría (solo admin, no edita el slug)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Actualizada }
 *       404: { description: No existe }
 *   delete:
 *     tags: [Categorías]
 *     summary: Eliminar categoría (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Eliminada }
 *       404: { description: No existe }
 */
router.put('/:id', auth, rol('admin'), categoriaController.actualizar);
router.delete('/:id', auth, rol('admin'), categoriaController.eliminar);

module.exports = router;