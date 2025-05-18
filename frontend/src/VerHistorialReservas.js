import React, { useEffect, useState } from 'react';
import './App.css';

function VerHistorialReservas() {
    const [reservas, setReservas] = useState([]);
    const [filtroDia, setFiltroDia] = useState('');
    const [filtroMes, setFiltroMes] = useState('');
    const [filtroAnio, setFiltroAnio] = useState('');
    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/api/historial-reservas')
            .then((res) => res.json())
            .then((data) => {
                
                const agrupadas = {};

                data.forEach((res) => {
                    const key = `${res.nombre_usuario}-${res.fecha}-${res.hora_inicio}`;
                    if (!agrupadas[key]) {
                        agrupadas[key] = {
                            nombre: res.nombre_usuario,
                            fecha: res.fecha,
                            hora_inicio: res.hora_inicio,
                            hora_fin: res.hora_fin,
                            cancha: res.nombre_cancha,
                            total: res.total_pago,
                            equipamientos: [],
                        };
                    }

                    if (res.nombre_equipamiento) {
                        agrupadas[key].equipamientos.push({
                            nombre: res.nombre_equipamiento,
                            cantidad: res.cantidad,
                        });
                    }
                });

                setReservas(Object.values(agrupadas));
            })
            .catch((err) => console.error('Error al obtener historial:', err));
    }, []);

    const reservasFiltradas = reservas.filter((reserva) => {
        const date = new Date(reserva.fecha);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const anio = String(date.getFullYear());

        return (
            (filtroDia === '' || dia === filtroDia) &&
            (filtroMes === '' || mes === filtroMes) &&
            (filtroAnio === '' || anio === filtroAnio)
        );
    });

    return (
        <div className="contenedor-principal">
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
                                <div 
                                    className="columna nombre-clickable"
                                    onClick={() => setReservaSeleccionada(reserva)}
                                    style={{ cursor: 'pointer', color: '#005f99', textDecoration: 'underline' }}
                                >
                                    {reserva.nombre}
                                </div>
                                <div className="columna">{fechaFormateada}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="filtro-fecha">
                <div className="columna-lateral">
                    <div>
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

                    {reservaSeleccionada && (
                        <div className="detalle-reserva">
                            <h4>Detalles de la Reserva</h4>
                            <p><strong>Nombre:</strong> {reservaSeleccionada.nombre}</p>
                            <p><strong>Cancha:</strong> {reservaSeleccionada.cancha}</p>
                            <p><strong>Fecha:</strong> {new Date(reservaSeleccionada.fecha).toLocaleString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })}</p>
                            <p><strong>Hora:</strong> {reservaSeleccionada.hora_inicio} - {reservaSeleccionada.hora_fin}</p>
                            <p><strong>Total pagado:</strong> ${reservaSeleccionada.total}</p>
                            <p><strong>Equipamiento:</strong></p>
                            {reservaSeleccionada.equipamientos.length > 0 ? (
                                <ul>
                                    {reservaSeleccionada.equipamientos.map((eq, i) => (
                                        <li key={i}>{eq.nombre} x{eq.cantidad}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Sin equipamiento</p>
                            )}
                            <button onClick={() => setReservaSeleccionada(null)}>Cerrar</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VerHistorialReservas;




