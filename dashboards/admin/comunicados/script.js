document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // ELEMENTOS PRINCIPAIS DA PÁGINA
  // ===============================

  // Formulário do modal usado para criar/enviar comunicado.
  const formComunicado = document.getElementById("form-comunicado");

  // Container onde os cards de comunicados aparecem.
  const containerComunicados = document.getElementById("container-comunicados");

  // Select usado para filtrar comunicados por categoria.
  const filtro = document.getElementById("filtro-comunicados");

  // Campo de busca por título ou texto do comunicado.
  const busca = document.getElementById("busca-comunicados");

  // ===============================
  // FUNÇÃO PARA ESCAPAR TEXTO
  // ===============================

  function escaparHTML(texto) {
    // Evita que textos digitados no formulário sejam interpretados como HTML.
    return texto
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ===============================
  // DEFINIR ESTILO POR CATEGORIA
  // ===============================

  function obterDadosCategoria(categoria) {
    // Define textos, cores e classes conforme a categoria selecionada.
    const categorias = {
      urgente: {
        texto: "Urgente",
        badge: "bg-danger",
        classeCard: "urgente"
      },
      importante: {
        texto: "Importante",
        badge: "bg-warning text-dark",
        classeCard: "importante"
      },
      geral: {
        texto: "Geral",
        badge: "bg-primary",
        classeCard: ""
      }
    };

    // Retorna os dados da categoria ou usa "geral" como segurança.
    return categorias[categoria] || categorias.geral;
  }

  // ===============================
  // FORMATAR DATA DO COMUNICADO
  // ===============================

  function obterDataAtualFormatada() {
    // Pega a data e hora atuais do sistema.
    const agora = new Date();

    // Formata a hora em HH:MM.
    const hora = agora.getHours().toString().padStart(2, "0");
    const minutos = agora.getMinutes().toString().padStart(2, "0");

    // Retorna no mesmo estilo visual do exemplo dos alunos.
    return `Hoje, ${hora}:${minutos}`;
  }

  // ===============================
  // CRIAR CARD DE COMUNICADO
  // ===============================

  function criarCardComunicado(titulo, categoria, destinatario, mensagem) {
    // Busca as configurações visuais da categoria.
    const dadosCategoria = obterDadosCategoria(categoria);

    // Cria a coluna que envolve o card.
    const item = document.createElement("div");

    // Mantém a mesma classe usada no exemplo dos alunos.
    item.className = "col-12 item-comunicado";

    // Guarda a categoria no HTML para o filtro funcionar.
    item.setAttribute("data-categoria", categoria);

    // Guarda textos em atributos para facilitar a busca.
    item.setAttribute("data-titulo", titulo.toLowerCase());
    item.setAttribute("data-mensagem", mensagem.toLowerCase());

    // Monta o card visualmente seguindo o padrão dos comunicados dos alunos.
    item.innerHTML = `
      <div class="card border-0 shadow-sm card-comunicado-custom ${dadosCategoria.classeCard}">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <span class="badge ${dadosCategoria.badge} mb-2 px-3 py-1 text-uppercase fw-700 font-xs">
                ${dadosCategoria.texto}
              </span>

              <h5 class="fw-700 card-titulo-aviso" style="color: #1e293b;">
                ${escaparHTML(titulo)}
              </h5>
            </div>

            <span class="text-muted tiny fw-600">
              <i class="far fa-calendar-alt me-1"></i> ${obterDataAtualFormatada()}
            </span>
          </div>

          <p class="text-muted small mb-3 texto-comunicado">
            ${escaparHTML(mensagem)}
          </p>

          <div class="d-flex justify-content-between align-items-center pt-2 border-top">
            <span class="tiny text-muted">
              Enviado por: <strong>Administração</strong> para <strong>${escaparHTML(destinatario)}</strong>
            </span>

            <button class="btn btn-link btn-sm text-decoration-none font-xs fw-700 text-danger p-0 btn-excluir-comunicado">
              <i class="fas fa-trash-alt me-1"></i>Excluir
            </button>
          </div>
        </div>
      </div>
    `;

    // Coloca o comunicado novo no topo da lista.
    containerComunicados.prepend(item);
  }

  // ===============================
  // ENVIAR NOVO COMUNICADO
  // ===============================

  if (formComunicado) {
    formComunicado.addEventListener("submit", (e) => {
      // Impede o formulário de recarregar a página.
      e.preventDefault();

      // Captura os campos do modal.
      const titulo = document.getElementById("titulo-comunicado").value.trim();
      const categoria = document.getElementById("categoria-comunicado").value;
      const destinatario = document.getElementById("destinatario-comunicado").value;
      const mensagem = document.getElementById("texto-comunicado").value.trim();

      // Garante que título e mensagem foram preenchidos.
      if (!titulo || !mensagem) {
        alert("Preencha o título e a mensagem do comunicado.");
        return;
      }

      // Cria o card do comunicado enviado.
      criarCardComunicado(titulo, categoria, destinatario, mensagem);

      // Limpa o formulário depois de enviar.
      formComunicado.reset();

      // Fecha o modal após o envio.
      const modalElement = document.getElementById("modalNovoComunicado");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);

      if (modalInstance) {
        modalInstance.hide();
      }

      // Reaplica os filtros atuais depois de inserir o novo comunicado.
      filtrarComunicados();
    });
  }

  // ===============================
  // FILTRAR COMUNICADOS
  // ===============================

  function filtrarComunicados() {
    // Categoria selecionada no filtro.
    const categoriaSelecionada = filtro ? filtro.value : "todos";

    // Texto digitado na busca.
    const termoBusca = busca ? busca.value.toLowerCase().trim() : "";

    // Pega todos os cards existentes na tela.
    const itens = document.querySelectorAll(".item-comunicado");

    itens.forEach(item => {
      // Lê a categoria do card.
      const categoriaItem = item.getAttribute("data-categoria");

      // Lê título e mensagem para comparar com a busca.
      const tituloItem = item.getAttribute("data-titulo") || item.querySelector(".card-titulo-aviso")?.textContent.toLowerCase() || "";
      const mensagemItem = item.getAttribute("data-mensagem") || item.querySelector(".texto-comunicado")?.textContent.toLowerCase() || "";

      // Verifica se passa no filtro de categoria.
      const combinaCategoria = categoriaSelecionada === "todos" || categoriaItem === categoriaSelecionada;

      // Verifica se passa na busca textual.
      const combinaBusca = tituloItem.includes(termoBusca) || mensagemItem.includes(termoBusca);

      // Mostra ou esconde o card conforme os filtros.
      item.style.display = combinaCategoria && combinaBusca ? "block" : "none";
    });
  }

  // ===============================
  // EXCLUIR COMUNICADO
  // ===============================

  containerComunicados.addEventListener("click", (e) => {
    // Procura se o clique foi em um botão de excluir.
    const botaoExcluir = e.target.closest(".btn-excluir-comunicado");

    // Se não foi, não faz nada.
    if (!botaoExcluir) return;

    // Confirma antes de remover o comunicado da tela.
    if (!confirm("Deseja excluir este comunicado?")) return;

    // Remove o card inteiro do comunicado.
    botaoExcluir.closest(".item-comunicado").remove();
  });

  // ===============================
  // EVENTOS DE BUSCA E FILTRO
  // ===============================

  if (filtro) {
    filtro.addEventListener("change", filtrarComunicados);
  }

  if (busca) {
    busca.addEventListener("input", filtrarComunicados);
  }
});