# 🎓 TesisTrack - Plataforma de Gestión y Seguimiento de Titulación

**TesisTrack** es una aplicación web *full-stack* diseñada para centralizar, gestionar y dar seguimiento al proceso de revisión y dictamen de documentos de titulación universitaria entre estudiantes, docentes/asesores y coordinadores.

---

## 🛠️ Tecnologías Utilizadas

### **Frontend**
* **Framework:** React + Vite.
* **Enrutamiento:** `react-router-dom`
* **Peticiones HTTP:** Axios (con interceptores JWT).
* **Estilos:** CSS3 Modular con Variables Globales.

### **Backend**
* **Entorno de Ejecución:** Node.js
* **Framework Web:** Express.js
* **Base de Datos:** MySQL
* **Autenticación:** JSON Web Tokens (JWT)
* **Middleware:** CORS & express.json

---

## 📁 Arquitectura del Proyecto

El proyecto utiliza una estructura monorepo (estrategia de control de versiones) dividida en dos módulos principales:

```text
TesisTrack/
├── TesisTrack-Backend/     # API RESTful en Node.js/Express (Puerto 5000)
│   ├── controllers/        # Lógica de negocio (authController, etc.)
│   ├── routes/             # Endpoints de la API (/api/auth)
│   ├── db.js               # Conexión a la base de datos MySQL
│   └── server.js           # Punto de entrada del servidor Express
│
├── TesisTrack-Frontend/    # Cliente Web en React + Vite (Puerto 5173)
│   ├── src/
│   │   ├── pages/          # Vistas (Login, Register, etc.)
│   │   ├── services/       # Cliente Axios y configuración de API
│   │   └── index.css       # Sistema de diseño y estilos globales
│   └── package.json
│
└── README.md