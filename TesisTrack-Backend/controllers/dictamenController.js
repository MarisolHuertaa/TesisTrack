const db = require('../config/db');
const {
  validarDictamen, siguienteFase, porcentajePorFase, FASE_EXAMEN,
} = require('../utils/validaciones');

// Estado que toma la entrega según el dictamen (la tabla entregas no tiene RECHAZADO)
const ESTADO_ENTREGA = {
  APROBADO: 'APROBADO',
  CON_OBSERVACIONES: 'CON_OBSERVACIONES',
  RECHAZADO: 'CON_OBSERVACIONES',
};

const MENSAJE_ALUMNO = {
  APROBADO: 'Tu entrega fue APROBADA',
  CON_OBSERVACIONES: 'Tu asesor emitió observaciones en tu entrega',
  RECHAZADO: 'Tu entrega fue RECHAZADA, revisa la justificación',
};

// HU-04: el docente dictamina una entrega con comentario obligatorio.
// HU-01 c3: si se aprueban todos los hitos de la fase activa, la línea de tiempo avanza.
exports.emitirDictamen = async (req, res) => {
  const entregaId = parseInt(req.params.id, 10);
  const { dictamen, comentario } = req.body;

  const validacion = validarDictamen({ dictamen, comentario });
  if (!validacion.valido) {
    return res.status(400).json({ mensaje: validacion.error });
  }

  try {
    const [filas] = await db.query(
      `SELECT e.id, e.estado, e.fase_id, e.proyecto_id,
              p.estudiante_id, p.fase_actual_id
       FROM entregas e
       JOIN proyectos p ON e.proyecto_id = p.id
       WHERE e.id = ?`,
      [entregaId]
    );
    if (filas.length === 0) {
      return res.status(404).json({ mensaje: 'La entrega no existe' });
    }
    const entrega = filas[0];

    const [asignado] = await db.query(
      'SELECT id FROM proyecto_docentes WHERE proyecto_id = ? AND docente_id = ?',
      [entrega.proyecto_id, req.user.id]
    );
    if (asignado.length === 0) {
      return res.status(403).json({ mensaje: 'No estás asignado a este proyecto' });
    }

    if (entrega.estado !== 'EN_REVISION') {
      return res.status(409).json({ mensaje: 'Esta entrega ya fue dictaminada' });
    }

    await db.query(
      'INSERT INTO dictamenes (entrega_id, docente_id, dictamen, comentario) VALUES (?, ?, ?, ?)',
      [entregaId, req.user.id, dictamen, comentario.trim()]
    );
    await db.query('UPDATE entregas SET estado = ? WHERE id = ?', [ESTADO_ENTREGA[dictamen], entregaId]);

    let faseActual = entrega.fase_actual_id;
    let estadoProyecto = dictamen === 'APROBADO' ? 'EN_PROGRESO' : dictamen;

    if (dictamen === 'APROBADO' && entrega.fase_id === entrega.fase_actual_id) {
      // ¿Quedan hitos de esta fase sin una entrega aprobada?
      const [[{ pendientes }]] = await db.query(
        `SELECT COUNT(*) AS pendientes FROM hitos h
         WHERE h.fase_id = ?
           AND NOT EXISTS (SELECT 1 FROM entregas e
                           WHERE e.hito_id = h.id AND e.proyecto_id = ? AND e.estado = 'APROBADO')`,
        [entrega.fase_id, entrega.proyecto_id]
      );
      if (Number(pendientes) === 0) {
        faseActual = siguienteFase(entrega.fase_actual_id);
        if (faseActual === FASE_EXAMEN) estadoProyecto = 'DICTAMEN_APROBADO';
      }
    }

    await db.query(
      'UPDATE proyectos SET estado = ?, fase_actual_id = ?, porcentaje_avance = ? WHERE id = ?',
      [estadoProyecto, faseActual, porcentajePorFase(faseActual), entrega.proyecto_id]
    );

    // HU-03: notificación al estudiante
    await db.query(
      "INSERT INTO notificaciones (usuario_id, tipo, mensaje) VALUES (?, 'DICTAMEN', ?)",
      [entrega.estudiante_id, MENSAJE_ALUMNO[dictamen]]
    );

    res.status(201).json({
      mensaje: 'Dictamen registrado',
      dictamen,
      estado_proyecto: estadoProyecto,
      fase_actual_id: faseActual,
      fase_avanzo: faseActual !== entrega.fase_actual_id,
    });
  } catch (error) {
    console.error('Error al emitir dictamen:', error);
    res.status(500).json({ mensaje: 'Error en el servidor al registrar el dictamen' });
  }
};
