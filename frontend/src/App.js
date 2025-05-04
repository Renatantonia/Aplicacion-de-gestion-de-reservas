import React, { useState } from 'react';
import Login from './Login';
import Registro from './Registro';
import './App.css';

function Titulo() {
  return (
    <div className="titulo-container">
      <h1 className="titulo">Canchas UCENIN</h1>
    </div>
  );
}

function App() {
  const [mostrarLogin, setMostrarLogin] = useState(true);

  return (
    <div className="App">
      {/* Título centrado y pegado arriba */}
      <Titulo/>
      
      
      {/* Botones centrados 
      
      <div className="botones-container">
        <button onClick={() => setMostrarLogin(true)}>Iniciar sesión</button>
        <button onClick={() => setMostrarLogin(false)}>Registrarse</button>
      </div>
      */}
      {/* Mostrar el formulario dependiendo de la opción */}
      <div className="formulario-container" style={{ marginTop: '20px' }}>
      {mostrarLogin ? <Login /> : <Registro volverAlLogin={() => setMostrarLogin(true)} />}

      </div>

      {/* Pie de página */}
      <div className="p-container">
        <p>¿No tienes una cuenta? 
          <button onClick={() => setMostrarLogin(false)} style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Registrarse aquí</button>
        </p>
      </div>
    </div>
  );
}

export default App;
