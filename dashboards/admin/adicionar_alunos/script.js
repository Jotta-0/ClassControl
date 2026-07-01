import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabase = createClient(
  "https://motbailfflvxstzvicxs.supabase.co",
  "sb_publishable_zUfZDfv9iSzNh_eIUYGhhg_NclbJRa1"
);

const form = document.getElementById("formTurmaAlunos");


// ✅ carregar turmas
async function carregarTurmas() {
  const { data, error } = await supabase
    .from("turma")
    .select("id, nome_turma");

  const select = document.getElementById("turma");

  select.innerHTML = "<option value=''>Selecione</option>";

  data.forEach(t => {
    const option = document.createElement("option");
    option.value = t.id;
    option.textContent = t.nome_turma;
    select.appendChild(option);
  });
}


// ✅ carregar alunos
async function carregarAlunos() {
  const { data, error } = await supabase
    .from("alunos")
    .select("*");

  console.log("ALUNOS:", data);
  console.log("ERRO:", error); // 🔥 importante

  const select = document.getElementById("alunos");

  if (data) {
    data.forEach(a => {
      const option = document.createElement("option");
      option.value = a.id_aluno;
      option.textContent = a.nome;
      select.appendChild(option);
    });
  }
}


// ✅ inserir alunos na turma
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id_turma = document.getElementById("turma").value;

  const alunosSelecionados = [
    ...document.getElementById("alunos").selectedOptions
  ].map(a => ({
    id_turma: id_turma,
    id_aluno: a.value
  }));

  const { error } = await supabase
    .from("turma_alunos")
    .insert(alunosSelecionados);

  if (error) {
    alert("Erro: " + error.message);
    console.error(error);
  } else {
    alert("Alunos adicionados com sucesso!");
    form.reset();
  }
});


// iniciar
carregarTurmas();
carregarAlunos();


// iniciar
carregarTurmas();
carregarAlunos();