import React, { useEffect, useState } from 'react';

function VerHistorialReservas(){        
    const [reservas, setReservas] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/historial-reservas')
            .then((res) => res.json())
            .then((data) => setReservas(data))
            .catch((err) => console.error('Error al obtener historial:', err));
    }, []);


    return (
        <div>
            <h2>Historial de Reservas</h2>
            <ul>
                {reservas.map((reserva, index) => (
                    <li key={index}>
                        {reserva.nombre} - {reserva.fecha}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default VerHistorialReservas;