import React, { useEffect, useState } from 'react';
import './App.css'; 

function VerHistorialGanancias() {
    const [ganancias, setGanancias] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/ganancias')
            .then((res) => res.json())
            .then((data) => setGanancias(data))
            .catch((err) => console.error('Error al obtener las ganancias:', err));
    }, []);

    return (
        <div className="contenedor-principal">
            <div className="background">
                <h2 className="titulo-historial-reservas">Historial de Ganancias</h2>
                <hr className="separador" />

                <div className="fila-datos">
                    <div className="columna"><strong>Fecha</strong></div>
                    <div className="separador-vertical"></div>
                    <div className="columna"><strong>Usuario</strong></div>
                    <div className="separador-vertical"></div>
                    <div className="columna"><strong>Total Pagado</strong></div>
                </div>
                <hr className="separador" />

                <div className="lista-datos">
                    {ganancias.map((g, index) => {
                        const fechaFormateada = new Date(g.fecha).toLocaleDateString('es-CL', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        });

                        return (
                            <div key={index} className="fila-datos">
                                <div className="columna">{fechaFormateada}</div>
                                <div className="columna">{g.nombre_usuario}</div>
                                <div className="columna">${g.total_pago}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default VerHistorialGanancias;
