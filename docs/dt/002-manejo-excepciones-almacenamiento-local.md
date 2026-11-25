# DT-002: Manejo de excepciones y persistencia de datos en almacenamiento local

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

## Deuda Técnica DT-002

| Campo | Detalle |
| --- | --- |
| **Descripción** | Ausencia de bloques de captura de excepciones (`try-catch`) al leer o escribir datos en el almacenamiento local del navegador (`localStorage`). |
| **Ubicación** | `TesisTrack-Frontend/src/services/` |
| **Impacto / Consecuencias** | Si el almacenamiento local está lleno, deshabilitado en el navegador o contiene un JSON corrupto, la aplicación se bloquea mostrando una pantalla en blanco sin notificar al usuario. |
| **Prioridad** | Media |
| **Solución propuesta** | Crear un módulo/wrapper para la gestión de `localStorage` que valide la integridad de los datos parseados y capture fallos con notificaciones visuales. |
| **Esfuerzo estimado** | M |
| **Responsable** | Equipo de Desarrollo |
| **Fecha de registro** | 2026-10-29 |
| **Estado** | Pendiente |

---

### Detalle
Las funciones de lectura y escritura operan asumiendo siempre un estado ideal del navegador. Si la cuota de memoria local se excede o se borran manualmente las claves desde las herramientas de desarrollo, las vistas del Dashboard fallan al intentar acceder a propiedades indefinidas (`undefined`).

### Criterios de Aceptación
- Implementación de un helper seguro para operaciones de lectura/escritura en `localStorage` con bloques `try-catch`.
- Notificación clara al usuario si los datos locales están corruptos o si no se pueden guardar sus cambios.
- Restauración automática a un estado inicial seguro en caso de error de lectura.