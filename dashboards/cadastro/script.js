import { signUp } from "./auth/auth.js";
function validarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]+/g, '');

    // Verifica se tem 11 dígitos ou se é uma sequência repetida conhecida
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    // Valida o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    // Valida o segundo dígito verificador
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
const btnSubmit = document.getElementById('btnSubmit');

document.getElementById('btnSubmit').addEventListener('click', async (e) => {
  e.preventDefault();

  const nome = nomeInput.value;
  const email = emailInput.value;
  const cpf = cpfInput.value;
  const password = passwordInput.value;

if (!validarCPF(cpf)) {
    alert('CPF inválido');
    return;
}


  const { success, error } = await signUp(email, password, cpf, nome);

  if (success) {
    alert('Cadastro realizado com sucesso!');
    window.location.href = '../login/index.html';
  } else {
    alert(`Erro ao cadastrar: ${error}`);
  }
});