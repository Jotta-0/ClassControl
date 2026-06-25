import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabase = createClient(
  "https://motbailfflvxstzvicxs.supabase.co",
  "sb_publishable_zUfZDfv9iSzNh_eIUYGhhg_NclbJRa1"
);

console.log("Script carregado com sucesso");

const form = document.getElementById("loginForm");

// 🔥 variável para guardar o tipo selecionado
let tipoSelecionado = null;


// ✅ seleção visual
function selecionarTipo(tipo, botao){
  tipoSelecionado = tipo;

  // remove seleção de todos
  document.querySelectorAll("button[type='button']").forEach(btn => {
    btn.style.opacity = "0.5";
  });

  // destaca selecionado
  botao.style.opacity = "1";
}


// eventos dos botões
document.getElementById("btnResponsavel").onclick = (e) => selecionarTipo("RESPONSAVEL", e.target);
document.getElementById("btnProfessor").onclick = (e)=> selecionarTipo("PROFESSOR", e.target);
document.getElementById("btnAluno").onclick = (e) => selecionarTipo("ALUNO", e.target);
document.getElementById("btnAdm").onclick = (e)=> selecionarTipo("ADM", e.target);


// ✅ login

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error){
    alert(error.message);
    return;
  }

  const user = data.user;

  // 🔥 buscar tipo no banco
  const { data: usuario, error: err2 } = await supabase
    .from("usuarios")
    .select("tipo_de_usuario")
    .eq("auth_user_id", user.id)
    .single();

  if (err2) {
    alert("Erro ao buscar usuário");
    return;
  }

  const tipoBanco = usuario.tipo_de_usuario;

  // 🔒 validação do tipo escolhido
  if (tipoSelecionado && tipoSelecionado !== tipoBanco){
    alert("Tipo de usuário incorreto!");
    await supabase.auth.signOut();
    return;
  }

  // ✅ redirecionamento
  switch (tipoBanco){
    case "ADM":
      window.location.href = "/dashboards/admin/index.html";
      break;

    case "PROFESSOR":
      window.location.href = "/dashboards/professor/index.html";
      break;

    case "ALUNO":
      window.location.href = "/dashboards/aluno/index.html";
      break;

    case "RESPONSAVEL":
      window.location.href = "/dashboards/responsavel/index.html";
      break;
  }
});
