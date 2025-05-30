import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HacerReserva() {
  const navigate = useNavigate();

  const [canchas, setCanchas] = useState([]);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState(null);

  const [filtroDia, setFiltroDia] = useState('');
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroAnio, setFiltroAnio] = useState('');
  const [horaInicio, setHoraInicio] = useState('10:00');
  const [horaFin, setHoraFin] = useState('11:00');

  const [jugadores, setJugadores] = useState([
    { nombre: '', apellido: '', rut: '', edad: '' }
  ]);

  const id_usuario = localStorage.getItem('id');
  

  // Cargar canchas desde el backend
  useEffect(() => {
    fetch('http://localhost:3001/api/canchas')
      .then(res => res.json())
      .then(data => setCanchas(data))
      .catch(err => console.error('Error al cargar canchas:', err));
  }, []);

  const agregarJugador = () => {
    if (!canchaSeleccionada) {
      alert('Selecciona una cancha primero');
      return;
    }
    if (jugadores.length >= canchaSeleccionada.max_jugadores) {
      alert(`Máximo ${canchaSeleccionada.max_jugadores} jugadores para esta cancha.`);
      return;
    }
    setJugadores([...jugadores, { nombre: '', apellido: '', rut: '', edad: '' }]);
  };

  const eliminarJugador = (index) => {
    setJugadores(jugadores.filter((_, i) => i !== index));
  };

  const actualizarJugador = (index, campo, valor) => {
    const copia = [...jugadores];
    copia[index][campo] = valor;
    setJugadores(copia);
  };

  const enviarReserva = async () => {
  if (!canchaSeleccionada) {
    alert("Debes seleccionar una cancha");
    return;
  }

  if (!filtroDia || !filtroMes || !filtroAnio) {
    alert("Selecciona una fecha válida.");
    return;
  }

  const fechaStr = `${filtroAnio}-${filtroMes}-${filtroDia}`;
  const fechaReserva = new Date(fechaStr);
  const hoy = new Date();
  const diferenciaDias = (fechaReserva - hoy) / (1000 * 60 * 60 * 24);

  // Validación 1: mínimo 7 días de anticipación
  if (diferenciaDias < 7) {
    alert('Debes reservar con al menos 7 días de anticipación.');
    return;
  }

  // Validación 2: lunes a viernes
  const diaSemana = fechaReserva.getDay(); // 0 = domingo, 6 = sábado
  if (diaSemana === 0 || diaSemana === 6) {
    alert('Solo se puede reservar de lunes a viernes.');
    return;
  }

  // Validación 3: horario entre 08:00 y 20:00
  const horaInicioInt = parseInt(horaInicio.split(':')[0]);
  const horaFinInt = parseInt(horaFin.split(':')[0]);
  if (horaInicioInt < 8 || horaFinInt > 20 || horaFinInt <= horaInicioInt) {
    alert('La reserva debe ser entre 08:00 y 20:00, y la hora de fin debe ser mayor que la de inicio.');
    return;
  }

  // Si pasa todas las validaciones, construir el objeto y enviar
  const reserva = {
    id_usuario,
    id_cancha: canchaSeleccionada.id,
    fecha: fechaStr,
    hora_inicio: horaInicio,
    hora_fin: horaFin,
    total_pago: canchaSeleccionada.costo,
    jugadores
  };

  try {
    const res = await fetch('http://localhost:3001/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reserva)
    });

    const data = await res.json();
    if (res.ok) {
      navigate('/ReservaExitosa');
      setJugadores([{ nombre: '', apellido: '', rut: '', edad: '' }]);
    } else {
      alert(data.message || 'Error al guardar la reserva');
    }
  } catch (error) {
    console.error(error);
    alert('Error al conectar con el servidor');
  }
};


  return (
    <div className='contenedor-hacerReserva'>
      {/* Botón Volver */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '8px 16px' }}>
          Volver
        </button>
      </div>

      <h2>Hacer Reserva</h2>

      <h4>Selecciona una cancha</h4>
      <select onChange={(e) => {
        const cancha = canchas.find(c => c.id === parseInt(e.target.value));
        setCanchaSeleccionada(cancha);
      }}>
        <option value="">-- Elige cancha --</option>
        {canchas.map((cancha) => (
          <option key={cancha.id} value={cancha.id}>
            {cancha.nombre} - ${cancha.costo} - Máx {cancha.max_jugadores} jugadores
          </option>
        ))}
      </select>

      <h4>Selecciona fecha</h4>
      <div className="filtros-fecha">
        <select onChange={(e) => setFiltroDia(e.target.value)}>
          <option value="">Día</option>
          {[...Array(31)].map((_, i) => {
            const dia = String(i + 1).padStart(2, '0');
            return <option key={dia} value={dia}>{dia}</option>;
          })}
        </select>
        <select onChange={(e) => setFiltroMes(e.target.value)}>
          <option value="">Mes</option>
          {Array.from({ length: 12 }, (_, i) => {
            const mes = String(i + 1).padStart(2, '0');
            return (
              <option key={mes} value={mes}>
                {new Date(0, i).toLocaleString('es-ES', { month: 'long' })}
              </option>
            );
          })}
        </select>
        <select onChange={(e) => setFiltroAnio(e.target.value)}>
          <option value="">Año</option>
          {[2024, 2025].map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <h4>Selecciona horario</h4>
      <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
      <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />

      <h4>Jugadores ({jugadores.length})</h4>
      {jugadores.map((j, i) => (
        <div key={i} style={{ marginBottom: '10px' }}>
          <input placeholder="Nombre" value={j.nombre} onChange={e => actualizarJugador(i, 'nombre', e.target.value)} />
          <input placeholder="Apellido" value={j.apellido} onChange={e => actualizarJugador(i, 'apellido', e.target.value)} />
          <input placeholder="RUT" value={j.rut} onChange={e => actualizarJugador(i, 'rut', e.target.value)} />
          <input placeholder="Edad" type="number" value={j.edad} onChange={e => actualizarJugador(i, 'edad', e.target.value)} />
          <button type="button" onClick={() => eliminarJugador(i)}>Eliminar</button>
        </div>
      ))}
      <button type="button" onClick={agregarJugador}>+ Agregar jugador</button>

      <div style={{ marginTop: '20px' }}>
        <button onClick={enviarReserva}>Confirmar reserva</button>
        <button onClick={() => navigate(-1)} style={{ marginLeft: '10px' }}>Cancelar</button>
      </div>

    </div>
  );
}

export default HacerReserva;
