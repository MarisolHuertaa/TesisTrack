/**
 * PRUEBAS UNITARIAS (CP-01 a CP-10)
 * Prueban las reglas de negocio de utils/validaciones.js de forma aislada:
 * sin base de datos, sin servidor y sin red.
 */
const v = require('../utils/validaciones');

describe('Pruebas unitarias – reglas de negocio de TesisTrack', () => {
  test('CP-01: acepta solo correos institucionales de la UdeG', () => {
    expect(v.esCorreoInstitucional('marisol.huerta0340@alumnos.udg.mx')).toBe(true);
    expect(v.esCorreoInstitucional('deborah.villasenor@academicos.udg.mx')).toBe(true);
    expect(v.esCorreoInstitucional('alumno@gmail.com')).toBe(false);
    expect(v.esCorreoInstitucional('falso@udg.mx.com')).toBe(false);
    expect(v.esCorreoInstitucional('')).toBe(false);
    expect(v.esCorreoInstitucional(undefined)).toBe(false);
  });

  test('CP-02: reconoce un archivo PDF válido por tipo MIME y extensión', () => {
    expect(v.esPDF({ originalname: 'Anteproyecto_v1.pdf', mimetype: 'application/pdf' })).toBe(true);
    expect(v.esPDF({ originalname: 'TESIS.PDF', mimetype: 'application/pdf' })).toBe(true);
  });

  test('CP-03: rechaza archivos que no son PDF o que fingen serlo', () => {
    expect(v.esPDF({ originalname: 'virus.exe', mimetype: 'application/x-msdownload' })).toBe(false);
    expect(v.esPDF({ originalname: 'avance.docx', mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })).toBe(false);
    expect(v.esPDF({ originalname: 'script.bat.pdf', mimetype: 'application/x-bat' })).toBe(false); // extensión falsa
    expect(v.esPDF({ originalname: 'avance', mimetype: 'application/pdf' })).toBe(false); // sin extensión
    expect(v.esPDF(null)).toBe(false);
  });

  test('CP-04: valida el límite de peso de 10 MB (casos borde)', () => {
    const MB = 1024 * 1024;
    expect(v.pesoValido(1)).toBe(true);
    expect(v.pesoValido(10 * MB)).toBe(true); // exactamente 10 MB: permitido
    expect(v.pesoValido(10 * MB + 1)).toBe(false); // 1 byte más: rechazado
    expect(v.pesoValido(0)).toBe(false); // archivo vacío
    expect(v.pesoValido(-5)).toBe(false);
    expect(v.pesoValido(NaN)).toBe(false);
  });

  test('CP-05: asigna versiones correlativas a las entregas', () => {
    expect(v.siguienteVersion(0)).toBe('v1.0');
    expect(v.siguienteVersion(1)).toBe('v2.0');
    expect(v.siguienteVersion(4)).toBe('v5.0');
    expect(v.siguienteVersion(undefined)).toBe('v1.0');
    expect(v.formatearTamano(1572864)).toBe('1.50 MB');
  });

  test('CP-06: un dictamen sin justificación no es válido', () => {
    expect(v.validarDictamen({ dictamen: 'CON_OBSERVACIONES', comentario: '' }).valido).toBe(false);
    expect(v.validarDictamen({ dictamen: 'RECHAZADO', comentario: '    ' }).valido).toBe(false);
    expect(v.validarDictamen({ dictamen: 'APROBADO' }).valido).toBe(false);
    expect(v.validarDictamen({ dictamen: 'CON_OBSERVACIONES', comentario: '' }).error)
      .toMatch(/justificación/);
  });

  test('CP-07: solo se aceptan los tres tipos de dictamen definidos', () => {
    expect(v.validarDictamen({ dictamen: 'APROBADO', comentario: 'Excelente trabajo' }).valido).toBe(true);
    expect(v.validarDictamen({ dictamen: 'CON_OBSERVACIONES', comentario: 'Corregir citas' }).valido).toBe(true);
    expect(v.validarDictamen({ dictamen: 'RECHAZADO', comentario: 'No cumple el formato' }).valido).toBe(true);
    expect(v.validarDictamen({ dictamen: 'aprobado', comentario: 'ok' }).valido).toBe(false);
    expect(v.validarDictamen({ dictamen: 'PENDIENTE', comentario: 'ok' }).valido).toBe(false);
  });

  test('CP-08: la línea de tiempo avanza de fase sin pasar de Examen', () => {
    expect(v.siguienteFase(1)).toBe(2);
    expect(v.siguienteFase(3)).toBe(4);
    expect(v.siguienteFase(4)).toBe(4); // última fase
    expect(v.porcentajePorFase(1)).toBe(0);
    expect(v.porcentajePorFase(2)).toBe(25);
    expect(v.porcentajePorFase(4)).toBe(75);
  });

  test('CP-09: el examen solo se agenda con dictamen aprobatorio y sin observaciones', () => {
    expect(v.puedeAgendarExamen({ estado: 'DICTAMEN_APROBADO', fase_actual_id: 4 })).toBe(true);
    expect(v.puedeAgendarExamen({ estado: 'EN_PROGRESO', fase_actual_id: 4 })).toBe(true);
    expect(v.puedeAgendarExamen({ estado: 'EN_PROGRESO', fase_actual_id: 2 })).toBe(false);
    expect(v.puedeAgendarExamen({ estado: 'CON_OBSERVACIONES', fase_actual_id: 4 })).toBe(false);
    expect(v.puedeAgendarExamen({ estado: 'RECHAZADO', fase_actual_id: 4 })).toBe(false);
    expect(v.puedeAgendarExamen(null)).toBe(false);
  });

  test('CP-10: interpreta la fecha y el horario en el formato que envía el frontend', () => {
    expect(v.parsearFecha('11 de Noviembre de 2026')).toBe('2026-11-11');
    expect(v.parsearFecha('2026-12-01')).toBe('2026-12-01');
    expect(v.parsearFecha('32 de Enero de 2026')).toBeNull();
    expect(v.parsearFecha('mañana')).toBeNull();

    expect(v.parsearHorario('10:00 AM - 11:30 AM')).toEqual({ inicio: '10:00:00', fin: '11:30:00' });
    expect(v.parsearHorario('12:00 PM - 01:30 PM')).toEqual({ inicio: '12:00:00', fin: '13:30:00' });
    expect(v.parsearHorario('02:00 PM - 01:00 PM')).toBeNull(); // fin antes del inicio
    expect(v.parsearHorario('sin horario')).toBeNull();
  });
});
