/**
 * @fileoverview /services/api.service.js
 * Las 4 funciones con las que se consume CUALQUIER API: get, post, put y delete.
 *
 * Cada una es una funcion suelta (no un objeto con metodos) para que en la vista
 * se lean cortas y directas:
 *
 *   import { get, post, put } from "@/services/api.service";
 *
 *   const productos = await get("/productos");
 *   await post("/productos", { nombre, precio });
 *   await put(`/productos/${id}`, { nombre, precio });
 *
 * Dos detalles importantes:
 *
 * 1. Devuelven directamente el "data" de la respuesta. Axios entrega un objeto
 *    grande ({ data, status, headers... }) del que casi siempre solo interesa
 *    "data"; desempacarlo aqui evita escribir "const { data } = ..." en cada vista.
 *
 * 2. NO llevan try/catch. Si el servidor falla, el error sube hasta quien llamo
 *    a la funcion, que es la vista, y ahi se decide que mensaje mostrar. El
 *    error ya viene ordenado como { status, mensaje, errores } gracias al
 *    interceptor de /plugins/axios.js.
 */
import api from "@/plugins/axios";

/**
 * LEER datos.
 *
 * El segundo argumento es opcional: un objeto plano que axios convierte solo
 * en query string ("?nombre=laptop&categoria=1"). Las claves con valor vacio,
 * null o undefined se pueden dejar tal cual, axios las omite automaticamente.
 * Si no se necesita filtrar, se sigue llamando igual que siempre: get("/productos").
 *
 * @param {string} url - ruta relativa al backend. Ej: "/productos"
 * @param {Object} [params] - filtros a mandar como query string
 * @returns {Promise<any>} lo que respondio el backend
 */
export const get = async (url, params) => {
  const { data } = await api.get(url, { params });
  return data;
};

/**
 * CREAR un registro.
 * @param {string} url - Ej: "/productos"
 * @param {Object} datos - cuerpo que se envia en formato JSON
 * @returns {Promise<any>}
 */
export const post = async (url, datos) => {
  const { data } = await api.post(url, datos);
  return data;
};

/**
 * ACTUALIZAR un registro.
 * El cuerpo es opcional: hay endpoints que solo cambian un estado y les basta
 * con el id que va en la URL. Ej: put(`/productos/${id}/estado`)
 * @param {string} url - Ej: "/productos/123"
 * @param {Object} [datos]
 * @returns {Promise<any>}
 */
export const put = async (url, datos = {}) => {
  const { data } = await api.put(url, datos);
  return data;
};

/**
 * BORRAR un registro.
 *
 * Se llama "del" y no "delete" porque delete es una palabra reservada de
 * JavaScript y no se puede usar como nombre de variable.
 *
 * Ojo: el backend de practica NO borra registros, usa borrado logico
 * (algunos backends usan un PUT para cambiar solo el estado). Esta funcion queda lista
 * para las APIs que si tengan DELETE.
 *
 * @param {string} url - Ej: "/productos/123"
 * @returns {Promise<any>}
 */
export const del = async (url) => {
  const { data } = await api.delete(url);
  return data;
};
