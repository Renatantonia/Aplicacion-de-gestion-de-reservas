import React, { useState, useEffect } from 'react';

function AnadirSaldo() {
  const [saldo, setSaldo] = useState(0);
  const [monto, setMonto] = useState('');
  const [mensaje, setMensaje] = useState('');

  const id_usuario = localStorage.getItem('id'); // ← Obtenemos el ID guardado

  // Función para obtener el saldo actual del usuario
  const obtenerSaldo = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/saldo/${id_usuario}`);
      const data = await res.json();
      if (res.ok) {
        setSaldo(data.monto_total);
      } else {
        setMensaje('No se pudo cargar el saldo.');
      }
    } catch (error) {
      console.error('Error al obtener el saldo:', error);
      setMensaje('Error al conectar con el servidor.');
    }
  };

  // Se ejecuta una vez al cargar el componente
  useEffect(() => {
    if (id_usuario) {
      obtenerSaldo();
    } else {
      setMensaje('Usuario no autenticado.');
    }
  }, []);

  const handleAgregarSaldo = async (e) => {
    e.preventDefault();

    const cantidad = parseFloat(monto);
    if (isNaN(cantidad) || cantidad <= 0) {
      setMensaje('Ingresa un monto válido mayor a 0.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/saldo/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario,
          monto: cantidad
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje(`Se han agregado $${cantidad.toFixed(2)} correctamente.`);
        setMonto('');
        obtenerSaldo(); // ← recarga el saldo actualizado
      } else {
        setMensaje(data.message || 'Error al agregar saldo.');
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      setMensaje('Error al conectar con el servidor.');
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Saldo de Cuenta</h2>
      <p><strong>Saldo actual:</strong> ${saldo.toFixed(1)}</p>

      <form onSubmit={handleAgregarSaldo} style={{ marginTop: '20px' }}>
        <input
          type="number"
          placeholder="Monto a agregar"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />
        <button type="submit" style={{ marginLeft: '10px' }}>
          Agregar Saldo
        </button>
      </form>

      {mensaje && <p style={{ marginTop: '20px', color: 'green' }}>{mensaje}</p>}
    </div>
  );
}

export default AnadirSaldo;


