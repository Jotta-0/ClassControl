/**
 * ClassControl - Módulo de Notas do Aluno
 * ------------------------------------------------------------------------
 * Este script gere as interações específicas da página de boletim,
 * como filtros de módulos e abertura de detalhes das competências.
 */

// Garante que o script só corre após o DOM estar totalmente carregado
document.addEventListener("DOMContentLoaded", () => {
    inicializarFiltros();
    inicializarBotoesDetalhes();
});

/**
 * Configura o dropdown ou botão de filtragem por Módulo Académico
 */
function inicializarFiltros() {
    const btnFiltrar = document.querySelector('.btn-outline-secondary');
    
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', (e) => {
            e.preventDefault();
            // TODO: Integrar lógica para abrir o modal ou dropdown de filtros
            console.log("Filtro de módulos acionado.");
        });
    }
}

/**
 * Adiciona listeners nos botões de "Ver Detalhes" de cada Unidade Curricular
 */
function inicializarBotoesDetalhes() {
    const botoesDetalhes = document.querySelectorAll('.table .btn-light');

    botoesDetalhes.forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Captura o nome da UC a partir da linha clicada para usar dinamicamente
            const linhaTabela = e.target.closest('tr');
            const nomeUC = linhaTabela.querySelector('.fw-600').innerText;
            
            abrirModalDetalhesUC(nomeUC);
        });
    });
}

/**
 * Exibe o detalhamento de critérios e feedbacks da UC selecionada
 * @param {string} nomeUC - O nome da Unidade Curricular clicada
 */
function abrirModalDetalhesUC(nomeUC) {
    // Aqui ligarás ao Modal do Bootstrap para mostrar os critérios atendidos
    alert(`A abrir os critérios detalhados da unidade: ${nomeUC}`);
}