document.addEventListener('DOMContentLoaded', () => {
    const formChat = document.getElementById('form-enviar-mensagem');
    const inputMsg = document.getElementById('input-texto-mensagem');
    const feedContêiner = document.getElementById('feed-mensagens-container');

    // Força o chat a iniciar com a barra de rolagem lá embaixo (nas mensagens recentes)
    feedContêiner.scrollTop = feedContêiner.scrollHeight;

    if (formChat && inputMsg && feedContêiner) {
        formChat.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o recarregamento do formulário

            const texto = inputMsg.value.trim();
            if (texto === '') return;

            // Pega o horário real atual do sistema formatado
            const agora = new Date();
            const horaFormatada = agora.getHours().toString().padStart(2, '0') + ':' + agora.getMinutes().toString().padStart(2, '0');

            // Cria a div do balão de envio estruturado
            const novaMsgBox = document.createElement('div');
            novaMsgBox.className = 'msg-box msg-enviada mb-3';
            
            novaMsgBox.innerHTML = `
                <div class="msg-conteudo card p-2 text-white border-0 shadow-xs" style="background-color: #004A8D;">
                    <p class="mb-0 small">${texto}</p>
                    <span class="text-end font-xs text-light opacity-75 mt-1">${horaFormatada}</span>
                </div>
            `;

            // Injeta no feed de mensagens
            feedContêiner.appendChild(novaMsgBox);

            // Reseta o campo de texto
            inputMsg.value = '';

            // Scroll suave automático para a última mensagem enviada
            feedContêiner.animate({ scrollTop: feedContêiner.scrollHeight }, { duration: 200, fill: "forwards" });
            feedContêiner.scrollTop = feedContêiner.scrollHeight;
        });
    }
});