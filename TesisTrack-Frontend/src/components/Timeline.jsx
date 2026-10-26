import React, { useState, useRef } from 'react';
import '../styles/Dashboards.css';

export const Timeline = ({ currentStageKey = 'desarrollo', onSelectStage }) => {
  const [selectedStage, setSelectedStage] = useState('desarrollo');
  const fileInputRef = useRef(null);

  // Manejador al seleccionar el archivo PDF
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`¡Archivo "${file.name}" cargado con éxito!`);
      // Aquí puedes agregar tu lógica para enviar el archivo al backend (FormData / Express)
    }
  };

  // Disparar ventana de explorador de archivos
  const triggerFileUpload = (e) => {
    e.stopPropagation(); // Evita interferir con la selección de etapa
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const etapas = [
    {
      key: 'anteproyecto',
      numero: 1,
      title: 'Fase 1: Anteproyecto',
      weeks: '(Semana 1 - 4)',
      status: 'completed',
      tooltip: 'Completada en Semana 4 — Dictamen: Aprobado',
      subHitos: [
        {
          id: '1.1',
          nombre: 'Planteamiento del Problema',
          semana: 'Semana 2',
          limite: '05 de Sep, 2026',
          estado: 'Entregado',
          badgeClass: 'badge-entregado',
          archivo: 'Planteamiento_Problema_v1.pdf',
          tamano: '1.8 MB',
          subidoFecha: 'Subido el 03 de Sep, 08:15 PM',
          bordeColor: 'border-green',
        },
        {
          id: '1.2',
          nombre: 'Protocolo y Justificación',
          semana: 'Semana 4',
          limite: '19 de Sep, 2026',
          estado: 'Entregado',
          badgeClass: 'badge-entregado',
          archivo: 'Protocolo_Justificacion_Final.pdf',
          tamano: '3.2 MB',
          subidoFecha: 'Subido el 18 de Sep, 04:20 PM',
          bordeColor: 'border-green',
        },
      ],
    },
    {
      key: 'desarrollo',
      numero: 2,
      title: 'Fase 2: Desarrollo',
      weeks: '(Semana 5 - 10)',
      status: 'active',
      tooltip: 'En Curso — 45% Completado',
      subHitos: [
        {
          id: '2.1',
          nombre: 'Marco Teórico y Citación APA 7',
          semana: 'Semana 6',
          limite: '15 de Oct, 2026',
          estado: 'Entregado',
          badgeClass: 'badge-entregado',
          archivo: 'Marco_Teorico_v2.pdf',
          tamano: '2.4 MB',
          subidoFecha: 'Subido el 14 de Oct, 10:30 PM',
          bordeColor: 'border-green',
          btnText: 'Ver Documento Subido',
          btnClass: 'btn-green',
        },
        {
          id: '2.2',
          nombre: 'Avance de Arquitectura (MVP)',
          semana: 'Semana 8',
          limite: '29 de Oct, 2026',
          estado: 'En Revisión',
          badgeClass: 'badge-revision',
          archivo: 'Arquitectura_MVP_v1.pdf',
          tamano: '4.1 MB',
          subidoFecha: 'Subido el 17 de Oct, 04:15 PM',
          bordeColor: 'border-blue',
          btnText: 'Ver Documento Subido',
          btnClass: 'btn-blue',
        },
        {
          id: '2.3',
          nombre: 'Pruebas y Evaluación Final',
          semana: 'Semana 10',
          limite: '12 de Nov, 2026',
          estado: 'Pendiente',
          badgeClass: 'badge-pendiente',
          sinArchivo: '📌 Sin entregable cargado hasta el momento',
          bordeColor: 'border-indigo',
          btnText: 'Subir Entregable PDF',
          btnClass: 'btn-indigo-dark',
          isUploadBtn: true, // Marca especial para activar la subida
        },
      ],
    },
    {
      key: 'dictamen',
      numero: 3,
      title: 'Fase 3: Dictamen',
      weeks: '(Semana 11 - 14)',
      status: 'locked',
      tooltip: 'Bloqueada — Requiere Completar la Fase 2',
      subHitos: [
        {
          id: '3.1',
          nombre: 'Asignación de Revisores',
          semana: 'Semana 11',
          limite: '26 de Nov, 2026',
          estado: 'Bloqueado',
          badgeClass: 'badge-pendiente',
          sinArchivo: '📌 Requisito previo pendiente',
          bordeColor: 'border-gray',
        },
      ],
    },
    {
      key: 'examen',
      numero: 4,
      title: 'Fase 4: Examen',
      weeks: '(Semana 15 - 17)',
      status: 'locked',
      tooltip: 'Bloqueada — Requiere Aprobación de Dictamen',
      subHitos: [
        {
          id: '4.1',
          nombre: 'Postulación de Fecha de Examen',
          semana: 'Semana 15',
          limite: '10 de Dic, 2026',
          estado: 'Bloqueado',
          badgeClass: 'badge-pendiente',
          sinArchivo: '📌 Requisito previo pendiente',
          bordeColor: 'border-gray',
        },
      ],
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
      {/* Input de archivo invisible para subir entregables */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        style={{ display: 'none' }}
      />

      {/* Cabecera superior */}
      <div className="timeline-header-bar">
        <span className="timeline-title-main">Progreso General del Proceso de Titulación</span>
        <span className="weeks-counter-badge">4 de 17 Semanas Transcurridas</span>
      </div>

      {/* Stepper Horizontal */}
      <div className="stepper-wrapper">
        <div className="stepper-line"></div>
        <div className="stepper-line-progress" style={{ width: '48%' }}></div>

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

              <span
                className={`stepper-label ${isCompleted ? 'completed-label' : ''} ${
                  isActive ? 'active-label' : ''
                }`}
              >
                {etapa.title}
              </span>
              <span className="stepper-weeks">{etapa.weeks}</span>
            </div>
          );
        })}
      </div>

      {/* DESGLOSE DE ENTREGAS */}
      {etapaActualInfo && (
        <div className="sub-hitos-panel">
          <div className="sub-hitos-header">
            <h4>📌 Desglose de Entregas</h4>
            <span className="sub-hitos-badge-status">{etapaActualInfo.weeks}</span>
          </div>

          <div className="deliverables-container">
            {etapaActualInfo.subHitos.map((hito) => (
              <div key={hito.id} className={`deliverable-card ${hito.bordeColor}`}>
                {/* Fila Superior: ID, Título, Semana, Fecha Límite y Badge */}
                <div className="deliverable-top-row">
                  <div className="deliverable-title-box">
                    <span className="deliverable-id">{hito.id}</span>
                    <h5 className="deliverable-name">{hito.nombre}</h5>
                  </div>

                  <div className="deliverable-meta-box">
                    <span className="week-pill">🗓️ {hito.semana}</span>
                    <span className="limit-date-text">
                      Límite: <strong>{hito.limite}</strong>
                    </span>
                    <span className={`status-badge-pill ${hito.badgeClass}`}>
                      {hito.estado === 'Entregado' && '✅ '}
                      {hito.estado === 'En Revisión' && '⏳ '}
                      {hito.estado === 'Pendiente' && '🔒 '}
                      {hito.estado}
                    </span>
                  </div>
                </div>

                <div className="deliverable-divider"></div>

                {/* Fila Inferior: Información del Archivo, Tiempo y Botón */}
                <div className="deliverable-bottom-row">
                  <div className="deliverable-left-content">
                    {hito.archivo ? (
                      <div className="file-box-info">
                        <span className="file-icon-pdf">📄</span>
                        <div className="file-details">
                          <span className="file-name">{hito.archivo}</span>
                          <span className="file-size">{hito.tamano}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="no-file-text">{hito.sinArchivo}</span>
                    )}

                    {hito.alertaTiempo && (
                      <div className="time-review-pill">{hito.alertaTiempo}</div>
                    )}
                  </div>

                  <div className="deliverable-right-action">
                    {hito.subidoFecha && (
                      <span className="upload-timestamp">🕒 {hito.subidoFecha}</span>
                    )}
                    {hito.btnText && (
                      <button
                        className={`btn-deliverable-action ${hito.btnClass}`}
                        onClick={hito.isUploadBtn ? triggerFileUpload : undefined}
                      >
                        {hito.btnText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};