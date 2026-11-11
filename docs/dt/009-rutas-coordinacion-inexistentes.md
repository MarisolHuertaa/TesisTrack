# DT-009: El panel de coordinación llama a rutas que no existen

**Proyecto:** TesisTrack

| Campo | Detalle |
| --- | --- |
| **Descripción** | `DashboardCoordinacion.jsx` llama a `/api/coordinacion/proyectos`, `/api/coordinacion/proyectos/:id/asignar` y `/api/coordinacion/proyectos/:id/acta-qr`, que no existen en el backend. |
| **Ubicación** | `TesisTrack-Frontend/src/pages/DashboardCoordinacion.jsx` · `TesisTrack-Backend/routes/` |
| **Impacto / Consecuencias** | El panel de coordinación no muestra datos reales. Además, `acta-qr` corresponde a la HU-09, que está fuera del MVP (*Won't*). |
| **Prioridad** | Alta |
| **Solución propuesta** | Crear `routes/coordinacionRoutes.js` (con `requireRol(3)`) y registrarlo en `app.js`. Implementar el listado con semáforo (HU-08) y la asignación de asesor. Quitar u ocultar la llamada a `acta-qr`. Agregar sus pruebas. |
| **Esfuerzo estimado** | M |
| **Responsable** | Gaizka Camacho · Héctor Padilla |
| **Fecha de registro** | 2026-11-11 |
| **Estado** | En progreso |

### Criterios de Aceptación
- El panel lista los proyectos reales con su semáforo: verde < 7 días, amarillo 8–14 días, rojo > 15 días sin respuesta.
- Las rutas nuevas tienen pruebas de integración y todas pasan en GitHub Actions.
