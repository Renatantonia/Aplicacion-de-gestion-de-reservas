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
import HistorialAdmin from './HistorialAdmin';
import EquipamentoAdmin from './EquipamentoAdmin';
import AnadirCancha from './AnadirCancha';
import AnadirEquipamiento from './AnadirEquipamiento';
import ListarEquipamiento from './ListarEquipamiento';
import './App.css';
import AnadirSaldo from './AnadirSaldo';

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
            <Route path="/Admin/EditarReservas" element={<EditarReservas />} />
            <Route path="/Admin/Historial" element={<HistorialAdmin />} />
            <Route path="/Admin/Equipamiento" element={<EquipamentoAdmin/>} />
            <Route path="/Admin/Equipamiento/AnadirCancha" element={<AnadirCancha />} />
            <Route path="/Admin/Equipamiento/AnadirEquipamiento" element={<AnadirEquipamiento />} />
            <Route path="//Admin/Equipamiento/ListarEquipamiento" element={<ListarEquipamiento />} />
            <Route path="/VerHistorial" element={<VerHistorial />} />
            <Route path="/ReservasGenerales" element={<ReservasGenerales/>} />
            <Route path="/VerHistorialReservas" element={<VerHistorialReservas/>} />
            <Route path="/InicioUsuario" element={<InicioUsuario/>} />
            <Route path="/HacerReserva" element={<HacerReserva/>} />
            <Route path="/ReservaExitosa" element={<ReservaExitosa />} />
            <Route path="/mis-reservas" element={<VerMisReservas />} />
            <Route path="/editar-reserva/:id" element={<EditarReserva />} />
            <Route path="/AnadirSaldo" element={<AnadirSaldo/>} /> 
          </Routes>
        </Router>
      </div>
      {/* Pie de página */}
    </div>
  );
}

export default App;
