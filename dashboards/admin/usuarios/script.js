// Reaproveita a função de cadastro que já existe na pasta cadastro.
import { signUp } from "../cadastro/auth/auth.js";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Conecta o JavaScript ao seu projeto Supabase.
const supabase = createClient(
  "https://motbailfflvxstzvicxs.supabase.co",
  "sb_publishable_zUfZDfv9iSzNh_eIUYGhhg_NclbJRa1"
);

document.addEventListener("DOMContentLoaded", () => {
    // ===================================================
    // 1. BANCO LOCAL DE USUÁRIOS
    // ===================================================

    // Recupera usuários salvos no navegador ou cria uma lista inicial.
    let bancoUsuarios = [];

    // Se ainda não existir nada salvo, salva a lista inicial.
    if (!localStorage.getItem("classcontrol_usuarios")) {
        localStorage.setItem("classcontrol_usuarios", JSON.stringify(bancoUsuarios));
    }

    // ===================================================
    // 2. ELEMENTOS PRINCIPAIS DA PÁGINA
    // ===================================================

    // Corpo da tabela onde os usuários são renderizados.
    const tabelaCorpo = document.getElementById("tabela-usuarios-completa");

    // Campo de busca por nome, e-mail ou CPF.
    const inputBusca = document.getElementById("input-busca");

    // Select usado para filtrar por cargo.
    const filtroCargo = document.getElementById("filtro-cargo");

    // Formulário do modal de novo usuário.
    const formCadastro = document.getElementById("cadastroForm");

    // Modal de novo usuário controlado pelo JavaScript.
    const modalNovoUsuario = new bootstrap.Modal(document.getElementById("modalNovoUsuario"));

    // Modal de edição já existente.
    const modalEditar = new bootstrap.Modal(document.getElementById("modalEditarUsuario"));

    // Formulário do modal de edição.
    const formEditar = document.getElementById("form-editar-usuario");

    // ===================================================
    // 3. VALIDAR CPF
    // ===================================================

    function validarCPF(cpf) {
        // Remove pontos, traços e qualquer caractere que não seja número.
        cpf = cpf.replace(/[^\d]+/g, "");

        // CPF precisa ter 11 números e não pode ser uma sequência repetida.
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        // Validação do primeiro dígito verificador.
        let soma = 0;

        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }

        let resto = (soma * 10) % 11;

        if (resto === 10 || resto === 11) {
            resto = 0;
        }

        if (resto !== parseInt(cpf.charAt(9))) {
            return false;
        }

        // Validação do segundo dígito verificador.
        soma = 0;

        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }

        resto = (soma * 10) % 11;

        if (resto === 10 || resto === 11) {
            resto = 0;
        }

        return resto === parseInt(cpf.charAt(10));
    }

    // ===================================================
    // 4. CONVERTER TIPO DO CADASTRO PARA CARGO DA TABELA
    // ===================================================

    function converterTipoParaCargo(tipo) {
        // O cadastro usa valores técnicos; a tabela usa nomes legíveis.
        const tipos = {
            ADM: "Administrador",
            PROFESSOR: "Professor",
            ALUNO: "Aluno",
            RESPONSAVEL: "Responsável"
        };

        return tipos[tipo] || tipo;
    }

    // ===================================================
    // 5. MASCARAR CPF NA TABELA
    // ===================================================

    function mascararCPF(cpf) {
        // Caso o CPF esteja vazio.
        if (!cpf) return "Não informado";

        // Remove qualquer caractere que não seja número.
        const limpo = cpf.replace(/\D/g, "");

        // Se não tiver 11 números, mostra como veio.
        if (limpo.length !== 11) return cpf;

        // Mostra só parte do CPF por privacidade.
        return `***.${limpo.substring(3, 6)}.${limpo.substring(6, 9)}-**`;
    }

    // ===================================================
    // 6. RENDERIZAR USUÁRIOS NA TABELA
    // ===================================================

    function renderizarUsuarios() {
        // Texto digitado no campo de busca.
        const termoBusca = inputBusca.value.toLowerCase();

        // Cargo selecionado no filtro.
        const cargoSelecionado = filtroCargo.value;

        // Filtra usuários por busca e cargo.
        const usuariosFiltrados = bancoUsuarios.filter(usuario => {
            const cpfLimpo = usuario.cpf ? usuario.cpf.replace(/\D/g, "") : "";

            const correspondeBusca =
                usuario.nome.toLowerCase().includes(termoBusca) ||
                usuario.email.toLowerCase().includes(termoBusca) ||
                cpfLimpo.includes(termoBusca);

            const correspondeCargo =
                cargoSelecionado === "Todos" || usuario.cargo === cargoSelecionado;

            return correspondeBusca && correspondeCargo;
        });

        // Mensagem exibida quando nenhum usuário combina com os filtros.
        if (usuariosFiltrados.length === 0) {
            tabelaCorpo.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted py-4">
                        Nenhum usuário encontrado com os filtros aplicados.
                    </td>
                </tr>
            `;
            return;
        }

        // Monta as linhas da tabela.
        tabelaCorpo.innerHTML = usuariosFiltrados.map(usuario => {
            const estaAtivo = usuario.status === "Ativo";

            // Define ícone e cor do botão de ativar/desativar.
            const acaoIcone = estaAtivo ? "fas fa-user-slash" : "fas fa-user-check";
            const acaoTitulo = estaAtivo ? "Desativar Usuário" : "Reativar Usuário";
            const acaoCorBg = estaAtivo ? "rgba(220, 53, 69, 0.1)" : "rgba(40, 167, 69, 0.1)";
            const acaoCorTexto = estaAtivo ? "#dc3545" : "#28a745";

            // Busca o índice real no array principal.
            const indexReal = bancoUsuarios.findIndex(u => u.email === usuario.email);

            return `
                <tr>
                    <td class="fw-bold text-dark ps-3">${usuario.nome}</td>

                    <td>
                        <span class="badge bg-light text-secondary border px-2 py-1" style="font-size: 11px;">
                            ${usuario.cargo}
                        </span>
                    </td>

                    <td>${mascararCPF(usuario.cpf)}</td>
                    <td>${usuario.email}</td>
                    <td class="text-muted tiny">${usuario.acesso || "Sem acessos"}</td>

                    <td>
                        <span class="badge-status ${estaAtivo ? "status-ativo" : "status-inativo"}"
                              style="cursor: pointer;"
                              onclick="alterarStatusUsuario(${indexReal})">
                            ${usuario.status}
                        </span>
                    </td>

                    <td class="text-center pe-3">
                        <div class="d-flex justify-content-center gap-2">
                            <button class="btn btn-sm d-flex align-items-center justify-content-center"
                                    title="Editar Usuário"
                                    onclick="editarUsuario(${indexReal})"
                                    style="width: 32px; height: 32px; border-radius: 8px; background-color: rgba(255, 193, 7, 0.1); color: #ffc107; border: none;">
                                <i class="fas fa-edit fs-6"></i>
                            </button>

                            <button class="btn btn-sm d-flex align-items-center justify-content-center"
                                    title="${acaoTitulo}"
                                    onclick="alterarStatusUsuario(${indexReal})"
                                    style="width: 32px; height: 32px; border-radius: 8px; background-color: ${acaoCorBg}; color: ${acaoCorTexto}; border: none;">
                                <i class="${acaoIcone} fs-6"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");
    }

    // ===================================================
    // 7. CADASTRAR NOVO USUÁRIO NO MODAL
    // ===================================================

    formCadastro.addEventListener("submit", async (e) => {
        // Impede a página de recarregar.
        e.preventDefault();

        // Captura os dados preenchidos no modal.
        const nome = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const cpf = document.getElementById("cpf").value.trim();
        const password = document.getElementById("password").value;
        const tipo = document.getElementById("tipo").value;

        // Valida o CPF antes de tentar criar a conta.
        if (!validarCPF(cpf)) {
            alert("CPF inválido");
            return;
        }

        // Usa a função já existente na pasta cadastro/auth/auth.js.
        const { success, error } = await signUp(email, password, cpf, nome, tipo);

        // Se o Supabase retornar erro, mostra o problema e para.
        if (!success) {
            alert(`Erro ao cadastrar: ${error}`);
            return;
        }

        // Adiciona o usuário na tabela local da tela de usuários.
        bancoUsuarios.push({
            nome,
            cargo: converterTipoParaCargo(tipo),
            cpf,
            email,
            acesso: "Sem acessos",
            status: "Ativo"
        });

        // Salva a lista atualizada no localStorage.
        localStorage.setItem("classcontrol_usuarios", JSON.stringify(bancoUsuarios));

        // Limpa o formulário, fecha o modal e atualiza a tabela.
        formCadastro.reset();
        modalNovoUsuario.hide();
        renderizarUsuarios();

        alert("Cadastro realizado com sucesso!");
    });

    // ===================================================
    // 8. ALTERAR STATUS DO USUÁRIO
    // ===================================================

    window.alterarStatusUsuario = (index) => {
        const usuario = bancoUsuarios[index];

        // Segurança caso o índice não exista.
        if (!usuario) return;

        // Se estiver ativo, confirma desativação.
        if (usuario.status === "Ativo") {
            if (!confirm(`Deseja desativar o usuário ${usuario.nome}? Ele continuará no histórico do sistema.`)) {
                return;
            }

            usuario.status = "Inativo";
        } else {
            // Se estiver inativo, confirma reativação.
            if (!confirm(`Deseja reativar o acesso do usuário ${usuario.nome}?`)) {
                return;
            }

            usuario.status = "Ativo";
        }

        // Salva e redesenha a tabela.
        localStorage.setItem("classcontrol_usuarios", JSON.stringify(bancoUsuarios));
        renderizarUsuarios();
    };

    // ===================================================
    // 9. ABRIR MODAL DE EDIÇÃO
    // ===================================================

    window.editarUsuario = (index) => {
        const usuario = bancoUsuarios[index];

        // Segurança caso o usuário não seja encontrado.
        if (!usuario) return;

        // Preenche os campos do modal com os dados atuais.
        document.getElementById("editar-index").value = index;
        document.getElementById("editar-nome").value = usuario.nome;
        document.getElementById("editar-email").value = usuario.email;
        document.getElementById("editar-cpf").value = usuario.cpf;
        document.getElementById("editar-cargo").value = usuario.cargo;

        // Abre o modal de edição.
        modalEditar.show();
    };

    // ===================================================
    // 10. SALVAR EDIÇÃO DO USUÁRIO
    // ===================================================

    formEditar.addEventListener("submit", (e) => {
        // Impede recarregamento da página.
        e.preventDefault();

        // Recupera o índice do usuário sendo editado.
        const index = document.getElementById("editar-index").value;

        // Atualiza os dados no array principal.
        bancoUsuarios[index].nome = document.getElementById("editar-nome").value.trim();
        bancoUsuarios[index].email = document.getElementById("editar-email").value.trim();
        bancoUsuarios[index].cpf = document.getElementById("editar-cpf").value.trim();
        bancoUsuarios[index].cargo = document.getElementById("editar-cargo").value;

        // Salva a lista atualizada.
        localStorage.setItem("classcontrol_usuarios", JSON.stringify(bancoUsuarios));

        // Fecha o modal e atualiza a tabela.
        modalEditar.hide();
        renderizarUsuarios();
    });

    // ===================================================
    // 11. BUSCA E FILTRO
    // ===================================================

    // Atualiza a tabela enquanto o usuário digita.
    inputBusca.addEventListener("input", renderizarUsuarios);

    // Atualiza a tabela quando o filtro de cargo muda.
    filtroCargo.addEventListener("change", renderizarUsuarios);

    // ===================================================
    // 12. INICIALIZAÇÃO
    // ===================================================

    // Mostra os usuários ao abrir a página.
    async function carregarUsuariosDoBanco() {

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        window.location.href = "../../../login.html";
        return;
    }

    // Descobre quem está logado
    const { data: usuarioLogado, error: erroUsuario } = await supabase
        .from("usuarios")
        .select("tipo_de_usuario")
        .eq("auth_user_id", user.id)
        .single();

    if (erroUsuario) {
        console.error(erroUsuario);
        return;
    }

    // Permite acesso apenas ao administrador
    if (usuarioLogado.tipo_de_usuario !== "ADM") {
        alert("Acesso negado.");
        return;
    }

    // Busca todos os usuários cadastrados
    const { data, error } = await supabase
        .from("usuarios")
        .select(`
            id_usuario,
            nome,
            email,
            cpf,
            tipo_de_usuario
        `)
        .order("nome");

    if (error) {
        console.error(error);
        return;
    }

    bancoUsuarios = data.map(usuario => ({
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        cpf: usuario.cpf,
        cargo: converterTipoParaCargo(usuario.tipo_de_usuario),
        acesso: "-",
        status: "Ativo"
    }));

    renderizarUsuarios();
}
   carregarUsuariosDoBanco();
});