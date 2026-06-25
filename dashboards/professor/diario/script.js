document.addEventListener('DOMContentLoaded', () => {
    
    // Base de dados mockada para testes visuais rápidos
    const listaAlunos = [
        { mat: "202601", nome: "Ana Beatriz Ramos", freq: "96%", n1: "9.5", n2: "8.8", pi: "10.0", sit: "Aprovado", classe: "bg-success" },
        { mat: "202602", nome: "Bruno Henrique Costa", freq: "82%", n1: "5.8", n2: "6.0", pi: "5.5", sit: "Recuperação", classe: "bg-warning text-dark" },
        { mat: "202603", nome: "Carlos Eduardo da Silva", freq: "74%", n1: "4.0", n2: "3.5", pi: "2.0", sit: "Retido/Falta", classe: "bg-danger" }
    ];

    const tabelaChamada = document.getElementById('tabela-chamada-corpo');
    const tabelaNotas = document.getElementById('tabela-notas-corpo');
    const btnPresencaGeral = document.getElementById('btn-presenca-geral');

    function carregarDiario() {
        if(!tabelaChamada || !tabelaNotas) return;

        tabelaChamada.innerHTML = "";
        tabelaNotas.innerHTML = "";

        listaAlunos.forEach(aluno => {
            // 1. Monta as linhas da Chamada
            const trChamada = document.createElement('tr');
            trChamada.innerHTML = `
                <td class="fw-bold text-secondary">#${aluno.mat}</td>
                <td class="fw-bold">${aluno.nome}</td>
                <td class="text-center fw-600">${aluno.freq}</td>
                <td class="text-center">
                    <div class="form-check form-switch d-inline-block">
                        <input class="form-check-input check-presenca" type="checkbox" checked style="cursor: pointer; width: 40px; height: 20px;">
                    </div>
                </td>
            `;
            tabelaChamada.appendChild(trChamada);

            // 2. Monta as linhas do Lançamento de Notas
            const trNotas = document.createElement('tr');
            trNotas.innerHTML = `
                <td class="fw-bold text-secondary">#${aluno.mat}</td>
                <td class="fw-bold">${aluno.nome}</td>
                <td><input type="text" class="form-control form-control-sm text-center fw-bold" value="${aluno.n1}" style="border-radius: 6px;"></td>
                <td><input type="text" class="form-control form-control-sm text-center fw-bold" value="${aluno.n2}" style="border-radius: 6px;"></td>
                <td><input type="text" class="form-control form-control-sm text-center fw-bold" value="${aluno.pi}" style="border-radius: 6px;"></td>
                <td class="text-center"><span class="badge ${aluno.classe}">${aluno.sit}</span></td>
            `;
            tabelaNotas.appendChild(trNotas);
        });
    }

    // Funcionalidade "Marcar Presença para Todos"
    if (btnPresencaGeral) {
        btnPresencaGeral.addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('.check-presenca');
            checkboxes.forEach(cb => cb.checked = true);
        });
    }

    carregarDiario();
});