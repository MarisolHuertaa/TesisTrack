const express = require('express');
const router = express.Router();
const disponibilidadController = require('../controllers/disponibilidadController');
const { verifyToken, requireRol } = require('../middlewares/authMiddleware');
const { ROLES } = require('../utils/validaciones');

router.use(verifyToken, requireRol(ROLES.DOCENTE));

router.get('/', disponibilidadController.listarMisBloques);
router.post('/', disponibilidadController.crearBloque);
router.delete('/:id', disponibilidadController.desmarcarBloque);

module.exports = router;
