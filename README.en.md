[Versión en Español](./README.md)

# 🎓 TesisTrack - Thesis Tracking and Graduation Management Platform

[![Automated Tests](https://github.com/MarisolHuertaa/TesisTrack/actions/workflows/pruebas.yml/badge.svg)](https://github.com/MarisolHuertaa/TesisTrack/actions/workflows/pruebas.yml)
![Tests](https://img.shields.io/badge/tests-30%20passed-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-87%25-brightgreen)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

A web platform that centralizes the submission, review and final verdict of university thesis documents between students, advisors and academic coordination.

---

## 📋 Table of Contents
- [Description](#-description)
- [Demo and Screenshots](#-demo-and-screenshots)
- [Installation and Setup](#-installation-and-setup)
- [Usage and Automated Tests](#-usage-and-automated-tests)
- [REST API](#-rest-api)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Technical Documentation](#-technical-documentation)
- [Contributing](#-contributing)
- [License](#-license)
- [Authors](#-authors)

---

## 📖 Description

**TesisTrack** is a web system that manages and centralizes the workflow between graduating students, thesis advisors and academic coordinators. It addresses disorganization, progress lost in email threads and the lack of visibility into each review's status.

* **Target users:** graduating students, advisors and committee members, and academic coordination.
* **Problem it solves:** fragmented communication, no traceability of corrections, lost documents and slow review times.

### MVP Features

| Feature | User story | Status |
| :--- | :--- | :--- |
| Phase timeline (Proposal → Development → Verdict → Exam) | US-01 | ✅ |
| PDF progress upload (max. 10 MB) with sequential versioning | US-02 | ✅ |
| In-app notifications on submission and verdict | US-03 | ✅ |
| Advisor verdict (Approved / With observations / Rejected) with mandatory justification | US-04 | ✅ API · 🚧 UI |
| Faculty availability slots for the defense exam | US-06 | ✅ API · 🚧 UI |
| Defense date request (up to 3 options) | US-07 | ✅ |
| Response-time traffic light for coordination | US-08 | 🚧 in progress |

---

## 🎬 Demo and Screenshots

### Run the demo locally

1. Install the project and load the database following [Installation and Setup](#-installation-and-setup).
2. Open `http://localhost:5173/login` and sign in with one of these test accounts (created by `sembrarHashes.js`):

| Role | Email | Password |
| :--- | :--- | :--- |
| Student (phase 2, with observations) | `marisol.huerta@alumnos.udg.mx` | `DNI100001` |
| Student (approved verdict, can book exam) | `isai.plascencia@alumnos.udg.mx` | `DNI100003` |
| Faculty / Marisol's advisor | `maria.rosas@docentes.udg.mx` | `DOC100001` |
| Coordination | `coordinacion.titulacion@udg.mx` | `COORD2026` |

> Other students use `DNI100001` to `DNI100028` and faculty `DOC100001` to `DOC100015`, in the order they appear in `DATA.sql`.

3. **Student flow:** sign in as Marisol → **Mis Entregas** → upload a PDF. Uploading a `.docx` or a PDF larger than 10 MB is rejected.
4. **Advisor flow** 🚧 *(UI in progress; the API already works)*: sign in as María Rosas → **Revisiones Pendientes** → open the submission, write observations and issue the verdict. Once every milestone of the phase is approved, the student's timeline advances.
5. **Book the exam:** sign in as Isaí → **Agendar Examen** → pick an available slot. If the project has no approved verdict yet (e.g. Marisol's), the API rejects the request.

### Screenshots

| Screen | Description |
| :--- | :--- |
| ![Login](./docs/screenshots/login.png) | Sign-up screen and role selection. |
| ![Dashboard](./docs/screenshots/dashboard.png) | Main panel with graduation progress and submission breakdown. |
| ![Reviews](./docs/screenshots/revisiones.png) | Chronological log of submitted documents, observations and statuses. |
| ![Progress](./docs/screenshots/avances.png) | Thesis progress upload with notes for the advisor. |
| ![Application](./docs/screenshots/postulacion.png) | Defense date selection with slots set by the committee. |

---

## 🚀 Installation and Setup

### Prerequisites

- **Node.js 20 LTS or later:** [Download Node.js](https://nodejs.org/) (includes `npm`)
- **MySQL 8 or MariaDB 10.6+** with **MySQL Workbench**: [Download MySQL](https://dev.mysql.com/downloads/installer/)
- **Git** or **GitHub Desktop:** [Download Git](https://git-scm.com/downloads) · [Download GitHub Desktop](https://desktop.github.com/)

### 1. Clone the repository

```bash
git clone https://github.com/MarisolHuertaa/TesisTrack.git
cd TesisTrack
```

### 2. Create and load the database

From **MySQL Workbench**:

1. **File → Open SQL Script** → `TesisTrack-Backend/database/SQUEMA.sql` → run with ⚡. Creates the `tesistrack` database and its 12 tables.
2. In a new tab run `SET SQL_SAFE_UPDATES = 0;`.
3. **File → Open SQL Script** → `TesisTrack-Backend/database/DATA.sql` → run with ⚡. Loads 28 sample projects and 112 submissions.

Or from a terminal (Git Bash, macOS or Linux):

```bash
mysql -u root -p < TesisTrack-Backend/database/SQUEMA.sql
mysql -u root -p tesistrack < TesisTrack-Backend/database/DATA.sql
```

### 3. Configure and start the Backend

```bash
cd TesisTrack-Backend
cp .env.example .env        # on Windows: copy .env.example .env
# edit .env with your MySQL user and password
npm install
node sembrarHashes.js       # sets the test accounts' passwords
npm run dev                 # API at http://localhost:5000
```

### 4. Start the Frontend (in another terminal)

```bash
cd TesisTrack-Frontend
npm install
npm run dev                 # app at http://localhost:5173
```

---

## 💻 Usage and Automated Tests

### Run the tests

The tests **do not need MySQL**: they use an in-memory simulated database (see [ADR-005](./docs/adr/005-base-de-datos-simulada-en-pruebas.md)).

```bash
cd TesisTrack-Backend
npm test                    # 30 tests
npm run test:coverage       # plus a coverage report in /coverage
```

### Console output

```text
 PASS  tests/unit.test.js
 PASS  tests/acceptance.test.js
 PASS  tests/integration.test.js

Test Suites: 3 passed, 3 total
Tests:       30 passed, 30 total
```

| Type | File | Cases | What it checks |
| :--- | :--- | :--- | :--- |
| Unit | `tests/unit.test.js` | CP-01 to CP-10 | Isolated business rules (`utils/validaciones.js`) |
| Integration | `tests/integration.test.js` | CP-11 to CP-20 | Real HTTP requests to the API with Supertest |
| Acceptance | `tests/acceptance.test.js` | CP-21 to CP-30 | *Given / When / Then* criteria from the user stories |

Each case, its evidence and the defects found are detailed in [`docs/CASOS_DE_PRUEBA.md`](./docs/CASOS_DE_PRUEBA.md) (Spanish). **GitHub Actions** runs the tests on every push and Pull Request.

---

## 🔌 REST API

Every route except sign-up and login requires the header `Authorization: Bearer <token>`.

| Method | Route | Role | Description |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Public | Sign-up with an institutional `@...udg.mx` email |
| POST | `/api/auth/login` | Public | Returns the JWT (valid for 8 h) |
| GET | `/api/proyectos/mi-proyecto` | All | User's project, submissions, milestones and notifications |
| POST | `/api/entregas/subir` | Student | Uploads a PDF (`form-data`: `archivo`, `hito_id`) |
| GET | `/api/entregas/pendientes` | Faculty | Inbox of submissions under review |
| POST | `/api/entregas/:id/dictamen` | Faculty | `{ dictamen, comentario }`; advances the phase when every milestone is approved |
| GET · POST · DELETE | `/api/disponibilidad[/:id]` | Faculty | List, add or remove availability slots |
| GET | `/api/proyectos/horarios-disponibles` | Student | Slots of the assigned committee |
| POST | `/api/proyectos/confirmar-examen` | Student | `{ fecha, horario }`; registers up to 3 options |

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19 + Vite |
| **Backend** | Node.js + Express 5 |
| **Database** | MySQL 8 / MariaDB |
| **Authentication** | JWT (JSON Web Tokens) + bcrypt |
| **File upload** | Multer (PDF only, max. 10 MB) |
| **Testing** | Jest + Supertest |
| **CI/CD** | GitHub Actions |
| **Hosting (planned)** | Vercel (frontend) / Render (backend) |

---

## 📁 Project Structure

```text
TesisTrack/
├── .github/
│   ├── workflows/pruebas.yml          # CI: installs and runs the tests on every push and PR
│   └── pull_request_template.md       # Template filled in when opening a PR
├── docs/
│   ├── adr/                           # Architecture Decision Records
│   ├── bloqueos/                      # Team blockers log
│   ├── dt/                            # Technical debt log
│   ├── screenshots/                   # UI screenshots
│   └── CASOS_DE_PRUEBA.md             # 30-case test matrix, evidence and defects found
├── TesisTrack-Backend/
│   ├── config/                        # MySQL connection (db.js) and JWT secret (jwt.js)
│   ├── controllers/                   # Auth, projects, submissions, verdict, availability and exam logic
│   ├── database/                      # SQUEMA.sql (tables) and DATA.sql (sample data)
│   ├── middlewares/                   # Token and role checks; PDF upload
│   ├── routes/                        # Endpoint definitions
│   ├── tests/                         # Unit, integration and acceptance tests
│   │   └── helpers/                   # Simulated database and test data
│   ├── utils/validaciones.js          # Reusable business rules
│   ├── app.js                         # Express setup (used by the server and the tests)
│   ├── server.js                      # Entry point: starts the API
│   ├── sembrarHashes.js               # Sets passwords for the test accounts
│   └── .env.example                   # Environment variables template
├── TesisTrack-Frontend/
│   └── src/
│       ├── components/                # Components and role dashboards
│       ├── pages/                     # Login, sign-up and panels
│       ├── services/api.js            # Axios client with the JWT
│       └── styles/                    # Stylesheets
├── LICENSE
└── README.md
```

---

## 📑 Technical Documentation

All technical documents are written in Spanish.

* **Architecture Decision Records (ADRs):** [`docs/adr/`](./docs/adr/)
* **Blockers:** [`docs/bloqueos/`](./docs/bloqueos/)
* **Technical debt:** [`docs/dt/`](./docs/dt/)
* **Test cases:** [`docs/CASOS_DE_PRUEBA.md`](./docs/CASOS_DE_PRUEBA.md)

---

## 🤝 Contributing

The team works with branches and reviewed Pull Requests. **No change reaches `main` without another member's approval.**

1. Update `main` (in GitHub Desktop: *Fetch origin* → *Pull origin*).
2. Create a branch prefixed with the change type: `feat/`, `fix/`, `test/` or `docs/`. Example: `feat/dashboard-asesor`.
3. Make your changes and check that `npm test` passes.
4. Commit using Conventional Commits:
   `type(module): description`, e.g. `fix(auth): use password_hash`.
5. Publish the branch and open a **Pull Request**. Fill in the template and assign a reviewer.
6. The reviewer leaves comments under **Files changed** and selects **Approve** or **Request changes**.
7. **Merge** only with an approval and a green GitHub Actions run ✅.

### Commit types
- `feat:` new feature
- `fix:` bug fix
- `test:` add or update tests
- `docs:` documentation
- `refactor:` code change without behavior change
- `chore:` maintenance or configuration

---

## 📄 License

This project is distributed under the **MIT** license. See the [`LICENSE`](./LICENSE) file for details.

---

## 👥 Authors

Project for the **Integration Seminar: Development** course (7th semester, Group A), Centro Universitario de Tlaquepaque. Facilitator: Deborah Leticia Villaseñor Basulto.

| Name | Role | GitHub |
| :--- | :--- | :--- |
| **Marisol Huerta Catarino** | Product Owner | [@MarisolHuertaa](https://github.com/MarisolHuertaa) |
| **Isaí Plascencia Tapia** | Scrum Master | [@isai15200502-cell](https://github.com/isai15200502-cell) |
| **Laura Paola García Casillas** | Development Team | [@Paurilulu](https://github.com/Paurilulu) |
| **Héctor Jovany Padilla López** | Development Team | [@hector09padillalopez-beep](https://github.com/hector09padillalopez-beep) |
| **Gaizka Alejandro Camacho Torres** | Development Team | [@gaizkacamacho0678-cloud](https://github.com/gaizkacamacho0678-cloud) |
