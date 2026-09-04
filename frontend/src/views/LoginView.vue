<script setup>
/**
 * /views/LoginView.vue
 * Pantalla de inicio de sesion. Es la RAIZ de la aplicacion ("/"): la primera
 * que ve cualquiera, porque sin token la API no entrega ni un dato.
 *
 * El recorrido completo del token empieza aqui:
 *
 *   1. Esta vista manda email y contraseña a POST /usuarios/login.
 *   2. El backend responde { usuario, token }.
 *   3. Se guarda en el store Auth, que gracias a persist lo escribe en localStorage.
 *   4. De ahi en adelante, /plugins/axios.js lo manda en la cabecera x-token
 *      de TODAS las peticiones, sin que ninguna vista tenga que acordarse.
 *
 * OJO con el <div> de afuera: esta pantalla NO va dentro de un layout, asi que
 * aqui no se puede usar <q-page>. Un q-page necesita estar dentro de un
 * <q-layout> para renderizarse; sin el, la pantalla saldria en blanco.
 * Por eso se usa un div normal con las clases de ayuda de Quasar.
 */
import { ref } from "vue";
import { useRouter } from "vue-router";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/Auth";
import { useGeneralStore } from "@/store/General";
import { useNotificar } from "@/composables/useNotificar";
import { requerido, esEmail, minimo } from "@/utils/reglas";
import logo from "@/assets/lojo.png";

// Dentro de un componente SI se usa useRouter(); fuera de uno hay que importar
// la instancia (como hace /plugins/axios.js).
const router = useRouter();
const auth = useAuthStore();
const general = useGeneralStore();
const { notificarOk, notificarError } = useNotificar();

const formulario = ref({ email: "", password: "" });
const verPassword = ref(false);
const enviando = ref(false);

/**
 * Se ejecuta solo si todas las rules pasaron (de eso se encarga <q-form @submit>).
 */
const iniciarSesion = async () => {
  enviando.value = true;

  try {
    const respuesta = await authService.login({
      email: formulario.value.email.trim(),
      password: formulario.value.password,
    });

    // El store guarda { usuario, token }; el plugin lo persiste solo.
    auth.guardarSesion(respuesta);

    notificarOk(`Bienvenido, ${auth.nombreUsuario}`);
    router.push({ name: "productos" });
  } catch (e) {
    // Un backend bien hecho responde con un mensaje generico a proposito:
    // "Usuario o contraseña incorrectos", para no revelar cual de los dos
    // esta mal.
    notificarError(e);
  } finally {
    enviando.value = false;
  }
};
</script>

<template>
  <!-- window-height = 100vh; flex flex-center centra en los dos ejes. -->
  <div class="window-height flex flex-center q-pa-md">
    <div class="columna-login">
      <q-card flat class="tarjeta">
        <q-card-section class="text-center q-pb-none">
          <img :src="logo" alt="Logo" width="56" height="56" />
          <div class="text-h6 text-weight-bold q-mt-sm">{{ general.titulo }}</div>
          <p class="texto-suave text-body2">
            Inicia sesion para gestionar productos, categorias, proveedores y usuarios.
          </p>
        </q-card-section>

        <q-form greedy @submit="iniciarSesion">
          <q-card-section class="q-gutter-md">
            <q-input
              v-model="formulario.email"
              outlined
              dense
              type="email"
              label="Email *"
              autocomplete="email"
              autofocus
              :rules="[requerido('El email'), esEmail()]"
              lazy-rules
            >
              <template #prepend>
                <q-icon name="mail" />
              </template>
            </q-input>

            <q-input
              v-model="formulario.password"
              outlined
              dense
              label="Contraseña *"
              autocomplete="current-password"
              :type="verPassword ? 'text' : 'password'"
              :rules="[requerido('La contraseña'), minimo(6, 'La contraseña')]"
              lazy-rules
            >
              <template #prepend>
                <q-icon name="lock" />
              </template>
              <template #append>
                <!-- Mostrar/ocultar la contraseña: detalle pequeño que evita
                     muchos errores de tipeo. -->
                <q-icon
                  :name="verPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="verPassword = !verPassword"
                />
              </template>
            </q-input>
          </q-card-section>

          <q-card-actions class="q-px-md q-pb-md">
            <q-btn
              unelevated
              no-caps
              type="submit"
              color="primary"
              class="full-width"
              label="Entrar"
              :loading="enviando"
            />
          </q-card-actions>
        </q-form>

        <q-separator />

        <q-card-section class="text-center">
          <q-btn
            flat dense no-caps icon="arrow_back" label="Volver al catalogo"
            color="primary" :to="{ name: 'catalogo' }"
          />
        </q-card-section>
      </q-card>

      <!-- Recordatorio de a que backend apunta: ahorra media clase de
           depuracion cuando alguien apunta al puerto equivocado. -->
      <p class="text-center text-caption texto-suave q-mt-md q-mb-none">
        <q-icon name="dns" size="14px" class="q-mr-xs" />{{ general.urlApi }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/variables" as *;

.columna-login {
  width: 100%;
  max-width: 400px;
}

.columna-login :deep(.tarjeta) {
  position: relative;
  overflow: hidden;
  padding-top: 4px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color_button), color-mix(in srgb, var(--color_button) 60%, white));
  }
}
.columna-login {
  width: 400px;
  max-width: 92vw;
}
</style>
