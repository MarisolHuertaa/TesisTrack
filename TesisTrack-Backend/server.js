const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 1. Inicializar la aplicación Express
const app = express();

// 2. Middlewares
app.use(cors()); // Permite peticiones desde el frontend local
app.use(express.json());

// 3. Servir archivos estáticos (PDFs y archivos subidos por los alumnos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Importar la conexión a la base de datos (db.js)
const db = require('./config/db');

// Probar la conexión al iniciar el servidor
db.getConnection()
  .then((connection) => {
    console.log('✅ Conexión exitosa a la base de datos (TesisTrack)');
    connection.release(); // Libera la conexión de vuelta al pool
  })
  .catch((err) => {
    console.error('❌ Error al conectar a la base de datos:', err.message);
  });

// Importar Rutas
const authRoutes = require('./routes/authRoutes');
const proyectoRoutes = require('./routes/proyectoRoutes'); // <-- Integrado

// Usar Rutas
app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectoRoutes); // <-- Integrado

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor TesisTrack escuchando en el puerto ${PORT}`);
});