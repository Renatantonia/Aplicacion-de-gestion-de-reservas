import React, { useEffect, useState } from 'react';
import './App.css';

function VerHistorialReservas() {
    const [reservas, setReservas] = useState([]);
    const [filtroDia, setFiltroDia] = useState('');
    const [filtroMes, setFiltroMes] = useState('');
    const [filtroAnio, setFiltroAnio] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/api/historial-reservas')
            .then((res) => res.json())
            .then((data) => setReservas(data))
            .catch((err) => console.error('Error al obtener historial:', err));
    }, []);

    // Aplicar filtro
    const reservasFiltradas = reservas.filter((reserva) => {
        const date = new Date(reserva.fecha);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0'); // Enero = 0
        const anio = String(date.getFullYear());

        return (
            (filtroDia === '' || dia === filtroDia) &&
            (filtroMes === '' || mes === filtroMes) &&
            (filtroAnio === '' || anio === filtroAnio)
        );
    });

    return (
        <div className="contenedor-principal">
            {/* Cuadro izquierdo: Historial */}
            <div className="background">
                <h2 className="titulo-historial-reservas">Historial de Reservas</h2>
                <hr className="separador" />

                <div className="fila-datos">
                    <div className="columna">Nombre</div>
                    <div className="separador-vertical"></div>
                    <div className="columna">Fecha</div>
                </div>
                <hr className="separador" />

                <div className="lista-datos">
                    {reservasFiltradas.map((reserva, index) => {
                        const date = new Date(reserva.fecha);
                        const fechaFormateada = date.toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit'
                        });

                        return (
                            <div key={index} className="fila-datos">
                                <div className="columna">{reserva.nombre}</div>
                                <div className="columna">{fechaFormateada}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Cuadro derecho: Filtros */}
            <div className="filtro-fecha">
                <h3>Filtrar por fecha</h3>
                <div className="filtros">
                    <select onChange={(e) => setFiltroDia(e.target.value)}>
                        <option value="">Día</option>
                        {[...Array(31)].map((_, i) => {
                            const dia = String(i + 1).padStart(2, '0');
                            return <option key={dia} value={dia}>{dia}</option>;
                        })}
                    </select>

                    <select onChange={(e) => setFiltroMes(e.target.value)}>
                        <option value="">Mes</option>
                        {[
                            '01', '02', '03', '04', '05', '06',
                            '07', '08', '09', '10', '11', '12'
                        ].map((mes, i) => (
                            <option key={mes} value={mes}>
                                {new Date(0, i).toLocaleString('es-ES', { month: 'long' })}
                            </option>
                        ))}
                    </select>

                    <select onChange={(e) => setFiltroAnio(e.target.value)}>
                        <option value="">Año</option>
                        {[2023, 2024, 2025].map((año) => (
                            <option key={año} value={String(año)}>{año}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

export default VerHistorialReservas;


