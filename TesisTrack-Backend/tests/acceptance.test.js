/**
 * PRUEBAS DE ACEPTACIÓN (CP-21 a CP-30)
 * Cada prueba verifica un criterio "Dado / Cuando / Entonces" de las historias de usuario
 * del Backlog (HU-01, 02, 03, 04, 06 y 07), recorriendo el flujo completo como lo haría
 * el usuario en la demo: el estudiante sube, el docente dictamina, la fase avanza, se agenda examen.
 */
const request = require('supertest');
const app = require('../app');
const db = require('../config/db');
const { reiniciarBD, auth, PDF_VALIDO } = require('./helpers/datos');

beforeEach(reiniciarBD);

// ---------- Acciones reutilizables del flujo ----------
const subirPDF = (hitoId, nombre = `avance_hito${hitoId}.pdf`) =>
  request(app).post('/api/entregas/subir')
    .set(auth('estudiante'))
    .field('hito_id', String(hitoId))
    .attach('archivo', PDF_VALIDO, { filename: nombre, contentType: 'application/pdf' });

const dictaminar = (entregaId, dictamen, comentario, docente = 'asesor') =>
  request(app).post(`/api/entregas/${entregaId}/dictamen`)
    .set(auth(docente))
    .send({ dictamen, comentario });

const proyecto = () => db.__tablas().proyectos[0];
const notificacionesDe = (usuarioId) => db.__tablas().notificaciones.filter((n) => n.usuario_id === usuarioId);

describe('Pruebas de aceptación – historias de usuario del MVP', () => {
  test('CP-21 (HU-02 c1): Dado que el alumno reenvía un hito, cuando da "Enviar a revisión", entonces recibe versión correlativa y su asesor la ve', async () => {
    const v1 = await subirPDF(1, 'Anteproyecto_v1.pdf');
    await dictaminar(v1.body.id, 'CON_OBSERVACIONES', 'Falta delimitar el alcance');
    const v2 = await subirPDF(1, 'Anteproyecto_v2.pdf');

    expect(v1.body.numero_version).toBe('v1.0');
    expect(v2.body.numero_version).toBe('v2.0');

    const bandeja = await request(app).get('/api/entregas/pendientes').set(auth('asesor'));
    expect(bandeja.status).toBe(200);
    expect(bandeja.body.entregas.map((e) => e.nombre_original)).toEqual(['Anteproyecto_v2.pdf']);
  });

  test('CP-22 (HU-02 c3): Dado que la carga finaliza con éxito, entonces el asesor asignado recibe una notificación de entrega', async () => {
    const res = await subirPDF(1);

    expect(res.body.asesor_notificado).toBe(true);
    const avisos = notificacionesDe(2);
    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toMatchObject({ tipo: 'ENTREGA', leido: false });
    expect(avisos[0].mensaje).toMatch(/1\.1 \(v1\.0\)/);
    expect(notificacionesDe(3)).toHaveLength(0); // el sinodal no recibe avisos de entregas
  });

  test('CP-23 (HU-04 c1/c2): Dado que el comentario está vacío, cuando el docente envía observaciones, entonces se le pide una justificación', async () => {
    const { body: entrega } = await subirPDF(1);

    const sinTexto = await dictaminar(entrega.id, 'CON_OBSERVACIONES', '   ');
    expect(sinTexto.status).toBe(400);
    expect(sinTexto.body.mensaje).toMatch(/justificación/);
    expect(db.__tablas().dictamenes).toHaveLength(0);

    const conTexto = await dictaminar(entrega.id, 'CON_OBSERVACIONES', 'Revisar redacción del capítulo 1');
    expect(conTexto.status).toBe(201);
  });

  test('CP-24 (HU-04 c3 + HU-03 c1): Dado que el docente confirma el dictamen, entonces el estatus cambia y el estudiante es notificado', async () => {
    const { body: entrega } = await subirPDF(1);
    const res = await dictaminar(entrega.id, 'CON_OBSERVACIONES', 'Revisar redacción del capítulo 1');

    expect(res.body.estado_proyecto).toBe('CON_OBSERVACIONES');
    expect(proyecto().estado).toBe('CON_OBSERVACIONES');
    expect(db.__tablas().entregas[0].estado).toBe('CON_OBSERVACIONES');
    expect(db.__tablas().dictamenes[0]).toMatchObject({ docente_id: 2, comentario: 'Revisar redacción del capítulo 1' });

    const aviso = notificacionesDe(1).find((n) => n.tipo === 'DICTAMEN');
    expect(aviso.mensaje).toMatch(/observaciones/);

    // HU-03 c3: el estudiante ve la notificación al consultar su panel
    const panel = await request(app).get('/api/proyectos/mi-proyecto').set(auth('estudiante'));
    expect(panel.body.notificaciones.some((n) => n.tipo === 'DICTAMEN')).toBe(true);
  });

  test('CP-25 (HU-01 c3): Dado que el asesor aprueba todos los hitos de la fase, cuando el estudiante actualiza su inicio, entonces la barra avanza a la siguiente fase', async () => {
    const h1 = await subirPDF(1);
    const h2 = await subirPDF(2);
    await dictaminar(h1.body.id, 'APROBADO', 'Planteamiento correcto');
    const ultimo = await dictaminar(h2.body.id, 'APROBADO', 'Objetivos claros');

    expect(ultimo.body).toMatchObject({ fase_avanzo: true, fase_actual_id: 2 });

    const panel = await request(app).get('/api/proyectos/mi-proyecto').set(auth('estudiante'));
    expect(panel.status).toBe(200);
    expect(panel.body.proyecto).toMatchObject({ fase_actual_id: 2, porcentaje_avance: 25 });
    expect(panel.body.proyecto.asesor).toBe('Deborah Villaseñor');
  });

  test('CP-26 (HU-01 c1): Dado que falta aprobar un hito de la fase activa, entonces la fase siguiente permanece bloqueada', async () => {
    const h1 = await subirPDF(1);
    await subirPDF(2);
    const res = await dictaminar(h1.body.id, 'APROBADO', 'Planteamiento correcto');

    expect(res.body.fase_avanzo).toBe(false);
    expect(proyecto().fase_actual_id).toBe(1);
  });

  test('CP-27 (HU-04 seguridad): un docente no asignado no puede dictaminar y una entrega no se dictamina dos veces', async () => {
    const { body: entrega } = await subirPDF(1);

    const ajeno = await dictaminar(entrega.id, 'APROBADO', 'Aprobado', 'docenteAjeno');
    expect(ajeno.status).toBe(403);

    expect((await dictaminar(entrega.id, 'APROBADO', 'Aprobado')).status).toBe(201);
    expect((await dictaminar(entrega.id, 'RECHAZADO', 'Cambio de opinión', 'sinodal')).status).toBe(409);
    expect((await dictaminar(999, 'APROBADO', 'No existe')).status).toBe(404);
  });

  test('CP-28 (HU-06 c1/c3): Dado que el docente no ha configurado horarios, entonces ve un aviso; al marcar un bloque, queda activo', async () => {
    const vacio = await request(app).get('/api/disponibilidad').set(auth('asesor'));
    expect(vacio.body.bloques).toHaveLength(0);
    expect(vacio.body.aviso).toMatch(/configurado tu disponibilidad/);

    await request(app).post('/api/disponibilidad').set(auth('asesor'))
      .send({ fecha: '2026-11-16', hora_inicio: '10:00', hora_fin: '12:00' }); // Lunes 10:00-12:00 (guion de demo)

    const conBloque = await request(app).get('/api/disponibilidad').set(auth('asesor'));
    expect(conBloque.body.bloques).toHaveLength(1);
    expect(conBloque.body.aviso).toBeUndefined();
  });

  test('CP-29 (HU-06 c2 + HU-07 c1): Dado que el docente desmarca un bloque, entonces ese horario ya no se ofrece al estudiante', async () => {
    Object.assign(proyecto(), { fase_actual_id: 4, estado: 'DICTAMEN_APROBADO' });
    const b1 = await request(app).post('/api/disponibilidad').set(auth('asesor'))
      .send({ fecha: '2026-11-16', hora_inicio: '10:00', hora_fin: '12:00' });
    await request(app).post('/api/disponibilidad').set(auth('sinodal'))
      .send({ fecha: '2026-11-17', hora_inicio: '09:00', hora_fin: '10:00' });
    await request(app).post('/api/disponibilidad').set(auth('docenteAjeno'))
      .send({ fecha: '2026-11-18', hora_inicio: '09:00', hora_fin: '10:00' });

    let ofertas = await request(app).get('/api/proyectos/horarios-disponibles').set(auth('estudiante'));
    expect(ofertas.body.bloques).toHaveLength(2); // solo docentes del comité, no el ajeno

    expect((await request(app).delete(`/api/disponibilidad/${b1.body.id}`).set(auth('asesor'))).status).toBe(200);

    ofertas = await request(app).get('/api/proyectos/horarios-disponibles').set(auth('estudiante'));
    expect(ofertas.body.bloques).toHaveLength(1);
    expect(ofertas.body.bloques[0].docente_id).toBe(3);
  });

  test('CP-30 (HU-07 c2/c3): con observaciones el agendado está bloqueado; con dictamen aprobatorio se registran hasta 3 opciones', async () => {
    const solicitud = (fecha) => request(app).post('/api/proyectos/confirmar-examen').set(auth('estudiante'))
      .send({ fecha, horario: '10:00 AM - 11:30 AM', modalidad: 'Presencial' }); // formato del frontend

    proyecto().estado = 'CON_OBSERVACIONES';
    const bloqueado = await solicitud('16 de Noviembre de 2026');
    expect(bloqueado.status).toBe(403);
    expect(bloqueado.body.bloqueado).toBe(true);

    Object.assign(proyecto(), { fase_actual_id: 4, estado: 'DICTAMEN_APROBADO' });
    const r1 = await solicitud('16 de Noviembre de 2026');
    expect(r1.status).toBe(201);
    expect(r1.body).toMatchObject({ estado: 'Asignación Pendiente de Aula', opcion: 1 });
    expect(db.__tablas().solicitudes_examen[0]).toMatchObject({
      fecha_propuesta: '2026-11-16', hora_inicio: '10:00:00', hora_fin: '11:30:00',
    });

    await solicitud('17 de Noviembre de 2026');
    await solicitud('18 de Noviembre de 2026');
    expect((await solicitud('19 de Noviembre de 2026')).status).toBe(409); // máximo 3 opciones
  });
});
