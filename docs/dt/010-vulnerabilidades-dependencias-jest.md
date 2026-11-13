# DT-010: Vulnerabilidades en dependencias de desarrollo (Jest)

**Proyecto:** TesisTrack

| Campo | Detalle |
| --- | --- |
| **Descripción** | `npm audit` reporta 19 vulnerabilidades (3 bajas, 16 moderadas) en `glob`, `minimatch` y `deepmerge`, que llegan como dependencias de Jest 30. La vulnerabilidad alta de `body-parser`, que sí se usa en producción, se corrigió con `npm audit fix`. |
| **Ubicación** | `TesisTrack-Backend/package-lock.json` (dependencias de desarrollo) |
| **Impacto / Consecuencias** | Bajo: Jest solo se usa para correr las pruebas y no se incluye en el servidor. `npm audit fix --force` no es opción porque bajaría Jest a la versión 25 y rompería las pruebas. |
| **Prioridad** | Baja |
| **Solución propuesta** | Actualizar Jest cuando publique una versión que use dependencias corregidas, y revisar `npm audit --omit=dev` en cada sprint. |
| **Esfuerzo estimado** | S |
| **Responsable** | Equipo de Desarrollo |
| **Fecha de registro** | 2026-11-11 |
| **Estado** | Pendiente |

### Criterios de Aceptación
- `npm audit --omit=dev` reporta 0 vulnerabilidades (cumplido al 2026-11-11).
- `npm audit` reporta 0 vulnerabilidades altas o críticas.
