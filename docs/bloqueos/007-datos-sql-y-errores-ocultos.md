# 007. Script de Datos Incompleto y Errores Ocultos en el Frontend

* **Estado:** Resuelto en el backend · Pendiente en el frontend
* **Tipo:** Técnico
* **Nivel de escalamiento:** Nivel 2 (equipo de desarrollo)
* **Responsables:** Equipo de Backend (datos y rutas) · Marisol Huerta (panel del estudiante)
* **Fecha de registro:** 2026-11-11

---

## Contexto
Al preparar la demo de medio término se detectaron tres problemas que se ocultaban entre sí:
1. `DATA.sql` se detenía en la línea 436 con `Error 1136: Column count doesn't match`: había filas de **entregas** bajo un encabezado `INSERT INTO dictamenes`. Por eso nunca se cargaban notificaciones, disponibilidad ni solicitudes de examen.
2. El frontend llamaba a rutas que **no existían** en el backend (`/api/entregas/subir`, `/api/proyectos/confirmar-examen`), que respondían 404.
3. En `StudentDashboard.jsx`, el bloque `catch` de la subida y del agendado **simulaba éxito**: mostraba la entrega como enviada aunque la petición hubiera fallado. Por eso nadie notó los puntos 1 y 2.

---

## Decisión
* Unificar la sección de entregas de `DATA.sql` en una sola inserción con `hito_id` (PR #5).
* Implementar las rutas faltantes (PR #7) y cubrirlas con pruebas automatizadas (PR #8).
* **Pendiente:** quitar la "entrega simulada" del frontend y mostrar el mensaje de error que devuelve el backend.

---

## Consecuencias

### Positivas
* `DATA.sql` carga completo: 112 entregas, 48 notificaciones, 22 bloques de disponibilidad y 10 solicitudes de examen.
* Los 3 flujos de la demo funcionan contra la base de datos real.

### Negativas / Riesgos
* Mientras el frontend siga simulando éxito, la pantalla puede mostrar una acción como exitosa aunque el backend la haya rechazado. Para verificar en la demo hay que consultar la base de datos.
