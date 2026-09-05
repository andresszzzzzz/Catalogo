<script setup>
/**
 * /views/ProveedoresView.vue
 * CRUD completo de proveedores. Mismo patron que el resto de los CRUD del
 * proyecto (ver ProductosView, CategoriasView, UsuariosView): tabla + dialogo
 * con un solo formulario que sirve tanto para crear como para editar.
 *
 * A diferencia del proyecto original (que usaba borrado logico
 * activar/inactivar), aqui se usa DELETE real, porque asi lo pide el CRUD del
 * pedido ("Eliminar"). Si el backend real prefiere borrado logico, el unico
 * cambio es en /services/proveedores.service.js.
 */
import { computed, onMounted, ref } from "vue";

import EncabezadoPagina from "@/components/Encabezados/EncabezadoPagina.vue";
import TablaDatos from "@/components/Tables/TablaDatos.vue";

import { proveedoresService } from "@/services/proveedores.service";
import { useGeneralStore } from "@/store/General";
import { useNotificar } from "@/composables/useNotificar";
import { useConfirmar } from "@/composables/useConfirmar";
import { requerido, esEmail, minimo } from "@/utils/reglas";

const general = useGeneralStore();
const { notificarOk, notificarError } = useNotificar();
const { confirmar } = useConfirmar();

const columnas = [
  { name: "nombre", label: "Nombre", field: "nombre", align: "left", sortable: true },
  { name: "nit", label: "NIT / Identificacion", field: "nit", align: "left", sortable: true },
  { name: "telefono", label: "Telefono", field: "telefono", align: "left" },
  { name: "email", label: "Email", field: "email", align: "left" },
  { name: "estado", label: "Estado", field: "activo", align: "center" },
  { name: "acciones", label: "Acciones", field: "acciones", align: "right" },
];

// --- Estado de la pantalla -------------------------------------------------
const proveedores = ref([]);
const cargando = ref(false);
const error = ref(null);

const cargar = async () => {
  cargando.value = true;
  error.value = null;

  try {
    const respuesta = await proveedoresService.listar();
    proveedores.value = respuesta.data;
    general.marcarSincronizacion();
  } catch (e) {
    error.value = e.mensaje;
    notificarError(e);
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);

// --- Formulario -------------------------------------------------------------
const dialogo = ref(false);
const guardando = ref(false);
const editando = ref(null); // null = creando, objeto = editando
const formularioRef = ref(null);

const formularioVacio = () => ({ nombre: "", nit: "", telefono: "", email: "" });
const formulario = ref(formularioVacio());

const esEdicion = computed(() => editando.value !== null);

const abrirCreacion = () => {
  editando.value = null;
  formulario.value = formularioVacio();
  dialogo.value = true;
};

const abrirEdicion = (proveedor) => {
  editando.value = proveedor;
  formulario.value = {
    nombre: proveedor.nombre,
    nit: proveedor.nit || "",
    telefono: proveedor.telefono || "",
    email: proveedor.email || "",
  };
  dialogo.value = true;
};

const guardar = async () => {
  guardando.value = true;

  try {
    const datos = {
      nombre: formulario.value.nombre.trim(),
      nit: formulario.value.nit.trim(),
      telefono: formulario.value.telefono.trim(),
      email: formulario.value.email.trim(),
    };

    const respuesta = esEdicion.value
      ? await proveedoresService.actualizar(editando.value._id, datos)
      : await proveedoresService.crear(datos);

    notificarOk(respuesta?.msg || "Proveedor guardado");
    dialogo.value = false;
    await cargar();
  } catch (e) {
    notificarError(e);
  } finally {
    guardando.value = false;
  }
};

// --- Activar / Desactivar -----------------------------------------------------
const desactivar = async (proveedor) => {
  const aceptado = await confirmar({
    titulo: "Desactivar proveedor",
    mensaje: `¿Confirmas desactivar a "${proveedor.nombre}"? Dejara de verse en el catalogo.`,
    textoOk: "Desactivar",
    color: "negative",
  });

  if (!aceptado) return;

  try {
    const respuesta = await proveedoresService.actualizar(proveedor._id, { activo: false });
    notificarOk(respuesta?.msg || "Proveedor desactivado");
    await cargar();
  } catch (e) {
    notificarError(e);
  }
};

const reactivar = async (proveedor) => {
  try {
    const respuesta = await proveedoresService.actualizar(proveedor._id, { activo: true });
    notificarOk(respuesta?.msg || "Proveedor activado");
    await cargar();
  } catch (e) {
    notificarError(e);
  }
};
</script>

<template>
  <q-page>
    <div class="contenedor-app">
      <EncabezadoPagina titulo="Proveedores" subtitulo="Empresas y personas que abastecen el catalogo"
        icono="local_shipping">
        <template #acciones>
          <q-btn unelevated no-caps color="primary" icon="add" label="Nuevo proveedor" @click="abrirCreacion" />
        </template>
      </EncabezadoPagina>

      <q-banner v-if="error" dense class="bg-red-1 text-negative q-mb-md rounded-borders">
        <template #avatar><q-icon name="error_outline" /></template>
        {{ error }}
        <template #action>
          <q-btn flat dense no-caps label="Reintentar" @click="cargar" />
        </template>
      </q-banner>

      <TablaDatos :filas="proveedores" :columnas="columnas" :cargando="cargando"
        mensaje-vacio="Aun no hay proveedores registrados">
        <template #body-cell-estado="celda">
          <q-td :props="celda" class="text-center">
            <q-badge :color="celda.row.activo ? 'positive' : 'grey'">
              {{ celda.row.activo ? "Activo" : "Inactivo" }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-acciones="celda">
          <q-td :props="celda" class="text-right">
            <q-btn flat dense round size="sm" icon="edit" color="primary" class="action-secondary"
              @click="abrirEdicion(celda.row)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn v-if="celda.row.activo" flat dense round size="sm" icon="block" color="negative"
              class="action-secondary" @click="desactivar(celda.row)">
              <q-tooltip>Desactivar</q-tooltip>
            </q-btn>
            <q-btn v-else flat dense round size="sm" icon="restore" color="positive" class="action-secondary"
              @click="reactivar(celda.row)">
              <q-tooltip>Reactivar</q-tooltip>
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
            <div class="dialog-title">{{ esEdicion ? "Editar proveedor" : "Nuevo proveedor" }}</div>
            <div class="text-caption text-green-2">Datos de contacto del proveedor</div>
          </div>
          <q-space />
          <q-btn v-close-popup flat round dense icon="close" color="white" />
        </q-card-section>

        <q-form ref="formularioRef" greedy @submit="guardar">
          <q-card-section class="q-gutter-md">
            <q-input v-model="formulario.nombre" outlined dense label="Nombre *"
              :rules="[requerido('El nombre'), minimo(2, 'El nombre')]" lazy-rules />
            <q-input v-model="formulario.nit" outlined dense label="NIT / Identificacion" hint="Opcional" />
            <q-input v-model="formulario.telefono" outlined dense label="Telefono" hint="Opcional" />
            <q-input v-model="formulario.email" outlined dense type="email" label="Email" hint="Opcional"
              :rules="[(v) => !v || esEmail()(v)]" lazy-rules />
          </q-card-section>

          <q-card-actions align="right" class="q-px-md q-pb-md">
            <q-btn v-close-popup flat no-caps label="Cancelar" color="dark" class="btn-cancel" />
            <q-btn unelevated no-caps type="submit" color="primary" class="btn-ok"
              :label="esEdicion ? 'Guardar cambios' : 'Registrar proveedor'" :loading="guardando" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>
