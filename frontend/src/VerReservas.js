import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

function VerReservas (){
    const navigate = useNavigate();

    return (
        <div style = {{padding: '50px', textAlign: 'center'}}>
            <p>Por favor, seleciona una opción nuevamente:</p>

            <button
                onClick={() => navigate('/ReservasGenerales')}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px' }}
            > 
                Ver Reservas Generales
            </button>

            <button
                onClick={() => alert('no se ha implementado')}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px' }}
            > 
                Ver Reservas de Jugador
            </button>
        </div>

    );

}

export default VerReservas;