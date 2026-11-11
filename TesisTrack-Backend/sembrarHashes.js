const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function actualizarHashes() {
  try {
    console.log('🔄 Actualizando contraseñas cifradas en MariaDB...');

    // 1. Coordinación -> COORD2026
    const hashCoord = await bcrypt.hash('COORD2026', 10);
    await db.query(
      'UPDATE usuarios SET password_hash = ? WHERE correo = ?',
      [hashCoord, 'coordinacion.titulacion@udg.mx']
    );
    console.log('✅ Coordinación actualizada (Contraseña: COORD2026)');

    // 2. Docentes -> DOC100001 a DOC100015
    const [docentes] = await db.query(
      'SELECT id, correo FROM usuarios WHERE rol_id = 2 ORDER BY id ASC'
    );
    for (let i = 0; i < docentes.length; i++) {
      const pass = `DOC1000${(i + 1).toString().padStart(2, '0')}`;
      const hash = await bcrypt.hash(pass, 10);
      await db.query(
        'UPDATE usuarios SET password_hash = ? WHERE id = ?',
        [hash, docentes[i].id]
      );
    }
    console.log(`✅ ${docentes.length} Docentes actualizados`);

    // 3. Estudiantes -> DNI100001 a DNI100028
    const [estudiantes] = await db.query(
      'SELECT id, correo FROM usuarios WHERE rol_id = 1 ORDER BY id ASC'
    );
    for (let i = 0; i < estudiantes.length; i++) {
      const pass = `DNI1000${(i + 1).toString().padStart(2, '0')}`;
      const hash = await bcrypt.hash(pass, 10);
      await db.query(
        'UPDATE usuarios SET password_hash = ? WHERE id = ?',
        [hash, estudiantes[i].id]
      );
    }
    console.log(`✅ ${estudiantes.length} Estudiantes actualizados`);

    console.log('🎉 Base de datos lista.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

actualizarHashes();