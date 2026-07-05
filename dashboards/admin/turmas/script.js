import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Conecta o JavaScript ao seu projeto Supabase.
const supabase = createClient(
  "https://motbailfflvxstzvicxs.supabase.co",
  "sb_publishable_zUfZDfv9iSzNh_eIUYGhhg_NclbJRa1"
);

// ===============================
// ELEMENTOS DA ÁREA DE TURMAS
// ===============================

// Formulário usado para criar uma nova turma.
const form = document.getElementById("turmaForm");

// Select onde serão carregados os professores do banco.
const professorSelect = document.getElementById("professor");

// Select onde serão carregados os cursos do banco.
const cursoSelect = document.getElementById("curso");

// Corpo da tabela onde as turmas aparecem.
const tabelaTurmasCompleta = document.getElementById("tabela-turmas-completa");

// Campo de busca por nome da turma.
const inputBusca = document.getElementById("input-busca-turma");

// Filtro de turmas por turno.
const filtroTurno = document.getElementById("filtro-turno");

// ===============================
// ELEMENTOS DA ÁREA DE ALUNOS
// ===============================

// Tabela que mostra os alunos já matriculados na turma selecionada.
const tabelaAlunosMatriculados = document.getElementById("tabela-alunos-matriculados");

// Contador visual de alunos matriculados.
const contadorAlunos = document.getElementById("contador-alunos");

// Nome da turma exibido dentro do modal de gerenciamento.
const nomeTurmaModal = document.getElementById("nome-turma-modal");

// Área onde aparecem os alunos disponíveis para matrícula.
const listaAlunosDisponiveis = document.getElementById("lista-alunos-disponiveis");

// Formulário usado para matricular alunos na turma.
const formMatricularAlunos = document.getElementById("formMatricularAlunos");

// ===============================
// ESTADOS DA PÁGINA
// ===============================

// Guarda as turmas carregadas do banco para permitir busca e filtro sem nova consulta.
let cacheTurmas = [];

// Guarda todos os alunos cadastrados no banco.
let todosAlunos = [];

// Guarda somente os IDs dos alunos já matriculados na turma aberta.
let alunosMatriculadosIds = new Set();

// Guarda a turma que está sendo gerenciada no momento.
let turmaSelecionada = null;

// ===============================
// CARREGAR PROFESSORES
// ===============================

async function carregarProfessores() {
  // Busca professores no banco para preencher o select.
  const { data, error } = await supabase
    .from("professores")
    .select("id_professor, nome")
    .order("nome");

  // Se der erro, exibe no console e para a função.
  if (error) {
    console.error("Erro ao buscar professores:", error);
    return;
  }

  // Opção inicial do select.
  professorSelect.innerHTML = "<option value=''>Selecione o Professor</option>";

  // Cria uma option para cada professor encontrado.
  data.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id_professor;
    option.textContent = p.nome;
    professorSelect.appendChild(option);
  });
}

// ===============================
// CARREGAR CURSOS
// ===============================

async function carregarCursos() {
  // Busca cursos no banco para preencher o select.
  const { data, error } = await supabase
    .from("cursos")
    .select("id, nome")
    .order("nome");

  // Se der erro, exibe no console e para a função.
  if (error) {
    console.error("Erro ao buscar cursos:", error);
    return;
  }

  // Opção inicial do select.
  cursoSelect.innerHTML = "<option value=''>Selecione o Curso</option>";

  // Cria uma option para cada curso encontrado.
  data.forEach(curso => {
    const option = document.createElement("option");
    option.value = curso.id;
    option.textContent = curso.nome;
    cursoSelect.appendChild(option);
  });
}

// ===============================
// CARREGAR TODOS OS ALUNOS
// ===============================

async function carregarTodosAlunos() {
  // Busca todos os alunos cadastrados para depois permitir matrícula nas turmas.
  const { data, error } = await supabase
    .from("alunos")
    .select("id_aluno, nome, email")
    .order("nome");

  // Se der erro, exibe no console e para a função.
  if (error) {
    console.error("Erro ao carregar alunos:", error);
    return;
  }

  // Salva os alunos em memória para usar no modal.
  todosAlunos = data || [];
}

// ===============================
// BUSCAR E EXIBIR TURMAS
// ===============================

async function buscarEExibirTurmas() {
  // Busca as turmas e também os dados relacionados de professor e curso.
  const { data, error } = await supabase
    .from("turma")
    .select(`
      id,
      nome_turma,
      turno_turma,
      professores ( nome ),
      cursos ( nome )
    `)
    .order("nome_turma", { ascending: true });

  // Se der erro, exibe no console e para a função.
  if (error) {
    console.error("Erro ao carregar lista de turmas:", error);
    return;
  }

  // Guarda as turmas localmente.
  cacheTurmas = data || [];

  // Renderiza a tabela usando os filtros atuais.
  filtrarERenderizarTabela();
}

// ===============================
// FILTRAR E RENDERIZAR TABELA
// ===============================

function filtrarERenderizarTabela() {
  // Texto digitado na busca.
  const termoBusca = inputBusca.value.toLowerCase().trim();

  // Turno selecionado no filtro.
  const turnoSel = filtroTurno.value;

  // Limpa a tabela antes de montar novamente.
  tabelaTurmasCompleta.innerHTML = "";

  // Filtra as turmas pelo nome e pelo turno.
  const turmasFiltradas = cacheTurmas.filter(t => {
    const nomeTurma = t.nome_turma || "";
    const combinaTexto = nomeTurma.toLowerCase().includes(termoBusca);
    const combinaTurno = turnoSel === "Todos" || t.turno_turma === turnoSel;

    return combinaTexto && combinaTurno;
  });

  // Caso nenhuma turma passe pelos filtros.
  if (turmasFiltradas.length === 0) {
    tabelaTurmasCompleta.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted py-4 small">
          Nenhuma turma localizada no banco de dados.
        </td>
      </tr>
    `;
    return;
  }

  // Monta uma linha na tabela para cada turma filtrada.
  turmasFiltradas.forEach(t => {
    const nomeProfessor = t.professores ? t.professores.nome : "Não Atribuído";
    const nomeCurso = t.cursos ? t.cursos.nome : "Não Atribuído";

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><span class="fw-bold text-dark">${t.nome_turma}</span></td>

      <td>
        <span class="badge bg-light text-dark border fw-semibold">
          ${t.turno_turma || "Não informado"}
        </span>
      </td>

      <td class="text-muted small">
        <i class="fas fa-user-tie me-1"></i> ${nomeProfessor}
      </td>

      <td class="text-muted small">
        <i class="fas fa-book me-1"></i> ${nomeCurso}
      </td>

      <td class="text-center">
        <button
          class="btn btn-sm btn-light border text-primary me-1"
          onclick="abrirGerenciamentoAlunos('${t.id}')"
          title="Gerenciar Alunos"
        >
          <i class="fas fa-users"></i>
        </button>

        <button
          class="btn btn-sm btn-light border text-danger"
          onclick="deletarTurmaBanco('${t.id}')"
          title="Excluir Turma"
        >
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;

    tabelaTurmasCompleta.appendChild(tr);
  });
}

// ===============================
// CRIAR NOVA TURMA
// ===============================

form.addEventListener("submit", async e => {
  // Impede o recarregamento da página ao enviar o formulário.
  e.preventDefault();

  // Captura os valores preenchidos no modal.
  const nome_turma = document.getElementById("nome_turma").value.trim();
  const turno_turma = document.getElementById("turno_turma").value;
  const id_professor = professorSelect.value;
  const id_curso = cursoSelect.value;

  // Valida se o nome da turma foi informado.
  if (!nome_turma) {
    alert("Informe o nome da turma.");
    return;
  }

  // Valida se professor e curso foram selecionados.
  if (!id_professor || !id_curso) {
    alert("Selecione professor e curso.");
    return;
  }

  // Insere a nova turma na tabela turma.
  const { error } = await supabase
    .from("turma")
    .insert([
      {
        nome_turma,
        turno_turma,
        id_professor,
        id_curso
      }
    ]);

  // Se der erro, avisa o usuário.
  if (error) {
    alert("Erro ao criar turma: " + error.message);
    console.error(error);
    return;
  }

  // Limpa o formulário após criar.
  form.reset();

  // Fecha o modal de criação.
  const modalElement = document.getElementById("modalNovaTurma");
  const modalInstancia = bootstrap.Modal.getInstance(modalElement);

  if (modalInstancia) {
    modalInstancia.hide();
  }

  // Atualiza a tabela com a nova turma.
  buscarEExibirTurmas();
});

// ===============================
// EXCLUIR TURMA
// ===============================

window.deletarTurmaBanco = async idTurma => {
  // Confirma antes de apagar definitivamente.
  if (!confirm("Deseja realmente excluir esta turma definitivamente do banco de dados?")) {
    return;
  }

  // Apaga a turma pelo campo id da tabela turma.
  const { error } = await supabase
    .from("turma")
    .delete()
    .eq("id", idTurma);

  // Se der erro, avisa o usuário.
  if (error) {
    alert("Erro ao deletar: " + error.message);
    return;
  }

  // Atualiza a tabela após excluir.
  buscarEExibirTurmas();
};

// ===============================
// ABRIR GERENCIAMENTO DE ALUNOS
// ===============================

window.abrirGerenciamentoAlunos = async idTurma => {
  // Procura no cache a turma clicada.
  turmaSelecionada = cacheTurmas.find(t => String(t.id) === String(idTurma));

  // Se não encontrar, evita abrir o modal vazio.
  if (!turmaSelecionada) {
    alert("Turma não encontrada.");
    return;
  }

  // Mostra o nome da turma no modal.
  nomeTurmaModal.textContent = turmaSelecionada.nome_turma;

  // Carrega os alunos dessa turma antes de abrir o modal.
  await atualizarPainelTurma();

  // Abre o modal de gerenciamento de alunos.
  const modalEl = document.getElementById("modalGerenciarAlunos");
  const modalInstance = new bootstrap.Modal(modalEl);

  modalInstance.show();
};

// ===============================
// ATUALIZAR ALUNOS MATRICULADOS
// ===============================

async function atualizarPainelTurma() {
  // Garante que existe uma turma selecionada.
  if (!turmaSelecionada) {
    return;
  }

  // Busca os vínculos da turma com os dados dos alunos.
  const { data, error } = await supabase
    .from("turma_alunos")
    .select(`
      id_aluno,
      alunos ( id_aluno, nome, email )
    `)
    .eq("id_turma", turmaSelecionada.id);

  // Se der erro, exibe no console e para a função.
  if (error) {
    console.error("Erro ao carregar alunos vinculados:", error);
    return;
  }

  // Limpa o conjunto de IDs antes de montar de novo.
  alunosMatriculadosIds.clear();

  // Limpa a tabela de alunos matriculados.
  tabelaAlunosMatriculados.innerHTML = "";

  // Caso não exista aluno matriculado.
  if (!data || data.length === 0) {
    contadorAlunos.textContent = "0";

    tabelaAlunosMatriculados.innerHTML = `
      <tr>
        <td colspan="3" class="text-center py-4 text-muted">
          <i class="fas fa-info-circle me-1"></i>
          Nenhum aluno matriculado nesta turma ainda.
        </td>
      </tr>
    `;
  } else {
    // Atualiza o contador.
    contadorAlunos.textContent = data.length;

    // Monta uma linha para cada aluno matriculado.
    data.forEach(item => {
      const aluno = item.alunos;

      // Evita erro caso o vínculo exista, mas o aluno não venha no relacionamento.
      if (!aluno) return;

      // Guarda o ID para impedir que o mesmo aluno apareça na lista de disponíveis.
      alunosMatriculadosIds.add(aluno.id_aluno);

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td class="ps-4 fw-700 text-dark">${aluno.nome}</td>

        <td class="text-muted">
          ${aluno.email || "Não informado"}
        </td>

        <td class="text-end pe-4">
          <button
            class="btn btn-sm btn-outline-danger btn-remover"
            data-id="${aluno.id_aluno}"
            title="Remover da Turma"
          >
            <i class="fas fa-user-minus"></i>
          </button>
        </td>
      `;

      tabelaAlunosMatriculados.appendChild(tr);
    });

    // Adiciona o evento de remoção em cada botão criado na tabela.
    document.querySelectorAll(".btn-remover").forEach(botao => {
      botao.addEventListener("click", () => removerAlunoDaTurma(botao.getAttribute("data-id")));
    });
  }

  // Atualiza a lista de alunos que ainda podem ser matriculados.
  renderizarListaModal();
}

// ===============================
// RENDERIZAR ALUNOS DISPONÍVEIS
// ===============================

function renderizarListaModal() {
  // Limpa a lista antes de montar novamente.
  listaAlunosDisponiveis.innerHTML = "";

  // Filtra somente alunos que ainda não estão na turma.
  const disponiveis = todosAlunos.filter(aluno => {
    return !alunosMatriculadosIds.has(aluno.id_aluno);
  });

  // Caso todos os alunos já estejam matriculados.
  if (disponiveis.length === 0) {
    listaAlunosDisponiveis.innerHTML = `
      <p class="text-muted mb-0 text-center py-2">
        Todos os alunos do banco já estão cadastrados nesta turma!
      </p>
    `;
    return;
  }

  // Cria um checkbox para cada aluno disponível.
  disponiveis.forEach(aluno => {
    const div = document.createElement("div");
    div.className = "form-check py-1 border-bottom border-light";

    div.innerHTML = `
      <input
        class="form-check-input"
        type="checkbox"
        value="${aluno.id_aluno}"
        id="chk_${aluno.id_aluno}"
      >

      <label
        class="form-check-label d-block ms-2 text-dark fw-600"
        for="chk_${aluno.id_aluno}"
        style="cursor:pointer;"
      >
        ${aluno.nome}
        <span class="text-muted small d-block" style="font-weight:400;">
          ${aluno.email || ""}
        </span>
      </label>
    `;

    listaAlunosDisponiveis.appendChild(div);
  });
}

// ===============================
// MATRICULAR ALUNOS NA TURMA
// ===============================

formMatricularAlunos.addEventListener("submit", async e => {
  // Impede o formulário de recarregar a página.
  e.preventDefault();

  // Garante que uma turma está aberta no modal.
  if (!turmaSelecionada) {
    alert("Nenhuma turma selecionada.");
    return;
  }

  // Pega todos os checkboxes marcados.
  const checkboxes = listaAlunosDisponiveis.querySelectorAll("input[type='checkbox']:checked");

  // Obriga selecionar pelo menos um aluno.
  if (checkboxes.length === 0) {
    alert("Por favor, selecione pelo menos um aluno para matricular.");
    return;
  }

  // Monta os vínculos que serão inseridos na tabela turma_alunos.
  const novosVinculos = Array.from(checkboxes).map(chk => ({
    id_turma: turmaSelecionada.id,
    id_aluno: chk.value
  }));

  // Insere os alunos selecionados na turma.
  const { error } = await supabase
    .from("turma_alunos")
    .insert(novosVinculos);

  // Se der erro, avisa o usuário.
  if (error) {
    alert("Erro ao matricular alunos: " + error.message);
    return;
  }

  // Atualiza o painel após a matrícula.
  await atualizarPainelTurma();

  // Desmarca os checkboxes depois de salvar.
  formMatricularAlunos.reset();
});

// ===============================
// REMOVER ALUNO DA TURMA
// ===============================

async function removerAlunoDaTurma(id_aluno) {
  // Garante que existe turma selecionada.
  if (!turmaSelecionada) {
    return;
  }

  // Confirma antes de remover o vínculo.
  if (!confirm("Tem certeza que deseja remover este aluno desta turma?")) {
    return;
  }

  // Remove apenas o vínculo entre aluno e turma, não apaga o aluno do banco.
  const { error } = await supabase
    .from("turma_alunos")
    .delete()
    .eq("id_turma", turmaSelecionada.id)
    .eq("id_aluno", id_aluno);

  // Se der erro, avisa o usuário.
  if (error) {
    alert("Erro ao remover aluno: " + error.message);
    return;
  }

  // Atualiza a lista depois da remoção.
  await atualizarPainelTurma();
}

// ===============================
// BUSCA E FILTRO DA TABELA
// ===============================

// Controla o atraso da busca para não filtrar a cada tecla instantaneamente.
let tempoDebounce;

// Aplica busca com pequeno atraso enquanto o usuário digita.
inputBusca.addEventListener("input", () => {
  clearTimeout(tempoDebounce);
  tempoDebounce = setTimeout(filtrarERenderizarTabela, 300);
});

// Aplica filtro quando o turno muda.
filtroTurno.addEventListener("change", filtrarERenderizarTabela);

// ===============================
// INICIALIZAÇÃO DA PÁGINA
// ===============================

async function iniciar() {
  // Carrega os selects do modal de nova turma.
  await carregarProfessores();

  // Carrega os cursos disponíveis.
  await carregarCursos();

  // Carrega os alunos para o modal de matrícula.
  await carregarTodosAlunos();

  // Carrega e mostra as turmas na tabela principal.
  await buscarEExibirTurmas();
}

// Começa tudo quando o arquivo JS é carregado.
iniciar();