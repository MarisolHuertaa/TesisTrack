const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // El token se recibe en el encabezado con el formato: "Bearer <TOKEN>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      message: 'Acceso denegado. No se proporcionó un token de autenticación.' 
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'clave_secreta_jwt';
    const decoded = jwt.verify(token, secret);
    
    // Guardamos los datos del usuario autenticado en el objeto request
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ 
      message: 'Token inválido o expirado.' 
    });
  }
};

module.exports = { verifyToken };