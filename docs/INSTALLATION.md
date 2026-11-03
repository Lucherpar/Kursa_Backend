# Instalación · Kursa Backend

## 1. Requisitos

- **Node.js 20+** y **npm 10+**
- **Git**
- Una base de datos **PostgreSQL**. Se recomienda [Neon](https://neon.tech) (plan gratuito).

Comprueba las versiones:

```bash
node -v
npm -v
```

## 2. Clonar el repositorio

```bash
git clone https://github.com/Lucherpar/Kursa_Backend.git
cd Kursa_Backend
```

## 3. Instalar dependencias

```bash
npm ci
```

> Usa `npm ci` para instalaciones reproducibles a partir de `package-lock.json`. Usa `npm install` solo si vas a añadir o actualizar dependencias.

## 4. Crear la base de datos en Neon

1. Crea una cuenta en [neon.tech](https://neon.tech).
2. Crea **dos proyectos**: `kursa-dev` y `kursa-prod`.
3. Copia la cadena de conexión de cada proyecto (formato `postgresql://...neon.tech/...?sslmode=require`).
4. Usa la de **desarrollo** en tu `.env` local. La de producción se configura en el proveedor de despliegue.

## 5. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env`:

```env
DATABASE_URL=postgresql://usuario:password@ep-xxx.neon.tech/kursa_dev?sslmode=require
JWT_SECRET=cambia_este_valor
REFRESH_TOKEN_SECRET=cambia_este_valor_tambien
PORT=4000
CORS_ORIGIN=http://localhost:5173
SOCKET_ORIGIN=http://localhost:5173
```

Consulta la referencia completa en [ENVIRONMENT.md](ENVIRONMENT.md).

## 6. Crear las tablas

```bash
npm run db:push
```

Esto sincroniza el esquema de `drizzle/schema.ts` con la base de datos.

Alternativa con migraciones versionadas:

```bash
npm run db:generate   # genera SQL en drizzle/migrations
npm run db:migrate    # aplica las migraciones
```

## 7. Arrancar en desarrollo

```bash
npm run dev
```

Salida esperada:

```
Servidor corriendo en http://localhost:4000
```

Prueba rápida:

```bash
curl http://localhost:4000/api/courses
```

## 8. Compilar para producción

```bash
npm run build
npm start
```

## 9. Ejecutar los tests

```bash
npm run test
```

Obligatorio según [QUALITY.md](QUALITY.md).

## 10. Solución de problemas

| Problema | Causa probable | Solución |
| :--- | :--- | :--- |
| `Variables de entorno inválidas` | Falta `DATABASE_URL`, `JWT_SECRET` o `REFRESH_TOKEN_SECRET`. | Revisa `.env`; deben existir y ser válidas. |
| `ECONNREFUSED` / timeout a la base de datos | URL incorrecta o base inaccesible. | Verifica la cadena de Neon y `sslmode=require`. |
| Tablas inexistentes | No se ejecutó `db:push`. | Ejecuta `npm run db:push`. |
| CORS bloqueado | `CORS_ORIGIN` no coincide con el frontend. | Ajusta `CORS_ORIGIN`/`SOCKET_ORIGIN`. |
| Socket no conecta | URL u origen incorrectos. | Revisa `SOCKET_ORIGIN` y la `VITE_SOCKET_URL` del frontend. |

## 11. Repositorio hermano

El frontend se instala por separado: [Kursa Frontend](https://github.com/Lucherpar/Kursa_Frontend).
