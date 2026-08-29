<script setup>
/**
 * /views/CategoriasView.vue
 * CRUD completo de categorias. Estas categorias son las mismas que despues
 * aparecen en el selector de ProductosView y en el filtro lateral del
 * catalogo publico (CatalogoView): un solo origen de datos, sin duplicar
 * listas escritas a mano en ningun lado.
 */
import { computed, onMounted, ref } from "vue";

import EncabezadoPagina from "@/components/Encabezados/EncabezadoPagina.vue";
import TablaDatos from "@/components/Tables/TablaDatos.vue";

import { categoriasService } from "@/services/categorias.service";
import { useGeneralStore } from "@/store/General";
import { useNotificar } from "@/composables/useNotificar";
import { useConfirmar } from "@/composables/useConfirmar";
import { requerido, minimo } from "@/utils/reglas";

const general = useGeneralStore();
const { notificarOk, notificarError } = useNotificar();
const { confirmar } = useConfirmar();

const columnas = [
  { name: "nombre", label: "Nombre", field: "nombre", align: "left", sortable: true },
  { name: "descripcion", label: "Descripcion", field: "descripcion", align: "left" },
  { name: "acciones", label: "Acciones", field: "acciones", align: "right" },
];

const categorias = ref([]);
const cargando = ref(false);
const error = ref(null);

const cargar = async () => {
  cargando.value = true;
  error.value = null;

  try {
    categorias.value = await categoriasService.listar();
    general.marcarSincronizacion();
  } catch (e) {
    error.value = e.mensaje;
    notificarError(e);
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);

const dialogo = ref(false);
const guardando = ref(false);
const editando = ref(null);
const formularioRef = ref(null);

const formularioVacio = () => ({ nombre: "", descripcion: "" });
const formulario = ref(formularioVacio());

const esEdicion = computed(() => editando.value !== null);

const abrirCreacion = () => {
  editando.value = null;
  formulario.value = formularioVacio();
  dialogo.value = true;
};

const abrirEdicion = (categoria) => {
  editando.value = categoria;
  formulario.value = {
    nombre: categoria.nombre,
    descripcion: categoria.descripcion || "",
  };
  dialogo.value = true;
};

const guardar = async () => {
  guardando.value = true;

  try {
    const datos = {
      nombre: formulario.value.nombre.trim(),
      descripcion: formulario.value.descripcion.trim(),
    };

    const respuesta = esEdicion.value
      ? await categoriasService.actualizar(editando.value._id, datos)
      : await categoriasService.crear(datos);

    notificarOk(respuesta?.msg || "Categoria guardada");
    dialogo.value = false;
    await cargar();
  } catch (e) {
    notificarError(e);
  } finally {
    guardando.value = false;
  }
};

const eliminar = async (categoria) => {
  const aceptado = await confirmar({
    titulo: "Eliminar categoria",
    mensaje: `¿Confirmas eliminar la categoria "${categoria.nombre}"? Los productos que la usan quedaran sin categoria.`,
    textoOk: "Eliminar",
    color: "negative",
  });

  if (!aceptado) return;

  try {
    const respuesta = await categoriasService.eliminar(categoria._id);
    notificarOk(respuesta?.msg || "Categoria eliminada");
    await cargar();
  } catch (e) {
    notificarError(e);
  }
};
</script>

<template>
  <q-page>
    <div class="contenedor-app">
      <EncabezadoPagina
        titulo="Categorias"
        subtitulo="Clasificacion de los productos del catalogo"
        icono="category"
      >
        <template #acciones>
          <q-btn
            unelevated no-caps color="primary" icon="add"
            label="Nueva categoria" @click="abrirCreacion"
          />
        </template>
      </EncabezadoPagina>

      <q-banner v-if="error" dense class="bg-red-1 text-negative q-mb-md rounded-borders">
        <template #avatar><q-icon name="error_outline" /></template>
        {{ error }}
        <template #action>
          <q-btn flat dense no-caps label="Reintentar" @click="cargar" />
        </template>
      </q-banner>

      <TablaDatos
        :filas="categorias"
        :columnas="columnas"
        :cargando="cargando"
        mensaje-vacio="Aun no hay categorias registradas"
      >
        <template #body-cell-acciones="celda">
          <q-td :props="celda" class="text-right">
            <q-btn
              flat dense round size="sm" icon="edit" color="primary"
              class="action-secondary" @click="abrirEdicion(celda.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              flat dense round size="sm" icon="delete" color="negative"
              class="action-secondary" @click="eliminar(celda.row)"
            >
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </TablaDatos>
    </div>

    <q-dialog v-model="dialogo" persistent @show="formularioRef?.resetValidation()">
      <q-card class="dialog-card">
        <q-card-section class="bg-primary text-white row items-center no-wrap q-px-lg q-py-md">
          <q-icon :name="esEdicion ? 'edit' : 'add'" size="28px" class="q-mr-md" />
          <div>
            <div class="dialog-title">{{ esEdicion ? "Editar categoria" : "Nueva categoria" }}</div>
            <div class="text-caption text-green-2">Clasificacion de productos</div>
          </div>
          <q-space />
          <q-btn v-close-popup flat round dense icon="close" color="white" />
        </q-card-section>

        <q-form ref="formularioRef" greedy @submit="guardar">
          <q-card-section class="q-gutter-md">
            <q-input
              v-model="formulario.nombre" outlined dense label="Nombre *"
              :rules="[requerido('El nombre'), minimo(2, 'El nombre')]" lazy-rules
            />
            <q-input
              v-model="formulario.descripcion" outlined dense type="textarea"
              label="Descripcion" hint="Opcional" autogrow
            />
          </q-card-section>

          <q-card-actions align="right" class="q-px-md q-pb-md">
            <q-btn v-close-popup flat no-caps label="Cancelar" color="dark" class="btn-cancel" />
            <q-btn
              unelevated no-caps type="submit" color="primary" class="btn-ok"
              :label="esEdicion ? 'Guardar cambios' : 'Registrar categoria'"
              :loading="guardando"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>
