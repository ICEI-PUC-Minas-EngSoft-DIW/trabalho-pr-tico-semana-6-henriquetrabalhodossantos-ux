exigirLogin();

const usuario = getSessao();
const isFornecedor = usuario.tipo === 'fornecedor';

// preencher dados do perfil com dados do usuário logado
document.getElementById('profile-name').textContent = usuario.nome;
document.getElementById('fornecedor-nome').value = usuario.nome;
document.getElementById('fornecedor-email').value = usuario.email;
document.getElementById('fornecedor-cpf').value = usuario.documento;
document.getElementById('header-user-name').textContent = usuario.nome;

// mostrar/esconder seção de produtos
const secaoProdutos = document.getElementById('secao-produtos');
if (!isFornecedor) {
  secaoProdutos.style.display = 'none';
} else {
  carregarProdutosFornecedor();
}

// salvar perfil (apenas nome/email no localStorage por ora)
document.getElementById('formPerfil').addEventListener('submit', function (e) {
  e.preventDefault();
  usuario.nome = document.getElementById('fornecedor-nome').value;
  usuario.email = document.getElementById('fornecedor-email').value;
  salvarSessao(usuario);
  document.getElementById('profile-name').textContent = usuario.nome;
  mostrarToast('Perfil atualizado!');
});

// --- Produtos ---
async function carregarProdutosFornecedor() {
  const res = await fetch(`http://localhost:3000/produtos?fornecedor=${encodeURIComponent(usuario.nome)}`);
  const produtos = await res.json();
  const track = document.querySelector('.carousel-track');
  document.getElementById('products-count').textContent = produtos.length;

  if (produtos.length === 0) {
    track.innerHTML = '<p style="padding:16px;color:#888">Nenhum produto cadastrado.</p>';
    return;
  }

  track.innerHTML = produtos.map(p => `
    <div class="product-card">
      <div class="product-image"><img src="${p.imagem}" alt="${p.nome}"></div>
      <div class="product-info">
        <h3>${p.nome}</h3>
        <p class="product-description">${p.descricao}</p>
        <p class="product-price">${p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        <p class="product-category">${p.categoria}</p>
        <div class="product-actions">
          <button class="btn btn-sm btn-primary" onclick="window.location.href='produto.html?id=${p.id}'"><i class="fas fa-eye"></i> Ver</button>
          <button class="btn btn-sm btn-secondary" onclick="abrirEdicao(${p.id})"><i class="fas fa-edit"></i> Editar</button>
          <button class="btn btn-sm btn-danger" onclick="confirmarExclusao(${p.id})"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>
  `).join('');
}

// --- Modal Adicionar Produto ---
document.getElementById('add-product-btn').addEventListener('click', () => {
  document.getElementById('product-modal').style.display = 'flex';
});
document.querySelector('#product-modal .close').addEventListener('click', () => {
  document.getElementById('product-modal').style.display = 'none';
});
document.getElementById('cancel-product-btn').addEventListener('click', () => {
  document.getElementById('product-modal').style.display = 'none';
});

// preview imagem
document.getElementById('product-image').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('product-preview-img').src = e.target.result;
    document.getElementById('product-image-preview').style.display = 'block';
  };
  reader.readAsDataURL(file);
});

document.getElementById('formProduct').addEventListener('submit', async function (e) {
  e.preventDefault();
  const imgFile = document.getElementById('product-image').files[0];
  const imagem = imgFile
    ? await lerArquivoBase64(imgFile)
    : 'https://via.placeholder.com/480x420?text=Produto';

  const novo = {
    nome: document.getElementById('product-name').value,
    descricao: document.getElementById('product-description').value,
    preco: parseFloat(document.getElementById('product-price').value),
    categoria: document.getElementById('categoria').value,
    fornecedor: usuario.nome,
    imagem,
    avaliacao: 0,
    avaliacoes: 0,
    disponibilidade: 'Em estoque',
    contato: usuario.documento,
    relacionados: []
  };

  await fetch('http://localhost:3000/produtos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novo)
  });

  document.getElementById('product-modal').style.display = 'none';
  document.getElementById('formProduct').reset();
  document.getElementById('product-image-preview').style.display = 'none';
  mostrarToast('Produto adicionado!');
  carregarProdutosFornecedor();
});

// --- Modal Editar Produto ---
async function abrirEdicao(id) {
  const res = await fetch(`http://localhost:3000/produtos/${id}`);
  const p = await res.json();
  document.getElementById('edit-product-id').value = p.id;
  document.getElementById('edit-product-name').value = p.nome;
  document.getElementById('edit-product-description').value = p.descricao;
  document.getElementById('edit-product-price').value = p.preco;
  document.getElementById('edit-categoria').value = p.categoria;
  document.getElementById('edit-product-modal').style.display = 'flex';
}
window.abrirEdicao = abrirEdicao;

document.querySelector('#edit-product-modal .close').addEventListener('click', () => {
  document.getElementById('edit-product-modal').style.display = 'none';
});
document.getElementById('cancel-edit-btn').addEventListener('click', () => {
  document.getElementById('edit-product-modal').style.display = 'none';
});

document.getElementById('formEditProduct').addEventListener('submit', async function (e) {
  e.preventDefault();
  const id = document.getElementById('edit-product-id').value;
  const atualizado = {
    nome: document.getElementById('edit-product-name').value,
    descricao: document.getElementById('edit-product-description').value,
    preco: parseFloat(document.getElementById('edit-product-price').value),
    categoria: document.getElementById('edit-categoria').value
  };
  await fetch(`http://localhost:3000/produtos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(atualizado)
  });
  document.getElementById('edit-product-modal').style.display = 'none';
  mostrarToast('Produto atualizado!');
  carregarProdutosFornecedor();
});

// --- Excluir Produto ---
let idParaExcluir = null;
function confirmarExclusao(id) {
  idParaExcluir = id;
  document.getElementById('delete-confirm-modal').style.display = 'flex';
}
window.confirmarExclusao = confirmarExclusao;

document.querySelector('#delete-confirm-modal .close').addEventListener('click', () => {
  document.getElementById('delete-confirm-modal').style.display = 'none';
});
document.getElementById('cancel-delete-btn').addEventListener('click', () => {
  document.getElementById('delete-confirm-modal').style.display = 'none';
});
document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
  await fetch(`http://localhost:3000/produtos/${idParaExcluir}`, { method: 'DELETE' });
  document.getElementById('delete-confirm-modal').style.display = 'none';
  mostrarToast('Produto excluído!');
  carregarProdutosFornecedor();
});

// --- Toast ---
function mostrarToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-message').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// --- Utilitário base64 ---
function lerArquivoBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}
