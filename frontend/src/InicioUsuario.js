import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';


function InicioUsuario(){
    const navigate = useNavigate ();
    const nombre = "Hola";

    return (
        <div style = {{ padding: '50px', textAlign: 'center'}}>
            <h1>Has ingresado como {nombre}</h1>
            <p>Selecciona una opción:</p>

            <button
                onClick={() => navigate('/HacerReserva')}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px' }}
            >
                Hacer reserva
            </button>

            <button
                onClick={() => navigate('/VerMisReservas')}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px' }}
            >
                Ver mis reservas
            </button>

            <button
                onClick={() => navigate('/AñadirSaldo')}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px'}}
            >
                Añadir Saldo
            </button>

            <button
                onClick={() => navigate(-1)}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px'}}
            >
                Cerrar sesion
            </button>
        </div>
    );

}

export default InicioUsuario;