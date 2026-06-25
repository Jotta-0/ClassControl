/**
 * ClassControl - Sistema de Gestão Escolar
 * Módulo: Calendário e Gestão de Avaliações (Visão do Professor)
 */

document.addEventListener('DOMContentLoaded', () => {

    // ===================================================
    // 1. CONFIGURAÇÕES INICIAIS E VARIÁVEIS DE ESTADO
    // ===================================================
    let dataAtual = new Date();
    let anoAtual = dataAtual.getFullYear(); 
    let mesAtual = dataAtual.getMonth();    // 0 (Jan) a 11 (Dez)

    const nomesMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Banco de Dados adaptado à rotina do Professor (Usa o mês do escopo JS: 5 = Junho)
    const eventosEscolares = {
        "2026-5-12": { titulo: "Entrega Parcial do P.I.", tipo: "P.I.", desc: "Prazo limite para envio do Projeto Integrador no portal.", status: "Corrigido" },
        "2026-5-18": { titulo: "Prova de Algoritmos", tipo: "Prova", desc: "Avaliação escrita individual em sala de aula.", status: "Corrigido" },
        "2026-5-26": { titulo: "Lista de Exercícios: Vetores", tipo: "Trabalho", desc: "Entrega das atividades práticas passadas no laboratório.", status: "Pendente" }
    };

    // ===================================================
    // 2. FUNÇÃO CORE: RENDERIZAÇÃO DO CALENDÁRIO
    // ===================================================
    function renderizarCalendarioDinamico(mes, ano) {
        // Alvos do DOM baseados no index.html do professor
        const container = document.getElementById('calendario-corpo');
        const listaLateral = document.getElementById('lista-atividades');
        const txtMesAno = document.getElementById('mes-ano-titulo');
        
        if (!container || !listaLateral) return;

        container.innerHTML = ''; 
        listaLateral.innerHTML = ''; 

        if (txtMesAno) txtMesAno.textContent = `${nomesMeses[mes]} de ${ano}`;

        // Cálculos nativos da folhinha usando a API Date
        const primeiroDiaDaSemana = new Date(ano, mes, 1).getDay(); 
        const totalDiasNoMes = new Date(ano, mes + 1, 0).getDate(); 

        let linhaHtml = "<tr>";

        // PASSO A: Células vazias de dias do mês anterior
        for (let i = 0; i < primeiroDiaDaSemana; i++) {
            linhaHtml += `<td class="py-3 text-muted" style="height: 65px; opacity: 0.3;"></td>`;
        }

        let diaDaSemanaContador = primeiroDiaDaSemana;

        // PASSO B: Numerais do mês corrente
        for (let dia = 1; dia <= totalDiasNoMes; dia++) {
            if (diaDaSemanaContador % 7 === 0 && dia > 1) {
                linhaHtml += "</tr><tr>";
            }

            const hojeReal = new Date();
            const ehHoje = (dia === hojeReal.getDate() && mes === hojeReal.getMonth() && ano === hojeReal.getFullYear());
            
            // Chave para buscar no objeto
            const chaveData = `${ano}-${mes}-${dia}`;
            const evento = eventosEscolares[chaveData];

            // Estilização do marcador interno do dia
            const estiloHoje = ehHoje ? 'background-color: #004A8D; color: white; border-radius: 50%; display: inline-block; width: 32px; height: 32px; line-height: 32px;' : '';

            linhaHtml += `
                <td class="py-3 position-relative" style="height: 65px; cursor: pointer;" id="dia-celula-${dia}">
                    <span style="${estiloHoje}">${dia}</span>
                    ${evento ? `<span class="position-absolute bottom-0 start-50 translate-middle-x mb-1 rounded-circle ${evento.tipo === 'Prova' ? 'bg-danger' : evento.tipo === 'P.I.' ? 'bg-primary' : 'bg-warning'}" style="width: 7px; height: 7px; display:block;"></span>` : ''}
                </td>
            `;

            // PASSO C: Se houver avaliação, injeta na coluna lateral de tarefas do professor
            if (evento) {
                const corClasse = evento.tipo === 'Prova' ? 'bg-danger' : (evento.tipo === 'P.I.' ? 'bg-primary' : 'bg-warning text-dark');
                const bordaCor = evento.tipo === 'Prova' ? '#ef4444' : (evento.tipo === 'P.I.' ? '#004A8D' : '#f59e0b');

                const card = document.createElement('div');
                card.className = "p-3 bg-light d-flex justify-content-between align-items-center shadow-sm mb-2";
                card.style.borderRadius = "12px";
                card.style.borderLeft = `5px solid ${bordaCor}`;

                card.innerHTML = `
                    <div>
                        <span class="badge ${corClasse} tiny mb-1">${evento.tipo}</span>
                        <h6 class="fw-bold text-dark mb-1 small">${evento.titulo}</h6>
                        <span class="text-muted tiny fw-600"><i class="far fa-calendar me-1"></i> Prazo: ${dia < 10 ? '0'+dia : dia}/${mes+1 < 10 ? '0'+(mes+1) : mes+1}/${ano}</span>
                    </div>
                    <div>
                        <span class="badge ${evento.status === 'Corrigido' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} tiny">${evento.status}</span>
                    </div>
                `;
                listaLateral.appendChild(card);
            }

            diaDaSemanaContador++;
        }

        // Completa as células que sobrarem no final da última semana
        while (diaDaSemanaContador % 7 !== 0) {
            linhaHtml += `<td class="py-3" style="height: 65px;"></td>`;
            diaDaSemanaContador++;
        }

        linhaHtml += "</tr>";
        container.innerHTML = linhaHtml;

        // Fallback UX caso não existam tarefas no mês
        if (listaLateral.innerHTML === '') {
            listaLateral.innerHTML = '<div class="text-muted tiny text-center p-4">Nenhuma avaliação agendada para este mês.</div>';
        }
    }

    // ===================================================
    // 3. CONTROLE DE NAVEGAÇÃO INTERATIVA (BOTÕES)
    // ===================================================
    const btnPrev = document.getElementById('btn-ant');
    const btnNext = document.getElementById('btn-prox');
    const btnToday = document.getElementById('btn-hoje');

    if (btnPrev && btnNext) {
        btnPrev.addEventListener('click', () => {
            mesAtual--;
            if (mesAtual < 0) { mesAtual = 11; anoAtual--; }
            renderizarCalendarioDinamico(mesAtual, anoAtual);
        });

        btnNext.addEventListener('click', () => {
            mesAtual++;
            if (mesAtual > 11) { mesAtual = 0; anoAtual++; }
            renderizarCalendarioDinamico(mesAtual, anoAtual);
        });
    }

    if (btnToday) {
        btnToday.addEventListener('click', () => {
            const dataHoje = new Date();
            mesAtual = dataHoje.getMonth();
            anoAtual = dataHoje.getFullYear();
            renderizarCalendarioDinamico(mesAtual, anoAtual);
        });
    }

    // ===================================================
    // 4. ENVIO DO FORMULÁRIO (CRIAR NOVA AVALIAÇÃO)
    // ===================================================
    const formAtividade = document.getElementById('form-nova-atividade');
    if (formAtividade) {
        formAtividade.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = formAtividade.querySelectorAll('input, select');
            const tituloVal = inputs[0].value;
            const dataVal = inputs[1].value; // Captura YYYY-MM-DD
            const tipoVal = inputs[2].value;

            if (!dataVal) return;

            // Divide a data recebida para capturar dia/mês/ano de forma correta
            const partesData = dataVal.split('-');
            const anoInserido = parseInt(partesData[0]);
            const mesInserido = parseInt(partesData[1]) - 1; // Ajusta escala para 0-11
            const diaInserido = parseInt(partesData[2]);

            // Salva na memória do calendário
            const novaChave = `${anoInserido}-${mesInserido}-${diaInserido}`;
            eventosEscolares[novaChave] = {
                titulo: tituloVal,
                tipo: tipoVal,
                desc: `Avaliação da disciplina agendada pelo professor em ${partesData.reverse().join('/')}.`,
                status: "Pendente"
            };

            // Limpa o formulário e recolhe o modal do Bootstrap
            formAtividade.reset();
            const modalElement = document.getElementById('modalNovaAtividade');
            const modalInstancia = bootstrap.Modal.getInstance(modalElement);
            if (modalInstancia) modalInstancia.hide();

            // Sincroniza a tela mantendo a navegação no mês onde o evento foi inserido
            mesAtual = mesInserido;
            anoAtual = anoInserido;
            renderizarCalendarioDinamico(mesAtual, anoAtual);
        });
    }

    // Inicialização da tela
    renderizarCalendarioDinamico(mesAtual, anoAtual);
});