# DT-005: Dashboard del asesor con datos fijos

**Proyecto:** TesisTrack

| Campo | Detalle |
| --- | --- |
| **Descripción** | `TeacherDashboard.jsx` muestra una lista de alumnos y unos KPI escritos a mano (8 asignados, 3 pendientes, 2 exámenes), sin consultar la API. |
| **Ubicación** | `TesisTrack-Frontend/src/components/dashboards/TeacherDashboard.jsx` |
| **Impacto / Consecuencias** | El flujo 2 de la demo (revisión y dictamen) no se puede mostrar en pantalla aunque la API ya funciona. |
| **Prioridad** | Alta |
| **Solución propuesta** | Consumir `GET /api/entregas/pendientes`, `POST /api/entregas/:id/dictamen` y `/api/disponibilidad`, y agregar el popup de confirmación acordado en el Sprint Review. |
| **Esfuerzo estimado** | M |
| **Responsable** | Laura García · Isaí Plascencia |
| **Fecha de registro** | 2026-11-11 |
| **Estado** | En progreso |

### Criterios de Aceptación
- La bandeja muestra las entregas `EN_REVISION` reales del docente que inició sesión.
- Enviar "Con observaciones" o "Rechazado" sin comentario muestra el mensaje del backend.
- Antes de enviar el dictamen se pide confirmación.
