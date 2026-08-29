<script setup>
/**
 * COMPONENTE REUTILIZABLE 1/2 — /components/Encabezados/EncabezadoPagina.vue
 *
 * Encabezado estandar de cualquier pantalla: icono + titulo + subtitulo y un
 * espacio libre a la derecha para los botones de accion.
 *
 * ¿Por que vive en /components y no en /views?
 * Porque NO conoce ninguna ruta ni ningun dato del backend. Recibe todo por
 * props y no decide nada: eso lo hace reutilizable. Una vista, en cambio, si
 * sabe que datos pedir y a que store llamar.
 *
 * Uso:
 *   <EncabezadoPagina titulo="Productos" subtitulo="Catalogo interno" icono="inventory_2">
 *     <template #acciones>
 *       <q-btn label="Nuevo" @click="abrir" />
 *     </template>
 *   </EncabezadoPagina>
 */

// defineProps: contrato de entrada del componente. Tipar y marcar los
// obligatorios evita el 90% de los errores de "por que no se ve nada".
defineProps({
  titulo: {
    type: String,
    required: true,
  },
  subtitulo: {
    type: String,
    default: "",
  },
  icono: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <header class="encabezado-pagina">
    <div class="row items-center justify-between q-col-gutter-md">
      <!-- Bloque izquierdo: identidad de la pantalla -->
      <div class="col-12 col-sm">
        <div class="row items-center no-wrap">
          <q-avatar
            v-if="icono"
            square
            size="44px"
            color="primary"
            text-color="white"
            class="q-mr-md encabezado-pagina__icono"
          >
            <q-icon :name="icono" size="24px" />
          </q-avatar>

          <div>
            <!-- style-text capitaliza: es la convencion de titulos de la guia -->
            <h1 class="titulo-vista style-text">{{ titulo }}</h1>
            <p v-if="subtitulo" class="encabezado-pagina__subtitulo">
              {{ subtitulo }}
            </p>
          </div>
        </div>
      </div>

      <!-- Bloque derecho: SLOT. El componente no sabe que botones van, los pone
           quien lo usa. Es lo que lo vuelve reutilizable en cualquier pantalla. -->
      <div class="col-12 col-sm-auto">
        <slot name="acciones" />
      </div>
    </div>

    <!-- La linea verde bajo el titulo, marca de la casa de REPFORA.
         Es un <hr> y no un q-separator porque va coloreado y al 83% de ancho. -->
    <hr class="linea-titulo" />
  </header>
</template>

<style scoped lang="scss">
// "scoped" = estos estilos solo aplican a ESTE componente, no se escapan.
.encabezado-pagina {
  margin-bottom: 24px;

  &__icono {
    border-radius: 10px;
  }

  // El titulo usa .titulo-vista y la linea usa .linea-titulo, las dos globales
  // (ver /styles/main.scss): son la convencion de TODAS las pantallas.

  &__subtitulo {
    font-size: 14px;
    color: #616161;
    margin: 4px 0 0;
  }
}
</style>
