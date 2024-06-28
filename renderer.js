const { ipcRenderer } = require('electron');

// Exemplo de envio de consulta do processo de renderização para o processo principal
ipcRenderer.send('query-MySQL', 'SELECT * FROM lembretes');

// Exemplo de recebimento de dados do processo principal
ipcRenderer.on('query-result', (event, result) => {
  console.log('Resultado da consulta:', result);
  // Atualize sua interface com os dados recebidos
});
