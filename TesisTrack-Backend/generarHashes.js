const bcrypt = require('bcryptjs');

async function generarScriptSQL() {
  console.log("USE tesistrack;\n");

  // 1. Coordinación
  const hashCoord = await bcrypt.hash('COORD2026', 10);
  console.log(`UPDATE usuarios SET password_hash = '${hashCoord}' WHERE correo = 'coordinacion.titulacion@udg.mx';`);

  // 2. Docentes (DOC100001 a DOC100015)
  const correosDocentes = [
    'maria.rosas@docentes.udg.mx', 'jeronimo.duran@docentes.udg.mx', 'rocio.padilla@docentes.udg.mx',
    'dayann.alvarez@docentes.udg.mx', 'kalim.brambila@docentes.udg.mx', 'deborah.villaseñor@docentes.udg.mx',
    'ruben.orozco@docentes.udg.mx', 'noe.zermeño@docentes.udg.mx', 'vicente.meza@docentes.udg.mx',
    'carlos.hernandez@docentes.udg.mx', 'gerardo.martinez@docentes.udg.mx', 'jorge.ramirez@docentes.udg.mx',
    'alfredo.torres@docentes.udg.mx', 'moises.carrera@docentes.udg.mx', 'hector.galvez@docentes.udg.mx'
  ];

  for (let i = 0; i < correosDocentes.length; i++) {
    const pass = `DOC1000${(i + 1).toString().padStart(2, '0')}`;
    const hash = await bcrypt.hash(pass, 10);
    console.log(`UPDATE usuarios SET password_hash = '${hash}' WHERE correo = '${correosDocentes[i]}';`);
  }

  // 3. Estudiantes (DNI100001 a DNI100028)
  const correosEstudiantes = [
    'marisol.huerta@alumnos.udg.mx', 'laura.garcia@alumnos.udg.mx', 'isai.plascencia@alumnos.udg.mx',
    'hector.jovany@alumnos.udg.mx', 'gaizka.camacho@alumnos.udg.mx', 'jahir.berumen@alumnos.udg.mx',
    'orlando.fierros@alumnos.udg.mx', 'benito.flores@alumnos.udg.mx', 'angel.gonzalez@alumnos.udg.mx',
    'erik.guardado@alumnos.udg.mx', 'gustavo.gutierrez@alumnos.udg.mx', 'armando.hernandez@alumnos.udg.mx',
    'christopher.herrera@alumnos.udg.mx', 'miguel.lobo@alumnos.udg.mx', 'alberto.lopez@alumnos.udg.mx',
    'cesar.medina@alumnos.udg.mx', 'daniel.medina@alumnos.udg.mx', 'manuel.montes@alumnos.udg.mx',
    'saul.mora@alumnos.udg.mx', 'itzel.padilla@alumnos.udg.mx', 'kevin.perez@alumnos.udg.mx',
    'ramiro.preciado@alumnos.udg.mx', 'gael.ramirez@alumnos.udg.mx', 'marcos.ramirez@alumnos.udg.mx',
    'eric.reyes@alumnos.udg.mx', 'fernando.serrano@alumnos.udg.mx', 'edgar.uribe@alumnos.udg.mx',
    'paulina.villalpando@alumnos.udg.mx'
  ];

  for (let i = 0; i < correosEstudiantes.length; i++) {
    const pass = `DNI1000${(i + 1).toString().padStart(2, '0')}`;
    const hash = await bcrypt.hash(pass, 10);
    console.log(`UPDATE usuarios SET password_hash = '${hash}' WHERE correo = '${correosEstudiantes[i]}';`);
  }
}

generarScriptSQL();