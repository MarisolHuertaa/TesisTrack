import { useState } from 'react';
import '../../styles/Dashboards.css';

export const TeacherDashboard = ({ user, activeTab = 'inicio', setActiveTab }) => {
  // Estados de modales de revisión
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);

  // Estados para rúbricas e interactividad
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('Marisol Hernández');
  const [calificaciones, setCalificaciones] = useState({
    'Marisol Hernández': { metodologia: 9, dominio: 10, aportes: 8 },
    'Carlos Ramírez': { metodologia: 6, dominio: 7, aportes: 5 },
    'Ana López': { metodologia: 10, dominio: 9, aportes: 9 }
  });

  // Estado para filtro de historial
  const [filtroAlumnoHistorial, setFiltroAlumnoHistorial] = useState('Todos');

  // Estados para la pantalla Mi Perfil
  const [perfilGuardado, setPerfilGuardado] = useState(false);
  const [datosPerfil, setDatosPerfil] = useState({
    nombre: user?.nombre || 'Jeronimo',
    correo: user?.correo || 'jeronimo.docente@tesistrack.edu.mx',
    departamento: 'Ingeniería en Sistemas e Informática',
    gradoAcademico: 'Maestro en Ciencias Computacionales',
    especialidad: 'Ingeniería de Software y Bases de Datos',
    cedula: '8492014'
  });

  const navegarA = (pantalla) => {
    if (setActiveTab) setActiveTab(pantalla);
  };

  const handleScoreChange = (criterio, valor) => {
    setCalificaciones(prev => ({
      ...prev,
      [alumnoSeleccionado]: {
        ...prev[alumnoSeleccionado],
        [criterio]: Number(valor)
      }
    }));
  };

  const notasActuales = calificaciones[alumnoSeleccionado] || { metodologia: 5, dominio: 5, aportes: 5 };

  const alumnos = [
    { id: 1, nombre: 'Marisol Huerta', tema: 'Sistema Web TesisTrack', avance: 'Capítulo 1 y 2', estado: 'Pendiente' },
    { id: 2, nombre: 'Carlos Ruiz', tema: 'I.A. en Salud', avance: 'Anteproyecto', estado: 'Revisado' },
    { id: 3, nombre: 'Elena Gómez', tema: 'Redes IoT', avance: 'Dictamen Final', estado: 'Pendiente' },
  ];

  const historialComentarios = [
    { id: 1, alumno: 'Marisol Hernández', documento: 'Capítulo 2: Marco Teórico - v2.pdf', fecha: '28 Oct 2026', estado: 'Con Observaciones', colorBg: '#FEF3C7', colorText: '#92400E', comentario: 'Buen desarrollo conceptual, pero es necesario actualizar las citas bibliográficas del apartado 2.3 al formato APA 7ma edición.' },
    { id: 2, alumno: 'Carlos Ramírez', documento: 'Metodología de Investigación.docx', fecha: '25 Oct 2026', estado: 'Rechazado', colorBg: '#FEE2E2', colorText: '#991B1B', comentario: 'La muestra seleccionada no justifica estadísticamente el alcance del proyecto. Favor de revisar la fórmula de tamaño muestral.' },
    { id: 3, alumno: 'Ana López', documento: 'Capítulo 1: Introducción Final.pdf', fecha: '12 Oct 2026', estado: 'Aprobado', colorBg: '#D1FAE5', colorText: '#065F46', comentario: 'Excelente planteamiento del problema y objetivos claros. Aprobado para continuar con el capítulo 2.' },
    { id: 4, alumno: 'Marisol Hernández', documento: 'Capítulo 1: Introducción.pdf', fecha: '05 Oct 2026', estado: 'Aprobado', colorBg: '#D1FAE5', colorText: '#065F46', comentario: 'Justificación muy bien delimitada. Se aprueba la versión inicial.' }
  ];

  const historialFiltrado = filtroAlumnoHistorial === 'Todos'
    ? historialComentarios
    : historialComentarios.filter(item => item.alumno === filtroAlumnoHistorial);

  const handleGuardarPerfil = (e) => {
    e.preventDefault();
    setPerfilGuardado(true);
    setTimeout(() => setPerfilGuardado(false), 3000);
  };

  return (
    <div className="dashboard-view">
      {/* ==================== PANTALLA 1: INICIO (PANEL PRINCIPAL) ==================== */}
      {activeTab === 'inicio' && (
        <>
          <header className="dashboard-header">
            <h1>Panel de Asesoría y Sinodalía</h1>
            <p className="text-secondary">Bienvenido/a, Prof. {user?.nombre || 'Docente'}</p>
          </header>

          {/* Tarjetas KPI */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-number">8</span>
              <span className="kpi-label">Alumnos Asignados</span>
            </div>
            <div className="kpi-card accent-amber">
              <span className="kpi-number">3</span>
              <span className="kpi-label">Revisiones Pendientes</span>
            </div>
            <div className="kpi-card accent-indigo">
              <span className="kpi-number">2</span>
              <span className="kpi-label">Exámenes Programados</span>
            </div>
          </div>

          {/* Lista de Revisiones */}
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
                {alumnos.map((st) => (
                  <tr key={st.id}>
                    <td><strong>{st.nombre}</strong></td>
                    <td>{st.tema}</td>
                    <td>{st.avance}</td>
                    <td>
                      <button className="btn-action btn-review" onClick={() => setSelectedStudent(st)}>
                        Revisar PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Gestión de Agenda Rápida */}
          <div className="card-surface">
            <h2 className="card-title">Gestión de Agenda (Disponibilidad para Examen de Grado)</h2>
            <p className="text-secondary">Selecciona las franjas horarias habilitadas para defensas presenciales de tesis.</p>
            <div className="agenda-slots">
              <button className="slot-btn active">Vie 10 Oct - 10:00 AM (Habilitado)</button>
              <button className="slot-btn active">Vie 10 Oct - 12:00 PM (Habilitado)</button>
              <button className="slot-btn" onClick={() => navegarA('agenda')}>Mar 14 Oct - 04:00 PM (+ Habilitar)</button>
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
              <p style={{ margin: 0, color: '#64748B', fontSize: '0.95rem' }}>Configura los días y horarios disponibles para tu jurado evaluador.</p>
            </div>
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: '#64748B', alignItems: 'center', fontWeight: '500' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></span> Disponible
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1E1B4B' }}></span> Seleccionado
              </span>
            </div>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
            {/* TARJETA 1: CALENDARIO */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '36px', boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0F172A', fontWeight: '800' }}>Octubre 2026</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #F1F5F9', borderRadius: '10px', background: '#FFF', cursor: 'pointer', color: '#64748B' }}>&lt;</button>
                  <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #F1F5F9', borderRadius: '10px', background: '#FFF', cursor: 'pointer', color: '#64748B' }}>&gt;</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dia => (
                  <span key={dia} style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '500', marginBottom: '16px' }}>{dia}</span>
                ))}
                <div></div><div></div><div></div><div></div>
                {[1,2,3,4,5,6,7,8,9].map(num => (
                  <div key={num} style={{ padding: '14px 0', color: '#CBD5E1', fontSize: '0.9rem' }}>{num}</div>
                ))}
                <div style={{ padding: '14px 0', background: '#17153B', color: 'white', borderRadius: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(23, 21, 59, 0.2)' }}>
                  10
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'white', marginTop: '4px' }}></span>
                </div>
                {[11,12,13].map(num => (
                  <div key={num} style={{ padding: '14px 0', color: '#CBD5E1', fontSize: '0.9rem' }}>{num}</div>
                ))}
                <div style={{ padding: '14px 0', color: '#0F172A', fontWeight: '600', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  14
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#10B981', marginTop: '4px' }}></span>
                </div>
                {[15,16,17,18,19].map(num => (
                  <div key={num} style={{ padding: '14px 0', color: '#CBD5E1', fontSize: '0.9rem' }}>{num}</div>
                ))}
                <div style={{ padding: '14px 0', color: '#0F172A', fontWeight: '600', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  20
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#10B981', marginTop: '4px' }}></span>
                </div>
                {[21,22,23,24,25,26,27,28,29,30,31].map(num => (
                  <div key={num} style={{ padding: '14px 0', color: '#CBD5E1', fontSize: '0.9rem' }}>{num}</div>
                ))}
              </div>
            </div>

            {/* TARJETA 2: HORARIOS */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '36px', boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ margin: '0 0 6px 0', color: '#0F172A', fontSize: '1.15rem', fontWeight: '800' }}>Configurar Horarios</h2>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: '0 0 28px 0' }}>Día 10 de Octubre de 2026</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', border: '1px solid #F1F5F9', borderRadius: '16px', background: '#FFFFFF' }}>
                  <span style={{ color: '#0F172A', fontWeight: '500', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#94A3B8', fontSize: '1.1rem' }}>🕒</span> 10:00 AM - 11:30 AM
                  </span>
                  <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>Ocupado (Marisol H.)</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', border: '1px solid #E0E7FF', borderRadius: '16px', background: '#F5F8FF' }}>
                  <span style={{ color: '#0F172A', fontWeight: '500', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#64748B', fontSize: '1.1rem' }}>🕒</span> 12:00 PM - 01:30 PM
                  </span>
                  <span style={{ background: '#D1FAE5', color: '#065F46', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>Habilitado ✓</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', border: '1px dashed #E2E8F0', borderRadius: '16px', cursor: 'pointer', background: '#FFFFFF' }}>
                  <span style={{ color: '#64748B', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#CBD5E1', fontSize: '1.1rem' }}>🕒</span> 04:00 PM - 05:30 PM
                  </span>
                  <button style={{ background: '#FFFFFF', color: '#64748B', border: '1px solid #E2E8F0', padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer' }}>+ Habilitar</button>
                </div>
              </div>

              <button style={{ width: '100%', padding: '18px', background: '#17153B', color: 'white', border: 'none', borderRadius: '14px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', marginTop: '32px', boxShadow: '0 4px 12px rgba(23, 21, 59, 0.15)' }}>
                Guardar Disponibilidad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PANTALLA 3: CONTROL DE LECTURA ==================== */}
      {activeTab === 'lecturas' && (
        <div style={{ maxWidth: '1080px', width: '100%', margin: '0 auto' }}>
          <header style={{ marginBottom: '32px' }}>
            <h1 style={{ color: '#0F172A', margin: '0 0 6px 0', fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Control de Lectura</h1>
            <p style={{ margin: 0, color: '#64748B', fontSize: '0.95rem' }}>Revisa los avances y capítulos de tesis enviados por tus alumnos.</p>
          </header>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '36px', boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{ margin: 0, color: '#0F172A', fontSize: '1.15rem', fontWeight: '800' }}>Entregas Recientes</h2>
              <span style={{ fontSize: '0.85rem', color: '#92400E', fontWeight: '600', background: '#FEF3C7', padding: '6px 14px', borderRadius: '20px' }}>2 Pendientes</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', border: '1px solid #F1F5F9', borderRadius: '16px', background: '#FFFFFF', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#E0E7FF', color: '#3730A3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem' }}>MH</div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#0F172A', fontSize: '1rem', fontWeight: '700' }}>Marisol Hernández</h4>
                    <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>📄 Capítulo 2: Marco Teórico - v2.pdf</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 6px 0', color: '#0F172A', fontSize: '0.85rem', fontWeight: '600' }}>Hace 2 días</p>
                    <span style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>Por revisar</span>
                  </div>
                  <button
                    onClick={() => setDocumentoSeleccionado({ nombre: 'Marisol Hernández', documento: 'Capítulo 2: Marco Teórico - v2.pdf' })}
                    style={{ background: '#17153B', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>
                    Leer Documento
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', border: '1px solid #F1F5F9', borderRadius: '16px', background: '#FFFFFF', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FCE7F3', color: '#9D174D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem' }}>CR</div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#0F172A', fontSize: '1rem', fontWeight: '700' }}>Carlos Ramírez</h4>
                    <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>📄 Metodología de Investigación.docx</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 6px 0', color: '#0F172A', fontSize: '0.85rem', fontWeight: '600' }}>Hace 5 horas</p>
                    <span style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>Por revisar</span>
                  </div>
                  <button
                    onClick={() => setDocumentoSeleccionado({ nombre: 'Carlos Ramírez', documento: 'Metodología de Investigación.docx' })}
                    style={{ background: '#17153B', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>
                    Leer Documento
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', border: '1px solid #F8FAFC', borderRadius: '16px', background: '#FAFAFA', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: 0.75 }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#D1FAE5', color: '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem' }}>AL</div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#0F172A', fontSize: '1rem', fontWeight: '700' }}>Ana López</h4>
                    <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>📄 Capítulo 1: Introducción Final.pdf</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 6px 0', color: '#0F172A', fontSize: '0.85rem', fontWeight: '600' }}>12 Oct 2026</p>
                    <span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>Revisado ✓</span>
                  </div>
                  <button
                    onClick={() => setDocumentoSeleccionado({ nombre: 'Ana López', documento: 'Capítulo 1: Introducción Final.pdf' })}
                    style={{ background: '#FFFFFF', color: '#64748B', border: '1px solid #E2E8F0', padding: '12px 24px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>
                    Ver Retroalimentación
                  </button>
                </div>
              </div>
            </div>
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
              8 Alumnos Asignados
            </span>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              { iniciales: 'MH', bg: '#E0E7FF', color: '#3730A3', nombre: 'Marisol Hernández', carrera: 'Ingeniería en Informática', tema: 'Sistema de Gestión de Titulación Web', progreso: 75, barColor: '#10B981' },
              { iniciales: 'CR', bg: '#FCE7F3', color: '#9D174D', nombre: 'Carlos Ramírez', carrera: 'Ingeniería en Informática', tema: 'Optimización de Algoritmos en IA', progreso: 40, barColor: '#3B82F6' },
              { iniciales: 'AL', bg: '#D1FAE5', color: '#065F46', nombre: 'Ana López', carrera: 'Ingeniería en Informática', tema: 'Redes IoT para Domótica Social', progreso: 90, barColor: '#10B981' }
            ].map((al) => (
              <div key={al.nombre} style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '28px', boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: al.bg, color: al.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.2rem' }}>{al.iniciales}</div>
                    <div>
                      <h3 style={{ margin: '0 0 2px 0', color: '#0F172A', fontSize: '1.1rem', fontWeight: '800' }}>{al.nombre}</h3>
                      <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>{al.carrera}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px', background: '#F8FAFC', padding: '16px', borderRadius: '16px' }}>
                    <p style={{ margin: '0 0 6px 0', color: '#94A3B8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tema de Tesis</p>
                    <p style={{ margin: 0, color: '#0F172A', fontSize: '0.9rem', fontWeight: '600', lineHeight: '1.4' }}>{al.tema}</p>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                      <span style={{ color: '#64748B' }}>Progreso de Tesis</span>
                      <span style={{ color: al.barColor }}>{al.progreso}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${al.progreso}%`, height: '100%', backgroundColor: al.barColor, borderRadius: '10px' }}></div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{ flex: 1, padding: '12px', background: '#FFFFFF', color: '#0F172A', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                    💬 Contactar
                  </button>
                  <button style={{ flex: 1, padding: '12px', background: '#17153B', color: 'white', border: 'none', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                    Expediente
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== PANTALLA 5: RÚBRICAS DE EVALUACIÓN ==================== */}
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
                    onChange={(e) => setAlumnoSeleccionado(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#F8FAFC', color: '#0F172A', fontSize: '0.9rem', outline: 'none' }}>
                    <option value="Marisol Hernández">Marisol Hernández</option>
                    <option value="Carlos Ramírez">Carlos Ramírez</option>
                    <option value="Ana López">Ana López</option>
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
              </div>

              <button style={{ width: '100%', padding: '16px', background: '#17153B', color: 'white', border: 'none', borderRadius: '14px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', marginTop: '24px', boxShadow: '0 4px 12px rgba(23, 21, 59, 0.15)' }}>
                Generar Calificación ({((notasActuales.metodologia + notasActuales.dominio + notasActuales.aportes) / 3).toFixed(1)})
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
                <option value="Marisol Hernández">Marisol Hernández</option>
                <option value="Carlos Ramírez">Carlos Ramírez</option>
                <option value="Ana López">Ana López</option>
              </select>
            </div>
          </header>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '36px', boxShadow: '0px 10px 40px -10px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {historialFiltrado.map(item => (
                <div key={item.id} style={{ border: '1px solid #F1F5F9', borderRadius: '16px', padding: '24px', background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.5px' }}>
                        {item.alumno}
                      </span>
                      <h3 style={{ margin: '2px 0 0 0', color: '#0F172A', fontSize: '1.05rem', fontWeight: '700' }}>
                        📄 {item.documento}
                      </h3>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ background: item.colorBg, color: item.colorText, padding: '4px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', display: 'inline-block', marginBottom: '4px' }}>
                        {item.estado}
                      </span>
                      <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.8rem', fontWeight: '500' }}>{item.fecha}</p>
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #17153B' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#64748B', fontWeight: '700' }}>Comentario enviado:</p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>"{item.comentario}"</p>
                  </div>
                </div>
              ))}
            </div>
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
            {/* TARJETA IZQUIERDA: RESUMEN DE PERFIL */}
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
                  <strong style={{ color: '#0F172A' }}>8 Activas</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748B' }}>Firma Electrónica:</span>
                  <strong style={{ color: '#10B981' }}>Verificada ✓</strong>
                </div>
              </div>
            </div>

            {/* TARJETA DERECHA: FORMULARIO DE EDICIÓN */}
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

      {/* ==================== MODAL 1: VISOR DESDE TABLA PRINCIPAL ==================== */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Visor de Dictamen - {selectedStudent.nombre}</h3>
              <button className="close-btn" onClick={() => setSelectedStudent(null)}>✕</button>
            </div>
            <p><strong>Documento:</strong> {selectedStudent.avance}.pdf</p>
            <div className="pdf-preview-box">
              [Vista previa simulada del documento PDF de {selectedStudent.nombre}]
            </div>
            <div className="form-group">
              <label className="input-label">Observaciones y Comentarios:</label>
              <textarea className="custom-textarea" rows="3" placeholder="Escribe aquí las observaciones..."></textarea>
            </div>
            <div className="decision-buttons">
              <button className="btn-decision approve" onClick={() => setSelectedStudent(null)}>Aprobar</button>
              <button className="btn-decision observe" onClick={() => setSelectedStudent(null)}>Con Observaciones</button>
              <button className="btn-decision reject" onClick={() => setSelectedStudent(null)}>Rechazar</button>
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
              [Vista previa simulada del documento PDF de {documentoSeleccionado.nombre}]
            </div>
            <div className="form-group">
              <label className="input-label">Observaciones y Comentarios:</label>
              <textarea className="custom-textarea" rows="3" placeholder="Escribe aquí las observaciones..."></textarea>
            </div>
            <div className="decision-buttons">
              <button className="btn-decision approve" onClick={() => setDocumentoSeleccionado(null)}>Aprobar</button>
              <button className="btn-decision observe" onClick={() => setDocumentoSeleccionado(null)}>Con Observaciones</button>
              <button className="btn-decision reject" onClick={() => setDocumentoSeleccionado(null)}>Rechazar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};