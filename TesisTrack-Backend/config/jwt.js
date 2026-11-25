require('dotenv').config({ quiet: true });

// Fuente única del secreto JWT.
// Antes, el login firmaba con 'clave_secreta_default' y el middleware verificaba con
// 'clave_secreta_jwt'; sin JWT_SECRET en el .env, todas las rutas protegidas respondían 403.
const JWT_SECRET = process.env.JWT_SECRET || 'tesistrack_dev_secret';
const JWT_EXPIRES_IN = '8h';

module.exports = { JWT_SECRET, JWT_EXPIRES_IN };
