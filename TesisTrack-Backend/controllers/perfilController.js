const db = require('../config/db');

const COLUMNAS_PERFIL =
  'id, codigo, nombre, apellido, correo, rol_id, departamento, grado_academico, especialidad, cedula';

const obtenerPerfil = async (req, res) => {
  try {
    const usuarioId = req.user?.id || req.user?.userId;
    if (!usuarioId) {
      return res.status(401).json({ mensaje: 'Usuario no autenticado' });
    }

    const [rows] = await db.query(
      `SELECT ${COLUMNAS_PERFIL} FROM usuarios WHERE id = ? LIMIT 1`,
      [usuarioId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    return res.json({ perfil: rows[0] });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return res.status(500).json({ mensaje: 'Error interno al obtener el perfil' });
  }
};

const actualizarPerfil = async (req, res) => {
  try {
    const usuarioId = req.user?.id || req.user?.userId;
    if (!usuarioId) {
      return res.status(401).json({ mensaje: 'Usuario no autenticado' });
    }

    const {
      nombre,
      correo,
      departamento,
      grado_academico,
      especialidad,
      cedula
    } = req.body;

    const campos = [];
    const valores = [];

    if (typeof nombre === 'string' && nombre.trim() !== '') {
      campos.push('nombre = ?');
      valores.push(nombre.trim());
    }
    if (typeof correo === 'string' && correo.trim() !== '') {
      campos.push('correo = ?');
      valores.push(correo.trim());
    }
    if (departamento !== undefined) {
      campos.push('departamento = ?');
      valores.push(departamento === '' ? null : departamento);
    }
    if (grado_academico !== undefined) {
      campos.push('grado_academico = ?');
      valores.push(grado_academico === '' ? null : grado_academico);
    }
    if (especialidad !== undefined) {
      campos.push('especialidad = ?');
      valores.push(especialidad === '' ? null : especialidad);
    }
    if (cedula !== undefined) {
      campos.push('cedula = ?');
      valores.push(cedula === '' ? null : cedula);
    }

    if (campos.length > 0) {
      valores.push(usuarioId);
      await db.query(
        `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`,
        valores
      );
    }

    const [rows] = await db.query(
      `SELECT ${COLUMNAS_PERFIL} FROM usuarios WHERE id = ? LIMIT 1`,
      [usuarioId]
    );

    return res.json({
      mensaje: 'Perfil actualizado correctamente',
      perfil: rows[0] || null
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return res.status(500).json({ mensaje: 'Error interno al actualizar el perfil' });
  }
};

module.exports = {
  obtenerPerfil,
  actualizarPerfil
};