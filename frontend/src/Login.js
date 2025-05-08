import React, { useState } from 'react';
import {useNavigate} from 'react-router';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mostrar, setMostrar] = useState(false);
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
    <div style={{
      width: '450px',
      height: '500px',
      backgroundColor: 'white',
      border: '8px solid black',
      borderRadius: '50px'}}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style = {{ marginTop: '50px'}} >
          <label>Correo:</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)} placeholder='Ingrese correo'
            required
          />
        </div>
        <div style = {{ marginTop: '60px'}}>
          <label>Contraseña:</label>
          <input
            type={mostrar ? 'text' : 'password'}
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)} placeholder='Ingrese contraseña'
            required
          />
        </div>
        <div>
          <label>
            <input
              type = "checkbox"
              checked ={mostrar}
              onChange ={() => setMostrar(!mostrar)}
            />Mostrar contraseña
          </label>
        </div>
        <button type="submit" style = {{ marginTop: '50px'}}>Iniciar sesión</button>

        
      <div className="registro-container" style={{ marginTop: '30px' }}>
        <p>¿No tienes una cuenta? 
          <button onClick={() => navigate('/Registro')} style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Registrarse aquí</button>
        </p>
      </div>
      </form>
    </div>
  );
}

export default Login;
