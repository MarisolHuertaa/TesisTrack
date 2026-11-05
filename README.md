[English Version](./README.en.md)

# 🎓 TesisTrack - Plataforma de Gestión y Seguimiento de Titulación

Plataforma integral para el seguimiento y gestión del proceso de titulación universitaria.

---

## 📋 Tabla de Contenidos
- [Descripción](#-descripción)
- [Demo y Capturas](#-demo-y-capturas)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso y Pruebas Automatizadas](#-uso-y-pruebas-automatizadas)
- [Tecnologías y Stack](#-tecnologías-y-stack)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación Técnica (ADRs, Bloqueos, Deudas Técnicas)](#-documentación-técnica-adrs-bloqueos-deudas)
- [Contribución](#-contribución)
- [Autores](#-autores)

---

## 📖 Descripción

**TesisTrack** es un sistema web diseñado para gestionar y centralizar el flujo de trabajo entre estudiantes en proceso de titulación, asesores de tesis y coordinadores académicos. Resuelve los problemas habituales de desorganización, pérdida de avances por cadenas de correos y falta de visibilidad en el estado de revisión.

* **Usuario objetivo:** Estudiantes universitarios en proceso de titulación, asesores de tesis y administradores del programa académico.

* **Problema que resuelve:** Comunicación fragmentada, falta de trazabilidad en las correcciones, pérdida de documentos y retrasos en los tiempos de entrega e inspección.

---

## 🎬 Demo y Capturas

### Probar la Demo (Entorno Local)

1. En el archivo `.env`, asegúrate de tener configurada la variable `PORT=5000` y la conexión a tu base de datos local.

2. Inicia la aplicación ejecutando `npm run dev` y abre en tu navegador `http://localhost:5173/login`.

3. Inicia sesión con las credenciales de prueba predeterminadas (o registra un usuario nuevo):
   * **Rol Administrador:** `tesistrack@administracion.udg.mx` | Contraseña: `administracion123`
   * **Rol Docente/Asesor:** `tesistrack@docentes.udg.mx` | Contraseña: `docentes123`
   * **Rol Estudiante:** `tesistrack@alumnos.udg.mx` | Contraseña: `alumnos123`

4. Para probar el flujo principal como **Estudiante**:
   * Ve al módulo **Mis Entregas** y sube un archivo de avance (PDF).

5. Cierra sesión y entra con la cuenta de **Asesor** en `http://localhost:5173/login`:
   * Revisa la sección **Revisiones Pendientes**.
   * Abre la entrega del alumno, agrega observaciones/comentarios y cambia el estado a **Aprobado**.

6. Regresa al perfil del **Estudiante** para verificar cómo se actualiza el historial y el cronograma de titulación en tiempo real.

### Capturas de Pantalla

| Pantalla | Descripción |
| :--- | :--- |
| ![Login](./docs/screenshots/login.png) | Pantalla de registro y selección de rol. |
| ![Dashboard](./docs/screenshots/dashboard.png) | Panel principal con progreso general del proceso de titulación y desglose de entregas. |
| ![Revisiones](./docs/screenshots/revisiones.png) | Registro cronológico de de documentos enviados, observaciones y estados. |
| ![Avances](./docs/screenshots/avances.png) | Carga de avance de tesis con notas para el asesor. |
| ![Postulación](./docs/screenshots/postulacion.png) | Selección de defensa de tesis con horario disponible configurado por el jurado evaluador. |

---

## 🚀 Instalación y Configuración

### Requisitos Previos
Antes de comenzar, asegúrate de descargar e instalar las siguientes herramientas necesarias:

- **Node.js (LTS):** [Descargar Node.js](https://nodejs.org/) (Incluye el gestor de paquetes `npm`)
-  **MySQL Server / Workbench:** [Descargar MySQL](https://dev.mysql.com/downloads/installer/)
- **Git:** [Descargar Git](https://git-scm.com/downloads)

### Paso a Paso de Instalación

```bash
# 1. Clonar el repositorio
git clone [https://github.com/MarisolHuertaa/TesisTrack.git](https://github.com/MarisolHuertaa/TesisTrack.git)

# 2. Entrar a la carpeta del proyecto
cd TesisTrack

# 3. Configurar e iniciar el Backend (Asegúrate de configurar tu archivo .env en esta carpeta)
cd TesisTrack-Backend
npm install
node server.js

# 4. Configurar e iniciar el Frontend
cd TesisTrack-Frontend
npm install
npm run dev
```

---

## 💻 Uso y Pruebas Automatizadas

### Ejemplo de Inicio
```bash
npm run dev
```
Luego abre tu navegador e ingresa a `http://localhost:5173/login`.

### Pruebas Automatizadas
```bash
# Ejecutar suite de pruebas unitarias, integración y aceptación
npm test
```
### Salida Oficial en Consola
```bash
PASS tests/unit.test.js (10 passed, 10 total)
PASS tests/integration.test.js (10 passed, 10 total)
PASS tests/e2e.test.js (10 passed, 10 total)

Test Suites: 3 passed, 3 total
Tests:       30 passed, 30 total
Snapshots:   0 total
Time:        2.548 s
```

### Funcionalidades principales
✅ **Carga de Avances:** Gestión de documentos con control de versiones.  
✅ **Retroalimentación en Tiempo Real:** Comentarios directos de los asesores.  
✅ **Seguimiento de Hitos:** Control de fechas límite y cronograma institucional.  
✅ **Reportes de Progreso:** Estadísticas para la coordinación académica.

---

## 🛠️ Tecnologías y Stack

| Capa | Tecnología |
| :--- | :--- |
| **Frontend** | React |
| **Backend** | Node.js (Express) |
| **Base de Datos** | PostgreSQL / MySQL Workbench |
| **Autenticación** | JWT (JSON Web Tokens) |
| **Testing** | Jest |
| **Hosting & CI/CD** | Vercel / GitHub Actions |

---

## 📁 Estructura del Proyecto

```text
TesisTrack/
├── .github/                           # Flujos de trabajo de CI/CD y plantillas de GitHub
├── docs/                              # Documentación técnica y administrativa del proyecto
│   ├── adr/                           # Architecture Decision Records (Registros de decisiones de arquitectura)
│   ├── bloqueos/                      # Registro de impedimentos y bloqueos del equipo de desarrollo
│   ├── dt/                            # Registro y seguimiento de deuda técnica
│   ├── screenshots/                   # Capturas de pantalla de la interfaz para la documentación
│   └── CASOS_DE_PRUEBA.md             # Definición y guiones de casos de prueba
├── TesisTrack-Backend/                # Servidor API REST y lógica de negocio (Node.js/Express)
│   ├── controllers/                   # Controladores que manejan las solicitudes HTTP y la lógica
│   ├── middlewares/                   # Funciones intermedias (autenticación JWT, validaciones, CORS)
│   ├── routes/                        # Definición de rutas y endpoints de la API
│   ├── tests/                         # Pruebas automatizadas del servidor
│   │   ├── e2e.test.js                # Pruebas de extremo a extremo (End-to-End)
│   │   ├── integration.test.js        # Pruebas de integración entre componentes y base de datos
│   │   └── unit.test.js               # Pruebas unitarias de funciones aisladas
│   ├── .env                           # Variables de entorno locales (credenciales y puertos)
│   ├── db.js                          # Configuración de la conexión a la base de datos (MySQL)
│   ├── package-lock.json              # Árbol de dependencias exacto instalado en backend
│   ├── package.json                   # Dependencias y scripts del entorno backend
│   └── server.js                      # Punto de entrada principal del servidor Express
├── TesisTrack-Frontend/               # Aplicación web cliente (React + Vite)
│   ├── public/                        # Archivos estáticos accesibles directamente por el navegador
│   ├── src/                           # Código fuente principal de la interfaz
│   │   ├── assets/                    # Recursos multimedios (imágenes, logos, íconos)
│   │   ├── componentes/               # Componentes de interfaz de usuario reutilizables
│   │   ├── pages/                     # Vistas y pantallas principales de la aplicación
│   │   ├── services/                  # Cliente HTTP (Axios) para consumir la API del backend
│   │   └── styles/                    # Hojas de estilo globales y CSS modular
│   ├── index.html                     # Plantilla HTML base de la SPA (Single Page Application)
│   ├── package-lock.json              # Árbol de dependencias exacto instalado en frontend
│   ├── package.json                   # Dependencias y scripts del entorno frontend
│   └── vite.config.js                 # Configuración del empaquetador y servidor de desarrollo Vite
├── .gitignore                         # Archivos y carpetas excluidos del control de versiones
└── README.md                          # Documentación principal del repositorio
```

---

## 📑 Documentación Técnica (ADRs, Bloqueos, Deudas Técnicas)

* **Architecture Decision Records:** Consulta los registros de decisiones arquitectónicas en [`docs/adr/`](./docs/adr/).
* **Bloqueos:** Consulta e registro de impedimentos y bloqueos del equipo de desarrollo [`docs/bloqueos/`](./docs/bloqueos/).
* **Registro de Deuda Técnica:** Consulta el seguimiento de deuda técnica acumulada en [`docs/dt/`](./docs/dt/).

---

## 🤝 Contribución

¡Cualquier contribución es bienvenida! Sigue estos pasos para colaborar:

1. Haz un **Fork** del repositorio.

2. Crea una rama para tu aporte:  
   `git checkout -b feature/nueva-funcionalidad`

3. Guarda tus cambios con commits significativos (Conventional Commits):  
   `git commit -m "feat(modulo): add nueva funcionalidad"`

4. Sube tu rama a GitHub:  
   `git push origin feature/nueva-funcionalidad`

5. Abre un **Pull Request** detallando tus cambios.

### Convenciones de Commits
- `feat:` Nueva funcionalidad.
- `docs:` Adición de documentación.
- `fix:` Corrección de error/bug.
- `update:` Cambios en la documentación.
- `refactor:` Refactorización de código sin cambiar funcionalidad.
- `test:` Adición o actualización de pruebas.
- `chore:` Tareas de mantenimiento o configuración.

---

## 👥 Autores

| Nombre | Rol | GitHub |
| :--- | :--- | :--- |
| **Marisol Huerta** | Product Owner | [@MarisolHuertaa](https://github.com/MarisolHuertaa) |
| **Isaí Plascencia Tapia** | Scrum Master | [@isai15200502-cell](https://github.com/isai15200502-cell) |
| **Laura Paola García Casillas** | Development Team | [@Paurilulu](https://github.com/Paurilulu) |
| **Héctor Jovany Padilla López** | Development Team | [@hector09padillalopez-beep](https://github.com/hector09padillalopez-beep) |
| **Gaizka Alejandro Camacho Torres** | Development Team | [@gaizkacamacho0678-cloud](https://github.com/gaizkacamacho0678-cloud) |
