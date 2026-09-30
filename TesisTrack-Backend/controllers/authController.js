const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTRO DE USUARIO

exports.registrar = async (req, res) => {
    const { nombre, apellido, correo, password, rol_id } = req.body;

    // Validación básica de campos requeridos
    if (!nombre || !apellido || !correo || !password || !rol_id) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si el correo ya existe
        const [usuarioExistente] = await db.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
        if (usuarioExistente.length > 0) {
            return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado' });
        }

        // Encriptar la contraseña (hash)
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insertar el nuevo usuario
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
        // Buscar el usuario y traer el nombre de su rol
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

        // Comparar la contraseña con el hash guardado
        const passwordCorrecto = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordCorrecto) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas (contraseña incorrecta)' });
        }

        // Generar Token JWT con la información relevante
        const token = jwt.sign(
            { 
                id: usuario.id, 
                correo: usuario.correo, 
                rol_id: usuario.rol_id,
                rol: usuario.rol_nombre 
            },
            process.env.JWT_SECRET || 'clave_secreta_default',
            { expiresIn: '8h' } // Duración del token
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