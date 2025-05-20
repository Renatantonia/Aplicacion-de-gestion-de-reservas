import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';


function InicioAdmin(){
    const navigate = useNavigate ();

    return (
        <div style = {{ padding: '50px', textAlign: 'center'}}>
            <h1>Has ingresado como administrador!</h1>
            <p>Selecciona una opción:</p>

            <button
                onClick={() => navigate('/VerReservas')}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px' }}
            >
                Editar Reservas
            </button>

            <button
                onClick={() => navigate('/VerHistorial')}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px' }}
            >
                Ver Historial
            </button>

            <button
                onClick={() => navigate(-1)}
                style={{ padding: '50px 60px', fontSize: '16px' }}
            >
                Cerrar sesión
            </button>
        </div>
    );

}

export default InicioAdmin;