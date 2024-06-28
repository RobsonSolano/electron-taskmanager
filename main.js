const { app, BrowserWindow } = require('electron');
const mysql = require('mysql');

// Configuração da conexão com o MySQL
const connection = mysql.createConnection({
  host: '127.0.0.1', // Atualize este IP se necessário
  user: 'root_executaveis',
  password: '1234',
  database: 'estudo_executavel'
});

// Conecta ao MySQL
connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão com o banco de dados estabelecida!');
});

// Código do Electron para criar a janela principal
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
}

// Evento quando o Electron termina de inicializar
app.on('ready', () => {
  createWindow();
});

// Encerra a conexão com o MySQL quando o Electron for fechado
app.on('window-all-closed', () => {
  connection.end();
  app.quit();
});
