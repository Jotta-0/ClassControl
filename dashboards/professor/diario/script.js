import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Conexão com o Supabase, reaproveitando a chave que já existe no projeto.
const supabase = createClient(
  "https://motbailfflvxstzvicxs.supabase.co",
  "sb_publishable_zUfZDfv9iSzNh_eIUYGhhg_NclbJRa1"
);

document.addEventListener("DOMContentLoaded", async () => {
  // ===================================================
  // 1. ELEMENTOS PRINCIPAIS DA PÁGINA
  // ===================================================

  const dataChamada = document.getElementById("data-chamada");
  const tabelaChamada = document.getElementById("tabela-chamada-corpo");
  const tabelaNotas = document.getElementById("tabela-notas-corpo");
  const btnPresencaGeral = document.getElementById("btn-presenca-geral");
  const btnSalvarChamada = document.getElementById("btn-salvar-chamada");
  const btnPublicarNotas = document.getElementById("btn-publicar-notas");

  const formOcorrencia = document.getElementById("formOcorrencia");
  const modalOcorrencia = new bootstrap.Modal(document.getElementById("modalOcorrencia"));

  // Guarda o professor logado para registrar ocorrência automaticamente.
  let idProfessorLogado = null;

  // Chave usada para salvar os registros qualitativos no navegador.
  const CHAVE_DIARIO = "classcontrol_diario_qualitativo";

  // ===================================================
  // 2. BASE DE ALUNOS
  // ===================================================

  let listaAlunos = [];

  const alunosMockados = [
    {
      id_aluno: "202601",
      mat: "202601",
      nome: "Ana Beatriz Ramos",
      frequencia: "Excelente",
      ucs: {
        uc1: "Atendido",
        uc2: "Atendido",
        projeto: "Atendido"
      }
    },
    {
      id_aluno: "202602",
      mat: "202602",
      nome: "Bruno Henrique Costa",
      frequencia: "Boa",
      ucs: {
        uc1: "Parcialmente atendido",
        uc2: "Atendido",
        projeto: "Parcialmente atendido"
      }
    },
    {
      id_aluno: "202603",
      mat: "202603",
      nome: "Carlos Eduardo da Silva",
      frequencia: "Mediana",
      ucs: {
        uc1: "Não atendido",
        uc2: "Parcialmente atendido",
        projeto: "Não atendido"
      }
    }
  ];

  // ===================================================
  // 3. OPÇÕES QUALITATIVAS
  // ===================================================

  const opcoesFrequencia = [
    "Excelente",
    "Boa",
    "Mediana",
    "Ruim",
    "Não frequente"
  ];

  const opcoesConceito = [
    "Atendido",
    "Parcialmente atendido",
    "Não atendido"
  ];

  // ===================================================
  // 4. DATA AUTOMÁTICA, MAS EDITÁVEL
  // ===================================================

  function obterDataAtualLocal() {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  }

  function configurarDataAtual() {
    if (!dataChamada) return;

    // Só preenche automaticamente se o campo estiver vazio.
    dataChamada.value = dataChamada.value || obterDataAtualLocal();
  }

  // ===================================================
  // 5. CARREGAR PROFESSOR LOGADO
  // ===================================================

  async function carregarProfessorLogado() {
    const professorNome = document.getElementById("professorNome");

    try {
      const { data: { user }, error: erroUser } = await supabase.auth.getUser();

      if (erroUser || !user) {
        professorNome.textContent = "Professor: não identificado";
        return;
      }

      const { data: usuario, error: erroUsuario } = await supabase
        .from("usuarios")
        .select("id_usuario, nome")
        .eq("auth_user_id", user.id)
        .single();

      if (erroUsuario || !usuario) {
        professorNome.textContent = "Professor: não identificado";
        return;
      }

      const { data: professor, error: erroProfessor } = await supabase
        .from("professores")
        .select("id_professor, nome")
        .eq("id_usuario", usuario.id_usuario)
        .single();

      if (erroProfessor || !professor) {
        professorNome.textContent = "Professor: não identificado";
        return;
      }

      idProfessorLogado = professor.id_professor;
      professorNome.textContent = "Professor: " + professor.nome;
    } catch (erro) {
      professorNome.textContent = "Professor: não identificado";
      console.error("Erro ao carregar professor:", erro);
    }
  }

  // ===================================================
  // 6. CARREGAR ALUNOS
  // ===================================================

  function recuperarDiarioSalvo() {
    return JSON.parse(localStorage.getItem(CHAVE_DIARIO)) || {};
  }

  function aplicarEstadoSalvo(alunos) {
    const diarioSalvo = recuperarDiarioSalvo();

    return alunos.map((aluno) => {
      const salvo = diarioSalvo[String(aluno.id_aluno)] || {};

      return {
        ...aluno,
        frequencia: salvo.frequencia || aluno.frequencia || "Boa",
        ucs: {
          uc1: salvo.ucs?.uc1 || aluno.ucs?.uc1 || "Parcialmente atendido",
          uc2: salvo.ucs?.uc2 || aluno.ucs?.uc2 || "Parcialmente atendido",
          projeto: salvo.ucs?.projeto || aluno.ucs?.projeto || "Parcialmente atendido"
        }
      };
    });
  }

  async function carregarAlunos() {
    try {
      const { data, error } = await supabase
        .from("alunos")
        .select("id_aluno, nome")
        .order("nome");

      if (error || !data || data.length === 0) {
        listaAlunos = aplicarEstadoSalvo(alunosMockados);
        return;
      }

      const alunosBanco = data.map((aluno) => ({
        id_aluno: aluno.id_aluno,
        mat: aluno.id_aluno,
        nome: aluno.nome,
        frequencia: "Boa",
        ucs: {
          uc1: "Parcialmente atendido",
          uc2: "Parcialmente atendido",
          projeto: "Parcialmente atendido"
        }
      }));

      listaAlunos = aplicarEstadoSalvo(alunosBanco);
    } catch (erro) {
      listaAlunos = aplicarEstadoSalvo(alunosMockados);
      console.error("Erro ao carregar alunos:", erro);
    }
  }

  // ===================================================
  // 7. SALVAR ESTADO LOCAL DO DIÁRIO
  // ===================================================

  function salvarEstadoDiario() {
    const estado = {};

    listaAlunos.forEach((aluno) => {
      estado[String(aluno.id_aluno)] = {
        frequencia: aluno.frequencia,
        ucs: aluno.ucs
      };
    });

    localStorage.setItem(CHAVE_DIARIO, JSON.stringify(estado));
  }

  // ===================================================
  // 8. FUNÇÕES DE APOIO VISUAL
  // ===================================================

  function escaparHTML(texto) {
    return String(texto)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function criarOptions(opcoes, valorAtual) {
    return opcoes.map((opcao) => {
      const selecionado = opcao === valorAtual ? "selected" : "";
      return `<option value="${opcao}" ${selecionado}>${opcao}</option>`;
    }).join("");
  }

  function obterSituacaoAluno(aluno) {
    const conceitos = Object.values(aluno.ucs);

    if (
      aluno.frequencia === "Não frequente" ||
      aluno.frequencia === "Ruim" ||
      conceitos.includes("Não atendido")
    ) {
      return {
        texto: "Acompanhamento",
        classe: "bg-danger"
      };
    }

    if (
      aluno.frequencia === "Excelente" &&
      conceitos.every((conceito) => conceito === "Atendido")
    ) {
      return {
        texto: "Evolução adequada",
        classe: "bg-success"
      };
    }

    return {
      texto: "Em desenvolvimento",
      classe: "bg-warning text-dark"
    };
  }

  // ===================================================
  // 9. RENDERIZAR DIÁRIO
  // ===================================================

  function carregarDiario() {
    if (!tabelaChamada || !tabelaNotas) return;

    tabelaChamada.innerHTML = "";
    tabelaNotas.innerHTML = "";

    listaAlunos.forEach((aluno) => {
      const situacao = obterSituacaoAluno(aluno);

      const trChamada = document.createElement("tr");

      trChamada.innerHTML = `
        <td class="fw-bold text-secondary">#${escaparHTML(aluno.mat)}</td>

        <td class="fw-bold">${escaparHTML(aluno.nome)}</td>

        <td class="text-center">
          <select class="form-select form-select-sm select-frequencia text-center fw-bold"
                  data-id="${aluno.id_aluno}"
                  style="border-radius: 8px;">
            ${criarOptions(opcoesFrequencia, aluno.frequencia)}
          </select>
        </td>

        <td class="text-center">
          <button type="button"
                  class="btn btn-sm btn-light border text-warning btn-ocorrencia"
                  data-id="${aluno.id_aluno}"
                  data-nome="${escaparHTML(aluno.nome)}"
                  title="Registrar ocorrência"
                  style="width: 34px; height: 34px; border-radius: 8px;">
            <i class="fas fa-triangle-exclamation"></i>
          </button>
        </td>
      `;

      tabelaChamada.appendChild(trChamada);

      const trNotas = document.createElement("tr");

      trNotas.innerHTML = `
        <td class="fw-bold text-secondary">#${escaparHTML(aluno.mat)}</td>

        <td class="fw-bold">${escaparHTML(aluno.nome)}</td>

        <td>
          <select class="form-select form-select-sm select-conceito text-center fw-bold"
                  data-id="${aluno.id_aluno}"
                  data-uc="uc1"
                  style="border-radius: 8px;">
            ${criarOptions(opcoesConceito, aluno.ucs.uc1)}
          </select>
        </td>

        <td>
          <select class="form-select form-select-sm select-conceito text-center fw-bold"
                  data-id="${aluno.id_aluno}"
                  data-uc="uc2"
                  style="border-radius: 8px;">
            ${criarOptions(opcoesConceito, aluno.ucs.uc2)}
          </select>
        </td>

        <td>
          <select class="form-select form-select-sm select-conceito text-center fw-bold"
                  data-id="${aluno.id_aluno}"
                  data-uc="projeto"
                  style="border-radius: 8px;">
            ${criarOptions(opcoesConceito, aluno.ucs.projeto)}
          </select>
        </td>

        <td class="text-center">
          <span class="badge ${situacao.classe}" id="situacao-${aluno.id_aluno}">
            ${situacao.texto}
          </span>
        </td>
      `;

      tabelaNotas.appendChild(trNotas);
    });
  }

  // ===================================================
  // 10. ATUALIZAR SITUAÇÃO DO ALUNO
  // ===================================================

  function atualizarSituacaoNaTela(idAluno) {
    const aluno = listaAlunos.find((item) => String(item.id_aluno) === String(idAluno));

    if (!aluno) return;

    const situacao = obterSituacaoAluno(aluno);
    const badge = document.getElementById(`situacao-${idAluno}`);

    if (!badge) return;

    badge.className = `badge ${situacao.classe}`;
    badge.textContent = situacao.texto;
  }

  // ===================================================
  // 11. EVENTOS DA PRESENÇA SEMANAL
  // ===================================================

  tabelaChamada.addEventListener("change", (e) => {
    if (!e.target.classList.contains("select-frequencia")) return;

    const idAluno = e.target.dataset.id;
    const aluno = listaAlunos.find((item) => String(item.id_aluno) === String(idAluno));

    if (!aluno) return;

    aluno.frequencia = e.target.value;

    salvarEstadoDiario();
    atualizarSituacaoNaTela(idAluno);
  });

  btnPresencaGeral.addEventListener("click", () => {
    listaAlunos.forEach((aluno) => {
      aluno.frequencia = "Excelente";
    });

    salvarEstadoDiario();
    carregarDiario();
  });

  btnSalvarChamada.addEventListener("click", () => {
    salvarEstadoDiario();
    alert("Presença semanal salva com sucesso!");
  });

  // ===================================================
  // 12. EVENTOS DOS CONCEITOS POR UC
  // ===================================================

  tabelaNotas.addEventListener("change", (e) => {
    if (!e.target.classList.contains("select-conceito")) return;

    const idAluno = e.target.dataset.id;
    const uc = e.target.dataset.uc;

    const aluno = listaAlunos.find((item) => String(item.id_aluno) === String(idAluno));

    if (!aluno) return;

    aluno.ucs[uc] = e.target.value;

    salvarEstadoDiario();
    atualizarSituacaoNaTela(idAluno);
  });

  btnPublicarNotas.addEventListener("click", () => {
    salvarEstadoDiario();
    alert("Conceitos publicados com sucesso!");
  });

  // ===================================================
  // 13. ABRIR MODAL DE OCORRÊNCIA
  // ===================================================

  tabelaChamada.addEventListener("click", (e) => {
    const botaoOcorrencia = e.target.closest(".btn-ocorrencia");

    if (!botaoOcorrencia) return;

    document.getElementById("aluno-ocorrencia-id").value = botaoOcorrencia.dataset.id;
    document.getElementById("aluno-ocorrencia-nome").textContent = botaoOcorrencia.dataset.nome;

    formOcorrencia.reset();
    modalOcorrencia.show();
  });

  // ===================================================
  // 14. REGISTRAR OCORRÊNCIA NO SUPABASE
  // ===================================================

  formOcorrencia.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const id_aluno = document.getElementById("aluno-ocorrencia-id").value;

    if (!idProfessorLogado) {
      alert("Professor não identificado. Faça login novamente.");
      return;
    }

    if (!nome || !descricao || !id_aluno) {
      alert("Preencha todos os dados da ocorrência.");
      return;
    }

    const { error } = await supabase
      .from("ocorrencia")
      .insert([
        {
          nome,
          descricao,
          id_aluno,
          id_professor: idProfessorLogado
        }
      ]);

    if (error) {
      alert("Erro ao registrar ocorrência: " + error.message);
      console.error(error);
      return;
    }

    alert("Ocorrência registrada com sucesso!");
    formOcorrencia.reset();
    modalOcorrencia.hide();
  });

  // ===================================================
  // 15. INICIALIZAÇÃO
  // ===================================================

  configurarDataAtual();
  await carregarProfessorLogado();
  await carregarAlunos();
  carregarDiario();
});