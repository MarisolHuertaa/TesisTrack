# DT-001: Hardcodeo de URLs de API y variables de entorno

**Proyecto:** TesisTrack   
**Total de deudas registradas:** 4  

---

## Resumen

| Prioridad | Cantidad | Resueltas |
| --- | --- | --- |
| Alta | 1 | 0 |
| Media | 3 | 0 |
| Baja | 0 | 0 |
| **Total** | **4** | **0** |

---

## Deuda Técnica DT-001

| Campo | Detalle |
| --- | --- |
| **Descripción** | La URL del servidor (`http://localhost:5000`) está escrita directamente en `api.js` y en tres componentes que usan `axios`/`fetch` directo en lugar del cliente `api.js`. |
| **Ubicación** | `TesisTrack-Frontend/src/services/api.js`, `components/dashboards/StudentDashboard.jsx`, `pages/Dashboard.jsx`, `components/NotificationsDropdown.jsx` |
| **Impacto / Consecuencias** | Al desplegar a producción o staging, la aplicación falla porque sigue intentando conectar a la máquina local. |
| **Prioridad** | Alta |
| **Solución propuesta** | Migrar todas las variables de conexión a un archivo `.env` local usando `process.env` o `import.meta.env`. |
| **Esfuerzo estimado** | S |
| **Responsable** | Equipo de Desarrollo |
| **Fecha de registro** | 2026-10-29 |
| **Estado** | Pendiente |

---

### Detalle
El puerto y la dirección IP del backend se encuentran acoplados al código fuente del cliente, lo que impide realizar pruebas dinámicas entre diferentes entornos sin editar el código manualmente.

### Criterios de Aceptación
- Creación e integración del archivo `.env.example` en la raíz de `TesisTrack-Frontend`.
- Ningún archivo de código fuente contiene URLs base en texto plano.