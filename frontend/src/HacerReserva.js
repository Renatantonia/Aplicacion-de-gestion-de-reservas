import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HacerReserva() {
  
  const navigate = useNavigate();

  const [pasoActual, setPasoActual] = useState(1);
  const [canchas, setCanchas] = useState([]);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState(null);
  const [filtroDia, setFiltroDia] = useState('');
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroAnio, setFiltroAnio] = useState('');
  const [horaInicio, setHoraInicio] = useState('10:00');
  const [horaFin, setHoraFin] = useState('11:00');
  const [jugadores, setJugadores] = useState([{ nombre: '', apellido: '', rut: '', edad: '' }]);
  const id_usuario = localStorage.getItem('id');
  const [equipamientos, setEquipamientos] = useState([]);
  const [agregados, setAgregados] = useState({}); // { id: cantidad }
  const [canchasDisponibles, setCanchasDisponibles] = useState([]);
  const [disponibilidadConsultada, setDisponibilidadConsultada] = useState(false);


  useEffect(() => {
    fetch('http://localhost:3001/api/canchas')
      .then(res => res.json())
      .then(data => setCanchas(data))
      .catch(err => console.error('Error al cargar canchas:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/equipamiento')
      .then(res => res.json())
      .then(data => setEquipamientos(data))
      .catch(error => console.error('Error al obtener equipamiento:', error));
  }, []);

  const consultarCanchasDisponibles = async () => {
    setDisponibilidadConsultada(false);
    const fecha = `${filtroAnio}-${filtroMes}-${filtroDia}`;
    try {
      const res = await fetch(`http://localhost:3001/api/canchas/disponibles?fecha=${fecha}&hora_inicio=${horaInicio}&hora_fin=${horaFin}`);
      const data = await res.json();
      setCanchasDisponibles(data);
      setDisponibilidadConsultada(true);
    } catch (err) {
      console.error("Error al consultar disponibilidad:", err);
      setCanchasDisponibles([]);
      setDisponibilidadConsultada(true);
    }
  };

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
    if (!canchaSeleccionada || !filtroDia || !filtroMes || !filtroAnio) {
      alert("Completa todos los datos");
      return;
    }

    const fechaStr = `${filtroAnio}-${filtroMes}-${filtroDia}`;
    const fechaReserva = new Date(fechaStr);
    const hoy = new Date();
    const diferenciaDias = (fechaReserva - hoy) / (1000 * 60 * 60 * 24);

    if (diferenciaDias < 7) {
      alert('Debes reservar con al menos 7 días de anticipación.');
      return;
    }

    const diaSemana = fechaReserva.getDay();
    if (diaSemana === 0 || diaSemana === 6) {
      alert('Solo se puede reservar de lunes a viernes.');
      return;
    }

    const horaInicioInt = parseInt(horaInicio.split(':')[0]);
    const horaFinInt = parseInt(horaFin.split(':')[0]);
    if (horaInicioInt < 8 || horaFinInt > 20 || horaFinInt <= horaInicioInt) {
      alert('La reserva debe ser entre 08:00 y 20:00, y la hora de fin debe ser mayor que la de inicio.');
      return;
    }

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
        
        try {
          await descontarSaldo();
          await descontarEquipamiento();
        } catch (error) {
          alert('Reserva realizada, pero hubo un error al descontar el saldo');
        }

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

  const descontarEquipamiento = async () => {
    try {
      console.log('Equipamientos a enviar al backend:', JSON.stringify(
        Object.entries(agregados).map(([id, cantidad]) => ({
          id: parseInt(id),
          cantidad
        }))
      ));

      const respuesta = await fetch('http://localhost:3001/api/descontarEquipamientos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          Object.entries(agregados).map(([id, cantidad]) => ({
            id: parseInt(id),
            cantidad
          }))
        )
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.message || 'Error al descontar equipamientos');
      }

      const resultado = await respuesta.json();
      console.log('Equipamientos descontados correctamente:', resultado);

    } catch (error) {
      console.error('Error al descontar equipamientos:', error);
      alert('Hubo un problema al descontar los equipamientos');
    }
  };


  const descontarSaldo = async () => {
    
    const id_usuario = localStorage.getItem('id');
    const monto = canchaSeleccionada?.costo;

    if (!id_usuario || !monto) {
    console.error('Datos inválidos para descontar saldo:', { id_usuario, monto });
    return;
    }


    try {

      const respEquipamiento = await fetch('http://localhost:3001/api/equipamiento');
      const equipamientos = await respEquipamiento.json();

      // 2. Sumar el costo del equipamiento seleccionado
      let costoEquipamiento = 0;

      Object.entries(agregados).forEach(([idStr, cantidad]) => {
        const id = parseInt(idStr);
        const item = equipamientos.find(e => e.id === id);
        if (item) {
          costoEquipamiento += item.costo * cantidad;
        }
      });

      monto += costoEquipamiento;

      console.log('🔁 Enviando datos para descontar saldo:', { id_usuario, monto });
      const response = await fetch('http://localhost:3001/api/descontar/saldo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_usuario, monto })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Nuevo saldo:', data.nuevoSaldo);
        alert('Saldo descontado correctamente');
      } else {
        console.error('Respuesta no OK:', await response.text()); // más detalles
        alert('Error al descontar saldo');
      }
    } catch (error) {
      console.error('Error en fetch:', error);
      alert('Error de red al descontar saldo');
    }
  };
  



  return (
    <div style = {{ position: 'relative', padding: '40px' }}>
      <button
        className="button-decline"
        onClick={() => navigate('/InicioAdmin')}
        style={{
          position: 'absolute',
          top: '35px',
          left: '35px'
        }}
      >
        X
      </button>

    <div className="contenedor-hacerReserva" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      
      <h2>Hacer Reserva</h2>

      {/* PASO 2: Seleccionar Equipamiento */}
      {pasoActual === 2 && (
        <>
          <h4>Paso 2: Selecciona equipamiento</h4>
          {equipamientos.length === 0 ? (
            <p>No hay equipamientos disponibles.</p>
          ) : (
            equipamientos.map((eq) => {
              const cantidadAgregada = agregados[eq.id] || 0;
              const stockVisible = eq.stock - cantidadAgregada;
              const sinStock = stockVisible <= 0;

              return (
                <div
                  key={eq.id}
                  style={{
                    marginBottom: '15px',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    backgroundColor: sinStock ? '#f0f0f0' : 'white',
                    color: sinStock ? '#999' : 'black'
                  }}
                >
                  <strong>{eq.nombre}</strong>
                  <p>Stock disponible: {stockVisible}</p>
                  <p>Costo por unidad: ${eq.costo}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      disabled={cantidadAgregada <= 0}
                      onClick={() =>
                        setAgregados((prev) => ({
                          ...prev,
                          [eq.id]: Math.max(0, prev[eq.id] - 1)
                        }))
                      }
                    >
                      −
                    </button>

                    <span>{cantidadAgregada} agregada(s)</span>

                    <button
                      disabled={stockVisible <= 0}
                      onClick={() =>
                        setAgregados((prev) => ({
                          ...prev,
                          [eq.id]: (prev[eq.id] || 0) + 1
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })
          )}
          <br />
          <button onClick={() => setPasoActual(1)}>Atrás</button>
          <button onClick={() => setPasoActual(3)}>Siguiente</button>
        </>
      )}


      {/* PASO 1: Fecha y horario/consultar disponibilidad de canchas */}
      {pasoActual === 1 && (
        <>
          <h4>Paso 1: Selecciona fecha y horario</h4>
          <div>
            <select onChange={(e) => setFiltroDia(e.target.value)} value={filtroDia}>
              <option value="">Día</option>
              {[...Array(31)].map((_, i) => {
                const dia = String(i + 1).padStart(2, '0');
                return <option key={dia} value={dia}>{dia}</option>;
              })}
            </select>
            <select onChange={(e) => setFiltroMes(e.target.value)} value={filtroMes}>
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
            <select onChange={(e) => setFiltroAnio(e.target.value)} value={filtroAnio}>
              <option value="">Año</option>
              {[2025, 2026].map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
            <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
          </div>

          {horaInicio && horaFin && filtroDia && filtroMes && filtroAnio && (
              <>
                <br />
                <button onClick={consultarCanchasDisponibles}>Consultar disponibilidad</button>
                {canchasDisponibles.length > 0 ? (
                  <div>
                    <h4>Canchas disponibles para horario escogido:</h4>
                    <select onChange={(e) => {
                      const cancha = canchasDisponibles.find(c => c.id === parseInt(e.target.value));
                      setCanchaSeleccionada(cancha);
                    }}>
                      <option value="">-- Elige cancha --</option>
                      {canchasDisponibles.map((cancha) => (
                        <option key={cancha.id} value={cancha.id}>
                          {cancha.nombre} - ${cancha.costo} - ({cancha.max_jugadores} jugadores máximos)
                        </option>
                      ))}
                    </select>
                    <br />
                    <button onClick={() => setPasoActual(2)} disabled={!canchaSeleccionada}>Siguiente</button>
                  </div>
                ) : (
                  disponibilidadConsultada && <p>No hay canchas disponibles para ese horario.</p>
                )}
              </>
              )}

            
          </>
      )}

      {/* PASO 4: Jugadores */}
      {pasoActual === 3 && (
        <>
          <h4>Paso 3: Jugadores ({jugadores.length})</h4>
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
          <br />
          <button onClick={() => setPasoActual(2)}>Atrás</button>
          <button onClick={() => setPasoActual(4)} >Siguiente</button>
        </>
      )}

      {/* PASO 5: Resumen y Confirmación */}
      {pasoActual === 4 && (
        <>
          <h4>Paso 4: Datos de Reserva</h4>
          <p><strong>Cancha:</strong> {canchaSeleccionada?.nombre}</p>
          <p><strong>Fecha:</strong> {`${filtroDia}-${filtroMes}-${filtroAnio}`}</p>
          <p><strong>Horario:</strong> {horaInicio} a {horaFin}</p>
          <p><strong>Jugadores:</strong></p>
          <ul>
            {jugadores.map((j, i) => (
              <li key={i}>{j.nombre} {j.apellido} - {j.rut} - {j.edad} años</li>
            ))}
          </ul>
          <button onClick={() => setPasoActual(3)}>Atrás</button>
          <button onClick={() => setPasoActual(5)} >Siguiente</button>
        </>
      )}

      {/* PASO 6: Hacer Pago */}
      {pasoActual === 5 && (
        <>
          <h4> Paso 5: Confirmar Pago</h4>
          <p><strong>Total a Pagar:</strong> {canchaSeleccionada?.costo}</p>
          <button className="button-accept" onClick={enviarReserva}>Confirmar reserva</button>
        </>
      )}
    </div>
    </div>
  );
}

export default HacerReserva;

