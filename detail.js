const { ipcRenderer } = require('electron');
const urlParams = new URLSearchParams(window.location.search);
const lembreteId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', () => {
  const lembreteForm = document.getElementById('lembrete-form');
  const cancelBtn = document.getElementById('cancel-btn');
  const errorMessage = document.getElementById('error-message');
  const flashMessage = document.getElementById('flash-message');

  cancelBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  lembreteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const data = document.getElementById('data').value;

    if (!nome || !data) {
      errorMessage.textContent = 'Os campos Nome e Data são obrigatórios.';
      return;
    }

    ipcRenderer.send('update-lembrete', { id: lembreteId, nome, data });
  });

  ipcRenderer.on('load-lembrete-response', (event, lembrete) => {
    document.getElementById('nome').value = lembrete.nome;
    document.getElementById('data').value = lembrete.data;
  });

  ipcRenderer.on('update-lembrete-response', (event, response) => {
    if (response.success) {
      flashMessage.textContent = 'Lembrete atualizado com sucesso!';
      setTimeout(() => { flashMessage.textContent = ''; window.location.href = 'index.html'; }, 3000);
    } else {
      errorMessage.textContent = response.message;
    }
  });

  ipcRenderer.send('load-lembrete', lembreteId);
});
