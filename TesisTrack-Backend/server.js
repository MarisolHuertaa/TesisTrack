const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares (Funciones intermediarias que procesan las peticiones HTTP antes de que lleguen a las rutas: /api/auth/register o /api/auth/login)
app.use(cors());
app.use(express.json());

// Importar Rutas
const authRoutes = require('./routes/authRoutes');

// Usar Rutas
app.use('/api/auth', authRoutes);

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor TesisTrack escuchando en el puerto ${PORT}`);
});