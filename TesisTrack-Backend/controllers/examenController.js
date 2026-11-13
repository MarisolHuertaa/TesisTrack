const db = require('../config/db');
const { puedeAgendarExamen, parsearFecha, parsearHorario } = require('../utils/validaciones');

const MENSAJE_BLOQUEO = 'Tu tesis aún no tiene dictamen aprobatorio o tiene observaciones pendientes';

async function obtenerProyecto(estudianteId) {
  const [proyectos] = await db.query(
    'SELECT id, estado, fase_actual_id FROM proyectos WHERE estudiante_id = ?',
    [estudianteId]
  );
  return proyectos[0] || null;
}

// HU-07 c1: solo se muestran los horarios de los docentes asignados al proyecto.
exports.horariosDisponibles = async (req, res) => {
  try {
    const proyecto = await obtenerProyecto(req.user.id);
    if (!proyecto) return res.status(404).json({ mensaje: 'No tienes un proyecto registrado' });
    if (!puedeAgendarExamen(proyecto)) {
      return res.status(403).json({ mensaje: MENSAJE_BLOQUEO, bloqueado: true });
    }

    const [bloques] = await db.query(
      `SELECT d.id, d.fecha_disponible, d.hora_inicio, d.hora_fin, d.modalidad, d.ubicacion,
              u.nombre AS docente_nombre, u.apellido AS docente_apellido
       FROM disponibilidad_docentes d
       JOIN proyecto_docentes pd ON pd.docente_id = d.docente_id
       JOIN usuarios u ON u.id = d.docente_id
       WHERE pd.proyecto_id = ? AND d.disponible = TRUE
       ORDER BY d.fecha_disponible, d.hora_inicio`,
      [proyecto.id]
    );
    res.json({ bloqueado: false, bloques });
  } catch (error) {
    console.error('Error al consultar horarios:', error);
    res.status(500).json({ mensaje: 'Error al consultar los horarios disponibles' });
  }
};

// HU-07 c2/c3: el estudiante solicita su fecha de defensa (hasta 3 opciones).
// Acepta el formato que ya envía el frontend: { fecha: "11 de Noviembre de 2026", horario: "10:00 AM - 11:30 AM" }
exports.confirmarExamen = async (req, res) => {
  const { fecha, horario, modalidad, ubicacion, disponibilidad_id } = req.body;
  const fechaISO = parsearFecha(fecha);
  const horas = parsearHorario(horario);

  if (!fechaISO || !horas) {
    return res.status(400).json({ mensaje: 'Fecha u horario con formato inválido' });
  }

  try {
    const proyecto = await obtenerProyecto(req.user.id);
    if (!proyecto) return res.status(404).json({ mensaje: 'No tienes un proyecto registrado' });
    if (!puedeAgendarExamen(proyecto)) {
      return res.status(403).json({ mensaje: MENSAJE_BLOQUEO, bloqueado: true });
    }

    const [[{ total }]] = await db.query(
      "SELECT COUNT(*) AS total FROM solicitudes_examen WHERE proyecto_id = ? AND estado = 'PENDIENTE'",
      [proyecto.id]
    );
    if (Number(total) >= 3) {
      return res.status(409).json({ mensaje: 'Ya registraste las 3 opciones de horario permitidas' });
    }

    const [resultado] = await db.query(
      `INSERT INTO solicitudes_examen
         (proyecto_id, disponibilidad_id, opciones_horario, fecha_propuesta, hora_inicio, hora_fin, modalidad, ubicacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [proyecto.id, disponibilidad_id || null, Number(total) + 1, fechaISO, horas.inicio, horas.fin,
        modalidad || 'Presencial', ubicacion || 'Auditorio A - Edificio B']
    );

    await db.query(
      "INSERT INTO notificaciones (usuario_id, tipo, mensaje) VALUES (?, 'EXAMEN', ?)",
      [req.user.id, `Solicitud de examen registrada para el ${fechaISO}`]
    );

    res.status(201).json({
      mensaje: 'Solicitud de examen registrada',
      id: resultado.insertId,
      opcion: Number(total) + 1,
      estado: 'Asignación Pendiente de Aula',
    });
  } catch (error) {
    console.error('Error al solicitar examen:', error);
    res.status(500).json({ mensaje: 'Error al registrar la solicitud de examen' });
  }
};
