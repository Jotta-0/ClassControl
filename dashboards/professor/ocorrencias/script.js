import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabase = createClient(
  "https://motbailfflvxstzvicxs.supabase.co",
  "sb_publishable_zUfZDfv9iSzNh_eIUYGhhg_NclbJRa1"
);

const form = document.getElementById("formOcorrencia");

let idProfessorLogado = null;


// ✅ pegar professor logado
async function carregarProfessorLogado() {

  // pegar usuário logado
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    alert("Usuário não logado");
    return;
  }

  // buscar usuario na tabela usuarios
  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id_usuario, nome")
    .eq("auth_user_id", user.id)
    .single();

  // buscar professor
  const { data: professor } = await supabase
    .from("professores")
    .select("id_professor, nome")
    .eq("id_usuario", usuario.id_usuario)
    .single();

  idProfessorLogado = professor.id_professor;

  // opcional: mostrar nome na tela
  document.getElementById("professorNome").textContent =
    "Professor: " + professor.nome;
}


// ✅ carregar alunos
async function carregarAlunos() {
  const { data } = await supabase
    .from("alunos")
    .select("id_aluno, nome");

  const select = document.getElementById("aluno");
  select.innerHTML = "<option value=''>Selecione</option>";

  data.forEach(aluno => {
    const option = document.createElement("option");
    option.value = aluno.id_aluno;
    option.textContent = aluno.nome;
    select.appendChild(option);
  });
}


// ✅ enviar ocorrência
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const descricao = document.getElementById("descricao").value;
  const id_aluno = document.getElementById("aluno").value;

  if (!idProfessorLogado) {
    alert("Professor não identificado");
    return;
  }

  const { error } = await supabase
    .from("ocorrencia")
    .insert([
      {
        nome,
        descricao,
        id_aluno,
        id_professor: idProfessorLogado // 🔥 automático
      }
    ]);

  if (error) {
    alert("Erro: " + error.message);
    console.error(error);
  } else {
    alert("Ocorrência registrada!");
    form.reset();
  }
});


// iniciar
carregarProfessorLogado();
carregarAlunos();
