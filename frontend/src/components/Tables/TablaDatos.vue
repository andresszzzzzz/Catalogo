<script setup>
/**
 * COMPONENTE REUTILIZABLE 2/2 — /components/Tables/TablaDatos.vue
 *
 * Envoltorio sobre <q-table> con las decisiones ya tomadas: buscador, paginado,
 * estado "cargando" y mensaje cuando no hay datos. Las dos pantallas del CRUD
 * (productos, categorias, proveedores, usuarios) usan este mismo componente.
 *
 * Sirve para cualquier listado porque no sabe QUE esta pintando: recibe filas y
 * columnas por props y delega las celdas especiales en slots.
 */
import { computed, ref, useSlots } from "vue";

defineProps({
  /** Array de objetos a mostrar (las filas). */
  filas: {
    type: Array,
    required: true,
  },
  /** Definicion de columnas de Quasar: { name, label, field, align, sortable }. */
  columnas: {
    type: Array,
    required: true,
  },
  /** Muestra la barra de progreso mientras llegan los datos del backend. */
  cargando: {
    type: Boolean,
    default: false,
  },
  /**
   * Campo unico de cada fila. En Mongo siempre es "_id".
   * Sin esto Quasar no sabe distinguir una fila de otra al ordenar o paginar.
   */
  filaClave: {
    type: String,
    default: "_id",
  },
  /** Texto cuando la consulta no devolvio nada. */
  mensajeVacio: {
    type: String,
    default: "No hay registros para mostrar",
  },
});

// Estado propio del componente: el texto del buscador. Es LOCAL, no va al store,
// porque a ninguna otra pantalla le importa lo que se escribio aqui.
const busqueda = ref("");

// Slots que este componente ya resuelve por su cuenta; el resto se reenvia a
// q-table tal cual (ver el <template v-for> de abajo).
const slotsPropios = ["default", "top", "no-data", "acciones-tabla"];

const slots = useSlots();

const slotsReenviados = computed(() =>
  Object.keys(slots).filter((nombre) => !slotsPropios.includes(nombre))
);
</script>

<template>
  <q-table
    :rows="filas"
    :columns="columnas"
    :row-key="filaClave"
    :loading="cargando"
    :filter="busqueda"
    :rows-per-page-options="[10, 25, 50, 0]"
    :no-data-label="mensajeVacio"
    no-results-label="Ningun registro coincide con la busqueda"
    loading-label="Consultando al servidor..."
    rows-per-page-label="Registros por pagina"
    flat
    bordered
    class="tabla-datos my-sticky-header-table"
  >
    <!-- Barra superior de la tabla: buscador + acciones extra de quien la use -->
    <template #top>
      <div class="row full-width items-center q-col-gutter-sm">
        <div class="col-12 col-sm-5">
          <q-input
            v-model="busqueda"
            dense
            outlined
            clearable
            debounce="300"
            placeholder="Buscar..."
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <q-space class="gt-xs" />

        <div class="col-12 col-sm-auto">
          <!-- Slot con nombre propio para no chocar con los slots de q-table -->
          <slot name="acciones-tabla" />
        </div>
      </div>
    </template>

    <!--
      REENVIO DE SLOTS (patron avanzado, vale la pena entenderlo):
      recorre los slots que le pasaron a TablaDatos y los reenvia tal cual a
      q-table. Gracias a esto, desde la vista se puede escribir
      <template #body-cell-acciones="celda"> como si se estuviera usando q-table
      directamente, sin que este componente tenga que declarar cada slot posible.
    -->
    <template
      v-for="nombre in slotsReenviados"
      :key="nombre"
      #[nombre]="datosDelSlot"
    >
      <slot :name="nombre" v-bind="datosDelSlot || {}" />
    </template>

    <!-- Estado vacio: una tabla en blanco confunde; hay que decir que pasa.
         Icono grande en gris claro y texto apagado, como en la guia. -->
    <template #no-data>
      <div class="full-width column flex-center q-py-xl">
        <q-icon name="inbox" size="64px" color="grey-4" class="q-mb-sm" />
        <span class="empty-title">{{ mensajeVacio }}</span>
      </div>
    </template>
  </q-table>
</template>

<style scoped lang="scss">
// La cabecera fija y las tipografias de la tabla vienen de la clase global
// .my-sticky-header-table (ver /styles/main.scss). Aqui solo lo propio.
.tabla-datos {
  border-radius: 8px;
}
</style>
