import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function InicioUsuario() {
    const [nombre, setNombre] = useState('');
    const navigate = useNavigate();

    const nombreGuardado = localStorage.getItem('nombre');
    
    useEffect(() => {
        
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
                onClick={() => navigate('/AnadirSaldo')}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px' }}
            >
                Añadir Saldo
            </button>

            <button
                onClick={() => {
                    localStorage.clear(); // o removeItem('id') y 'nombreUsuario' si quieres ser más específico
                    navigate('/'); // o '/login' si tienes una ruta distinta
                }}
                style={{ margin: '10px', padding: '50px 60px', fontSize: '16px' }}
                >
                Cerrar sesión
            </button>

        </div>
    );
}

export default InicioUsuario;
