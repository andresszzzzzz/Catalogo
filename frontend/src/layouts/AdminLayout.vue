<script setup>
/**
 * /layouts/AdminLayout.vue
 * Plantilla UNICA de la aplicacion, armada con el Layout Builder de Quasar:
 * https://quasar.dev/layout-builder
 *
 * El Builder es una pagina donde se arman visualmente la barra, el menu y el
 * pie, y devuelve este esqueleto ya hecho:
 *
 *   <q-layout view="...">
 *     <q-header>            barra superior
 *     <q-drawer>            menu lateral
 *     <q-page-container>    <- aqui entra la vista de la ruta activa
 *   </q-layout>
 *
 * Un layout es el marco fijo de la pantalla. Todas las vistas se pintan en su
 * <router-view>, asi que al navegar la barra y el menu NO se vuelven a montar.
 * Sin layouts habria que repetir este menu dentro de cada vista.
 *
 * El login NO usa este layout: es una pantalla suelta, sin barra ni menu,
 * porque sus enlaces llevarian a sitios donde todavia no se puede entrar.
 *
 * Hoy el proyecto tiene un solo layout. La carpeta /layouts sigue teniendo
 * sentido para el dia que una seccion necesite otro marco: se crea otro archivo
 * aqui y se cuelgan de el sus rutas.
 */
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useGeneralStore } from "@/store/General";
import { useAuthStore } from "@/store/Auth";
import { useNotificar } from "@/composables/useNotificar";
import { formatDateTime } from "@/utils/formatDate";
import logo from "@/assets/logo.svg";

const general = useGeneralStore();
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const { notificarInfo } = useNotificar();

/**
 * Cierra la sesion: limpia el store (y con el, el localStorage, porque el store
 * es persistido) y devuelve al login.
 */
const salir = () => {
  auth.cerrarSesion();
  notificarInfo("Sesion cerrada");
  router.push({ name: "catalogo" });
};

/**
 * Opciones del menu lateral.
 * "name" es el nombre de la ruta declarada en /router/index.js. Se enlaza por
 * nombre y no por URL: si mañana cambia el path, el menu sigue funcionando.
 * Para agregar un modulo nuevo, se suma una linea aqui.
 */
const opcionesMenu = [
  { name: "productos", titulo: "Productos", icono: "inventory_2" },
  { name: "categorias", titulo: "Categorias", icono: "category" },
  { name: "proveedores", titulo: "Proveedores", icono: "local_shipping" },
  { name: "usuarios", titulo: "Usuarios", icono: "manage_accounts" },
];

// Titulo de la seccion actual, leido del meta de la ruta activa.
const tituloSeccion = computed(() => route.meta?.titulo || "Panel");
</script>

<template>
  <!--
    La prop "view" es lo que configura el Layout Builder. Son 3 grupos de 3
    letras: fila de la barra superior, fila del contenido y fila del pie. En
    cada grupo, las letras son (drawer izquierdo, elemento, drawer derecho).

      MAYUSCULA -> ese elemento se queda con todo el ancho de la fila
      minuscula -> le cede el espacio al de al lado

    Con "lHh Lpr lFf": la H manda, o sea la barra superior ocupa todo el ancho
    de lado a lado, y la L hace que el menu lateral quede debajo de ella.
  -->
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Abrir menu"
          @click="general.alternarMenu()"
        />

        <q-toolbar-title class="text-weight-bold text-subtitle1">
          {{ tituloSeccion }}
        </q-toolbar-title>

        <!-- Datos de la sesion: salen del store Auth, que sobrevive al F5. -->
        <template v-if="auth.estaAutenticado">
          <q-btn
            flat dense no-caps icon="storefront" label="Ver catalogo" class="gt-xs q-mr-sm"
            :to="{ name: 'catalogo' }"
          />

          <div class="text-caption q-mr-sm gt-xs">
            {{ auth.nombreUsuario }}
          </div>

          <q-btn flat dense round icon="logout" aria-label="Cerrar sesion" @click="salir">
            <q-tooltip>Cerrar sesion</q-tooltip>
          </q-btn>
        </template>

        <!-- Sin sesion (por ejemplo leyendo la pagina de estructura) -->
        <q-btn
          v-else
          flat
          dense
          no-caps
          icon="login"
          label="Entrar"
          :to="{ name: 'login' }"
        />
      </q-toolbar>
    </q-header>

    <!-- show-if-above: en pantallas grandes el menu queda fijo y visible;
         en movil se oculta y lo abre el boton de hamburguesa. -->
    <q-drawer
      v-model="general.menuAbierto"
      show-if-above
      bordered
      :width="248"
      class="bg-white"
    >
      <div class="q-pa-md row items-center no-wrap">
        <!-- El logo se importa desde /assets para que Vite lo versione. -->
        <img :src="logo" alt="Logo" width="34" height="34" class="q-mr-sm" />
        <div class="text-weight-bold">{{ general.titulo }}</div>
      </div>

      <q-separator />

      <q-list padding>
        <q-item-label header class="text-uppercase text-caption text-weight-bold">
          Menu
        </q-item-label>

        <q-item
          v-for="opcion in opcionesMenu"
          :key="opcion.name"
          v-ripple
          clickable
          class="enlace-menu"
          :to="{ name: opcion.name }"
        >
          <q-item-section avatar>
            <q-icon :name="opcion.icono" />
          </q-item-section>
          <q-item-section>{{ opcion.titulo }}</q-item-section>
        </q-item>
      </q-list>

      <!--
        Pie del menu. Lee del store General, que es justamente para eso: guardar
        informacion que varias pantallas comparten. Cualquier vista que termine
        de cargar datos llama a general.marcarSincronizacion() y la hora se
        actualiza aqui sola.
      -->
      <div class="absolute-bottom q-pa-md text-caption texto-suave">
        <div>
          <q-icon name="dns" size="14px" class="q-mr-xs" />
          {{ general.urlApi }}
        </div>
        <div v-if="general.ultimaSincronizacion" class="q-mt-xs">
          <q-icon name="schedule" size="14px" class="q-mr-xs" />
          {{ formatDateTime(general.ultimaSincronizacion) }}
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <!-- Aqui entra la vista de la ruta activa: productos, categorias, proveedores... -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>
