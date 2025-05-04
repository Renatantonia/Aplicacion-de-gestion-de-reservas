import React, { useState } from 'react';
import Login from './Login';
import Registro from './Registro';
import './App.css';

function App() {
  const [mostrarLogin, setMostrarLogin] = useState(true);

  return (
    <div>
      <h1 className = "titulo" > Reserva de canchas de Padel Ucenin</h1>
      <div>
        <button onClick={() => setMostrarLogin(true)}>Iniciar sesión</button>
        <button onClick={() => setMostrarLogin(false)}>Registrarse</button>
      </div>
      <div style={{ marginTop: '20px' }}>
        {mostrarLogin ? <Login /> : <Registro />}
      </div>
    </div>
  );
}

export default App;
