import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { StudentDashboard } from '../components/dashboards/StudentDashboard';
import { TeacherDashboard } from '../components/dashboards/TeacherDashboard';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';

export const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('inicio');
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Consulta de notificaciones reales enviadas por MariaDB
    const fetchDatosConNotificaciones = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:5000/api/proyectos/mi-proyecto', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data && res.data.notificaciones) {
          setNotificaciones(res.data.notificaciones);
        }
      } catch (err) {
        console.error('Error al obtener notificaciones para el Navbar:', err);
      }
    };

    fetchDatosConNotificaciones();
  }, []);

  const renderDashboardByRole = () => {
    const role = user?.rol?.toLowerCase() || 'estudiante';

    switch (role) {
      case 'docente':
      case 'revisor':
        return <TeacherDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'admin':
      case 'coordinador':
        return <AdminDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'estudiante':
      default:
        // SE AGREGA setActiveTab AQUÍ PARA CONTROLAR LA REDIRECCIÓN NATIVA
        return <StudentDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} notificaciones={notificaciones} />
      <main style={{ width: '100%', padding: '32px 24px', boxSizing: 'border-box' }}>
        {renderDashboardByRole()}
      </main>
    </div>
  );
};