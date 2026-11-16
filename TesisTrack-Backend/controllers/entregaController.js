const db = require('../config/db');
const { siguienteVersion, formatearTamano, pesoValido } = require('../utils/validaciones');

// HU-02: el estudiante sube la versión actualizada de su documento en PDF.
// El formato y el peso (máx. 10 MB) ya se validaron en el middleware subirPDF.
exports.subirEntrega = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ mensaje: 'Debes adjuntar un archivo PDF' });
  }
  if (!pesoValido(req.file.size)) {
    return res.status(400).json({ mensaje: 'El archivo está vacío o excede 10 MB' });
  }

  try {
    const [proyectos] = await db.query(
      'SELECT id, fase_actual_id FROM proyectos WHERE estudiante_id = ?',
      [req.user.id]
    );
    if (proyectos.length === 0) {
      return res.status(404).json({ mensaje: 'No tienes un proyecto de titulación registrado' });
    }
    const proyecto = proyectos[0];

    const hitoId = req.body.hito_id ? parseInt(req.body.hito_id, 10) : null;
    let faseId = proyecto.fase_actual_id;
    let codigo = `F${faseId}`;

    if (hitoId) {
      const [hitos] = await db.query('SELECT id, codigo, fase_id FROM hitos WHERE id = ?', [hitoId]);
      if (hitos.length === 0) {
        return res.status(400).json({ mensaje: 'El hito indicado no existe' });
      }
      faseId = hitos[0].fase_id;
      codigo = hitos[0].codigo;
    }

    // Versión correlativa: cuántas entregas previas hay del mismo hito
    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) AS total FROM entregas WHERE proyecto_id = ? AND hito_id <=> ?',
      [proyecto.id, hitoId]
    );
    const version = siguienteVersion(Number(total));

    const [resultado] = await db.query(
      `INSERT INTO entregas
         (proyecto_id, fase_id, hito_id, codigo, numero_version, archivo_url, nombre_original, tamano, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'EN_REVISION')`,
      [proyecto.id, faseId, hitoId, codigo, version, `/uploads/${req.file.filename}`,
        req.file.originalname, formatearTamano(req.file.size)]
    );

    // Una nueva entrega reabre el proyecto si tenía observaciones o rechazo
    await db.query("UPDATE proyectos SET estado = 'EN_PROGRESO' WHERE id = ?", [proyecto.id]);

    // HU-02 c3: notificación de entrega al asesor asignado
    const [asesores] = await db.query(
      "SELECT docente_id FROM proyecto_docentes WHERE proyecto_id = ? AND tipo_rol = 'ASESOR'",
      [proyecto.id]
    );
    for (const { docente_id } of asesores) {
      await db.query(
        "INSERT INTO notificaciones (usuario_id, tipo, mensaje) VALUES (?, 'ENTREGA', ?)",
        [docente_id, `Nueva entrega ${codigo} (${version}) pendiente de revisión`]
      );
    }

    res.status(201).json({
      mensaje: 'Entrega enviada a revisión',
      id: resultado.insertId,
      numero_version: version,
      estado: 'EN_REVISION',
      asesor_notificado: asesores.length > 0,
    });
  } catch (error) {
    console.error('Error al subir entrega:', error);
    res.status(500).json({ mensaje: 'Error en el servidor al registrar la entrega' });
  }
};

// Bandeja del docente: entregas EN_REVISION de los proyectos que tiene asignados.
exports.listarPendientes = async (req, res) => {
  try {
    const [entregas] = await db.query(
      `SELECT e.id, e.codigo, e.numero_version, e.nombre_original, e.archivo_url, e.tamano,
              e.fecha_entrega, p.id AS proyecto_id, p.titulo,
              u.nombre AS estudiante_nombre, u.apellido AS estudiante_apellido, pd.tipo_rol
       FROM entregas e
       JOIN proyectos p ON e.proyecto_id = p.id
       JOIN proyecto_docentes pd ON pd.proyecto_id = p.id
       JOIN usuarios u ON p.estudiante_id = u.id
       WHERE pd.docente_id = ? AND e.estado = 'EN_REVISION'
       ORDER BY e.fecha_entrega ASC`,
      [req.user.id]
    );
    res.json({ entregas });
  } catch (error) {
    console.error('Error al listar pendientes:', error);
    res.status(500).json({ mensaje: 'Error al consultar las entregas pendientes' });
  }
};
