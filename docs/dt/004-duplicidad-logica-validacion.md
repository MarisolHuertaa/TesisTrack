# DT-004: Duplicidad de lógica de validación de datos en el cliente

**Proyecto:** TesisTrack   
**Total de deudas registradas:** 4  

---

## Resumen

| Prioridad | Cantidad | Resueltas |
| --- | --- | --- |
| Alta | 1 | 0 |
| Media | 3 | 0 |
| Baja | 0 | 0 |
| **Total** | **4** | **0** |

---

## Deuda Técnica DT-004

| Campo | Detalle |
| --- | --- |
| **Descripción** | La lógica para validar formularios (correo institucional, peso de PDFs, campos obligatorios) se encuentra duplicada en múltiples componentes de la interfaz. |
| **Ubicación** | `TesisTrack-Frontend/src/components/` |
| **Impacto / Consecuencias** | Dificulta el mantenimiento; si las reglas del proyecto cambian (ej. cambiar el límite de tamaño de archivo), hay que editar varios archivos manualmente con riesgo de omitir alguno. |
| **Prioridad** | Media |
| **Solución propuesta** | Extraer todas las reglas de validación a un módulo o utilidad centralizada (`utils/validators.js`) reutilizable en todo el proyecto. |
| **Esfuerzo estimado** | S |
| **Responsable** | Equipo de Desarrollo |
| **Fecha de registro** | 2026-11-03 |
| **Estado** | Pendiente |

---

### Detalle
Actualmente cada vista que solicita entradas al usuario (como la subida de avances o el reporte de bloqueos) implementa sus propias expresiones regulares y condicionales de validación directamente en el código del componente, en lugar de importar funciones auxiliares centralizadas.

### Criterios de Aceptación
- Creación del archivo `src/utils/validators.js` con funciones puras de validación.
- Refactorización de componentes para consumir las validaciones desde el módulo centralizado.
- Verificación de que no existan expresiones regulares duplicadas en la capa de interfaz.