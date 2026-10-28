# Kursa_Backtend

![Status](https://img.shields.io/badge/status-en%20desarrollo-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

> Proyecto **kursa** — Repositorio oficial del equipo. Este documento define las normas de colaboración, el flujo de trabajo con Git y los criterios de calidad que seguimos todos los integrantes.

---

## 📑 Tabla de Contenidos

- [Equipo y Roles](#-equipo-y-roles)
- [Definition of Done (DoD)](#-definition-of-done-dod)
- [Convención de Ramas y Flujo de Trabajo](#-convención-de-ramas-y-flujo-de-trabajo)
  - [Estructura de Ramas](#estructura-de-ramas)
  - [Flujo de Trabajo Paso a Paso](#flujo-de-trabajo-paso-a-paso)
- [Buenas Prácticas](#-buenas-prácticas)

---

## 👥 Equipo y Roles

| Integrante | Rol |
| :--- | :--- |
| **SALVADOR GÓMEZ SÁNCHEZ** | Product Owner (PO) & Developer (Dev) |
| **LUCAS HERNÁNDEZ PARDO** | Scrum Master (SM) & Developer (Dev) |
| **VICENTE PÉREZ JAVIER** | Developer (Dev) |
| **ALICIA DEL CARMEN ROS VILLALBA** | Developer (Dev) |

---

## ✅ Definition of Done (DoD)

Una tarea se considera **terminada** únicamente cuando cumple **todos** los siguientes criterios:

1. **Funciona localmente sin errores.** El código compila y se ejecuta correctamente en el entorno local del desarrollador, sin errores ni warnings críticos.
2. **Está vinculada a un Issue.** Toda tarea tiene su Issue asociado en GitHub, y este ha sido actualizado con el estado correspondiente (en progreso → cerrado).
3. **Ha sido revisada por otro compañero.** La Pull Request correspondiente cuenta con al menos **una aprobación** de otro miembro del equipo antes de su integración.
4. **Cumple los criterios de aceptación.** La funcionalidad implementada satisface lo descrito en el Issue y no rompe funcionalidades existentes.

> ⚠️ Si alguno de estos puntos no se cumple, la tarea **no está terminada** y no puede integrarse a `develop`.

---

## 🌿 Convención de Ramas y Flujo de Trabajo

Nuestro repositorio sigue una estructura de ramas en **tres niveles** que garantiza estabilidad y trazabilidad en el desarrollo.

### Estructura de Ramas

#### 🟢 `main`
- Es la **rama principal** del proyecto y refleja el estado estable y productivo.
- **Está protegida**: cualquier cambio integrado aquí requiere **obligatoriamente** una Pull Request (PR) aprobada.
- No se permite hacer push directo sobre esta rama.

#### 🟡 `develop`
- Es la rama de **desarrollo e integración**, donde los desarrolladores integran sus tareas terminadas.
- Antes de empezar cualquier tarea, es **obligatorio crear un "Issue"** que la describa y permita llevar el seguimiento de su estado.
- Las PRs hacia `develop` deben cumplir el [Definition of Done](#-definition-of-done-dod).

#### 🔵 `feature/[nombre-tarea]`
- Son las ramas de **trabajo aislado** que cada desarrollador crea a partir de `develop` para implementar una tarea concreta.
- El nombre debe ser descriptivo y en minúsculas, usando guiones (ej.: `feature/login-usuario`, `feature/carrito-compras`).
- Una vez la tarea esté **completa y cumpla el DoD**, se realiza el **merge a `develop`** mediante Pull Request.

### Flujo de Trabajo Paso a Paso
1. **Crear el Issue** con la descripción de la tarea.
2. **Crear la rama** desde `develop`: `git checkout -b feature/[nombre-tarea] develop`
3. **Desarrollar** la tarea en la rama feature.
4. **Verificar el DoD** (funciona localmente, criterios de aceptación, etc.).
5. **Abrir una Pull Request** hacia `develop` y solicitar revisión a otro compañero.
6. **Merge a `develop`** tras la aprobación.
7. **PR de `develop` a `main`** cuando se cierre una versión estable.

---

## 🧭 Buenas Prácticas

- 🔹 Haz **commits atómicos** con mensajes claros (ej.: `feat: agrega validación de email`).
- 🔹 Mantén tu rama `feature` **actualizada** con `develop` para evitar conflictos.
- 🔹 **No subas** código comentado, credenciales ni archivos innecesarios.
- 🔹 Revisa las PRs de tus compañeros con **feedback constructivo y respetuoso**.
- 🔹 Ante cualquier duda sobre el flujo, consulta al **Scrum Master** o al **Product Owner**.

---

<p align="center">
  <sub>Hecho con 💙 por el equipo de <strong>kursa</strong></sub>
</p>
