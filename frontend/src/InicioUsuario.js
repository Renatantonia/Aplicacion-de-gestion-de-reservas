import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function InicioUsuario() {
    const [nombre, setNombre] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const nombreGuardado = localStorage.getItem('nombreUsuario');
        if (nombreGuardado) {
            setNombre(nombreGuardado);
        }
    }, []);

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>Has ingresado como {nombre}!</h1>
            <p>Selecciona una opción:</p>

            <button
                onClick={() => navigate('/HacerReserva')}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px' }}
            >
                Hacer reserva
            </button>

            <button
                onClick={() => navigate('/mis-reservas')}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px' }}
            >
                Ver mis reservas
            </button>

            <button
                onClick={() => navigate('/AñadirSaldo')}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px' }}
            >
                Añadir Saldo
            </button>

            <button
                onClick={() => {
                    localStorage.removeItem('nombreUsuario');
                    localStorage.removeItem('id');
                    localStorage.removeItem('rol');
                    navigate('/login');
                }}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px' }}
            >
                Cerrar sesión
            </button>
        </div>
    );
}

export default InicioUsuario;
