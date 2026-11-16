/**
 * PRUEBAS DE INTEGRACIÓN (CP-11 a CP-20)
 * Hacen peticiones HTTP reales a la API (Express + rutas + middlewares + controladores)
 * con Supertest. La base de datos es la simulación en memoria de tests/helpers/fakeDb.js.
 */
const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../app');
const db = require('../config/db');
const { USUARIOS, reiniciarBD, auth, PDF_VALIDO, PDF_GRANDE } = require('./helpers/datos');

beforeEach(reiniciarBD);

describe('Pruebas de integración – API REST de TesisTrack', () => {
  test('CP-11: POST /api/auth/register crea el usuario y guarda la contraseña hasheada', async () => {
    const res = await request(app).post('/api/auth/register').send({
      nombre: 'Gaizka', apellido: 'Camacho', correo: 'gaizka.camacho0678@alumnos.udg.mx',
      password: 'MiClave2026', rol_id: 1,
    });

    expect(res.status).toBe(201);
    const guardado = db.__tablas().usuarios.find((u) => u.id === res.body.usuarioId);
    expect(guardado.password_hash).toBeDefined();
    expect(guardado.password_hash).not.toBe('MiClave2026'); // nunca en texto plano
    expect(await bcrypt.compare('MiClave2026', guardado.password_hash)).toBe(true);
  });

  test('CP-12: POST /api/auth/register rechaza correos no institucionales y duplicados', async () => {
    const base = { nombre: 'X', apellido: 'Y', password: '12345678', rol_id: 1 };

    const externo = await request(app).post('/api/auth/register').send({ ...base, correo: 'x@gmail.com' });
    expect(externo.status).toBe(400);

    const duplicado = await request(app).post('/api/auth/register')
      .send({ ...base, correo: USUARIOS.estudiante.correo });
    expect(duplicado.status).toBe(400);
    expect(duplicado.body.mensaje).toMatch(/ya está registrado/);
  });

  test('CP-13: POST /api/auth/login devuelve un token válido y rechaza contraseña incorrecta', async () => {
    const ok = await request(app).post('/api/auth/login')
      .send({ correo: USUARIOS.estudiante.correo, password: 'alumnos123' });
    expect(ok.status).toBe(200);
    expect(ok.body.token).toEqual(expect.any(String));
    expect(ok.body.usuario).toMatchObject({ id: 1, rol: 'ESTUDIANTE' });
    expect(ok.body.usuario.password_hash).toBeUndefined(); // no se filtra el hash

    const mal = await request(app).post('/api/auth/login')
      .send({ correo: USUARIOS.estudiante.correo, password: 'incorrecta' });
    expect(mal.status).toBe(401);
  });

  test('CP-14: el token que entrega el login abre rutas protegidas; sin token o alterado, no', async () => {
    const login = await request(app).post('/api/auth/login')
      .send({ correo: USUARIOS.asesor.correo, password: 'docentes123' });

    const conToken = await request(app).get('/api/auth/profile')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(conToken.status).toBe(200);
    expect(conToken.body.user.rol_id).toBe(2);

    expect((await request(app).get('/api/auth/profile')).status).toBe(401);
    const alterado = await request(app).get('/api/auth/profile')
      .set('Authorization', `Bearer ${login.body.token}x`);
    expect(alterado.status).toBe(403);
  });

  test('CP-15: POST /api/entregas/subir guarda un PDF válido como versión v1.0 en revisión', async () => {
    const res = await request(app).post('/api/entregas/subir')
      .set(auth('estudiante'))
      .field('hito_id', '1')
      .attach('archivo', PDF_VALIDO, { filename: 'Anteproyecto_v1.pdf', contentType: 'application/pdf' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ numero_version: 'v1.0', estado: 'EN_REVISION' });

    const entrega = db.__tablas().entregas[0];
    expect(entrega).toMatchObject({ proyecto_id: 1, hito_id: 1, fase_id: 1, codigo: '1.1', nombre_original: 'Anteproyecto_v1.pdf' });
    expect(entrega.archivo_url).toMatch(/^\/uploads\/\d+-Anteproyecto_v1\.pdf$/);
  });

  test('CP-16: POST /api/entregas/subir rechaza archivos que no son PDF y no los registra', async () => {
    const res = await request(app).post('/api/entregas/subir')
      .set(auth('estudiante'))
      .attach('archivo', Buffer.from('contenido word'), {
        filename: 'avance.docx',
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/PDF/);
    expect(db.__tablas().entregas).toHaveLength(0);
  });

  test('CP-17: POST /api/entregas/subir rechaza PDFs de más de 10 MB', async () => {
    const res = await request(app).post('/api/entregas/subir')
      .set(auth('estudiante'))
      .attach('archivo', PDF_GRANDE, { filename: 'tesis_pesada.pdf', contentType: 'application/pdf' });

    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/10 MB/);
    expect(db.__tablas().entregas).toHaveLength(0);
  });

  test('CP-18: las rutas validan el rol (un docente no puede subir entregas ni un alumno dictaminar)', async () => {
    const docenteSube = await request(app).post('/api/entregas/subir')
      .set(auth('asesor'))
      .attach('archivo', PDF_VALIDO, { filename: 'a.pdf', contentType: 'application/pdf' });
    expect(docenteSube.status).toBe(403);

    const alumnoDictamina = await request(app).post('/api/entregas/1/dictamen')
      .set(auth('estudiante'))
      .send({ dictamen: 'APROBADO', comentario: 'Me autoapruebo' });
    expect(alumnoDictamina.status).toBe(403);
  });

  test('CP-19: POST /api/disponibilidad registra un bloque y rechaza bloques traslapados o inválidos', async () => {
    const bloque = { fecha: '2026-11-16', hora_inicio: '10:00', hora_fin: '12:00' };

    const creado = await request(app).post('/api/disponibilidad').set(auth('asesor')).send(bloque);
    expect(creado.status).toBe(201);

    const traslape = await request(app).post('/api/disponibilidad').set(auth('asesor'))
      .send({ fecha: '2026-11-16', hora_inicio: '11:00', hora_fin: '13:00' });
    expect(traslape.status).toBe(409);

    const invertido = await request(app).post('/api/disponibilidad').set(auth('asesor'))
      .send({ fecha: '2026-11-16', hora_inicio: '15:00', hora_fin: '14:00' });
    expect(invertido.status).toBe(400);

    expect(db.__tablas().disponibilidad_docentes).toHaveLength(1);
  });

  test('CP-20: si la base de datos falla, la API responde 500 con un mensaje controlado', async () => {
    db.__fallarSiguienteConsulta();

    const res = await request(app).post('/api/auth/login')
      .send({ correo: USUARIOS.estudiante.correo, password: 'alumnos123' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ mensaje: 'Error en el servidor al iniciar sesión' });
    expect(JSON.stringify(res.body)).not.toMatch(/conexión|stack|Error:/); // no expone detalles internos
  });
});
