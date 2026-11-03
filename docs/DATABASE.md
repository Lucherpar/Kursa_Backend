# Base de datos · Kursa Backend

Motor: **PostgreSQL** (Neon). ORM: **Drizzle**. Esquema en `drizzle/schema.ts`.

## Diagrama de relaciones

```
users ──< courses (profesor)
users ──< enrollments >── courses
courses ──< subjects ──< lessons
courses ──< subjects ──< assignments ──< submissions >── users (student)
subjects ──< recordings
users ──< files
```

## Enum

| Enum | Valores |
| :--- | :--- |
| `user_role` | `admin`, `profesor`, `estudiante` |

## Tablas

### `users`

| Columna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | serial | PK |
| `email` | varchar(255) | único, obligatorio |
| `password_hash` | text | obligatorio |
| `role` | user_role | por defecto `estudiante` |
| `created_at` | timestamp | por defecto `now()` |

### `courses`

| Columna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | serial | PK |
| `title` | varchar(200) | obligatorio |
| `description` | text | opcional |
| `profesor_id` | integer | FK → `users.id` |
| `created_at` | timestamp | por defecto `now()` |

### `subjects`

| Columna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | serial | PK |
| `course_id` | integer | FK → `courses.id` |
| `title` | varchar(200) | obligatorio |
| `order` | integer | por defecto `0` |

### `lessons`

| Columna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | serial | PK |
| `subject_id` | integer | FK → `subjects.id` |
| `title` | varchar(200) | obligatorio |
| `content_type` | varchar(50) | por defecto `text` |
| `content_url` | text | opcional |
| `order` | integer | por defecto `0` |

### `enrollments`

| Columna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | serial | PK |
| `user_id` | integer | FK → `users.id` |
| `course_id` | integer | FK → `courses.id` |
| `enrolled_at` | timestamp | por defecto `now()` |

### `files`

| Columna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | serial | PK |
| `original_name` | varchar(255) | obligatorio |
| `mime_type` | varchar(100) | obligatorio |
| `url` | text | obligatorio |
| `uploaded_by` | integer | FK → `users.id` |
| `created_at` | timestamp | por defecto `now()` |

### `assignments`

| Columna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | serial | PK |
| `subject_id` | integer | FK → `subjects.id` |
| `title` | varchar(200) | obligatorio |
| `description` | text | opcional |
| `due_date` | timestamp | opcional |
| `max_files` | integer | por defecto `5` |
| `created_at` | timestamp | por defecto `now()` |

### `submissions`

| Columna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | serial | PK |
| `assignment_id` | integer | FK → `assignments.id` |
| `student_id` | integer | FK → `users.id` |
| `file_urls` | text[] | por defecto `{}` |
| `submitted_at` | timestamp | por defecto `now()` |
| `grade` | integer | opcional |
| `feedback` | text | opcional |

### `recordings`

| Columna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | serial | PK |
| `subject_id` | integer | FK → `subjects.id` |
| `url` | text | obligatorio |
| `recorded_at` | timestamp | por defecto `now()` |

## Migraciones

| Comando | Uso |
| :--- | :--- |
| `npm run db:generate` | Genera SQL a partir del esquema. |
| `npm run db:push` | Sincroniza directamente el esquema (desarrollo). |
| `npm run db:migrate` | Aplica migraciones versionadas. |
| `npm run db:studio` | Interfaz visual de la base de datos. |

## Entornos

Se recomienda mantener **dos bases de datos independientes**: `kursa-dev` y `kursa-prod`. Nunca ejecutes `db:push` contra producción sin revisar antes los cambios.
