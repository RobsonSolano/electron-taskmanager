const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root_executaveis',
  password: '1234',
  database: 'estudo_executavel'
});

connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão com o banco de dados estabelecida!');
});

app.get('/listar', (req, res) => {
  connection.query('SELECT id, nome, data FROM lembretes', (error, results) => {
    if (error) {
      console.error('Erro ao executar a query:', error);
      res.status(500).json({ error: 'Erro ao buscar os lembretes.' });
      return;
    }
    res.json(results);
  });
});

app.post('/criar', (req, res) => {
  const { nome, data } = req.body;
  if (!nome || !data) {
    res.status(400).json({ success: false, message: 'Os campos Nome e Data são obrigatórios.' });
    return;
  }

  const query = 'INSERT INTO lembretes (nome, data) VALUES (?, ?)';
  connection.query(query, [nome, data], (error, results) => {
    if (error) {
      console.error('Erro ao executar a query:', error);
      res.status(500).json({ success: false, message: 'Erro ao criar o lembrete.' });
      return;
    }
    res.json({ success: true, message: 'Lembrete criado com sucesso!' });
  });
});

// Rota para editar um lembrete
app.get('/editar/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT id, nome, data FROM lembretes WHERE id = ?';

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('Erro ao executar a query:', error);
      res.status(500).json({ success: false, message: 'Erro ao buscar o lembrete.' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ success: false, message: 'Lembrete não encontrado.' });
      return;
    }

    res.json(results[0]);
  });
});

// Rota para buscar um lembrete pelo ID
app.get('/editar/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT id, nome, data FROM lembretes WHERE id = ?';

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('Erro ao executar a query:', error);
      res.status(500).json({ error: 'Erro ao buscar o lembrete.' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Lembrete não encontrado.' });
      return;
    }

    res.json(results[0]);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});

module.exports = app; // Exporta o app Express para ser utilizado em outras partes do código