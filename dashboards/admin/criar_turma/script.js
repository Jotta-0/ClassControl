import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabase = createClient(
  "https://motbailfflvxstzvicxs.supabase.co",
  "sb_publishable_zUfZDfv9iSzNh_eIUYGhhg_NclbJRa1"
);

// elementos
const form = document.getElementById("turmaForm");
const professorSelect = document.getElementById("professor");
const cursoSelect = document.getElementById("curso");


// ✅ carregar professores
async function carregarProfessores() {
  const { data, error } = await supabase
    .from("professores")
    .select("id_professor, nome");

 console.log("Professores:", data); // 🔥 teste

  if (error) {
    console.error(error);
    return;
  }

  professorSelect.innerHTML = "<option value=''>Selecione</option>";

  data.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id_professor;
    option.textContent = p.nome;
    professorSelect.appendChild(option);
  });
}


async function carregarCursos() {
  const { data, error } = await supabase
    .from("cursos")
    .select("id, nome");

  if (error) {
    console.error("Erro ao buscar cursos:", error);
    return;
  }

  console.log("Cursos:", data); // 🔥 importante para verificar

  const cursoSelect = document.getElementById("curso");

  cursoSelect.innerHTML = "<option value=''>Selecione</option>";

  data.forEach(curso => {
    const option = document.createElement("option");
    option.value = curso.id;
    option.textContent = curso.nome;
    cursoSelect.appendChild(option);
  });
}


// ✅ criar turma
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
  }
});


// iniciar
carregarProfessores();
carregarCursos();

