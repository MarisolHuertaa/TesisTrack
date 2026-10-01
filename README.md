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

## 🚀 Instalación y Uso

### **Requisitos Previos e Instaladores**
Antes de comenzar, asegúrate de descargar e instalar las siguientes herramientas necesarias:

* 🟢 **Node.js (LTS):** [Descargar Node.js](https://nodejs.org/) (Incluye el gestor de paquetes `npm`)
* 🐬 **MySQL Server / Workbench:** [Descargar MySQL](https://dev.mysql.com/downloads/installer/)[cite: 10]
* 🐙 **Git:** [Descargar Git](https://git-scm.com/downloads)[cite: 10]


### **Paso a Paso de Instalación**

```bash
# 1. Clonar el repositorio
git clone [https://github.com/MarisolHuertaa/TesisTrack.git](https://github.com/MarisolHuertaa/TesisTrack.git)
cd TesisTrack

# 2. Configurar e iniciar el Backend
cd TesisTrack-Backend
npm install
# (Asegúrate de configurar tu archivo .env en esta carpeta)
node server.js

# 3. En otra terminal, configurar e iniciar el Frontend
cd TesisTrack-Frontend
npm install
npm run dev

```

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

```

--- 

## 🤝 Contribución y Autores

### **Flujo de Trabajo (Git Workflow)** ###
**Crear rama de trabajo:** git checkout -b feature/nombre-funcionalidad

**Guardar cambios:** git add . y git commit -m "feat: descripción del cambio"

**Subir cambios:** git push origin feature/nombre-funcionalidad

**Abrir Pull Request:** Solicitar revisión hacia la rama main y realizar Merge.

### **Autores** ##
* **Marisol Huerta**
* **Laura Paola García Casillas**
* **Isaí Plascencia Tapia**
* **Héctor Jovany Padilla López**
* **Gaizka Alejandro Camacho Torres**