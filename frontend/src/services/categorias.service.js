/**
 * @fileoverview /services/categorias.service.js
 * Las categorias se usan en dos sitios: el CRUD administrativo y el filtro
 * lateral del catalogo publico. Por eso "listar" no exige sesion iniciada: la
 * proteccion real de escritura (crear/actualizar/eliminar) la impone el
 * backend con el token, esta capa solo refleja las rutas.
 *
 * Contrato asumido (no definitivo, ver seccion 21 del pedido):
 *   GET    /categorias        -> listar (publico, alimenta el filtro del catalogo)
 *   GET    /categorias/:id    -> una por id
 *   POST   /categorias        -> crear
 *   PUT    /categorias/:id    -> actualizar
 *   DELETE /categorias/:id    -> eliminar
 */
import { get, post, put, del } from "./api.service";

const RECURSO = "/categorias";

export const categoriasService = {
  listar: (filtros = {}) => get(RECURSO, filtros),
  obtener: (id) => get(`${RECURSO}/${id}`),
  crear: (datos) => post(RECURSO, datos),
  actualizar: (id, datos) => put(`${RECURSO}/${id}`, datos),
  eliminar: (id) => del(`${RECURSO}/${id}`),
};
