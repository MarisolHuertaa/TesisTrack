import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationsDropdown } from './NotificationsDropdown';

export const Navbar = ({ activeTab, setActiveTab, notificaciones = [] }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || {
    nombre: 'Laura Paola',
    rol: 'Estudiante',
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    return parts[0][0].toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setDrawerOpen(false);
  };

  return (
    <>
      <nav className="navbar-container">
        {/* Brand: TesisTrack con ESTUDIANTE al lado */}
        <div className="navbar-brand-group">
          <h2 className="navbar-title">TesisTrack</h2>
          <span className="navbar-subtitle">Sistema de Gestión de Titulación</span>
        </div>

        {/* Sección Derecha: Campanita de Notificaciones + Botón de Perfil */}
        <div className="navbar-right">
          {/* Menú Desplegable de Notificaciones conectadas a MariaDB */}
          <NotificationsDropdown 
            notificaciones={notificaciones} 
            onNavigateTab={(tab) => setActiveTab(tab)} 
          />

          {/* Botón de Perfil / Drawer Trigger */}
          <button className="user-menu-trigger" onClick={() => setDrawerOpen(true)}>
            <div className="avatar-circle">{getInitials(user.nombre)}</div>
            <span className="user-name">{user.nombre}</span>
            <span className="dropdown-arrow">▼</span>
          </button>
        </div>
      </nav>

      {/* Overlay Oscuro */}
      {drawerOpen && <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />}

      {/* Menú Lateral Vertical (Drawer de pantalla completa de alto) */}
      <div className={`side-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-user-info">
            <div className="avatar-circle-large">{getInitials(user.nombre)}</div>
            <div>
              <h3>{user.nombre}</h3>
              <span className="text-muted-sm">{user.rol || 'Estudiante'}</span>
            </div>
          </div>
          <button className="close-drawer-btn" onClick={() => setDrawerOpen(false)}>
            ✕
          </button>
        </div>

        <div className="drawer-menu-items">
          <button
            className={`drawer-item ${activeTab === 'inicio' ? 'active' : ''}`}
            onClick={() => handleSelectTab('inicio')}
          >
            <span>🏠</span> <strong>Inicio / Mi Proceso</strong>
          </button>
          <button
            className={`drawer-item ${activeTab === 'subir' ? 'active' : ''}`}
            onClick={() => handleSelectTab('subir')}
          >
            <span>📤</span> <strong>Subir Avance</strong>
          </button>
          <button
            className={`drawer-item ${activeTab === 'entregas' ? 'active' : ''}`}
            onClick={() => handleSelectTab('entregas')}
          >
            <span>📋</span> <strong>Mis Entregas</strong>
          </button>
          <button
            className={`drawer-item ${activeTab === 'examen' ? 'active' : ''}`}
            onClick={() => handleSelectTab('examen')}
          >
            <span>📅</span> <strong>Calendario de Postulación</strong>
          </button>
          <button
            className={`drawer-item ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => handleSelectTab('perfil')}
          >
            <span>👤</span> <strong>Mi Perfil</strong>
          </button>
        </div>

        <div className="drawer-footer">
          <button className="drawer-item logout-btn" onClick={handleLogout}>
            <strong>Cerrar Sesión</strong>
          </button>
        </div>
      </div>
    </>
  );
};