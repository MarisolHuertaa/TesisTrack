const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db'); // en las pruebas es tests/helpers/fakeDb.js
const { JWT_SECRET } = require('../../config/jwt');

// Usuarios de prueba (mismas cuentas que el README usa para la demo)
const USUARIOS = {
  estudiante: { id: 1, nombre: 'Marisol', apellido: 'Huerta', correo: 'tesistrack@alumnos.udg.mx', password: 'alumnos123', rol_id: 1 },
  asesor: { id: 2, nombre: 'Deborah', apellido: 'Villaseñor', correo: 'tesistrack@docentes.udg.mx', password: 'docentes123', rol_id: 2 },
  sinodal: { id: 3, nombre: 'Laura', apellido: 'García', correo: 'sinodal@docentes.udg.mx', password: 'docentes123', rol_id: 2 },
  docenteAjeno: { id: 4, nombre: 'Pedro', apellido: 'López', correo: 'ajeno@docentes.udg.mx', password: 'docentes123', rol_id: 2 },
  coordinador: { id: 5, nombre: 'Isaí', apellido: 'Plascencia', correo: 'tesistrack@administracion.udg.mx', password: 'administracion123', rol_id: 3 },
};

// Hash calculado una sola vez (bcrypt es lento a propósito)
const HASHES = {};

/** Reinicia la BD simulada y carga los usuarios con su contraseña hasheada. */
async function reiniciarBD() {
  db.__reset();
  for (const u of Object.values(USUARIOS)) {
    HASHES[u.password] = HASHES[u.password] || (await bcrypt.hash(u.password, 4));
    db.__tablas().usuarios.push({
      id: u.id, nombre: u.nombre, apellido: u.apellido, correo: u.correo,
      password_hash: HASHES[u.password], rol_id: u.rol_id,
    });
  }
}

/** Genera un token JWT igual al que entrega /api/auth/login. */
function tokenDe(clave) {
  const u = USUARIOS[clave];
  return jwt.sign({ id: u.id, correo: u.correo, rol_id: u.rol_id }, JWT_SECRET, { expiresIn: '1h' });
}

const auth = (clave) => ({ Authorization: `Bearer ${tokenDe(clave)}` });

// Archivos de prueba
const PDF_VALIDO = Buffer.from('%PDF-1.4\n1 0 obj << /Type /Catalog >> endobj\ntrailer << >>\n%%EOF');
const PDF_GRANDE = Buffer.alloc(10 * 1024 * 1024 + 1, 0x20); // 10 MB + 1 byte

module.exports = { USUARIOS, reiniciarBD, tokenDe, auth, PDF_VALIDO, PDF_GRANDE };
