<script setup>
/**
 * /views/ProductosView.vue
 * CRUD completo de productos. Es el modelo con mas relaciones: cada producto
 * apunta a una categoria y a un proveedor, por eso el formulario carga esas
 * dos listas del backend (categoriasService / proveedoresService) en vez de
 * escribirlas a mano, tal como pide el pedido.
 */
import { computed, onMounted, ref } from "vue";

import EncabezadoPagina from "@/components/Encabezados/EncabezadoPagina.vue";
import TablaDatos from "@/components/Tables/TablaDatos.vue";

import { productosService } from "@/services/productos.service";
import { categoriasService } from "@/services/categorias.service";
import { proveedoresService } from "@/services/proveedores.service";
import { useGeneralStore } from "@/store/General";
import { useNotificar } from "@/composables/useNotificar";
import { useConfirmar } from "@/composables/useConfirmar";
import { requerido, minimo, seleccionRequerida } from "@/utils/reglas";

const general = useGeneralStore();
const { notificarOk, notificarError } = useNotificar();
const { confirmar } = useConfirmar();

const columnas = [
  { name: "nombre", label: "Nombre", field: "nombre", align: "left", sortable: true },
  {
    name: "categoria", label: "Categoria", align: "left",
    field: (fila) => fila.categoria?.nombre || "-",
  },
  {
    name: "proveedor", label: "Proveedor", align: "left",
    field: (fila) => fila.proveedor?.nombre || "-",
  },
  {
    name: "precio", label: "Precio", align: "right", sortable: true,
    field: "precio", format: (v) => formatoMoneda(v),
  },
  { name: "stock", label: "Stock", field: "stock", align: "right", sortable: true },
  { name: "acciones", label: "Acciones", field: "acciones", align: "right" },
];

function formatoMoneda(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return "-";
  return numero.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

// --- Datos de apoyo para los selectores (categorias y proveedores) --------
const categorias = ref([]);
const proveedores = ref([]);

const cargarListasApoyo = async () => {
  try {
    const [resCategorias, resProveedores] = await Promise.all([
      categoriasService.listar(),
      proveedoresService.listar(),
    ]);
    categorias.value = resCategorias;
    proveedores.value = resProveedores.data;
  } catch (e) {
    notificarError(e);
  }
};

// --- Listado principal -------------------------------------------------------
const productos = ref([]);
const cargando = ref(false);
const error = ref(null);

const cargar = async () => {
  cargando.value = true;
  error.value = null;

  try {
    productos.value = await productosService.listar();
    general.marcarSincronizacion();
  } catch (e) {
    error.value = e.mensaje;
    notificarError(e);
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  cargar();
  cargarListasApoyo();
});

// --- Formulario -------------------------------------------------------------
const dialogo = ref(false);
const guardando = ref(false);
const editando = ref(null);
const formularioRef = ref(null);

const formularioVacio = () => ({
  nombre: "",
  descripcion: "",
  precio: null,
  stock: null,
  categoria: null,
  proveedor: null,
  imagen: "",
});
const formulario = ref(formularioVacio());

const esEdicion = computed(() => editando.value !== null);

const abrirCreacion = () => {
  editando.value = null;
  formulario.value = formularioVacio();
  dialogo.value = true;
};

const abrirEdicion = (producto) => {
  editando.value = producto;
  formulario.value = {
    nombre: producto.nombre,
    descripcion: producto.descripcion || "",
    precio: producto.precio,
    stock: producto.stock,
    // el backend puede devolver la categoria/proveedor "poblados" ({_id, nombre})
    // o solo el id: en ambos casos el select necesita el id puro.
    categoria: producto.categoria?._id || producto.categoria || null,
    proveedor: producto.proveedor?._id || producto.proveedor || null,
    imagen: producto.imagen || "",
  };
  dialogo.value = true;
};

const guardar = async () => {
  guardando.value = true;

  try {
    const datos = {
      nombre: formulario.value.nombre.trim(),
      descripcion: formulario.value.descripcion.trim(),
      precio: Number(formulario.value.precio),
      stock: Number(formulario.value.stock),
      categoria: formulario.value.categoria,
      proveedor: formulario.value.proveedor,
      imagen: formulario.value.imagen.trim(),
    };

    const respuesta = esEdicion.value
      ? await productosService.actualizar(editando.value._id, datos)
      : await productosService.crear(datos);

    notificarOk(respuesta?.msg || "Producto guardado");
    dialogo.value = false;
    await cargar();
  } catch (e) {
    notificarError(e);
  } finally {
    guardando.value = false;
  }
};

const eliminar = async (producto) => {
  const aceptado = await confirmar({
    titulo: "Eliminar producto",
    mensaje: `¿Confirmas eliminar "${producto.nombre}"? Dejara de verse en el catalogo.`,
    textoOk: "Eliminar",
    color: "negative",
  });

  if (!aceptado) return;

  try {
    const respuesta = await productosService.eliminar(producto._id);
    notificarOk(respuesta?.msg || "Producto eliminado");
    await cargar();
  } catch (e) {
    notificarError(e);
  }
};
</script>

<template>
  <q-page>
    <div class="contenedor-app">
      <EncabezadoPagina titulo="Productos" subtitulo="Catalogo interno: precio, stock, categoria y proveedor"
        icono="inventory_2">
        <template #acciones>
          <q-btn unelevated no-caps color="primary" icon="add" label="Nuevo producto" @click="abrirCreacion" />
        </template>
      </EncabezadoPagina>

      <q-banner v-if="error" dense class="bg-red-1 text-negative q-mb-md rounded-borders">
        <template #avatar><q-icon name="error_outline" /></template>
        {{ error }}
        <template #action>
          <q-btn flat dense no-caps label="Reintentar" @click="cargar" />
        </template>
      </q-banner>

      <TablaDatos :filas="productos" :columnas="columnas" :cargando="cargando"
        mensaje-vacio="Aun no hay productos registrados">
        <template #body-cell-acciones="celda">
          <q-td :props="celda" class="text-right">
            <q-btn flat dense round size="sm" icon="edit" color="primary" class="action-secondary"
              @click="abrirEdicion(celda.row)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn flat dense round size="sm" icon="delete" color="negative" class="action-secondary"
              @click="eliminar(celda.row)">
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
            <div class="dialog-title">{{ esEdicion ? "Editar producto" : "Nuevo producto" }}</div>
            <div class="text-caption text-green-2">Informacion visible en el catalogo</div>
          </div>
          <q-space />
          <q-btn v-close-popup flat round dense icon="close" color="white" />
        </q-card-section>

        <q-form ref="formularioRef" greedy @submit="guardar">
          <q-card-section class="q-gutter-md">
            <q-input v-model="formulario.nombre" outlined dense label="Nombre *"
              :rules="[requerido('El nombre'), minimo(2, 'El nombre')]" lazy-rules />

            <q-input v-model="formulario.descripcion" outlined dense type="textarea" label="Descripcion" hint="Opcional"
              autogrow />

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input v-model.number="formulario.precio" outlined dense type="number" label="Precio *" prefix="$"
                  :rules="[requerido('El precio'), (v) => Number(v) >= 0 || 'El precio no puede ser negativo']"
                  lazy-rules />
              </div>
              <div class="col-12 col-sm-6">
                <q-input v-model.number="formulario.stock" outlined dense type="number" label="Stock *"
                  :rules="[requerido('El stock'), (v) => Number.isInteger(Number(v)) && Number(v) >= 0 || 'El stock debe ser un entero valido']"
                  lazy-rules />
              </div>
            </div>

            <q-select v-model="formulario.categoria" outlined dense label="Categoria *" :options="categorias"
              option-value="_id" option-label="nombre" emit-value map-options
              :rules="[seleccionRequerida('una categoria')]" lazy-rules />

            <q-select v-model="formulario.proveedor" outlined dense label="Proveedor *" :options="proveedores"
              option-value="_id" option-label="nombre" emit-value map-options
              :rules="[seleccionRequerida('un proveedor')]" lazy-rules />

            <q-input v-model="formulario.imagen" outlined dense label="URL de la imagen"
              hint="Opcional. Se muestra en la tarjeta del catalogo." />
          </q-card-section>

          <q-card-actions align="right" class="q-px-md q-pb-md">
            <q-btn v-close-popup flat no-caps label="Cancelar" color="dark" class="btn-cancel" />
            <q-btn unelevated no-caps type="submit" color="primary" class="btn-ok"
              :label="esEdicion ? 'Guardar cambios' : 'Registrar producto'" :loading="guardando" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>
