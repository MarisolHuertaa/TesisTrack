# ADR 003. Uso de Jest como Framework Principal de Pruebas Automatizadas

* **Estado:** Aceptado
* **Módulo Afectado:** TesisTrack-Backend / Pruebas

---

## Contexto
Para garantizar la calidad y robustez del software en el módulo del Dashboard del Estudiante, se requería seleccionar una herramienta de testing automatizado compatible con el entorno Node.js del backend. Se evaluaron alternativas como Mocha/Chai y Jest para cubrir los tres niveles de pruebas exigidos: unitarias, de integración y de aceptación (E2E).

---

## Decisión
Se decidió adoptar **Jest** como el framework estándar para la suite de pruebas del backend, complementado con **Supertest** para hacer peticiones HTTP reales a la API en las pruebas de integración y aceptación. La decisión se basó en su configuración mínima (*zero-config*), soporte nativo para aserciones, ejecución paralela de tests y la facilidad para generar reportes de ejecución claros en consola y en herramientas de CI/CD.

---

## Consecuencias

### Positivas
* Centralización de las 30 pruebas automatizadas (10 unitarias, 10 de integración y 10 de aceptación) en una sola herramienta.
* Reporte de cobertura integrado (`npm run test:coverage`), sin instalar herramientas adicionales.
* Integración rápida y sin dependencias complejas dentro de `package.json`.
* Ejecución veloz de los test suites con tiempos de respuesta reducidos.

### Negativas / Riesgos
* Para pruebas E2E avanzadas de interfaz gráfica en el frontend, Jest requerirá complementarse en el futuro con herramientas dedicadas a la capa visual como Playwright o Cypress.
* Las pruebas de integración y aceptación usan una base de datos simulada (ver ADR 005).

---

## Historial
* **2026-11-11:** se reemplazaron las 30 pruebas de marcador de posición (`expect(true).toBe(true)`) por pruebas que ejecutan el código real, y se agregó Supertest.
