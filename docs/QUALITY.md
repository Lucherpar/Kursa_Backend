# Política de Calidad · Kursa Backend

> **Documento obligatorio.** Ningún cambio puede integrarse en `develop` ni en `main` sin cumplir las reglas de este documento.

## 1. Propósito

Garantizar que el backend de Kursa sea **correcto, seguro, mantenible y verificable** antes de cada integración. La calidad no es una fase final: se verifica en cada *pull request*.

## 2. Alcance

Aplica a todo el código de `src/`, `drizzle/`, configuración, scripts y documentación del repositorio.

## 3. Principios

1. **Todo cambio es verificable**: si no se puede probar, no está terminado.
2. **La automatización manda**: los criterios se comprueban con comandos reproducibles.
3. **Sin regresiones**: ningún cambio puede romper lo que ya funcionaba.
4. **Seguridad por defecto**: sin secretos, sin datos sensibles en logs, validación de entrada obligatoria.
5. **Trazabilidad**: cada cambio está vinculado a un issue y a una pull request.

## 4. Reglas obligatorias

| ID | Regla | Verificación |
| :--- | :--- | :--- |
| **R1** | **`npm run test` debe ejecutarse y pasar al 100 %** (0 fallos, 0 tests omitidos injustificadamente). | `npm run test` |
| **R2** | El proyecto debe **compilar** sin errores de TypeScript. | `npm run build` |
| **R3** | La cobertura de código **nuevo o modificado** no puede disminuir; objetivo mínimo del **70 %** en módulos nuevos. | `npm run test -- --coverage` |
| **R4** | Toda entrada externa (`body`, `params`, `query`) debe validarse con **Zod** antes de usarse. | Revisión de código |
| **R5** | No se permiten **secretos** ni credenciales en el repositorio; solo `.env.example`. | Revisión + `git grep` |
| **R6** | Cada PR requiere **al menos una aprobación** de otro miembro del equipo. | GitHub |
| **R7** | Los mensajes de commit siguen **Conventional Commits**. | Historial de Git |
| **R8** | No se aceptan `any` implícitos ni errores/warnings de compilación silenciados sin justificación. | `npm run build` + revisión |

> **R1 y R2 son bloqueantes.** Si cualquiera falla, la PR no puede fusionarse.

## 5. Flujo de calidad

```
feature/* ──► tests + build en local ──► PR a develop ──► CI + revisión ──► merge
                                                              │
                                                     al menos 1 aprobación
```

Antes de abrir una PR, el autor debe ejecutar en local:

```bash
npm run test
npm run build
```

## 6. Definition of Done (DoD)

Una tarea se considera terminada cuando:

- [ ] El issue asociado está actualizado.
- [ ] `npm run test` pasa.
- [ ] `npm run build` compila sin errores.
- [ ] Se añadieron tests para la lógica nueva.
- [ ] La PR tiene al menos una aprobación.
- [ ] No se introdujeron secretos ni dependencias innecesarias.
- [ ] La documentación afectada fue actualizada.

## 7. Cómo ejecutar las comprobaciones

| Comprobación | Comando |
| :--- | :--- |
| Tests (obligatorio) | `npm run test` |
| Tests en vigilancia | `npm run test:watch` |
| Compilación (obligatorio) | `npm run build` |
| Cobertura | `npm run test -- --coverage` |

## 8. Tests actuales

| Área | Archivo | Qué cubre |
| :--- | :--- | :--- |
| Esquemas Zod | `src/types/schemas.test.ts` | Registro, login, cursos, asignaturas, lecciones y tareas. |
| Respuestas | `src/utils/response.test.ts` | Formato de éxito y error. |
| Constantes | `src/utils/constants.test.ts` | Códigos HTTP y roles. |

## 9. Checklist de pull request

- [ ] Rama creada desde `develop` y actualizada.
- [ ] Commits con formato Conventional Commits.
- [ ] `npm run test` en verde.
- [ ] `npm run build` en verde.
- [ ] Tests añadidos/actualizados.
- [ ] Sin secretos ni `console.log` de depuración.
- [ ] Descripción de la PR con contexto y capturas si aplica.

## 10. Excepciones

Cualquier excepción a estas reglas debe justificarse en la PR y ser aprobada por al menos **dos** miembros del equipo. Las excepciones nunca pueden saltarse **R1** ni **R5**.

## 11. Responsables

El **Scrum Master** vela por el cumplimiento de esta política y el **Product Owner** prioriza la deuda técnica cuando impida cumplirla.
