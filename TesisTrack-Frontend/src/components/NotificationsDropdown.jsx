import React, { useState, useRef, useEffect } from 'react';
import '../styles/Dashboards.css';

export const NotificationsDropdown = ({ onNavigateTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState('todas');
  const dropdownRef = useRef(null);

  // Lista de notificaciones con estado de lectura
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      tipo: 'warning',
      icono: '⚠️',
      titulo: 'Observaciones en Capítulo 2',
      descripcion: 'Mtr. Deborah Villaseñor dejó 1 comentario en tu entrega.',
      tiempo: '15 min',
      leida: false,
      actionText: 'Ver Observaciones →',
      targetTab: 'entregas',
    },
    {
      id: 2,
      tipo: 'success',
      icono: '✅',
      titulo: 'Fecha Examen Confirmada',
      descripcion: 'Defensa agendada para el 10 de Octubre a las 10:00 AM.',
      tiempo: '2 hrs',
      leida: false,
      actionText: 'Ver Calendario →',
      targetTab: 'examen',
    },
    {
      id: 3,
      tipo: 'info',
      icono: '⏰',
      titulo: 'Entrega Próxima (48h)',
      descripcion: 'Recuerda subir el Borrador Final antes del viernes.',
      tiempo: 'Ayer',
      leida: false,
      actionText: 'Subir Avance →',
      targetTab: 'subir',
    },
    {
      id: 4,
      tipo: 'info',
      icono: '📄',
      titulo: 'Nuevo Formato APA 7 Disponible',
      descripcion: 'El coordinador ha actualizado la plantilla oficial de la tesis.',
      tiempo: '3 días',
      leida: true,
      actionText: 'Ver Documentos →',
      targetTab: 'inicio',
    },
  ]);

  // Contadores
  const unreadCount = notifications.filter((n) => !n.leida).length;

  // Filtrado
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'no_leidas') return !n.leida;
    return true;
  });

  // Notificaciones visibles (3 por defecto, o todas si se expande)
  const displayedNotifications = isExpanded
    ? filteredNotifications
    : filteredNotifications.slice(0, 3);

  // Marcar todas como leídas
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  // Acción al hacer clic en una notificación
  const handleActionClick = (targetTab, id) => {
    // Marcar esta notificación como leída
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
    if (onNavigateTab) onNavigateTab(targetTab);
    setIsOpen(false);
  };

  // Cerrar al hacer clic fuera del desplegable
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="notif-wrapper-container" ref={dropdownRef}>
      {/* Botón de la Campanita con Badge en el Topbar */}
      <button
        className={`notif-bell-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Notificaciones"
      >
        🔔
        {unreadCount > 0 && <span className="notif-badge-count">{unreadCount}</span>}
      </button>

      {/* Menú Desplegable (Dropdown Modal) */}
      {isOpen && (
        <div className={`notif-dropdown-card ${isExpanded ? 'expanded-mode' : ''}`}>
          {/* Encabezado Principal */}
          <div className="notif-header-row">
            <div className="notif-title-group">
              <h3 className="notif-header-title">Notificaciones</h3>
              {unreadCount > 0 && (
                <span className="notif-unread-pill">{unreadCount} nuevas</span>
              )}
            </div>
            <button className="notif-mark-read-btn" onClick={handleMarkAllRead}>
              Marcar leídas
            </button>
          </div>

          {/* Submenú de Filtros */}
          <div className="notif-tabs-bar">
            <button
              className={`notif-tab-item ${activeFilter === 'todas' ? 'active' : ''}`}
              onClick={() => setActiveFilter('todas')}
            >
              Todas ({notifications.length})
            </button>
            <button
              className={`notif-tab-item ${activeFilter === 'no_leidas' ? 'active' : ''}`}
              onClick={() => setActiveFilter('no_leidas')}
            >
              No leídas ({unreadCount})
            </button>
          </div>

          {/* Lista de Notificaciones */}
          <div className="notif-items-scroll-list">
            {displayedNotifications.length > 0 ? (
              displayedNotifications.map((item) => (
                <div
                  key={item.id}
                  className={`notif-item-card ${!item.leida ? 'unread' : ''}`}
                >
                  <div className={`notif-icon-box ${item.tipo}`}>
                    {item.icono}
                  </div>

                  <div className="notif-content-body">
                    <div className="notif-item-top">
                      <strong className="notif-item-title">{item.titulo}</strong>
                      <span className="notif-item-time">{item.tiempo}</span>
                    </div>
                    <p className="notif-item-desc">{item.descripcion}</p>

                    {item.actionText && (
                      <button
                        className="notif-action-link"
                        onClick={() => handleActionClick(item.targetTab, item.id)}
                      >
                        {item.actionText}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="notif-empty-state">
                No tienes notificaciones en esta categoría.
              </div>
            )}
          </div>

          {/* Pie de Página: Expandir / Reducir */}
          <div className="notif-footer-bar">
            <button
              className="notif-view-all-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded
                ? 'Mostrar menos notificaciones'
                : 'Ver todo el historial de notificaciones'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};