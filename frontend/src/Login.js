import React, { useState } from 'react';
import {useNavigate} from 'react-router';
import Registro from './Registro.js';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulación de login (no real)
    if (correo === 'admin@admin.com' && contraseña === '1234') {
      alert('¡Inicio de sesión exitoso!');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Correo:</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)} placeholder='Ingrese correo'
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)} placeholder='Ingrese contraseña'
            required
          />
        </div>
        <button type="submit">Iniciar sesión</button>

        
      <div className="registro-container">
        <p>¿No tienes una cuenta? 
          <button onClick={() => navigate('/Registro')} style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Registrarse aquí</button>
        </p>
      </div>
      </form>
    </div>
  );
}

export default Login;
