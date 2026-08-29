/**
 * @fileoverview /utils/reglas.js
 * REGLAS DE VALIDACION PARA LOS FORMULARIOS (prop :rules de Quasar).
 *
 * Como funcionan las rules de Quasar:
 *   - Se pasan como un ARRAY de funciones a <q-input :rules="[...]">.
 *   - Cada funcion recibe el valor del campo y debe devolver:
 *       true            -> el campo es valido
 *       "texto"         -> el campo es invalido y ese texto se pinta en rojo
 *   - Al hacer <q-form @submit="..."> Quasar ejecuta TODAS las reglas y solo
 *     dispara el submit si todas pasan. Tambien se pueden ejecutar a mano con
 *     formulario.value.validate().
 *
 * Aqui se escriben como "fabricas": funciones que devuelven la regla ya
 * personalizada con el nombre del campo. Asi el mensaje de error es especifico
 * ("El codigo es obligatorio") sin duplicar codigo en cada formulario.
 *
 * IMPORTANTE: estas validaciones son de EXPERIENCIA DE USUARIO (respuesta
 * inmediata, sin ir al servidor). NO reemplazan las del backend: el servidor
 * siempre vuelve a validar, porque el navegador se puede manipular.
 */
import { validateEmail } from "./validateEmail";

/**
 * El campo no puede ir vacio.
 * @param {string} campo - nombre visible del campo, usado en el mensaje
 * @returns {(v: any) => true|string} regla lista para :rules
 */
export const requerido =
  (campo = "Este campo") =>
  (v) =>
    (v !== null && v !== undefined && String(v).trim() !== "") ||
    `${campo} es obligatorio`;

/**
 * Formato de correo valido. Reutiliza la funcion pura de /utils/validateEmail.js.
 * @returns {(v: string) => true|string}
 */
export const esEmail =
  () =>
  (v) =>
    validateEmail(v) || "El email no es valido";

/**
 * Longitud minima de texto.
 * @param {number} min - cantidad minima de caracteres
 * @param {string} campo
 * @returns {(v: string) => true|string}
 */
export const minimo =
  (min, campo = "Este campo") =>
  (v) =>
    String(v ?? "").trim().length >= min ||
    `${campo} debe tener al menos ${min} caracteres`;

/**
 * Longitud maxima de texto.
 * @param {number} max
 * @param {string} campo
 * @returns {(v: string) => true|string}
 */
export const maximo =
  (max, campo = "Este campo") =>
  (v) =>
    String(v ?? "").trim().length <= max ||
    `${campo} no puede superar los ${max} caracteres`;

/**
 * Solo digitos (documentos, telefonos). Ojo: un documento se maneja como TEXTO,
 * no como number, para no perder ceros a la izquierda.
 * @returns {(v: string) => true|string}
 */
export const soloNumeros =
  () =>
  (v) =>
    /^\d+$/.test(String(v ?? "").trim()) || "Solo se permiten numeros";

/**
 * Numero entero estrictamente mayor que un minimo.
 * Espeja la validacion del backend: check("duracion").isInt({ min: 1 })
 * @param {number} min
 * @param {string} campo
 * @returns {(v: any) => true|string}
 */
export const enteroMayorA =
  (min, campo = "El valor") =>
  (v) => {
    const n = Number(v);
    return (
      (Number.isInteger(n) && n > min) ||
      `${campo} debe ser un numero entero mayor a ${min}`
    );
  };

/**
 * Obliga a elegir una opcion en un q-select.
 * @param {string} campo
 * @returns {(v: any) => true|string}
 */
export const seleccionRequerida =
  (campo = "Este campo") =>
  (v) =>
    (v !== null && v !== undefined && v !== "") || `Debe seleccionar ${campo}`;

/**
 * El valor debe ser igual a otro. Se usa para "confirmar contraseña".
 *
 * Ojo con como se pasa el valor esperado: hay que envolverlo en una funcion
 * (() => formulario.password) y no pasar el texto directo, porque las reglas se
 * arman una sola vez y el valor de referencia cambia mientras el usuario
 * escribe.
 *
 * @param {() => any} obtenerEsperado - funcion que devuelve el valor a comparar
 * @param {string} mensaje
 * @returns {(v: any) => true|string}
 */
export const igualA =
  (obtenerEsperado, mensaje = "Los valores no coinciden") =>
  (v) =>
    v === obtenerEsperado() || mensaje;
