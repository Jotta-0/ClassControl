document.addEventListener('DOMContentLoaded', () => {
    // Banco de Dados ou Recuperação do LocalStorage compartilhada
    let bancoUsuarios = JSON.parse(localStorage.getItem('classcontrol_usuarios')) || [
        { nome: "João Silva", cargo: "Administrador", cpf: "11111111111", email: "joao@classcontrol.com", acesso: "14/03/2026", status: "Ativo" },
        { nome: "Maria Santos", cargo: "Professor", cpf: "11111111111", email: "maria@classcontrol.com", acesso: "13/03/2026", status: "Ativo" },
        { nome: "Pedro Costa", cargo: "Professor", cpf: "11111111111", email: "pedro@classcontrol.com", acesso: "13/03/2026", status: "Inativo" },
        { nome: "Ana Oliveira", cargo: "Aluno", cpf: "11111111111", email: "ana@classcontrol.com", acesso: "13/03/2026", status: "Ativo" }
    ];

    // Salva o estado inicial caso não exista no LocalStorage
    if (!localStorage.getItem('classcontrol_usuarios')) {
        localStorage.setItem('classcontrol_usuarios', JSON.stringify(bancoUsuarios));
    }

    const tabelaCorpo = document.getElementById('tabela-usuarios-completa');
    const inputBusca = document.getElementById('input-busca');
    const filtroCargo = document.getElementById('filtro-cargo');

    // Função para renderizar as linhas da tabela aplicando os filtros ativos
    function renderizarUsuarios() {
        const termoBusca = inputBusca.value.toLowerCase();
        const cargoSelecionado = filtroCargo.value;

        // Filtra a lista com base no termo digitado e cargo escolhido
        const usuariosFiltrados = bancoUsuarios.filter(u => {
            const correspondeBusca = u.nome.toLowerCase().includes(termoBusca) || u.email.toLowerCase().includes(termoBusca);
            const correspondeCargo = cargoSelecionado === 'Todos' || u.cargo === cargoSelecionado;

            return correspondeBusca && correspondeCargo;
        });

        if (usuariosFiltrados.length === 0) {
            tabelaCorpo.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Nenhum usuário encontrado com os filtros aplicados.</td></tr>`;
            return;
        }

        tabelaCorpo.innerHTML = usuariosFiltrados.map((usuario, index) => {
            const estaAtivo = usuario.status === 'Ativo';
            const acaoIcone = estaAtivo ? 'fas fa-user-slash' : 'fas fa-user-check';
            const acaoTitulo = estaAtivo ? 'Desativar Usuário' : 'Reativar Usuário';
            const acaoCorBg = estaAtivo ? 'rgba(220, 53, 69, 0.1)' : 'rgba(40, 167, 69, 0.1)';
            const acaoCorTexto = estaAtivo ? '#dc3545' : '#28a745';

            // Encontra o index real no array original principal para passar à função global
            const indexReal = bancoUsuarios.findIndex(u => u.email === usuario.email);

            return `
                <tr>
                    <td class="fw-bold text-dark ps-3">${usuario.nome}</td>
                    <td><span class="badge bg-light text-secondary border px-2 py-1" style="font-size: 11px;">${usuario.cargo}</span></td>
                    <td>${mascararCPF(usuario.cpf)}</td>
                    <td>${usuario.email}</td>
                    <td class="text-muted tiny">${usuario.acesso || 'Sem acessos'}</td>
                    <td>
                        <span class="badge-status ${estaAtivo ? 'status-ativo' : 'status-inativo'}" 
                              style="cursor: pointer;" onclick="alterarStatusUsuario(${indexReal})">
                            ${usuario.status}
                        </span>
                    </td>
                    <td class="text-center pe-3">
                        <div class="d-flex justify-content-center gap-2">
                            <button class="btn btn-sm d-flex align-items-center justify-content-center" 
                                    title="Editar Usuário" 
                                    onclick="editarUsuario(${indexReal})"
                                    style="width: 32px; height: 32px; border-radius: 8px; background-color: rgba(255, 193, 7, 0.1); color: #ffc107; border: none; transition: all 0.2s ease;">
                                <i class="fas fa-edit fs-6"></i>
                            </button>
                            
                            <button class="btn btn-sm d-flex align-items-center justify-content-center" 
                                    title="${acaoTitulo}" 
                                    onclick="alterarStatusUsuario(${indexReal})"
                                    style="width: 32px; height: 32px; border-radius: 8px; background-color: ${acaoCorBg}; color: ${acaoCorTexto}; border: none; transition: all 0.2s ease;">
                                <i class="${acaoIcone} fs-6"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Funções expostas globalmente no window para os atributos onclick funcionarem
    window.alterarStatusUsuario = (index) => {
        const usuario = bancoUsuarios[index];
        const statusAtual = usuario.status;
        
        if (statusAtual === 'Ativo') {
            if (confirm(`Deseja desativar o usuário ${usuario.nome}? Ele continuará no histórico do sistema.`)) {
                usuario.status = 'Inativo';
            } else { return; }
        } else {
            if (confirm(`Deseja reativar o acesso do usuário ${usuario.nome}?`)) {
                usuario.status = 'Ativo';
            } else { return; }
        }

        localStorage.setItem('classcontrol_usuarios', JSON.stringify(bancoUsuarios));
        renderizarUsuarios();
    };

    // Inicializa o Modal do Bootstrap via JS para podermos controlá-lo aqui dentro
    const modalEditar = new bootstrap.Modal(document.getElementById('modalEditarUsuario'));
    const formEditar = document.getElementById('form-editar-usuario');

    // Função exposta globalmente para abrir o modal preenchido
    window.editarUsuario = (index) => {
        const usuario = bancoUsuarios[index];

        // Preenche os campos do formulário com os dados atuais do usuário
        document.getElementById('editar-index').value = index;
        document.getElementById('editar-nome').value = usuario.nome;
        document.getElementById('editar-email').value = usuario.email;
        document.getElementById('editar-cpf').value = usuario.cpf;
        document.getElementById('editar-cargo').value = usuario.cargo;
        
        // Abre o modal na tela
        modalEditar.show();
    };

    // Ouvinte do evento de envio (Submit) do formulário de edição
    formEditar.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede a página de recarregar

        // Recupera os valores atualizados do formulário
        const index = document.getElementById('editar-index').value;
        const nomeAtualizado = document.getElementById('editar-nome').value;
        const emailAtualizado = document.getElementById('editar-email').value;
        const cpfAtualizado = document.getElementById('editar-cpf').value;
        const cargoAtualizado = document.getElementById('editar-cargo').value;

        // Atualiza o objeto do usuário específico dentro do nosso array principal
        bancoUsuarios[index].nome = nomeAtualizado;
        bancoUsuarios[index].email = emailAtualizado;
        bancoUsuarios[index].cpf = cpfAtualizado
        bancoUsuarios[index].cargo = cargoAtualizado;

        // Salva a nova lista atualizada de volta no LocalStorage
        localStorage.setItem('classcontrol_usuarios', JSON.stringify(bancoUsuarios));

        // Fecha o modal de edição
        modalEditar.hide();

        // Recarrega as linhas da tabela na tela instantaneamente com os novos dados
        renderizarUsuarios();
    });

    // Escutadores de Eventos para os Filtros de busca dinâmica
    inputBusca.addEventListener('input', renderizarUsuarios);
    filtroCargo.addEventListener('change', renderizarUsuarios);

    function mascararCPF(cpf) {
        if (!cpf) return "Não informado";
        // Remove qualquer caractere que não seja número
        const limpo = cpf.replace(/\D/g, '');
        
        if (limpo.length !== 11) return cpf; // Caso o dado esteja inválido
        
        // Retorna no formato ***.456.789-**
        return `***.${limpo.substring(3, 6)}.${limpo.substring(6, 9)}-**`;
    }

    // Renderização Inicial
    renderizarUsuarios();
});