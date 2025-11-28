const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Permite que o frontend acesse o backend

// Configuração do Banco via Variáveis de Ambiente
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Cria a tabela se não existir
pool.query(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
  )
`).catch(err => console.error('Erro ao criar tabela', err));

// Rota GET
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Rota POST
app.post('/usuarios', async (req, res) => {
  const { nome } = req.body;
  try {
    const result = await pool.query('INSERT INTO usuarios (nome) VALUES ($1) RETURNING *', [nome]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => {
  console.log('Backend rodando na porta 3000');
});