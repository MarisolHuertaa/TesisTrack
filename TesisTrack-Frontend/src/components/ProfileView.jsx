import React, { useState, useRef, useEffect } from 'react';
import '../styles/Dashboards.css';

export const ProfileView = ({ user, proyectoData }) => {
  const fileInputRef = useRef(null);

  const storedUser = user || JSON.parse(localStorage.getItem('user')) || {};

  const nombreCompleto = storedUser.nombre
    ? `${storedUser.nombre} ${storedUser.apellido || ''}`.trim()
    : 'Usuario Registrado';

  const correoUsuario = storedUser.correo || storedUser.email || 'correo@alumnos.udg.mx';
  const rolUsuario = storedUser.rol || (storedUser.rol_id === 1 ? 'ESTUDIANTE' : storedUser.rol_id === 2 ? 'DOCENTE' : 'COORDINACIÓN');
  
  // Usar el código asignado en la BD o en la respuesta del backend
  const codigoMatricula = storedUser.codigo || proyectoData?.proyecto?.estudiante_codigo || `218${storedUser.id || 1}95432`;

  const tituloProyecto = proyectoData?.titulo || proyectoData?.proyecto?.titulo || 'Proyecto en Proceso de Titulación';
  const faseActual = proyectoData?.fase_actual_id || proyectoData?.proyecto?.fase_actual_id || 1;
  const porcentajeAvance = proyectoData?.porcentaje_avance || proyectoData?.proyecto?.porcentaje_avance || 0;

  // Asesor asignado devuelto por la base de datos
  const directorTesis = proyectoData?.asesor || proyectoData?.proyecto?.asesor || 'Mtra. Deborah Villaseñor';

  const [profileData, setProfileData] = useState({
    nombre: nombreCompleto,
    rol: rolUsuario,
    carrera: 'Ingeniería en Informática',
    centro: 'Centro Universitario de Tlaquepaque (CUTlaquepaque)',
    codigo: codigoMatricula,
    correo: correoUsuario,
    periodo: '2026-B',
    estatus: `Activo (Fase ${faseActual} - ${porcentajeAvance}% de Avance)`,
    tituloProyecto: `"${tituloProyecto}"`,
    directorTesis: directorTesis,
    modalidad: 'Tesis Profesional',
    avatarUrl: null,
  });

  useEffect(() => {
    setProfileData((prev) => ({
      ...prev,
      nombre: nombreCompleto,
      rol: rolUsuario,
      correo: correoUsuario,
      codigo: codigoMatricula,
      estatus: `Activo (Fase ${faseActual} - ${porcentajeAvance}% de Avance)`,
      tituloProyecto: `"${tituloProyecto}"`,
      directorTesis: directorTesis,
    }));
  }, [user, proyectoData, directorTesis, codigoMatricula]);

  const [alertasFase, setAlertasFase] = useState(true);
  const [recordatorioPrioritario, setRecordatorioPrioritario] = useState(true);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData((prev) => ({ ...prev, avatarUrl: imageUrl }));
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    return parts[0][0].toUpperCase();
  };

  return (
    <div className="profile-view-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div className="card-surface profile-header-card">
        <div className="profile-header-main-layout">
          <div className="profile-avatar-wrapper" onClick={() => fileInputRef.current.click()}>
            {profileData.avatarUrl ? (
              <img src={profileData.avatarUrl} alt="Avatar" className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-circle">
                {getInitials(profileData.nombre)}
              </div>
            )}
            <div className="avatar-edit-badge" title="Cambiar foto de perfil">
              ✏️
            </div>
          </div>

          <div className="profile-header-info">
            <div className="profile-title-role-row">
              <h2 className="profile-user-name">{profileData.nombre}</h2>
              <span className="profile-role-pill-top">{profileData.rol}</span>
            </div>

            <p className="profile-sub-info">
              {profileData.carrera} — {profileData.centro}
            </p>

            <div className="profile-status-row">
              <span className="status-active-pill">
                🟢 <strong>Estatus:</strong> {profileData.estatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-grid-three-columns">
        <div className="card-surface profile-section-card">
          <div className="section-title-with-icon">
            <span className="section-icon-symbol">👤</span>
            <h3>Datos Generales</h3>
          </div>
          <div className="profile-field-group">
            <label className="field-label-sm">NOMBRE COMPLETO</label>
            <p className="field-value-bold">{profileData.nombre}</p>
          </div>
          <div className="profile-field-group">
            <label className="field-label-sm">CÓDIGO / MATRÍCULA</label>
            <div className="code-pill-box">{profileData.codigo}</div>
          </div>
          <div className="profile-field-group">
            <label className="field-label-sm">CORREO INSTITUCIONAL</label>
            <p className="field-value-bold email-link">{profileData.correo}</p>
          </div>
        </div>

        <div className="card-surface profile-section-card">
          <div className="section-title-with-icon">
            <span className="section-icon-symbol">🎓</span>
            <h3>Información Académica</h3>
          </div>
          <div className="profile-field-group">
            <label className="field-label-sm">PROGRAMA EDUCATIVO</label>
            <p className="field-value-bold">{profileData.carrera}</p>
          </div>
          <div className="profile-field-group">
            <label className="field-label-sm">CENTRO UNIVERSITARIO</label>
            <p className="field-value-bold">CUTlaquepaque</p>
          </div>
          <div className="profile-field-group">
            <label className="field-label-sm">PERIODO ACTIVO</label>
            <p className="field-value-bold highlight-period">{profileData.periodo}</p>
          </div>
        </div>

        <div className="card-surface profile-section-card">
          <div className="section-title-with-icon">
            <span className="section-icon-symbol">📖</span>
            <h3>Proyecto de Titulación</h3>
          </div>
          <div className="profile-field-group">
            <label className="field-label-sm">TÍTULO REGISTRADO</label>
            <p className="field-value-bold">{profileData.tituloProyecto}</p>
          </div>
          <div className="profile-field-group">
            <label className="field-label-sm">DIRECTOR DE TESIS / ASESOR</label>
            <p className="field-value-bold">{profileData.directorTesis}</p>
          </div>
          <div className="profile-field-group">
            <label className="field-label-sm">MODALIDAD</label>
            <p className="field-value-bold">{profileData.modalidad}</p>
          </div>
        </div>
      </div>

      <div className="card-surface profile-section-card">
        <div className="section-title-with-icon">
          <span className="section-icon-symbol">⚙️</span>
          <h3>Preferencias y Notificaciones</h3>
        </div>

        <div className="switch-row">
          <div className="switch-text-content">
            <strong>Alertas de Cambio de Fase</strong>
            <p>Notificar automáticamente en el sistema cuando tu proceso de titulación avance a la siguiente etapa.</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={alertasFase}
              onChange={() => setAlertasFase(!alertasFase)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="switch-row">
          <div className="switch-text-content">
            <strong>Recordatorio Prioritario de Entregables (24h antes)</strong>
            <p>Aviso preventivo en la campanita de notificaciones antes de la fecha límite programada.</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={recordatorioPrioritario}
              onChange={() => setRecordatorioPrioritario(!recordatorioPrioritario)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};