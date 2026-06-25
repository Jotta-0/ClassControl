/**
 * ClassControl - Sistema de Gestão Escolar
 * Módulo: Mural de Avisos Dinâmico (Professor)
 */

document.addEventListener('DOMContentLoaded', () => {

    // ===================================================
    // 1. ESTADO INICIAL / BANCO DE DADOS MOCKADO
    // ===================================================
    const avisosPostados = [
        {
            id: 1,
            titulo: "Entrega do P.I. adiada!",
            categoria: "urgente",
            mensagem: "Atenção turma, a entrega da documentação da primeira sprint do Projeto Integrador foi prorrogada para a próxima sexta-feira. Não haverá novas exceções.",
            data: "24/06/2026"
        },
        {
            id: 2,
            titulo: "Material da Aula de POO Disponível",
            categoria: "geral",
            mensagem: "Os slides apresentados na última aula sobre Herança e Polimorfismo, juntamente com a lista de exercícios práticos, já foram anexados ao repositório oficial.",
            data: "22/06/2026"
        },
        {
            id: 3,
            titulo: "Workshop de Carreira em Tecnologia",
            categoria: "evento",
            mensagem: "Convidamos todos para a palestra magna com recrutadores de grandes tech companies que ocorrerá no auditório central às 19h30.",
            data: "18/06/2026"
        }
    ];

    // Mapeamento visual das categorias (Estilos base do Bootstrap)
    const configsCategoria = {
        urgente: { badge: "bg-danger", borda: "#ef4444", icon: "fas fa-exclamation-triangle" },
        geral: { badge: "bg-primary", borda: "#004A8D", icon: "fas fa-bullhorn" },
        evento: { badge: "bg-success", borda: "#10b981", icon: "fas fa-calendar-day" }
    };

    // ===================================================
    // 2. FUNÇÃO CORE: RENDERIZAR OS CARDS DO MURAL
    // ===================================================
    function renderizarMuralAvisos() {
        const container = document.getElementById('container-mural-avisos');
        if (!container) return;

        container.innerHTML = '';

        if (avisosPostados.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center text-muted py-5">
                    <i class="fas fa-folder-open fa-2x mb-2 text-muted" style="opacity: 0.5;"></i>
                    <div class="small fw-600">Nenhum aviso publicado para esta turma.</div>
                </div>
            `;
            return;
        }

        // Renderiza os cards (do mais recente para o mais antigo)
        [...avisosPostados].reverse().forEach(aviso => {
            const config = configsCategoria[aviso.categoria] || configsCategoria.geral;
            
            const col = document.createElement('div');
            col.className = "col-xl-4 col-md-6 col-12";
            
            col.innerHTML = `
                <div class="card h-100 border-0 shadow-sm p-4 position-relative" style="border-radius: 14px; border-left: 6px solid ${config.borda} !important; background-color: #f8fafc;">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <span class="badge ${config.badge} tiny text-uppercase fw-bold px-2 py-1" style="border-radius: 6px;">
                            <i class="${config.icon} me-1"></i> ${aviso.categoria}
                        </span>
                        <span class="tiny text-muted fw-600">${aviso.data}</span>
                    </div>
                    <h6 class="fw-800 text-dark mb-2">${aviso.titulo}</h6>
                    <p class="text-secondary small mb-3 fw-500" style="line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;">
                        ${aviso.mensagem}
                    </p>
                    <div class="mt-auto d-flex justify-content-end">
                        <button class="btn btn-link text-danger p-0 tiny fw-bold text-decoration-none btn-remover-aviso" data-id="${aviso.id}">
                            <i class="far fa-trash-alt me-1"></i> Remover
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });

        // Adiciona evento de remoção aos botões recém-criados
        document.querySelectorAll('.btn-remover-aviso').forEach(btn => {
            btn.addEventListener('click', function() {
                const idAviso = parseInt(this.getAttribute('data-id'));
                removerAviso(idAviso);
            });
        });
    }

    // ===================================================
    // 3. EVENTO: CADASTRO DE NOVO AVISO
    // ===================================================
    const formAviso = document.getElementById('form-novo-aviso');
    if (formAviso) {
        formAviso.addEventListener('submit', (e) => {
            e.preventDefault();

            const inputs = formAviso.querySelectorAll('input, select, textarea');
            const titulo = inputs[0].value;
            const categoria = inputs[1].value;
            const mensagem = inputs[2].value;

            // Gera data formatada no padrão BR (DD/MM/YYYY)
            const hoje = new Date();
            const dataStr = `${hoje.getDate() < 10 ? '0' + hoje.getDate() : hoje.getDate()}/${(hoje.getMonth() + 1) < 10 ? '0' + (hoje.getMonth() + 1) : hoje.getMonth() + 1}/${hoje.getFullYear()}`;

            // Insere na lista
            avisosPostados.push({
                id: Date.now(), // ID único baseado no timestamp
                titulo: titulo,
                categoria: categoria,
                mensagem: mensagem,
                data: dataStr
            });

            // Limpa o formulário e recolhe o modal do Bootstrap
            formAviso.reset();
            const modalElement = document.getElementById('modalNovoAviso');
            const modalInstancia = bootstrap.Modal.getInstance(modalElement);
            if (modalInstancia) modalInstancia.hide();

            // Atualiza a tela instantaneamente
            renderizarMuralAvisos();
        });
    }

    // ===================================================
    // 4. FUNÇÃO: REMOVER AVISO
    // ===================================================
    function removerAviso(id) {
        if (confirm("Deseja realmente apagar este comunicado do mural da turma?")) {
            const index = avisosPostados.findIndex(a => a.id === id);
            if (index !== -1) {
                avisosPostados.splice(index, 1);
                renderizarMuralAvisos();
            }
        }
    }

    // Inicialização automática na carga da página
    renderizarMuralAvisos();
});