import React, { useState } from 'react';

function Registro() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
      <h2>Registro</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Contraseña" />
      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Registro;
