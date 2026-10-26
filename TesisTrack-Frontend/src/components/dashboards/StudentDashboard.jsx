import React, { useState, useRef } from 'react';
import { Timeline } from '../Timeline';
import { ProfileView } from '../ProfileView';
import '../../styles/Dashboards.css';

export const StudentDashboard = ({ user, activeTab = 'inicio' }) => {
  const uploadInputRef = useRef(null);

  // Estados para Subir Avance
  const [uploadedFile, setUploadedFile] = useState({
    name: 'Arquitectura_MVP_v1.pdf',
    size: '4.1 MB',
  });
  const [notesForAdvisor, setNotesForAdvisor] = useState(
    'Estimada Mtra. Deborah, adjunto el avance con los diagramas UML de arquitectura ajustados según las observaciones de la sesión anterior.'
  );

  // Filtros Mis Entregas
  const [historyFilter, setHistoryFilter] = useState('todos');

  // ESTADOS DEL MÓDULO EXAMEN DE GRADO

    // Estado para el mes/año actual del calendario (Inicia en Octubre 2026)
  const [currentCalDate, setCurrentCalDate] = useState(new Date(2026, 9, 1));
  const [selectedDay, setSelectedDay] = useState(10);
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM - 11:30 AM');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

// Nombres de los meses
const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Cálculo dinámico de días y desplazamiento del mes actual
const currentYear = currentCalDate.getFullYear();
const currentMonthIndex = currentCalDate.getMonth();
const daysInCurrentMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay(); // Días vacíos al inicio

// Lista dinámica de días del mes
const dynamicCalendarDays = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);

// Funciones para las flechas
const handlePrevMonth = () => {
  setCurrentCalDate(new Date(currentYear, currentMonthIndex - 1, 1));
};

const handleNextMonth = () => {
  setCurrentCalDate(new Date(currentYear, currentMonthIndex + 1, 1));
};

  const [currentStage] = useState('desarrollo');
  const [selectedFilterStage, setSelectedFilterStage] = useState('desarrollo');

  const currentUser = user || JSON.parse(localStorage.getItem('user')) || {
    nombre: 'Marisol',
    codigo: '218765432',
    email: 'marisol.huerta@alumnos.udg.mx',
    rol: 'Estudiante',
  };

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  const [documentos] = useState([
    {
      id: 2,
      codigo: 'ENT-02',
      estado: 'Con Observaciones',
      badgeClass: 'badge-yellow-obs',
      borderClass: 'border-left-orange',
      fecha: '01/10/2026',
      revisor: 'Mtra. Deborah Villaseñor',
      titulo: 'Capítulo 1 y 2 - Marco Teórico.pdf',
      tamano: '3.2 MB',
      observaciones: 'Ajustar la citación de las fuentes en formato APA 7 en el Capítulo 2.',
    },
    {
      id: 1,
      codigo: 'ENT-01',
      estado: 'Aprobado',
      badgeClass: 'badge-green-app',
      borderClass: 'border-left-green',
      fecha: '15/08/2026',
      revisor: 'Dra. Sofía Morales',
      titulo: 'Anteproyecto_Final_v2.pdf',
      tamano: '5.1 MB',
      observaciones: 'Aprobado sin correcciones requeridas.',
    },
  ]);

  const handleQuickUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
  };

  const handleConfirmSubmit = () => {
    if (!uploadedFile) {
      alert('Por favor selecciona un archivo PDF antes de enviar.');
      return;
    }
    alert(`¡Entregable "${uploadedFile.name}" enviado con éxito al asesor!`);
  };

  // Guardar postulación del Examen de Grado
  const handleConfirmBooking = () => {
    if (!selectedSlot) {
      alert('Por favor selecciona una franja horaria.');
      return;
    }
    const bookingData = {
      fecha: `${selectedDay} de ${monthNames[currentMonthIndex]} de ${currentYear}`,
      horario: selectedSlot,
      ubicacion: 'Auditorio A - Edificio B',
      modalidad: 'Presencial',
    };
    setConfirmedBooking(bookingData);
  };

  const filteredDocumentos = documentos.filter((doc) => {
    if (historyFilter === 'observaciones') return doc.estado === 'Con Observaciones';
    if (historyFilter === 'aprobados') return doc.estado === 'Aprobado';
    return true;
  });

  return (
    <div className="student-dashboard-full">
      <input
        type="file"
        ref={uploadInputRef}
        onChange={handleQuickUpload}
        accept=".pdf"
        style={{ display: 'none' }}
      />

      {/* VISTA 1: INICIO */}
      {activeTab === 'inicio' && (
        <>
          <header className="dashboard-header-flex">
            <div>
              <h1 className="welcome-title">¡Hola, {currentUser.nombre}!</h1>
            </div>
            <div className="stage-status-pill">Fase 2: En Progreso (45%)</div>
          </header>

          <Timeline
            currentStageKey={currentStage}
            onSelectStage={(stageKey) => setSelectedFilterStage(stageKey)}
          />

          <div className="dashboard-bottom-grid">
            <div className="card-surface">
              <div className="card-header-flex">
                <h2 className="card-title-lg">
                  📄 Documento y Revisión Actual
                </h2>
                <div className="badges-header-group">
                  <span className="status-yellow-pill">En Revisión por Asesor</span>
                </div>
              </div>

              <div className="file-card-box">
                <div className="file-info-group">
                  <span className="file-type-icon">📄</span>
                  <div className="file-text-details">
                    <strong>Capítulo_2_Avance_v3.pdf</strong>
                    <p>3.8 MB • Subido el 04 de Octubre</p>
                  </div>
                </div>
                <button className="btn-pdf-view">Ver PDF</button>
              </div>

              <div className="review-meta-grid">
                <div className="meta-info-card">
                  <span className="meta-label">Tiempo transcurrido:</span>
                  <strong className="meta-value-orange">2 días hábiles</strong>
                </div>
                <div className="meta-info-card">
                  <span className="meta-label">Revisor asignado:</span>
                  <strong className="meta-value-dark">Mtra. Deborah Villaseñor</strong>
                </div>
              </div>

              <div className="system-observation-box">
                <strong>Última observación del sistema:</strong>
                <p>
                  "Se recibió el avance. La Mtra. Deborah Villaseñor está revisando la metodología y citación APA 7."
                </p>
              </div>

              <button className="btn-consult-advisor">💬 Consultar Estado con Asesor</button>
            </div>

            <div className="card-surface">
              <div className="card-header-flex">
                <h2 className="card-title-lg">🗓️ Próximas Entregas Pendientes</h2>
                <span className="items-counter-badge">2 ítems</span>
              </div>

              <div className="upcoming-list">
                <div className="upcoming-item-card highlighted-yellow">
                  <div className="upcoming-item-content">
                    <div className="upcoming-title-row">
                      <h4>2.2 Avance de Arquitectura (MVP)</h4>
                    </div>
                    <p className="upcoming-deadline">
                      Fecha límite: <strong>29 de Octubre, 2026</strong>
                    </p>
                  </div>
                  <button
                    className="btn-submit-action"
                    onClick={() => uploadInputRef.current?.click()}
                  >
                    Subir
                  </button>
                </div>

                <div className="upcoming-item-card">
                  <div className="upcoming-item-content">
                    <h4>2.3 Pruebas y Evaluación Final</h4>
                    <p className="upcoming-deadline">
                      Fecha límite: <strong>12 de Noviembre, 2026</strong>
                    </p>
                  </div>
                  <button className="btn-view-hito">Ver Hito</button>
                </div>
              </div>

              <div className="notifications-footer-note">
                💡 Los recordatorios se gestionan en el apartado de <strong>Notificaciones</strong>.
              </div>
            </div>
          </div>
        </>
      )}

      {/* VISTA 2: SUBIR AVANCE */}
      {activeTab === 'subir' && (
        <div className="card-surface upload-advanced-wrapper">
          <div className="upload-header-row">
            <div>
              <h2 className="upload-main-title">Cargar Avance de Tesis</h2>
              <p className="linked-deliverable-text">
                Entrega vinculada: <strong>2.2 Avance de Arquitectura (MVP)</strong>
              </p>
            </div>
            <div className="deadline-timer-box">
              <span className="deadline-label">Fecha y Hora Límite:</span>
              <strong className="deadline-date-highlight">⏰ 29 Oct, 23:59 hrs</strong>
            </div>
          </div>

          <div className="upload-content-grid">
            <div className="upload-left-column">
              <div className="upload-dropzone-box" onClick={() => uploadInputRef.current?.click()}>
                <div className="upload-pdf-illustration">📄</div>
                <p className="dropzone-text-primary">
                  Arrastra tu archivo PDF aquí o <span className="click-browse-link">haz clic para examinar</span>
                </p>
                <span className="allowed-format-subtext">Formato permitido: PDF (Máximo 25 MB)</span>
              </div>

              {uploadedFile && (
                <div className="file-loaded-row">
                  <div className="file-loaded-details">
                    <span className="file-loaded-icon">📄</span>
                    <div>
                      <strong className="file-loaded-name">{uploadedFile.name}</strong>
                      <p className="file-loaded-meta">{uploadedFile.size} • Archivo listo para enviar</p>
                    </div>
                  </div>
                  <button className="btn-remove-file" onClick={handleRemoveFile}>Quitar</button>
                </div>
              )}

              <div className="advisor-notes-section">
                <label className="advisor-notes-label">
                  💬 Observaciones o notas para el asesor (Opcional):
                </label>
                <textarea
                  className="advisor-notes-textarea"
                  rows="3"
                  value={notesForAdvisor}
                  onChange={(e) => setNotesForAdvisor(e.target.value)}
                  placeholder="Escribe comentarios adicionales para tu asesor..."
                />
              </div>

              <button className="btn-confirm-submit-main" onClick={handleConfirmSubmit}>
                Confirmar y Subir Entregable
              </button>
            </div>

            <div className="upload-right-column">
              <div className="checklist-card-box">
                <h3 className="checklist-title">📋 Lista de Chequeo Previa</h3>
                <ul className="checklist-items-list">
                  <li><span>✓</span> Formato <strong>PDF</strong> válido (máx. 25 MB).</li>
                  <li><span>✓</span> Incluye la <strong>portada oficial</strong> institucional.</li>
                  <li><span>✓</span> Citas y fuentes en formato <strong>APA 7</strong>.</li>
                  <li><span>✓</span> Ponderación: <strong>20% de la fase</strong>.</li>
                </ul>
              </div>

              <div className="upload-status-warning-box">
                <span className="warning-icon-lock">🔒</span>
                <p>
                  Al subir el documento, su estado pasará a <strong>En Revisión</strong> y no se podrá modificar hasta recibir observaciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

{/* VISTA 3: MIS ENTREGAS / HISTORIAL DE REVISIONES */}
      {activeTab === 'entregas' && (
        <div className="card-surface deliverable-history-card">
          <div className="history-header-row">
            <div>
              <h2 className="history-title-main">Historial de Revisiones</h2>
              <p className="history-subtitle">
                Registro cronológico de documentos enviados, observaciones y estados.
              </p>
            </div>

            <div className="history-filter-pills">
              <button
                className={`filter-pill-btn ${historyFilter === 'todos' ? 'active' : ''}`}
                onClick={() => setHistoryFilter('todos')}
              >
                Todos
              </button>
              <button
                className={`filter-pill-btn ${historyFilter === 'observaciones' ? 'active' : ''}`}
                onClick={() => setHistoryFilter('observaciones')}
              >
                Con Observaciones
              </button>
              <button
                className={`filter-pill-btn ${historyFilter === 'aprobados' ? 'active' : ''}`}
                onClick={() => setHistoryFilter('aprobados')}
              >
                Aprobados
              </button>
            </div>
          </div>

          {/* Lista con línea vertical a la izquierda */}
          <div className="timeline-history-wrapper">
            <div className="timeline-vertical-line" />

            <div className="deliverable-history-list">
              {filteredDocumentos.map((doc) => {
                const isWarning = doc.estado === 'Con Observaciones';
                return (
                  <div key={doc.id} className="timeline-history-row">
                    {/* Indicador circular en la línea de tiempo */}
                    <div className={`timeline-node ${isWarning ? 'node-warning' : 'node-success'}`} />

                    {/* Tarjeta de la entrega */}
                    <div className="history-item-card">
                      <div className="history-card-body">
                        {/* Cabecera: Badges a la izquierda y Fecha/Revisor a la derecha */}
                        <div className="history-card-top-header">
                          <div className="history-badges-left">
                            <span className="history-code-badge">{doc.codigo}</span>
                            <span className={`status-badge-pill ${isWarning ? 'badge-warning' : 'badge-success'}`}>
                              {isWarning ? '⚠️ Con Observaciones' : '✓ Aprobado'}
                            </span>
                          </div>

                          <div className="history-meta-right">
                            <span className="history-meta-text">
                              Fecha: <strong>{doc.fecha}</strong>
                            </span>
                            <span className="meta-separator-dot">•</span>
                            <span className="history-meta-text">
                              Revisor: <strong>{doc.revisor}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Fila Central: Nombre del Archivo */}
                        <div className="history-file-box">
                          <div className="history-file-info">
                            <span className="history-file-icon">📄</span>
                            <div>
                              <strong className="history-file-title">{doc.titulo}</strong>
                              <span className="history-file-size"> {doc.tamano}</span>
                            </div>
                          </div>
                        </div>

                        {/* Fila Inferior: Observaciones con borde izquierdo de color */}
                        <div className={`history-observation-box ${isWarning ? 'obs-warning' : 'obs-success'}`}>
                          <strong>OBSERVACIONES DEL REVISOR:</strong>
                          <p>"{doc.observaciones}"</p>
                        </div>
                      </div>

                      {/* Panel de Botones a la derecha */}
                      <div className="history-card-actions">
                        {isWarning ? (
                          <>
                            <button
                              className="btn-history-primary"
                              onClick={() => uploadInputRef.current?.click()}
                            >
                              Subir Corrección
                            </button>
                            <button className="btn-history-secondary">
                              Ver Retroalimentación
                            </button>
                            <div className="deadline-badge-pill">
                              ⏰ Límite: 10/10/2026
                            </div>
                          </>
                        ) : (
                          <button className="btn-history-secondary">
                            Descargar Copia
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

{/* VISTA 4: EXAMEN DE GRADO (CALENDARIO DE POSTULACIÓN) */}
      {activeTab === 'examen' && (
        <div className="card-surface exam-module-card">
          {/* Cabecera del Módulo */}
          <div className="exam-header-flex">
            <div>
              <h2 className="exam-main-title">
                Postulación de Defensa de Tesis
              </h2>
              <p className="exam-subtitle">
                Selecciona un día disponible configurado por tu jurado evaluador.
              </p>
            </div>

            {/* Leyenda de Colores */}
            <div className="exam-legend-box">
              <span className="legend-item">
                <span className="dot-available"></span> Disponible
              </span>
              <span className="legend-item">
                <span className="dot-selected"></span> Seleccionado
              </span>
            </div>
          </div>

          {/* Grid de Contenido (Calendario + Panel de Selección) */}
          <div className="exam-calendar-grid">
            {/* Columna Izquierda: Calendario */}
            <div className="exam-calendar-box">
              <div className="cal-top-month-bar">
                <h3>{monthNames[currentMonthIndex]} {currentYear}</h3>
                <div className="cal-arrows">
                  <button type="button" className="arrow-btn" onClick={handlePrevMonth} title="Mes anterior">‹</button>
                  <button type="button" className="arrow-btn" onClick={handleNextMonth} title="Mes siguiente">›</button>
                </div>
              </div>

              <div className="cal-weekdays-row">
                <span>Dom</span><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span>
              </div>

              <div className="cal-days-matrix">
                {/* Espacios vacíos al inicio */}
                {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="day-cell-btn empty-cell" style={{ visibility: 'hidden' }} />
                ))}

                {/* Renderizado de los días del mes */}
                {dynamicCalendarDays.map((day) => {
                  const isOct2026 = currentMonthIndex === 9 && currentYear === 2026;
                  const isAvailable = isOct2026 
                    ? [10, 14, 20].includes(day) 
                    : [5, 12, 18, 25].includes(day);

                  const isSelected = day === selectedDay;

                  return (
                    <button
                      key={day}
                      type="button"
                      className={`day-cell-btn ${isAvailable ? 'is-available' : ''} ${
                        isSelected ? 'is-selected' : ''
                      }`}
                      onClick={() => setSelectedDay(day)}
                    >
                      <span className="day-num">{day}</span>
                      {(isAvailable || isSelected) && (
                        <span className={`cell-dot ${isSelected ? 'dot-white' : 'dot-green'}`}></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Columna Derecha: Horarios */}
            <div className="exam-slots-box">
              <h3 className="slots-title">Horarios Disponibles</h3>
              <p className="slots-date-sub">
                Día {selectedDay || 10} de {monthNames[currentMonthIndex]} de {currentYear}
              </p>

              <div className="slot-cards-group">
                {[
                  '10:00 AM - 11:30 AM',
                  '12:00 PM - 01:30 PM',
                  '04:00 PM - 05:30 PM',
                ].map((slot) => {
                  const isSlotActive = selectedSlot === slot;
                  return (
                    <div
                      key={slot}
                      className={`slot-option-card ${isSlotActive ? 'selected-slot' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <span className="slot-time-text">🕒 {slot}</span>
                      <span className="slot-badge-green">Disponible</span>
                    </div>
                  );
                })}
              </div>

              {/* Metadatos de Lugar */}
              <div className="exam-location-meta">
                <div className="meta-row-line">
                  <span className="meta-text-grey">Modalidad:</span>
                  <strong className="meta-text-dark">Presencial</strong>
                </div>
                <div className="meta-row-line">
                  <span className="meta-text-grey">Ubicación:</span>
                  <strong className="meta-text-dark">Auditorio A - Edificio B</strong>
                </div>
              </div>

              <button type="button" className="btn-confirm-postulacion" onClick={handleConfirmBooking}>
                Confirmar Fecha
              </button>

              {/* Confirmación Guardada */}
              {confirmedBooking && (
                <div className="booking-success-banner">
                  <span>✅ Postulación Registrada:</span>
                  <p>
                    {confirmedBooking.fecha} a las {confirmedBooking.horario} en {confirmedBooking.ubicacion}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VISTA 5: MI PERFIL */}
      {activeTab === 'perfil' && <ProfileView user={currentUser} />}
    </div>
  );
};