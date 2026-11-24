import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/auth/login', { correo, password });
      const user = res.data.usuario;

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      alert(`¡Bienvenido/a ${user.nombre}!`);

      // Redirección dinámica validando rol_id, nombre de rol o correo institucional
      const rolId = Number(user.rol_id);
      const rolNombre = String(user.rol || '').toUpperCase();

      if (rolId === 3 || rolNombre === 'COORDINADOR' || user.correo === 'coordinacion.titulacion@udg.mx') {
        navigate('/dashboard-coordinacion');
      } else if (rolId === 2 || rolNombre === 'DOCENTE') {
        navigate('/dashboard'); // Cambia a '/dashboard-docente' cuando integres el PR #10 de Laura
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Credenciales inválidas');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>TesisTrack</h1>
        <p>Gestión y Seguimiento de Titulación Universitaria</p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Correo Institucional</label>
          <input
            type="email"
            className="form-control"
            placeholder="ejemplo@alumnos.udg.mx"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Iniciar Sesión
        </button>
      </form>

      <div className="auth-footer">
        ¿Aún no tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </div>
    </div>
  );
}