import { getUsuarioLogado } from "./cadastro/auth/auth.js";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabaseUrl = "https://motbailfflvxstzvicxs.supabase.co";
const supabaseKey = "sb_publishable_zUfZDfv9iSzNh_eIUYGhhg_NclbJRa1";

const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", async () => {

    const usuario = await getUsuarioLogado();

    if (!usuario) {
        window.location.href = "/dashboards/login/index.html";
        return;
    }

    if (usuario.tipo_de_usuario !== "ADM") {
        alert("Acesso negado.");
        window.location.href = "/index.html";
        return;
    }

    document.getElementById("nomeUsuario").textContent = `Olá, ${usuario.nome}`;

    await carregarDashboard();

});

async function carregarDashboard() {

    await Promise.all([
        carregarUsuarios(),
        carregarTurmas()
    ]);

}

async function carregarUsuarios() {

    const { data: usuarios, error } = await supabase
        .from("usuarios")
        .select(`
            id_usuario,
            nome,
            email,
            tipo_de_usuario
        `)
        .order("nome");

    if (error) {
        console.error(error);
        return;
    }

    document.getElementById("count-usuarios").textContent =
        usuarios.length;

    document.getElementById("count-turmas").textContent =
        usuarios.length;

    document.getElementById("count-inativos").textContent =
        0;

    const tbody = document.getElementById("tabela-usuarios-corpo");

    tbody.innerHTML = "";

    usuarios.slice(0, 5).forEach(usuario => {

        tbody.innerHTML += `
            <tr>
                <td class="fw-bold">${usuario.nome}</td>
                <td>${traduzirTipo(usuario.tipo_de_usuario)}</td>
                <td>
                    <span class="badge-status status-ativo">
                        Ativo
                    </span>
                </td>
            </tr>
        `;

    });

}

async function carregarTurmas() {

    const { data: turmas, error } = await supabase
        .from("turma")
        .select(`
            id,
            nome_turma,
            turno_turma
        `)
        .order("nome_turma");

    if (error) {
        console.error(error);
        return;
    }

    document.getElementById("total-turmas-geral").textContent =
        turmas.length;

    document.getElementById("turmas-ativas-geral").textContent =
        turmas.length;

    document.getElementById("turmas-inativas-geral").textContent =
        0;

    document.getElementById("media-alunos-turma").textContent =
        "-";

    const tbody = document.getElementById("tabela-turmas-corpo");

    tbody.innerHTML = "";

    turmas.slice(0, 5).forEach(turma => {

        tbody.innerHTML += `
            <tr>
                <td class="fw-bold">${turma.nome_turma}</td>
                <td>${turma.turno_turma}</td>
                <td>
                    <span class="badge-status status-ativo">
                        Ativa
                    </span>
                </td>
            </tr>
        `;

    });

}

function traduzirTipo(tipo) {

    switch (tipo) {

        case "ADM":
            return "Administrador";

        case "PROFESSOR":
            return "Professor";

        case "ALUNO":
            return "Aluno";

        case "RESPONSAVEL":
            return "Responsável";

        default:
            return tipo;

    }

}