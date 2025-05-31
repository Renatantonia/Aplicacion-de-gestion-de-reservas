import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditarReserva() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reserva, setReserva] = useState(null);
  const [canchas, setCanchas] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [mensaje, setMensaje] = useState('');

  // Obtener datos de la reserva
  useEffect(() => {
    fetch(`http://localhost:3001/api/reserva/${id}`)
      .then(res => res.json())
      .then(data => {
        setReserva(data);
        setJugadores(data.jugadores);
      })
      .catch(err => console.error('Error al cargar reserva:', err));

    fetch('http://localhost:3001/api/canchas')
      .then(res => res.json())
      .then(data => setCanchas(data));
  }, [id]);

  const actualizarJugador = (index, campo, valor) => {
    const copia = [...jugadores];
    copia[index][campo] = valor;
    setJugadores(copia);
  };

  const guardarCambios = async () => {
    const fechaHoy = new Date();
    const fechaReserva = new Date(reserva.fecha);
    const diff = (fechaReserva - fechaHoy) / (1000 * 60 * 60 * 24);

    if (diff < 7) {
      alert('Solo puedes editar una reserva con al menos 7 días de anticipación.');
      return;
    }

    const body = {
      fecha: reserva.fecha,
      hora_inicio: reserva.hora_inicio,
      hora_fin: reserva.hora_fin,
      id_cancha: reserva.id_cancha,
      jugadores
    };

    const res = await fetch(`http://localhost:3001/api/reservas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (res.ok) {
      alert('Reserva actualizada exitosamente');
      navigate('/mis-reservas');
    } else {
      alert(data.message || 'Error al actualizar');
    }
  };

  if (!reserva) return <p>Cargando...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Editar Reserva</h2>

      <label>Cancha:</label>
      <select
        value={reserva.id_cancha}
        onChange={(e) => setReserva({ ...reserva, id_cancha: parseInt(e.target.value) })}
      >
        {canchas.map((cancha) => (
          <option key={cancha.id} value={cancha.id}>
            {cancha.nombre}
          </option>
        ))}
      </select>

      <br />
      <label>Fecha:</label>
      <input
        type="date"
        value={reserva.fecha}
        onChange={(e) => setReserva({ ...reserva, fecha: e.target.value })}
      />
      <br />
      <label>Hora inicio:</label>
      <input
        type="time"
        value={reserva.hora_inicio}
        onChange={(e) => setReserva({ ...reserva, hora_inicio: e.target.value })}
      />
      <label>Hora fin:</label>
      <input
        type="time"
        value={reserva.hora_fin}
        onChange={(e) => setReserva({ ...reserva, hora_fin: e.target.value })}
      />

      <h4>Jugadores</h4>
      {jugadores.map((j, i) => (
        <div key={i}>
          <input value={j.nombre} onChange={e => actualizarJugador(i, 'nombre', e.target.value)} placeholder="Nombre" />
          <input value={j.apellido} onChange={e => actualizarJugador(i, 'apellido', e.target.value)} placeholder="Apellido" />
          <input value={j.rut} onChange={e => actualizarJugador(i, 'rut', e.target.value)} placeholder="RUT" />
          <input type="number" value={j.edad} onChange={e => actualizarJugador(i, 'edad', e.target.value)} placeholder="Edad" />
        </div>
      ))}

      <button onClick={guardarCambios}>Guardar cambios</button>
      <button onClick={() => navigate(-1)} style={{ marginLeft: '10px' }}>Volver</button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default EditarReserva;
