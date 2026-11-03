# API · Kursa Backend

Base URL local: `http://localhost:4000/api`

## Formato de respuesta

Éxito:

```json
{ "success": true, "message": "opcional", "data": { } }
```

Error:

```json
{ "success": false, "message": "descripción", "error": "opcional" }
```

## Autenticación

Las rutas protegidas requieren:

```
Authorization: Bearer <accessToken>
```

Roles: `admin`, `profesor`, `estudiante`.

---

## Auth

| Método | Ruta | Auth | Body | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/auth/register` | — | `{ email, password, role? }` | Registro. Devuelve el usuario creado. |
| `POST` | `/auth/login` | — | `{ email, password }` | Login. Devuelve `accessToken` y `refreshToken`. |
| `POST` | `/auth/refresh` | — | `{ refreshToken }` | Devuelve un nuevo `accessToken`. |
| `GET` | `/auth/me` | ✅ | — | Datos del usuario autenticado. |

## Cursos

| Método | Ruta | Auth | Body | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/courses` | — | — | Lista de cursos. |
| `GET` | `/courses/:id` | — | — | Detalle de un curso. |
| `POST` | `/courses` | 🔒 admin/profesor | `{ title, description? }` | Crea un curso. |
| `POST` | `/courses/:courseId/enroll` | ✅ | — | Inscribe al usuario autenticado. |
| `GET` | `/courses/:courseId/enrolled` | ✅ | — | Indica si el usuario está inscrito. |

## Asignaturas

| Método | Ruta | Auth | Body | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/courses/:courseId/subjects` | — | — | Asignaturas de un curso. |
| `POST` | `/subjects` | 🔒 admin/profesor | `{ courseId, title, order? }` | Crea una asignatura. |

## Lecciones

| Método | Ruta | Auth | Body | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/subjects/:subjectId/lessons` | — | — | Lecciones de una asignatura. |
| `POST` | `/lessons` | 🔒 admin/profesor | `{ subjectId, title, contentType?, contentUrl?, order? }` | Crea una lección. |

`contentType` ∈ `text | image | video | file`.

## Tareas y entregas

| Método | Ruta | Auth | Body | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/subjects/:subjectId/assignments` | — | — | Tareas de una asignatura. |
| `POST` | `/assignments` | 🔒 admin/profesor | `{ subjectId, title, description?, dueDate?, maxFiles? }` | Crea una tarea. |
| `POST` | `/assignments/:assignmentId/submit` | ✅ | `multipart/form-data` (`files[]`, máx. 10) | Entrega de una tarea. |
| `GET` | `/assignments/:assignmentId/submissions` | ✅ | — | Entregas de una tarea. |
| `PATCH` | `/submissions/:submissionId/grade` | 🔒 admin/profesor | `{ grade, feedback? }` | Califica una entrega. |

## Archivos

| Método | Ruta | Auth | Body | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/upload` | ✅ | `multipart/form-data` (`file`) | Sube un archivo. |

## Grabaciones

| Método | Ruta | Auth | Body | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/subjects/:subjectId/recordings` | — | — | Grabaciones de una asignatura. |
| `POST` | `/recordings` | 🔒 admin/profesor | `{ subjectId, url }` | Registra una grabación. |

---

## WebSocket (Socket.IO)

Conexión en `http://localhost:4000` (o `VITE_SOCKET_URL`).

| Evento | Dirección | Payload | Descripción |
| :--- | :--- | :--- | :--- |
| `join-room` | Cliente → Servidor | `roomId` | Une el socket a una sala. |
| `leave-room` | Cliente → Servidor | `roomId` | Abandona la sala. |
| `call-signal` | Bidireccional | `{ roomId, signal, to }` | Señalización WebRTC. |
| `chat-message` | Bidireccional | `{ roomId, user, message }` | Chat de la sala. |

## Códigos de estado

| Código | Significado |
| :--- | :--- |
| `200` | OK |
| `201` | Recurso creado |
| `400` | Petición inválida / validación |
| `401` | No autenticado |
| `403` | Rol insuficiente |
| `404` | No encontrado |
| `409` | Conflicto |
| `500` | Error interno |
