const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const { verifyToken } = require('../middlewares/authMiddleware'); // <-- Extraer verifyToken

// Se pasa verifyToken como middleware
router.get('/mi-proyecto', verifyToken, proyectoController.obtenerMiProyecto);

module.exports = router;