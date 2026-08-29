/**
 * @fileoverview /services/productos.service.js
 * Espejo exacto de los endpoints de productos. El mismo "listar" lo usan dos
 * pantallas muy distintas: el catalogo publico (solo lectura, con filtros) y
 * la tabla del CRUD administrativo. No hay dos funciones porque el filtro,
 * cuando va vacio, simplemente no manda esa clave (ver api.service.get).
 *
 * Contrato asumido (no definitivo, ver seccion 5 y 21 del pedido):
 *   GET    /productos?nombre=&categoria=&proveedor=  -> listar / filtrar
 *   GET    /productos/:id                            -> uno por id
 *   POST   /productos                                -> crear
 *   PUT    /productos/:id                             -> actualizar
 *   DELETE /productos/:id                             -> eliminar
 *
 * "categoria" y "proveedor" se mandan como listas de id separadas por coma
 * (categoria=1,2) porque el catalogo permite marcar varias casillas a la vez.
 * Si el backend real espera otro formato (por ejemplo categoria[]=1&categoria[]=2),
 * este es el UNICO lugar que hay que tocar.
 */
import { get, post, put, del } from "./api.service";

const RECURSO = "/productos";

/**
 * Arma el objeto de filtros que espera el backend a partir de los filtros
 * "crudos" de la pantalla (arrays de ids marcados, texto de busqueda...).
 * @param {{nombre?: string, categorias?: string[], proveedores?: string[]}} filtros
 */
function normalizarFiltros({ nombre, categorias, proveedores } = {}) {
  return {
    nombre: nombre?.trim() || undefined,
    categoria: categorias?.length ? categorias.join(",") : undefined,
    proveedor: proveedores?.length ? proveedores.join(",") : undefined,
  };
}

export const productosService = {
  listar: (filtros = {}) => get(RECURSO, normalizarFiltros(filtros)),
  obtener: (id) => get(`${RECURSO}/${id}`),
  crear: (datos) => post(RECURSO, datos),
  actualizar: (id, datos) => put(`${RECURSO}/${id}`, datos),
  eliminar: (id) => del(`${RECURSO}/${id}`),
};
