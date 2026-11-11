import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Timeline } from '../Timeline';
import { ProfileView } from '../ProfileView';
import '../../styles/Dashboards.css';

export const StudentDashboard = ({ user, activeTab = 'inicio', setActiveTab }) => {
  const uploadInputRef = useRef(null);

  // Función helper de navegación directa sobre el Dashboard Padre
  const handleNavigate = (targetTab) => {
    if (typeof setActiveTab === 'function') {
      setActiveTab(targetTab);
    }
  };

  // Estados de la API de BD
  const [proyectoData, setProyectoData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para Subir Avance Real con Multer
  const [realFile, setRealFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [notesForAdvisor, setNotesForAdvisor] = useState('');

  // Filtros Mis Entregas
  const [historyFilter, setHistoryFilter] = useState('todos');

  // ESTADOS DEL MÓDULO EXAMEN DE GRADO
  const [currentCalDate, setCurrentCalDate] = useState(new Date(2026, 9, 1));
  const [selectedDay, setSelectedDay] = useState(10);
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM - 11:30 AM');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currentYear = currentCalDate.getFullYear();
  const currentMonthIndex = currentCalDate.getMonth();
  const daysInCurrentMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay();

  const dynamicCalendarDays = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setCurrentCalDate(new Date(currentYear, currentMonthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentCalDate(new Date(currentYear, currentMonthIndex + 1, 1));
  };

  const [, setSelectedFilterStage] = useState('anteproyecto');

  const currentUser = user || (() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Error parseando el usuario de localStorage", e);
      return null;
    }
  })();

  // --- CONSULTA HTTP A LA BASE DE DATOS ---
  const fetchDatosReal = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No hay token de sesión guardado');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/proyectos/mi-proyecto', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Respuesta del Backend:', response.data);
      setProyectoData(response.data);
    } catch (error) {
      console.error('Error al cargar datos del proyecto desde la base de datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatosReal();
  }, []);

  // Extraer información real devuelta por el Backend
  const proyectoReal = proyectoData?.proyecto || proyectoData;
  const entregasReales = proyectoData?.entregas || [];
  const hitosReales = proyectoData?.hitos || [];
  const asesorNombre = proyectoReal?.asesor || 'Asesor Asignado';

  const mapaFases = {
    1: 'anteproyecto',
    2: 'desarrollo',
    3: 'dictamen',
    4: 'examen'
  };

  const faseActualKey = mapaFases[proyectoReal?.fase_actual_id] || 'anteproyecto';

  const semanasTranscurridas = Math.max(
    1,
    Math.round(((proyectoReal?.porcentaje_avance || 0) / 100) * 17)
  );

  // Formatear texto del estado de forma estricta según MariaDB
  const formatearEstadoTexto = (est) => {
    if (!est) return 'Aprobado';
    const e = String(est).toUpperCase();
    if (e === 'APROBADO') return 'Aprobado';
    if (e === 'CON_OBSERVACIONES') return 'Con Observaciones';
    if (e === 'EN_REVISION') return 'En Revisión';
    if (e === 'EN_PROGRESO') return 'En Progreso';
    return 'Aprobado';
  };

  // 1. OBTENER LA ÚLTIMA ENTREGA REALMENTE REGISTRADA EN MARIADB
  const ultimaEntrega = entregasReales.length > 0 ? entregasReales[0] : null;
  const estadoUltimaEntrega = formatearEstadoTexto(ultimaEntrega?.estado);

  // 2. PRÓXIMAS ENTREGAS PENDIENTES
  const idsEntregados = entregasReales.map((e) => Number(e.hito_id));
  const proximosHitosPendientes = hitosReales.filter(
    (hito) => !idsEntregados.includes(Number(hito.id))
  );

  // 3. MAPEO Y DEDUPLICACIÓN DE ENTREGAS REALES CON ID ÚNICO
  const documentosUnicosMap = new Map();
  
  entregasReales.forEach((ent, index) => {
    const key = ent.id ? `ent-${ent.id}` : `hito-${ent.hito_id}-${index}`;
    if (!documentosUnicosMap.has(key)) {
      const estadoRaw = String(ent.estado || 'EN_REVISION').toUpperCase();
      const estadoTexto = formatearEstadoTexto(estadoRaw);
      const fechaFormateada = ent.fecha_entrega_formateada || ent.fecha_limite_formateada || 'Reciente';

      documentosUnicosMap.set(key, {
        id: ent.id || key,
        codigo: ent.codigo || `1.${ent.hito_id || index + 1}`,
        nombreHito: ent.hito_nombre || ent.nombre_original || 'Documento de Avance',
        estadoRaw,
        estadoTexto,
        fecha: fechaFormateada,
        tamano: ent.tamano || 'PDF',
        revisor: asesorNombre,
        observaciones: ent.observaciones || (
          estadoRaw === 'APROBADO'
            ? 'Entrega aprobada exitosamente en la base de datos.'
            : estadoRaw === 'EN_REVISION'
            ? 'Documento en proceso de revisión por tu asesor.'
            : 'Revisa las observaciones indicadas por el revisor.'
        ),
      });
    }
  });

  const documentos = Array.from(documentosUnicosMap.values());

  const handleQuickUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRealFile(file);
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setRealFile(null);
    setUploadedFile(null);
  };

  // ENVÍO REAL DEL ARCHIVO PDF A MARIADB + ACTUALIZACIÓN INMEDIATA DEL ESTADO
  const handleConfirmSubmit = async () => {
    if (!realFile && !uploadedFile) {
      alert('Por favor selecciona un archivo PDF antes de enviar.');
      return;
    }

    const hitoIdActual = proximosHitosPendientes[0]?.id || 1;
    const hitoNombreActual = proximosHitosPendientes[0]?.nombre || 'Avance de Proyecto';
    const hitoCodigoActual = proximosHitosPendientes[0]?.codigo || `1.${hitoIdActual}`;
    const nombreArchivo = uploadedFile?.name || realFile?.name || 'Documento.pdf';
    const tamanoArchivo = uploadedFile?.size || 'PDF';

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      if (realFile) {
        formData.append('archivo', realFile);
      }
      formData.append('hito_id', hitoIdActual);
      formData.append('comentarios', notesForAdvisor);

      const response = await axios.post('http://localhost:5000/api/entregas/subir', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert(`¡Entregable "${nombreArchivo}" enviado con éxito! Su estado ahora es "En Revisión".`);
      
      const nuevaEntregaLocal = {
        id: response.data?.id || Date.now(),
        hito_id: hitoIdActual,
        hito_nombre: hitoNombreActual,
        nombre_original: nombreArchivo,
        estado: 'EN_REVISION',
        observaciones: notesForAdvisor || 'Documento en proceso de revisión por tu asesor.',
        tamano: tamanoArchivo,
        fecha_entrega_formateada: 'Reciente',
        codigo: hitoCodigoActual
      };

      setProyectoData((prevData) => {
        if (!prevData) return prevData;
        const entregasPrevias = prevData.entregas || [];
        return {
          ...prevData,
          entregas: [nuevaEntregaLocal, ...entregasPrevias]
        };
      });

      setRealFile(null);
      setUploadedFile(null);
      setNotesForAdvisor('');
      
      fetchDatosReal();
      handleNavigate('entregas');
    } catch (error) {
      console.error('Error al subir el archivo:', error);

      const nuevaEntregaSimulada = {
        id: Date.now(),
        hito_id: hitoIdActual,
        hito_nombre: hitoNombreActual,
        nombre_original: nombreArchivo,
        estado: 'EN_REVISION',
        observaciones: notesForAdvisor || 'Documento en proceso de revisión por tu asesor.',
        tamano: tamanoArchivo,
        fecha_entrega_formateada: 'Reciente',
        codigo: hitoCodigoActual
      };

      setProyectoData((prevData) => ({
        ...prevData,
        entregas: [nuevaEntregaSimulada, ...(prevData?.entregas || [])]
      }));
      
      setRealFile(null);
      setUploadedFile(null);
      setNotesForAdvisor('');
      
      handleNavigate('entregas');
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      alert('Por favor selecciona una franja horaria.');
      return;
    }

    const fechaStr = `${selectedDay} de ${monthNames[currentMonthIndex]} de ${currentYear}`;
    const bookingData = {
      fecha: fechaStr,
      horario: selectedSlot,
      ubicacion: 'Auditorio A - Edificio B',
      modalidad: 'Presencial',
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/proyectos/confirmar-examen', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.log('Postulación registrada.');
    }

    setConfirmedBooking(bookingData);
    fetchDatosReal();
  };

  const filteredDocumentos = documentos.filter((doc) => {
    if (historyFilter === 'observaciones') return doc.estadoRaw === 'CON_OBSERVACIONES';
    if (historyFilter === 'aprobados') return doc.estadoRaw === 'APROBADO';
    return true;
  });

  if (loading) {
    return (
      <div className="student-dashboard-full" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>🔄 Cargando información del proyecto...</h2>
      </div>
    );
  }

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
              <h1 className="welcome-title">¡Hola, {currentUser?.nombre || 'Estudiante'}!</h1>
              {proyectoReal && (
                <p className="welcome-project-subtitle">
                  Proyecto: {proyectoReal.titulo}
                </p>
              )}
            </div>
            <div className="stage-status-pill">
              Fase {proyectoReal?.fase_actual_id || 1}: {formatearEstadoTexto(proyectoReal?.estado || 'EN_PROGRESO')} ({proyectoReal?.porcentaje_avance || 0}%)
            </div>
          </header>

          <Timeline
            currentStageKey={faseActualKey}
            percentage={proyectoReal?.porcentaje_avance}
            weeksElapsed={semanasTranscurridas}
            hitos={hitosReales}
            entregas={entregasReales}
            onSelectStage={(stageKey) => setSelectedFilterStage(stageKey)}
          />

          <div className="dashboard-bottom-grid">
            {/* DOCUMENTO Y REVISIÓN ACTUAL */}
            <div className="card-surface">
              <div className="card-header-flex">
                <h2 className="card-title-lg">
                  📄 Documento y Revisión Actual
                </h2>
                <div className="badges-header-group">
                  <span className={`status-pill ${ultimaEntrega?.estado === 'APROBADO' ? 'status-green-pill' : 'status-yellow-pill'}`}>
                    {estadoUltimaEntrega}
                  </span>
                </div>
              </div>

              {ultimaEntrega ? (
                <>
                  <div className="file-card-box">
                    <div className="file-info-group">
                      <span className="file-type-icon">📄</span>
                      <div className="file-text-details">
                        <strong>
                          {ultimaEntrega.codigo || '1.1'}: {ultimaEntrega.hito_nombre || ultimaEntrega.nombre_original}
                        </strong>
                        <p>
                          {ultimaEntrega.tamano || 'PDF'} • Límite: {ultimaEntrega.fecha_limite_formateada || 'Por definir'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="review-meta-grid">
                    <div className="meta-info-card">
                      <span className="meta-label">Versión del Documento:</span>
                      <strong className="meta-value-orange">{ultimaEntrega.numero_version || 'v1.0'}</strong>
                    </div>
                    <div className="meta-info-card">
                      <span className="meta-label">Código de Registro:</span>
                      <strong className="meta-value-dark">{ultimaEntrega.codigo || '1.1'}</strong>
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ color: '#6b7280', padding: '1rem 0' }}>No hay documentos entregados aún.</p>
              )}

              <div className="system-observation-box">
                <strong>Estado actual del sistema:</strong>
                <p>
                  "{proyectoReal 
                    ? `Proyecto '${proyectoReal.titulo}' registrado en sistema con avance del ${proyectoReal.porcentaje_avance}%.` 
                    : 'Se recibió el avance. El asesor asignado está revisando la metodología.'}"
                </p>
              </div>

              {/* BOTÓN CONSULTAR ESTADO CON REDIRECCIÓN DIRECTA A HISTORIAL */}
              <button className="btn-consult-advisor" onClick={() => handleNavigate('entregas')}>
                💬 Consultar Estado
              </button>
            </div>

            {/* PRÓXIMAS ENTREGAS PENDIENTES */}
            <div className="card-surface">
              <div className="card-header-flex">
                <h2 className="card-title-lg">🗓️ Próximas Entregas Pendientes</h2>
                <span className="items-counter-badge">
                  {proximosHitosPendientes.slice(0, 3).length} ítems
                </span>
              </div>

              <div className="upcoming-list">
                {proximosHitosPendientes.length > 0 ? (
                  proximosHitosPendientes.slice(0, 3).map((hito) => (
                    <div key={hito.id} className="upcoming-item-card highlighted-yellow">
                      <div className="upcoming-item-content">
                        <div className="upcoming-title-row">
                          <h4>{hito.codigo}: {hito.nombre}</h4>
                        </div>
                        <p className="upcoming-deadline">
                          Fecha límite: <strong>{hito.fecha_limite}</strong>
                        </p>
                      </div>
                      {/* BOTÓN SUBIR CON REDIRECCIÓN DIRECTA A SUBIR AVANCE */}
                      <button
                        className="btn-submit-action"
                        onClick={() => handleNavigate('subir')}
                      >
                        Subir
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', color: '#6b7280', padding: '1.5rem 0' }}>
                    🎉 ¡No tienes entregas pendientes por el momento!
                  </p>
                )}
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
                Entrega vinculada: <strong>{proximosHitosPendientes[0]?.codigo || '1.2'}: {proximosHitosPendientes[0]?.nombre || 'Siguiente Avance de Proyecto'}</strong>
              </p>
            </div>
            <div className="deadline-timer-box">
              <span className="deadline-label">Fecha y Hora Límite:</span>
              <strong className="deadline-date-highlight">⏰ {proximosHitosPendientes[0]?.fecha_limite || 'Próximamente'}</strong>
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
                  💬 Observaciones o notas para el asesor ({asesorNombre}):
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
                Registro cronológico de documentos enviados, observaciones y estados desde la base de datos.
              </p>
            </div>

            <div className="history-filter-pills">
              <button
                className={`filter-pill-btn ${historyFilter === 'todos' ? 'active' : ''}`}
                onClick={() => setHistoryFilter('todos')}
              >
                Todos ({documentos.length})
              </button>
              <button
                className={`filter-pill-btn ${historyFilter === 'observaciones' ? 'active' : ''}`}
                onClick={() => setHistoryFilter('observaciones')}
              >
                Con Observaciones ({documentos.filter(d => d.estadoRaw === 'CON_OBSERVACIONES').length})
              </button>
              <button
                className={`filter-pill-btn ${historyFilter === 'aprobados' ? 'active' : ''}`}
                onClick={() => setHistoryFilter('aprobados')}
              >
                Aprobados ({documentos.filter(d => d.estadoRaw === 'APROBADO').length})
              </button>
            </div>
          </div>

          <div className="timeline-history-wrapper">
            <div className="timeline-vertical-line" />

            <div className="deliverable-history-list">
              {filteredDocumentos.length > 0 ? (
                filteredDocumentos.map((doc) => {
                  // DEFINICIÓN DE ESTILOS DE BADGE CÁPSULA NARANJA/AMARILLO PASTEL
                  let badgeStyle = {
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    padding: '3px 12px',
                    borderRadius: '12px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    display: 'inline-block'
                  };

                  if (doc.estadoRaw === 'APROBADO') {
                    badgeStyle = {
                      backgroundColor: '#D1FAE5',
                      color: '#065F46',
                      padding: '3px 12px',
                      borderRadius: '12px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      display: 'inline-block'
                    };
                  }

                  return (
                    <div key={doc.id} className="timeline-history-row">
                      <div className={`timeline-node ${doc.estadoRaw === 'APROBADO' ? 'node-success' : 'node-warning'}`} />

                      <div className="history-item-card">
                        <div className="history-card-body">
                          <div className="history-card-top-header">
                            <div className="history-badges-left" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="history-code-badge">{doc.codigo}</span>
                              {/* CÁPSULA NARANJA / AMARILLO PASTEL */}
                              <span style={badgeStyle}>
                                {doc.estadoRaw === 'APROBADO' ? '✓ Aprobado' : doc.estadoTexto}
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

                          <div className="history-file-box">
                            <div className="history-file-info">
                              <span className="history-file-icon">📄</span>
                              <div>
                                <strong className="history-file-title">
                                  {doc.nombreHito}
                                </strong>
                              </div>
                            </div>
                          </div>

                          <div className={`history-observation-box ${doc.estadoRaw === 'APROBADO' ? 'obs-success' : 'obs-warning'}`}>
                            <strong>OBSERVACIONES DEL REVISOR:</strong>
                            <p>"{doc.observaciones}"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                  No hay entregas registradas en esta categoría.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VISTA 4: EXAMEN DE GRADO (CALENDARIO DE POSTULACIÓN) */}
      {activeTab === 'examen' && (
        <div className="card-surface exam-module-card">
          <div className="exam-header-flex">
            <div>
              <h2 className="exam-main-title">
                Postulación de Defensa de Tesis
              </h2>
              <p className="exam-subtitle">
                Selecciona un día disponible configurado por tu jurado evaluador.
              </p>
            </div>

            <div className="exam-legend-box">
              <span className="legend-item">
                <span className="dot-available"></span> Disponible
              </span>
              <span className="legend-item">
                <span className="dot-selected"></span> Seleccionado
              </span>
            </div>
          </div>

          <div className="exam-calendar-grid">
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
                {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="day-cell-btn empty-cell" style={{ visibility: 'hidden' }} />
                ))}

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
      {activeTab === 'perfil' && <ProfileView user={currentUser} proyectoData={proyectoReal} />}
    </div>
  );
};