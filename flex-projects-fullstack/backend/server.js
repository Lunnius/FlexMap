require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: true }
});

app.get('/api/prazos', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM prazos ORDER BY data_fim ASC');
  res.json(rows);
});

app.post('/api/prazos', async (req, res) => {
  const { nome, descricao, tipo, data_inicio, data_fim, estado, endereco, latitude, longitude } = req.body;
  await pool.query(
    `INSERT INTO prazos (nome, descricao, tipo, data_inicio, data_fim, estado, endereco, latitude, longitude)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nome, descricao, tipo, data_inicio, data_fim, estado, endereco, latitude, longitude]
  );
  res.json({ msg: 'Criado' });
});

app.put('/api/prazos/:id', async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const set = keys.map(k => `${k} = ?`).join(', ');
  await pool.query(`UPDATE prazos SET ${set} WHERE id = ?`, [...values, id]);
  res.json({ msg: 'Atualizado' });
});

app.delete('/api/prazos/:id', async (req, res) => {
  await pool.query('DELETE FROM prazos WHERE id = ?', [req.params.id]);
  res.json({ msg: 'Deletado' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));