# Catalogo de Productos — Vue 3 + Quasar + Vue Router + Pinia

Frontend con **catalogo publico** de productos y **panel administrativo** con
CRUD de Productos, Categorias, Proveedores y Usuarios.

> Este proyecto partio de una plantilla de ejemplo (`estructura_frontend` para
> Cursos/Aprendices). Se conservo toda la infraestructura (Quasar, Pinia,
> Axios, componentes reutilizables, estilos) y se reemplazo el dominio.

---

## 1. Flujo de la aplicacion

```
USUARIO ENTRA AL SITIO
        |
     CATALOGO (publico, /catalogo)
        |
   Pulsa "Iniciar sesion"
        |
      LOGIN (/login)
        |
   Backend valida -> token
        |
  PANEL ADMINISTRATIVO
   Productos | Categorias | Proveedores | Usuarios
```

El catalogo es **solo de consulta**: no hay carrito, ni "Agregar al
carrito", ni checkout, ni pedidos. Sirve para buscar y filtrar productos por
nombre, categoria y proveedor.

---

## 2. IMPORTANTE — este proyecto NO tiene backend todavia

El repositorio original solo traia un backend de ejemplo (Cursos/Aprendices,
en `backend prueba/`), que **no** expone `productos`, `categorias` ni
`proveedores`. Este frontend esta **preparado para conectarse** a un backend
REST con ese contrato, pero ese backend aun no existe.

Los endpoints que se usan (ver `/src/services/*.service.js`) son un contrato
de EJEMPLO, no definitivo:

| Recurso     | Metodo y ruta                              |
| ----------- | ------------------------------------------- |
| Auth        | `POST /auth/login`                           |
| Productos   | `GET/POST /productos`, `GET/PUT/DELETE /productos/:id` |
| Categorias  | `GET/POST /categorias`, `GET/PUT/DELETE /categorias/:id` |
| Proveedores | `GET/POST /proveedores`, `GET/PUT/DELETE /proveedores/:id` |
| Usuarios    | `GET/POST /usuarios`, `GET/PUT/DELETE /usuarios/:id` |

`GET /productos` admite filtros por query string: `?nombre=&categoria=&proveedor=`
(estos dos ultimos aceptan varios ids separados por coma). Si el backend real
usa otras rutas o otro formato de filtro, el unico lugar que hay que tocar es
el archivo de servicio correspondiente en `/src/services`.

---

## 3. Puesta en marcha

```bash
npm install
cp .env.example .env   # y ajustar VITE_API_URL cuando exista el backend
npm run dev             # http://localhost:5173
```

| Comando            | Que hace                                   |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo con recarga en vivo  |
| `npm run build`     | Compila a `/dist` para produccion           |
| `npm run preview`   | Sirve lo compilado para probarlo            |

La URL del backend vive en `.env` (`VITE_API_URL`), nunca escrita en el
codigo. Al modificar `.env` hay que reiniciar `npm run dev`.

---

## 4. Estructura

```
src/
├── assets/         recursos estaticos (logo)
├── components/     componentes reutilizables
│   ├── Encabezados/EncabezadoPagina.vue   cabecera estandar de cada vista
│   └── Tables/TablaDatos.vue              tabla con buscador y estados de carga
├── views/          una pantalla por ruta
│   ├── CatalogoView.vue     catalogo publico (grid + buscador + filtros)
│   ├── LoginView.vue        login (publica, opcional)
│   ├── ProductosView.vue    CRUD de productos
│   ├── CategoriasView.vue   CRUD de categorias
│   ├── ProveedoresView.vue  CRUD de proveedores
│   ├── UsuariosView.vue     CRUD de usuarios
│   └── NotFoundView.vue     404
├── composables/    logica reutilizable (useNotificar, useConfirmar)
├── store/          estado global con Pinia (Auth.js, General.js)
├── router/         rutas + proteccion de rutas (index.js)
├── services/       una funcion HTTP centralizada (api.service.js) y un
│                   archivo por recurso (auth, productos, categorias,
│                   proveedores, usuarios) con sus endpoints
├── layouts/        AdminLayout.vue: plantilla del panel (header + sidebar)
├── styles/         variables y estilos globales (paleta, tipografia)
├── plugins/        axios y Quasar configurados una sola vez
├── utils/          funciones puras (fechas, validaciones, reglas)
├── App.vue
└── main.js
```

### Cadena de responsabilidad

```
componente/vista -> store (Pinia, solo sesion/UI) -> service -> plugins/axios.js -> backend
```

Los componentes nunca llaman a axios directamente: llaman a un servicio
(`productosService.listar()`, por ejemplo). Si el backend cambia una ruta, se
ajusta un solo archivo.

---

## 5. Autenticacion

```
Login -> POST /auth/login -> { usuario, token } -> store Auth (persistido)
                                                       |
                                     plugins/axios.js manda "x-token" en
                                     TODAS las peticiones automaticamente
```

- El token se guarda en Pinia con `pinia-plugin-persistedstate`: sobrevive a
  F5 sin escribir `localStorage` a mano.
- Si el backend responde `401` (token ausente o vencido), el interceptor de
  `/plugins/axios.js` cierra la sesion y redirige al login desde un solo
  lugar.
- Las rutas `/productos`, `/categorias`, `/proveedores` y `/usuarios` estan
  protegidas por un guard de Vue Router (`meta.requiereAuth`). Esa es solo la
  barrera de interfaz; la barrera real la impone el backend con el token.

---

## 6. Catalogo publico

`CatalogoView.vue` no usa `AdminLayout`: tiene su propia cabecera con
buscador y un drawer de filtros (categorias y proveedores, cargados del
backend, nunca escritos a mano). Cada cambio de filtro vuelve a pedir la
lista de productos al backend con los parametros correspondientes.

Es exclusivamente informativo: no existe carrito, cantidad, "Comprar" ni
checkout en ningun componente del proyecto.

---

## 7. Responsive

El grid de productos usa las clases de Quasar:

- PC / laptop grande: 4 tarjetas por fila (`col-lg-3`)
- Tablet: 2-3 por fila (`col-md-4` / `col-sm-6`)
- Celular: 1 por fila (`col-12`)

Los filtros laterales se convierten en un drawer deslizable en pantallas
chicas (boton de menu en la cabecera).
