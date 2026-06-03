/**
 * ClassControl - Sistema de Gestão Escolar
 * Módulo: Calendário Automatizado do Responsável
 * * ESCOPO DO ARQUIVO:
 * - Identificar e renderizar o mês/ano atual do sistema do usuário de forma automática.
 * - Calcular dias totais e o alinhamento da semana nativamente via Date do JavaScript.
 * - Gerenciar navegação de meses através de botões.
 * - Estruturar um "Debounce de Estado" para exibir tela de carregamento (loading) centralizada 
 * APENAS se houver gargalo de processamento/atraso real superior a 80 milissegundos.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. CONFIGURAÇÕES INICIAIS E VARIÁVEIS DE ESTADO
    // ==========================================
    
    // Instancia o objeto Date padrão para pegar o momento exato do acesso do usuário
    let dataAtual = new Date();
    let anoAtual = dataAtual.getFullYear(); // Ex: 2026
    let mesAtual = dataAtual.getMonth();    // Retorna número de 0 (Jan) a 11 (Dez)

    // Matriz de tradução dos meses para exibição no cabeçalho
    const nomesMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Banco de Dados Simulado de Eventos (Chaveados por "ANO-MÊS-DIA")
    // Nota: O mês no JavaScript vai de 0 a 11 (Maio é o número 5, Junho é o número 6, etc.)
    const eventosEscolares = {
        "2026-5-5": { titulo: "Entrega do P.I.", tipo: "avaliacao", desc: "Prazo limite para postagem do Projeto Integrador no portal.", hora: "23:59" },
        "2026-5-12": { titulo: "Reunião de Pais", tipo: "reuniao", desc: "Feedbacks de desempenho acadêmico e comportamento com a coordenação.", hora: "19:00" },
        "2026-5-19": { titulo: "Recesso", tipo: "recesso", desc: "Unidade Senac fechada devido ao feriado emenda.", hora: "O dia todo" },
        "2026-5-24": { titulo: "Avaliação Prática", tipo: "avaliacao", desc: "Desenvolvimento prático de banco de dados em laboratório.", hora: "19:30" }
    };

    // ==========================================
    // 2. FUNÇÃO CORE: RENDERIZAÇÃO DO CALENDÁRIO
    // ==========================================
    function renderizarCalendarioDinamico(mes, ano) {
        // Mapeia os alvos do HTML onde o conteúdo será injetado
        const container = document.getElementById('calendar-days-container');
        const listaLateral = document.getElementById('lista-eventos-lateral');
        const txtMesAno = document.getElementById('mes-ano-atual');
        
        // Bandeira de controle: diz se o loop de montagem do mês terminou a tempo
        let carregouInstantaneo = false;

        // ----------------------------------------------------
        // LOGICA DO LOADING DE SEGURANÇA (Debounce de 80ms)
        // ----------------------------------------------------
        setTimeout(() => {
            // Se o processador demorar mais de 80ms para rodar o script, este bloco assume a tela
            if (!carregouInstantaneo) {
                // Força o container a virar Flexbox (anulando o Grid temporariamente) para centralizar
                container.style.setProperty('display', 'flex', 'important');
                container.style.justifyContent = 'center';
                container.style.alignItems = 'center';
                container.style.minHeight = '250px';
                container.style.width = '100%';

                // Injeta o ícone giratório (spinner) e o texto de feedback visual
                container.innerHTML = `
                    <div class="d-flex flex-column align-items-center justify-content-center text-muted text-center fw-600 w-100 py-5">
                        <i class="fas fa-circle-notch fa-spin fa-2x mb-2 text-primary"></i>
                        <div class="small">Atualizando calendário...</div>
                    </div>
                `;
                listaLateral.innerHTML = '<div class="text-muted tiny p-2">Sincronizando compromissos...</div>';
                if (txtMesAno) txtMesAno.textContent = "Carregando...";
            }
        }, 600); // 80 milissegundos é teoricamente o limite máximo antes do olho humano perceber atraso

        // ----------------------------------------------------
        // PROCESSAMENTO DOS DIAS E ARQUITETURA DO MÊS
        // ----------------------------------------------------
        // Nota para Testes: Mude o "0" abaixo para "1500" para ver o loading funcionando em câmera lenta!
        setTimeout(() => {
            // Sucesso! Avisa o cronômetro lá de cima para abortar a tela de carregamento caso ela não tenha aparecido
            carregouInstantaneo = true;

            // Restaura as configurações padrão do CSS Grid para montar os quadradinhos dos dias
            container.style.setProperty('display', 'grid', 'important');
            container.style.minHeight = 'auto';
            container.innerHTML = ''; // Limpa os resíduos da tela (ou o ícone de loading)
            listaLateral.innerHTML = ''; // Limpa a barra lateral de eventos

            // Insere o nome do Mês atualizado no cabeçalho
            if (txtMesAno) txtMesAno.textContent = `${nomesMeses[mes]} de ${ano}`;

            // Mágica Matemática do Objeto Date:
            // 1. Descobre o dia da semana em que o dia 1 do mês cai (0 = Dom, 1 = Seg, 2 = Ter...)
            const primeiroDiaDaSemana = new Date(ano, mes, 1).getDay();
            // 2. Descobre o total de dias do mês. O dia "0" do mês seguinte retorna o último dia do mês atual (28, 30 ou 31)
            const totalDiasNoMes = new Date(ano, mes + 1, 0).getDate();

            // PASSO A: Desenhar os blocos vazios do início (Dias que pertencem ao mês anterior na folhinha)
            for (let i = 0; i < primeiroDiaDaSemana; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'calendar-cell outro-mes';
                container.appendChild(emptyCell);
            }

            // PASSO B: Construir os dias vigentes do mês
            for (let dia = 1; dia <= totalDiasNoMes; dia++) {
                const cell = document.createElement('div');
                cell.className = 'calendar-cell';
                
                // Validação de segurança: Destaca visualmente se o quadradinho é o dia de hoje real do sistema
                const hojeReal = new Date();
                if (dia === hojeReal.getDate() && mes === hojeReal.getMonth() && ano === hojeReal.getFullYear()) {
                    cell.classList.add('hoje');
                }

                // Cria o indexador textual para buscar eventos correspondentes a este dia específico
                const chaveData = `${ano}-${mes}-${dia}`;
                const evento = eventosEscolares[chaveData];
                
                // Base do esqueleto do dia (o numeral)
                let conteudoCell = `<span class="numero-dia">${dia}</span>`;

                // PASSO C: Se houver evento cadastrado para este dia, injeta os detalhes
                if (evento) {
                    // Escolha de cor condicional com base na gravidade/tipo do evento escolar
                    let corClasse = evento.tipo === 'avaliacao' ? 'bg-danger' : (evento.tipo === 'reuniao' ? 'bg-primary' : 'bg-success');
                    
                    // Concatena a bolinha e o título curto do evento dentro do quadradinho do dia
                    conteudoCell += `
                        <div class="event-tag-container">
                            <span class="event-dot-mini ${corClasse}"></span>
                            <span class="tiny fw-bold text-truncate d-block" style="font-size: 10px; color: #1e293b;">${evento.titulo}</span>
                        </div>
                    `;

                    // Interatividade: Abre um modal/alerta informativo detalhando o evento ao ser clicado
                    cell.onclick = () => {
                        alert(`📅 COMPROMISSO ACADÊMICO:\n\n📌 Evento: ${evento.titulo}\n⏰ Horário: ${evento.hora}\n\n📝 Descrição: ${evento.desc}`);
                    };

                    // Injeção de card correspondente na Linha do Tempo/Barra Lateral Direita
                    const card = document.createElement('div');
                    card.className = `item-evento-lateral ev-${evento.tipo}`;
                    card.innerHTML = `
                        <span class="badge ${corClasse} tiny mb-1">${dia} de ${nomesMeses[mes]}</span>
                        <h6 class="fw-bold mb-1 small" style="color: #1e293b;">${evento.titulo}</h6>
                        <p class="text-muted tiny mb-0">${evento.desc}</p>
                    `;
                    listaLateral.appendChild(card);
                }

                // Consolida o HTML construído e insere a célula finalizada no painel grid
                cell.innerHTML = conteudoCell;
                container.appendChild(cell);
            }

            // Fallback UX: Se o loop terminou e nenhum card foi injetado na lateral, exibe mensagem amigável de vazio
            if (listaLateral.innerHTML === '') {
                listaLateral.innerHTML = '<div class="text-muted tiny text-center p-4">Nenhum compromisso agendado para este mês.</div>';
            }

        }, 0); // Tempo zerado para que o navegador processe em tempo de execução imediato
    }

    // ==========================================
    // 3. CONTROLE DE NAVEGAÇÃO INTERATIVA (BOTÕES)
    // ==========================================
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnToday = document.getElementById('btn-today');

    // Valida se os botões existem na tela para evitar erros de referência nula no console
    if (btnPrev && btnNext) {
        // Libera os botões para clique (eles iniciam desativados como trava no HTML)
        btnPrev.removeAttribute('disabled');
        btnNext.removeAttribute('disabled');

        // Escuta o clique do botão "Mês Anterior"
        btnPrev.addEventListener('click', () => {
            mesAtual--; // Decrementa 1 na contagem do mês
            if (mesAtual < 0) { // Se passar de Janeiro, recua o ano e define como Dezembro
                mesAtual = 11;
                anoAtual--;
            }
            renderizarCalendarioDinamico(mesAtual, anoAtual); // Reconstrói o layout
        });

        // Escuta o clique do botão "Próximo Mês"
        btnNext.addEventListener('click', () => {
            mesAtual++; // Incrementa 1 na contagem do mês
            if (mesAtual > 11) { // Se passar de Dezembro, avança o ano e define como Janeiro
                mesAtual = 0;
                anoAtual++;
            }
            renderizarCalendarioDinamico(mesAtual, anoAtual); // Reconstrói o layout
        });
    }
    if (btnToday) {
        btnToday.addEventListener('click', () => {
            // Cria uma nova instância de data para pegar o "agora" real do sistema de novo
            const dataHoje = new Date();
            
            // Atualiza as variáveis globais de navegação para o mês e ano atuais reais
            mesAtual = dataHoje.getMonth();
            anoAtual = dataHoje.getFullYear();
            
            // Força o calendário a renderizar o mês correto e destacar o dia de hoje
            renderizarCalendarioDinamico(mesAtual, anoAtual);
        });
    }


    // ==========================================
    // 4. DISPARO DE INICIALIZAÇÃO AUTOMÁTICA
    // ==========================================
    // Executa a função pela primeira vez na carga da página usando o mês/ano reais capturados no início do script
    renderizarCalendarioDinamico(mesAtual, anoAtual);
});