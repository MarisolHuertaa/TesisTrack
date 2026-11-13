require('dotenv').config();
const app = require('./app');
const db = require('./config/db');

// Probar la conexión al iniciar el servidor
db.getConnection()
  .then((connection) => {
    console.log('✅ Conexión exitosa a la base de datos (TesisTrack)');
    connection.release();
  })
  .catch((err) => {
    console.error('❌ Error al conectar a la base de datos:', err.message);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor TesisTrack escuchando en el puerto ${PORT}`);
});
