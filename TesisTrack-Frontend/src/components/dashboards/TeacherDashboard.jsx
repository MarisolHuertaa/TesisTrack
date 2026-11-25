import { useState, useEffect, useCallback } from 'react';
import API from '../../services/api';
import '../../styles/Dashboards.css';

const NOMBRES_MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const FRANJAS_BASE = [
  { inicio: '09:00', fin: '11:00' },
  { inicio: '10:00', fin: '12:00' },
  { inicio: '12:00', fin: '14:00' },
  { inicio: '14:00', fin: '16:00' },
  { inicio: '16:00', fin: '18:00' }
];

export const TeacherDashboard = ({ user, activeTab = 'inicio', setActiveTab }) => {
  // Estados con datos reales
  const [proyectosReales, setProyectosReales] = useState([]);
  const [entregasPendientes, setEntregasPendientes] = useState([]);
  const [entregasDocente, setEntregasDocente] = useState([]);
  const [historialDictamenes, setHistorialDictamenes] = useState([]);
  const [bloquesDisponibles, setBloquesDisponibles] = useState([]);
  const [citasAgenda, setCitasAgenda] = useState([]);
  const [rubricasGuardadas, setRubricasGuardadas] = useState({});
  const [cargandoDatos, setCargandoDatos] = useState(true);

  // Estados interactivos de Agenda (Paso 2)
  const [anioCalendario, setAnioCalendario] = useState(2026);
  const [mesCalendario, setMesCalendario] = useState(10); // 10 = Noviembre
  const [fechaSeleccionada, setFechaSeleccionada] = useState('2026-11-21');
  const [ubicacionAgenda, setUbicacionAgenda] = useState('Sala de Juntas 2');
  const [modalAgendar, setModalAgendar] = useState(null);
  const [proyectoAAgendar, setProyectoAAgendar] = useState('');
  const [mensajeAgenda, setMensajeAgenda] = useState(null);
  const [procesandoAgenda, setProcesandoAgenda] = useState(false);

  // Estados de modales de revisión y dictamen (Paso 3)
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
  const [comentarioDictamen, setComentarioDictamen] = useState('');
  const [errorDictamen, setErrorDictamen] = useState('');
  const [enviandoDictamen, setEnviandoDictamen] = useState(false);
  const [mensajeLectura, setMensajeLectura] = useState(null);

  // Estado para filtro de historial
  const [filtroAlumnoHistorial, setFiltroAlumnoHistorial] = useState('Todos');

  // Estados para rúbricas de evaluación (Paso 4)
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('');
  const [calificaciones, setCalificaciones] = useState({});
  const [mensajeRubrica, setMensajeRubrica] = useState(null);
  const [guardandoRubrica, setGuardandoRubrica] = useState(false);

  // Estados para la pantalla Mi Perfil
  const [perfilGuardado, setPerfilGuardado] = useState(false);
  const [datosPerfil, setDatosPerfil] = useState({
    nombre: user?.nombre || 'Jeronimo',
    correo: user?.correo || 'jeronimo.duran@docentes.udg.mx',
    departamento: 'Ingeniería en Sistemas e Informática',
    gradoAcademico: 'Maestro en Ciencias Computacionales',
    especialidad: 'Ingeniería de Software y Bases de Datos',
    cedula: '8492014'
  });

  // Cargar todos los datos reales del docente
  const cargarDatosDocente = useCallback(async () => {
    setCargandoDatos(true);
    const [
      resProyectos,
      resPendientes,
      resEntregasDoc,
      resHistorial,
      resDisponibilidad,
      resAgenda,
      resRubricas,
      resPerfil
    ] = await Promise.allSettled([
      API.get('/proyectos/mi-proyecto'),
      API.get('/entregas/pendientes'),
      API.get('/entregas/docente'),
      API.get('/entregas/historial-dictamenes'),
      API.get('/disponibilidad'),
      API.get('/proyectos/agenda-docente'),
      API.get('/proyectos/rubricas'),
      API.get('/auth/perfil')
    ]);

    if (resProyectos.status === 'fulfilled') {
      const lista = resProyectos.value.data?.proyectos || [];
      setProyectosReales(lista);
      if (lista.length > 0) {
        setProyectoAAgendar(prev => prev || String(lista[0].id));
        setAlumnoSeleccionado(prev => {
          const existe = lista.some(p => String(p.id) === String(prev));
          return existe ? prev : String(lista[0].id);
        });
      }
    }
    if (resPendientes.status === 'fulfilled') {
      setEntregasPendientes(resPendientes.value.data?.entregas || []);
    }
    if (resEntregasDoc.status === 'fulfilled') {
      setEntregasDocente(resEntregasDoc.value.data?.entregas || []);
    }
    if (resHistorial.status === 'fulfilled') {
      setHistorialDictamenes(resHistorial.value.data?.historial || []);
    }
    if (resDisponibilidad.status === 'fulfilled') {
      const bloques = resDisponibilidad.value.data?.bloques || [];
      setBloquesDisponibles(bloques);
      if (bloques.length > 0) {
        const primeraFecha = String(bloques[0].fecha_disponible).slice(0, 10);
        setFechaSeleccionada(prev => {
          const existePrev = bloques.some(b => String(b.fecha_disponible).slice(0, 10) === prev);
          if (existePrev) return prev;
          const [y, m] = primeraFecha.split('-');
          setAnioCalendario(Number(y));
          setMesCalendario(Number(m) - 1);
          return primeraFecha;
        });
      }
    }
    if (resAgenda.status === 'fulfilled') {
      setCitasAgenda(resAgenda.value.data?.citas || []);
    }
    if (resRubricas.status === 'fulfilled') {
      const mapa = {};
      for (const r of (resRubricas.value.data?.rubricas || [])) {
        mapa[String(r.proyecto_id)] = {
          metodologia: Number(r.metodologia),
          dominio: Number(r.dominio),
          aportes: Number(r.aportes),
          promedio: Number(r.promedio)
        };
      }
      setRubricasGuardadas(mapa);
    }
    if (resPerfil.status === 'fulfilled' && resPerfil.value.data?.perfil) {
      const p = resPerfil.value.data.perfil;
      setDatosPerfil(prev => ({
        ...prev,
        nombre: p.nombre || prev.nombre,
        correo: p.correo || prev.correo,
        departamento: p.departamento ?? prev.departamento,
        gradoAcademico: p.grado_academico ?? prev.gradoAcademico,
        especialidad: p.especialidad ?? prev.especialidad,
        cedula: p.cedula ?? prev.cedula
      }));
    }
    setCargandoDatos(false);
  }, []);
  
  useEffect(() => {
    cargarDatosDocente();
  }, [cargarDatosDocente]);

  const navegarA = (pantalla) => {
    if (setActiveTab) setActiveTab(pantalla);
  };

  // Funciones auxiliares de formato
  const formatearFechaCorta = (fechaStr) => {
    if (!fechaStr) return '';
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const soloFecha = String(fechaStr).slice(0, 10);
    const [, mes, dia] = soloFecha.split('-');
    return `${Number(dia)} ${meses[Number(mes) - 1] || ''}`;
  };

  const formatearFechaLarga = (fechaISO) => {
    if (!fechaISO) return '';
    const [y, m, d] = fechaISO.split('-');
    return `Día ${Number(d)} de ${NOMBRES_MESES[Number(m) - 1] || ''} de ${y}`;
  };

  const formatearHora12 = (horaStr) => {
    if (!horaStr) return '';
    const [hh, mm] = String(horaStr).split(':');
    const h = Number(hh);
    const sufijo = h >= 12 ? 'PM' : 'AM';
    const hora12 = h % 12 === 0 ? 12 : h % 12;
    return `${String(hora12).padStart(2, '0')}:${mm} ${sufijo}`;
  };

  const obtenerIniciales = (nombre = '', apellido = '') => {
    const n = nombre.trim()[0] || '';
    const a = apellido.trim()[0] || '';
    return `${n}${a}`.toUpperCase() || 'AL';
  };

  const obtenerUrlArchivo = (archivoUrl) => {
    if (!archivoUrl) return null;
    if (archivoUrl.startsWith('http')) return archivoUrl;
    return `http://localhost:5000${archivoUrl.startsWith('/') ? '' : '/'}${archivoUrl}`;
  };

  // ==================== LÓGICA DE DICTÁMENES Y COMENTARIOS (PASO 3) ====================
  const abrirModalRevisionPrincipal = (entrega) => {
    const nombreCompleto = `${entrega.estudiante_nombre} ${entrega.estudiante_apellido}`;
    setComentarioDictamen('');
    setErrorDictamen('');
    setSelectedStudent({
      id: entrega.id,
      nombre: nombreCompleto,
      avance: `${entrega.codigo} - ${entrega.nombre_original} (${entrega.numero_version})`,
      archivo_url: entrega.archivo_url
    });
  };

  const abrirModalControlLectura = (entrega) => {
    const nombreCompleto = `${entrega.estudiante_nombre} ${entrega.estudiante_apellido}`;
    setComentarioDictamen('');
    setErrorDictamen('');
    setDocumentoSeleccionado({
      id: entrega.id,
      nombre: nombreCompleto,
      documento: `${entrega.codigo} — ${entrega.nombre_original} (${entrega.numero_version})`,
      archivo_url: entrega.archivo_url,
      estado: entrega.estado,
      ultimo_comentario: entrega.ultimo_comentario,
      ultimo_dictamen: entrega.ultimo_dictamen
    });
  };

  const handleEmitirDictamen = async (entregaId, tipoDictamen) => {
    if (!comentarioDictamen.trim()) {
      setErrorDictamen('Debes escribir un comentario o justificación antes de dictaminar.');
      return;
    }

    setEnviandoDictamen(true);
    setErrorDictamen('');
    try {
      const res = await API.post(`/entregas/${entregaId}/dictamen`, {
        dictamen: tipoDictamen,
        comentario: comentarioDictamen.trim()
      });

      setSelectedStudent(null);
      setDocumentoSeleccionado(null);
      setComentarioDictamen('');
      await cargarDatosDocente();

      const avisoExtra = res.data?.fase_avanzo ? ' El estudiante avanzó a la siguiente fase.' : '';
      setMensajeLectura(`Dictamen guardado y enviado al estudiante.${avisoExtra}`);
      setTimeout(() => setMensajeLectura(null), 5000);
    } catch (err) {
      setErrorDictamen(err.response?.data?.mensaje || 'No se pudo guardar el dictamen.');
    } finally {
      setEnviandoDictamen(false);
    }
  };

  // ==================== LÓGICA DE AGENDA (PASO 2) ====================
  const mostrarAvisoAgenda = (texto, tipo = 'ok') => {
    setMensajeAgenda({ texto, tipo });
    setTimeout(() => setMensajeAgenda(null), 4000);
  };

  const cambiarMes = (delta) => {
    let nuevoMes = mesCalendario + delta;
    let nuevoAnio = anioCalendario;
    if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAnio -= 1;
    } else if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAnio += 1;
    }
    setMesCalendario(nuevoMes);
    setAnioCalendario(nuevoAnio);
  };

  const handleHabilitarBloque = async (inicio, fin) => {
    setProcesandoAgenda(true);
    try {
      await API.post('/disponibilidad', {
        fecha: fechaSeleccionada,
        hora_inicio: inicio,
        hora_fin: fin,
        modalidad: 'Presencial',
        ubicacion: ubicacionAgenda
      });
      await cargarDatosDocente();
      mostrarAvisoAgenda(`Horario ${formatearHora12(inicio)} habilitado correctamente.`);
    } catch (err) {
      mostrarAvisoAgenda(err.response?.data?.mensaje || 'No se pudo habilitar el horario', 'error');
    } finally {
      setProcesandoAgenda(false);
    }
  };

  const handleDeshabilitarBloque = async (bloqueId) => {
    setProcesandoAgenda(true);
    try {
      await API.delete(`/disponibilidad/${bloqueId}`);
      await cargarDatosDocente();
      mostrarAvisoAgenda('Horario deshabilitado correctamente.');
    } catch (err) {
      mostrarAvisoAgenda(err.response?.data?.mensaje || 'Error al quitar disponibilidad', 'error');
    } finally {
      setProcesandoAgenda(false);
    }
  };

  const handleConfirmarAgendadoAlumno = async (e) => {
    e.preventDefault();
    if (!modalAgendar || !proyectoAAgendar) return;
    setProcesandoAgenda(true);
    try {
      await API.post('/proyectos/agendar-alumno', {
        proyecto_id: Number(proyectoAAgendar),
        disponibilidad_id: modalAgendar.bloqueId || null,
        fecha: fechaSeleccionada,
        hora_inicio: `${modalAgendar.inicio}:00`,
        hora_fin: `${modalAgendar.fin}:00`,
        modalidad: 'Presencial',
        ubicacion: modalAgendar.ubicacion || ubicacionAgenda
      });
      setModalAgendar(null);
      await cargarDatosDocente();
      mostrarAvisoAgenda('Alumno agendado correctamente y notificado en el sistema.');
    } catch (err) {
      mostrarAvisoAgenda(err.response?.data?.mensaje || 'Error al agendar al alumno', 'error');
    } finally {
      setProcesandoAgenda(false);
    }
  };

  const handleResponderSolicitud = async (solicitudId, nuevoEstado) => {
    setProcesandoAgenda(true);
    try {
      await API.patch(`/proyectos/solicitudes-examen/${solicitudId}`, { estado: nuevoEstado });
      await cargarDatosDocente();
      mostrarAvisoAgenda(`Solicitud marcada como ${nuevoEstado}.`);
    } catch (err) {
      mostrarAvisoAgenda(err.response?.data?.mensaje || 'Error al actualizar solicitud', 'error');
    } finally {
      setProcesandoAgenda(false);
    }
  };

  // Calendario mensual
  const primerDiaSemana = new Date(anioCalendario, mesCalendario, 1).getDay();
  const totalDiasMes = new Date(anioCalendario, mesCalendario + 1, 0).getDate();
  const celdasVacias = Array.from({ length: primerDiaSemana }, (_, i) => i);
  const diasDelMes = Array.from({ length: totalDiasMes }, (_, i) => i + 1);

  const bloquesDelDia = bloquesDisponibles.filter(
    b => String(b.fecha_disponible).slice(0, 10) === fechaSeleccionada
  );
  const citasDelDia = citasAgenda.filter(
    c => String(c.fecha_propuesta).slice(0, 10) === fechaSeleccionada
  );

  const mapaFranjas = new Map();
  FRANJAS_BASE.forEach(f => mapaFranjas.set(f.inicio, f));
  bloquesDelDia.forEach(b => {
    const ini = String(b.hora_inicio).slice(0, 5);
    const fin = String(b.hora_fin).slice(0, 5);
    if (!mapaFranjas.has(ini)) mapaFranjas.set(ini, { inicio: ini, fin });
  });
  citasDelDia.forEach(c => {
    const ini = String(c.hora_inicio).slice(0, 5);
    const fin = String(c.hora_fin).slice(0, 5);
    if (!mapaFranjas.has(ini)) mapaFranjas.set(ini, { inicio: ini, fin });
  });
  const franjasVisibles = Array.from(mapaFranjas.values()).sort((a, b) => a.inicio.localeCompare(b.inicio));

  // ==================== RÚBRICAS DE EVALUACIÓN (PASO 4) ====================
  const notasActuales =
    calificaciones[alumnoSeleccionado] ||
    rubricasGuardadas[String(alumnoSeleccionado)] || {
      metodologia: 7,
      dominio: 7,
      aportes: 7
    };

  const handleSeleccionarAlumnoRubrica = (nuevoProyectoId) => {
    setAlumnoSeleccionado(nuevoProyectoId);
    if (rubricasGuardadas[String(nuevoProyectoId)]) {
      setCalificaciones(prev => ({
        ...prev,
        [nuevoProyectoId]: {
          metodologia: rubricasGuardadas[String(nuevoProyectoId)].metodologia,
          dominio: rubricasGuardadas[String(nuevoProyectoId)].dominio,
          aportes: rubricasGuardadas[String(nuevoProyectoId)].aportes
        }
      }));
    }
  };

  const handleScoreChange = (criterio, valor) => {
    setCalificaciones(prev => ({
      ...prev,
      [alumnoSeleccionado]: {
        ...notasActuales,
        [criterio]: Number(valor)
      }
    }));
  };

  const handleGuardarRubrica = async () => {
    if (!alumnoSeleccionado) return;
    setGuardandoRubrica(true);
    setMensajeRubrica(null);
    try {
      const res = await API.post('/proyectos/rubricas', {
        proyecto_id: Number(alumnoSeleccionado),
        metodologia: notasActuales.metodologia,
        dominio: notasActuales.dominio,
        aportes: notasActuales.aportes
      });

      const ev = res.data.evaluacion;
      setRubricasGuardadas(prev => ({
        ...prev,
        [String(alumnoSeleccionado)]: ev
      }));
      setMensajeRubrica(`Calificación guardada (${Number(ev.promedio).toFixed(1)} / 10) en el perfil del alumno.`);
      setTimeout(() => setMensajeRubrica(null), 4000);
    } catch (err) {
      setMensajeRubrica(err.response?.data?.mensaje || 'No se pudo guardar la calificación.');
    } finally {
      setGuardandoRubrica(false);
    }
  };

  // Opciones dinámicas de alumnos para filtro de historial
  const alumnosUnicosHistorial = Array.from(
    new Set([
      ...proyectosReales.map(p => `${p.estudiante_nombre} ${p.estudiante_apellido}`),
      ...historialDictamenes.map(h => `${h.estudiante_nombre} ${h.estudiante_apellido}`)
    ])
  );

  const historialFiltrado = filtroAlumnoHistorial === 'Todos'
    ? historialDictamenes
    : historialDictamenes.filter(
        item => `${item.estudiante_nombre} ${item.estudiante_apellido}` === filtroAlumnoHistorial
      );

  const obtenerBadgeDictamen = (tipo) => {
    if (tipo === 'APROBADO') {
      return { texto: 'Aprobado', bg: '#D1FAE5', color: '#065F46' };
    }
    if (tipo === 'RECHAZADO') {
      return { texto: 'Rechazado', bg: '#FEE2E2', color: '#991B1B' };
    }
    return { texto: 'Con Observaciones', bg: '#FEF3C7', color: '#92400E' };
  };

  const handleGuardarPerfil = async (e) => {
    e.preventDefault();
    setPerfilGuardado(false);
    try {
      const res = await API.put('/auth/perfil', {
        nombre: datosPerfil.nombre,
        correo: datosPerfil.correo,
        departamento: datosPerfil.departamento,
        grado_academico: datosPerfil.gradoAcademico,
        especialidad: datosPerfil.especialidad,
        cedula: datosPerfil.cedula
      });

      if (res.data?.perfil) {
        const p = res.data.perfil;
        setDatosPerfil(prev => ({
          ...prev,
          nombre: p.nombre || prev.nombre,
          correo: p.correo || prev.correo,
          departamento: p.departamento ?? prev.departamento,
          gradoAcademico: p.grado_academico ?? prev.gradoAcademico,
          especialidad: p.especialidad ?? prev.especialidad,
          cedula: p.cedula ?? prev.cedula
        }));
      }

      setPerfilGuardado(true);
      setTimeout(() => setPerfilGuardado(false), 3000);
    } catch (err) {
      console.error('Error al guardar perfil:', err);
    }
  };

  const paletasAvatar = [
    { bg: '#E0E7FF', color: '#3730A3' },
    { bg: '#FCE7F3', color: '#9D174D' },
    { bg: '#D1FAE5', color: '#065F46' }
  ];

  return (
    <div className="dashboard-view">
      {/* ==================== PANTALLA 1: INICIO (PANEL PRINCIPAL) ==================== */}
      {activeTab === 'inicio' && (
        <>
          <header className="dashboard-header">
            <h1>Panel de Asesoría y Sinodalía</h1>
            <p className="text-secondary">Bienvenido/a, Prof. {user?.nombre || 'Docente'}</p>
          </header>

          {mensajeLectura && (
            <div style={{ marginBottom: '20px', padding: '14px 18px', borderRadius: '14px', background: '#D1FAE5', color: '#065F46', fontWeight: '600', fontSize: '0.9rem' }}>
              ✓ {mensajeLectura}
            </div>
          )}

          {/* Tarjetas KPI con datos reales */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-number">{cargandoDatos ? '...' : proyectosReales.length}</span>
              <span className="kpi-label">Alumnos Asignados</span>
            </div>
            <div className="kpi-card accent-amber">
              <span className="kpi-number">{cargandoDatos ? '...' : entregasPendientes.length}</span>
              <span className="kpi-label">Revisiones Pendientes</span>
            </div>
            <div className="kpi-card accent-indigo">
              <span className="kpi-number">{cargandoDatos ? '...' : citasAgenda.length}</span>
              <span className="kpi-label">Exámenes Programados</span>
            </div>
          </div>

          {/* Lista de Revisiones Reales */}
          <div className="card-surface">
            <h2 className="card-title">Revisiones Pendientes de Asesorados</h2>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Tema / Proyecto</th>
                  <th>Entrega</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {cargandoDatos ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: '#64748B', padding: '20px' }}>
                      Cargando revisiones pendientes...
                    </td>
                  </tr>
                ) : entregasPendientes.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: '#64748B', padding: '20px' }}>
                      No tienes revisiones pendientes en este momento.
                    </td>
                  </tr>
                ) : (
                  entregasPendientes.map((ent) => {
                    const nombreCompleto = `${ent.estudiante_nombre} ${ent.estudiante_apellido}`;
                    return (
                      <tr key={ent.id}>
                        <td>
                          <strong>{nombreCompleto}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{ent.tipo_rol}</div>
                        </td>
                        <td>{ent.titulo}</td>
                        <td>{ent.codigo} — {ent.nombre_original} ({ent.numero_version})</td>
                        <td>
                          <button
                            className="btn-action btn-review"
                            onClick={() => abrirModalRevisionPrincipal(ent)}
                          >
                            Revisar PDF
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Gestión de Agenda Rápida con horarios reales */}
          <div className="card-surface">
            <h2 className="card-title">Gestión de Agenda (Disponibilidad para Examen de Grado)</h2>
            <p className="text-secondary">Franjas horarias habilitadas actualmente en tu disponibilidad.</p>
            <div className="agenda-slots">
              {bloquesDisponibles.map((bloque) => (
                <button key={bloque.id} className="slot-btn active" onClick={() => navegarA('agenda')}>
                  {formatearFechaCorta(bloque.fecha_disponible)} - {formatearHora12(bloque.hora_inicio)} (Habilitado)
                </button>
              ))}
              <button className="slot-btn" onClick={() => navegarA('agenda')}>
                + Configurar Horarios
              </button>
            </div>
          </div>
        </>
      )}

      {/* ==================== PANTALLA 2: AGENDA ==================== */}
      {activeTab === 'agenda' && (
        <div style={{ maxWidth: '1080px', width: '100%', margin: '0 auto' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ color: '#0F172A', margin: '0 0 6px 0', fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Gestión de Agenda de Tesis</h1>
              <p style={{ margin: 0, color: '#64748B', fontSize: '0.95rem' }}>Configura tus horarios disponibles y agenda las defensas de tus alumnos.</p>
            </div>
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: '#64748B', alignItems: 'center', fontWeight: '500' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></span> Disponible
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }}></span> Con Cita
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1E1B4B' }}></span> Seleccionado
              </span>
            </div>
          </header>

          {mensajeAgenda && (
            <div style={{
              marginBottom: '20px',
              padding: '14px 18px',
              borderRadius: '14px',
              fontSize: '0.9rem',
              fontWeight: '600',
              background: mensajeAgenda.tipo === 'error' ? '#FEE2E2' : '#D1FAE5',
              color: mensajeAgenda.tipo === 'error' ? '#991B1B' : '#065F46'
            }}>
              {mensajeAgenda.texto}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
            {/* TARJETA 1: CALENDARIO INTERACTIVO */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '36px', boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0F172A', fontWeight: '800' }}>
                  {NOMBRES_MESES[mesCalendario]} {anioCalendario}
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => cambiarMes(-1)}
                    style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #F1F5F9', borderRadius: '10px', background: '#FFF', cursor: 'pointer', color: '#64748B' }}>
                    &lt;
                  </button>
                  <button
                    onClick={() => cambiarMes(1)}
                    style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #F1F5F9', borderRadius: '10px', background: '#FFF', cursor: 'pointer', color: '#64748B' }}>
                    &gt;
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dia => (
                  <span key={dia} style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '500', marginBottom: '16px' }}>{dia}</span>
                ))}

                {celdasVacias.map(idx => <div key={`empty-${idx}`}></div>)}

                {diasDelMes.map(num => {
                  const fechaDia = `${anioCalendario}-${String(mesCalendario + 1).padStart(2, '0')}-${String(num).padStart(2, '0')}`;
                  const esSeleccionado = fechaDia === fechaSeleccionada;
                  const tieneBloque = bloquesDisponibles.some(b => String(b.fecha_disponible).slice(0, 10) === fechaDia);
                  const tieneCita = citasAgenda.some(c => String(c.fecha_propuesta).slice(0, 10) === fechaDia);

                  return (
                    <div
                      key={num}
                      onClick={() => setFechaSeleccionada(fechaDia)}
                      style={{
                        padding: '12px 0',
                        background: esSeleccionado ? '#17153B' : 'transparent',
                        color: esSeleccionado ? '#FFFFFF' : (tieneBloque || tieneCita) ? '#0F172A' : '#64748B',
                        borderRadius: '14px',
                        fontWeight: (esSeleccionado || tieneBloque || tieneCita) ? '700' : '500',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: esSeleccionado ? '0 4px 12px rgba(23, 21, 59, 0.2)' : 'none'
                      }}
                    >
                      {num}
                      <div style={{ display: 'flex', gap: '3px', marginTop: '4px', minHeight: '5px' }}>
                        {tieneBloque && (
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: esSeleccionado ? '#FFFFFF' : '#10B981' }}></span>
                        )}
                        {tieneCita && (
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#EF4444' }}></span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TARJETA 2: HORARIOS Y AGENDADO DE ALUMNOS */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '36px', boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 style={{ margin: '0 0 6px 0', color: '#0F172A', fontSize: '1.15rem', fontWeight: '800' }}>Configurar Horarios</h2>
                  <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: 0 }}>{formatearFechaLarga(fechaSeleccionada)}</p>
                </div>
                <input
                  type="text"
                  value={ubicacionAgenda}
                  onChange={(e) => setUbicacionAgenda(e.target.value)}
                  placeholder="Aula / Sala"
                  title="Ubicación para nuevos horarios"
                  style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.8rem', color: '#334155', width: '170px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flexGrow: 1 }}>
                {franjasVisibles.map((franja) => {
                  const bloqueActivo = bloquesDelDia.find(b => String(b.hora_inicio).slice(0, 5) === franja.inicio);
                  const citaEnFranja = citasDelDia.find(c => String(c.hora_inicio).slice(0, 5) === franja.inicio);

                  if (citaEnFranja) {
                    const esPendiente = citaEnFranja.estado === 'PENDIENTE';
                    return (
                      <div key={franja.inicio} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', border: '1px solid #FECACA', borderRadius: '16px', background: '#FFFBFB', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <span style={{ color: '#0F172A', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>🕒</span> {formatearHora12(franja.inicio)} - {formatearHora12(franja.fin)}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: '26px' }}>
                            📍 {citaEnFranja.ubicacion}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ background: esPendiente ? '#FEF3C7' : '#FEE2E2', color: esPendiente ? '#92400E' : '#991B1B', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                            {esPendiente ? 'Solicitud' : 'Ocupado'} ({citaEnFranja.estudiante_nombre} {citaEnFranja.estudiante_apellido?.[0]}.)
                          </span>
                          {esPendiente && (
                            <button
                              disabled={procesandoAgenda}
                              onClick={() => handleResponderSolicitud(citaEnFranja.id, 'CONFIRMADO')}
                              style={{ background: '#10B981', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}>
                              Confirmar
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (bloqueActivo) {
                    return (
                      <div key={franja.inicio} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', border: '1px solid #E0E7FF', borderRadius: '16px', background: '#F5F8FF', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <span style={{ color: '#0F172A', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>🕒</span> {formatearHora12(franja.inicio)} - {formatearHora12(franja.fin)}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: '26px' }}>
                            📍 {bloqueActivo.ubicacion}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            disabled={procesandoAgenda}
                            onClick={() => handleDeshabilitarBloque(bloqueActivo.id)}
                            title="Clic para deshabilitar este horario"
                            style={{ background: '#D1FAE5', color: '#065F46', border: 'none', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}>
                            Habilitado ✓
                          </button>
                          <button
                            disabled={procesandoAgenda || proyectosReales.length === 0}
                            onClick={() => setModalAgendar({
                              bloqueId: bloqueActivo.id,
                              inicio: franja.inicio,
                              fin: franja.fin,
                              ubicacion: bloqueActivo.ubicacion
                            })}
                            style={{ background: '#17153B', color: '#FFFFFF', border: 'none', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}>
                            + Agendar Alumno
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={franja.inicio} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', border: '1px dashed #E2E8F0', borderRadius: '16px', background: '#FFFFFF' }}>
                      <span style={{ color: '#64748B', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🕒</span> {formatearHora12(franja.inicio)} - {formatearHora12(franja.fin)}
                      </span>
                      <button
                        disabled={procesandoAgenda}
                        onClick={() => handleHabilitarBloque(franja.inicio, franja.fin)}
                        style={{ background: '#FFFFFF', color: '#64748B', border: '1px solid #E2E8F0', padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}>
                        + Habilitar
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {citasAgenda.length > 0 && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.04)', marginTop: '24px' }}>
              <h2 style={{ margin: '0 0 16px 0', color: '#0F172A', fontSize: '1.1rem', fontWeight: '800' }}>Defensas Programadas con tus Alumnos</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {citasAgenda.map(cita => (
                  <div key={cita.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid #F1F5F9', borderRadius: '14px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <strong style={{ color: '#0F172A', fontSize: '0.95rem' }}>
                        {cita.estudiante_nombre} {cita.estudiante_apellido}
                      </strong>
                      <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: '#64748B' }}>({cita.tipo_rol})</span>
                      <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>{cita.proyecto_titulo}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#0F172A', fontWeight: '700', fontSize: '0.85rem' }}>
                        📅 {formatearFechaCorta(cita.fecha_propuesta)} • {formatearHora12(cita.hora_inicio)} - {formatearHora12(cita.hora_fin)}
                      </div>
                      <span style={{
                        display: 'inline-block',
                        marginTop: '4px',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        background: cita.estado === 'CONFIRMADO' ? '#D1FAE5' : '#FEF3C7',
                        color: cita.estado === 'CONFIRMADO' ? '#065F46' : '#92400E'
                      }}>
                        {cita.estado} • {cita.ubicacion}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== PANTALLA 3: CONTROL DE LECTURA ==================== */}
      {activeTab === 'lecturas' && (
        <div style={{ maxWidth: '1080px', width: '100%', margin: '0 auto' }}>
          <header style={{ marginBottom: '32px' }}>
            <h1 style={{ color: '#0F172A', margin: '0 0 6px 0', fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Control de Lectura</h1>
            <p style={{ margin: 0, color: '#64748B', fontSize: '0.95rem' }}>Revisa los avances y capítulos de tesis enviados por tus alumnos.</p>
          </header>

          {mensajeLectura && (
            <div style={{ marginBottom: '20px', padding: '14px 18px', borderRadius: '14px', background: '#D1FAE5', color: '#065F46', fontWeight: '600', fontSize: '0.9rem' }}>
              ✓ {mensajeLectura}
            </div>
          )}

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '36px', boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ margin: 0, color: '#0F172A', fontSize: '1.15rem', fontWeight: '800' }}>Entregas Recientes</h2>
              <span style={{ fontSize: '0.85rem', color: '#92400E', fontWeight: '600', background: '#FEF3C7', padding: '6px 14px', borderRadius: '20px' }}>
                {entregasPendientes.length} Pendientes
              </span>
            </div>

            {cargandoDatos ? (
              <p style={{ color: '#64748B' }}>Cargando entregas de tus alumnos...</p>
            ) : entregasDocente.length === 0 ? (
              <p style={{ color: '#64748B', textAlign: 'center', padding: '24px 0' }}>
                Aún no hay documentos entregados por tus alumnos asignados.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {entregasDocente.map((ent, idx) => {
                  const paleta = paletasAvatar[idx % paletasAvatar.length];
                  const nombreCompleto = `${ent.estudiante_nombre} ${ent.estudiante_apellido}`;
                  const esPendiente = ent.estado === 'EN_REVISION';

                  return (
                    <div
                      key={ent.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '20px 24px',
                        border: esPendiente ? '1px solid #F1F5F9' : '1px solid #F8FAFC',
                        borderRadius: '16px',
                        background: esPendiente ? '#FFFFFF' : '#FAFAFA',
                        flexWrap: 'wrap',
                        gap: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: esPendiente ? 1 : 0.85 }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: paleta.bg, color: paleta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem' }}>
                          {obtenerIniciales(ent.estudiante_nombre, ent.estudiante_apellido)}
                        </div>
                        <div>
                          <h4 style={{ margin: '0 0 4px 0', color: '#0F172A', fontSize: '1rem', fontWeight: '700' }}>
                            {nombreCompleto} <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748B' }}>({ent.tipo_rol})</span>
                          </h4>
                          <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>
                            📄 {ent.codigo} — {ent.nombre_original} ({ent.numero_version})
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: '0 0 6px 0', color: '#0F172A', fontSize: '0.85rem', fontWeight: '600' }}>
                            {formatearFechaCorta(ent.fecha_entrega)} 2026
                          </p>
                          <span style={{
                            background: esPendiente ? '#FEF3C7' : ent.estado === 'APROBADO' ? '#D1FAE5' : '#E0E7FF',
                            color: esPendiente ? '#92400E' : ent.estado === 'APROBADO' ? '#065F46' : '#3730A3',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {esPendiente ? 'Por revisar' : ent.estado === 'APROBADO' ? 'Aprobado ✓' : 'Con Observaciones'}
                          </span>
                        </div>

                        <button
                          onClick={() => abrirModalControlLectura(ent)}
                          style={
                            esPendiente
                              ? { background: '#17153B', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }
                              : { background: '#FFFFFF', color: '#64748B', border: '1px solid #E2E8F0', padding: '12px 24px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }
                          }
                        >
                          {esPendiente ? 'Leer Documento' : 'Ver Retroalimentación'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== PANTALLA 4: DIRECTORIO DE ASESORADOS ==================== */}
      {activeTab === 'directorio' && (
        <div style={{ maxWidth: '1080px', width: '100%', margin: '0 auto' }}>
          <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ color: '#0F172A', margin: '0 0 6px 0', fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Directorio de Asesorados</h1>
              <p style={{ margin: 0, color: '#64748B', fontSize: '0.95rem' }}>Consulta el avance y estado de tus alumnos asignados.</p>
            </div>
            <span style={{ background: '#EEF2FF', color: '#3730A3', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700' }}>
              {proyectosReales.length} Alumnos Asignados
            </span>
          </header>

          {cargandoDatos ? (
            <p style={{ color: '#64748B' }}>Cargando alumnos asignados...</p>
          ) : proyectosReales.length === 0 ? (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '36px', textAlign: 'center', color: '#64748B' }}>
              No tienes alumnos asignados actualmente.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {proyectosReales.map((proy, idx) => {
                const paleta = paletasAvatar[idx % paletasAvatar.length];
                const nombreCompleto = `${proy.estudiante_nombre} ${proy.estudiante_apellido}`;
                const progreso = Number(proy.porcentaje_avance) || 0;
                const barColor = progreso >= 70 ? '#10B981' : progreso >= 30 ? '#3B82F6' : '#F59E0B';
                const rubricaAlumno = rubricasGuardadas[String(proy.id)];

                return (
                  <div key={proy.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '28px', boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: paleta.bg, color: paleta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.2rem' }}>
                          {obtenerIniciales(proy.estudiante_nombre, proy.estudiante_apellido)}
                        </div>
                        <div>
                          <h3 style={{ margin: '0 0 2px 0', color: '#0F172A', fontSize: '1.1rem', fontWeight: '800' }}>{nombreCompleto}</h3>
                          <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>
                            Rol: {proy.tipo_rol} • Cód. {proy.estudiante_codigo || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div style={{ marginBottom: '20px', background: '#F8FAFC', padding: '16px', borderRadius: '16px' }}>
                        <p style={{ margin: '0 0 6px 0', color: '#94A3B8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tema de Tesis</p>
                        <p style={{ margin: 0, color: '#0F172A', fontSize: '0.9rem', fontWeight: '600', lineHeight: '1.4' }}>{proy.titulo}</p>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                          <span style={{ color: '#64748B' }}>Progreso de Tesis</span>
                          <span style={{ color: barColor }}>{progreso}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ width: `${progreso}%`, height: '100%', backgroundColor: barColor, borderRadius: '10px' }}></div>
                        </div>
                      </div>

                      {rubricaAlumno && (
                        <div style={{ marginBottom: '20px', background: '#EEF2FF', color: '#3730A3', padding: '10px 14px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Calificación Rúbrica:</span>
                          <span>{Number(rubricaAlumno.promedio).toFixed(1)} / 10</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => navegarA('lecturas')}
                        style={{ flex: 1, padding: '12px', background: '#FFFFFF', color: '#0F172A', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                        📄 Entregas
                      </button>
                      <button
                        onClick={() => {
                          handleSeleccionarAlumnoRubrica(String(proy.id));
                          navegarA('rubricas');
                        }}
                        style={{ flex: 1, padding: '12px', background: '#17153B', color: 'white', border: 'none', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                        Evaluar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================== PANTALLA 5: RÚBRICAS DE EVALUACIÓN (PASO 4) ==================== */}
      {activeTab === 'rubricas' && (
        <div style={{ maxWidth: '1080px', width: '100%', margin: '0 auto' }}>
          <header style={{ marginBottom: '32px' }}>
            <h1 style={{ color: '#0F172A', margin: '0 0 6px 0', fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Rúbricas de Evaluación</h1>
            <p style={{ margin: 0, color: '#64748B', fontSize: '0.95rem' }}>Criterios oficiales institucionales y formatos de evaluación de tesis.</p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', alignItems: 'start' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '36px', boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.04)' }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#0F172A', fontSize: '1.15rem', fontWeight: '800' }}>Formatos Institucionales</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { icon: '📋', bg: '#EEF2FF', color: '#3730A3', titulo: 'Rúbrica de Defensa Oral', desc: 'Evaluación de dominio del tema y presentación' },
                  { icon: '📑', bg: '#FEF3C7', color: '#92400E', titulo: 'Dictamen de Escrito Final', desc: 'Criterios metodológicos y redacción técnica' },
                  { icon: '💡', bg: '#D1FAE5', color: '#065F46', titulo: 'Criterios de Innovación', desc: 'Evaluación de aporte tecnológico e impacto' }
                ].map(fmt => (
                  <div key={fmt.titulo} style={{ padding: '20px', border: '1px solid #F1F5F9', borderRadius: '16px', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: fmt.bg, color: fmt.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.2rem' }}>{fmt.icon}</div>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', color: '#0F172A', fontSize: '0.95rem', fontWeight: '700' }}>{fmt.titulo}</h4>
                        <p style={{ margin: 0, color: '#64748B', fontSize: '0.8rem' }}>{fmt.desc}</p>
                      </div>
                    </div>
                    <button style={{ background: '#FFFFFF', color: '#0F172A', border: '1px solid #CBD5E1', padding: '8px 16px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                      Descargar PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '36px', boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ margin: '0 0 6px 0', color: '#0F172A', fontSize: '1.15rem', fontWeight: '800' }}>Evaluación Rápida</h2>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: '0 0 24px 0' }}>Selecciona un alumno para aplicar rúbrica.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Alumno Asesorado</label>
                  <select
                    value={alumnoSeleccionado}
                    onChange={(e) => handleSeleccionarAlumnoRubrica(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#F8FAFC', color: '#0F172A', fontSize: '0.9rem', outline: 'none' }}>
                    {proyectosReales.length === 0 ? (
                      <option value="">Sin alumnos asignados</option>
                    ) : (
                      proyectosReales.map(proy => (
                        <option key={proy.id} value={proy.id}>
                          {proy.estudiante_nombre} {proy.estudiante_apellido} — {proy.titulo}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {[
                  { key: 'metodologia', label: 'Estructura y Metodología' },
                  { key: 'dominio', label: 'Dominio del Tema' },
                  { key: 'aportes', label: 'Aporte e Innovación' }
                ].map(crit => (
                  <div key={crit.key} style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                      <span style={{ color: '#0F172A', fontWeight: '600' }}>{crit.label}</span>
                      <span style={{ color: '#17153B', fontWeight: '700' }}>{notasActuales[crit.key]} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={notasActuales[crit.key]}
                      onChange={(e) => handleScoreChange(crit.key, e.target.value)}
                      style={{ width: '100%', accentColor: '#17153B', cursor: 'pointer' }}
                    />
                  </div>
                ))}

                {rubricasGuardadas[String(alumnoSeleccionado)] && (
                  <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', color: '#334155', marginTop: '4px' }}>
                    Guardado en perfil: <strong>{Number(rubricasGuardadas[String(alumnoSeleccionado)].promedio).toFixed(1)} / 10</strong> (Metodología {rubricasGuardadas[String(alumnoSeleccionado)].metodologia} • Dominio {rubricasGuardadas[String(alumnoSeleccionado)].dominio} • Aportes {rubricasGuardadas[String(alumnoSeleccionado)].aportes})
                  </div>
                )}

                {mensajeRubrica && (
                  <div style={{ background: '#D1FAE5', color: '#065F46', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600' }}>
                    ✓ {mensajeRubrica}
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={guardandoRubrica || !alumnoSeleccionado}
                onClick={handleGuardarRubrica}
                style={{ width: '100%', padding: '16px', background: '#17153B', color: 'white', border: 'none', borderRadius: '14px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', marginTop: '20px', boxShadow: '0 4px 12px rgba(23, 21, 59, 0.15)' }}>
                {guardandoRubrica ? 'Guardando...' : `Guardar Calificación (${((notasActuales.metodologia + notasActuales.dominio + notasActuales.aportes) / 3).toFixed(1)})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PANTALLA 6: HISTORIAL DE RETROALIMENTACIÓN ==================== */}
      {activeTab === 'historial' && (
        <div style={{ maxWidth: '1080px', width: '100%', margin: '0 auto' }}>
          <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ color: '#0F172A', margin: '0 0 6px 0', fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Historial de Retroalimentación</h1>
              <p style={{ margin: 0, color: '#64748B', fontSize: '0.95rem' }}>Registro cronológico de dictámenes y observaciones enviadas.</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }}>Filtrar por:</span>
              <select
                value={filtroAlumnoHistorial}
                onChange={(e) => setFiltroAlumnoHistorial(e.target.value)}
                style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', fontSize: '0.85rem', fontWeight: '600', outline: 'none', cursor: 'pointer' }}>
                <option value="Todos">Todos los alumnos</option>
                {alumnosUnicosHistorial.map(nombre => (
                  <option key={nombre} value={nombre}>{nombre}</option>
                ))}
              </select>
            </div>
          </header>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '36px', boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.04)' }}>
            {cargandoDatos ? (
              <p style={{ color: '#64748B' }}>Cargando historial de dictámenes...</p>
            ) : historialFiltrado.length === 0 ? (
              <p style={{ color: '#64748B', textAlign: 'center', padding: '24px 0' }}>
                Aún no hay comentarios registrados en el historial. Cada dictamen que emitas en Control de Lectura se guardará aquí automáticamente.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {historialFiltrado.map(item => {
                  const badge = obtenerBadgeDictamen(item.dictamen);
                  const nombreAlumno = `${item.estudiante_nombre} ${item.estudiante_apellido}`;

                  return (
                    <div key={item.id} style={{ border: '1px solid #F1F5F9', borderRadius: '16px', padding: '24px', background: '#FFFFFF' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.5px' }}>
                            {nombreAlumno}
                          </span>
                          <h3 style={{ margin: '2px 0 0 0', color: '#0F172A', fontSize: '1.05rem', fontWeight: '700' }}>
                            📄 {item.codigo} — {item.nombre_original} ({item.numero_version})
                          </h3>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ background: badge.bg, color: badge.color, padding: '4px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', display: 'inline-block', marginBottom: '4px' }}>
                            {badge.texto}
                          </span>
                          <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.8rem', fontWeight: '500' }}>
                            {formatearFechaCorta(item.fecha_dictamen)} 2026
                          </p>
                        </div>
                      </div>

                      <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #17153B' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#64748B', fontWeight: '700' }}>
                          Comentario enviado por Prof. {item.docente_nombre}:
                        </p>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>
                          "{item.comentario}"
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== PANTALLA 7: MI PERFIL ==================== */}
      {activeTab === 'perfil' && (
        <div style={{ maxWidth: '1080px', width: '100%', margin: '0 auto' }}>
          <header style={{ marginBottom: '32px' }}>
            <h1 style={{ color: '#0F172A', margin: '0 0 6px 0', fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Mi Perfil Docente</h1>
            <p style={{ margin: 0, color: '#64748B', fontSize: '0.95rem' }}>Administra tu información académica, datos de contacto y firma de dictámenes.</p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '36px', boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.04)', textAlign: 'center' }}>
              <div style={{
                width: '88px', height: '88px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
                color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.2rem', fontWeight: '800', margin: '0 auto 16px auto',
                border: '4px solid #E0E7FF'
              }}>
                {datosPerfil.nombre.charAt(0).toUpperCase()}
              </div>

              <h2 style={{ margin: '0 0 4px 0', color: '#0F172A', fontSize: '1.25rem', fontWeight: '800' }}>
                Prof. {datosPerfil.nombre}
              </h2>
              <p style={{ margin: '0 0 16px 0', color: '#64748B', fontSize: '0.9rem' }}>
                {datosPerfil.gradoAcademico}
              </p>

              <span style={{ background: '#EEF2FF', color: '#3730A3', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', display: 'inline-block', marginBottom: '24px' }}>
                Asesor y Sinodal Activo
              </span>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748B' }}>Cédula Profesional:</span>
                  <strong style={{ color: '#0F172A' }}>{datosPerfil.cedula}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748B' }}>Tesis Dirigidas:</span>
                  <strong style={{ color: '#0F172A' }}>{proyectosReales.length} Activas</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748B' }}>Firma Electrónica:</span>
                  <strong style={{ color: '#10B981' }}>Verificada ✓</strong>
                </div>
              </div>
            </div>

            <form onSubmit={handleGuardarPerfil} style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '36px', boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h2 style={{ margin: '0 0 4px 0', color: '#0F172A', fontSize: '1.15rem', fontWeight: '800' }}>Información Institucional</h2>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Nombre Completo</label>
                <input
                  type="text"
                  value={datosPerfil.nombre}
                  onChange={(e) => setDatosPerfil({ ...datosPerfil, nombre: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Correo Institucional</label>
                <input
                  type="email"
                  value={datosPerfil.correo}
                  onChange={(e) => setDatosPerfil({ ...datosPerfil, correo: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Departamento Académico</label>
                <input
                  type="text"
                  value={datosPerfil.departamento}
                  onChange={(e) => setDatosPerfil({ ...datosPerfil, departamento: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Línea de Especialidad</label>
                <input
                  type="text"
                  value={datosPerfil.especialidad}
                  onChange={(e) => setDatosPerfil({ ...datosPerfil, especialidad: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              {perfilGuardado && (
                <div style={{ background: '#D1FAE5', color: '#065F46', padding: '12px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600' }}>
                  ✓ Cambios guardados correctamente en tu perfil docente.
                </div>
              )}

              <button type="submit" style={{ width: '100%', padding: '16px', background: '#17153B', color: 'white', border: 'none', borderRadius: '14px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', marginTop: '8px', boxShadow: '0 4px 12px rgba(23, 21, 59, 0.15)' }}>
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL AGENDAR ALUMNO EN HORARIO ==================== */}
      {modalAgendar && (
        <div className="modal-overlay" onClick={() => setModalAgendar(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Agendar Alumno para Defensa</h3>
              <button className="close-btn" onClick={() => setModalAgendar(null)}>✕</button>
            </div>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>
              <strong>Fecha:</strong> {formatearFechaLarga(fechaSeleccionada)} <br />
              <strong>Horario:</strong> {formatearHora12(modalAgendar.inicio)} - {formatearHora12(modalAgendar.fin)} <br />
              <strong>Ubicación:</strong> {modalAgendar.ubicacion || ubicacionAgenda}
            </p>
            <form onSubmit={handleConfirmarAgendadoAlumno}>
              <div className="form-group">
                <label className="input-label">Selecciona el alumno asignado:</label>
                <select
                  value={proyectoAAgendar}
                  onChange={(e) => setProyectoAAgendar(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1' }}
                  required
                >
                  {proyectosReales.map(proy => (
                    <option key={proy.id} value={proy.id}>
                      {proy.estudiante_nombre} {proy.estudiante_apellido} — {proy.titulo} ({proy.tipo_rol})
                    </option>
                  ))}
                </select>
              </div>
              <div className="decision-buttons" style={{ marginTop: '20px' }}>
                <button type="submit" disabled={procesandoAgenda} className="btn-decision approve">
                  {procesandoAgenda ? 'Guardando...' : 'Confirmar Cita'}
                </button>
                <button type="button" onClick={() => setModalAgendar(null)} className="btn-decision reject">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL 1: VISOR DESDE TABLA PRINCIPAL ==================== */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Visor de Dictamen - {selectedStudent.nombre}</h3>
              <button className="close-btn" onClick={() => setSelectedStudent(null)}>✕</button>
            </div>
            <p><strong>Documento:</strong> {selectedStudent.avance}</p>
            <div className="pdf-preview-box">
              {selectedStudent.archivo_url ? (
                <a
                  href={obtenerUrlArchivo(selectedStudent.archivo_url)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#1E1B4B', fontWeight: '700', textDecoration: 'underline' }}
                >
                  📄 Abrir archivo PDF en una nueva pestaña
                </a>
              ) : (
                <span>[Sin archivo adjunto disponible]</span>
              )}
            </div>
            <div className="form-group">
              <label className="input-label">Observaciones y Comentarios (Obligatorio):</label>
              <textarea
                className="custom-textarea"
                rows="3"
                value={comentarioDictamen}
                onChange={(e) => setComentarioDictamen(e.target.value)}
                placeholder="Escribe aquí las observaciones que se enviarán al estudiante..."
              ></textarea>
            </div>
            {errorDictamen && (
              <p style={{ color: '#DC2626', fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px' }}>
                {errorDictamen}
              </p>
            )}
            <div className="decision-buttons">
              <button
                disabled={enviandoDictamen}
                className="btn-decision approve"
                onClick={() => handleEmitirDictamen(selectedStudent.id, 'APROBADO')}
              >
                Aprobar
              </button>
              <button
                disabled={enviandoDictamen}
                className="btn-decision observe"
                onClick={() => handleEmitirDictamen(selectedStudent.id, 'CON_OBSERVACIONES')}
              >
                Con Observaciones
              </button>
              <button
                disabled={enviandoDictamen}
                className="btn-decision reject"
                onClick={() => handleEmitirDictamen(selectedStudent.id, 'RECHAZADO')}
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: VISOR DESDE CONTROL DE LECTURA ==================== */}
      {documentoSeleccionado && (
        <div className="modal-overlay" onClick={() => setDocumentoSeleccionado(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Visor de Dictamen - {documentoSeleccionado.nombre}</h3>
              <button className="close-btn" onClick={() => setDocumentoSeleccionado(null)}>✕</button>
            </div>
            <p><strong>Documento:</strong> {documentoSeleccionado.documento}</p>
            <div className="pdf-preview-box">
              {documentoSeleccionado.archivo_url ? (
                <a
                  href={obtenerUrlArchivo(documentoSeleccionado.archivo_url)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#1E1B4B', fontWeight: '700', textDecoration: 'underline' }}
                >
                  📄 Abrir archivo PDF en una nueva pestaña
                </a>
              ) : (
                <span>[Sin archivo adjunto disponible]</span>
              )}
            </div>

            {documentoSeleccionado.estado === 'EN_REVISION' ? (
              <>
                <div className="form-group">
                  <label className="input-label">Observaciones y Comentarios (Obligatorio):</label>
                  <textarea
                    className="custom-textarea"
                    rows="3"
                    value={comentarioDictamen}
                    onChange={(e) => setComentarioDictamen(e.target.value)}
                    placeholder="Escribe aquí las observaciones que se guardarán en el historial y perfil del estudiante..."
                  ></textarea>
                </div>
                {errorDictamen && (
                  <p style={{ color: '#DC2626', fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px' }}>
                    {errorDictamen}
                  </p>
                )}
                <div className="decision-buttons">
                  <button
                    disabled={enviandoDictamen}
                    className="btn-decision approve"
                    onClick={() => handleEmitirDictamen(documentoSeleccionado.id, 'APROBADO')}
                  >
                    Aprobar
                  </button>
                  <button
                    disabled={enviandoDictamen}
                    className="btn-decision observe"
                    onClick={() => handleEmitirDictamen(documentoSeleccionado.id, 'CON_OBSERVACIONES')}
                  >
                    Con Observaciones
                  </button>
                  <button
                    disabled={enviandoDictamen}
                    className="btn-decision reject"
                    onClick={() => handleEmitirDictamen(documentoSeleccionado.id, 'RECHAZADO')}
                  >
                    Rechazar
                  </button>
                </div>
              </>
            ) : (
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #17153B', marginTop: '12px' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>
                  Estado actual: {documentoSeleccionado.estado.replace('_', ' ')}
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155' }}>
                  {documentoSeleccionado.ultimo_comentario
                    ? `"${documentoSeleccionado.ultimo_comentario}"`
                    : 'Este documento fue dictaminado en la carga inicial de datos sin comentario detallado.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};