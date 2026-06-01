document.addEventListener('DOMContentLoaded', () => {

    // Banco de dados simulado focado em Junho de 2026
    const eventosMapeados = {
        5: { titulo: "Entrega do P.I.", tipo: "avaliacao", desc: "Prazo limite para postagem do Projeto Integrador no portal do aluno.", hora: "23:59" },
        12: { titulo: "Reunião de Pais", tipo: "reuniao", desc: "Entrega de feedbacks de desempenho e comportamento com a coordenação.", hora: "19:00" },
        19: { titulo: "Recesso", tipo: "recesso", desc: "Unidade Senac fechada devido ao feriado emenda.", hora: "O dia todo" },
        24: { titulo: "Avaliação Prática", tipo: "avaliacao", desc: "Desenvolvimento prático em laboratório com o Professor Ricardo.", hora: "19:30" }
    };

    function renderizarMes() {
        const container = document.getElementById('calendar-days-container');
        const listaLateral = document.getElementById('lista-eventos-lateral');
        
        container.innerHTML = '';
        listaLateral.innerHTML = '';

        // Junho de 2026 começa em uma segunda-feira (coloca 1 célula vazia para o domingo anterior)
        const totalDias = 30;
        const offsetDias = 1; 

        // Cria a célula vazia do domingo
        for (let i = 0; i < offsetDias; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-cell outro-mes';
            container.appendChild(emptyCell);
        }

        // Cria os 30 dias de Junho
        for (let dia = 1; dia <= totalDias; dia++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            
            // Marca o dia 1 como "hoje" simulado
            if (dia === 1) cell.classList.add('hoje');

            const evento = eventosMapeados[dia];
            let conteudoCell = `<span class="numero-dia">${dia}</span>`;

            if (evento) {
                let corClasse = evento.tipo === 'avaliacao' ? 'bg-danger' : (evento.tipo === 'reuniao' ? 'bg-primary' : 'bg-success');
                
                conteudoCell += `
                    <div class="event-tag-container">
                        <span class="event-dot-mini ${corClasse}"></span>
                        <span class="tiny fw-bold text-truncate d-block" style="font-size: 10px; color: #1e293b;">${evento.titulo}</span>
                    </div>
                `;

                // Clique na célula mostra os detalhes em um alerta simples e limpo
                cell.onclick = () => {
                    alert(`📅 COMPROMISSO:\n\n${evento.titulo}\nHorário: ${evento.hora}\n\nDescrição: ${evento.desc}`);
                };

                // Adiciona o card correspondente na barra lateral de próximos compromissos
                const card = document.createElement('div');
                card.className = `item-evento-lateral ev-${evento.tipo}`;
                card.innerHTML = `
                    <span class="badge ${evento.tipo === 'avaliacao' ? 'bg-danger' : (evento.tipo === 'reuniao' ? 'bg-primary' : 'bg-success')} tiny mb-1">${dia} de Junho</span>
                    <h6 class="fw-bold mb-1 small" style="color: #1e293b;">${evento.titulo}</h6>
                    <p class="text-muted tiny mb-0">${evento.desc}</p>
                `;
                listaLateral.appendChild(card);
            }

            cell.innerHTML = conteudoCell;
            container.appendChild(cell);
        }
    }

    renderizarMes();
});