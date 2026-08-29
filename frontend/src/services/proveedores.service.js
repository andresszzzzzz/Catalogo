/**
 * @fileoverview /services/proveedores.service.js
 * Espejo exacto de los endpoints de proveedores. Si el backend cambia una
 * ruta, se ajusta aqui y ninguna vista se entera.
 *
 * Contrato asumido (no definitivo, ver seccion 21 del pedido):
 *   GET    /proveedores        -> listar (admite ?nombre= para buscar)
 *   GET    /proveedores/:id    -> uno por id
 *   POST   /proveedores        -> crear
 *   PUT    /proveedores/:id    -> actualizar
 *   DELETE /proveedores/:id    -> eliminar
 */
import { get, post, put, del } from "./api.service";

const RECURSO = "/proveedores";

export const proveedoresService = {
  listar: (filtros = {}) => get(RECURSO, filtros),
  obtener: (id) => get(`${RECURSO}/${id}`),
  crear: (datos) => post(RECURSO, datos),
  actualizar: (id, datos) => put(`${RECURSO}/${id}`, datos),
  eliminar: (id) => del(`${RECURSO}/${id}`),
};
