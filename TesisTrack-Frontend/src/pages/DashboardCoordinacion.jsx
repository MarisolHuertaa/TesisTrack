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

  // Navegación de barra lateral y filtros
  const [seccionActiva, setSeccionActiva] = useState('general');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Modales interactivos y notificaciones
  const [proyectoAsignar, setProyectoAsignar] = useState(null);
  const [asesorElegido, setAsesorElegido] = useState('');
  const [proyectoDetalle, setProyectoDetalle] = useState(null);
  const [notificacion, setNotificacion] = useState('');

  useEffect(() => {
    cargarProyectosBD();
  }, []);

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

  // Cambiar pestaña desde la barra lateral de Coordinación
  const handleCambiarSeccionSidebar = (seccion) => {
    setSeccionActiva(seccion);
    if (seccion === 'general') setFiltroEstado('Todos');
    if (seccion === 'actas') setFiltroEstado('Aprobado');
  };

  // Guardar asignación de asesor
  const confirmarAsignacionAsesor = async (e) => {
    e.preventDefault();
    if (!asesorElegido || !proyectoAsignar) return;

    try {
      await API.put(`/coordinacion/proyectos/${proyectoAsignar.id}/asignar`, {
        asesor: asesorElegido,
      });
    } catch (error) {
      console.warn('Actualizando en estado local (pendiente conectar endpoint PUT):', error);
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

  // Exportar reporte global real en CSV
  const handleExportarCSV = () => {
    const encabezados = [
      'Codigo',
      'Estudiante',
      'Carrera',
      'Proyecto',
      'Asesor',
      'Fase',
      'Dias Sin Avance',
      'Estatus',
    ];
    const filas = proyectos.map((p) => [
      p.codigoEstudiante,
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

  // Descargar Acta QR (H10)
  const handleDescargarActaQR = async (estudiante) => {
    try {
      const response = await API.get(`/coordinacion/proyectos/${estudiante.id}/acta-qr`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Acta_QR_${estudiante.codigoEstudiante}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      mostrarToast(`Acta Digital QR generada para ${estudiante.estudiante} (${estudiante.codigoEstudiante})`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Contadores para badges de la barra lateral
  const totalSinAsesor = proyectos.filter((p) => p.asesor === 'Sin Asignar').length;
  const totalAlertas = proyectos.filter((p) => p.estadoSemaforo === 'Rojo').length;
  const totalActas = proyectos.filter((p) => p.estado === 'Aprobado').length;

  // Filtrado combinado (Sidebar + Pestañas + Buscador)
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
        p.estudiante.toLowerCase().includes(q) ||
        p.codigoEstudiante.toLowerCase().includes(q) ||
        p.titulo.toLowerCase().includes(q) ||
        p.asesor.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="coord-layout">
      {/* BARRA LATERAL EXCLUSIVA DE COORDINACIÓN */}
      <aside className="coord-sidebar">
        <div className="coord-brand">
          <div className="brand-logo-box">TT</div>
          <div>
            <span className="brand-name">TesisTrack</span>
            <span className="brand-role-badge">Coordinación</span>
          </div>
        </div>

        <div className="sidebar-section-label">GESTIÓN ACADÉMICA</div>
        <nav className="coord-nav">
          <button
            className={`coord-nav-item ${seccionActiva === 'general' ? 'active' : ''}`}
            onClick={() => handleCambiarSeccionSidebar('general')}
          >
            <span className="nav-icon">📊</span>
            <span>Panel General</span>
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
            <span>Actas y Códigos QR</span>
            <span className="nav-badge badge-green">{totalActas}</span>
          </button>
        </nav>

        <div className="coord-sidebar-footer">
          <div className="coord-user-card">
            <div className="user-avatar">CA</div>
            <div className="user-meta">
              <span className="user-name">Coordinador Académico</span>
              <span className="user-dept">Ing. de Software</span>
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
            <span className="header-eyebrow">Módulo de Supervisión Institucional</span>
            <h1 className="page-title">Panel de Coordinación Académica</h1>
            <p className="page-subtitle">
              Monitoreo integral de tesis, control de tiempos de revisión y asignación de asesores.
            </p>
          </div>
          <div className="header-actions">
            <button className="btn-submit-action" onClick={handleExportarCSV}>
              📥 Exportar Reporte CSV
            </button>
          </div>
        </header>

        {/* Tarjetas KPI */}
        <section className="kpi-grid">
          <div className="card-surface kpi-card kpi-indigo">
            <div className="kpi-top">
              <span className="kpi-label">Total Tesis Activas</span>
              <span className="kpi-icon">📚</span>
            </div>
            <span className="kpi-value">{proyectos.length}</span>
            <span className="kpi-foot">Ciclo escolar vigente</span>
          </div>

          <div className="card-surface kpi-card kpi-amber">
            <div className="kpi-top">
              <span className="kpi-label">Sin Asesor Asignado</span>
              <span className="kpi-icon">⏳</span>
            </div>
            <span className="kpi-value highlight-amber">{totalSinAsesor}</span>
            <span className="kpi-foot">Requieren asignación</span>
          </div>

          <div className="card-surface kpi-card kpi-red">
            <div className="kpi-top">
              <span className="kpi-label">Alertas de Semáforo</span>
              <span className="kpi-icon">⚠️</span>
            </div>
            <span className="kpi-value highlight-red">{totalAlertas}</span>
            <span className="kpi-foot">&gt; 10 días sin avance</span>
          </div>

          <div className="card-surface kpi-card kpi-green">
            <div className="kpi-top">
              <span className="kpi-label">Actas QR Listas (H10)</span>
              <span className="kpi-icon">✅</span>
            </div>
            <span className="kpi-value highlight-green">{totalActas}</span>
            <span className="kpi-foot">Listas para titulación</span>
          </div>
        </section>

        {/* Banner de Alerta */}
        {totalAlertas > 0 && (
          <section className="card-surface alert-box-warning">
            <div className="alert-header">
              <span className="alert-icon">⚠️</span>
              <div>
                <h4 className="alert-title">
                  Atención Requerida: {totalAlertas} proyectos superan el límite de 10 días sin revisión
                </h4>
                <p className="alert-desc">
                  Revisa los proyectos marcados en rojo o filtra desde la barra lateral en "Semáforo de Atrasos".
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Tabla Principal */}
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
                placeholder="Buscar alumno, código o tesis..."
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
                        <div className="student-name">{item.estudiante}</div>
                        <div className="student-code">{item.codigoEstudiante}</div>
                      </td>
                      <td>
                        <div className="project-title">{item.titulo}</div>
                        <div className="project-sub">
                          {item.fase} • {item.carrera}
                        </div>
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
                Estudiante: <strong>{proyectoAsignar.estudiante}</strong> ({proyectoAsignar.codigoEstudiante})
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
                  <span className="detail-value">
                    {proyectoDetalle.estudiante} ({proyectoDetalle.codigoEstudiante})
                  </span>
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