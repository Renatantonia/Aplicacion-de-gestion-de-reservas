
import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

function HacerReserva(){
    const navigate = useNavigate();
    const [filtroDia, setFiltroDia] = useState('');
    const [filtroMes, setFiltroMes] = useState('');
    const [filtroAnio, setFiltroAnio] = useState('');
    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

    return(
        <div className='contenedor-hacerReserva'>
            <div className='background'>
                <p style={{padding: '16px', textAlign: 'left'}}>Hacer reserva</p>
                <div className='separador'/>
                <p style={{padding: '16px', textAlign: 'left'}}>Canchas disponibles:</p>
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

export default HacerReserva;