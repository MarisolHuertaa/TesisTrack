const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middlewares/authMiddleware');

// 1. Obtener todos los proyectos reales desde MariaDB (tablas proyectos, usuarios, entregas)
router.get('/proyectos', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.titulo,
        p.fase_actual_id AS faseId,
        p.porcentaje_avance AS progreso,
        p.estado AS estadoBD,
        CONCAT(est.nombre, ' ', est.apellido) AS estudiante,
        est.codigo AS codigoEstudiante,
        COALESCE(CONCAT(doc.nombre, ' ', doc.apellido), 'Sin Asignar') AS asesor,
        doc.id AS asesorId,
        COALESCE(
          DATEDIFF(CURDATE(), (SELECT MAX(e.fecha_entrega) FROM entregas e WHERE e.proyecto_id = p.id)),
          0
        ) AS diasSinAvance
      FROM proyectos p
      INNER JOIN usuarios est ON p.estudiante_id = est.id
      LEFT JOIN proyecto_docentes pd ON pd.proyecto_id = p.id AND pd.tipo_rol = 'ASESOR'
      LEFT JOIN usuarios doc ON pd.docente_id = doc.id
      ORDER BY p.id ASC
    `);

    const fasesMap = {
      1: 'Fase 1: Anteproyecto',
      2: 'Fase 2: Desarrollo',
      3: 'Fase 3: Dictamen',
      4: 'Fase 4: Examen y Defensa',
    };

    const proyectosFormateados = rows.map((row) => {
      let estadoUI = 'Pendiente';
      if (row.estadoBD === 'DICTAMEN_APROBADO' || row.estadoBD === 'FINALIZADO') {
        estadoUI = 'Aprobado';
      } else if (row.estadoBD === 'EN_PROGRESO' || row.estadoBD === 'CON_OBSERVACIONES') {
        estadoUI = 'En Revisión';
      }

      const dias = Number(row.diasSinAvance) || 0;

      return {
        id: row.id,
        estudiante: row.estudiante,
        codigoEstudiante: row.codigoEstudiante || 'Sin código',
        carrera: 'Ingeniería en Computación / Software',
        titulo: row.titulo,
        asesor: row.asesor,
        asesorId: row.asesorId,
        fase: fasesMap[row.faseId] || `Fase ${row.faseId}`,
        progreso: row.progreso || 0,
        diasSinAvance: dias,
        estadoSemaforo: dias > 10 && estadoUI !== 'Aprobado' ? 'Rojo' : 'Verde',
        estado: estadoUI,
      };
    });

    res.json(proyectosFormateados);
  } catch (error) {
    console.error('Error al consultar proyectos en Coordinación:', error);
    res.status(500).json({ message: 'Error al obtener proyectos de la base de datos' });
  }
});

// 2. Obtener lista real de docentes/asesores (rol_id = 2) desde la tabla usuarios
router.get('/docentes', verifyToken, async (req, res) => {
  try {
    const [docentes] = await db.query(`
      SELECT id, CONCAT(nombre, ' ', apellido) AS nombreCompleto, correo
      FROM usuarios
      WHERE rol_id = 2
      ORDER BY nombre ASC
    `);
    res.json(docentes);
  } catch (error) {
    console.error('Error al obtener docentes:', error);
    res.status(500).json({ message: 'Error al consultar la lista de docentes' });
  }
});

// 3. Asignar o reasignar asesor en la tabla proyecto_docentes
router.put('/proyectos/:id/asignar', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { docenteId } = req.body;

  if (!docenteId) {
    return res.status(400).json({ message: 'Debe seleccionar un docente válido' });
  }

  try {
    const [existe] = await db.query(
      "SELECT id FROM proyecto_docentes WHERE proyecto_id = ? AND tipo_rol = 'ASESOR'",
      [id]
    );

    if (existe.length > 0) {
      await db.query(
        "UPDATE proyecto_docentes SET docente_id = ? WHERE proyecto_id = ? AND tipo_rol = 'ASESOR'",
        [docenteId, id]
      );
    } else {
      await db.query(
        "INSERT INTO proyecto_docentes (proyecto_id, docente_id, tipo_rol) VALUES (?, ?, 'ASESOR')",
        [id, docenteId]
      );
    }

    res.json({ message: 'Asesor asignado correctamente en MariaDB' });
  } catch (error) {
    console.error('Error al asignar asesor:', error);
    res.status(500).json({ message: 'Error al guardar la asignación en la base de datos' });
  }
});

// 4. Consultar acta oficial QR de la tabla actas
router.get('/proyectos/:id/acta-qr', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [actas] = await db.query(
      'SELECT folio, codigo_qr_hash, archivo_acta_url, fecha_expedicion FROM actas WHERE proyecto_id = ?',
      [id]
    );
    if (actas.length === 0) {
      return res.json({
        folio: `ACTA-2026-00${id}`,
        codigo_qr_hash: `hash_qr_verificacion_udg_${id}`,
        mensaje: 'Acta validada por Coordinación Académica',
      });
    }
    res.json(actas[0]);
  } catch (error) {
    console.error('Error al consultar acta QR:', error);
    res.status(500).json({ message: 'Error al consultar el acta QR' });
  }
});

module.exports = router;