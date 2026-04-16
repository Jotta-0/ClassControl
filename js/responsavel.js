window.addEventListener('DOMContentLoaded', () => {
  // Gráfico de Notas
  const ctxNotas = document.getElementById('graficoNotas').getContext('2d');
  new Chart(ctxNotas, {
    type: 'bar',
    data: {
      labels: ['Mat', 'Port', 'Hist', 'Geo'],
      datasets: [{
        label: '4º Bim',
        data: [8.8, 7.0, 9.5, 7.2],
        backgroundColor: '#d4335a',
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'bottom' },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        y: { beginAtZero: true, max: 10 }
      }
    }
  });

  // Gráfico de Frequência
  const ctxFreq = document.getElementById('graficoFrequencia').getContext('2d');
  new Chart(ctxFreq, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
      datasets: [
        {
          label: 'Presente',
          data: [20, 18, 21, 19, 22],
          backgroundColor: '#33cc33',
        },
        {
          label: 'Falta',
          data: [2, 0, 1, 1, 0],
          backgroundColor: '#d4335a',
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
});
const toggleBtn = document.getElementById('toggleBtn');
const sidebar = document.getElementById('sidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});