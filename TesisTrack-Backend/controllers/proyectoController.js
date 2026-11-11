const db = require('../config/db');

exports.obtenerMiProyecto = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const rolId = req.user.rol_id;

        let sql = '';
        let params = [];

        if (rolId === 1) { 
            sql = `
                SELECT p.*, u.nombre AS estudiante_nombre, u.apellido AS estudiante_apellido, u.codigo AS estudiante_codigo
                FROM proyectos p
                JOIN usuarios u ON p.estudiante_id = u.id
                WHERE p.estudiante_id = ?
            `;
            params = [usuarioId];
        } else if (rolId === 2) { 
            sql = `
                SELECT p.*, pd.tipo_rol, u.nombre AS estudiante_nombre, u.apellido AS estudiante_apellido, u.codigo AS estudiante_codigo
                FROM proyectos p
                JOIN proyecto_docentes pd ON p.id = pd.proyecto_id
                JOIN usuarios u ON p.estudiante_id = u.id
                WHERE pd.docente_id = ?
            `;
            params = [usuarioId];
        } else { 
            sql = `
                SELECT p.*, u.nombre AS estudiante_nombre, u.apellido AS estudiante_apellido, u.codigo AS estudiante_codigo
                FROM proyectos p
                JOIN usuarios u ON p.estudiante_id = u.id
            `;
        }

        const [proyectos] = await db.query(sql, params);

        // Obtener notificaciones del usuario logueado desde MariaDB
        const [notificaciones] = await db.query(
            `SELECT id, tipo, mensaje, leido, fecha_creacion 
             FROM notificaciones 
             WHERE usuario_id = ? 
             ORDER BY fecha_creacion DESC`,
            [usuarioId]
        );

        if (proyectos.length === 0) {
            return res.json({ 
                proyecto: null,
                proyectos: [],
                entregas: [],
                hitos: [],
                docentes: [],
                notificaciones 
            });
        }

        if (rolId === 1) {
            const proyectoId = proyectos[0].id;
            
            // 1. Obtener entregas
            const [entregas] = await db.query(
                `SELECT DISTINCT 
                        e.id,
                        e.proyecto_id,
                        e.fase_id,
                        e.hito_id,
                        COALESCE(h.codigo, e.codigo) AS codigo,
                        COALESCE(h.nombre, e.nombre_original) AS hito_nombre,
                        e.nombre_original,
                        e.numero_version,
                        e.tamano,
                        e.estado,
                        DATE_FORMAT(COALESCE(h.fecha_limite, e.fecha_limite), '%d de %b, %Y') AS fecha_limite_formateada,
                        DATE_FORMAT(e.fecha_entrega, '%d de %b, %Y') AS fecha_entrega_formateada
                 FROM entregas e 
                 LEFT JOIN hitos h ON e.hito_id = h.id 
                 WHERE e.proyecto_id = ? 
                 ORDER BY e.fecha_entrega DESC, e.id DESC`,
                [proyectoId]
            );

            // 2. Obtener docentes asignados (Asesor y Sinodales)
            const [docentes] = await db.query(
                `SELECT pd.tipo_rol, u.nombre, u.apellido, u.correo
                 FROM proyecto_docentes pd
                 JOIN usuarios u ON pd.docente_id = u.id
                 WHERE pd.proyecto_id = ?`,
                [proyectoId]
            );

            // 3. Obtener catálogo de hitos
            const [hitosRows] = await db.query(
                `SELECT id, codigo, nombre, semana_sugerida, 
                        DATE_FORMAT(fecha_limite, '%d de %b, %Y') AS fecha_limite, 
                        fase_id 
                 FROM hitos 
                 ORDER BY fase_id ASC, id ASC`
            );

            // Separar Asesor y Sinodales
            const asesorObj = docentes.find(d => d.tipo_rol === 'ASESOR');
            const asesorNombre = asesorObj ? `${asesorObj.nombre} ${asesorObj.apellido}` : 'Sin Asesor Asignado';

            return res.json({
                proyecto: {
                    ...proyectos[0],
                    asesor: asesorNombre,
                    docentes
                },
                entregas,
                hitos: hitosRows,
                notificaciones
            });
        }

        res.json({ 
            proyectos,
            notificaciones 
        });

    } catch (error) {
        console.error('Error al obtener proyecto:', error);
        res.status(500).json({ mensaje: 'Error al consultar datos en el servidor' });
    }
};