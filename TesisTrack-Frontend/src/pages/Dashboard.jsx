import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { StudentDashboard } from '../components/dashboards/StudentDashboard';
import { TeacherDashboard } from '../components/dashboards/TeacherDashboard';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';

export const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('inicio');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const renderDashboardByRole = () => {
    const role = user?.rol?.toLowerCase() || 'estudiante';

    switch (role) {
      case 'docente':
      case 'revisor':
        return <TeacherDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'admin':
      case 'coordinador':
        return <AdminDashboard user={user} activeTab={activeTab} />;
      case 'estudiante':
      default:
        return <StudentDashboard user={user} activeTab={activeTab} />;
    }
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ width: '100%', padding: '32px 24px', boxSizing: 'border-box' }}>
        {renderDashboardByRole()}
      </main>
    </div>
  );
};