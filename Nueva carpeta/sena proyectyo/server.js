const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const USERS_FILE = path.join(__dirname, 'users.json');
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

// Utilidades para leer y escribir archivos JSON
function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Endpoints de usuarios
app.post('/api/register', (req, res) => {
  const { name, email, password, type } = req.body;
  if (!name || !email || !password || !type) return res.status(400).json({ error: 'Faltan datos' });
  const users = readJSON(USERS_FILE);
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'El usuario ya existe' });
  users.push({ name, email, password, type });
  writeJSON(USERS_FILE, users);
  res.json({ success: true });
});

app.post('/api/login', (req, res) => {
  const { email, password, type } = req.body;
  const users = readJSON(USERS_FILE);
  const user = users.find(u => u.email === email && u.password === password && u.type === type);
  if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });
  res.json({ name: user.name, email: user.email, type: user.type });
});

// Endpoints de productos
app.get('/api/products', (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const { name, desc, price, image } = req.body;
  if (!name || !desc || !price || !image) return res.status(400).json({ error: 'Faltan datos' });
  const products = readJSON(PRODUCTS_FILE);
  products.push({ name, desc, price, image });
  writeJSON(PRODUCTS_FILE, products);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
}); 