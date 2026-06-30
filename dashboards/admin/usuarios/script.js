document.addEventListener('DOMContentLoaded', () => {
    // Simulação do Banco de Dados ou Recuperação do LocalStorage compartilhada
    let bancoUsuarios = JSON.parse(localStorage.getItem('classcontrol_usuarios')) || [
        { nome: "João Silva", cargo: "Administrador", email: "joao@classcontrol.com", acesso: "14/03/2026", status: "Ativo" },
        { nome: "Maria Santos", cargo: "Professor", email: "maria@classcontrol.com", acesso: "13/03/2026", status: "Ativo" },
        { nome: "Pedro Costa", cargo: "Professor", email: "pedro@classcontrol.com", acesso: "13/03/2026", status: "Inativo" },
        { nome: "Ana Oliveira", cargo: "Aluno", email: "ana@classcontrol.com", acesso: "13/03/2026", status: "Ativo" }
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

        const usuariosFiltrados = bancoUsuarios.filter(u => {
            const correspondeBusca = u.nome.toLowerCase().includes(termoBusca) || u.email.toLowerCase().includes(termoBusca);
            const correspondeCargo = cargoSelecionado === 'Todos' || u.cargo === cargoSelecionado;
            return correspondeBusca && correspondeCargo;
        });

        if (usuariosFiltrados.length === 0) {
            tabelaCorpo.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Nenhum usuário encontrado com os filtros aplicados.</td></tr>`;
            return;
        }

        tabelaCorpo.innerHTML = usuariosFiltrados.map((usuario, index) => `
            <tr>
                <td class="fw-bold text-dark">${usuario.nome}</td>
                <td><span class="badge bg-light text-secondary border px-2 py-1" style="font-size: 11px;">${usuario.cargo}</span></td>
                <td>${usuario.email}</td>
                <td class="text-muted tiny">${usuario.acesso || 'Sem acessos'}</td>
                <td>
                    <span class="badge-status ${usuario.status === 'Ativo' ? 'status-ativo' : 'status-inativo'}" 
                          style="cursor: pointer;" onclick="alterarStatusUsuario(${index})">
                        ${usuario.status}
                    </span>
                </td>
                <td class="text-center">
                    <button class="btn-mini text-warning me-2" title="Editar Usuário"><i class="fas fa-edit"></i></button>
                    <button class="btn-mini text-danger" title="Excluir Definitivamente" onclick="excluirUsuario(${index})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    // Funções expostas globalmente no escopo do window para os atributos onclick funcionarem
    window.alterarStatusUsuario = (index) => {
        bancoUsuarios[index].status = bancoUsuarios[index].status === 'Ativo' ? 'Inativo' : 'Ativo';
        localStorage.setItem('classcontrol_usuarios', JSON.stringify(bancoUsuarios));
        renderizarUsuarios();
    };

    window.excluirUsuario = (index) => {
        if (confirm(`Tem certeza de que deseja remover permanentemente o usuário ${bancoUsuarios[index].nome}?`)) {
            bancoUsuarios.splice(index, 1);
            localStorage.setItem('classcontrol_usuarios', JSON.stringify(bancoUsuarios));
            renderizarUsuarios();
        }
    };

    // Escutadores de Eventos para os Filtros
    inputBusca.addEventListener('input', renderizarUsuarios);
    filtroCargo.addEventListener('change', renderizarUsuarios);

    // Renderização Inicial
    renderizarUsuarios();
});