const form = document.getElementById('login');
const dialog = document.getElementById('meuDialog');
const resultado = document.getElementById('resultado');
const confirmar = document.getElementById('confirmarModal');
const fechar = document.getElementById('fecharModal');

function mostrarMsg(msg) {
  resultado.textContent = msg;
  dialog.showModal();
}

confirmar.addEventListener('click', () => dialog.close());
fechar.addEventListener('click', () => dialog.close());

// toggle senha
document.querySelector('.toggle-password').addEventListener('click', function () {
  const input = document.getElementById('senha');
  input.type = input.type === 'password' ? 'text' : 'password';
});

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const documento = document.getElementById('documento').value.trim();
  const senha = document.getElementById('senha').value;

  const res = await fetch(`http://localhost:3000/usuarios?documento=${encodeURIComponent(documento)}`);
  const usuarios = await res.json();

  if (usuarios.length === 0) {
    mostrarMsg('Usuário não encontrado.');
    return;
  }

  const usuario = usuarios[0];

  if (usuario.senha !== senha) {
    mostrarMsg('Senha incorreta.');
    return;
  }

  salvarSessao(usuario);
  window.location.href = 'homepage.html';
});

// formatar CPF/CNPJ
function formatarDocumento(input) {
  let v = input.value.replace(/\D/g, '');
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
  input.value = v;
}
window.formatarDocumento = formatarDocumento;
