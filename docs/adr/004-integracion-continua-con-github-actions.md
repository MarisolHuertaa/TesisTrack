# ADR 004. Automatización de Pruebas mediante GitHub Actions (CI/CD)

* **Estado:** Aceptado
* **Módulo Afectado:** `.github/workflows/pruebas.yml` / Repositorio General

---

## Contexto
Con el fin de evitar que se introduzcan errores en la rama principal (`main`) al subir nuevo código, era necesario contar con un sistema de Integración Continua (CI) que ejecutara de manera automática toda la suite de pruebas cada vez que se realice un `push` o `pull_request` al repositorio.

---

## Decisión
Se decidió implementar **GitHub Actions** configurando el archivo `.github/workflows/pruebas.yml`. El flujo se configuró para levantar un entorno Node.js, posicionarse en el directorio `TesisTrack-Backend/` y ejecutar automáticamente el comando `npm test` verificando la validez de los 30 casos de prueba.

---

## Consecuencias

### Positivas
* Validación automática e inmediata del código en la nube con cada cambio subido.
* Detección temprana de regresiones o fallos en las pruebas unitarias e integración.
* Visibilidad del estado del proyecto para todos los colaboradores del repositorio.

### Negativas / Riesgos
* Dependencia de la disponibilidad de minutos de ejecución de GitHub Actions.

---

## Historial
* **2026-11-11:** el workflow usa Node.js 20, caché de `npm`, `npm ci` (instala exactamente las versiones del `package-lock.json`) y `npm run test:coverage` (publica la tabla de cobertura en el log de cada ejecución).
