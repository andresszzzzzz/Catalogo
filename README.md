# Proyecto (backend + frontend)

Carpetas separadas, backend y frontend ya conectados entre sí:

```
.
├── backend/     -> API Node/Express (puerto 3000)
├── frontend/    -> Vue 3 + Quasar (puerto 5173)
└── docker-compose.yml  -> levanta todo junto
```

## Qué se corrigió para conectarlos

El zip original traía el backend y el frontend desconectados por dos motivos:

1. **Puerto equivocado**: `frontend/.env` apuntaba a `http://localhost:4500/api`,
   pero el backend corre en el **3000** (`backend/.env` y `backend/docker-compose.yml`).
   Se corrigió a `VITE_API_URL=http://localhost:3000/api`.

2. **Header de autenticación distinto**: el backend valida el JWT leyendo
   `Authorization: Bearer <token>` (`backend/src/middlewares/auth.js`), pero
   el interceptor de axios del frontend mandaba el token en una cabecera
   `x-token` que el backend nunca revisa. Se corrigió el interceptor
   (`frontend/src/plugins/axios.js`) para mandar `Authorization: Bearer`.

   De paso se ajustó la lectura del mensaje de error: el backend responde
   `{ status, codigo, mensaje }` (`backend/src/middlewares/errorHandler.js`),
   pero el frontend leía un campo `msg` que no existe.

> Nota aparte (no es de conexión, es de contrato): `POST /api/auth/login`
> del backend hoy solo devuelve `{ token }`, mientras que el store de Auth
> del frontend espera `{ usuario, token }` para mostrar el nombre en la
> barra superior. Si necesitas ese dato, habría que agregar el objeto
> `usuario` en la respuesta de `authService.login` del backend.

## Cómo correrlo

### Opción A: todo con Docker (recomendado)

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:3000/api
- Swagger:  http://localhost:3000/api/docs

### Opción B: manual (dos terminales)

```bash
# Terminal 1 - backend (requiere Mongo y Redis corriendo, ver backend/docker-compose.yml)
cd backend
npm install
npm run dev

# Terminal 2 - frontend
cd frontend
npm install
npm run dev
```

El frontend quedará en http://localhost:5173 consumiendo la API en
http://localhost:3000/api.
