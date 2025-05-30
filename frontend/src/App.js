import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Login from './Login';
import Registro from './Registro';
import InicioAdmin from './InicioAdmin';
import EditarReservas from './EditarReservas';
import VerHistorial from './VerHistorial';
import ReservasGenerales from './ReservasGenerales';
import VerHistorialReservas from './VerHistorialReservas';
import InicioUsuario from './InicioUsuario';
import HacerReserva from './HacerReserva';
import ReservaExitosa from './ReservaExitosa';
import VerMisReservas from './VerMisReservas';
import EditarReserva from './EditarReserva';
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
            <Route path="/InicioAdmin" element={<InicioAdmin />} />
            <Route path="/VerReservas" element={<EditarReservas />} />
            <Route path="/VerHistorial" element={<VerHistorial />} />
            <Route path="/ReservasGenerales" element={<ReservasGenerales/>} />
            <Route path="/VerHistorialReservas" element={<VerHistorialReservas/>} />
            <Route path="/InicioUsuario" element={<InicioUsuario/>} />
            <Route path="/HacerReserva" element={<HacerReserva/>} />
            <Route path="/ReservaExitosa" element={<ReservaExitosa />} />
            <Route path="/mis-reservas" element={<VerMisReservas />} />
            <Route path="/editar-reserva/:id" element={<EditarReserva />} />
          </Routes>
        </Router>
      </div>
      {/* Pie de página */}
    </div>
  );
}

export default App;
