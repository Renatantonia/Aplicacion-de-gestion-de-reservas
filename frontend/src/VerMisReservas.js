import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VerMisReservas() {
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();
  const id_usuario = localStorage.getItem('id');

  useEffect(() => {
    if (!id_usuario) {
      alert('Debes iniciar sesión.');
      navigate('/login');
      return;
    }

    fetch(`http://localhost:3001/api/mis-reservas/${id_usuario}`)
      .then(res => res.json())
      .then(data => setReservas(data))
      .catch(err => console.error('Error al cargar reservas:', err));
  }, [id_usuario, navigate]);

    const cancelarReserva = async (id_reserva, fechaReserva) => {
    const fecha = new Date(fechaReserva);
    const hoy = new Date();
    const diferenciaDias = (fecha - hoy) / (1000 * 60 * 60 * 24);

    if (diferenciaDias < 7) {
      alert('Solo puedes cancelar una reserva con al menos 7 días de anticipación.');
      return;
    }

    const confirmar = window.confirm('¿Estás seguro de que deseas cancelar esta reserva?');
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3001/api/reservas/${id_reserva}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setReservas(reservas.filter(r => r.id_reserva !== id_reserva));
      } else {
        alert(data.message || 'Error al cancelar la reserva.');
      }
    } catch (err) {
      console.error('Error al cancelar:', err);
      alert('Hubo un error al cancelar la reserva.');
    }
  };


  return (
      <div className="contenedor">
        
        {/* Botón Volver */}
        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => navigate(-1)} style={{ padding: '8px 16px' }}>
            Volver
          </button>
        </div>

        <h2>Mis Reservas</h2>
        {reservas.length === 0 ? (
          <p>No tienes reservas registradas.</p>
        ) : (
          reservas.map((reserva) => (
            <div key={reserva.id_reserva} className="reserva-card" style={{ border: '1px solid black', padding: '10px', marginBottom: '15px' }}>
              <p><strong>Fecha:</strong> {reserva.fecha}</p>
              <p><strong>Hora:</strong> {reserva.hora_inicio} - {reserva.hora_fin}</p>
              <p><strong>Cancha:</strong> {reserva.cancha}</p>
              <p><strong>Total pagado:</strong> ${reserva.total_pago}</p>

              <p><strong>Jugadores:</strong></p>
              <ul>
                {reserva.jugadores.map((j, i) => (
                  <li key={i}>
                    {j.nombre} {j.apellido} - {j.rut} ({j.edad} años)
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: '10px' }}>
                <button onClick={() => navigate(`/editar-reserva/${reserva.id_reserva}`)} style={{ marginRight: '10px' }}>
                  Editar
                </button>

                <button
                  style={{ backgroundColor: 'red', color: 'white' }}
                  onClick={() => cancelarReserva(reserva.id_reserva, reserva.fecha)}
                >
                  Cancelar
                </button>
              </div>
            </div>

          ))
        )}
      </div>
  );
}

export default VerMisReservas;
