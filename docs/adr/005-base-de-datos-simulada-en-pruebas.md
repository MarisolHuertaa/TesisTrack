# ADR 005. Base de Datos Simulada en Memoria para las Pruebas Automatizadas

* **Estado:** Aceptado
* **Fecha:** 2026-11-11
* **Módulo Afectado:** TesisTrack-Backend / Pruebas

---

## Contexto
Las 30 pruebas originales eran marcadores de posición (`expect(true).toBe(true)`): pasaban siempre sin ejecutar el código del proyecto. Al reemplazarlas por pruebas reales había que decidir contra qué base de datos correrían. GitHub Actions no tiene MySQL instalado, y cada integrante tiene una configuración local distinta (XAMPP/MariaDB o MySQL Server). Además, las pruebas de aceptación necesitan recorrer flujos completos (subir PDF → dictaminar → avanzar de fase → agendar examen), así que un simple *mock* por consulta no bastaba.

---

## Decisión
1. **Separar `app.js` de `server.js`.** `app.js` configura Express y sus rutas sin llamar a `app.listen()`, y `server.js` solo la enciende. Así Supertest puede hacer peticiones HTTP a la API sin abrir un puerto.
2. **Base de datos simulada en memoria** (`tests/helpers/fakeDb.js`). Reemplaza a `config/db.js` mediante `jest.mock()` en `tests/setup.js`. Responde a las mismas consultas SQL que usan los controladores, guarda los datos en arreglos y devuelve el mismo formato que `mysql2` (`[filas]` o `[{ insertId }]`). Se reinicia antes de cada prueba.

---

## Consecuencias

### Positivas
* Las pruebas corren en segundos, sin MySQL ni archivo `.env`, en cualquier computadora y en GitHub Actions.
* Cada prueba es independiente: no quedan datos de una ejecución a otra (resuelve el bloqueo 004).
* Las pruebas de aceptación recorren flujos completos con varios roles y verifican los datos que quedaron guardados.
* Detectaron 4 defectos reales (ver `docs/CASOS_DE_PRUEBA.md`, sección 6).

### Negativas / Riesgos
* **No detecta errores de sintaxis SQL** ni de nombres de columnas, porque la simulación no interpreta SQL. *Mitigación:* los flujos de la demo se validan también contra MariaDB con `SQUEMA.sql` + `DATA.sql` (sección 7 de `CASOS_DE_PRUEBA.md`).
* Cada consulta nueva en un controlador requiere agregar su respuesta en `fakeDb.js`. Si falta, la prueba falla con el mensaje `fakeDb: consulta no soportada`, lo que hace evidente qué agregar.

---

## Alternativas
* **MySQL real en GitHub Actions** (servicio `mysql` en el workflow): más fiel, pero más lento y frágil, y obliga a cada integrante a tener una base de datos de pruebas aparte.
* **SQLite en memoria:** su dialecto SQL difiere de MySQL (`<=>`, `DATE_FORMAT`, `ENUM`), por lo que habría que reescribir consultas.
* **Mocks por consulta con `jest.fn().mockResolvedValueOnce()`:** sirven para pruebas aisladas, pero dependen del orden de las consultas y no permiten recorrer flujos completos.
