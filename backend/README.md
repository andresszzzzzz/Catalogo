# CatálogoBulk — Backend (Fase 0 + Fase 1)

Sistema de importación masiva de productos con procesamiento asíncrono.
Este entregable cubre **Fase 0 (setup + Docker Compose)** y **Fase 1
(Auth + CRUD de productos/proveedores/categorías)**, tal como especifica
`proyecto-catalogobulk-Fases0-1.pdf`.

## Cómo levantarlo

### Opción A — Docker Compose (recomendado, así lo pide el enunciado)

```bash
cp .env.example .env
docker compose up --build
```

Esto levanta `api` (puerto 3000), `mongo` y `redis`. También se define un
servicio `worker`, pero **su lógica de procesamiento todavía no está
implementada** (ver "Qué falta" abajo) — hoy solo se conecta y espera.

Verificá que todo esté arriba:

```bash
curl http://localhost:3000/health
# { "status": "ok", "mongo": "up", "redis": "up" }
```

Swagger: http://localhost:3000/api/docs

### Opción B — Local sin Docker

Necesitás Mongo y Redis corriendo localmente (o accesibles por red).

```bash
npm install
cp .env.example .env   # ajustá MONGO_URI/REDIS_HOST si no usás localhost
npm run dev
```

## Tests

Los tests son de integración (Jest + Supertest) y **requieren una instancia
real de MongoDB y Redis corriendo** (no usan mocks ni una base en memoria,
para que se ejecuten contra el mismo driver de Mongoose que usa la app).
Usan `.env.test`, que apunta a una base de datos separada
(`catalogobulk_test`) para no pisar datos de desarrollo.

```bash
docker compose up -d mongo redis
npm test
```

Cobertura actual:
- **Auth**: registro, login, email duplicado (409), credenciales
  inválidas (401), password nunca expuesto en la respuesta.
- **Proveedores**: creación con `activo:true` por defecto, 403 para rol
  `user` en rutas de admin, slug duplicado (409), eliminación bloqueada
  por integridad referencial si tiene productos (409), eliminación OK si
  no tiene productos (204).
- **Productos**: 401 sin token, 403 para `user` en POST/PUT/DELETE, sku
  duplicado (409, no 500 crudo de Mongo), `proveedorId` inexistente
  (404), `disponible` derivado correctamente de `stock`, paginación y
  filtro por categoría, `/stats`.
- **Categorías**: listado y `GET /:slug` (404 si no existe), 403 para
  `user` en `PUT`.
- **Infraestructura**: `/health`, Swagger en `/api/docs`.

## Qué está implementado (Fase 0 + Fase 1)

- Estructura de carpetas exacta de la sección 4 del enunciado
  (`controller → service → repository`, sin que el controller toque
  Mongoose ni el repository conozca `req/res`).
- `src/config/env.js` valida las 10 variables obligatorias del `.env` y
  hace `process.exit(1)` con mensaje claro si falta alguna.
- `docker-compose.yml` con `api`, `mongo`, `redis` (+ `worker`, ver abajo).
- `GET /health` devuelve `200` si Mongo y Redis están arriba, `503` con
  detalle de cuál está caído si no.
- Modelos exactos de la sección 5: `Usuario`, `Producto`, `Proveedor`,
  `Categoria`, `ImportJob`.
- Auth completo: `POST /api/auth/register`, `POST /api/auth/login` (JWT
  con `{ sub, rol }`, rate limit estricto).
- CRUD completo de Productos (`GET`, `GET /stats`, `GET /:id`, `POST`,
  `PUT`, `DELETE`) — **sin caché todavía**, tal como pide la Fase 1
  (la caché entra en Fase 5).
- CRUD completo de Proveedores, con la regla de integridad: no se puede
  eliminar un proveedor con productos asociados (409); para eso existe
  `PUT` con `activo:false`.
- Categorías: `GET /api/categorias`, `GET /api/categorias/:slug`,
  `PUT /api/categorias/:id` (el `slug` nunca se edita). No hay `POST`
  porque las categorías se crean solas durante el import (Fase 3).
- Middlewares: `auth` (JWT), `rol('admin')`, `upload` (Multer con
  `diskStorage`, filtro de extensión `.csv/.json`, límite de tamaño),
  rate limiters, y un `errorHandler` centralizado que traduce errores de
  Mongo (`11000` → 409, `ValidationError` → 400, `CastError` → 400) y de
  Multer, en vez de dejar pasar un 500 crudo.
- Swagger (OpenAPI 3) documentando cada endpoint, sus roles y errores,
  servido en `/api/docs`.
- Tests de integración cubriendo los criterios de aceptación de la
  Fase 0 y la Fase 1.

## Qué falta (Fases 2 a 5 — fuera de este alcance)

El PDF completo especifica un sistema más grande. Para no fingir que está
terminado, dejo explícito qué queda pendiente y dónde:

- **Fase 2-4 (el corazón del proyecto)**: parseo por streams del
  CSV/JSON, validación/normalización por fila (sección 6.3/6.4),
  inserción por lotes (`BATCH_SIZE`), actualización de progreso del
  `ImportJob`, y el relay de eventos en tiempo real vía Socket.io. Están
  scaffoldeados pero **sin lógica** en:
  - `src/queues/import.queue.js`
  - `src/workers/import.worker.js`
  - `src/sockets/index.js`
  - `src/modules/imports/*` (el modelo `ImportJob` sí está completo; el
    endpoint `POST /api/imports` hoy responde `501 NO_IMPLEMENTADO` y
    ni siquiera está montado en `app.js` para no aparentar un contrato
    vivo que no existe).
- **Fase 5 (caché)**: invalidación de caché de `GET /api/productos` y
  `/stats` en Redis tras cada import.
- `src/scripts/generar-catalogo.js` sí está implementado (genera un CSV
  de prueba grande y sucio), listo para cuando exista el import real.

## Notas de diseño

- `producto.model.js` deriva `disponible` de `stock` en un hook
  `pre('validate')`, así nunca puede quedar desincronizado sin importar
  quién escriba el documento (API o, más adelante, el worker de import).
- `env.js` carga `.env.test` cuando `NODE_ENV=test` para que los tests no
  toquen la base de datos de desarrollo.
- El rol y el id del usuario se sacan siempre del JWT (`req.usuario`), no
  del body, para evitar que un `user` se autoasigne `admin`.
