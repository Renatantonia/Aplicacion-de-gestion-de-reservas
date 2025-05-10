import React, { useState } from 'react';
import {useNavigate} from 'react-router';

function Registro() {
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [mostrar2, setMostrar2] = useState(false);
  const navigate = useNavigate();

  const manejarRegistro = async (e) => {
    e.preventDefault();
    const respuesta = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, password }),
    });

    const data = await respuesta.json();
    alert(data.message);
  };

  return (
    <form onSubmit={manejarRegistro}>
      {/* Botón flecha para volver */}
      <div style={{
      width: '450px',
      height: '500px',
      backgroundColor: 'white',
      border: '8px solid black',
      borderRadius: '50px'}}>  
        <button
          type="button"
          onClick={ () => navigate(-1)}
          style={{
            fontSize: '16px',
            padding: '8px 16px',
            backgroundColor: '#008cba',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          ← Volver
        </button>


          <h2>Registro</h2>
          <div style={{marginTop: '30px'}}><input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Ingrese correo" /></div>
          <div style={{marginTop: '30px'}}><input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ingrese su nombre" /></div>
          <div style={{marginTop: '30px'}}><input value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Ingrese su apellido" /></div>
          <div style={{marginTop: '30px'}}><input value={password} onChange={(e) => setPassword(e.target.value)} type={mostrar ? 'text' : 'password'} placeholder="Ingrese contraseña" /></div>
          <div><input type = "checkbox" value = {mostrar} onChange={() => setMostrar(!mostrar)}/>Mostrar contraseña</div>
          <div style={{marginTop: '30px'}}><input value={password2} onChange={(e) => setPassword2(e.target.value)} type={mostrar2 ? 'text' : 'password'} placeholder="Confirmar contraseña" /></div>
          <div><input type = "checkbox" value = {mostrar2} onChange={() => setMostrar2(!mostrar2)}/>Mostrar contraseña</div>
          <div style={{marginTop: '30px'}}/><button type="submit">Registrarse</button>
      </div>
    </form>
  );
}


export default Registro;
