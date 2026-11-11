const db = require('../config/db'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt');
const { esCorreoInstitucional } = require('../utils/validaciones');

// 1. REGISTRO DE USUARIO
exports.registrar = async (req, res) => {
    const { nombre, apellido, correo, password, rol_id } = req.body;

    if (!nombre || !apellido || !correo || !password || !rol_id) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    if (!esCorreoInstitucional(correo)) {
        return res.status(400).json({ mensaje: 'Debes usar tu correo institucional (@...udg.mx)' });
    }

    try {
        const [usuarioExistente] = await db.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
        if (usuarioExistente.length > 0) {
            return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // La columna en SQUEMA.sql se llama password_hash (antes se insertaba en 'password' y fallaba)
        const sql = 'INSERT INTO usuarios (nombre, apellido, correo, password_hash, rol_id) VALUES (?, ?, ?, ?, ?)';
        const [resultado] = await db.query(sql, [nombre, apellido, correo, password_hash, rol_id]);

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            usuarioId: resultado.insertId
        });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ mensaje: 'Error en el servidor al registrar usuario' });
    }
};

// 2. LOGIN DE USUARIO
exports.login = async (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
    }

    try {
        // Seleccionar password_hash de la tabla usuarios
        const sql = `
            SELECT u.id, u.nombre, u.apellido, u.correo, u.password_hash, u.rol_id, r.nombre AS rol_nombre 
            FROM usuarios u
            JOIN roles r ON u.rol_id = r.id
            WHERE u.correo = ?
        `;
        const [usuarios] = await db.query(sql, [correo]);

        if (usuarios.length === 0) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas (correo no encontrado)' });
        }

        const usuario = usuarios[0];

        // Comparar la contraseña ingresada contra usuario.password_hash
        const passwordCorrecto = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordCorrecto) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas (contraseña incorrecta)' });
        }

        // Generar Token JWT
        const token = jwt.sign(
            { 
                id: usuario.id, 
                correo: usuario.correo, 
                rol_id: usuario.rol_id,
                rol: usuario.rol_nombre 
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                rol: usuario.rol_nombre
            }
        });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ mensaje: 'Error en el servidor al iniciar sesión' });
    }
};