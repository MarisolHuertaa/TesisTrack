# DT-008: El dictamen hace varias escrituras sin transacción

**Proyecto:** TesisTrack

| Campo | Detalle |
| --- | --- |
| **Descripción** | `emitirDictamen` ejecuta 5 escrituras seguidas (dictamen, estado de la entrega, estado y fase del proyecto, notificación) sin envolverlas en una transacción. |
| **Ubicación** | `TesisTrack-Backend/controllers/dictamenController.js` |
| **Impacto / Consecuencias** | Si una escritura falla a la mitad, los datos quedan inconsistentes: por ejemplo, un dictamen registrado sin que cambie el estado de la entrega. |
| **Prioridad** | Media |
| **Solución propuesta** | Usar `db.getConnection()` + `beginTransaction()` / `commit()` / `rollback()` de `mysql2`. |
| **Esfuerzo estimado** | S |
| **Responsable** | Equipo de Backend |
| **Fecha de registro** | 2026-11-11 |
| **Estado** | Pendiente |

### Criterios de Aceptación
- Si cualquier escritura falla, ninguna de las 5 queda guardada.
- Una prueba simula el fallo a la mitad del proceso y lo verifica.
