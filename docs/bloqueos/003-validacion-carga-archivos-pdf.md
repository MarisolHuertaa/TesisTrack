# 003. Errores en la Simulación de Carga de Archivos Adjuntos (.PDF)

* **Estado:** Resuelto
* **Módulo Afectado:** TesisTrack-Backend / Documentos y Avances

---

## Contexto
Durante la implementación de las pruebas de integración para el módulo de entregas de avances de tesis, la API fallaba al simular la carga de documentos adjuntos. Los archivos de prueba pesados o con formatos no estandarizados causaban excepciones de tiempo de espera (*timeout*) en el servidor de pruebas y errores no controlados en el procesamiento de la petición multipart.

---

## Decisión
Se implementó un middleware de validación previa en los controladores del Backend. Este middleware se encarga de verificar estrictamente el tipo MIME (`application/pdf`) y restringir el peso máximo permitido a 10MB antes de intentar almacenar el archivo o procesar la metadata en la base de datos. En el suite de pruebas de Jest, se configuraron *buffers* livianos que simulan la carga del archivo sin sobrecargar el entorno de pruebas.

---

## Consecuencias

### Positivas
* Se aseguraron las pruebas de integración y unitarias relacionadas con la gestión de documentos (CP-05, CP-06, CP-07 y CP-15).
* Se mejoró la seguridad del backend al rechazar archivos potencialmente dañinos o con extensiones no autorizadas (.exe, .bat).

### Negativas / Riesgos
* La validación actual solo comprueba encabezados y extensiones MIME, dejando como futura mejora la inspección profunda de contenido del PDF.