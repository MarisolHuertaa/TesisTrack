import React, { useState, useRef } from 'react';
import '../styles/Dashboards.css';

export const ProfileView = ({ user }) => {
  const fileInputRef = useRef(null);

  // Datos del perfil
  const [profileData, setProfileData] = useState({
    nombre: user?.nombre || 'Marisol Huerta',
    rol: user?.rol || 'ESTUDIANTE',
    carrera: 'Ingeniería en Informática',
    centro: 'Centro Universitario de Tlaquepaque (CUTlaquepaque)',
    codigo: '218765432',
    correo: 'marisol.huerta@alumnos.udg.mx',
    periodo: '2026-B',
    estatus: 'Activo (Fase 2 - Desarrollo de Tesis)',
    tituloProyecto: '"Plataforma Web para la Gestión de Tesis"',
    directorTesis: 'Mtra. Deborah Villaseñor',
    modalidad: 'Tesis Profesional',
    avatarUrl: null,
  });

  // Estados de Notificaciones / Switches
  const [notifCorreo, setNotifCorreo] = useState(true);
  const [alertasFase, setAlertasFase] = useState(true);
  const [recordatorioPrioritario, setRecordatorioPrioritario] = useState(true);

  // Manejador para cambiar la imagen de perfil
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData((prev) => ({ ...prev, avatarUrl: imageUrl }));
    }
  };

  const getInitials = (name) => {
    if (!name) return 'M';
    const parts = name.trim().split(' ');
    return parts[0][0].toUpperCase();
  };

  return (
    <div className="profile-view-container">
      {/* Input Oculto para Selección de Imagen de Perfil */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* TARJETA 1: ENCABEZADO DE PERFIL RESTRUCTURADO */}
      <div className="card-surface profile-header-card">
        <div className="profile-header-main-layout">
          {/* Avatar con Lápiz / Cambio de Foto */}
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

          {/* Información del Usuario */}
          <div className="profile-header-info">
            <div className="profile-title-role-row">
              <h2 className="profile-user-name">{profileData.nombre}</h2>
              {/* Badge de Rol a la derecha del Encabezado */}
              <span className="profile-role-pill-top">{profileData.rol}</span>
            </div>

            <p className="profile-sub-info">
              {profileData.carrera} — {profileData.centro}
            </p>

            {/* Pastilla de Estatus en Línea Independiente (Con Espaciado) */}
            <div className="profile-status-row">
              <span className="status-active-pill">
                🟢 <strong>Estatus:</strong> {profileData.estatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GRID DE 3 COLUMNAS: DATOS GENERALES | INFORMACIÓN ACADÉMICA | PROYECTO */}
      <div className="profile-grid-three-columns">
        {/* TARJETA 2: DATOS GENERALES */}
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

        {/* TARJETA 3: INFORMACIÓN ACADÉMICA */}
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

        {/* TARJETA 4: PROYECTO DE TITULACIÓN */}
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
            <label className="field-label-sm">DIRECTOR DE TESIS</label>
            <p className="field-value-bold">{profileData.directorTesis}</p>
          </div>
          <div className="profile-field-group">
            <label className="field-label-sm">MODALIDAD</label>
            <p className="field-value-bold">{profileData.modalidad}</p>
          </div>
        </div>
      </div>

      {/* TARJETA 5: PREFERENCIAS Y NOTIFICACIONES */}
      <div className="card-surface profile-section-card">
        <div className="section-title-with-icon">
          <span className="section-icon-symbol">⚙️</span>
          <h3>Preferencias y Notificaciones</h3>
        </div>

        <div className="switch-row">
          <div className="switch-text-content">
            <strong>Notificaciones por Correo Electrónico</strong>
            <p>Recibir avisos ante revisiones, comentarios de avances o retroalimentación del asesor.</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notifCorreo}
              onChange={() => setNotifCorreo(!notifCorreo)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="switch-row">
          <div className="switch-text-content">
            <strong>Alertas de Cambio de Fase</strong>
            <p>Notificar automáticamente cuando tu proceso de titulación avance a la siguiente etapa.</p>
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
            <p>Aviso preventivo antes de la fecha límite programada para la entrega de avances.</p>
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