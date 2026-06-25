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
                iconeOlho.className = 'fas fa-eye text-primary'; 
            } else {
                inputSenhaAtual.type = 'password';
                iconeOlho.className = 'fas fa-eye-slash text-muted'; 
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
        const cpfOriginal = inputCpf.value; 
        
        const gerarMascaraCpf = (cpf) => {
            if (cpf.length >= 14) {
                return `${cpf.substring(0, 4)}***.***${cpf.substring(11)}`;
            }
            return cpf;
        };

        inputCpf.value = gerarMascaraCpf(cpfOriginal);

        btnToggleCpf.addEventListener('click', () => {
            if (inputCpf.value.includes('*')) {
                inputCpf.value = cpfOriginal;
                iconeCadeado.className = 'fas fa-lock-open text-primary';
                btnToggleCpf.title = "Ocultar CPF";
            } else {
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
    // 4. ENVIO DO FORMULÁRIO DE ALTERAÇÃO DE SENHA (CORRIGIDO)
    // ===================================================
    const formSenha = document.getElementById('form-alterar-senha');
    if (formSenha) {
        formSenha.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Busca os elementos de forma explícita por ID para evitar erros de índice dinâmico
            const novaSenha = document.getElementById('nova-senha').value;
            const confirmaSenha = document.getElementById('confirma-senha').value;

            if (novaSenha !== confirmaSenha) {
                alert('❌ Erro: A nova senha e a confirmação não são idênticas. Tente novamente.');
                return;
            }

            alert('🔒 Senha atualizada com sucesso! Use suas novas credenciais no próximo acesso.');
            formSenha.reset();
            
            if (inputSenhaAtual && inputSenhaAtual.type === 'text') {
                inputSenhaAtual.type = 'password';
                iconeOlho.className = 'fas fa-eye-slash text-muted';
            }
        });
    }
});