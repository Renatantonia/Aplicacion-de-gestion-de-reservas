// backend/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Simular usuarios registrados en memoria
const users = [];

// Ruta para registro
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Usuario ya registrado' });
  }
  users.push({ username, password });
  res.status(201).json({ message: 'Registro exitoso' });
});

// Ruta para login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ message: 'Login exitoso' });
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
