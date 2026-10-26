import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;