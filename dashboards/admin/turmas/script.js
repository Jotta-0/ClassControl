import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Configuração do Cliente Supabase (Mantendo suas chaves originais)
const supabase = createClient(
  "https://motbailfflvxstzvicxs.supabase.co",
  "sb_publishable_zUfZDfv9iSzNh_eIUYGhhg_NclbJRa1"
);

// Mapeamento de Elementos do DOM
const form = document.getElementById("turmaForm");
const professorSelect = document.getElementById("professor");
const cursoSelect = document.getElementById("curso");
const tabelaTurmasCompleta = document.getElementById("tabela-turmas-completa");
const inputBusca = document.getElementById("input-busca-turma");
const filtroTurno = document.getElementById("filtro-turno");

// Variável para armazenar o estado local das turmas vindas do banco
let cacheTurmas = [];

// ✅ Carregar Professores (Sua função original integrada)
async function carregarProfessores() {
  const { data, error } = await supabase
    .from("professores")
    .select("id_professor, nome");

  if (error) {
    console.error("Erro ao buscar professores:", error);
    return;
  }

  professorSelect.innerHTML = "<option value=''>Selecione o Professor</option>";
  data.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id_professor;
    option.textContent = p.nome;
    professorSelect.appendChild(option);
  });
}

// ✅ Carregar Cursos (Sua função original integrada)
async function carregarCursos() {
  const { data, error } = await supabase
    .from("cursos")
    .select("id, nome");

  if (error) {
    console.error("Erro ao buscar cursos:", error);
    return;
  }

  cursoSelect.innerHTML = "<option value=''>Selecione o Curso</option>";
  data.forEach(curso => {
    const option = document.createElement("option");
    option.value = curso.id;
    option.textContent = curso.nome;
    cursoSelect.appendChild(option);
  });
}

// ✅ Buscar Turmas do Supabase com relacionamentos (Joins) para montar a tabela
async function buscarEExibirTurmas() {
  // Fazemos o select trazendo também os nomes das tabelas relacionadas (cursos e professores)
  const { data, error } = await supabase
    .from("turma")
    .select(`
      id_turma,
      nome_turma,
      turno_turma,
      professores ( nome ),
      cursos ( nome )
    `);

  if (error) {
    console.error("Erro ao carregar lista de turmas:", error);
    return;
  }

  cacheTurmas = data || [];
  filtrarERenderizarTabela();
}

// ✅ Função de Filtragem Dinâmica em Tempo Real (Padrão ClassControl)
function filtrarERenderizarTabela() {
  const termoBusca = inputBusca.value.toLowerCase().trim();
  const turnoSel = filtroTurno.value;

  tabelaTurmasCompleta.innerHTML = "";

  const turmasFiltradas = cacheTurmas.filter(t => {
    const combinaTexto = t.nome_turma.toLowerCase().includes(termoBusca);
    const combinaTurno = (turnoSel === "Todos" || t.turno_turma === turnoSel);
    return combinaTexto && combinaTurno;
  });

  if (turmasFiltradas.length === 0) {
    tabelaTurmasCompleta.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted py-4 small">Nenhuma turma localizada no banco de dados.</td>
      </tr>
    `;
    return;
  }

  turmasFiltradas.forEach(t => {
    // Tratando os retornos das chaves estrangeiras com segurança
    const nomeProfessor = t.professores ? t.professores.nome : "Não Atribuído";
    const nomeCurso = t.cursos ? t.cursos.nome : "Não Atribuído";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="fw-bold text-dark">${t.nome_turma}</span></td>
      <td><span class="badge bg-light text-dark border fw-semibold">${t.turno_turma}</span></td>
      <td class="text-muted small"><i class="fas fa-user-tie me-1"></i> ${nomeProfessor}</td>
      <td class="text-muted small"><i class="fas fa-book me-1"></i> ${nomeCurso}</td>
      <td class="text-center">
          <button class="btn btn-sm btn-light border text-danger" onclick="deletarTurmaBanco('${t.id_turma}')" title="Excluir Turma">
              <i class="fas fa-trash-alt"></i>
          </button>
      </td>
    `;
    tabelaTurmasCompleta.appendChild(tr);
  });
}

// ✅ Criar Turma (Seu EventListener do Form adaptado para fechar o Modal)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome_turma = document.getElementById("nome_turma").value;
  const turno_turma = document.getElementById("turno_turma").value;
  const id_professor = professorSelect.value;
  const id_curso = cursoSelect.value;

  if (!id_professor || !id_curso) {
    alert("Selecione professor e curso");
    return;
  }

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

  if (error) {
    alert("Erro ao criar turma: " + error.message);
    console.error(error);
  } else {
    alert("Turma criada com sucesso!");
    form.reset();
    
    // Fecha o modal automaticamente usando a API do Bootstrap
    const modalElement = document.getElementById('modalNovaTurma');
    const modalInstancia = bootstrap.Modal.getInstance(modalElement);
    if (modalInstancia) modalInstancia.hide();

    // Recarrega os dados atualizados direto do Supabase
    buscarEExibirTurmas();
  }
});

// ✅ Função Global para deletar direto no Supabase se precisar
window.deletarTurmaBanco = async (idTurma) => {
  if (confirm("Deseja realmente excluir esta turma definitivamente do banco de dados?")) {
    const { error } = await supabase
      .from("turma")
      .delete()
      .eq("id_turma", idTurma);

    if (error) {
      alert("Erro ao deletar: " + error.message);
    } else {
      buscarEExibirTurmas();
    }
  }
};

// Escutadores dos Filtros (Busca reativa)
let tempoDebounce;
inputBusca.addEventListener("input", () => {
  clearTimeout(tempoDebounce);
  tempoDebounce = setTimeout(filtrarERenderizarTabela, 300);
});
filtroTurno.addEventListener("change", filtrarERenderizarTabela);

// Inicialização da tela
carregarProfessores();
carregarCursos();
buscarEExibirTurmas();