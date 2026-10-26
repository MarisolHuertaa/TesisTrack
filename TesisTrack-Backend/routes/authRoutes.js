const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Rutas Públicas (Autenticación)
router.post('/register', authController.registrar); // Ruta: POST /api/auth/register
router.post('/login', authController.login);        // Ruta: POST /api/auth/login

// Ruta Protegida (Perfil / Datos del Dashboard)
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: 'Acceso autorizado al perfil del usuario',
    user: req.user
  });
});

module.exports = router;