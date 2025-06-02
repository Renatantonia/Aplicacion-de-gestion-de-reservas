import React from 'react';
import { useNavigate } from 'react-router-dom';

function InicioAdmin() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Has ingresado como administrador!</h1>
      <p>Selecciona una opción:</p>

      <button onClick={() => navigate('/Admin/EditarReservas')} style={estiloBoton}>
        Editar Reservas
      </button>

      <button onClick={() => navigate('/Admin/Historial')} style={estiloBoton}>
        Ver Historial
      </button>

      <button onClick={() => navigate('/Admin/Equipamiento')} style={estiloBoton}>
        Equipamiento y Canchas
      </button>

      <button
        onClick={() => {
          localStorage.clear();
          navigate('/');
        }}
        style={estiloBoton}
      >
        Cerrar sesión
      </button>
    </div>
  );
}

const estiloBoton = {
  margin: '10px',
  padding: '50px 60px',
  fontSize: '16px'
};

export default InicioAdmin;

