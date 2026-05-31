const API = 'http://localhost:3000';

function estrelas(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function precoFormatado(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function carregarProdutosDestaque() {
  const track = document.querySelector('.featured-products .track');
  if (!track) return;

  const res = await fetch(`${API}/produtos`);
  const produtos = await res.json();

  track.innerHTML = produtos.map(p => `
    <article class="product-card" onclick="window.location.href='produto.html?id=${p.id}'">
      <div class="product-info">
        <h4>${p.nome}</h4>
        <p class="supplier">${p.fornecedor}</p>
        <div class="price">${precoFormatado(p.preco)}</div>
        <div class="rating">
          <span class="stars">${estrelas(p.avaliacao)}</span>
          <span class="reviews">(${p.avaliacoes})</span>
        </div>
      </div>
    </article>
  `).join('');
}

async function carregarFornecedores() {
  const track = document.querySelector('.verified-suppliers .track');
  if (!track) return;

  const res = await fetch(`${API}/fornecedores`);
  const fornecedores = await res.json();

  track.innerHTML = fornecedores.map(f => `
    <div class="supplier-card">
      <div class="supplier-avatar">
        ${f.verificado ? '<div class="verified-badge"><i class="fas fa-check-circle"></i></div>' : ''}
      </div>
      <div class="supplier-info">
        <h4>${f.nome}</h4>
        <p class="location"><i class="fas fa-map-marker-alt"></i> ${f.cidade}, ${f.estado}</p>
        <div class="supplier-stats">
          <span class="stat">★ ${f.avaliacao}</span>
          <span class="stat">${f.totalProdutos} produtos</span>
        </div>
        <div class="categories">
          ${f.categorias.map(c => `<span class="category">${c}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

carregarProdutosDestaque();
carregarFornecedores();
