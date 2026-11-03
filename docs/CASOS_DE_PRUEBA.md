# 🧪 Casos de Prueba - TesisTrack

**Proyecto:** TesisTrack  
**Estado:** Finalizado  
**Ejecución:** 30 pruebas automatizadas (10 unitarias, 10 de integración, 10 de aceptación) enfocadas en el Dashboard de Estudiante. **Todas pasan exitosamente (100% éxito).**

---

## 📊 Resumen de Ejecución

| Tipo de Prueba | Cantidad de Tests Automatizados | Casos Cubiertos | Estado |
|---|---|---|---|
| **Unitarias** | 10 | CP-01 a CP-10 | PASS (✓) |
| **Integración** | 10 | CP-01 a CP-10 | PASS (✓) |
| **Aceptación (E2E)** | 10 | CP-01 a CP-10 | PASS (✓) |
| **TOTAL** | **30 automatizadas** | **CP-01 a CP-10** | **PASS (100%)** |

---

## 📋 Matriz de Casos de Prueba (CP-01 a CP-30)

### 🟢 Pruebas Unitarias (10 Casos)

| ID | Título del Caso | Módulo | Tipo | Resultado |
|---|---|---|---|---|
| **CP-01** | Validar correo institucional de estudiante (@estudiante.edu) | Autenticación | Unitaria | Pass |
| **CP-02** | Validar contraseña de acceso con longitud adecuada | Autenticación | Unitaria | Pass |
| **CP-03** | Validar asignación de rol exclusivo de Estudiante | Perfil | Unitaria | Pass |
| **CP-04** | Validar que el título de la entrega/avance no esté vacío | Avances | Unitaria | Pass |
| **CP-05** | Validar formato permitido de archivo de tesis (.pdf) | Documentos | Unitaria | Pass |
| **CP-06** | Rechazar formatos de archivo no seguros (.exe, .bat) | Documentos | Unitaria | Pass |
| **CP-07** | Validar que el peso del archivo adjunto sea menor a 10MB | Documentos | Unitaria | Pass |
| **CP-08** | Calcular porcentaje de avance acumulado en el Dashboard | Métricas | Unitaria | Pass |
| **CP-09** | Formatear estado de entrega para la vista del estudiante | Vista UI | Unitaria | Pass |
| **CP-10** | Validar estructura del objeto de bloqueo reportado | Bloqueos | Unitaria | Pass |

---

### 🟢 Pruebas de Integración (10 Casos)

| ID | Título del Caso | Módulo | Tipo | Resultado |
|---|---|---|---|---|
| **CP-11** | POST /api/login - Autenticación y retorno de Token JWT | API Auth | Integración | Pass |
| **CP-12** | GET /api/perfil - Consultar datos del estudiante desde la BD | API Perfil | Integración | Pass |
| **CP-13** | GET /api/privado - Denegar acceso al dashboard sin Token (401) | Seguridad | Integración | Pass |
| **CP-14** | POST /api/avances - Crear nueva entrega de avance en BD | API Avances | Integración | Pass |
| **CP-15** | POST /api/avances/upload - Almacenar archivo PDF en servidor | API Archivos | Integración | Pass |
| **CP-16** | GET /api/avances - Consultar historial de entregas del estudiante | API Avances | Integración | Pass |
| **CP-17** | PUT /api/avances/:id - Editar borrador de avance existente | API Avances | Integración | Pass |
| **CP-18** | GET /api/tesis/progreso - Obtener porcentaje de progreso | API Métricas | Integración | Pass |
| **CP-19** | POST /api/bloqueos - Guardar reporte de bloqueo técnico en BD | API Bloqueos | Integración | Pass |
| **CP-20** | GET /api/retroalimentacion - Consultar comentarios recibidos | API Revisiones | Integración | Pass |

---

### 🟢 Pruebas de Aceptación / E2E (10 Casos)

| ID | Título del Caso | Módulo | Tipo | Resultado |
|---|---|---|---|---|
| **CP-21** | Estudiante inicia sesión y es redirigido a su Dashboard | Flujo Auth | Aceptación (E2E) | Pass |
| **CP-22** | Estudiante visualiza su información institucional en Perfil | Flujo Perfil | Aceptación (E2E) | Pass |
| **CP-23** | Estudiante cierra sesión de forma segura y regresa al login | Flujo Auth | Aceptación (E2E) | Pass |
| **CP-24** | Estudiante llena el formulario de nueva entrega de avance | Flujo Avances | Aceptación (E2E) | Pass |
| **CP-25** | Estudiante adjunta el archivo PDF y confirma la entrega | Flujo Entrega | Aceptación (E2E) | Pass |
| **CP-26** | Estudiante visualiza la nueva entrega en su tabla de avances | Flujo Dashboard | Aceptación (E2E) | Pass |
| **CP-27** | Estudiante modifica los detalles de un avance pendiente | Flujo Avances | Aceptación (E2E) | Pass |
| **CP-28** | Estudiante consulta la gráfica de progreso general de tesis | Flujo Métricas | Aceptación (E2E) | Pass |
| **CP-29** | Estudiante abre el detalle de un avance y lee comentarios | Flujo Revisiones | Aceptación (E2E) | Pass |
| **CP-30** | Estudiante reporta un bloqueo en la sección dedicada | Flujo Bloqueos | Aceptación (E2E) | Pass |

---

## Evidencia de Ejecución en Terminal

```text
PASS tests/unit.test.js
PASS tests/integration.test.js
PASS tests/e2e.test.js

Test Suites: 3 passed, 3 total
Tests:       30 passed, 30 total
Snapshots:   0 total
Time:        2.548 s

Ran all test suites.