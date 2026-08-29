/**
 * @fileoverview /composables/useNotificar.js
 * Composable = funcion que empieza por "use" y encapsula logica reutilizable de
 * la Composition API. Solo se puede llamar DENTRO de <script setup> (o de otro
 * composable), porque usa useQuasar(), que necesita el contexto del componente.
 *
 * Este centraliza como se le avisa al usuario, para que todas las pantallas
 * muestren los mensajes igual.
 */
import { useQuasar } from "quasar";

export function useNotificar() {
  const $q = useQuasar();

  /**
   * Mensaje de exito (verde).
   * @param {string} mensaje - normalmente el "msg" que devuelve el backend
   */
  const notificarOk = (mensaje) => {
    $q.notify({ type: "positive", message: mensaje, icon: "check_circle" });
  };

  /**
   * Mensaje de error (rojo).
   * Recibe el error YA normalizado por el interceptor de /plugins/axios.js:
   *   { status, mensaje, errores: [] }
   *
   * Cuando el backend responde 400 con validaciones, "errores" trae la lista
   * exacta de que fallo y hay que mostrarla: "algo salio mal" no le sirve a nadie.
   *
   * @param {{mensaje: string, errores: string[]}|string} error
   */
  const notificarError = (error) => {
    if (typeof error === "string") {
      $q.notify({ type: "negative", message: error, icon: "error" });
      return;
    }

    const detalle = error?.errores?.length ? error.errores.join(" · ") : "";

    $q.notify({
      type: "negative",
      icon: "error",
      message: error?.mensaje || "Ocurrio un error inesperado",
      caption: detalle,
      timeout: detalle ? 5000 : 3000,
    });
  };

  /**
   * Aviso informativo (azul).
   * @param {string} mensaje
   */
  const notificarInfo = (mensaje) => {
    $q.notify({ type: "info", message: mensaje, icon: "info" });
  };

  return { notificarOk, notificarError, notificarInfo };
}
