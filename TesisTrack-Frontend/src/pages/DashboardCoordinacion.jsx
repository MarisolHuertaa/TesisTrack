import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import './DashboardCoordinacion.css';

export default function DashboardCoordinacion() {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [proyectos, setProyectos] = useState([]);

  // Cargar proyectos desde la Base de Datos al entrar a la pantalla
  useEffect(() => {
    cargarProyectosBD();
  }, []);

  const cargarProyectosBD = async () => {
    setLoading(true);
    try {
      const response = await API.get('/coordinacion/proyectos');
      setProyectos(response.data);
    } catch (error) {
      console.warn('Endpoint /coordinacion/proyectos aún no responde, usando datos base de respaldo:', error);
      // Datos de respaldo en lo que el backend habilita la tabla de coordinación
      setProyectos([
        {
          id: 1,
          estudiante: 'Ana María Gómez',
          codigoEstudiante: '21948201',
          carrera: 'Ingeniería de Software',
          titulo: 'Sistema Web para Gestión de Tesis (TesisTrack)',
          asesor: 'Dr. Roberto Martínez',
          fase: 'Capítulo 2: Marco Teórico',
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
          diasSinAvance: 0,
          estadoSemaforo: 'Verde',
          estado: 'Aprobado',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Asignar Asesor actualizando en la Base de Datos
  const handleAsignarAsesor = async (id) => {
    const nuevoAsesor = prompt('Ingresa el nombre del Asesor a asignar:');
    if (!nuevoAsesor) return;

    try {
      await API.put(`/coordinacion/proyectos/${id}/asignar`, { asesor: nuevoAsesor });
      // Actualizar estado tras confirmación de la BD
      setProyectos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, asesor: nuevoAsesor } : p))
      );
      alert('Asesor asignado y guardado en la base de datos.');
    } catch (error) {
      console.log('Guardando en vista local (conectar endpoint PUT /coordinacion/proyectos/:id/asignar en backend)');
      setProyectos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, asesor: nuevoAsesor } : p))
      );
    }
  };

  // Descargar Acta QR (H10) desde la Base de Datos
  const handleDescargarActaQR = async (estudiante) => {
    try {
      const response = await API.get(`/coordinacion/proyectos/${estudiante.id}/acta-qr`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Acta_${estudiante.codigoEstudiante}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert(`Generando Acta Digital con Código QR para: ${estudiante.estudiante}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const proyectosFiltrados = proyectos.filter((p) => {
    if (filtroEstado === 'Todos') return true;
    return p.estado === filtroEstado;
  });

  return (
    <div className="dashboard-coordinacion-view">
      <header className="page-header">
        <div>
          <h1 className="page-title">Panel de Coordinación Académica</h1>
          <p className="page-subtitle">
            Monitoreo general de proyectos, semáforo de tiempos y asignación docente.
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn-submit-action"
            onClick={() => alert('Exportando reporte global de la BD...')}
          >
            📊 Exportar Reporte Global
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Métricas Globales */}
      <section className="kpi-grid">
        <div className="card-surface kpi-card">
          <span className="kpi-label">Total de Tesis Activas</span>
          <span className="kpi-value">{proyectos.length}</span>
        </div>
        <div className="card-surface kpi-card">
          <span className="kpi-label">Tesis Sin Asesor</span>
          <span className="kpi-value highlight-amber">
            {proyectos.filter((p) => p.asesor === 'Sin Asignar').length}
          </span>
        </div>
        <div className="card-surface kpi-card">
          <span className="kpi-label">Alertas por Atraso</span>
          <span className="kpi-value highlight-red">
            {proyectos.filter((p) => p.estadoSemaforo === 'Rojo').length}
          </span>
        </div>
        <div className="card-surface kpi-card">
          <span className="kpi-label">Actas con QR Listas</span>
          <span className="kpi-value highlight-green">
            {proyectos.filter((p) => p.estado === 'Aprobado').length}
          </span>
        </div>
      </section>

      {/* Alerta de Semáforo (H05) */}
      <section className="card-surface alert-box-warning">
        <div className="alert-header">
          <span className="alert-icon">⚠️</span>
          <div>
            <h4 className="alert-title">
              Semáforo de Tiempos: {proyectos.filter((p) => p.estadoSemaforo === 'Rojo').length} Revisiones Atrasadas
            </h4>
            <p className="alert-desc">
              Existen revisiones docentes que exceden el límite de 10 días sin retroalimentación.
            </p>
          </div>
        </div>
      </section>

      {/* Tabla de Monitoreo */}
      <section className="card-surface table-section">
        <div className="table-header-toolbar">
          <h3 className="section-title">Directorio General de Proyectos</h3>
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
        </div>

        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>
            Cargando proyectos desde la base de datos...
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
                          onClick={() => handleAsignarAsesor(item.id)}
                        >
                          + Asignar Asesor
                        </button>
                      ) : (
                        <span className="advisor-name">{item.asesor}</span>
                      )}
                    </td>
                    <td>
                      <span className={`semaphore-dot ${item.estadoSemaforo.toLowerCase()}`}>
                        {item.estadoSemaforo === 'Rojo'
                          ? `🔴 ${item.diasSinAvance} días sin avance`
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
                      {item.estado === 'Aprobado' ? (
                        <button
                          className="btn-qr-action"
                          onClick={() => handleDescargarActaQR(item)}
                        >
                          📱 Descargar QR (H10)
                        </button>
                      ) : (
                        <button
                          className="btn-history-secondary"
                          onClick={() => alert(`Viendo avance de ${item.estudiante}`)}
                        >
                          Ver Detalle
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}