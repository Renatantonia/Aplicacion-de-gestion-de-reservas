import React, { useState } from 'react';
import {useNavigate} from 'react-router';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const respuesta = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contraseña }),
    });

    const data = await respuesta.json();

    if (respuesta.ok) {
      alert(`¡Bienvenido, ${data.usuario.nombre}!`);
      // Aquí podrías navegar o guardar sesión simulada
    } else {
      alert(data.message || 'Error en el login');
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
