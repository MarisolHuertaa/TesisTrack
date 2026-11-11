/**
 * Base de datos simulada en memoria para las pruebas.
 *
 * Reemplaza a config/db.js (mysql2) mediante jest.mock(). Responde a las mismas consultas
 * SQL que usan los controladores, devolviendo el formato de mysql2: [filas] o [{ insertId }].
 * Así las pruebas ejecutan el código real de la API sin necesitar un servidor MySQL,
 * y corren igual en cualquier computadora y en GitHub Actions.
 */

const estado = { tablas: {}, ids: {}, fallarSiguiente: false };

function semilla() {
  estado.tablas = {
    roles: [
      { id: 1, nombre: 'ESTUDIANTE' },
      { id: 2, nombre: 'DOCENTE' },
      { id: 3, nombre: 'COORDINADOR' },
    ],
    usuarios: [], // los usuarios con contraseña se crean en tests/helpers/datos.js
    hitos: [
      { id: 1, codigo: '1.1', nombre: 'Planteamiento del problema', semana_sugerida: 'Semana 2', fecha_limite: '2026-09-15', fase_id: 1 },
      { id: 2, codigo: '1.2', nombre: 'Objetivos y justificación', semana_sugerida: 'Semana 4', fecha_limite: '2026-09-30', fase_id: 1 },
      { id: 3, codigo: '2.1', nombre: 'Marco teórico', semana_sugerida: 'Semana 8', fecha_limite: '2026-10-30', fase_id: 2 },
      { id: 4, codigo: '3.1', nombre: 'Documento final', semana_sugerida: 'Semana 14', fecha_limite: '2026-12-01', fase_id: 3 },
    ],
    proyectos: [
      { id: 1, titulo: 'Sistema Web TesisTrack', estudiante_id: 1, fase_actual_id: 1, porcentaje_avance: 0, estado: 'EN_PROGRESO' },
    ],
    proyecto_docentes: [
      { id: 1, proyecto_id: 1, docente_id: 2, tipo_rol: 'ASESOR' },
      { id: 2, proyecto_id: 1, docente_id: 3, tipo_rol: 'SINODAL' },
    ],
    entregas: [],
    dictamenes: [],
    notificaciones: [],
    disponibilidad_docentes: [],
    solicitudes_examen: [],
  };
  estado.ids = {};
  for (const [tabla, filas] of Object.entries(estado.tablas)) {
    estado.ids[tabla] = filas.reduce((max, f) => Math.max(max, f.id), 0);
  }
  estado.fallarSiguiente = false;
}

function insertar(tabla, fila) {
  // AUTO_INCREMENT: siguiente id después del mayor existente (incluye filas cargadas a mano)
  const maxActual = estado.tablas[tabla].reduce((max, f) => Math.max(max, f.id), 0);
  estado.ids[tabla] = Math.max(estado.ids[tabla], maxActual) + 1;
  const nueva = { id: estado.ids[tabla], ...fila };
  estado.tablas[tabla].push(nueva);
  return [{ insertId: nueva.id, affectedRows: 1 }];
}

const t = (nombre) => estado.tablas[nombre];
const usuario = (id) => t('usuarios').find((u) => u.id === id);

// Cada manejador: [expresión que identifica la consulta, función(params, sql) => resultado]
// El orden importa: las consultas más específicas van primero.
const manejadores = [
  // ---------- usuarios / auth ----------
  [/^SELECT id FROM usuarios WHERE correo = \?/, ([correo]) =>
    [t('usuarios').filter((u) => u.correo === correo).map(({ id }) => ({ id }))]],
  [/^INSERT INTO usuarios \(nombre, apellido, correo, password_hash, rol_id\)/, ([nombre, apellido, correo, password_hash, rol_id]) =>
    insertar('usuarios', { nombre, apellido, correo, password_hash, rol_id })],
  [/FROM usuarios u JOIN roles r ON u\.rol_id = r\.id WHERE u\.correo = \?/, ([correo]) =>
    [t('usuarios').filter((u) => u.correo === correo).map((u) => ({
      ...u, rol_nombre: t('roles').find((r) => r.id === u.rol_id).nombre,
    }))]],

  // ---------- proyectos ----------
  [/^SELECT id, fase_actual_id FROM proyectos WHERE estudiante_id = \?/, ([id]) =>
    [t('proyectos').filter((p) => p.estudiante_id === id)]],
  [/^SELECT id, estado, fase_actual_id FROM proyectos WHERE estudiante_id = \?/, ([id]) =>
    [t('proyectos').filter((p) => p.estudiante_id === id)]],
  [/^SELECT p\.\*, u\.nombre AS estudiante_nombre.*WHERE p\.estudiante_id = \?/, ([id]) =>
    [t('proyectos').filter((p) => p.estudiante_id === id).map((p) => {
      const u = usuario(p.estudiante_id);
      return { ...p, estudiante_nombre: u.nombre, estudiante_apellido: u.apellido, estudiante_codigo: null };
    })]],
  [/^UPDATE proyectos SET estado = 'EN_PROGRESO' WHERE id = \?/, ([id]) => {
    const p = t('proyectos').find((x) => x.id === id);
    if (p) p.estado = 'EN_PROGRESO';
    return [{ affectedRows: p ? 1 : 0 }];
  }],
  [/^UPDATE proyectos SET estado = \?, fase_actual_id = \?, porcentaje_avance = \? WHERE id = \?/, ([est, fase, pct, id]) => {
    const p = t('proyectos').find((x) => x.id === id);
    Object.assign(p, { estado: est, fase_actual_id: fase, porcentaje_avance: pct });
    return [{ affectedRows: 1 }];
  }],

  // ---------- proyecto_docentes ----------
  [/^SELECT docente_id FROM proyecto_docentes WHERE proyecto_id = \? AND tipo_rol = 'ASESOR'/, ([pid]) =>
    [t('proyecto_docentes').filter((d) => d.proyecto_id === pid && d.tipo_rol === 'ASESOR')
      .map(({ docente_id }) => ({ docente_id }))]],
  [/^SELECT id FROM proyecto_docentes WHERE proyecto_id = \? AND docente_id = \?/, ([pid, did]) =>
    [t('proyecto_docentes').filter((d) => d.proyecto_id === pid && d.docente_id === did).map(({ id }) => ({ id }))]],
  [/^SELECT pd\.tipo_rol, u\.nombre, u\.apellido, u\.correo FROM proyecto_docentes pd/, ([pid]) =>
    [t('proyecto_docentes').filter((d) => d.proyecto_id === pid).map((d) => {
      const u = usuario(d.docente_id);
      return { tipo_rol: d.tipo_rol, nombre: u.nombre, apellido: u.apellido, correo: u.correo };
    })]],

  // ---------- hitos ----------
  [/^SELECT id, codigo, fase_id FROM hitos WHERE id = \?/, ([id]) =>
    [t('hitos').filter((h) => h.id === id)]],
  [/^SELECT COUNT\(\*\) AS pendientes FROM hitos h/, ([faseId, pid]) =>
    [[{ pendientes: t('hitos').filter((h) => h.fase_id === faseId && !t('entregas').some(
      (e) => e.hito_id === h.id && e.proyecto_id === pid && e.estado === 'APROBADO')).length }]]],
  [/^SELECT id, codigo, nombre, semana_sugerida/, () => [t('hitos')]],

  // ---------- entregas ----------
  [/^SELECT COUNT\(\*\) AS total FROM entregas WHERE proyecto_id = \? AND hito_id <=> \?/, ([pid, hid]) =>
    [[{ total: t('entregas').filter((e) => e.proyecto_id === pid && e.hito_id === hid).length }]]],
  [/^INSERT INTO entregas/, ([proyecto_id, fase_id, hito_id, codigo, numero_version, archivo_url, nombre_original, tamano]) =>
    insertar('entregas', {
      proyecto_id, fase_id, hito_id, codigo, numero_version, archivo_url, nombre_original, tamano,
      estado: 'EN_REVISION', fecha_entrega: new Date().toISOString(),
    })],
  [/^SELECT e\.id, e\.estado, e\.fase_id, e\.proyecto_id, p\.estudiante_id, p\.fase_actual_id/, ([id]) =>
    [t('entregas').filter((e) => e.id === id).map((e) => {
      const p = t('proyectos').find((x) => x.id === e.proyecto_id);
      return { ...e, estudiante_id: p.estudiante_id, fase_actual_id: p.fase_actual_id };
    })]],
  [/WHERE pd\.docente_id = \? AND e\.estado = 'EN_REVISION'/, ([did]) => {
    const proyectosDocente = t('proyecto_docentes').filter((d) => d.docente_id === did);
    return [t('entregas').filter((e) => e.estado === 'EN_REVISION')
      .flatMap((e) => proyectosDocente.filter((d) => d.proyecto_id === e.proyecto_id).map((d) => {
        const p = t('proyectos').find((x) => x.id === e.proyecto_id);
        const u = usuario(p.estudiante_id);
        return { ...e, titulo: p.titulo, estudiante_nombre: u.nombre, estudiante_apellido: u.apellido, tipo_rol: d.tipo_rol };
      }))];
  }],
  [/^SELECT DISTINCT e\.id/, ([pid]) => [t('entregas').filter((e) => e.proyecto_id === pid)]],
  [/^UPDATE entregas SET estado = \? WHERE id = \?/, ([est, id]) => {
    t('entregas').find((e) => e.id === id).estado = est;
    return [{ affectedRows: 1 }];
  }],

  // ---------- dictámenes ----------
  [/^INSERT INTO dictamenes/, ([entrega_id, docente_id, dictamen, comentario]) =>
    insertar('dictamenes', { entrega_id, docente_id, dictamen, comentario })],

  // ---------- notificaciones ----------
  [/^INSERT INTO notificaciones \(usuario_id, tipo, mensaje\) VALUES \(\?, '(\w+)', \?\)/, ([usuario_id, mensaje], sql) =>
    insertar('notificaciones', {
      usuario_id, mensaje, tipo: sql.match(/VALUES \(\?, '(\w+)'/)[1], leido: false,
      fecha_creacion: new Date().toISOString(),
    })],
  [/FROM notificaciones WHERE usuario_id = \?/, ([uid]) =>
    [t('notificaciones').filter((n) => n.usuario_id === uid)]],

  // ---------- disponibilidad ----------
  [/^SELECT id FROM disponibilidad_docentes WHERE docente_id = \? AND fecha_disponible = \?/, ([did, fecha, fin, inicio]) =>
    [t('disponibilidad_docentes').filter((b) => b.docente_id === did && b.fecha_disponible === fecha
      && b.disponible && b.hora_inicio < fin && b.hora_fin > inicio)]],
  [/^SELECT id, fecha_disponible, hora_inicio, hora_fin, modalidad, ubicacion FROM disponibilidad_docentes/, ([did]) =>
    [t('disponibilidad_docentes').filter((b) => b.docente_id === did && b.disponible)]],
  [/^INSERT INTO disponibilidad_docentes/, ([docente_id, fecha_disponible, hora_inicio, hora_fin, modalidad, ubicacion]) =>
    insertar('disponibilidad_docentes', { docente_id, fecha_disponible, hora_inicio, hora_fin, modalidad, ubicacion, disponible: true })],
  [/^UPDATE disponibilidad_docentes SET disponible = FALSE WHERE id = \? AND docente_id = \?/, ([id, did]) => {
    const b = t('disponibilidad_docentes').find((x) => x.id === id && x.docente_id === did);
    if (b) b.disponible = false;
    return [{ affectedRows: b ? 1 : 0 }];
  }],
  [/FROM disponibilidad_docentes d JOIN proyecto_docentes pd/, ([pid]) => {
    const docentes = t('proyecto_docentes').filter((d) => d.proyecto_id === pid).map((d) => d.docente_id);
    return [t('disponibilidad_docentes').filter((b) => b.disponible && docentes.includes(b.docente_id))];
  }],

  // ---------- solicitudes de examen ----------
  [/^SELECT COUNT\(\*\) AS total FROM solicitudes_examen/, ([pid]) =>
    [[{ total: t('solicitudes_examen').filter((s) => s.proyecto_id === pid && s.estado === 'PENDIENTE').length }]]],
  [/^INSERT INTO solicitudes_examen/, ([proyecto_id, disponibilidad_id, opciones_horario, fecha_propuesta, hora_inicio, hora_fin, modalidad, ubicacion]) =>
    insertar('solicitudes_examen', {
      proyecto_id, disponibilidad_id, opciones_horario, fecha_propuesta, hora_inicio, hora_fin,
      modalidad, ubicacion, estado: 'PENDIENTE',
    })],
];

async function query(sql, params = []) {
  if (estado.fallarSiguiente) {
    estado.fallarSiguiente = false;
    throw new Error('Simulación: conexión a la base de datos perdida');
  }
  const limpio = sql.replace(/\s+/g, ' ').trim();
  const manejador = manejadores.find(([re]) => re.test(limpio));
  if (!manejador) {
    throw new Error(`fakeDb: consulta no soportada -> ${limpio}`);
  }
  return manejador[1](params, limpio);
}

semilla();

module.exports = {
  query,
  getConnection: async () => ({ release() {} }),
  // utilidades exclusivas para pruebas
  __reset: semilla,
  __tablas: () => estado.tablas,
  __insertar: insertar,
  __fallarSiguienteConsulta: () => { estado.fallarSiguiente = true; },
};
