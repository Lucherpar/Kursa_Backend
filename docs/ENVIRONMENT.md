# Variables de entorno · Kursa Backend

Todas las variables se cargan con `dotenv` desde `.env` y se validan con Zod en `src/config/env.ts`. Si falta una variable obligatoria o es inválida, el proceso **termina con error**.

> Nunca subas `.env` al repositorio. Usa `.env.example` como plantilla.

| Variable | Obligatoria | Tipo | Por defecto | Descripción |
| :--- | :---: | :--- | :--- | :--- |
| `DATABASE_URL` | ✅ | URL | — | Cadena de conexión PostgreSQL/Neon. |
| `JWT_SECRET` | ✅ | string | — | Secreto de firma del access token. |
| `REFRESH_TOKEN_SECRET` | ✅ | string | — | Secreto de firma del refresh token. |
| `JWT_EXPIRES_IN` | ❌ | string | `7d` | Caducidad del access token (formato `ms`/`d`). |
| `REFRESH_TOKEN_EXPIRES_IN` | ❌ | string | `30d` | Caducidad del refresh token. |
| `PORT` | ❌ | number | `4000` | Puerto del servidor HTTP. |
| `CORS_ORIGIN` | ❌ | string | `http://localhost:5173` | Origen permitido por CORS. |
| `SOCKET_ORIGIN` | ❌ | string | `http://localhost:5173` | Origen permitido por Socket.IO. |
| `MAX_FILE_SIZE` | ❌ | number | `10485760` | Tamaño máximo de archivo en bytes. |
| `UPLOAD_DIR` | ❌ | string | `/tmp/uploads` | Directorio de archivos subidos. |

## Ejemplo mínimo

```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/kursa_dev?sslmode=require
JWT_SECRET=un_secreto_largo_y_aleatorio
REFRESH_TOKEN_SECRET=otro_secreto_largo_y_aleatorio
```

## Ejemplo completo

```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/kursa_dev?sslmode=require
JWT_SECRET=un_secreto_largo_y_aleatorio
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=otro_secreto_largo_y_aleatorio
REFRESH_TOKEN_EXPIRES_IN=30d
PORT=4000
CORS_ORIGIN=http://localhost:5173
SOCKET_ORIGIN=http://localhost:5173
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/tmp/uploads
```

## Entornos

| Entorno | Base de datos | Dónde se configura |
| :--- | :--- | :--- |
| Desarrollo | `kursa-dev` | `.env` local |
| Producción | `kursa-prod` | Panel del proveedor (Vercel/Railway/Render, etc.) |

## Buenas prácticas

- Genera secretos robustos: `openssl rand -hex 32`.
- Rota los secretos si se filtran.
- Usa bases de datos distintas para desarrollo y producción.
- Mantén `.env.example` actualizado cuando añadas variables.
