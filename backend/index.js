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



app.listen(3001, () => {
  console.log('Servidor backend escuchando en http://localhost:3001');
});



