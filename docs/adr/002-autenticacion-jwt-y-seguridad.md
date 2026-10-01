# ADR 002: Estrategia de Autenticación con JWT y Hashing de Contraseñas con bcrypt

* **Estado:** Aceptado
* **Fecha:** 2026-10-01
* **Autores:** Equipo TesisTrack

---

## Contexto
TesisTrack gestiona información académica sensible y requiere autenticar a tres perfiles de usuario distintos (Estudiantes, Docentes/Asesores y Coordinadores). Se necesitaba implementar un esquema de autenticación seguro, sin estado (*stateless*), que permitiera proteger los endpoints de la API y validar la sesión activa de forma transparente desde el cliente en React.

---

## Decisión
Se decidió implementar una autenticación basada en **JSON Web Tokens (JWT)** para la gestión de sesiones en la API, junto con el algoritmo **bcrypt** en el backend para el cifrado/hashing unidireccional de contraseñas de usuario antes de almacenarlas en la base de datos MySQL.

---

## Justificación
1. **Arquitectura Stateless:** JWT permite verificar la identidad del usuario en cada petición HTTP sin necesidad de guardar sesiones en el servidor o consultar la base de datos de forma recurrente para validar el estado de la sesión.

2. **Seguridad en Almacenamiento:** El uso de bcrypt con un factor de costo (*salt rounds*) garantiza que las contraseñas nunca se almacenen en texto plano en MySQL, protegiendo las credenciales frente a posibles filtraciones de datos.

3. **Escalabilidad del Frontend:** El token emitido se almacena localmente en el cliente y se adjunta automáticamente en los encabezados `Authorization: Bearer <token>` mediante un interceptor de Axios, simplificando el control de acceso a rutas protegidas en React Router.

---

## Consecuencias

### **Lo que ganamos (Positivo):**
* **Desacoplamiento total:** La API permanece completamente *stateless*, facilitando la escalabilidad del backend.

* **Manejo de Roles:** El payload del JWT incluye información de identidad y rol (`rol_id`), permitiendo realizar verificaciones de permisos tanto en el cliente como en middlewares del servidor.}

* **Cumplimiento de estándares:** Uso de librerías maduras y probadas en la industria para el manejo de la seguridad.

### **Lo que sacrificamos (Riesgos/Mitigación):**
* **Invalidación de Tokens:** Un JWT firmado sigue siendo válido hasta que expira. Para mitigar riesgos en caso de ser necesario, se configurará un tiempo de expiración corto y una clave secreta sólida en las variables de entorno (`JWT_SECRET`).

* **Riesgo XSS/LocalStore:** El almacenamiento del token en la aplicación cliente debe protegerse contra ataques de inyección de código, aplicando validaciones estrictas en los formularios del frontend.

---

## Alternativas
* **Autenticación basada en Cookies/Sesiones de Servidor (`express-session`):** Se descartó porque requiere almacenamiento de estado en el servidor (o base de datos para sesiones) y complica el manejo de peticiones de origen cruzado (CORS) entre puertos distintos (5000 y 5173).

* **Proveedores Externos (Auth0 / Firebase Auth):** Se descartó para mantener el control completo sobre la base de datos de usuarios en MySQL y evitar dependencias de servicios de terceros en la infraestructura académica.