import { signUp } from "./auth/auth.js";

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
}

const form = document.getElementById('cadastroForm');
const nomeInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const cpfInput = document.getElementById('cpf');
const passwordInput = document.getElementById('password');
const tipoSelect = document.getElementById('tipo');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = nomeInput.value;
  const email = emailInput.value;
  const cpf = cpfInput.value;
  const password = passwordInput.value;
  const tipo = tipoSelect.value;

  if (!validarCPF(cpf)) {
    alert('CPF inválido');
    return;
  }

  const { success, error } = await signUp(email, password, cpf, nome, tipo);

  if (success) {
    alert('Cadastro realizado com sucesso!');
    window.location.href = '../admin/index.html';
  } else {
    alert(`Erro ao cadastrar: ${error}`);
  }
});