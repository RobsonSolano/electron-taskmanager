const { app, BrowserWindow } = require('electron');
const path = require('path');

// Código do Electron para criar a janela principal
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

// Evento quando o Electron termina de inicializar
app.on('ready', () => {
  createWindow();
  require('./server'); // Inicia o servidor Express
});

// Encerra a aplicação quando todas as janelas são fechadas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
