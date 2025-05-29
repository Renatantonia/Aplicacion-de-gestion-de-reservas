// backend/index.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/register', (req, res) => {
  const { nombre, correo, contraseña } = req.body;
  const query = 'INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)';

  db.query(query, [nombre, correo, contraseña], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Correo ya registrado' });
      }
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    res.status(201).json({ message: 'Registro exitoso' });
  });
});

app.post('/api/login', (req, res) => {
  const { correo, contraseña } = req.body;
  const query = 'SELECT * FROM usuarios WHERE correo = ? AND contraseña = ?';

  db.query(query, [correo, contraseña], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en el servidor' });
    if (results.length > 0) {
      res.json({ message: 'Login exitoso', usuario: results[0] });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  });
});

app.get('/api/historial-reservas', (req, res) => {
  const query = `
    SELECT 
      u.nombre AS nombre_usuario,
      r.fecha,
      r.hora_inicio,
      r.hora_fin,
      c.nombre AS nombre_cancha,
      r.total_pago,
      e.nombre AS nombre_equipamiento,
      er.cantidad
    FROM reservas r
    JOIN usuarios u ON r.id_usuario = u.id
    JOIN canchas c ON r.id_cancha = c.id
    LEFT JOIN equipamiento_reserva er ON r.id = er.id_reserva
    LEFT JOIN equipamiento e ON er.id_equipamiento = e.id
    ORDER BY r.fecha DESC, r.hora_inicio;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    
    res.json(results);
  });
});

  // Ruta para registrar reservas con validación de cantidad de jugadores
app.post('/api/reservas', (req, res) => {
  const {
    id_usuario,
    id_cancha,
    fecha,
    hora_inicio,
    hora_fin,
    total_pago,
    jugadores = []
  } = req.body;

  // Validar al menos un jugador
  if (jugadores.length === 0) {
    return res.status(400).json({ message: 'Debe ingresar al menos un jugador.' });
  }

  // Validar anticipación mínima de 7 días
  const hoy = new Date();
  const fechaReserva = new Date(fecha);
  const diasAnticipacion = (fechaReserva - hoy) / (1000 * 60 * 60 * 24);

  if (diasAnticipacion < 7) {
    return res.status(400).json({ message: 'Debes reservar con al menos 7 días de anticipación.' });
  }

  // Validar que sea de lunes a viernes
  const diaSemana = fechaReserva.getDay(); // 0 domingo, 6 sábado
  if (diaSemana === 0 || diaSemana === 6) {
    return res.status(400).json({ message: 'Solo se permiten reservas de lunes a viernes.' });
  }

  // Validar horario permitido
  const horaMin = '08:00';
  const horaMax = '20:00';
  if (hora_inicio < horaMin || hora_fin > horaMax) {
    return res.status(400).json({ message: 'El horario debe estar entre 08:00 y 20:00.' });
  }

  // Validar duración entre 90 y 180 minutos
  const inicio = new Date(`1970-01-01T${hora_inicio}:00`);
  const fin = new Date(`1970-01-01T${hora_fin}:00`);
  const duracionMinutos = (fin - inicio) / (1000 * 60);

  if (duracionMinutos < 90 || duracionMinutos > 180) {
    return res.status(400).json({ message: 'La duración debe ser entre 90 y 180 minutos.' });
  }

  // Validar duración total del usuario ese día
  const queryDuracionDia = `
    SELECT SUM(TIMESTAMPDIFF(MINUTE, hora_inicio, hora_fin)) AS minutos_totales
    FROM reservas
    WHERE id_usuario = ? AND fecha = ?;
  `;

  db.query(queryDuracionDia, [id_usuario, fecha], (err, resultadoDuracion) => {
    if (err) return res.status(500).json({ message: 'Error al consultar tiempo diario.' });

    const minutosAcumulados = resultadoDuracion[0].minutos_totales || 0;
    if (minutosAcumulados + duracionMinutos > 180) {
      return res.status(400).json({ message: 'Superas el límite de 180 minutos diarios de reserva.' });
    }

    // Validar que no haya reserva solapada o consecutiva exacta
    const queryDisponibilidad = `
      SELECT * FROM reservas
      WHERE id_cancha = ? AND fecha = ?
      AND (
        (hora_inicio < ? AND hora_fin > ?) OR
        (hora_inicio = ? OR hora_fin = ?)
      );
    `;

    db.query(queryDisponibilidad, [id_cancha, fecha, hora_fin, hora_inicio, hora_inicio, hora_fin], (err, reservasExistentes) => {
      if (err) return res.status(500).json({ message: 'Error al verificar disponibilidad.' });

      if (reservasExistentes.length > 0) {
        return res.status(409).json({ message: 'La cancha ya está reservada o tu horario es contiguo a otra reserva.' });
      }

      // Verificar cantidad máxima de jugadores
      const queryCancha = 'SELECT max_jugadores FROM canchas WHERE id = ?';
      db.query(queryCancha, [id_cancha], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error al consultar cancha' });
        if (result.length === 0) return res.status(404).json({ message: 'Cancha no encontrada' });

        const capacidad = result[0].max_jugadores;

        if (jugadores.length > capacidad) {
          return res.status(400).json({ message: `La cancha permite un máximo de ${capacidad} jugadores` });
        }

        // Insertar la reserva
        const queryReserva = `
          INSERT INTO reservas (id_usuario, id_cancha, fecha, hora_inicio, hora_fin, total_pago)
          VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(queryReserva, [id_usuario, id_cancha, fecha, hora_inicio, hora_fin, total_pago], (err, resultReserva) => {
          if (err) return res.status(500).json({ message: 'Error al registrar la reserva' });

          const id_reserva = resultReserva.insertId;

          // Insertar los jugadores asociados
          const queryJugadores = `
            INSERT INTO jugadores_reserva (id_reserva, nombre, apellido, rut, edad)
            VALUES ?`;

          const datosJugadores = jugadores.map(j => [
            id_reserva,
            j.nombre,
            j.apellido,
            j.rut,
            j.edad
          ]);

          db.query(queryJugadores, [datosJugadores], (err) => {
            if (err) return res.status(500).json({ message: 'Reserva registrada, pero error al guardar jugadores' });

            res.status(201).json({ message: 'Reserva y jugadores registrados exitosamente' });
          });
        });
      });
    });
  });
});

app.get('/api/mis-reservas/:id_usuario', (req, res) => {
  const { id_usuario } = req.params;

  const query = `
    SELECT 
      r.id AS id_reserva,
      r.fecha,
      r.hora_inicio,
      r.hora_fin,
      c.nombre AS cancha,
      r.total_pago,
      j.nombre AS jugador_nombre,
      j.apellido,
      j.rut,
      j.edad
    FROM reservas r
    JOIN canchas c ON r.id_cancha = c.id
    LEFT JOIN jugadores_reserva j ON r.id = j.id_reserva
    WHERE r.id_usuario = ?
    ORDER BY r.fecha DESC, r.hora_inicio;
  `;

  db.query(query, [id_usuario], (err, results) => {
    if (err) {
      console.error('Error al obtener reservas:', err);
      return res.status(500).json({ message: 'Error al obtener reservas del usuario' });
    }
    
    // Organizar las reservas agrupadas por id_reserva
    const reservasAgrupadas = {};

    results.forEach(row => {
      const id = row.id_reserva;
      if (!reservasAgrupadas[id]) {
        reservasAgrupadas[id] = {
          id_reserva: id,
          fecha: row.fecha,
          hora_inicio: row.hora_inicio,
          hora_fin: row.hora_fin,
          cancha: row.cancha,
          total_pago: row.total_pago,
          jugadores: []
        };
      }

      if (row.jugador_nombre) {
        reservasAgrupadas[id].jugadores.push({
          nombre: row.jugador_nombre,
          apellido: row.apellido,
          rut: row.rut,
          edad: row.edad
        });
      }
    });

    const reservas = Object.values(reservasAgrupadas);
    res.json(reservas);
  });
});

app.get('/api/canchas', (req, res) => {
  const query = 'SELECT id, nombre, costo, max_jugadores FROM canchas';

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener canchas' });
    res.json(results);
  });
});

app.listen(3001, () => {
  console.log('Servidor backend escuchando en http://localhost:3001');
});



