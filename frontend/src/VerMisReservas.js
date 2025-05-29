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
          <div key={reserva.id_reserva} className="reserva-card" style={{border: '1px solid black', padding: '10px', marginBottom: '15px'}}>
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

            <button onClick={() => navigate(`/editar-reserva/${reserva.id_reserva}`)}>Editar</button>
            <button onClick={() => navigate(`/cancelar-reserva/${reserva.id_reserva}`)} style={{marginLeft: '10px', backgroundColor: 'red', color: 'white'}}>Cancelar</button>
          </div>
        ))
      )}
    </div>
  );
}

export default VerMisReservas;
