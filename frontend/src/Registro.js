import React, { useState } from 'react';
import {useNavigate} from 'react-router';

function Registro() {
  const [correo, setCorreo] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const navigate = useNavigate();

  const manejarRegistro = async (e) => {
    e.preventDefault();
    const respuesta = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await respuesta.json();
    alert(data.message);
  };

  return (
    <form onSubmit={manejarRegistro}>
      {/* Botón flecha para volver */}
      <div style={{
      width: '450px',
      height: '500px',
      backgroundColor: 'white',
      border: '8px solid black',
      borderRadius: '50px'}}>  
        <button
          type="button"
          onClick={ () => navigate(-1)}
          style={{
            fontSize: '16px',
            padding: '8px 16px',
            backgroundColor: '#008cba',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          ← Volver
        </button>


          <h2>Registro</h2>
          <div style={{marginTop: '40px'}}><input value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Ingrese correo" /></div>
          <div style={{marginTop: '40px'}}><input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Ingrese nombre de usuario" /></div>
          <div style={{marginTop: '40px'}}><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Ingrese contraseña" /></div>
          <div style={{marginTop: '40px'}}><input value={password2} onChange={(e) => setPassword2(e.target.value)} type="password" placeholder="Confirmar contraseña" /></div>
          <div style={{marginTop: '40px'}}/><button type="submit">Registrarse</button>
      </div>
    </form>
  );
}


export default Registro;
