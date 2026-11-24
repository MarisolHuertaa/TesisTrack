const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const proyectoRoutes = require('./routes/proyectoRoutes');
const entregaRoutes = require('./routes/entregaRoutes');
const disponibilidadRoutes = require('./routes/disponibilidadRoutes');
const coordinacionRoutes = require('./routes/coordinacionRoutes');
const { UPLOAD_DIR } = require('./middlewares/upload');

// La app se define aquí, sin app.listen(), para que las pruebas puedan importarla
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/entregas', entregaRoutes);
app.use('/api/disponibilidad', disponibilidadRoutes);
app.use('/api/coordinacion', coordinacionRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

module.exports = app;
