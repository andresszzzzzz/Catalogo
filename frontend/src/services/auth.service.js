/**
 * @fileoverview /services/auth.service.js
 * Autenticacion contra el backend. Un solo metodo hoy (login), pero vive en su
 * propio archivo para que cuando el backend crezca (recuperar contraseña,
 * refrescar token...) no haya que tocar la vista de Login, solo este archivo.
 *
 * OJO: "/auth/login" es un endpoint de EJEMPLO, no el contrato definitivo del
 * backend (ver seccion 6 y 21 del pedido). Si el backend real usa otra ruta
 * (por ejemplo "/usuarios/login"), este es el UNICO lugar que hay que cambiar.
 */
import { post } from "./api.service";

const RECURSO = "/auth";

export const authService = {
  /**
   * Inicia sesion.
   * @param {{email: string, password: string}} credenciales
   * @returns {Promise<{usuario: Object, token: string}>}
   */
  login: (credenciales) => post(`${RECURSO}/login`, credenciales),
};
