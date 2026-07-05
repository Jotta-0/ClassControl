document.addEventListener("DOMContentLoaded", () => {

  // ===================================================
  // 1. REVELAR / OCULTAR SENHA ATUAL
  // ===================================================

  // Botão usado para alternar a visibilidade da senha atual.
  const btnToggleSenha = document.getElementById("btn-toggle-senha");

  // Campo da senha atual.
  const inputSenhaAtual = document.getElementById("senha-atual");

  // Ícone de olho dentro do botão.
  const iconeOlho = document.getElementById("icone-olho");

  // Só ativa a função se os elementos existirem na página.
  if (btnToggleSenha && inputSenhaAtual && iconeOlho) {
    btnToggleSenha.addEventListener("click", () => {

      // Se a senha estiver oculta, mostra o texto.
      if (inputSenhaAtual.type === "password") {
        inputSenhaAtual.type = "text";
        iconeOlho.className = "fas fa-eye text-primary";
        return;
      }

      // Se a senha estiver visível, oculta novamente.
      inputSenhaAtual.type = "password";
      iconeOlho.className = "fas fa-eye-slash text-muted";
    });
  }

  // ===================================================
  // 2. ENVIO DO FORMULÁRIO DE DADOS ADMINISTRATIVOS
  // ===================================================

  // Formulário responsável pelos dados do administrador.
  const formDadosAdmin = document.getElementById("form-dados-admin");

  // Só adiciona o evento se o formulário existir.
  if (formDadosAdmin) {
    formDadosAdmin.addEventListener("submit", (e) => {

      // Impede o recarregamento da página.
      e.preventDefault();

      // Neste momento a alteração é apenas visual/local.
      alert("Dados administrativos salvos com sucesso!");
    });
  }

  // ===================================================
  // 3. ENVIO DO FORMULÁRIO DE ALTERAÇÃO DE SENHA
  // ===================================================

  // Formulário usado para alterar a senha.
  const formSenha = document.getElementById("form-alterar-senha");

  // Só ativa se o formulário existir.
  if (formSenha) {
    formSenha.addEventListener("submit", (e) => {

      // Impede o envio tradicional do formulário.
      e.preventDefault();

      // Captura a nova senha digitada.
      const novaSenha = document.getElementById("nova-senha").value;

      // Captura a confirmação da nova senha.
      const confirmaSenha = document.getElementById("confirma-senha").value;

      // Confere se os dois campos são iguais.
      if (novaSenha !== confirmaSenha) {
        alert("Erro: a nova senha e a confirmação não são iguais.");
        return;
      }

      // Exibe confirmação visual para o administrador.
      alert("Senha atualizada com sucesso!");

      // Limpa os campos do formulário de senha.
      formSenha.reset();

      // Depois de salvar, volta a esconder a senha atual se ela estiver visível.
      if (inputSenhaAtual && inputSenhaAtual.type === "text") {
        inputSenhaAtual.type = "password";
        iconeOlho.className = "fas fa-eye-slash text-muted";
      }
    });
  }

  // ===================================================
  // 4. PREFERÊNCIAS DE NOTIFICAÇÃO
  // ===================================================

  // Seleciona todos os switches editáveis de notificação.
  const switchesNotificacao = document.querySelectorAll(".switch-laranja");

  // Adiciona um comportamento simples ao alterar qualquer preferência.
  switchesNotificacao.forEach((switchItem) => {
    switchItem.addEventListener("change", () => {

      // Guarda o estado atual do switch.
      const estaAtivo = switchItem.checked;

      // Apenas registra no console por enquanto.
      console.log("Preferência de notificação alterada:", estaAtivo);
    });
  });

});