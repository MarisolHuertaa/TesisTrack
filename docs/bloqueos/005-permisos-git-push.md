# 005. Denegación de Permisos de Git (Error 403) al Hacer Push

* **Estado:** En resolución
* **Tipo:** Acceso / Permisos
* **Nivel de escalamiento:** Nivel 3 (administradora del repositorio)
* **Responsables:** Héctor Padilla / Marisol Huerta
* **Fecha de registro:** 2026-10-29

---

## Contexto
Al ejecutar `git push origin main` contra `MarisolHuertaa/TesisTrack`, la terminal mostraba `Error 403: Permission denied`. Los integrantes del equipo no estaban registrados como colaboradores del repositorio, así que solo la dueña podía subir cambios. Esto explica que la mayoría de los commits del primer sprint aparezcan bajo una sola cuenta.

**Intentos previos:**
1. Confirmar las credenciales locales de Git en macOS.
2. Reintentar el `push` desde VS Code.

---

## Decisión
* Invitar a los cuatro integrantes como colaboradores desde **Settings → Collaborators**.
* Dejar de hacer `push` directo a `main`: cada cambio entra mediante una rama propia y un **Pull Request** revisado por otro integrante (ver la sección Contribución del README y `.github/pull_request_template.md`).

---

## Consecuencias

### Positivas
* Cada integrante puede publicar sus ramas, abrir PRs y revisar los de los demás desde su propia cuenta.
* El historial de commits y revisiones refleja la participación real del equipo.

### Negativas / Riesgos
* Mientras no acepten la invitación, los integrantes no pueden publicar ramas. *Acción:* confirmar que los 4 aceptaron la invitación.
