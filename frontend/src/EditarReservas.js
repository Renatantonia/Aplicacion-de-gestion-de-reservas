import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EditarReservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/reservas-todas')
      .then(res => res.json())
      .then(data => setReservas(data))
      .catch(err => console.error('Error al cargar reservas:', err));
  }, []);

  const eliminarReserva = async (id_reserva) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar esta reserva?');
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
        alert(data.message || 'Error al eliminar la reserva.');
      }
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('Hubo un error al eliminar la reserva.');
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Administrar Reservas</h2>
      <p>Listado de todas las reservas registradas:</p>

      {reservas.length === 0 ? (
        <p>No hay reservas registradas.</p>
      ) : (
        reservas.map((reserva) => (
          <div key={reserva.id_reserva} style={{ border: '1px solid #ccc', margin: '10px auto', padding: '15px', width: '80%', textAlign: 'left' }}>
            <p><strong>Usuario:</strong> {reserva.usuario}</p>
            <p><strong>Cancha:</strong> {reserva.cancha}</p>
            <p><strong>Fecha:</strong> {reserva.fecha}</p>
            <p><strong>Hora:</strong> {reserva.hora_inicio} - {reserva.hora_fin}</p>
            <p><strong>Total pagado:</strong> ${reserva.total_pago}</p>
            <button onClick={() => navigate(`/editar-reserva/${reserva.id_reserva}`)} style={boton}>Editar</button>
            <button onClick={() => eliminarReserva(reserva.id_reserva)} style={{ ...boton, backgroundColor: 'red' }}>Eliminar</button>
          </div>
        ))
      )}

      <button onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>
         Volver
      </button>
    </div>
  );
}

const boton = {
  marginRight: '10px',
  padding: '8px 16px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default EditarReservas;
