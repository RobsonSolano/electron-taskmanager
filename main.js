const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const express = require('./server'); // Inicia o servidor Express
const axios = require('axios');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Necessário para usar Node.js e Electron API no renderer.js
      preload: path.join(__dirname, 'preload.js') // Adiciona o preload
    }
  });

  win.loadFile('index.html');
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Lida com o envio de um novo lembrete
ipcMain.on('create-lembrete', (event, lembrete) => {
  const { nome, data } = lembrete;
  const axios = require('axios');

  axios.post('http://localhost:3000/criar', { nome, data })
    .then(response => {
      event.reply('create-lembrete-response', { success: true, message: 'Lembrete criado com sucesso!' });
    })
    .catch(error => {
      console.error('Erro ao criar o lembrete:', error);
      event.reply('create-lembrete-response', { success: false, message: 'Erro ao criar o lembrete.' });
    });
});

// Lida com a edição de um lembrete
ipcMain.on('edit-lembrete', (event, lembrete) => {
  const { id, nome, data } = lembrete;
  const dataFormatada = new Date(lembrete.data).toISOString().substr(0, 10); 

  axios.put(`http://localhost:3000/editar/${id}`, { nome, dataFormatada })
    .then(response => {
      event.reply('edit-lembrete-response', { success: true, message: 'Lembrete editado com sucesso!' });
    })
    .catch(error => {
      console.error('Erro ao editar o lembrete:', error);
      event.reply('edit-lembrete-response', { success: false, message: 'Erro ao editar o lembrete.' });
    });
});

ipcMain.on('load-lembrete', (event, id) => {
  console.log('Solicitando dados do lembrete com ID:', id);
  axios.get(`http://localhost:3000/editar/${id}`)
    .then(response => {
      console.log('Dados do lembrete recebidos:', response.data);
      event.reply('load-lembrete-response', response.data);
    })
    .catch(error => {
      console.error('Erro ao obter o lembrete:', error);
      event.reply('load-lembrete-response', { success: false, message: 'Erro ao obter o lembrete.' });
    });
});