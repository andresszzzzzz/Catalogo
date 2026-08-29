/**
 * @fileoverview /store/General.js
 * Store GLOBAL de interfaz: lo que no pertenece a ningun modelo del backend
 * pero varias pantallas necesitan compartir (menu lateral, titulo, hora de la
 * ultima carga de datos).
 *
 * Escrito con COMPOSITION API ("setup store"): en vez de pasarle a defineStore
 * un objeto con state/getters/actions, se le pasa una FUNCION, igual que el
 * <script setup> de un componente. Dentro se usan las mismas herramientas de
 * siempre, asi que no hay que aprender una sintaxis aparte:
 *
 *     state   -> ref()
 *     getters -> computed()
 *     actions -> funciones normales
 *
 * Y al final se retorna lo que queda publico.
 *
 * Se usa en cualquier componente con:
 *     const general = useGeneralStore();
 *     general.alternarMenu();
 */
import { computed, ref } from "vue";
import { defineStore } from "pinia";

// El primer argumento ("general") es el id unico del store: no se puede repetir.
export const useGeneralStore = defineStore("general", () => {
  // --- state: los datos -----------------------------------------------------

  // El titulo viene del .env para no tenerlo repetido por toda la app.
  const titulo = ref(import.meta.env.VITE_APP_TITULO || "Catalogo de Productos");

  // Si el menu lateral esta abierto (lo controla el boton de hamburguesa).
  const menuAbierto = ref(false);

  // Ultima vez que una pantalla termino de traer datos del backend.
  const ultimaSincronizacion = ref(null);

  // --- getters: datos calculados --------------------------------------------

  /**
   * URL de la API que se esta usando. Util para depurar en clase: si el
   * desarrollador apunta al puerto equivocado, lo ve en el pie del menu.
   */
  const urlApi = computed(() => import.meta.env.VITE_API_URL);

  // --- actions: lo que modifica el estado -----------------------------------

  /** Abre o cierra el menu lateral. */
  function alternarMenu() {
    // Ojo: aqui adentro SI se escribe .value, porque son refs.
    // Desde un componente se escribe general.menuAbierto, sin .value: Pinia lo
    // desempaqueta solo.
    menuAbierto.value = !menuAbierto.value;
  }

  /** Registra el momento de la ultima carga de datos exitosa. */
  function marcarSincronizacion() {
    ultimaSincronizacion.value = new Date();
  }

  /**
   * Todo lo que se retorna queda publico en el store. Lo que NO se retorna
   * queda privado, visible solo aqui adentro: esa es la ventaja de esta forma
   * frente a state/getters/actions.
   *
   * Detalle a tener en cuenta: en los setup store NO existe store.$reset().
   * Si se necesita, se escribe una funcion propia que devuelva los ref a su
   * valor inicial y se retorna como una accion mas.
   */
  return {
    titulo,
    menuAbierto,
    ultimaSincronizacion,
    urlApi,
    alternarMenu,
    marcarSincronizacion,
  };
});
