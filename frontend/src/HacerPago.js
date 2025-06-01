import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function HacerPago() {
  const location = useLocation();
  const navigate = useNavigate();

  const { canchaSeleccionada, jugadores, filtroDia, filtroMes, filtroAnio, horaInicio, horaFin } = location.state || {};

  const confirmarPago = () => {
    // Aquí iría la lógica real de pago o simulación
    alert('Pago exitoso');

    // Redirige al paso 5 (confirmación)
    navigate('/confirmacion', {
      state: {
        canchaSeleccionada,
        jugadores,
        filtroDia,
        filtroMes,
        filtroAnio,
        horaInicio,
        horaFin
      }
    });
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2>Pago de Reserva</h2>
      <p><strong>Cancha:</strong> {canchaSeleccionada?.nombre}</p>
      <p><strong>Total a pagar:</strong> ${canchaSeleccionada?.costo}</p>

      <button onClick={() => navigate(-1)}>Volver</button>
      <button onClick={confirmarPago} style={{ marginLeft: '10px' }}>
        Confirmar Pago
      </button>
    </div>
  );
}

export default HacerPago;
