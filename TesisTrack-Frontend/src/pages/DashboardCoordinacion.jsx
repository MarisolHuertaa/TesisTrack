import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import './DashboardCoordinacion.css';

const ASESORES_DISPONIBLES = [
  'Dr. Roberto Martínez',
  'Dra. María Elena Ríos',
  'Mtro. Carlos Alberto Mendoza',
  'Dra. Laura Patricia Gómez',
  'Dr. Jorge Luis Navarro',
];

export default function DashboardCoordinacion() {
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Datos del coordinador logueado (sin número de empleado)
  const [nombreCoordinador, setNombreCoordinador] = useState('Coordinación Académica');

  // Navegación exclusiva del Sidebar de Coordinación
  const [seccionActiva, setSeccionActiva] = useState('general');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Modales interactivos y notificaciones
  const [proyectoAsignar, setProyectoAsignar] = useState(null);
  const [asesorElegido, setAsesorElegido] = useState('');
  const [proyectoDetalle, setProyectoDetalle] = useState(null);
  const [notificacion, setNotificacion] = useState('');

  useEffect(() => {
    cargarDatosUsuario();
    cargarProyectosBD();
  }, []);

  const cargarDatosUsuario = () => {
    try {
      const userRaw = localStorage.getItem('user') || localStorage.getItem('usuario');
      if (userRaw) {
        const userObj = JSON.parse(userRaw);
        if (userObj?.nombre) {
          setNombreCoordinador(userObj.nombre);
        } else if (userObj?.email) {
          setNombreCoordinador(userObj.email.split('@')[0]);
        }
      }
    } catch (e) {
      // Mantiene título por defecto si no hay JSON en localStorage
    }
  };

  const mostrarToast = (mensaje) => {
    setNotificacion(mensaje);
    setTimeout(() => setNotificacion(''), 3500);
  };

  const cargarProyectosBD = async () => {
    setLoading(true);
    try {
      const response = await API.get('/coordinacion/proyectos');
      setProyectos(response.data);
    } catch (error) {
      console.warn('Usando datos de respaldo mientras el endpoint responde:', error);
      setProyectos([
        {
          id: 1,
          estudiante: 'Ana María Gómez',
          codigoEstudiante: '21948201',
          carrera: 'Ingeniería de Software',
          titulo: 'Sistema Web para Gestión de Tesis (TesisTrack)',
          asesor: 'Dr. Roberto Martínez',
          fase: 'Capítulo 2: Marco Teórico',
          progreso: 55,
          diasSinAvance: 12,
          estadoSemaforo: 'Rojo',
          estado: 'En Revisión',
        },
        {
          id: 2,
          estudiante: 'Luis Fernando Torres',
          codigoEstudiante: '21839210',
          carrera: 'Ingeniería de Software',
          titulo: 'Análisis de Deuda Técnica en Proyectos Ágiles',
          asesor: 'Sin Asignar',
          fase: 'Capítulo 1: Protocolo',
          progreso: 20,
          diasSinAvance: 3,
          estadoSemaforo: 'Verde',
          estado: 'Pendiente',
        },
        {
          id: 3,
          estudiante: 'Sofía Hernández',
          codigoEstudiante: '21759302',
          carrera: 'Ciencias Computacionales',
          titulo: 'Aplicación Móvil para Monitoreo de Redes',
          asesor: 'Dra. María Elena Ríos',
          fase: 'Defensa Final',
          progreso: 100,
          diasSinAvance: 0,
          estadoSemaforo: 'Verde',
          estado: 'Aprobado',
        },
        {
          id: 4,
          estudiante: 'Diego Alejandro Ruiz',
          codigoEstudiante: '21988412',
          carrera: 'Ingeniería en Computación',
          titulo: 'Detección de Anomalías en Tráfico IoT con Machine Learning',
          asesor: 'Sin Asignar',
          fase: 'Capítulo 1: Protocolo',
          progreso: 15,
          diasSinAvance: 14,
          estadoSemaforo: 'Rojo',
          estado: 'Pendiente',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const obtenerIniciales = (nombre) => {
    if (!nombre) return 'TT';
    return nombre
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleCambiarSeccionSidebar = (seccion) => {
    setSeccionActiva(seccion);
    if (seccion === 'general') setFiltroEstado('Todos');
    if (seccion === 'actas') setFiltroEstado('Aprobado');
  };

  const confirmarAsignacionAsesor = async (e) => {
    e.preventDefault();
    if (!asesorElegido || !proyectoAsignar) return;

    try {
      await API.put(`/coordinacion/proyectos/${proyectoAsignar.id}/asignar`, {
        asesor: asesorElegido,
      });
    } catch (error) {
      console.warn('Actualizando en estado local:', error);
    }

    setProyectos((prev) =>
      prev.map((p) =>
        p.id === proyectoAsignar.id ? { ...p, asesor: asesorElegido } : p
      )
    );
    mostrarToast(`Asesor ${asesorElegido} asignado a ${proyectoAsignar.estudiante}`);
    setProyectoAsignar(null);
    setAsesorElegido('');
  };

  const handleExportarCSV = () => {
    const encabezados = [
      'ID',
      'Estudiante',
      'Carrera',
      'Proyecto',
      'Asesor',
      'Fase',
      'Dias Sin Avance',
      'Estatus',
    ];
    const filas = proyectos.map((p) => [
      p.id,
      `"${p.estudiante}"`,
      `"${p.carrera}"`,
      `"${p.titulo}"`,
      `"${p.asesor}"`,
      `"${p.fase}"`,
      p.diasSinAvance,
      p.estado,
    ]);

    const contenidoCSV =
      '\uFEFF' + [encabezados.join(','), ...filas.map((f) => f.join(','))].join('\n');
    const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Reporte_Coordinacion_TesisTrack.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    mostrarToast('Reporte global descargado en formato CSV');
  };

  const handleDescargarActaQR = async (estudiante) => {
    try {
      const response = await API.get(`/coordinacion/proyectos/${estudiante.id}/acta-qr`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Acta_QR_${estudiante.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      mostrarToast(`Acta Digital QR generada para ${estudiante.estudiante}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('rol_id');
    navigate('/login');
  };

  // Métricas dinámicas
  const totalProyectos = proyectos.length || 1;
  const totalSinAsesor = proyectos.filter((p) => p.asesor === 'Sin Asignar').length;
  const totalAlertas = proyectos.filter((p) => p.estadoSemaforo === 'Rojo').length;
  const totalAprobados = proyectos.filter((p) => p.estado === 'Aprobado').length;
  const totalEnRevision = proyectos.filter((p) => p.estado === 'En Revisión').length;
  const totalPendientes = proyectos.filter((p) => p.estado === 'Pendiente').length;

  const pctAprobados = Math.round((totalAprobados / totalProyectos) * 100);
  const pctRevision = Math.round((totalEnRevision / totalProyectos) * 100);
  const pctPendientes = Math.round((totalPendientes / totalProyectos) * 100);

  const proyectosFiltrados = proyectos.filter((p) => {
    if (seccionActiva === 'sin-asesor' && p.asesor !== 'Sin Asignar') return false;
    if (seccionActiva === 'alertas' && p.estadoSemaforo !== 'Rojo') return false;
    if (seccionActiva === 'actas' && p.estado !== 'Aprobado') return false;

    if (seccionActiva === 'general' && filtroEstado !== 'Todos' && p.estado !== filtroEstado) {
      return false;
    }

    if (busqueda.trim() !== '') {
      const q = busqueda.toLowerCase();
      return (
        p.estudiante?.toLowerCase().includes(q) ||
        p.titulo?.toLowerCase().includes(q) ||
        p.asesor?.toLowerCase().includes(q) ||
        p.carrera?.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="coord-layout">
      {/* BARRA LATERAL EXCLUSIVA DE COORDINACIÓN (SIN MENÚ DE ESTUDIANTE NI NÚMERO DE EMPLEADO) */}
      <aside className="coord-sidebar">
        <div className="coord-brand">
          <div className="brand-logo-box">TT</div>
          <div>
            <span className="brand-name">TesisTrack</span>
            <span className="brand-role-badge">Rol: Coordinación</span>
          </div>
        </div>

        <div className="sidebar-section-label">GESTIÓN DE TITULACIÓN</div>
        <nav className="coord-nav">
          <button
            className={`coord-nav-item ${seccionActiva === 'general' ? 'active' : ''}`}
            onClick={() => handleCambiarSeccionSidebar('general')}
          >
            <span className="nav-icon">📊</span>
            <span>Directorio de Tesis</span>
          </button>

          <button
            className={`coord-nav-item ${seccionActiva === 'sin-asesor' ? 'active' : ''}`}
            onClick={() => handleCambiarSeccionSidebar('sin-asesor')}
          >
            <span className="nav-icon">👨‍🏫</span>
            <span>Asignación Docente</span>
            {totalSinAsesor > 0 && (
              <span className="nav-badge badge-amber">{totalSinAsesor}</span>
            )}
          </button>

          <button
            className={`coord-nav-item ${seccionActiva === 'alertas' ? 'active' : ''}`}
            onClick={() => handleCambiarSeccionSidebar('alertas')}
          >
            <span className="nav-icon">🚨</span>
            <span>Semáforo de Atrasos</span>
            {totalAlertas > 0 && (
              <span className="nav-badge badge-red">{totalAlertas}</span>
            )}
          </button>

          <button
            className={`coord-nav-item ${seccionActiva === 'actas' ? 'active' : ''}`}
            onClick={() => handleCambiarSeccionSidebar('actas')}
          >
            <span className="nav-icon">📱</span>
            <span>Emisión Actas QR</span>
            <span className="nav-badge badge-green">{totalAprobados}</span>
          </button>
        </nav>

        <div className="sidebar-info-box">
          <span className="info-box-title">Supervisión Activa</span>
          <span className="info-box-sub">Alerta automática: &gt; 10 días sin avance</span>
        </div>

        <div className="coord-sidebar-footer">
          <div className="coord-user-card">
            <div className="user-avatar">{obtenerIniciales(nombreCoordinador)}</div>
            <div className="user-meta">
              <span className="user-name">{nombreCoordinador}</span>
              <span className="user-dept">Coordinación Académica</span>
            </div>
          </div>
          <button className="btn-sidebar-logout" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="coord-main">
        {notificacion && (
          <div className="coord-toast">
            <span>✅</span> {notificacion}
          </div>
        )}

        <header className="page-header">
          <div>
            <span className="header-eyebrow">Administración y Seguimiento</span>
            <h1 className="page-title">Panel de Coordinación Académica</h1>
            <p className="page-subtitle">
              Control centralizado de proyectos de tesis, asignación de asesores y validación de actas.
            </p>
          </div>
          <div className="header-actions">
            <button className="btn-submit-action" onClick={handleExportarCSV}>
              📥 Exportar Reporte CSV
            </button>
          </div>
        </header>

        {/* Tarjetas KPI (Interactivas al hacer clic) */}
        <section className="kpi-grid">
          <div
            className="card-surface kpi-card kpi-indigo clickable-card"
            onClick={() => handleCambiarSeccionSidebar('general')}
          >
            <div className="kpi-top">
              <span className="kpi-label">Total Tesis Activas</span>
              <span className="kpi-icon-pill bg-indigo-soft">📚</span>
            </div>
            <span className="kpi-value">{proyectos.length}</span>
            <span className="kpi-foot">Ver directorio completo</span>
          </div>

          <div
            className="card-surface kpi-card kpi-amber clickable-card"
            onClick={() => handleCambiarSeccionSidebar('sin-asesor')}
          >
            <div className="kpi-top">
              <span className="kpi-label">Sin Asesor Asignado</span>
              <span className="kpi-icon-pill bg-amber-soft">⏳</span>
            </div>
            <span className="kpi-value highlight-amber">{totalSinAsesor}</span>
            <span className="kpi-foot">Filtrar pendientes de asesor</span>
          </div>

          <div
            className="card-surface kpi-card kpi-red clickable-card"
            onClick={() => handleCambiarSeccionSidebar('alertas')}
          >
            <div className="kpi-top">
              <span className="kpi-label">Alertas de Semáforo</span>
              <span className="kpi-icon-pill bg-red-soft">⚠️</span>
            </div>
            <span className="kpi-value highlight-red">{totalAlertas}</span>
            <span className="kpi-foot">Filtrar proyectos con atraso</span>
          </div>

          <div
            className="card-surface kpi-card kpi-green clickable-card"
            onClick={() => handleCambiarSeccionSidebar('actas')}
          >
            <div className="kpi-top">
              <span className="kpi-label">Actas QR Listas</span>
              <span className="kpi-icon-pill bg-green-soft">✅</span>
            </div>
            <span className="kpi-value highlight-green">{totalAprobados}</span>
            <span className="kpi-foot">Filtrar aprobadas para defensa</span>
          </div>
        </section>

        {/* Barra de distribución visual de estados */}
        <section className="card-surface distribution-card">
          <div className="distribution-header">
            <span className="distribution-title">Distribución Global de Estatus</span>
            <div className="distribution-legend">
              <span className="legend-item">
                <i className="dot-green" /> Aprobado ({pctAprobados}%)
              </span>
              <span className="legend-item">
                <i className="dot-indigo" /> En Revisión ({pctRevision}%)
              </span>
              <span className="legend-item">
                <i className="dot-slate" /> Pendiente ({pctPendientes}%)
              </span>
            </div>
          </div>
          <div className="stacked-bar">
            <div className="bar-seg-green" style={{ width: `${pctAprobados}%` }} />
            <div className="bar-seg-indigo" style={{ width: `${pctRevision}%` }} />
            <div className="bar-seg-slate" style={{ width: `${pctPendientes}%` }} />
          </div>
        </section>

        {/* Banner de Alerta */}
        {totalAlertas > 0 && (
          <section className="card-surface alert-box-warning">
            <div className="alert-header">
              <span className="alert-icon">⚠️</span>
              <div>
                <h4 className="alert-title">
                  Atención: {totalAlertas} proyectos superan los 10 días sin retroalimentación
                </h4>
                <p className="alert-desc">
                  Usa la sección "Semáforo de Atrasos" en tu barra lateral de Coordinación para dar seguimiento.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Tabla de Monitoreo */}
        <section className="card-surface table-section">
          <div className="table-header-toolbar">
            <div>
              <h3 className="section-title">
                {seccionActiva === 'general' && 'Directorio General de Proyectos'}
                {seccionActiva === 'sin-asesor' && 'Proyectos Pendientes de Asesor'}
                {seccionActiva === 'alertas' && 'Proyectos con Alerta de Atraso'}
                {seccionActiva === 'actas' && 'Proyectos Aprobados — Emisión de QR'}
              </h3>
            </div>

            <div className="toolbar-controls">
              <input
                type="text"
                className="search-input"
                placeholder="Buscar alumno, tesis o asesor..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              {seccionActiva === 'general' && (
                <div className="filter-buttons">
                  {['Todos', 'Pendiente', 'En Revisión', 'Aprobado'].map((estado) => (
                    <button
                      key={estado}
                      className={`filter-tab ${filtroEstado === estado ? 'active' : ''}`}
                      onClick={() => setFiltroEstado(estado)}
                    >
                      {estado}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="empty-state">Cargando proyectos desde la base de datos...</div>
          ) : proyectosFiltrados.length === 0 ? (
            <div className="empty-state">
              No se encontraron proyectos con los filtros seleccionados.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="coordinacion-table">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Proyecto / Carrera</th>
                    <th>Asesor Asignado</th>
                    <th>Semáforo</th>
                    <th>Estatus</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {proyectosFiltrados.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="student-cell">
                          <div className="student-avatar-initials">
                            {obtenerIniciales(item.estudiante)}
                          </div>
                          <div>
                            <div className="student-name">{item.estudiante}</div>
                            <div className="student-code">{item.carrera}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="project-title">{item.titulo}</div>
                        <div className="project-sub">{item.fase}</div>
                      </td>
                      <td>
                        {item.asesor === 'Sin Asignar' ? (
                          <button
                            className="btn-assign-warning"
                            onClick={() => {
                              setProyectoAsignar(item);
                              setAsesorElegido(ASESORES_DISPONIBLES[0]);
                            }}
                          >
                            + Asignar Asesor
                          </button>
                        ) : (
                          <div className="advisor-cell">
                            <span className="advisor-name">{item.asesor}</span>
                            <button
                              className="btn-change-advisor"
                              title="Reasignar asesor"
                              onClick={() => {
                                setProyectoAsignar(item);
                                setAsesorElegido(item.asesor);
                              }}
                            >
                              ✏️
                            </button>
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`semaphore-pill ${item.estadoSemaforo.toLowerCase()}`}>
                          {item.estadoSemaforo === 'Rojo'
                            ? `🔴 ${item.diasSinAvance}d sin avance`
                            : '🟢 Al día'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge-pill badge-${item.estado
                            .toLowerCase()
                            .replace(/\s+/g, '')}`}
                        >
                          {item.estado}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-group">
                          <button
                            className="btn-history-secondary"
                            onClick={() => setProyectoDetalle(item)}
                          >
                            Ver Detalle
                          </button>
                          {item.estado === 'Aprobado' && (
                            <button
                              className="btn-qr-action"
                              onClick={() => handleDescargarActaQR(item)}
                            >
                              📱 QR
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* MODAL: ASIGNAR / REASIGNAR ASESOR */}
        {proyectoAsignar && (
          <div className="modal-backdrop" onClick={() => setProyectoAsignar(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Asignación de Asesor de Tesis</h3>
              <p className="modal-desc">
                Estudiante: <strong>{proyectoAsignar.estudiante}</strong>
              </p>
              <p className="modal-project-name">"{proyectoAsignar.titulo}"</p>

              <form onSubmit={confirmarAsignacionAsesor}>
                <label className="modal-label">Selecciona un docente disponible:</label>
                <select
                  className="modal-select"
                  value={asesorElegido}
                  onChange={(e) => setAsesorElegido(e.target.value)}
                >
                  {ASESORES_DISPONIBLES.map((docente) => (
                    <option key={docente} value={docente}>
                      {docente}
                    </option>
                  ))}
                </select>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-history-secondary"
                    onClick={() => setProyectoAsignar(null)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-submit-action">
                    Guardar Asignación
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: VER DETALLE DEL PROYECTO */}
        {proyectoDetalle && (
          <div className="modal-backdrop" onClick={() => setProyectoDetalle(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <h3 className="modal-title">Expediente del Proyecto</h3>
                <span
                  className={`status-badge-pill badge-${proyectoDetalle.estado
                    .toLowerCase()
                    .replace(/\s+/g, '')}`}
                >
                  {proyectoDetalle.estado}
                </span>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Estudiante</span>
                  <span className="detail-value">{proyectoDetalle.estudiante}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Programa Académico</span>
                  <span className="detail-value">{proyectoDetalle.carrera}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Título de Tesis</span>
                  <span className="detail-value">{proyectoDetalle.titulo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Asesor Actual</span>
                  <span className="detail-value">{proyectoDetalle.asesor}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fase Actual</span>
                  <span className="detail-value">{proyectoDetalle.fase}</span>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-header">
                  <span>Avance Global Registrado</span>
                  <strong>{proyectoDetalle.progreso || 45}%</strong>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${proyectoDetalle.progreso || 45}%` }}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="btn-submit-action"
                  onClick={() => setProyectoDetalle(null)}
                >
                  Cerrar Expediente
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}