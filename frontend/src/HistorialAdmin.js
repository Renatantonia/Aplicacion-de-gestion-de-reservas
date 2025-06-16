import React from 'react';
import { useNavigate } from 'react-router-dom';

function HistorialAdmin() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Historial</h2>
      <p>Selecciona qué historial deseas visualizar:</p>

      <button
        onClick={() => navigate('/VerHistorialReservas')}
        style={estiloBoton}
      >
        Historial de Reservas
      </button>

      <button
        onClick={() => navigate('/verHistorialGanancias')}
        style={estiloBoton}
      >
        Historial de Pagos
      </button>

      <button
        onClick={() => navigate(-1)}
        style={{ ...estiloBoton, backgroundColor: '#ccc', color: '#000' }}
      >
        Volver
      </button>
    </div>
  );
}

const estiloBoton = {
  margin: '10px',
  padding: '30px 50px',
  fontSize: '16px',
  backgroundColor: '#007BFF',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
};

export default HistorialAdmin;
