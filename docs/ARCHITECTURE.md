# Arquitectura · Kursa Backend

## 1. Visión general

Kursa Backend es una API REST con soporte de tiempo real construida sobre Express y Socket.IO. La persistencia se realiza en PostgreSQL (Neon) mediante Drizzle ORM.

```
Cliente (Kursa Frontend)
        │  HTTP /api            │  WebSocket
        ▼                       ▼
┌─────────────────────────────────────────┐
│                Express                  │
│  Helmet · CORS · Rate limit · JSON      │
├─────────────────────────────────────────┤
│  Router /api                            │
│    └─ middleware (auth, roles, zod)     │
│         └─ controllers                  │
│              └─ services                │
│                   └─ db (Drizzle)       │
└─────────────────────────────────────────┘
        │
        ▼
   PostgreSQL (Neon)
```

## 2. Capas

| Capa | Responsabilidad | Ubicación |
| :--- | :--- | :--- |
| **Routes** | Declarar endpoints y encadenar middleware. | `src/routes/` |
| **Middleware** | Autenticación, autorización, validación, errores, upload. | `src/middleware/` |
| **Controllers** | Adaptar HTTP al dominio y construir respuestas. | `src/controllers/` |
| **Services** | Lógica de negocio y consultas a la base de datos. | `src/services/` |
| **Config** | Entorno, pool de conexiones y JWT. | `src/config/` |
| **DB** | Esquema Drizzle y tablas. | `drizzle/` |

Regla de dependencia: **una capa solo depende de la inmediatamente inferior**. Los controllers no acceden directamente a `db`.

## 3. Flujo de una petición

```
Request
  → Helmet / CORS / rate-limit
  → express.json
  → router (/api/...)
  → authenticate (JWT)          [si aplica]
  → authorize (roles)           [si aplica]
  → validate (Zod)              [si aplica]
  → controller
  → service
  → Drizzle → PostgreSQL
  ← controller formatea { success, data }
  ← Response
```

Los errores no controlados pasan por `errorHandler`, que registra el error y devuelve una respuesta uniforme.

## 4. Autenticación y autorización

- **Registro** devuelve el usuario creado (sin `passwordHash`); **Login** devuelve `accessToken`, `refreshToken` y los datos públicos del usuario.
- El access token se firma con `JWT_SECRET` y el refresh con `REFRESH_TOKEN_SECRET`.
- **Refresh** valida el refresh token y comprueba que el usuario siga existiendo antes de emitir un nuevo access token.
- **Logout** cierra la sesión en el cliente; al ser JWT stateless, el cliente debe descartar ambos tokens.
- El middleware `authenticate` valida el header `Authorization: Bearer <token>` y adjunta el payload a `req.user`.
- `authorize(...roles)` restringe el acceso por rol (`admin`, `profesor`, `estudiante`).

## 5. Tiempo real (Socket.IO)

`src/socket/socket.server.ts` inicializa Socket.IO sobre el mismo servidor HTTP.

Eventos principales:

| Evento | Dirección | Descripción |
| :--- | :--- | :--- |
| `join-room` | Cliente → Servidor | Une el socket a una sala. |
| `leave-room` | Cliente → Servidor | Abandona la sala. |
| `call-signal` | Bidireccional | Señalización WebRTC entre pares. |
| `chat-message` | Bidireccional | Mensajes de chat de la sala. |

## 6. Subida de archivos

- Multer en memoria (`memoryStorage`) con validación de MIME y límite de tamaño.
- Tipos permitidos definidos en `src/utils/constants.ts`.
- Los archivos se referencian por URL en la base de datos.

## 7. Seguridad

- **Helmet** para cabeceras HTTP.
- **CORS** restringido al origen del frontend.
- **Rate limiting**: 100 peticiones / 15 minutos por IP.
- Contraseñas hasheadas con **bcrypt**.
- Validación de entrada con **Zod**.
- Variables sensibles fuera del repositorio (`.env`).

## 8. Decisiones de diseño

| Decisión | Motivo |
| :--- | :--- |
| Drizzle en lugar de un ORM pesado | Ligero, tipado y compatible con entornos serverless (Neon). |
| Zod para validación | Un único esquema tipado compartido entre controladores y tests. |
| Socket.IO sobre el mismo servidor | Simplicidad de despliegue y sesión compartida. |
| Respuestas uniformes | Facilita el consumo desde el frontend y el manejo de errores. |

## 9. Documentos relacionados

- [API.md](API.md) · [DATABASE.md](DATABASE.md) · [QUALITY.md](QUALITY.md)
