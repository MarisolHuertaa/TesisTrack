# 006. Restricción de Políticas CORS entre Frontend y Backend

* **Estado:** Resuelto
* **Tipo:** Técnico
* **Nivel de escalamiento:** Nivel 2 (equipo de desarrollo)
* **Responsable:** Equipo de Backend
* **Fecha de registro:** 2026-10-29

---

## Contexto
El frontend en React (`localhost:5173`) no podía consumir los endpoints del servidor Express (`localhost:5000`): el navegador bloqueaba las peticiones por la política de mismo origen (CORS), porque los puertos son distintos.

**Intentos previos:**
1. Modificar las rutas base en el cliente (`src/services/api.js`).
2. Probar la respuesta directa del backend con Postman, donde sí funcionaba. Eso confirmó que el problema era del navegador y no del servidor.

---

## Decisión
Habilitar el middleware `cors` en la configuración de Express. Hoy está en `TesisTrack-Backend/app.js`: `app.use(cors())`.

---

## Consecuencias

### Positivas
* El frontend consume la API en el entorno local sin errores de CORS.

### Negativas / Riesgos
* `cors()` sin opciones acepta peticiones de **cualquier** origen. Antes del despliegue conviene limitarlo al dominio del frontend: `cors({ origin: process.env.FRONTEND_URL })`.
