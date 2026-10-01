# ADR 001: Elección del Stack Tecnológico y Arquitectura Monorepo

* **Estado:** Aceptado
* **Fecha:** 2026-10-01
* **Autores:** Equipo TesisTrack

---

## Contexto
TesisTrack requiere una plataforma web robusta para gestionar el seguimiento, revisión y dictamen de documentos de titulación universitaria entre estudiantes, docentes y coordinadores. Se necesitaba definir una arquitectura escalable, fácil de mantener y con un entorno de desarrollo eficiente que permitiera manejar sesiones autenticadas (JWT) y relaciones de datos estructuradas (usuarios, roles, documentos).

---

## Decisión
Se eligió una arquitectura **Monorepo** utilizando el stack **React (Vite)** para el Frontend, **Node.js con Express** para la API Backend, y **MySQL** como sistema de gestión de base de datos relacional.

---

## Justificación
1. **Unificación de lenguaje (JavaScript):** Usar React en el cliente y Node.js/Express en el servidor permite compartir modelos de datos y mantener una curva de aprendizaje homogénea.

2. **Estructura Monorepo:** Mantiene el código de frontend y backend en un único repositorio Git, simplificando la sincronización de ramas, el historial de commits y la configuración de CI/CD sin acoplar sus dependencias (`package.json` separados).

3. **Consistencia de Datos en MySQL:** El proceso de titulación exige integridad referencial estricta (relaciones entre estudiantes, asesores, revisiones y dictámenes), lo que hace ideal a una base de datos relacional (SQL).

---

## Consecuencias

### **Lo que ganamos (Positivo):**
* **Desarrollo ágil:** Configuración rápida del servidor con Vite en el Frontend y Nodemon en el Backend.

* **Control centralizado:** Un solo repositorio (`TesisTrack`) para clonar, auditar y documentar todo el proyecto.
* **Integridad de datos:** Relaciones claras en MySQL para la gestión de usuarios, roles e historiales.

### **Lo que sacrificamos (Riesgos/Mitigación):**
* **Gestión manual de migraciones SQL:** Al no usar un ORM complejo inicialmente, se deben documentar scripts SQL de forma rigurosa.

* **Coordinación en el Monorepo:** Requiere una disciplina estricta de Git (*Feature Branching*) para no mezclar cambios del frontend y backend en commits confusos.

---

## Alternativas
* **Next.js (Fullstack Framework):** Se descartó para mantener una separación clara de responsabilidades entre el cliente (React) y la API RESTful (Express).

* **MongoDB (NoSQL):** Se descartó debido a que la naturaleza del dominio de titulación requiere esquemas rígidos e integridad relacional garantizada.

* **Repositorios Separados (Multi-repo):** Se descartó para evitar la complejidad de administrar dos repositorios de Git independientes en fases tempranas del desarrollo.