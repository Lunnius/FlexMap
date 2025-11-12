require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

// permite acesso do seu front hospedado no Render
app.use(cors({
  origin: ['https://flex-frontend-2ot3.onrender.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

const fs = require('fs');

const app = express();

// --- Configuração de CORS ---
// Pode deixar "*" para aceitar qualquer origem (funciona com seu frontend Render)
app.use(cors({ origin: '*' }));

app.use(express.json());

// --- Conexão com o banco ---
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 4000,
  ssl: {
    ca: fs.readFileSync(process.env.DB_SSL_CA_PATH)
  }
});

// --- Rotas da API ---
app.get('/api/prazos', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM prazos ORDER BY data_fim ASC');
    res.json(rows);
  } catch (err) {
    console.error('❌ Erro SQL:', err.message);
    res.status(500).json({ error: 'Erro ao buscar prazos', details: err.message });
  }
});


app.post('/api/prazos', async (req, res) => {
  try {
    const { nome, descricao, tipo, data_inicio, data_fim, estado, endereco, latitude, longitude } = req.body;
    await pool.query(
      `INSERT INTO prazos (nome, descricao, tipo, data_inicio, data_fim, estado, endereco, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, descricao, tipo, data_inicio, data_fim, estado, endereco, latitude, longitude]
    );
    res.json({ msg: 'Criado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar prazo' });
  }
});

app.put('/api/prazos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const set = keys.map(k => `${k} = ?`).join(', ');
    await pool.query(`UPDATE prazos SET ${set} WHERE id = ?`, [...values, id]);
    res.json({ msg: 'Atualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar prazo' });
  }
});

app.delete('/api/prazos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM prazos WHERE id = ?', [req.params.id]);
    res.json({ msg: 'Deletado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar prazo' });
  }
});

// --- Inicialização do servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));


