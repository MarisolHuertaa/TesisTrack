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

// ==================== FUNCIONES DE AGENDA PARA DOCENTES ====================

// Listar solicitudes y exámenes agendados de los proyectos asignados al docente
exports.listarAgendaDocente = async (req, res) => {
  try {
    const [citas] = await db.query(
      `SELECT se.id, se.proyecto_id, se.disponibilidad_id, se.fecha_propuesta,
              se.hora_inicio, se.hora_fin, se.modalidad, se.ubicacion, se.estado,
              p.titulo AS proyecto_titulo,
              u.nombre AS estudiante_nombre, u.apellido AS estudiante_apellido,
              pd.tipo_rol
       FROM solicitudes_examen se
       JOIN proyectos p ON se.proyecto_id = p.id
       JOIN proyecto_docentes pd ON pd.proyecto_id = p.id
       JOIN usuarios u ON p.estudiante_id = u.id
       WHERE pd.docente_id = ? AND se.estado != 'RECHAZADO'
       ORDER BY se.fecha_propuesta ASC, se.hora_inicio ASC`,
      [req.user.id]
    );
    res.json({ citas });
  } catch (error) {
    console.error('Error al consultar agenda del docente:', error);
    res.status(500).json({ mensaje: 'Error al consultar las citas de defensa' });
  }
};

// Agendar directamente a un alumno asignado en un horario disponible
exports.agendarAlumnoDocente = async (req, res) => {
  const { proyecto_id, disponibilidad_id, fecha, hora_inicio, hora_fin, modalidad, ubicacion } = req.body;

  if (!proyecto_id || !fecha || !hora_inicio || !hora_fin) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios para agendar al alumno' });
  }

  try {
    // Verificar que el docente esté asignado a ese proyecto
    const [asignacion] = await db.query(
      `SELECT p.id, p.titulo, p.estudiante_id
       FROM proyectos p
       JOIN proyecto_docentes pd ON pd.proyecto_id = p.id
       WHERE p.id = ? AND pd.docente_id = ?`,
      [proyecto_id, req.user.id]
    );
    if (asignacion.length === 0) {
      return res.status(403).json({ mensaje: 'No tienes asignado este proyecto' });
    }
    const proyecto = asignacion[0];

    // Verificar que el horario no esté ya ocupado por otro examen confirmado
    const [ocupado] = await db.query(
      `SELECT id FROM solicitudes_examen
       WHERE fecha_propuesta = ? AND hora_inicio = ? AND estado = 'CONFIRMADO'
         AND (disponibilidad_id <=> ?)`,
      [fecha, hora_inicio, disponibilidad_id || null]
    );
    if (ocupado.length > 0) {
      return res.status(409).json({ mensaje: 'Este horario ya tiene un alumno agendado' });
    }

    const [resultado] = await db.query(
      `INSERT INTO solicitudes_examen
         (proyecto_id, disponibilidad_id, opciones_horario, fecha_propuesta, hora_inicio, hora_fin, modalidad, ubicacion, estado)
       VALUES (?, ?, 1, ?, ?, ?, ?, ?, 'CONFIRMADO')`,
      [
        proyecto_id,
        disponibilidad_id || null,
        fecha,
        hora_inicio,
        hora_fin,
        modalidad || 'Presencial',
        ubicacion || 'Auditorio A - Edificio B'
      ]
    );

    // Notificar al estudiante que su defensa fue agendada
    await db.query(
      "INSERT INTO notificaciones (usuario_id, tipo, mensaje) VALUES (?, 'EXAMEN', ?)",
      [proyecto.estudiante_id, `Tu examen de titulación ha sido agendado para el ${fecha} (${hora_inicio.slice(0, 5)}).`]
    );

    res.status(201).json({
      mensaje: 'Alumno agendado exitosamente',
      id: resultado.insertId
    });
  } catch (error) {
    console.error('Error al agendar alumno:', error);
    res.status(500).json({ mensaje: 'Error en el servidor al agendar al alumno' });
  }
};

// Confirmar o rechazar una solicitud de examen pendiente
exports.responderSolicitudExamen = async (req, res) => {
  const solicitudId = parseInt(req.params.id, 10);
  const { estado } = req.body; // 'CONFIRMADO' o 'RECHAZADO'

  if (!['CONFIRMADO', 'RECHAZADO'].includes(estado)) {
    return res.status(400).json({ mensaje: 'Estado inválido' });
  }

  try {
    const [filas] = await db.query(
      `SELECT se.id, se.fecha_propuesta, p.estudiante_id
       FROM solicitudes_examen se
       JOIN proyectos p ON se.proyecto_id = p.id
       JOIN proyecto_docentes pd ON pd.proyecto_id = p.id
       WHERE se.id = ? AND pd.docente_id = ?`,
      [solicitudId, req.user.id]
    );
    if (filas.length === 0) {
      return res.status(404).json({ mensaje: 'Solicitud no encontrada o sin permisos' });
    }

    await db.query('UPDATE solicitudes_examen SET estado = ? WHERE id = ?', [estado, solicitudId]);

    const textoNotif = estado === 'CONFIRMADO'
      ? `Tu fecha de examen para el ${String(filas[0].fecha_propuesta).slice(0, 10)} fue CONFIRMADA.`
      : `Tu solicitud de examen para el ${String(filas[0].fecha_propuesta).slice(0, 10)} fue RECHAZADA. Selecciona otro horario.`;

    await db.query(
      "INSERT INTO notificaciones (usuario_id, tipo, mensaje) VALUES (?, 'EXAMEN', ?)",
      [filas[0].estudiante_id, textoNotif]
    );

    res.json({ mensaje: `Solicitud actualizada a ${estado}` });
  } catch (error) {
    console.error('Error al actualizar solicitud:', error);
    res.status(500).json({ mensaje: 'Error al actualizar la solicitud de examen' });
  }
};