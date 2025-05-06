import { BrowserRouter as Router, Routes, Route } from 'react-router';
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
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        </Router>
      </div>
      {/* Pie de página */}
    </div>
  );
}

export default App;
