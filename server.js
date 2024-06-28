const express = require('express');
const mysql = require('mysql');
const app = express();

const connection = mysql.createConnection({
  host: '127.0.0.1', // Atualize este IP se necessário
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

// Rota para listar os lembretes
app.get('/listar', (req, res) => {
  connection.query('SELECT id, nome, data FROM lembretes', (error, results, fields) => {
    if (error) {
      console.error('Erro ao executar a query:', error);
      res.status(500).json({ error: 'Erro ao buscar os lembretes.' });
      return;
    }
    res.json(results);
  });
});

// Inicia o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
