const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // El token se recibe en el encabezado con el formato: "Bearer <TOKEN>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Acceso denegado. No se proporcionó un token de autenticación.',
    });
  }

  try {
    // Guardamos los datos del usuario autenticado en el objeto request
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

/** Restringe una ruta a uno o más roles (1 Estudiante, 2 Docente, 3 Coordinador). */
const requireRol = (...rolesPermitidos) => (req, res, next) => {
  if (!req.user || !rolesPermitidos.includes(req.user.rol_id)) {
    return res.status(403).json({ message: 'No tienes permiso para realizar esta acción.' });
  }
  next();
};

module.exports = { verifyToken, requireRol };
