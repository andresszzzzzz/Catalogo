<script setup>
/**
 * /views/CatalogoView.vue
 * PRIMERA vista del sitio ("/catalogo", ver /router/index.js). Publica: no
 * necesita sesion y no la pide.
 *
 * MUY IMPORTANTE (seccion 2 y 4 del pedido): esto NO es una tienda virtual.
 * No hay carrito, no hay "Agregar al carrito", no hay "Comprar" ni checkout.
 * Es solo consulta: buscar, filtrar y mirar. Si en algun momento se necesita
 * agregar compras, es una funcionalidad nueva, no una extension de esta vista.
 *
 * No usa AdminLayout (esa plantilla es solo para las pantallas con sesion):
 * arma su propio q-layout autonomo con cabecera publica y filtros laterales.
 */
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import { productosService } from "@/services/productos.service";
import { categoriasService } from "@/services/categorias.service";
import { proveedoresService } from "@/services/proveedores.service";
import { useNotificar } from "@/composables/useNotificar";
import { useGeneralStore } from "@/store/General";
import logo from "@/assets/logo.svg";

const router = useRouter();
const general = useGeneralStore();
const { notificarError } = useNotificar();

// --- Filtros -----------------------------------------------------------------
const filtros = ref({ nombre: "", categorias: [], proveedores: [] });
const filtrosAbiertos = ref(false); // controla el drawer en pantallas chicas

const categoriasDisponibles = ref([]);
const proveedoresDisponibles = ref([]);

const cargarFiltrosDisponibles = async () => {
  try {
    const [resCategorias, resProveedores] = await Promise.all([
      categoriasService.listar(),
      proveedoresService.listar(),
    ]);
    categoriasDisponibles.value = resCategorias;
    proveedoresDisponibles.value = resProveedores.data;
  } catch (e) {
    // Si esto falla el catalogo igual puede mostrar productos sin filtros,
    // por eso no se bloquea la pantalla: solo se avisa.
    notificarError(e);
  }
};

// --- Productos -----------------------------------------------------------------
const productos = ref([]);
const cargando = ref(false);
const error = ref(null);

const cargarProductos = async () => {
  cargando.value = true;
  error.value = null;

  try {
    const respuesta = await productosService.listar(filtros.value);
    productos.value = respuesta.data.filter((p) => p.activo !== false);
  } catch (e) {
    error.value = e.mensaje;
    notificarError(e);
  } finally {
    cargando.value = false;
  }
};

// Cualquier cambio en los filtros vuelve a pedir la lista al backend.
// El buscador ya trae su propio "debounce" (ver q-input mas abajo), asi que
// no hace falta repetirlo aqui: cuando este watch se dispara, ya paso el
// tiempo de espera.
watch(filtros, cargarProductos, { deep: true });

onMounted(() => {
  cargarProductos();
  cargarFiltrosDisponibles();
});

const irALogin = () => router.push({ name: "login" });

function formatoMoneda(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return "-";
  return numero.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <!-- ============================ CABECERA PUBLICA ========================= -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" class="lt-md" aria-label="Abrir filtros"
          @click="filtrosAbiertos = !filtrosAbiertos" />

        <img :src="logo" alt="Logo" width="30" height="30" class="q-mx-sm" />
        <q-toolbar-title class="text-weight-bold text-subtitle1">
          {{ general.titulo }}
        </q-toolbar-title>

        <q-btn unelevated no-caps color="white" text-color="primary" icon="login" label="Iniciar sesion"
          @click="irALogin" />
      </q-toolbar>

      <!-- Buscador: siempre visible bajo la barra, en todos los tamaños. -->
      <q-toolbar class="bg-white text-dark q-py-sm">
        <q-input v-model="filtros.nombre" class="full-width" dense outlined clearable debounce="400"
          placeholder="Buscar productos...">
          <template #prepend><q-icon name="search" /></template>
        </q-input>
      </q-toolbar>
    </q-header>

    <!-- ============================ FILTROS LATERALES ========================= -->
    <q-drawer v-model="filtrosAbiertos" show-if-above bordered :width="260" class="bg-white">
      <div class="q-pa-md">
        <div class="text-overline text-weight-bold texto-suave">Filtrar por</div>

        <div class="q-mt-md">
          <div class="text-weight-bold q-mb-xs">Categorias</div>
          <div v-if="!categoriasDisponibles.length" class="text-caption texto-suave">
            No hay categorias disponibles
          </div>
          <q-checkbox v-for="categoria in categoriasDisponibles" :key="categoria._id" v-model="filtros.categorias"
            :val="categoria.slug" :label="categoria.nombre" />
        </div>

        <q-separator class="q-my-md" />

        <div>
          <div class="text-weight-bold q-mb-xs">Proveedores</div>
          <div v-if="!proveedoresDisponibles.length" class="text-caption texto-suave">
            No hay proveedores disponibles
          </div>
          <q-checkbox v-for="proveedor in proveedoresDisponibles" :key="proveedor._id" v-model="filtros.proveedores"
            :val="proveedor._id" :label="proveedor.nombre" dense class="block" />
        </div>
      </div>
    </q-drawer>

    <!-- ============================ GRID DE PRODUCTOS ========================= -->
    <q-page-container>
      <q-page class="contenedor-app">
        <q-banner v-if="error" dense class="bg-red-1 text-negative q-mb-md rounded-borders">
          <template #avatar><q-icon name="error_outline" /></template>
          {{ error }}
          <template #action>
            <q-btn flat dense no-caps label="Reintentar" @click="cargarProductos" />
          </template>
        </q-banner>

        <div v-if="cargando" class="row justify-center q-pa-xl">
          <q-spinner color="primary" size="42px" />
        </div>

        <div v-else-if="!productos.length" class="column flex-center q-py-xl">
          <q-icon name="inventory_2" size="64px" color="grey-4" class="q-mb-sm" />
          <span class="empty-title">No hay productos que coincidan con la busqueda</span>
        </div>

        <!--
          Grid responsive (seccion 19 del pedido):
            PC/laptop grande  -> col-3 (4 por fila)
            tablet            -> col-4 / col-6 (2-3 por fila)
            celular           -> col-12 (1 por fila)
        -->
        <div v-else class="row q-col-gutter-md">
          <div v-for="producto in productos" :key="producto._id" class="col-12 col-sm-6 col-md-4 col-lg-3">
            <q-card flat bordered class="tarjeta-producto column full-height">
              <q-img v-if="producto.imagenUrl" :src="producto.imagenUrl" :ratio="4 / 3" fit="contain"
                class="imagen-producto">
                <template #error>
                  <div class="absolute-full flex flex-center bg-grey-2">
                    <q-icon name="image_not_supported" size="32px" color="grey-5" />
                  </div>
                </template>
              </q-img>
              <div v-else class="tarjeta-producto__sin-imagen flex flex-center bg-grey-2">
                <q-icon name="inventory_2" size="32px" color="grey-5" />
              </div>

              <q-card-section class="col">
                <div class="text-subtitle1 text-weight-bold nombre-producto">{{ producto.nombre }}</div>

                <div class="row items-center q-gutter-xs q-mt-xs">
                  <q-badge v-if="producto.categoria" color="primary" outline class="style-text">
                    {{ producto.categoria }}
                  </q-badge>
                  <span v-if="producto.proveedor?.nombre" class="text-caption texto-suave">
                    {{ producto.proveedor.nombre }}
                  </span>
                </div>

                <p v-if="producto.descripcion" class="text-caption texto-suave q-mt-sm q-mb-none">
                  {{ producto.descripcion }}
                </p>
              </q-card-section>

              <q-separator />

              <q-card-section class="row items-center justify-between">
                <div class="text-subtitle1 text-weight-bold text-primary">
                  {{ formatoMoneda(producto.precio) }}
                </div>
                <q-badge v-if="producto.stock !== undefined && producto.stock !== null"
                  :color="producto.stock > 0 ? 'positive' : 'grey-6'">
                  {{ producto.stock > 0 ? `${producto.stock} disponibles` : "Sin stock" }}
                </q-badge>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="scss">
@use "@/styles/variables" as *;

.tarjeta-producto {
  border-radius: 12px;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
  }

  &__sin-imagen {
    height: 160px;
  }
}

.imagen-producto {
  background-color: #f4f4f2;
  padding: 12px;

  :deep(img) {
    padding: 8px;
  }
}

.nombre-producto {
  font-family: $fuente-display;
  font-size: 17px;
  line-height: 1.3;
}

.precio-producto {
  font-family: $fuente-display;
  font-size: 22px;
  font-weight: 600;
  color: var(--color_button);
}
</style>
