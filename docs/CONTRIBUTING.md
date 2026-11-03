# Contribución · Kursa Backend

## 1. Estrategia de ramas

| Rama | Propósito | Protegida |
| :--- | :--- | :---: |
| `main` | Código estable / producción. | ✅ |
| `develop` | Integración de funcionalidades terminadas. | ❌ |
| `feature/<issue>-<slug>` | Desarrollo de una funcionalidad. | ❌ |
| `fix/<issue>-<slug>` | Corrección de errores. | ❌ |
| `docs/<slug>` | Documentación. | ❌ |

## 2. Flujo de trabajo

1. Crea o toma un **issue**.
2. Actualiza `develop`:

   ```bash
   git checkout develop
   git pull origin develop
   ```

3. Crea tu rama:

   ```bash
   git checkout -b feature/12-endpoint-tareas
   ```

4. Desarrolla y verifica:

   ```bash
   npm run test
   npm run build
   ```

5. Haz commit con **Conventional Commits**:

   ```bash
   git commit -m "feat(assignments): añadir endpoint de entrega"
   ```

6. Sube la rama y abre una **PR a `develop`**:

   ```bash
   git push -u origin feature/12-endpoint-tareas
   ```

7. Espera la revisión de al menos **un compañero**.

## 3. Conventional Commits

| Tipo | Uso |
| :--- | :--- |
| `feat` | Nueva funcionalidad. |
| `fix` | Corrección de errores. |
| `docs` | Documentación. |
| `refactor` | Refactor sin cambio de comportamiento. |
| `test` | Tests. |
| `chore` | Tareas de mantenimiento. |

Formato: `tipo(alcance): descripción en imperativo`.

## 4. Estilo de código

- TypeScript estricto (`strict: true`).
- Validación de entrada con **Zod**.
- Capas: routes → middleware → controllers → services → db.
- Sin `any` implícitos; tipa explícitamente.
- Sin `console.log` de depuración (usa el `logger`).
- Respuestas con `successResponse` / `errorResponse`.

## 5. Pull requests

Toda PR debe:

- Tener un título claro y una descripción del cambio.
- Referenciar el issue (`Closes #12`).
- Pasar `npm run test` y `npm run build`.
- Incluir tests si añade lógica.
- Tener al menos **una aprobación**.

## 6. Definition of Done

Consulta [QUALITY.md](QUALITY.md#6-definition-of-done-dod).

## 7. Prohibiciones

- Push directo a `main`.
- Subir secretos o `.env`.
- Fusionar PRs sin aprobación.
- Dependencias sin justificar.
