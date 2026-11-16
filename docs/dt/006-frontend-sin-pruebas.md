# DT-006: El frontend no tiene pruebas automatizadas

**Proyecto:** TesisTrack

| Campo | Detalle |
| --- | --- |
| **Descripción** | Las 30 pruebas cubren el backend. Ningún componente de React tiene pruebas. |
| **Ubicación** | `TesisTrack-Frontend/src/` |
| **Impacto / Consecuencias** | Errores de interfaz, como la "entrega simulada" del bloqueo 007, pueden llegar a `main` sin ser detectados. |
| **Prioridad** | Media |
| **Solución propuesta** | Agregar Vitest + React Testing Library para los formularios clave (login, subida de PDF, dictamen) y evaluar Playwright para un flujo de punta a punta. |
| **Esfuerzo estimado** | L |
| **Responsable** | Equipo de Desarrollo |
| **Fecha de registro** | 2026-11-11 |
| **Estado** | Pendiente |

### Criterios de Aceptación
- `npm test` en `TesisTrack-Frontend` ejecuta al menos las pruebas de login y de subida de PDF.
- GitHub Actions corre las pruebas del frontend junto con las del backend.
