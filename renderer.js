document.addEventListener('DOMContentLoaded', () => {
  const lembretesList = document.getElementById('lembretes-list');

  // Função para buscar e exibir os lembretes
  function fetchAndDisplayLembretes() {
    fetch('http://localhost:3000/listar')
      .then(response => response.json())
      .then(data => {
        // Limpa o conteúdo atual da tabela
        lembretesList.innerHTML = '';

        // Adiciona os lembretes como linhas na tabela
        data.forEach(lembrete => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${lembrete.id}</td>
            <td>${lembrete.nome}</td>
            <td>${lembrete.data}</td>
          `;
          lembretesList.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Erro ao buscar os lembretes:', error);
      });
  }

  // Chamada inicial para carregar os lembretes ao abrir a página
  fetchAndDisplayLembretes();
});
