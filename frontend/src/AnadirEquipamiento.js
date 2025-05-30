import React, { useState } from 'react';

function AnadirEquipamiento() {
  const [nombre, setNombre] = useState('');
  const [stock, setStock] = useState('');
  const [costo, setCosto] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoEquipo = {
      nombre,
      stock: parseInt(stock),
      costo: parseFloat(costo)
    };

    try {
      const res = await fetch('http://localhost:3001/api/equipamiento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoEquipo)
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje('Equipamiento agregado exitosamente.');
        setNombre('');
        setStock('');
        setCosto('');
      } else {
        setMensaje(data.message || 'Error al agregar equipamiento.');
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      setMensaje('Error al conectar con el servidor.');
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Añadir Equipamiento</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div>
          <input
            type="text"
            placeholder="Nombre del equipamiento"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
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
        <button type="submit" style={{ marginTop: '10px' }}>Guardar Equipamiento</button>
      </form>
      {mensaje && <p style={{ marginTop: '20px', color: 'green' }}>{mensaje}</p>}
    </div>
  );
}

export default AnadirEquipamiento;