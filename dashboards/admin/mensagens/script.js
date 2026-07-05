document.addEventListener("DOMContentLoaded", () => {
  // Formulário responsável pelo envio da mensagem.
  const formChat = document.getElementById("form-enviar-mensagem");

  // Campo onde o administrador digita a mensagem.
  const inputMsg = document.getElementById("input-texto-mensagem");

  // Área onde ficam todos os balões do chat.
  const feedConteiner = document.getElementById("feed-mensagens-container");

  // Ao abrir a página, joga a rolagem para o final do chat.
  if (feedConteiner) {
    feedConteiner.scrollTop = feedConteiner.scrollHeight;
  }

  // Garante que os elementos existem antes de ativar o envio.
  if (formChat && inputMsg && feedConteiner) {
    formChat.addEventListener("submit", (e) => {
      // Impede o formulário de recarregar a página.
      e.preventDefault();

      // Pega o texto digitado e remove espaços extras.
      const texto = inputMsg.value.trim();

      // Se não tiver texto, não envia nada.
      if (texto === "") return;

      // Pega o horário atual do sistema.
      const agora = new Date();

      // Formata a hora no padrão HH:MM.
      const horaFormatada =
        agora.getHours().toString().padStart(2, "0") +
        ":" +
        agora.getMinutes().toString().padStart(2, "0");

      // Cria o balão da mensagem enviada pelo administrador.
      const novaMsgBox = document.createElement("div");

      // Mantém a mesma classe visual usada no exemplo do professor.
      novaMsgBox.className = "msg-box msg-enviada mb-3";

      // Monta o conteúdo visual do balão.
      novaMsgBox.innerHTML = `
        <div class="msg-conteudo card p-2 text-white border-0 shadow-xs" style="background-color: #004A8D;">
          <p class="mb-0 small">${texto}</p>
          <span class="text-end font-xs text-light opacity-75 mt-1">${horaFormatada}</span>
        </div>
      `;

      // Adiciona a nova mensagem no final do chat.
      feedConteiner.appendChild(novaMsgBox);

      // Limpa o campo depois do envio.
      inputMsg.value = "";

      // Leva a rolagem suavemente até a última mensagem enviada.
      feedConteiner.scrollTo({
        top: feedConteiner.scrollHeight,
        behavior: "smooth"
      });
    });
  }
});