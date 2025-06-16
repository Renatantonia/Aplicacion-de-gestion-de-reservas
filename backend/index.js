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


app.get('/api/ganancias', (req, res) => {
  const query = `
    SELECT 
      r.fecha,
      r.total_pago,
      u.nombre AS nombre_usuario
    FROM reservas r
    JOIN usuarios u ON r.id_usuario = u.id
    ORDER BY r.fecha DESC;
  `;

  db.query(query, (err, resultados) => {
    if (err) {
      console.error('Error al obtener ganancias:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(resultados);
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

{/* 
  // Validar duración entre 90 y 180 minutos
  const [hInicio, mInicio] = hora_inicio.split(':').map(Number);
  const [hFin, mFin] = hora_fin.split(':').map(Number);

  const minutosInicio = hInicio * 60 + mInicio;
  const minutosFin = hFin * 60 + mFin;

  const duracionMinutos = minutosFin - minutosInicio;

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
      return res.status(400).json({
        message: 'Superas el límite de 180 minutos diarios de reserva.',
        minutosAcumulados,
        duracionMinutos,
        total: minutosAcumulados + duracionMinutos
    });
}
*/}
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

app.delete('/api/reservas/:id', (req, res) => {
  const { id } = req.params;
  const { rol } = req.query; // Lo recibes como ?rol=admin

  const queryFecha = `SELECT fecha FROM reservas WHERE id = ?`;
  db.query(queryFecha, [id], (err, resultado) => {
    if (err || resultado.length === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    const fechaReserva = new Date(resultado[0].fecha);
    const hoy = new Date();
    const diasDiferencia = (fechaReserva - hoy) / (1000 * 60 * 60 * 24);

    // Solo aplica restricción si el rol no es admin
    if (rol !== 'admin' && diasDiferencia < 7) {
      return res.status(400).json({
        message: 'Solo se puede cancelar con al menos 7 días de anticipación.'
      });
    }

    const eliminar = `DELETE FROM reservas WHERE id = ?`;
    db.query(eliminar, [id], (err2) => {
      if (err2) {
        return res.status(500).json({ message: 'Error al cancelar la reserva.' });
      }
      res.json({ message: 'Reserva cancelada exitosamente.' });
    });
  });
});

app.get('/api/reserva/:id', (req, res) => {
  const { id } = req.params;

  const queryReserva = `
    SELECT r.*, c.nombre AS nombre_cancha
    FROM reservas r
    JOIN canchas c ON r.id_cancha = c.id
    WHERE r.id = ?
  `;

  const queryJugadores = `
    SELECT nombre, apellido, rut, edad
    FROM jugadores_reserva
    WHERE id_reserva = ?
  `;

  db.query(queryReserva, [id], (err, reservaResultado) => {
    if (err || reservaResultado.length === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    const reserva = reservaResultado[0];

    db.query(queryJugadores, [id], (err2, jugadores) => {
      if (err2) {
        return res.status(500).json({ message: 'Error al obtener jugadores' });
      }

      res.json({ ...reserva, jugadores });
    });
  });
});

app.put('/api/reservas/:id', (req, res) => {
  const { id } = req.params;
  const { fecha, hora_inicio, hora_fin, id_cancha, jugadores, rol } = req.body;

  if (!fecha || !hora_inicio || !hora_fin || !id_cancha || jugadores.length === 0) {
    return res.status(400).json({ message: 'Datos incompletos para la actualización' });
  }

  // Validar los 7 días de anticipación
  const hoy = new Date();
  const fechaObj = new Date(fecha);

  const diff = (fechaObj - hoy) / (1000 * 60 * 60 * 24);
  if (rol !== 'admin' && diff < 7) {
    return res.status(400).json({ message: 'Solo puedes editar con al menos 7 días de anticipación' });
  }
  const fechaFormateada = fechaObj.toISOString().split('T')[0];
  const updateReserva = `
    UPDATE reservas
    SET fecha = ?, hora_inicio = ?, hora_fin = ?, id_cancha = ?
    WHERE id = ?
  `;

  db.query(updateReserva, [fechaFormateada, hora_inicio, hora_fin, id_cancha, id], (err) => {
    if (err) {
      console.error('Error actualizando reserva:', err);
      return res.status(500).json({ message: 'Error al actualizar la reserva' });
    }

    // Eliminar jugadores anteriores
    const borrarJugadores = `DELETE FROM jugadores_reserva WHERE id_reserva = ?`;
    db.query(borrarJugadores, [id], (err2) => {
      if (err2) {
        return res.status(500).json({ message: 'Error al limpiar jugadores anteriores' });
      }

      // Insertar nuevos jugadores
      const nuevos = jugadores.map(j => [id, j.nombre, j.apellido, j.rut, j.edad]);
      const insert = `INSERT INTO jugadores_reserva (id_reserva, nombre, apellido, rut, edad) VALUES ?`;

      db.query(insert, [nuevos], (err3) => {
        if (err3) {
          return res.status(500).json({ message: 'Error al insertar jugadores actualizados' });
        }

        res.json({ message: 'Reserva actualizada correctamente' });
      });
    });
  });
});

app.get('/api/reservas-todas', (req, res) => {
  const query = `
    SELECT 
      r.id AS id_reserva,
      u.nombre AS usuario,
      c.nombre AS cancha,
      r.fecha,
      r.hora_inicio,
      r.hora_fin,
      r.total_pago
    FROM reservas r
    JOIN usuarios u ON r.id_usuario = u.id
    JOIN canchas c ON r.id_cancha = c.id
    ORDER BY r.fecha DESC, r.hora_inicio
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener reservas:', err);
      return res.status(500).json({ message: 'Error al obtener reservas' });
    }

    res.json(results);
  });
});

app.post('/api/equipamiento', (req, res) => {
  const { nombre, stock, costo } = req.body;
  const query = 'INSERT INTO equipamiento (nombre, stock, costo) VALUES (?, ?, ?)';

  db.query(query, [nombre, stock, costo], (err, result) => {
    if (err) {
      console.error('Error al insertar equipamiento:', err);
      return res.status(500).json({ message: 'Error al insertar equipamiento' });
    }
    res.status(201).json({ message: 'Equipamiento registrado exitosamente' });
  });
});

app.get('/api/equipamiento', (req, res) => {
  const query = 'SELECT * FROM equipamiento';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener equipamiento:', err);
      return res.status(500).json({ message: 'Error al obtener equipamiento' });
    }
    res.json(results);
  });
});

app.post('/api/canchas', (req, res) => {
  const { nombre, tipo, costo, max_jugadores } = req.body;

  const query = `
    INSERT INTO canchas (nombre, tipo, costo, max_jugadores)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [nombre, tipo, costo, max_jugadores], (err, result) => {
    if (err) {
      console.error('Error al insertar cancha:', err);
      return res.status(500).json({ message: 'Error al registrar la cancha' });
    }
    res.status(201).json({ message: 'Cancha registrada exitosamente' });
  });
});

app.post('/api/saldo/agregar', (req, res) => {
  const { id_usuario, monto } = req.body;

  if (!id_usuario || monto == null) {
    return res.status(400).json({ message: 'Faltan datos requeridos.' });
  }

  const query = `
    UPDATE saldo
    SET monto_total = monto_total + ?
    WHERE id_usuario = ?
  `;

  db.query(query, [monto, id_usuario], (err, result) => {
    if (err) {
      console.error('Error al actualizar saldo:', err);
      return res.status(500).json({ message: 'Error al agregar saldo.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado en la tabla saldo.' });
    }

    res.status(200).json({ message: 'Saldo agregado exitosamente.' });
  });
});

app.get('/api/saldo/:id', (req, res) => {
  const id = req.params.id;
  
  db.query('SELECT monto_total FROM saldo WHERE id_usuario = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al consultar saldo' });
    if (result.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(result[0]);
  });
});

app.post('/api/descontar/saldo', (req, res) => {
  const { id_usuario, monto } = req.body;

  if (!id_usuario || monto == null) {
    return res.status(400).json({ message: 'Datos incompletos.' });
  }

  // 1. Consultar el saldo actual
  const getSaldoQuery = 'SELECT monto_total FROM saldo WHERE id_usuario = ?';
  db.query(getSaldoQuery, [id_usuario], (err, results) => {
    if (err) {
      console.error('Error al obtener saldo actual:', err);
      return res.status(500).json({ message: 'Error al obtener saldo actual.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // 3. Descontar saldo si es suficiente
    const updateQuery = `
      UPDATE saldo
      SET monto_total = monto_total - ?
      WHERE id_usuario = ?
    `;

    db.query(updateQuery, [monto, id_usuario], (err2, result) => {
      if (err2) {
        console.error('Error al descontar saldo:', err2);
        return res.status(500).json({ message: 'Error al descontar saldo.' });
      }

      // 4. Obtener nuevo saldo
      db.query('SELECT monto_total FROM saldo WHERE id_usuario = ?', [id_usuario], (err3, result2) => {
        if (err3) {
          return res.status(500).json({ message: 'Saldo descontado, pero error al consultar nuevo saldo.' });
        }

        res.json({ message: 'Saldo descontado correctamente.', nuevoSaldo: result2[0].monto_total });
      });
    });
  });
});




app.post('/api/agregar/equipamiento', (req, res) => {
  const { id_reserva, id_equipamiento, cantidad } = req.body;

  const query = `
    INSERT INTO equipamiento_reserva (id_reserva, id_equipamiento, cantidad)
    VALUES (?, ?, ?)
  `;

  db.query(query, [id_reserva, id_equipamiento, cantidad], (error, result) => {
    if (error) {
      console.error('Error al insertar equipamiento:', error);
      res.status(500).json({ mensaje: 'Error al agregar equipamiento a la reserva' });
    } else {
      res.status(200).json({ mensaje: 'Equipamiento agregado correctamente a la reserva' });
    }
  });
});


app.get('/api/equipamiento', (req, res) => {
  const query = 'SELECT id, nombre, stock, costo FROM equipamiento';

  db.query(query, (error, result) => {
    if (error) {
      console.error('Error al obtener el equipamiento:', error);
      res.status(500).json({ mensaje: 'Error al obtener el equipamiento' });
    } else {
      res.status(200).json(result);
    }
  });
});

app.post('/api/descontarEquipamientos', (req, res) => {
  const equipamientos = req.body;

  if (!Array.isArray(equipamientos)) {
    return res.status(400).json({ message: 'Formato de datos incorrecto' });
  }

  const promises = equipamientos.map(eq => {
    const query = 'UPDATE equipamiento SET stock = stock - ? WHERE id = ? AND stock >= ?';
    return new Promise((resolve, reject) => {
      db.query(query, [eq.cantidad, eq.id, eq.cantidad], (err, result) => {
        if (err) {
          reject(err);
        } else if (result.affectedRows === 0) {
          reject(new Error(`Stock insuficiente para el equipamiento con id ${eq.id}`));
        } else {
          resolve();
        }
      });
    });
  });

  Promise.all(promises)
    .then(() => res.status(200).json({ message: 'Stock actualizado correctamente' }))
    .catch(error => {
      console.error('Error al descontar equipamientos:', error);
      res.status(500).json({ message: error.message || 'Error al descontar equipamientos' });
    });
});

// GET /api/canchas-disponibles
app.get('/api/canchas/disponibles', (req, res) => {
  const { fecha, hora_inicio, hora_fin } = req.query;

  const query = `
    SELECT * FROM canchas WHERE id NOT IN (
      SELECT id_cancha FROM reservas
      WHERE fecha = ? AND (
        (hora_inicio < ? AND hora_fin > ?) OR
        (hora_inicio >= ? AND hora_inicio < ?)
      )
    )
  `;

  db.query(query, [fecha, hora_fin, hora_inicio, hora_inicio, hora_fin], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
    res.json(results);
  });
});


app.listen(3001, () => {
  console.log('Servidor backend escuchando en http://localhost:3001');
});
