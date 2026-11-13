const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const examenController = require('../controllers/examenController');
const { verifyToken, requireRol } = require('../middlewares/authMiddleware');
const { ROLES } = require('../utils/validaciones');

router.get('/mi-proyecto', verifyToken, proyectoController.obtenerMiProyecto);

// Agendado de examen (estudiante)
router.get('/horarios-disponibles', verifyToken, requireRol(ROLES.ESTUDIANTE), examenController.horariosDisponibles);
router.post('/confirmar-examen', verifyToken, requireRol(ROLES.ESTUDIANTE), examenController.confirmarExamen);

module.exports = router;
