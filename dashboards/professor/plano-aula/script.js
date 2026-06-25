document.addEventListener('DOMContentLoaded', () => {
    
    // Array simulando as aulas cadastradas do semestre
    const cronogramaAulas = [
        { id: 1, numero: "Aula 01", tema: "Lógica de Programação e Variáveis", conteudo: "Conceitos de algoritmos, tipos de dados primitivos, operadores aritméticos e estruturas sequenciais.", obs: "Alunos pegaram o ritmo rápido.", concluida: true },
        { id: 2, numero: "Aula 02", tema: "Estruturas de Decisão (IF / ELSE)", conteudo: "Operadores lógicos e relacionais. Condicionais simples, compostas e encadeadas.", obs: "Revisar exercícios de fixação na abertura da próxima aula.", concluida: true },
        { id: 3, numero: "Aula 03", tema: "Estruturas de Repetição (FOR / WHILE)", conteudo: "Laços condicionais e contados. Aplicação prática de contadores e acumuladores.", obs: "", concluida: false },
        { id: 4, numero: "Aula 04", tema: "Introdução a Vetores e Matrizes", conteudo: "Estruturas de dados homogêneas. Criação, indexação e iteração de arrays unilaterais.", obs: "", concluida: false }
    ];

    const containerAulas = document.getElementById('lista-planos-aula');

    // Função para renderizar os cards das aulas e recalcular o progresso
    function renderizarCronograma() {
        if (!containerAulas) return;
        containerAulas.innerHTML = "";

        let totalConcluidas = 0;

        cronogramaAulas.forEach(aula => {
            if (aula.concluida) totalConcluidas++;

            const card = document.createElement('div');
            card.className = `card border-0 shadow-sm p-4 ${aula.concluida ? 'border-start border-success border-4' : 'border-start border-warning border-4'}`;
            card.style.borderRadius = "15px";

            card.innerHTML = `
                <div class="d-flex flex-wrap justify-content-between align-items-start gap-3">
                    <div style="flex: 1; min-width: 250px;">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <span class="badge ${aula.concluida ? 'bg-success' : 'bg-warning text-dark'} tiny">${aula.numero}</span>
                            <span class="tiny text-muted fw-bold"><i class="far fa-clock me-1"></i> Conteúdo Programado</span>
                        </div>
                        <h5 class="fw-bold text-dark mb-2">${aula.tema}</h5>
                        <p class="small text-secondary mb-2">${aula.conteudo}</p>
                        ${aula.obs ? `<div class="p-2 bg-light border-start border-3 border-secondary rounded small text-muted mb-0"><strong>Obs:</strong> ${aula.obs}</div>` : ''}
                    </div>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm ${aula.concluida ? 'btn-success' : 'btn-outline-success'} fw-bold btn-toggle-aula" data-id="${aula.id}" style="border-radius: 8px;">
                            <i class="fas ${aula.concluida ? 'fa-check-circle' : 'fa-circle'} me-1"></i> 
                            ${aula.concluida ? 'Aula Cumprida' : 'Marcar como Cumprida'}
                        </button>
                    </div>
                </div>
            `;
            containerAulas.appendChild(card);
        });

        // Atualiza a barra de progresso dinamicamente
        const porcentagem = Math.round((totalConcluidas / cronogramaAulas.length) * 100) || 0;
        const barra = document.getElementById('barra-progresso');
        const texto = document.getElementById('texto-progresso');
        
        if (barra && texto) {
            barra.style.width = `${porcentagem}%`;
            texto.innerText = `${porcentagem}% Concluído`;
        }
    }

    // Evento para alternar o status da aula (Concluída ou Pendente)
    if (containerAulas) {
        containerAulas.addEventListener('click', (e) => {
            const botao = e.target.closest('.btn-toggle-aula');
            if (!botao) return;

            const idAula = parseInt(botao.dataset.id);
            const aulaAlvo = cronogramaAulas.find(a => a.id === idAula);
            
            if (aulaAlvo) {
                aulaAlvo.concluida = !aulaAlvo.concluida;
                renderizarCronograma();
            }
        });
    }

    // Simulação do envio do formulário do Modal de Nova Aula
    const formNovaAula = document.getElementById('form-nova-aula');
    if (formNovaAula) {
        formNovaAula.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = formNovaAula.querySelectorAll('input, textarea');
            const proximaAulaNum = `Aula 0${cronogramaAulas.length + 1}`;

            // Adiciona o novo objeto criado no array
            cronogramaAulas.push({
                id: cronogramaAulas.length + 1,
                numero: proximaAulaNum,
                tema: inputs[0].value,
                conteudo: inputs[1].value,
                obs: inputs[2].value,
                concluida: false
            });

            // Reseta o form, fecha o modal do Bootstrap e atualiza a tela
            formNovaAula.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalNovaAula'));
            modal.hide();
            
            renderizarCronograma();
        });
    }

    renderizarCronograma();
});