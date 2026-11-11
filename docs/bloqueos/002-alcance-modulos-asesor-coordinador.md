# 002. Limitación de Alcance por Ausencia de Módulos de Asesor y Coordinador

* **Estado:** Resuelto en el backend (2026-11-11)
* **Módulo Afectado:** Casos de Prueba / Módulo General

---

## Contexto
El flujo completo del sistema TesisTrack involucra la interacción de tres roles: Estudiante, Asesor y Coordinador. Sin embargo, las vistas y endpoints correspondientes a los módulos de revisión del Asesor y aprobación del Coordinador aún no se encuentran implementados en el Backend. Esto generó un bloqueo para realizar pruebas end-to-end (E2E) que simularan el ciclo de vida completo de una tesis.

---

## Decisión
Se decidió acotar el alcance del entregable de pruebas automatizadas al 100% de la funcionalidad desarrollada hasta el momento: el **Dashboard del Estudiante**. Se diseñó una matriz de 30 casos de prueba (10 unitarios, 10 de integración y 10 de aceptación) enfocado exclusivamente en las acciones del usuario Estudiante (autenticación, subida de avances, consulta de progreso y reporte de bloqueos).

---

## Consecuencias

### Positivas
* Se garantizó una cobertura del 100% de pruebas exitosas sobre el código funcional existente sin generar dependencias bloqueantes.
* Se estructuró un conjunto de pruebas sólido y modular fácil de replicar para futuros módulos.

### Negativas / Riesgos
* Queda pendiente como deuda técnica la creación de pruebas automatizadas para los flujos de interacción entre múltiples roles cuando dichos módulos sean construidos.

---

## Actualización (2026-11-11)
Se implementaron en el backend las rutas del asesor (bandeja de pendientes, dictamen y disponibilidad) y del agendado de examen, con pruebas de aceptación que recorren flujos entre roles (CP-21 a CP-30). Las interfaces están en desarrollo: el dashboard del asesor (Laura García e Isaí Plascencia) y el panel de coordinación (Gaizka Camacho y Héctor Padilla). Las rutas `/api/coordinacion/*` siguen pendientes (DT-009).
