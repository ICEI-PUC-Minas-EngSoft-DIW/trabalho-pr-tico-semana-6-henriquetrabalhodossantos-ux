const API = 'http://localhost:3000';

function precoFormatado(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function carregarProduto() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 1;

  const res = await fetch(`${API}/produtos/${id}`);
  const p = await res.json();

  document.querySelector('.breadcrumbs').textContent = `Início > ${p.categoria} > ${p.nome}`;
  document.querySelector('#main-img').src = p.imagem;
  document.querySelector('#main-img').alt = p.nome;
  document.querySelector('#produto-nome').textContent = p.nome;
  document.querySelector('#produto-fornecedor').textContent = `Vendido por ${p.fornecedor}`;
  document.querySelector('#produto-preco').textContent = precoFormatado(p.preco);
  document.querySelector('#produto-descricao').textContent = p.descricao;
  document.querySelector('#produto-disponibilidade').textContent = p.disponibilidade;
  document.querySelector('#produto-categoria').textContent = p.categoria;
  document.querySelector('#produto-contato').textContent = p.contato;

  await carregarRelacionados(p.relacionados);
}

async function carregarRelacionados(ids) {
  const container = document.querySelector('.related');
  if (!container) return;

  const produtos = await Promise.all(ids.map(id => fetch(`${API}/produtos/${id}`).then(r => r.json())));

  container.innerHTML = produtos.map(p => `
    <div class="card" onclick="window.location.href='produto.html?id=${p.id}'" style="cursor:pointer">
      <img src="${p.imagem}" alt="${p.nome}" style="width:100%;height:90px;object-fit:cover;margin-bottom:8px">
      <div style="font-size:14px;font-weight:600">${p.nome}</div>
      <div style="color:var(--text);font-size:13px">${precoFormatado(p.preco)}</div>
    </div>
  `).join('');
}

carregarProduto();
