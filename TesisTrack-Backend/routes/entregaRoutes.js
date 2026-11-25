const express = require('express');
const router = express.Router();
const entregaController = require('../controllers/entregaController');
const dictamenController = require('../controllers/dictamenController');
const { verifyToken, requireRol } = require('../middlewares/authMiddleware');
const { subirPDF } = require('../middlewares/upload');
const { ROLES } = require('../utils/validaciones');

// Estudiante: subir avance en PDF (campo "archivo", máx. 10 MB)
router.post('/subir', verifyToken, requireRol(ROLES.ESTUDIANTE), subirPDF, entregaController.subirEntrega);

// Docente: bandeja de entregas, historial de retroalimentación y emisión de dictamen
router.get('/pendientes', verifyToken, requireRol(ROLES.DOCENTE), entregaController.listarPendientes);
router.get('/docente', verifyToken, requireRol(ROLES.DOCENTE), entregaController.listarEntregasDocente);
router.get('/historial-dictamenes', verifyToken, requireRol(ROLES.DOCENTE), dictamenController.listarHistorialDictamenes);
router.post('/:id/dictamen', verifyToken, requireRol(ROLES.DOCENTE), dictamenController.emitirDictamen);

module.exports = router;