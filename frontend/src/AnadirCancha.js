import React, { useState } from 'react';

function AnadirCancha() {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [costo, setCosto] = useState('');
  const [maxJugadores, setMaxJugadores] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevaCancha = {
      nombre,
      tipo,
      costo: parseFloat(costo),
      max_jugadores: parseInt(maxJugadores)
    };

    try {
      const res = await fetch('http://localhost:3001/api/canchas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCancha)
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje('Cancha agregada exitosamente.');
        setNombre('');
        setTipo('');
        setCosto('');
        setMaxJugadores('');
      } else {
        setMensaje(data.message || 'Error al agregar la cancha.');
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      setMensaje('Error al conectar con el servidor.');
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Añadir Nueva Cancha</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div>
          <input
            type="text"
            placeholder="Nombre de la cancha"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Tipo (Ej: sintética, cemento...)"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Costo"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Máx. jugadores"
            value={maxJugadores}
            onChange={(e) => setMaxJugadores(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Guardar Cancha</button>
      </form>
      {mensaje && <p style={{ marginTop: '20px', color: 'green' }}>{mensaje}</p>}
    </div>
  );
}

export default AnadirCancha;
