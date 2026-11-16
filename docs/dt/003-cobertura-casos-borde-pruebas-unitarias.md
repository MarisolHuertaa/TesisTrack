# DT-003: Cobertura limitada de casos de borde y errores en funciones locales

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

## Deuda Técnica DT-003

| Campo | Detalle |
| --- | --- |
| **Descripción** | Las pruebas unitarias actuales validan únicamente el "camino feliz" (ingreso de datos válidos), omitiendo la validación de casos límite o entradas corruptas. |
| **Ubicación** | `TesisTrack-Backend/tests/unit/` |
| **Impacto / Consecuencias** | Riesgo de que funciones críticas fallen o devuelvan estados no controlados si un estudiante ingresa un formato inesperado de archivo o campos vacíos. |
| **Prioridad** | Media |
| **Solución propuesta** | Expandir la suite de Jest incluyendo pruebas unitarias específicas para manejo de excepciones, tipos de datos no válidos y cadenas vacías. |
| **Esfuerzo estimado** | M |
| **Responsable** | Equipo de Desarrollo |
| **Fecha de registro** | 2026-11-03 |
| **Estado** | Resuelta (2026-11-11) |

---

### Detalle
Aunque las 10 pruebas unitarias básicas verifican el flujo esperado de las funciones principales, no se han automatizado pruebas para evaluar el comportamiento del sistema cuando las funciones reciben datos nulos, formatos invalidados o archivos que exceden los límites.

### Criterios de Aceptación
- Incorporación de pruebas unitarias con Jest que fuercen y verifiquen el lanzamiento de errores ante entradas inválidas.
- Cobertura de pruebas en funciones de procesamiento de datos locales superior al 80%.

### Resolución (2026-11-11)
Las pruebas actuales cubren casos borde y entradas inválidas: archivos de exactamente 10 MB y de 10 MB + 1 byte, archivos vacíos, extensiones falsas, campos vacíos o con solo espacios, valores `null`/`undefined`, y respuestas 400, 401, 403, 404, 409 y 500. La cobertura de `utils/validaciones.js` es del 100 % de líneas. Ver `docs/CASOS_DE_PRUEBA.md`.
