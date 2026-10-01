import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    rol_id: '1' // Por defecto: 1 = Estudiante, 2 = Docente, 3 = Coordinador
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
      // Asegurar que rol_id se envíe como un número entero (number)
      const dataToSend = {
        ...formData,
        rol_id: parseInt(formData.rol_id, 10)
      };

      await API.post('/auth/register', dataToSend);
      alert('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrar el usuario');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Registro - TesisTrack</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '10px' }}>
          <label>Nombre:</label>
          <input type="text" name="nombre" onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Apellido:</label>
          <input type="text" name="apellido" onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Correo electrónico:</label>
          <input type="email" name="correo" onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Contraseña:</label>
          <input type="password" name="password" onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Rol:</label>
          <select name="rol_id" value={formData.rol_id} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }}>
            <option value="1">Estudiante</option>
            <option value="2">Docente</option>
            <option value="3">Coordinador</option>
          </select>
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
          Registrarse
        </button>
      </form>

      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  );
}