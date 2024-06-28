const { ipcRenderer } = require('electron');
const urlParams = new URLSearchParams(window.location.search);
const lembreteId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', () => {
  const lembreteFormEdit = document.getElementById('lembrete-form-edit');
  const cancelBtnEdit = document.getElementById('cancel-btn-edit');
  const errorMessage = document.getElementById('error-message');
  const flashMessage = document.getElementById('flash-message');

  cancelBtnEdit.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  lembreteFormEdit.addEventListener('submit', (event) => {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const data = document.getElementById('data').value;

    if (!nome || !data) {
      errorMessage.textContent = 'Os campos Nome e Data são obrigatórios.';
      return;
    }

    console.log(`Enviando atualização para o lembrete com ID: ${lembreteId}, Nome: ${nome}, Data: ${data}`);
    ipcRenderer.send('update-lembrete', { id: lembreteId, nome, data });
  });

  ipcRenderer.on('load-lembrete-response', (event, lembrete) => {
    if (lembrete.success !== false) {
      const dataFormatada = new Date(lembrete.data).toISOString().substr(0, 10); 
      document.getElementById('nome').value = lembrete.nome;
      document.getElementById('data').value = dataFormatada;
    } else {
      errorMessage.textContent = lembrete.message || 'Erro ao carregar o lembrete.';
    }
  });

  ipcRenderer.on('update-lembrete-response', (event, response) => {
    console.log('Resposta da atualização do lembrete:', response);
    if (response.success) {
      flashMessage.textContent = 'Lembrete atualizado com sucesso!';
      setTimeout(() => { flashMessage.textContent = ''; window.location.href = 'index.html'; }, 800);
    } else {
      errorMessage.textContent = response.message;
    }
  });

  ipcRenderer.send('load-lembrete', lembreteId);
});
