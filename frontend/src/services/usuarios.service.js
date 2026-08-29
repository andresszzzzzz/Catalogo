/**
 * @fileoverview /services/usuarios.service.js
 * CRUD de usuarios del sistema administrativo. La contraseña solo viaja en
 * "crear" (o en "actualizar" si el usuario decide cambiarla); el backend es
 * quien la hashea, este frontend nunca la procesa ni la muestra de vuelta.
 *
 * Contrato asumido (no definitivo, ver seccion 21 del pedido):
 *   GET    /usuarios        -> listar
 *   GET    /usuarios/:id    -> uno por id
 *   POST   /usuarios        -> crear
 *   PUT    /usuarios/:id    -> actualizar
 *   DELETE /usuarios/:id    -> eliminar
 */
import { get, post, put, del } from "./api.service";

const RECURSO = "/usuarios";

export const usuariosService = {
  listar: (filtros = {}) => get(RECURSO, filtros),
  obtener: (id) => get(`${RECURSO}/${id}`),
  crear: (datos) => post(RECURSO, datos),
  actualizar: (id, datos) => put(`${RECURSO}/${id}`, datos),
  eliminar: (id) => del(`${RECURSO}/${id}`),
};
