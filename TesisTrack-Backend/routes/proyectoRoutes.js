const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const examenController = require('../controllers/examenController');
const { verifyToken, requireRol } = require('../middlewares/authMiddleware');
const { ROLES } = require('../utils/validaciones');
const rubricaController = require('../controllers/rubricaController');

router.get('/mi-proyecto', verifyToken, proyectoController.obtenerMiProyecto);
router.patch('/notificaciones/:id/leida', verifyToken, proyectoController.marcarNotificacionLeida);
router.patch('/notificaciones/leidas', verifyToken, proyectoController.marcarTodasLeidas);

// Agendado de examen (estudiante)
router.get('/horarios-disponibles', verifyToken, requireRol(ROLES.ESTUDIANTE), examenController.horariosDisponibles);
router.post('/confirmar-examen', verifyToken, requireRol(ROLES.ESTUDIANTE), examenController.confirmarExamen);

// Agenda y programación de defensas (docente)
router.get('/agenda-docente', verifyToken, requireRol(ROLES.DOCENTE), examenController.listarAgendaDocente);
router.post('/agendar-alumno', verifyToken, requireRol(ROLES.DOCENTE), examenController.agendarAlumnoDocente);
router.patch('/solicitudes-examen/:id', verifyToken, requireRol(ROLES.DOCENTE), examenController.responderSolicitudExamen);

// Rúbricas de evaluación (docente)
router.get('/rubricas', verifyToken, requireRol(ROLES.DOCENTE), rubricaController.listarRubricasDocente);
router.post('/rubricas', verifyToken, requireRol(ROLES.DOCENTE), rubricaController.guardarRubrica);

module.exports = router;