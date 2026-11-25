# 004. Manejo de Persistencia de Datos y Limpieza en el Entorno de Pruebas

* **Estado:** Resuelto
* **Módulo Afectado:** TesisTrack-Backend / Base de Datos de Pruebas

---

## Contexto
Al ejecutar repetidamente el conjunto de 10 pruebas de integración (`tests/integration.test.js`), los registros insertados en ejecuciones anteriores (como usuarios de prueba o registros de avances) colisionaban con las nuevas peticiones. Esto generaba errores de duplicidad en campos únicos (como el correo de estudiante `@estudiante.edu`) y falsos negativos en las aserciones de consulta.

---

## Decisión
Se implementaron hooks de ciclo de vida en Jest (`beforeEach` y `afterAll`) combinados con un script de limpieza automática de base de datos en memoria para el entorno de pruebas (`NODE_ENV=test`). Esto asegura que cada caso de prueba de integración se ejecute en un entorno aislado e independiente, restaurando el estado de la base de datos tras finalizar la suite.

---

## Consecuencias

### Positivas
* Se garantizó la idempotencia de los 10 casos de prueba de integración (CP-11 a CP-20), permitiendo ejecutarlos de forma continua sin fallos por datos residuales.
* Se previno la contaminación de datos en entornos de desarrollo local.

### Negativas / Riesgos
* Requiere mantener sincronizados los *fixtures* y scripts de sembrado (*seeds*) de datos de prueba a medida que el esquema de la base de datos evolucione.