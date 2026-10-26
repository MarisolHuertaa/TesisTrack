import React from 'react';
import '../../styles/Dashboards.css';

export const AdminDashboard = () => {
  const asesores = [
    { id: 1, nombre: 'Dr. Roberto Gómez', alumnos: 5, dias: 3, estado: 'verde' },
    { id: 2, nombre: 'Dra. María Fernández', alumnos: 4, dias: 7, estado: 'amarillo' },
    { id: 3, nombre: 'Mtro. Juan Pérez', alumnos: 6, dias: 12, estado: 'rojo' },
  ];

  return (
    <div className="dashboard-view">
      <header className="dashboard-header">
        <h1>Coordinación Académica</h1>
        <p className="text-secondary">Métricas Globales y Control de Tiempos de Respuesta</p>
      </header>

      {/* KPIs Globales */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-number">42</span>
          <span className="kpi-label">Proyectos Activos</span>
        </div>
        <div className="kpi-card accent-green">
          <span className="kpi-number">15</span>
          <span className="kpi-label">Listos para Examen</span>
        </div>
        <div className="kpi-card accent-indigo">
          <span className="kpi-number">4.2 días</span>
          <span className="kpi-label">Promedio de Respuesta</span>
        </div>
      </div>

      {/* Semáforo de Tiempos de Respuesta */}
      <div className="card-surface">
        <h2 className="card-title">Semáforo de Tiempo de Respuesta de Asesores</h2>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Asesor / Docente</th>
              <th>Alumnos</th>
              <th>Tiempo Medio</th>
              <th>Estado</th>
              <th>Acción Recomendada</th>
            </tr>
          </thead>
          <tbody>
            {asesores.map((as) => (
              <tr key={as.id}>
                <td><strong>{as.nombre}</strong></td>
                <td>{as.alumnos}</td>
                <td>{as.dias} días</td>
                <td>
                  <span className={`semaphore-badge ${as.estado}`}>
                    {as.estado === 'verde' && '🟢 < 5 Días'}
                    {as.estado === 'amarillo' && '🟡 5-10 Días'}
                    {as.estado === 'rojo' && '🔴 > 10 Días'}
                  </span>
                </td>
                <td>
                  {as.estado === 'rojo' ? (
                    <button className="btn-action btn-alert" onClick={() => alert(`Recordatorio enviado a ${as.nombre}`)}>
                      Enviar Recordatorio
                    </button>
                  ) : (
                    <span className="text-secondary">Atención Normal</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gráfico de Distribución por Fases */}
      <div className="card-surface">
        <h2 className="card-title">Distribución de Proyectos por Fase</h2>
        <div className="distribution-bar">
          <div className="dist-segment seg-1" style={{ width: '25%' }}>Anteproyecto (25%)</div>
          <div className="dist-segment seg-2" style={{ width: '45%' }}>Desarrollo (45%)</div>
          <div className="dist-segment seg-3" style={{ width: '20%' }}>Dictamen (20%)</div>
          <div className="dist-segment seg-4" style={{ width: '10%' }}>Examen (10%)</div>
        </div>
      </div>
    </div>
  );
};