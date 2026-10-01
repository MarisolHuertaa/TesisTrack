import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    rol_id: '1',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const dataToSend = {
        ...formData,
        rol_id: parseInt(formData.rol_id, 10),
      };

      await API.post('/auth/register', dataToSend);
      alert('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrar el usuario');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Crear Cuenta</h1>
        <p>Únete a TesisTrack para Gestionar tu Proyecto</p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Nombre(s)</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            placeholder="Marisol"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Apellido(s)</label>
          <input
            type="text"
            name="apellido"
            className="form-control"
            placeholder="Huerta"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Correo Electrónico</label>
          <input
            type="email"
            name="correo"
            className="form-control"
            placeholder="ejemplo@alumnos.udg.mx"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="••••••••"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Rol en la Plataforma</label>
          <select
            name="rol_id"
            className="form-control"
            value={formData.rol_id}
            onChange={handleChange}
          >
            <option value="1">Estudiante</option>
            <option value="2">Docente / Asesor</option>
            <option value="3">Coordinador</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">
          Completar Registro
        </button>
      </form>

      <div className="auth-footer">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </div>
    </div>
  );
}