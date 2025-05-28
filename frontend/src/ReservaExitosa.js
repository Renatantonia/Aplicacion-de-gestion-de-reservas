import React from 'react';
import { useNavigate } from 'react-router-dom';

function ReservaExitosa() {
  const navigate = useNavigate();

  return (
    <div style={{
      textAlign: 'center',
      marginTop: '100px'
    }}>
      <h2 style={{ color: 'green' }}>✅ ¡Reserva registrada con éxito!</h2>
      <p>Gracias por usar el sistema de reservas de UCENIN.</p>

      <button onClick={() => navigate('/InicioUsuario')}>
        Volver al inicio
      </button>
    </div>
  );
}

export default ReservaExitosa;
