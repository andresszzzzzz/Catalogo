/**
 * @fileoverview /router/index.js
 * TODA la configuracion de rutas de la aplicacion, en un solo archivo.
 *
 * Se lee de arriba a abajo:
 *   1. se importan el layout y las vistas
 *   2. se arma el array "routes"
 *   3. se crea el router
 *   4. se protegen las rutas con un guard
 *
 * Mapa de la aplicacion:
 *
 *   /              -> redirige a /catalogo
 *   /catalogo      -> Catalogo publico (primera pantalla que ve cualquiera)
 *   /login         -> Login          (publica, opcional)
 *   /productos     -> AdminLayout    privada
 *   /categorias    -> AdminLayout    privada
 *   /proveedores   -> AdminLayout    privada
 *   /usuarios      -> AdminLayout    privada
 *
 * El catalogo es la RAIZ del sitio: se puede consultar sin iniciar sesion. El
 * login solo aparece cuando el usuario pulsa "Iniciar sesion" o intenta entrar
 * directo a una URL protegida. Las vistas administrativas SI necesitan token,
 * y cuelgan de una ruta PADRE que no tiene vista propia: su unico trabajo es
 * decir que plantilla las envuelve (AdminLayout). Cada ruta HIJA se pinta
 * dentro del <router-view> de ese layout, asi que la barra superior y el menu
 * lateral no se vuelven a montar al navegar entre ellas.
 */
import { createRouter, createWebHashHistory } from "vue-router";
import { Notify } from "quasar";

import { useAuthStore } from "@/store/Auth";

// Layout: el marco de las pantallas con sesion.
import AdminLayout from "@/layouts/AdminLayout.vue";

// Vistas: una pantalla por ruta.
import CatalogoView from "@/views/CatalogoView.vue";
import LoginView from "@/views/LoginView.vue";
import ProductosView from "@/views/ProductosView.vue";
import CategoriasView from "@/views/CategoriasView.vue";
import ProveedoresView from "@/views/ProveedoresView.vue";
import UsuariosView from "@/views/UsuariosView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

const routes = [
  {
    // La raiz nunca se queda "vacia": manda derecho al catalogo, que es la
    // verdadera primera pantalla del sitio.
    path: "/",
    redirect: { name: "catalogo" },
  },
  {
    // PUBLICA. No lleva layout administrativo: tiene su propia cabecera y
    // filtros, definidos dentro de la misma vista (ver CatalogoView.vue).
    path: "/catalogo",
    name: "catalogo",
    component: CatalogoView,
    meta: { titulo: "Catalogo" },
  },
  {
    // PUBLICA, y ademas "soloInvitados": si ya hay sesion no tiene sentido
    // volver a mostrar el login (ver guard mas abajo).
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { titulo: "Iniciar sesion", soloInvitados: true },
  },
  {
    // Todo lo administrativo vive dentro del layout con menu lateral. Esta
    // ruta padre no tiene "component" propio en su propio path, solo agrupa
    // a sus hijas bajo AdminLayout.
    path: "/",
    component: AdminLayout,
    children: [
      // Las hijas NO llevan barra inicial: Vue Router concatena / + productos.
      {
        path: "productos",
        name: "productos",
        component: ProductosView,
        // requiereAuth lo lee el guard protegerRutas del final del archivo.
        meta: { titulo: "Productos", requiereAuth: true },
      },
      {
        path: "categorias",
        name: "categorias",
        component: CategoriasView,
        meta: { titulo: "Categorias", requiereAuth: true },
      },
      {
        path: "proveedores",
        name: "proveedores",
        component: ProveedoresView,
        meta: { titulo: "Proveedores", requiereAuth: true },
      },
      {
        path: "usuarios",
        name: "usuarios",
        component: UsuariosView,
        meta: { titulo: "Usuarios", requiereAuth: true },
      },
      {
        // Comodin: cualquier URL que no exista cae aqui. Va SIEMPRE de ultimo,
        // porque Vue Router evalua en orden y esta hace match con todo.
        //
        // Tambien va como HIJA para que la pagina de error se pinte dentro del
        // layout. Un <q-page> fuera de un <q-layout> no se puede renderizar.
        path: ":pathMatch(.*)*",
        name: "no-encontrado",
        component: NotFoundView,
        meta: { titulo: "Pagina no encontrada" },
      },
    ],
  },
];

export const router = createRouter({
  /**
   * createWebHashHistory: las URLs llevan almohadilla
   *   http://localhost:5173/#/productos
   *
   * Lo que va despues del # nunca se envia al servidor, asi que al recargar con
   * F5 una ruta interna siempre carga el index.html y no da 404.
   */
  history: createWebHashHistory(),
  routes,

  // Al cambiar de pagina, subir el scroll al inicio.
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * PROTECCION DE RUTAS (guard global).
 *
 * beforeEach se ejecuta ANTES de cada navegacion y decide si deja pasar:
 *   return true            -> deja pasar
 *   return { name: "..." } -> cancela y redirige a otra ruta
 *   return false           -> cancela y se queda donde estaba
 *
 * Trabaja con dos marcas puestas en el meta de cada ruta:
 *   requiereAuth: true  -> hay que tener sesion (productos, categorias...)
 *   soloInvitados: true -> solo se entra SIN sesion (el login)
 *
 * Esta es la primera barrera, la de la interfaz, y sirve para no mostrarle
 * pantallas vacias a quien no ha entrado. La barrera de verdad esta en el
 * backend (su middleware de JWT): aunque alguien se salte esta, el servidor
 * responde 401 y no entrega ni un dato.
 *
 * @param {Object} to - ruta a la que se quiere entrar
 * @returns {boolean|Object} true para permitir, o una ruta para redirigir
 */
function protegerRutas(to) {
  // El store se pide DENTRO de la funcion: cuando se carga este archivo, Pinia
  // todavia no esta instalada.
  const auth = useAuthStore();

  // 1. Ruta privada y sin sesion: se avisa y se manda al login.
  if (to.meta.requiereAuth === true && !auth.estaAutenticado) {
    Notify.create({
      type: "negative",
      message: "Debes iniciar sesion para entrar a esa pagina",
      icon: "lock",
      position: "top-right",
    });

    return { name: "login" };
  }

  // 2. Login con sesion abierta: no tiene sentido volver a entrar, se manda a
  //    la primera pantalla del menu administrativo.
  if (to.meta.soloInvitados === true && auth.estaAutenticado) {
    return { name: "productos" };
  }

  // 3. Todo lo demas pasa (incluido el catalogo, que es publico siempre).
  return true;
}

router.beforeEach(protegerRutas);

/**
 * Guard que se ejecuta DESPUES de cada navegacion.
 * Aprovecha el meta.titulo para cambiar el titulo de la pestana.
 */
router.afterEach((to) => {
  const base = import.meta.env.VITE_APP_TITULO || "Catalogo de Productos";
  document.title = to.meta.titulo ? `${to.meta.titulo} | ${base}` : base;
});
