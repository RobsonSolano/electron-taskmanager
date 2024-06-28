const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  const lembretesList = document.getElementById('lembretes-list');
  const showFormBtn = document.getElementById('show-form-btn');
  const formContainer = document.getElementById('form-container');
  const lembreteForm = document.getElementById('lembrete-form');
  const cancelBtn = document.getElementById('cancel-btn');
  const errorMessage = document.getElementById('error-message');
  const flashMessage = document.getElementById('flash-message');

  showFormBtn.addEventListener('click', () => {
    formContainer.style.display = 'block';
  });

  cancelBtn.addEventListener('click', () => {
    formContainer.style.display = 'none';
    lembreteForm.reset();
    errorMessage.textContent = '';
  });

  lembreteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const data = document.getElementById('data').value;

    if (!nome || !data) {
      errorMessage.textContent = 'Os campos Nome e Data são obrigatórios.';
      return;
    }

    ipcRenderer.send('create-lembrete', { nome, data });
  });

  ipcRenderer.on('create-lembrete-response', (event, response) => {
    if (response.success) {
      formContainer.style.display = 'none';
      lembreteForm.reset();
      flashMessage.textContent = 'Lembrete cadastrado com sucesso!';
      setTimeout(() => { flashMessage.textContent = ''; }, 3000);
      fetchAndDisplayLembretes();
    } else {
      errorMessage.textContent = response.message;
    }
  });

  ipcRenderer.on('delete-lembrete-response', (event, response) => {
    if (response.success) {
      flashMessage.textContent = 'Lembrete finalizado com sucesso!';
      setTimeout(() => { flashMessage.textContent = ''; }, 3000);
      fetchAndDisplayLembretes();
    } else {
      errorMessage.textContent = response.message;
    }
  });

  // Lida com a edição de um lembrete
  lembretesList.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-btn')) {
      const id = event.target.dataset.id;
      window.location.href = `detail.html?id=${id}`;
    } else if (event.target.classList.contains('delete-btn')) {
      const id = event.target.dataset.id;
      const confirmation = confirm('Essa tarefa já foi realizada?');
      if (confirmation) {
        ipcRenderer.send('delete-lembrete', id);
      }
    }
  });

  function fetchAndDisplayLembretes() {
    fetch('http://localhost:3000/listar')
      .then(response => response.json())
      .then(data => {
        lembretesList.innerHTML = '';
        data.forEach(lembrete => {
          const row = document.createElement('tr');
          const dataFormatada = new Date(lembrete.data).toLocaleDateString('pt-BR');
          row.innerHTML = `
            <td>${lembrete.id}</td>
            <td>${lembrete.nome}</td>
            <td>${dataFormatada}</td>
            <td><button class="edit-btn" data-id="${lembrete.id}">Editar</button></td>
            <td><button class="delete-btn" data-id="${lembrete.id}">Feito</button></td>
          `;
          lembretesList.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Erro ao buscar os lembretes:', error);
      });
  }

  fetchAndDisplayLembretes();
});
