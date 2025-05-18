import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

function EditarReservas (){
    const navigate = useNavigate();

    return (
        <div style = {{padding: '50px', textAlign: 'center'}}>
            <p>Por favor, seleciona una opción nuevamente:</p>

            <button
                onClick={() => navigate('/ReservasGenerales')}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px' }}
            > 
                Editar Reservas Generales
            </button>

            <button
                onClick={() => alert('no se ha implementado')}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px' }}
            > 
                Editar Reservas de Jugador
            </button>
        </div>

    );

}

export default EditarReservas;