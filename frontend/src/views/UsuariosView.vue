<script setup>
/**
 * /views/UsuariosView.vue
 * CRUD de usuarios del sistema administrativo.
 *
 * Reglas de la seccion 13 del pedido:
 *   - Nunca se muestra la contraseña almacenada (el backend tampoco deberia
 *     devolverla; aqui simplemente no se pinta ningun campo con ese dato).
 *   - La contraseña NO se hashea en el frontend: viaja tal cual el usuario la
 *     escribio y es el backend quien la hashea antes de guardarla.
 *   - Al crear, la contraseña es obligatoria. Al editar, se deja en blanco
 *     para "no cambiarla"; si se escribe algo, se manda para que el backend
 *     la actualice.
 */
import { computed, onMounted, ref } from "vue";

import EncabezadoPagina from "@/components/Encabezados/EncabezadoPagina.vue";
import TablaDatos from "@/components/Tables/TablaDatos.vue";

import { usuariosService } from "@/services/usuarios.service";
import { useGeneralStore } from "@/store/General";
import { useNotificar } from "@/composables/useNotificar";
import { useConfirmar } from "@/composables/useConfirmar";
import { requerido, esEmail, minimo, seleccionRequerida } from "@/utils/reglas";

const general = useGeneralStore();
const { notificarOk, notificarError } = useNotificar();
const { confirmar } = useConfirmar();

// Roles de ejemplo: si el backend entrega su propia lista de roles, se
// reemplaza esta constante por una llamada al servicio correspondiente.
const roles = [
  { label: "Administrador", value: "admin" },
  { label: "Usuario", value: "usuario" },
];

const columnas = [
  { name: "nombre", label: "Nombre", field: "nombre", align: "left", sortable: true },
  { name: "email", label: "Email", field: "email", align: "left", sortable: true },
  {
    name: "rol", label: "Rol", align: "left",
    field: (fila) => roles.find((r) => r.value === fila.rol)?.label || fila.rol || "-",
  },
  { name: "acciones", label: "Acciones", field: "acciones", align: "right" },
];

const usuarios = ref([]);
const cargando = ref(false);
const error = ref(null);

const cargar = async () => {
  cargando.value = true;
  error.value = null;

  try {
    usuarios.value = await usuariosService.listar();
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
const verPassword = ref(false);

const formularioVacio = () => ({ nombre: "", email: "", rol: "usuario", password: "" });
const formulario = ref(formularioVacio());

const esEdicion = computed(() => editando.value !== null);

const abrirCreacion = () => {
  editando.value = null;
  formulario.value = formularioVacio();
  dialogo.value = true;
};

const abrirEdicion = (usuario) => {
  editando.value = usuario;
  formulario.value = {
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol || "usuario",
    password: "", // nunca se precarga: en blanco significa "no cambiar"
  };
  dialogo.value = true;
};

const guardar = async () => {
  guardando.value = true;

  try {
    const datos = {
      nombre: formulario.value.nombre.trim(),
      email: formulario.value.email.trim(),
      rol: formulario.value.rol,
    };

    // Solo se manda la contraseña si el usuario escribio algo.
    if (formulario.value.password) {
      datos.password = formulario.value.password;
    }

    const respuesta = esEdicion.value
      ? await usuariosService.actualizar(editando.value._id, datos)
      : await usuariosService.crear(datos);

    notificarOk(respuesta?.msg || "Usuario guardado");
    dialogo.value = false;
    await cargar();
  } catch (e) {
    notificarError(e);
  } finally {
    guardando.value = false;
  }
};

const eliminar = async (usuario) => {
  const aceptado = await confirmar({
    titulo: "Eliminar usuario",
    mensaje: `¿Confirmas eliminar a "${usuario.nombre}"? Perdera acceso al sistema.`,
    textoOk: "Eliminar",
    color: "negative",
  });

  if (!aceptado) return;

  try {
    const respuesta = await usuariosService.eliminar(usuario._id);
    notificarOk(respuesta?.msg || "Usuario eliminado");
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
        titulo="Usuarios"
        subtitulo="Cuentas con acceso al sistema administrativo"
        icono="manage_accounts"
      >
        <template #acciones>
          <q-btn
            unelevated no-caps color="primary" icon="add"
            label="Nuevo usuario" @click="abrirCreacion"
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
        :filas="usuarios"
        :columnas="columnas"
        :cargando="cargando"
        mensaje-vacio="Aun no hay usuarios registrados"
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
            <div class="dialog-title">{{ esEdicion ? "Editar usuario" : "Nuevo usuario" }}</div>
            <div class="text-caption text-green-2">Acceso al sistema administrativo</div>
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
              v-model="formulario.email" outlined dense type="email" label="Email *"
              :rules="[requerido('El email'), esEmail()]" lazy-rules
            />

            <q-select
              v-model="formulario.rol" outlined dense label="Rol *"
              :options="roles" option-value="value" option-label="label"
              emit-value map-options
              :rules="[seleccionRequerida('un rol')]" lazy-rules
            />

            <q-input
              v-model="formulario.password" outlined dense
              :type="verPassword ? 'text' : 'password'"
              :label="esEdicion ? 'Nueva contraseña' : 'Contraseña *'"
              :hint="esEdicion ? 'Dejar en blanco para no cambiarla' : 'Minimo 6 caracteres'"
              :rules="esEdicion
                ? [(v) => !v || v.length >= 6 || 'Minimo 6 caracteres']
                : [requerido('La contraseña'), minimo(6, 'La contraseña')]"
              lazy-rules
            >
              <template #append>
                <q-icon
                  :name="verPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer" @click="verPassword = !verPassword"
                />
              </template>
            </q-input>
          </q-card-section>

          <q-card-actions align="right" class="q-px-md q-pb-md">
            <q-btn v-close-popup flat no-caps label="Cancelar" color="dark" class="btn-cancel" />
            <q-btn
              unelevated no-caps type="submit" color="primary" class="btn-ok"
              :label="esEdicion ? 'Guardar cambios' : 'Registrar usuario'"
              :loading="guardando"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>
