# 🧪 Casos de Prueba – TesisTrack

**Proyecto:** TesisTrack – Gestión de Titulación Universitaria
**Hito:** 2 – Demo de medio término (Semana 10)
**Framework:** Jest 30 + Supertest 7
**Resultado:** ✅ **30 / 30 pruebas aprobadas** · Cobertura de líneas: **87 %**

---

## 1. Resumen de ejecución

| Tipo de prueba | Archivo | Casos | Qué ejecuta | Estado |
|---|---|---|---|---|
| **Unitarias** | `tests/unit.test.js` | CP-01 a CP-10 | Funciones de `utils/validaciones.js` aisladas | ✅ 10/10 |
| **Integración** | `tests/integration.test.js` | CP-11 a CP-20 | Peticiones HTTP reales a la API (rutas + middlewares + controladores) | ✅ 10/10 |
| **Aceptación** | `tests/acceptance.test.js` | CP-21 a CP-30 | Criterios *Dado/Cuando/Entonces* del Backlog, recorriendo flujos completos | ✅ 10/10 |
| **Total** | | **30** | | ✅ **30/30** |

### Cobertura de código (`npm run test:coverage`)

| Módulo | % Líneas | % Ramas |
|---|---|---|
| `utils/validaciones.js` | 100 % | 89.6 % |
| `middlewares/authMiddleware.js` | 100 % | 100 % |
| `middlewares/upload.js` | 95.8 % | 80 % |
| `controllers/dictamenController.js` | 94.1 % | 94.4 % |
| `controllers/authController.js` | 87.2 % | 84.2 % |
| `controllers/examenController.js` | 82.4 % | 72.7 % |
| `controllers/entregaController.js` | 78.4 % | 50 % |
| `controllers/disponibilidadController.js` | 77.1 % | 81 % |
| `controllers/proyectoController.js` | 72.4 % | 40 % |
| **Total** | **87.3 %** | **81.3 %** |

---

## 2. Cómo ejecutar las pruebas

```bash
cd TesisTrack-Backend
npm install
npm test                 # corre las 30 pruebas
npm run test:coverage    # además genera el reporte de cobertura en /coverage
```

No se necesita MySQL ni un archivo `.env`: las pruebas usan una base de datos simulada en memoria (ver sección 3). Las mismas pruebas corren automáticamente en **GitHub Actions** en cada *push* y *Pull Request* (`.github/workflows/pruebas.yml`).

---

## 3. Estrategia de pruebas

```
            ▲  Aceptación (10)   → ¿El sistema cumple la historia de usuario?
           ▲▲▲ Integración (10)  → ¿La API responde bien a peticiones HTTP reales?
          ▲▲▲▲▲ Unitarias (10)   → ¿Cada regla de negocio funciona por sí sola?
```

- **Cada prueba ejecuta código real del proyecto.** Una prueba solo pasa si el sistema hace lo que el criterio exige; si alguien rompe esa lógica, la prueba falla (ver sección 6).
- **Patrón Preparar → Ejecutar → Verificar** en cada caso.
- **Casos positivos y negativos:** no solo se prueba que algo funcione, también que rechace lo que debe rechazar (archivos `.exe`, PDFs de más de 10 MB, tokens alterados, roles sin permiso).
- **Base de datos simulada (`tests/helpers/fakeDb.js`):** reemplaza a `config/db.js` con `jest.mock()`. Responde a las mismas consultas SQL que usan los controladores y guarda los datos en memoria, así que las pruebas de aceptación pueden recorrer un flujo completo (subir → dictaminar → avanzar fase → agendar examen). Se reinicia antes de cada prueba para que ninguna dependa de otra.
- **Validación adicional contra MariaDB real:** además de las pruebas automatizadas, los 3 flujos de la demo se ejecutaron manualmente con `curl` contra el servidor levantado sobre `SQUEMA.sql` + `DATA.sql` (sección 7).

### Datos de prueba

| Usuario | Rol | Uso en las pruebas |
|---|---|---|
| `tesistrack@alumnos.udg.mx` (id 1) | Estudiante | Dueño del proyecto 1 |
| `tesistrack@docentes.udg.mx` (id 2) | Docente – Asesor del proyecto 1 | Revisa y dictamina |
| `sinodal@docentes.udg.mx` (id 3) | Docente – Sinodal del proyecto 1 | Disponibilidad de horarios |
| `ajeno@docentes.udg.mx` (id 4) | Docente sin asignar | Casos de acceso denegado |
| `tesistrack@administracion.udg.mx` (id 5) | Coordinador | — |

Hitos simulados: fase 1 → `1.1` y `1.2`; fase 2 → `2.1`; fase 3 → `3.1`.

---

## 4. Matriz de casos de prueba

### 🟢 Pruebas unitarias (CP-01 a CP-10)

| ID | Caso | Entrada | Resultado esperado | Obtenido |
|---|---|---|---|---|
| CP-01 | Solo correos institucionales UdeG | `x@alumnos.udg.mx`, `x@academicos.udg.mx`, `x@gmail.com`, `x@udg.mx.com`, vacío | `true`, `true`, `false`, `false`, `false` | ✅ Pass |
| CP-02 | Reconoce PDF válido | `Anteproyecto_v1.pdf` y `TESIS.PDF` con MIME `application/pdf` | `true` | ✅ Pass |
| CP-03 | Rechaza archivos no PDF o disfrazados | `.exe`, `.docx`, `script.bat.pdf` con MIME falso, archivo sin extensión | `false` en todos | ✅ Pass |
| CP-04 | Límite de 10 MB (casos borde) | 1 B, 10 MB exactos, 10 MB + 1 B, 0, negativo, `NaN` | Solo los dos primeros son válidos | ✅ Pass |
| CP-05 | Versionado correlativo | 0, 1, 4 entregas previas | `v1.0`, `v2.0`, `v5.0` | ✅ Pass |
| CP-06 | Dictamen sin justificación | Comentario vacío, solo espacios, ausente | Inválido, con mensaje "justificación" | ✅ Pass |
| CP-07 | Tipos de dictamen permitidos | `APROBADO`, `CON_OBSERVACIONES`, `RECHAZADO`, `aprobado`, `PENDIENTE` | Válidos solo los 3 primeros | ✅ Pass |
| CP-08 | Avance de fase y porcentaje | Fases 1, 3, 4 | 2, 4, 4 (no pasa de Examen); 0 %, 25 %, 75 % | ✅ Pass |
| CP-09 | Regla para agendar examen | Proyectos con distintos estados y fases | Solo con dictamen aprobado o en fase 4, y sin observaciones | ✅ Pass |
| CP-10 | Formato de fecha y horario del frontend | `"11 de Noviembre de 2026"`, `"10:00 AM - 11:30 AM"`, fechas u horas inválidas | `2026-11-11`, `10:00:00-11:30:00`, `null` | ✅ Pass |

### 🔵 Pruebas de integración (CP-11 a CP-20)

| ID | Endpoint | Escenario | Resultado esperado | Obtenido |
|---|---|---|---|---|
| CP-11 | `POST /api/auth/register` | Registro con datos válidos | 201; contraseña guardada como hash bcrypt en `password_hash`, nunca en texto plano | ✅ Pass |
| CP-12 | `POST /api/auth/register` | Correo de Gmail / correo ya registrado | 400 en ambos | ✅ Pass |
| CP-13 | `POST /api/auth/login` | Credenciales correctas / contraseña incorrecta | 200 con token y rol, sin exponer el hash / 401 | ✅ Pass |
| CP-14 | `GET /api/auth/profile` | Token del login / sin token / token alterado | 200 / 401 / 403 | ✅ Pass |
| CP-15 | `POST /api/entregas/subir` | PDF válido para el hito 1.1 | 201, `v1.0`, `EN_REVISION`, registro en BD con URL del archivo | ✅ Pass |
| CP-16 | `POST /api/entregas/subir` | Archivo `.docx` | 400 "formato PDF" y nada guardado en BD | ✅ Pass |
| CP-17 | `POST /api/entregas/subir` | PDF de 10 MB + 1 byte | 400 "10 MB" y nada guardado en BD | ✅ Pass |
| CP-18 | Varias | Docente intenta subir / estudiante intenta dictaminar | 403 en ambos | ✅ Pass |
| CP-19 | `POST /api/disponibilidad` | Bloque válido / traslapado / hora fin antes que inicio | 201 / 409 / 400; solo 1 bloque guardado | ✅ Pass |
| CP-20 | `POST /api/auth/login` | Falla de conexión a la BD | 500 con mensaje genérico, sin filtrar detalles internos | ✅ Pass |

### 🟣 Pruebas de aceptación (CP-21 a CP-30)

| ID | Historia | Criterio (Dado / Cuando / Entonces) | Verificación | Obtenido |
|---|---|---|---|---|
| CP-21 | HU-02 c1 | **Dado** que el alumno reenvía un hito con observaciones, **cuando** da "Enviar a revisión", **entonces** recibe versión correlativa y su asesor la ve | v1 → `v1.0`, v2 → `v2.0`; en la bandeja del asesor aparece solo `v2` | ✅ Pass |
| CP-22 | HU-02 c3 | **Dado** que la carga finaliza con éxito, **entonces** se notifica al asesor asignado | 1 notificación `ENTREGA` al asesor; el sinodal no recibe | ✅ Pass |
| CP-23 | HU-04 c1, c2 | **Dado** que el comentario está vacío, **cuando** el docente envía observaciones, **entonces** se le pide justificación | 400 "justificación" sin registro; con texto → 201 | ✅ Pass |
| CP-24 | HU-04 c3 + HU-03 | **Dado** que el docente confirma el dictamen, **entonces** cambia el estatus y el estudiante es notificado | Entrega y proyecto en `CON_OBSERVACIONES`; notificación `DICTAMEN` visible en `/mi-proyecto` | ✅ Pass |
| CP-25 | HU-01 c3 | **Dado** que el asesor aprueba todos los hitos de la fase, **cuando** el estudiante actualiza su inicio, **entonces** la barra avanza | Fase 1 → 2, avance 25 %, asesor visible en `/mi-proyecto` | ✅ Pass |
| CP-26 | HU-01 c1 | **Dado** que falta aprobar un hito de la fase activa, **entonces** la siguiente sigue bloqueada | Aprobar solo 1.1 deja la fase en 1 | ✅ Pass |
| CP-27 | HU-04 (seguridad) | Solo docentes asignados dictaminan, una sola vez por entrega | Docente ajeno → 403; segundo dictamen → 409; entrega inexistente → 404 | ✅ Pass |
| CP-28 | HU-06 c1, c3 | **Dado** que el docente no ha configurado horarios, **entonces** ve un aviso; al marcar un bloque queda activo | Aviso presente → bloque Lunes 10:00-12:00 → aviso desaparece | ✅ Pass |
| CP-29 | HU-06 c2 + HU-07 c1 | **Dado** que el docente desmarca un bloque, **entonces** ya no se ofrece al estudiante | Se ofrecen solo bloques del comité (2, no el del docente ajeno); tras desmarcar queda 1 | ✅ Pass |
| CP-30 | HU-07 c2, c3 | Con observaciones el agendado está bloqueado; con dictamen aprobatorio se registra la solicitud | 403 bloqueado → 201 "Asignación Pendiente de Aula" → 4.ª opción 409 | ✅ Pass |

---

## 5. Evidencia de ejecución

Salida de `npx jest` (11/nov/2026, Node 22):

```
unit.test.js
  ✓ CP-01: acepta solo correos institucionales de la UdeG
  ✓ CP-02: reconoce un archivo PDF válido por tipo MIME y extensión
  ✓ CP-03: rechaza archivos que no son PDF o que fingen serlo
  ✓ CP-04: valida el límite de peso de 10 MB (casos borde)
  ✓ CP-05: asigna versiones correlativas a las entregas
  ✓ CP-06: un dictamen sin justificación no es válido
  ✓ CP-07: solo se aceptan los tres tipos de dictamen definidos
  ✓ CP-08: la línea de tiempo avanza de fase sin pasar de Examen
  ✓ CP-09: el examen solo se agenda con dictamen aprobatorio y sin observaciones
  ✓ CP-10: interpreta la fecha y el horario en el formato que envía el frontend

integration.test.js
  ✓ CP-11: POST /api/auth/register crea el usuario y guarda la contraseña hasheada
  ✓ CP-12: POST /api/auth/register rechaza correos no institucionales y duplicados
  ✓ CP-13: POST /api/auth/login devuelve un token válido y rechaza contraseña incorrecta
  ✓ CP-14: el token que entrega el login abre rutas protegidas; sin token o alterado, no
  ✓ CP-15: POST /api/entregas/subir guarda un PDF válido como versión v1.0 en revisión
  ✓ CP-16: POST /api/entregas/subir rechaza archivos que no son PDF y no los registra
  ✓ CP-17: POST /api/entregas/subir rechaza PDFs de más de 10 MB
  ✓ CP-18: las rutas validan el rol (un docente no puede subir entregas ni un alumno dictaminar)
  ✓ CP-19: POST /api/disponibilidad registra un bloque y rechaza bloques traslapados o inválidos
  ✓ CP-20: si la base de datos falla, la API responde 500 con un mensaje controlado

acceptance.test.js
  ✓ CP-21 (HU-02 c1) … recibe versión correlativa y su asesor la ve
  ✓ CP-22 (HU-02 c3) … el asesor asignado recibe una notificación de entrega
  ✓ CP-23 (HU-04 c1/c2) … se le pide una justificación
  ✓ CP-24 (HU-04 c3 + HU-03 c1) … el estatus cambia y el estudiante es notificado
  ✓ CP-25 (HU-01 c3) … la barra avanza a la siguiente fase
  ✓ CP-26 (HU-01 c1) … la fase siguiente permanece bloqueada
  ✓ CP-27 (HU-04 seguridad) … no asignado no dictamina; no se dictamina dos veces
  ✓ CP-28 (HU-06 c1/c3) … ve un aviso; al marcar un bloque, queda activo
  ✓ CP-29 (HU-06 c2 + HU-07 c1) … ese horario ya no se ofrece al estudiante
  ✓ CP-30 (HU-07 c2/c3) … bloqueado con observaciones; hasta 3 opciones con dictamen

Test Suites: 3 passed, 3 total
Tests:       30 passed, 30 total
```

> 📸 Agregar aquí la captura de la pestaña **Actions** de GitHub con el workflow en verde.

---

## 6. Defectos encontrados por las pruebas

Al reemplazar las pruebas de marcador de posición (`expect(true).toBe(true)`) por pruebas que ejecutan el código, aparecieron defectos reales que ya se corrigieron:

| # | Defecto | Detectado por | Impacto | Corrección |
|---|---|---|---|---|
| D-01 | El registro insertaba la contraseña en la columna `password`, pero en `SQUEMA.sql` se llama `password_hash` | CP-11 | Todo registro nuevo fallaba con error 500 | `authController.js` usa `password_hash` |
| D-02 | El login firmaba el JWT con `'clave_secreta_default'` y el middleware lo verificaba con `'clave_secreta_jwt'` | CP-14 y 14 pruebas más | Sin `JWT_SECRET` en `.env`, todas las rutas protegidas respondían 403 | Secreto centralizado en `config/jwt.js` |
| D-03 | El frontend llamaba a `/api/entregas/subir` y `/api/proyectos/confirmar-examen`, que no existían en el backend | CP-15, CP-30 | La subida de PDF y el agendado fallaban con 404 (el frontend mostraba éxito simulado) | Rutas implementadas |
| D-04 | `DATA.sql` tenía filas de entregas bajo un `INSERT INTO dictamenes` | Carga de datos en MariaDB (sección 7) | El script se detenía y no cargaba notificaciones, disponibilidad ni solicitudes | Sección de entregas unificada con `hito_id` |

### Las pruebas detectan errores (verificación por mutación)

Para comprobar que las pruebas no pasan "siempre", se reintrodujo cada error a propósito y se observó cuántas fallaban:

| Error introducido a propósito | Pruebas que fallaron |
|---|---|
| Volver a insertar en la columna `password` (D-01) | 1 (CP-11) |
| Volver a usar secretos JWT distintos (D-02) | 15 |
| Permitir PDFs de hasta 20 MB | 1 (CP-04) |
| Avanzar de fase sin aprobar todos los hitos | 2 (CP-25, CP-26) |
| Permitir agendar examen con observaciones pendientes | 1 (CP-09) |
| **Código correcto** | **0 – 30/30 pasan** |

---

## 7. Validación manual contra MariaDB (flujos de la demo)

Servidor levantado con `SQUEMA.sql` + `DATA.sql` + `sembrarHashes.js`:

| Flujo del guion de demo | Petición | Respuesta obtenida |
|---|---|---|
| 1 – Carga de avance | Marisol sube `Marco_Teorico_v2.pdf` (hito 2.1) | `201` · `v2.0` · `EN_REVISION` · asesor notificado |
| 1 – Formato inválido | Marisol sube `avance.docx` | `400` "Solo se permiten archivos en formato PDF" |
| 2 – Bandeja docente | Mtra. María Rosas consulta pendientes | Aparece la entrega `2.1 v2.0` de Marisol |
| 2 – Dictamen sin comentario | `CON_OBSERVACIONES` con comentario vacío | `400` "Debes redactar una justificación" |
| 2 – Avance de fase | Se aprueban los hitos 2.1, 2.2 y 2.3 | `fase_avanzo: true` · la línea de tiempo pasa a fase 3 (50 %) |
| 3 – Examen bloqueado | Marisol (fase 3, sin dictamen final) intenta agendar | `403` "aún no tiene dictamen aprobatorio" |
| 3 – Disponibilidad | Mtra. Rocío Padilla marca Lun 16/nov 10:00-12:00 | `201` Bloque registrado |
| 3 – Solicitud de examen | Isaí (dictamen aprobado) solicita fecha | `201` · "Asignación Pendiente de Aula" |

---

## 8. Fuera del alcance de estas pruebas

- **Frontend (React):** no hay pruebas de componentes; queda registrado como deuda técnica.
- **Módulo de coordinación (`/api/coordinacion/*`, acta con QR):** fuera del MVP según el Backlog (HU-08 *Could*, HU-09 *Won't*).
- **Notificaciones push al celular (HU-03 c1/c2):** el MVP es web; se verifica la notificación dentro de la plataforma.
