import React, { useState, useEffect } from 'react';
import '../styles/Dashboards.css';

export const Timeline = ({ 
  currentStageKey = 'anteproyecto', 
  percentage, 
  weeksElapsed = 4, 
  hitos = [], 
  onSelectStage 
}) => {
  const [selectedStage, setSelectedStage] = useState(currentStageKey);

  useEffect(() => {
    setSelectedStage(currentStageKey);
  }, [currentStageKey]);

  const faseMapNum = {
    anteproyecto: 1,
    desarrollo: 2,
    dictamen: 3,
    examen: 4,
  };

  const faseActualNum = faseMapNum[currentStageKey] || 1;
  const selectedFaseNum = faseMapNum[selectedStage] || 1;
  const avanceReal = percentage !== undefined && percentage !== null ? percentage : 0;

  // FILTRAR HITOS INSTITUCIONALES POR FASE SELECCIONADA (SEGÚN TABLA HITOS)
  const hitosDeFaseSeleccionada = hitos.filter(
    (h) => Number(h.fase_id) === Number(selectedFaseNum)
  );

  const etapas = [
    {
      key: 'anteproyecto',
      numero: 1,
      title: 'Fase 1: Anteproyecto',
      weeks: '(Semana 1 - 4)',
      status: faseActualNum > 1 ? 'completed' : faseActualNum === 1 ? 'active' : 'locked',
      tooltip: faseActualNum > 1 ? 'Completada' : `En Curso — ${avanceReal}%`,
    },
    {
      key: 'desarrollo',
      numero: 2,
      title: 'Fase 2: Desarrollo',
      weeks: '(Semana 5 - 10)',
      status: faseActualNum > 2 ? 'completed' : faseActualNum === 2 ? 'active' : 'locked',
      tooltip: faseActualNum > 2 ? 'Completada' : `En Curso — ${avanceReal}%`,
    },
    {
      key: 'dictamen',
      numero: 3,
      title: 'Fase 3: Dictamen',
      weeks: '(Semana 11 - 14)',
      status: faseActualNum > 3 ? 'completed' : faseActualNum === 3 ? 'active' : 'locked',
      tooltip: faseActualNum > 3 ? 'Completada' : `En Curso — ${avanceReal}%`,
    },
    {
      key: 'examen',
      numero: 4,
      title: 'Fase 4: Examen',
      weeks: '(Semana 15 - 17)',
      status: faseActualNum > 4 ? 'completed' : faseActualNum === 4 ? 'active' : 'locked',
      tooltip: faseActualNum > 4 ? 'Completada' : `En Curso — ${avanceReal}%`,
    },
  ];

  const handleStageClick = (etapaKey) => {
    setSelectedStage(etapaKey);
    if (onSelectStage) {
      onSelectStage(etapaKey);
    }
  };

  const etapaActualInfo = etapas.find((e) => e.key === selectedStage);

  return (
    <div className="card-surface timeline-container-card">
      <div className="timeline-header-bar">
        <span className="timeline-title-main">Progreso General del Proceso de Titulación</span>
        <span className="weeks-counter-badge">{weeksElapsed} de 17 Semanas Transcurridas</span>
      </div>

      <div className="stepper-wrapper">
        <div className="stepper-line"></div>
        <div className="stepper-line-progress" style={{ width: `${avanceReal}%` }}></div>

        {etapas.map((etapa) => {
          const isCompleted = etapa.status === 'completed';
          const isActive = etapa.status === 'active';
          const isLocked = etapa.status === 'locked';
          const isSelected = selectedStage === etapa.key;

          return (
            <div
              key={etapa.key}
              className={`stepper-node-item ${isSelected ? 'selected-node' : ''}`}
              onClick={() => handleStageClick(etapa.key)}
            >
              <div className="node-tooltip">{etapa.tooltip}</div>

              <div
                className={`stepper-circle ${isCompleted ? 'completed' : ''} ${
                  isActive ? 'active pulse-effect' : ''
                } ${isLocked ? 'locked' : ''} ${isSelected ? 'focus-ring' : ''}`}
              >
                {isCompleted && '✓'}
                {isActive && etapa.numero}
                {isLocked && '🔒'}
              </div>

              <span className={`stepper-label ${isCompleted ? 'completed-label' : ''} ${isActive ? 'active-label' : ''}`}>
                {etapa.title}
              </span>
              <span className="stepper-weeks">{etapa.weeks}</span>
            </div>
          );
        })}
      </div>

      {/* DESGLOSE DE HITOS OFICIALES DE LA BASE DE DATOS */}
      {etapaActualInfo && (
        <div className="sub-hitos-panel">
          <div className="sub-hitos-header">
            <h4>📌 Desglose de Entregas</h4>
            <span className="sub-hitos-badge-status">{etapaActualInfo.weeks}</span>
          </div>

          <div className="deliverables-container">
            {hitosDeFaseSeleccionada.length > 0 ? (
              hitosDeFaseSeleccionada.map((hito) => (
                <div key={hito.id} className="deliverable-card border-blue">
                  <div className="deliverable-top-row" style={{ marginBottom: 0 }}>
                    <div className="deliverable-title-box">
                      <span className="deliverable-id">{hito.codigo}</span>
                      <h5 className="deliverable-name">{hito.nombre}</h5>
                    </div>

                    <div className="deliverable-meta-box">
                      <span className="week-pill">🗓️ {hito.semana_sugerida}</span>
                      <span className="limit-date-text">
                        Límite: <strong>{hito.fecha_limite}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '1rem' }}>
                No hay entregas configuradas para esta fase.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};