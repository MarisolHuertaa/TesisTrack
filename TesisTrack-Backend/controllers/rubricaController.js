const db = require('../config/db');

// Obtener las calificaciones de rúbrica guardadas para los alumnos del docente
exports.listarRubricasDocente = async (req, res) => {
  try {
    const [rubricas] = await db.query(
      `SELECT er.id, er.proyecto_id, er.metodologia, er.dominio, er.aportes, er.promedio, er.actualizado_en,
              p.titulo AS proyecto_titulo, p.porcentaje_avance, p.estado AS proyecto_estado,
              u.id AS estudiante_id, u.nombre AS estudiante_nombre, u.apellido AS estudiante_apellido, u.codigo AS estudiante_codigo
       FROM evaluaciones_rubrica er
       JOIN proyectos p ON er.proyecto_id = p.id
       JOIN usuarios u ON p.estudiante_id = u.id
       WHERE er.docente_id = ?`,
      [req.user.id]
    );
    res.json({ rubricas });
  } catch (error) {
    console.error('Error al consultar rúbricas:', error);
    res.status(500).json({ mensaje: 'Error al consultar las evaluaciones de rúbrica' });
  }
};

// Guardar o actualizar calificación de rúbrica en el perfil/proyecto del alumno
exports.guardarRubrica = async (req, res) => {
  const { proyecto_id, metodologia, dominio, aportes } = req.body;

  const nMet = Number(metodologia);
  const nDom = Number(dominio);
  const nApo = Number(aportes);

  if (!proyecto_id || [nMet, nDom, nApo].some(n => Number.isNaN(n) || n < 1 || n > 10)) {
    return res.status(400).json({ mensaje: 'Selecciona un alumno y calificaciones válidas entre 1 y 10' });
  }

  try {
    const [asignacion] = await db.query(
      `SELECT p.id, p.titulo, p.estudiante_id, u.nombre, u.apellido
       FROM proyectos p
       JOIN proyecto_docentes pd ON pd.proyecto_id = p.id
       JOIN usuarios u ON p.estudiante_id = u.id
       WHERE p.id = ? AND pd.docente_id = ?`,
      [proyecto_id, req.user.id]
    );

    if (asignacion.length === 0) {
      return res.status(403).json({ mensaje: 'No tienes asignado este proyecto' });
    }

    const promedio = Number(((nMet + nDom + nApo) / 3).toFixed(2));
    const alumno = asignacion[0];

    await db.query(
      `INSERT INTO evaluaciones_rubrica (proyecto_id, docente_id, metodologia, dominio, aportes, promedio)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         metodologia = VALUES(metodologia),
         dominio = VALUES(dominio),
         aportes = VALUES(aportes),
         promedio = VALUES(promedio)`,
      [proyecto_id, req.user.id, nMet, nDom, nApo, promedio]
    );

    await db.query(
      "INSERT INTO notificaciones (usuario_id, tipo, mensaje) VALUES (?, 'DICTAMEN', ?)",
      [
        alumno.estudiante_id,
        `Se registró una calificación de rúbrica (${promedio.toFixed(1)} / 10) en tu proyecto.`
      ]
    );

    res.status(201).json({
      mensaje: 'Calificación guardada en el perfil del estudiante',
      evaluacion: {
        proyecto_id: Number(proyecto_id),
        metodologia: nMet,
        dominio: nDom,
        aportes: nApo,
        promedio
      }
    });
  } catch (error) {
    console.error('Error al guardar rúbrica:', error);
    res.status(500).json({ mensaje: 'Error en el servidor al guardar la calificación' });
  }
};