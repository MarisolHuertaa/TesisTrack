# ADR 006. Almacenamiento de Archivos PDF con Multer y Validación en el Servidor

* **Estado:** Aceptado
* **Fecha:** 2026-11-11
* **Módulo Afectado:** TesisTrack-Backend / Entregas

---

## Contexto
La HU-02 exige que el estudiante suba su avance en PDF y que se rechace cualquier otro formato. En el Sprint Review (05/nov/2026) se acordó además un **límite de 10 MB**. El frontend ya enviaba el archivo a `POST /api/entregas/subir` como `multipart/form-data`, pero esa ruta no existía en el backend, y la dependencia `multer` estaba instalada sin usarse.

---

## Decisión
* Usar **Multer** con almacenamiento en disco (`diskStorage`) en la carpeta `TesisTrack-Backend/uploads/`, configurable con la variable `UPLOAD_DIR`.
* Validar **en el servidor**, antes de guardar nada, que el archivo tenga tipo MIME `application/pdf` **y** extensión `.pdf`, y que no exceda **10 MB** (`middlewares/upload.js` + `utils/validaciones.js`).
* Responder `400` con un mensaje claro ("Solo se permiten archivos en formato PDF" / "El archivo excede el tamaño máximo de 10 MB") en lugar de un error 500.
* Guardar en la tabla `entregas` la ruta pública (`/uploads/<archivo>`), el nombre original, el tamaño y una **versión correlativa** por hito (`v1.0`, `v2.0`, …).
* La carpeta `uploads/` está en `.gitignore`: los PDF de prueba nunca se suben al repositorio.

---

## Consecuencias

### Positivas
* La validación no depende del navegador: aunque alguien llame a la API directamente, no puede subir un `.exe` ni un archivo de 50 MB.
* No requiere servicios externos ni cuentas de pago para el MVP.
* Cubierto por las pruebas CP-02 a CP-04, CP-15 a CP-17 y CP-21.

### Negativas / Riesgos
* **Render y Vercel no conservan archivos en disco:** se borran en cada reinicio o despliegue. Antes de desplegar habrá que mover el almacenamiento a la nube (registrado como DT-007).
* La validación revisa el tipo MIME y la extensión, no el contenido interno del PDF.

---

## Alternativas
* **Guardar el PDF dentro de MySQL (`BLOB`):** infla la base de datos y vuelve lentas las consultas y los respaldos.
* **Almacenamiento en la nube desde el inicio (Cloudinary, Amazon S3, Supabase Storage):** es la solución definitiva para producción, pero requiere cuentas y credenciales; se pospone al despliegue.
* **Validar solo en el frontend:** descartado, porque se puede saltar llamando directamente a la API.
