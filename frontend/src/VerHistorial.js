import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

function VerHistorial (){
    const navigate = useNavigate();

    return (
        <div style = {{padding: '50px', textAlign: 'center'}}>
            <p>Por favor, seleciona una opción nuevamente:</p>

            <button
                onClick={() => navigate('/VerHistorialReservas')}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px' }}
            > 
                Ver Historial de Reservas
            </button>

            <button
                onClick={() => alert('/verHistorialGanancias.js')}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px' }}
            > 
                Ver Historial de Ganancias
            </button>
        </div>

    );

}

export default VerHistorial;