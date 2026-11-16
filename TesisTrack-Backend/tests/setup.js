// Se ejecuta antes de cada archivo de pruebas (ver "setupFiles" en package.json).
const os = require('os');
const path = require('path');

process.env.JWT_SECRET = 'secreto_de_pruebas';
process.env.UPLOAD_DIR = path.join(os.tmpdir(), 'tesistrack-test-uploads');

// Todas las pruebas usan la base de datos simulada en memoria en lugar de MySQL.
jest.mock('../config/db', () => require('./helpers/fakeDb'));

// Silencia los console.error esperados (por ejemplo, en la prueba de error 500).
jest.spyOn(console, 'error').mockImplementation(() => {});
