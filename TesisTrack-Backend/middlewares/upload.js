const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { esPDF, TAMANO_MAXIMO_PDF } = require('../utils/validaciones');

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const limpio = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${limpio}`);
  },
});

const multerPDF = multer({
  storage,
  limits: { fileSize: TAMANO_MAXIMO_PDF },
  fileFilter: (req, file, cb) => {
    if (esPDF(file)) return cb(null, true);
    const err = new Error('Solo se permiten archivos en formato PDF');
    err.code = 'FORMATO_INVALIDO';
    cb(err);
  },
}).single('archivo');

/** Envuelve multer para responder 400 con un mensaje claro en lugar de un error 500. */
const subirPDF = (req, res, next) => {
  multerPDF(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ mensaje: 'El archivo excede el tamaño máximo de 10 MB' });
    }
    if (err.code === 'FORMATO_INVALIDO') {
      return res.status(400).json({ mensaje: err.message });
    }
    return res.status(400).json({ mensaje: 'No se pudo procesar el archivo' });
  });
};

module.exports = { subirPDF, UPLOAD_DIR };
