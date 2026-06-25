/**
 * ClassControl - Sistema de Gestão Escolar
 * Módulo: Calendário Dinâmico do Aluno
 */

document.addEventListener('DOMContentLoaded', () => {

    // ===================================================
    // 1. CONFIGURAÇÕES INICIAIS E VARIÁVEIS DE ESTADO
    // ===================================================
    
    // Instancia o objeto Date padrão com a data atual do computador
    let dataAtual = new Date();
    let anoAtual = dataAtual.getFullYear(); 
    let mesAtual = dataAtual.getMonth();    // Escopo de 0 (Jan) a 11 (Dez)

    // Matriz para tradução visual do cabeçalho
    const nomesMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Banco de Dados fictício adaptado à rotina de estudos do Aluno
    const eventosEscolares = {
        "2026-5-5": { titulo: "Entrega do P.I.", tipo: "avaliacao", desc: "Prazo limite para envio do Projeto Integrador no portal.", hora: "23:59" },
        "2026-5-12": { titulo: "Palestra de T.I.", tipo: "reuniao", desc: "Workshop obrigatório sobre tendências do mercado de tecnologia.", hora: "19:00" },
        "2026-5-19": { titulo: "Recesso Escolar", tipo: "recesso", desc: "Unidade fechada devido à emenda de feriado.", hora: "O dia todo" },
        "2026-5-24": { titulo: "Avaliação de BD", tipo: "avaliacao", desc: "Desenvolvimento prático em laboratório sobre modelagem de dados.", hora: "19:30" }
    };

    // ===================================================
    // 2. FUNÇÃO CORE: RENDERIZAÇÃO DO CALENDÁRIO
    // ===================================================
    function renderizarCalendarioDinamico(mes, ano) {
        // Alvos do DOM onde o conteúdo gerado vai entrar
        const container = document.getElementById('calendar-days-container');
        const listaLateral = document.getElementById('lista-eventos-lateral');
        const txtMesAno = document.getElementById('mes-ano-atual');
        
        // Controle do debounce de segurança do loading
        let carregouInstantaneo = false;

        // Ativa animação/ícone de carregamento se o processamento for lento
        setTimeout(() => {
            if (!carregouInstantaneo) {
                container.style.setProperty('display', 'flex', 'important');
                container.style.justifyContent = 'center';
                container.style.alignItems = 'center';
                container.style.minHeight = '250px';
                container.style.width = '100%';

                container.innerHTML = `
                    <div class="d-flex flex-column align-items-center justify-content-center text-muted text-center fw-600 w-100 py-5">
                        <i class="fas fa-circle-notch fa-spin fa-2x mb-2 text-primary"></i>
                        <div class="small">Atualizando sua agenda...</div>
                    </div>
                `;
                listaLateral.innerHTML = '<div class="text-muted tiny p-2">Sincronizando tarefas...</div>';
                if (txtMesAno) txtMesAno.textContent = "Carregando...";
            }
        }, 80); 

        // Processamento das células e dias da grade
        setTimeout(() => {
            carregouInstantaneo = true;

            // Restaura o formato original em Grid Layout das células
            container.style.setProperty('display', 'grid', 'important');
            container.style.minHeight = 'auto';
            container.innerHTML = ''; 
            listaLateral.innerHTML = ''; 

            // Altera o título da folhinha no topo
            if (txtMesAno) txtMesAno.textContent = `${nomesMeses[mes]} de ${ano}`;

            // Cálculos matemáticos nativos usando a API Date
            const primeiroDiaDaSemana = new Date(ano, mes, 1).getDay(); // Descobre qual dia da semana inicia o mês
            const totalDiasNoMes = new Date(ano, mes + 1, 0).getDate(); // Descobre o último dia válido do mês

            // PASSO A: Imprime células vazias de dias do mês anterior
            for (let i = 0; i < primeiroDiaDaSemana; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'calendar-cell outro-mes';
                container.appendChild(emptyCell);
            }

            // PASSO B: Constrói os numerais correspondentes ao mês corrente
            for (let dia = 1; dia <= totalDiasNoMes; dia++) {
                const cell = document.createElement('div');
                cell.className = 'calendar-cell';
                
                // Valida e aplica classe especial se coincidir com o dia de hoje
                const hojeReal = new Date();
                if (dia === hojeReal.getDate() && mes === hojeReal.getMonth() && ano === hojeReal.getFullYear()) {
                    cell.classList.add('hoje');
                }

                // String-chave para verificar se há eventos indexados no banco
                const chaveData = `${ano}-${mes}-${dia}`;
                const evento = eventosEscolares[chaveData];
                
                let conteudoCell = `<span class="numero-dia">${dia}</span>`;

                // PASSO C: Se encontrar um evento cadastrado, injeta as marcações visuais
                if (evento) {
                    // Mapeia classes de cor Bootstrap condicionalmente por tipo
                    let corClasse = evento.tipo === 'avaliacao' ? 'bg-danger' : (evento.tipo === 'reuniao' ? 'bg-primary' : 'bg-success');
                    
                    conteudoCell += `
                        <div class="event-tag-container">
                            <span class="event-dot-mini ${corClasse}"></span>
                            <span class="tiny fw-bold text-truncate d-block" style="font-size: 10px; color: #1e293b;">${evento.titulo}</span>
                        </div>
                    `;

                    // Clique interativo para exibir modal informando os detalhes da atividade
                    cell.onclick = () => {
                        alert(`📅 COMPROMISSO ACADÊMICO:\n\n📌 Prazo/Evento: ${evento.titulo}\n⏰ Horário: ${evento.hora}\n\n📝 Descrição: ${evento.desc}`);
                    };

                    // Injeta card correspondente no painel direito (Linha do tempo)
                    const card = document.createElement('div');
                    card.className = `item-evento-lateral ev-${evento.tipo}`;
                    card.innerHTML = `
                        <span class="badge ${corClasse} tiny mb-1">${dia} de ${nomesMeses[mes]}</span>
                        <h6 class="fw-bold mb-1 small" style="color: #1e293b;">${evento.titulo}</h6>
                        <p class="text-muted tiny mb-0">${evento.desc}</p>
                    `;
                    listaLateral.appendChild(card);
                }

                cell.innerHTML = conteudoCell;
                container.appendChild(cell);
            }

            // Fallback UX caso não existam tarefas cadastradas no mês em exibição
            if (listaLateral.innerHTML === '') {
                listaLateral.innerHTML = '<div class="text-muted tiny text-center p-4">Nenhuma entrega ou evento agendado para este mês.</div>';
            }

        }, 0); 
    }

    // ===================================================
    // 3. CONTROLE DE NAVEGAÇÃO INTERATIVA (BOTÕES)
    // ===================================================
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnToday = document.getElementById('btn-today');

    if (btnPrev && btnNext) {
        // Remove travas nativas do HTML após a carga total do script
        btnPrev.removeAttribute('disabled');
        btnNext.removeAttribute('disabled');

        // Evento do botão Voltar Mês
        btnPrev.addEventListener('click', () => {
            mesAtual--;
            if (mesAtual < 0) {
                mesAtual = 11;
                anoAtual--;
            }
            renderizarCalendarioDinamico(mesAtual, anoAtual);
        });

        // Evento do botão Avançar Mês
        btnNext.addEventListener('click', () => {
            mesAtual++;
            if (mesAtual > 11) {
                mesAtual = 0;
                anoAtual++;
            }
            renderizarCalendarioDinamico(mesAtual, anoAtual);
        });
    }

    // Evento do botão "Ir para hoje"
    if (btnToday) {
        btnToday.addEventListener('click', () => {
            const dataHoje = new Date();
            mesAtual = dataHoje.getMonth();
            anoAtual = dataHoje.getFullYear();
            renderizarCalendarioDinamico(mesAtual, anoAtual);
        });
    }

    // ===================================================
    // 4. DISPARO DE INICIALIZAÇÃO AUTOMÁTICA
    // ===================================================
    renderizarCalendarioDinamico(mesAtual, anoAtual);
});