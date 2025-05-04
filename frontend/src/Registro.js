import React, { useState } from 'react';

function Registro({ volverAlLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const manejarRegistro = async (e) => {
    e.preventDefault();
    const respuesta = await fetch('http://localhost:3001/api/register', {
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
      <button
        type="button"
        onClick={volverAlLogin}
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
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Ingrese correo" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Ingrese contraseña" />
      <input value={password2} onChange={(e) => setPassword2(e.target.value)} type="password" placeholder="Confirmar contraseña" />
      <button type="submit">Registrarse</button>
    </form>
  );
}


export default Registro;
