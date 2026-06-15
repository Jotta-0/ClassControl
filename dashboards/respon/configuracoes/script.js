document.addEventListener('DOMContentLoaded', () => {
    
    // ===================================================
    // 1. REVELAR / OCULTAR SENHA ATUAL
    // ===================================================
    const btnToggleSenha = document.getElementById('btn-toggle-senha');
    const inputSenhaAtual = document.getElementById('senha-atual');
    const iconeOlho = document.getElementById('icone-olho');

    if (btnToggleSenha && inputSenhaAtual && iconeOlho) {
        btnToggleSenha.addEventListener('click', () => {
            if (inputSenhaAtual.type === 'password') {
                inputSenhaAtual.type = 'text';
                iconeOlho.className = 'fas fa-eye text-primary'; // Olho aberto (laranja)
            } else {
                inputSenhaAtual.type = 'password';
                iconeOlho.className = 'fas fa-eye-slash text-muted'; // Olho fechado
            }
        });
    }

    // ===================================================
    // 2. PROTEÇÃO E MÁSCARA DO CPF (PRIVACIDADE)
    // ===================================================
    const inputCpf = document.getElementById('cpf-responsavel');
    const btnToggleCpf = document.getElementById('btn-toggle-cpf');
    const iconeCadeado = document.getElementById('icone-cadeado');

    if (inputCpf && btnToggleCpf && iconeCadeado) {
        // Guarda o CPF real original que veio do banco/HTML
        const cpfOriginal = inputCpf.value; 
        
        // Função que gera a versão mascarada (Ex: 123.***.***-00)
        const gerarMascaraCpf = (cpf) => {
            if (cpf.length >= 14) {
                return `${cpf.substring(0, 4)}***.***${cpf.substring(11)}`;
            }
            return cpf;
        };

        // Aplica a máscara logo ao carregar a página
        inputCpf.value = gerarMascaraCpf(cpfOriginal);

        btnToggleCpf.addEventListener('click', () => {
            // Se estiver mascarado, mostra o original e abre o cadeado
            if (inputCpf.value.includes('*')) {
                inputCpf.value = cpfOriginal;
                iconeCadeado.className = 'fas fa-lock-open text-primary';
                btnToggleCpf.title = "Ocultar CPF";
            } else {
                // Se estiver visível, esconde de novo
                inputCpf.value = gerarMascaraCpf(cpfOriginal);
                iconeCadeado.className = 'fas fa-lock text-muted';
                btnToggleCpf.title = "Mostrar CPF";
            }
        });
    }

    // ===================================================
    // 3. ENVIO DO FORMULÁRIO DE DADOS DE CONTATO
    // ===================================================
    const formDados = document.getElementById('form-dados-responsavel');
    if (formDados) {
        formDados.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('💾 Sucesso! Suas alterações cadastrais foram salvas no sistema da secretaria.');
        });
    }

    // ===================================================
    // 4. ENVIO DO FORMULÁRIO DE ALTERAÇÃO DE SENHA
    // ===================================================
    const formSenha = document.getElementById('form-alterar-senha');
    if (formSenha) {
        formSenha.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Captura os inputs de senha independente se estão como 'text' ou 'password'
            const inputs = formSenha.querySelectorAll('input[type="password"], input[type="text"]');
            
            // No seu HTML estruturado: index 1 é Nova Senha, index 2 é Confirmar Nova Senha
            const novaSenha = inputs[1].value;
            const confirmaSenha = inputs[2].value;

            if (novaSenha !== confirmaSenha) {
                alert('❌ Erro: A nova senha e a confirmação não são idênticas. Tente novamente.');
                return;
            }

            alert('🔒 Senha atualizada com sucesso! Use suas novas credenciais no próximo acesso.');
            formSenha.reset();
            
            // Se o olho da senha atual ficou aberto, força a fechar no reset
            if (inputSenhaAtual && inputSenhaAtual.type === 'text') {
                btnToggleSenha.click();
            }
        });
    }
});