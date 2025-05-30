import React, { useEffect, useState } from 'react';

function ListarEquipamiento() {
  const [equipamiento, setEquipamiento] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/equipamiento')
      .then((res) => res.json())
      .then((data) => setEquipamiento(data))
      .catch((err) => console.error('Error al obtener equipamiento:', err));
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <h2 style={{ textAlign: 'center' }}>Listado de Equipamiento</h2>
      <ul style={{ listStyle: 'none', padding: 0, maxWidth: '600px', margin: 'auto' }}>
        {equipamiento.map((eq, i) => (
          <li
            key={i}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px',
              margin: '10px 0',
              backgroundColor: '#f9f9f9'
            }}
          >
            <strong>{eq.nombre}</strong><br />
            Stock: {eq.stock}<br />
            Costo: ${eq.costo}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListarEquipamiento ;