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

 
  const isDocente = user.rol?.toUpperCase() === 'DOCENTE' || user.rol?.toUpperCase() === 'ASESOR';

  // Detectamos si el usuario es Coordinador (por rol_id o por texto del rol)
  const isCoordinador =
    Number(user.rol_id) === 3 ||
    (user.rol && user.rol.toLowerCase().includes('coordinador'));
 

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

    if (setActiveTab) setActiveTab(tabId);

    if (setActiveTab) {
      setActiveTab(tabId);
    }

    setDrawerOpen(false);
  };

  return (
    <>
      <nav className="navbar-container">

        <div
          className="navbar-brand-group"
          style={{ cursor: 'pointer' }}
          onClick={() => handleSelectTab('inicio')}
        >

        {/* Brand: TesisTrack */}
        <div className="navbar-brand-group">

          <h2 className="navbar-title">TesisTrack</h2>
          <span className="navbar-subtitle">Sistema de Gestión de Titulación</span>
        </div>

        <div className="navbar-right">

          {/* Campanita de Notificaciones Original */}
          <NotificationsDropdown onNavigateTab={(tab) => setActiveTab && setActiveTab(tab)} />

          <NotificationsDropdown
            notificaciones={notificaciones}
            onNavigateTab={(tab) => setActiveTab && setActiveTab(tab)}
          />


          {/* Menú desplegable en el nombre del profesor */}
          <button className="user-menu-trigger" onClick={() => setDrawerOpen(true)}>
            <div className="avatar-circle">{getInitials(user.nombre)}</div>
            <span className="user-name">{user.nombre}</span>
            <span className="dropdown-arrow">▼</span>
          </button>
        </div>
      </nav>

      {/* Overlay Oscuro */}
      {drawerOpen && <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />}


      {/* Menú Lateral Vertical */}
      <div className={`side-drawer ${drawerOpen ? 'open' : ''}`}>
        <div>
          <div className="drawer-header">
            <div className="drawer-user-info">
              <div className="avatar-circle-large">{getInitials(user.nombre)}</div>
              <div>
                <h3>{user.nombre}</h3>
                <span className="text-muted-sm">{user.rol || 'Estudiante'}</span>
              </div>

      {/* Menú Lateral Vertical (Drawer) */}
      <div className={`side-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-user-info">
            <div className="avatar-circle-large">{getInitials(user.nombre)}</div>
            <div>
              <h3>{user.nombre}</h3>
              <span className="text-muted-sm">
                {isCoordinador ? 'COORDINADOR' : user.rol || 'Estudiante'}
              </span>

            </div>
            <button className="close-drawer-btn" onClick={() => setDrawerOpen(false)}>
              ✕
            </button>
          </div>


          <div className="drawer-menu-items">
            {isDocente ? (
              <>
                <button
                  className={`drawer-item ${activeTab === 'inicio' ? 'active' : ''}`}
                  onClick={() => handleSelectTab('inicio')}
                >
                  <span>🏠</span> <strong>Panel Principal</strong>
                </button>
                <button
                  className={`drawer-item ${activeTab === 'agenda' ? 'active' : ''}`}
                  onClick={() => handleSelectTab('agenda')}
                >
                  <span>📅</span> <strong>Agenda de Defensas</strong>
                </button>
                <button
                  className={`drawer-item ${activeTab === 'lecturas' ? 'active' : ''}`}
                  onClick={() => handleSelectTab('lecturas')}
                >
                  <span>📖</span> <strong>Control de Lectura</strong>
                </button>
                <button
                  className={`drawer-item ${activeTab === 'directorio' ? 'active' : ''}`}
                  onClick={() => handleSelectTab('directorio')}
                >
                  <span>👥</span> <strong>Directorio de Asesorados</strong>
                </button>
                <button
                  className={`drawer-item ${activeTab === 'rubricas' ? 'active' : ''}`}
                  onClick={() => handleSelectTab('rubricas')}
                >
                  <span>📋</span> <strong>Rúbricas de Evaluación</strong>
                </button>
                <button
                  className={`drawer-item ${activeTab === 'historial' ? 'active' : ''}`}
                  onClick={() => handleSelectTab('historial')}
                >
                  <span>📝</span> <strong>Historial de Retroalimentación</strong>
                </button>
                <button
                  className={`drawer-item ${activeTab === 'perfil' ? 'active' : ''}`}
                  onClick={() => handleSelectTab('perfil')}
                >
                  <span>👤</span> <strong>Mi Perfil</strong>
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

        <div className="drawer-menu-items">
          {isCoordinador ? (
            /* MENÚ EXCLUSIVO DE COORDINACIÓN */
            <>
              <button
                className={`drawer-item ${activeTab === 'inicio' || activeTab === 'directorio' ? 'active' : ''}`}
                onClick={() => handleSelectTab('directorio')}
              >
                <span>📊</span> <strong>Panel de Coordinación</strong>
              </button>
              <button
                className={`drawer-item ${activeTab === 'asignacion' ? 'active' : ''}`}
                onClick={() => handleSelectTab('asignacion')}
              >
                <span>👨‍🏫</span> <strong>Asignación de Asesores</strong>
              </button>
              <button
                className={`drawer-item ${activeTab === 'semaforo' ? 'active' : ''}`}
                onClick={() => handleSelectTab('semaforo')}
              >
                <span>🚦</span> <strong>Semáforo de Atrasos</strong>
              </button>
              <button
                className={`drawer-item ${activeTab === 'actas' ? 'active' : ''}`}
                onClick={() => handleSelectTab('actas')}
              >
                <span>📜</span> <strong>Emisión de Actas QR</strong>
              </button>
              <button
                className={`drawer-item ${activeTab === 'perfil' ? 'active' : ''}`}
                onClick={() => handleSelectTab('perfil')}
              >
                <span>👤</span> <strong>Mi Perfil</strong>
              </button>
            </>
          ) : (
            /* MENÚ ORIGINAL DE ESTUDIANTE */
            <>
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
            </>
          )}

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