import React from 'react';
import { useNavigate } from 'react-router-dom';

function EquipamientoAdmin() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Gestión de Equipamiento y Canchas</h2>
      <p>Selecciona una opción:</p>

      <button
        onClick={() => navigate('/Admin/Equipamiento/AnadirCancha')}
        style={estiloBotonVerde}
      >
        Añadir Cancha
      </button>

      <button
        onClick={() => navigate('/Admin/Equipamiento/AnadirEquipamiento')}
        style={estiloBotonAzul}
      >
        Añadir Equipamiento
      </button>

      <button
        onClick={() => navigate('/Admin/Equipamiento/ListarEquipamiento')}
        style={estiloBotonAmarillo}
      >
        Listar Equipamiento
      </button>

      <button
        onClick={() => navigate(-1)}
        style={estiloBotonVolver}
      >
        Volver
      </button>
    </div>
  );
}

const estiloBotonVerde = {
  margin: '10px',
  padding: '30px 50px',
  fontSize: '16px',
  backgroundColor: '#10B981',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
};

const estiloBotonAzul = {
  ...estiloBotonVerde,
  backgroundColor: '#3B82F6'
};

const estiloBotonAmarillo = {
  ...estiloBotonVerde,
  backgroundColor: '#F59E0B'
};

const estiloBotonVolver = {
  marginTop: '40px',
  padding: '10px 20px',
  fontSize: '14px',
  backgroundColor: '#D1D5DB',
  color: '#111827',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

export default EquipamientoAdmin;

