const form = document.getElementById('register');
const dialog = document.getElementById('meuDialog');
const resultado = document.getElementById('resultado');
const confirmar = document.getElementById('confirmarModal');
const fechar = document.getElementById('fecharModal');
const submitBtn = document.getElementById('submit-btn');

let redirecionarAposModal = false;

function mostrarMsg(msg, redirecionar = false) {
  resultado.textContent = msg;
  redirecionarAposModal = redirecionar;
  dialog.showModal();
}

confirmar.addEventListener('click', () => {
  dialog.close();
  if (redirecionarAposModal) window.location.href = 'login.html';
});
fechar.addEventListener('click', () => dialog.close());

// seleção de tipo
document.querySelectorAll('.typeOption').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.typeOption').forEach(x => x.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('tipoCadastro').value = el.dataset.type;
  });
});

// habilitar botão quando checkboxes marcados
document.getElementById('termosCheckbox').addEventListener('change', verificarCheckboxes);
document.getElementById('privacidadeCheckbox').addEventListener('change', verificarCheckboxes);
function verificarCheckboxes() {
  const t = document.getElementById('termosCheckbox').checked;
  const p = document.getElementById('privacidadeCheckbox').checked;
  submitBtn.disabled = !(t && p);
}

// toggle senhas
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', function () {
    const input = this.previousElementSibling;
    input.type = input.type === 'password' ? 'text' : 'password';
  });
});

// modais de termos
document.querySelectorAll('.linkModal').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById(link.dataset.modal).showModal();
  });
});
document.querySelectorAll('.fechar-modal, .fechar-modal-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    this.closest('dialog').close();
  });
});

// formatar CPF/CNPJ no campo cpf
document.getElementById('cpf').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '');
  if (v.length <= 11) {
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    v = v.replace(/^(\d{2})(\d)/, '$1.$2');
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
  }
  this.value = v;
});

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const tipo = document.getElementById('tipoCadastro').value;
  const nome = document.getElementById('nomeCompleto').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;
  const documento = document.getElementById('cpf').value.trim();

  if (senha !== confirmarSenha) {
    mostrarMsg('As senhas não coincidem.');
    return;
  }

  // verificar duplicidade por documento
  const check = await fetch(`http://localhost:3000/usuarios?documento=${encodeURIComponent(documento)}`);
  const existentes = await check.json();
  if (existentes.length > 0) {
    mostrarMsg('CPF/CNPJ já cadastrado.');
    return;
  }

  const novoUsuario = { tipo, nome, email, senha, documento };

  await fetch('http://localhost:3000/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novoUsuario)
  });

  mostrarMsg('Cadastro realizado com sucesso! Faça login para continuar.', true);
});
