import React, { useState } from 'react';
import '../../styles/Dashboards.css';

export const TeacherDashboard = ({ user }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const alumnos = [
    { id: 1, nombre: 'Marisol Huerta', tema: 'Sistema Web TesisTrack', avance: 'Capítulo 1 y 2', estado: 'Pendiente' },
    { id: 2, nombre: 'Carlos Ruiz', tema: 'I.A. en Salud', avance: 'Anteproyecto', estado: 'Revisado' },
    { id: 3, nombre: 'Elena Gómez', tema: 'Redes IoT', avance: 'Dictamen Final', estado: 'Pendiente' },
  ];

  return (
    <div className="dashboard-view">
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

      {/* Modal / Visor y Panel de Dictamen */}
      {selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Visor de Dictamen - {selectedStudent.nombre}</h3>
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

      {/* Gestión de Agenda */}
      <div className="card-surface">
        <h2 className="card-title">Gestión de Agenda (Disponibilidad para Examen de Grado)</h2>
        <p className="text-secondary">Selecciona las franjas horarias habilitadas para defensas presenciales de tesis.</p>
        <div className="agenda-slots">
          <button className="slot-btn active">Vie 10 Oct - 10:00 AM (Habilitado)</button>
          <button className="slot-btn active">Vie 10 Oct - 12:00 PM (Habilitado)</button>
          <button className="slot-btn">Mar 14 Oct - 04:00 PM (+ Habilitar)</button>
        </div>
      </div>
    </div>
  );
};