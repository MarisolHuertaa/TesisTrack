# 001. Incompatibilidad de Jest con la Estructura Monorepo del Proyecto

* **Estado:** Resuelto
* **Módulo Afectado:** TesisTrack-Backend / CI Pipeline

---

## Contexto
Durante la configuración de las pruebas automatizadas, se presentó un fallo al intentar ejecutar la suite de Jest desde la carpeta raíz del repositorio (`TesisTrack/`). Al existir una estructura dividida entre `TesisTrack-Backend` y `TesisTrack-Frontend`, la herramienta no lograba ubicar la configuración del `package.json` ni los módulos instalados del backend. Esto provocó que el flujo de integración continua en GitHub Actions fallara al no encontrar la ruta de ejecución correcta.

---

## Decisión
Se decidió reubicar la suite de pruebas `/tests` y las dependencias de Jest directamente dentro del directorio `TesisTrack-Backend/`. Adicionalmente, se actualizó la definición del flujo de GitHub Actions (`.github/workflows/pruebas.yml`) añadiendo la propiedad `working-directory: ./TesisTrack-Backend` para obligar a la tubería de CI/CD a posicionarse en esa carpeta antes de correr los comandos de prueba.

---

## Consecuencias

### Positivas
* Se logró la ejecución exitosa de los 30 casos de prueba tanto localmente como en GitHub Actions.
* Se mantuvo una clara separación de responsabilidades entre el backend y el frontend dentro del repositorio.

### Negativas / Riesgos
* Los comandos de prueba deben ejecutarse específicamente posicionándose en la carpeta del backend y no desde la raíz general del proyecto.