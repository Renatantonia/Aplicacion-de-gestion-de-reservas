import React, { useState } from 'react';
import Login from './Login';
import Registro from './Registro';

function App() {
  const [mostrarLogin, setMostrarLogin] = useState(true);

  return (
    <div>
      <h1>Mi App de Reservas</h1>
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
