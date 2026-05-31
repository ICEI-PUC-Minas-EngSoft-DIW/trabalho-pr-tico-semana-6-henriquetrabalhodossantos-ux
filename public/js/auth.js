const API = 'http://localhost:3000';

function salvarSessao(usuario) {
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

function getSessao() {
  const u = localStorage.getItem('usuario');
  return u ? JSON.parse(u) : null;
}

function encerrarSessao() {
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
}

function exigirLogin() {
  if (!getSessao()) window.location.href = 'login.html';
}
