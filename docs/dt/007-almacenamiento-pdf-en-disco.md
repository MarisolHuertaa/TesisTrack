# DT-007: Los PDF se guardan en el disco del servidor

**Proyecto:** TesisTrack

| Campo | Detalle |
| --- | --- |
| **Descripción** | Multer guarda los archivos en `TesisTrack-Backend/uploads/` (ver ADR 006). |
| **Ubicación** | `TesisTrack-Backend/middlewares/upload.js` |
| **Impacto / Consecuencias** | En Render o Vercel el disco es temporal: los PDF se borran en cada reinicio o despliegue. |
| **Prioridad** | Alta (antes del despliegue) |
| **Solución propuesta** | Subir los archivos a un almacenamiento en la nube (Cloudinary, Supabase Storage o Amazon S3) y guardar en `entregas.archivo_url` la URL pública. |
| **Esfuerzo estimado** | M |
| **Responsable** | Equipo de Backend |
| **Fecha de registro** | 2026-11-11 |
| **Estado** | Pendiente |

### Criterios de Aceptación
- Un PDF subido sigue disponible después de reiniciar el servidor desplegado.
- Las pruebas CP-15 a CP-17 siguen pasando.
