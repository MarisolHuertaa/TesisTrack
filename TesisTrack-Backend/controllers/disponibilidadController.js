const db = require('../config/db');
const { parsearFecha } = require('../utils/validaciones');

const HORA = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

// HU-06 c3: si el docente no ha configurado horarios, se le muestra un aviso.
exports.listarMisBloques = async (req, res) => {
  try {
    const [bloques] = await db.query(
      `SELECT id, fecha_disponible, hora_inicio, hora_fin, modalidad, ubicacion
       FROM disponibilidad_docentes
       WHERE docente_id = ? AND disponible = TRUE
       ORDER BY fecha_disponible, hora_inicio`,
      [req.user.id]
    );
    const respuesta = { bloques };
    if (bloques.length === 0) {
      respuesta.aviso = 'Aún no has configurado tu disponibilidad para exámenes';
    }
    res.json(respuesta);
  } catch (error) {
    console.error('Error al listar disponibilidad:', error);
    res.status(500).json({ mensaje: 'Error al consultar la disponibilidad' });
  }
};

// HU-06 c1: el docente marca un bloque como disponible.
exports.crearBloque = async (req, res) => {
  const { fecha, hora_inicio, hora_fin, modalidad, ubicacion } = req.body;
  const fechaISO = parsearFecha(fecha);

  if (!fechaISO || !HORA.test(hora_inicio || '') || !HORA.test(hora_fin || '')) {
    return res.status(400).json({ mensaje: 'Fecha u horas con formato inválido (usa YYYY-MM-DD y HH:MM)' });
  }
  if (hora_inicio >= hora_fin) {
    return res.status(400).json({ mensaje: 'La hora de inicio debe ser anterior a la hora de fin' });
  }

  try {
    const [traslape] = await db.query(
      `SELECT id FROM disponibilidad_docentes
       WHERE docente_id = ? AND fecha_disponible = ? AND disponible = TRUE
         AND hora_inicio < ? AND hora_fin > ?`,
      [req.user.id, fechaISO, hora_fin, hora_inicio]
    );
    if (traslape.length > 0) {
      return res.status(409).json({ mensaje: 'El bloque se traslapa con otro ya registrado' });
    }

    const [resultado] = await db.query(
      `INSERT INTO disponibilidad_docentes
         (docente_id, fecha_disponible, hora_inicio, hora_fin, modalidad, ubicacion)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, fechaISO, hora_inicio, hora_fin,
        modalidad || 'Presencial', ubicacion || 'Auditorio A - Edificio B']
    );
    res.status(201).json({ mensaje: 'Bloque registrado', id: resultado.insertId });
  } catch (error) {
    console.error('Error al crear bloque:', error);
    res.status(500).json({ mensaje: 'Error al registrar la disponibilidad' });
  }
};

// HU-06 c2: al desmarcar un bloque queda excluido de futuras solicitudes.
exports.desmarcarBloque = async (req, res) => {
  try {
    const [resultado] = await db.query(
      'UPDATE disponibilidad_docentes SET disponible = FALSE WHERE id = ? AND docente_id = ?',
      [parseInt(req.params.id, 10), req.user.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Bloque no encontrado' });
    }
    res.json({ mensaje: 'Bloque desmarcado' });
  } catch (error) {
    console.error('Error al desmarcar bloque:', error);
    res.status(500).json({ mensaje: 'Error al actualizar la disponibilidad' });
  }
};
