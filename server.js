const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(bodyParser.json());

const db = new sqlite3.Database('./database.sqlite'); // Usando um arquivo de banco de dados para persistência

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS lembretes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      data DATE NOT NULL,
      deletado INTEGER NOT NULL DEFAULT 0
    )
  `);
  console.log('Banco de dados inicializado com sucesso!');
});

app.get('/listar', (req, res) => {
  db.all('SELECT id, nome, data FROM lembretes WHERE deletado = 0', [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar os lembretes:', err);
      res.status(500).json({ error: 'Erro ao buscar os lembretes.' });
      return;
    }
    res.json(rows);
  });
});

app.post('/criar', (req, res) => {
  const { nome, data } = req.body;
  if (!nome || !data) {
    res.status(400).json({ success: false, message: 'Os campos Nome e Data são obrigatórios.' });
    return;
  }

  const query = 'INSERT INTO lembretes (nome, data) VALUES (?, ?)';
  db.run(query, [nome, data], function(err) {
    if (err) {
      console.error('Erro ao criar o lembrete:', err);
      res.status(500).json({ success: false, message: 'Erro ao criar o lembrete.' });
      return;
    }
    res.json({ success: true, message: 'Lembrete criado com sucesso!', id: this.lastID });
  });
});

app.get('/editar/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT id, nome, data FROM lembretes WHERE id = ?';

  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Erro ao buscar o lembrete:', err);
      res.status(500).json({ error: 'Erro ao buscar o lembrete.' });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Lembrete não encontrado.' });
      return;
    }
    res.json(row);
  });
});

app.put('/editar/:id', (req, res) => {
  const { id } = req.params;
  const { nome, data } = req.body;

  if (!nome || !data) {
    res.status(400).json({ success: false, message: 'Os campos Nome e Data são obrigatórios.' });
    return;
  }

  const query = 'UPDATE lembretes SET nome = ?, data = ? WHERE id = ?';
  db.run(query, [nome, data, id], function(err) {
    if (err) {
      console.error('Erro ao atualizar o lembrete:', err);
      res.status(500).json({ success: false, message: 'Erro ao atualizar o lembrete.' });
      return;
    }
    res.json({ success: true, message: 'Lembrete atualizado com sucesso!' });
  });
});

app.put('/deletar/:id', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE lembretes SET deletado = 1 WHERE id = ?';

  db.run(query, [id], function(err) {
    if (err) {
      console.error('Erro ao deletar o lembrete:', err);
      res.status(500).json({ success: false, message: 'Erro ao deletar o lembrete.' });
      return;
    }
    res.json({ success: true, message: 'Lembrete deletado com sucesso!' });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});

module.exports = app;
