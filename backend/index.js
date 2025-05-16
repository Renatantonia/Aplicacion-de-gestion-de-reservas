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

app.listen(3001, () => {
  console.log('Servidor backend escuchando en http://localhost:3001');
});

