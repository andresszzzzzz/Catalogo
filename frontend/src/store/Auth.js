/**
 * @fileoverview /store/Auth.js
 * Store de la SESION: guarda el token y los datos del usuario que inicio sesion.
 *
 * Es el ejemplo perfecto de para que sirve un store global: el token lo necesita
 * el interceptor de axios (para mandarlo en cada peticion), el router (para
 * decidir quien entra) y el layout (para mostrar el nombre y el boton de salir).
 * Tres archivos que no se conocen entre si leyendo el mismo dato.
 *
 * PERSISTENCIA: el tercer argumento de defineStore son las OPCIONES del store.
 * Ahi va "persist: true", que activa pinia-plugin-persistedstate (registrado en
 * main.js). El plugin escribe el estado en localStorage con la clave "auth" y
 * lo vuelve a cargar solo al abrir la aplicacion. Por eso al recargar con F5 la
 * sesion sigue viva sin escribir una sola linea de localStorage a mano.
 *
 * Fijense que este store NO importa services ni axios: quien hace la peticion
 * de login es la vista (LoginView.vue) y luego llama a guardarSesion(). Asi se
 * evita un import circular, porque axios necesita importar este store para
 * sacar el token.
 */
import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore(
  "auth",
  () => {
    // --- state --------------------------------------------------------------

    /** Token JWT que devolvio el backend al iniciar sesion. */
    const token = ref(null);

    /** Datos del usuario ({ _id, nombre, email, rol... }), sin la contraseña. */
    const usuario = ref(null);

    // --- getters ------------------------------------------------------------

    /** ¿Hay sesion abierta? Lo usan el router y el layout. */
    const estaAutenticado = computed(() => !!token.value);

    /** Nombre para mostrar en la barra superior. */
    const nombreUsuario = computed(() => usuario.value?.nombre || "Invitado");

    // --- actions ------------------------------------------------------------

    /**
     * Guarda lo que respondio POST /usuarios/login.
     * @param {{usuario: Object, token: string}} respuesta
     */
    function guardarSesion(respuesta) {
      usuario.value = respuesta.usuario;
      token.value = respuesta.token;
    }

    /**
     * Cierra la sesion. Al dejar los ref en null, el plugin actualiza solo el
     * localStorage: no hay que borrarlo a mano.
     */
    function cerrarSesion() {
      usuario.value = null;
      token.value = null;
    }

    return {
      token,
      usuario,
      estaAutenticado,
      nombreUsuario,
      guardarSesion,
      cerrarSesion,
    };
  },
  {
    // Opciones del store. Sin esta linea, la sesion se perderia al recargar.
    persist: true,
  }
);
