import React, { useState, useRef, useEffect } from 'react';
import '../styles/Dashboards.css';

export const NotificationsDropdown = ({ notificaciones = [], unreadCount: unreadCountProp, onNavigateTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState('todas');
  const dropdownRef = useRef(null);

  // Mapear los datos que vienen de MariaDB
  const [notifications, setNotifications] = useState([]);

  // Transformar el formato de la BD al formato visual del Dropdown
  const mapNotificaciones = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    return data.map((n) => {
      let tipo = 'info';
      let icono = '🔔';
      let titulo = 'Notificación';
      let actionText = 'Ver Detalle →';
      let targetTab = 'inicio';

      const tipoUpper = (n.tipo || '').toUpperCase();

      if (tipoUpper === 'ENTREGA') {
        tipo = 'warning';
        icono = '📄';
        titulo = 'Actualización de Entrega';
        actionText = 'Ver Entregas →';
        targetTab = 'entregas';
      } else if (tipoUpper === 'DICTAMEN') {
        tipo = 'success';
        icono = '📋';
        titulo = 'Dictamen Registrado';
        actionText = 'Ver Historial →';
        targetTab = 'entregas';
      } else if (tipoUpper === 'EXAMEN') {
        tipo = 'success';
        icono = '🎓';
        titulo = 'Examen de Grado';
        actionText = 'Ver Calendario →';
        targetTab = 'examen';
      } else if (tipoUpper === 'GENERAL') {
        tipo = 'info';
        icono = '💡';
        titulo = 'Aviso General';
        actionText = 'Ir a Inicio →';
        targetTab = 'inicio';
      }

      // Formateador de fecha
      const fechaRaw = n.fecha_creacion || n.fecha;
      const fechaObj = fechaRaw ? new Date(fechaRaw) : new Date();
      const tiempoStr = isNaN(fechaObj.getTime())
        ? 'Reciente'
        : fechaObj.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });

      return {
        id: n.id || n.id_notificacion,
        tipo,
        icono,
        titulo,
        descripcion: n.mensaje || n.contenido || 'Sin detalle',
        tiempo: tiempoStr,
        leida: Boolean(n.leido || n.leida),
        actionText,
        targetTab,
      };
    });
  };

  // Cargar notificaciones desde props o hacer petición directa a la API si vienen vacías
  useEffect(() => {
    const fetchNotificacionesDirectas = async () => {
      // Si recibimos notificaciones desde props, las usamos directamente
      if (notificaciones && notificaciones.length > 0) {
        setNotifications(mapNotificaciones(notificaciones));
        return;
      }

      // Si vienen vacías, consultamos directo con fetch
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('http://localhost:5000/api/proyectos/mi-proyecto', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.notificaciones) {
            setNotifications(mapNotificaciones(data.notificaciones));
          }
        }
      } catch (err) {
        console.error('Error al obtener notificaciones:', err);
      }
    };

    fetchNotificacionesDirectas();
  }, [notificaciones]);

  // Contadores dinámicos derivados del estado local o de props
  const calculatedUnread = notifications.filter((n) => !n.leida).length;
  const unreadCount = unreadCountProp !== undefined ? unreadCountProp : calculatedUnread;

  // Filtrado
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'no_leidas') return !n.leida;
    return true;
  });

  // Notificaciones visibles
  const displayedNotifications = isExpanded
    ? filteredNotifications
    : filteredNotifications.slice(0, 3);

  // Marcar todas como leídas
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  // Acción al hacer clic en una notificación
  const handleActionClick = (targetTab, id) => {
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
        style={{ position: 'relative' }}
      >
        🔔
        {unreadCount > 0 && (
          <span 
            className="notif-badge-count"
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '0.72rem',
              fontWeight: 'bold',
              lineHeight: 1
            }}
          >
            {unreadCount}
          </span>
        )}
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