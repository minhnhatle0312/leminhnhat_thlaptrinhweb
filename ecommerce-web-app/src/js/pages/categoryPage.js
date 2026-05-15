import { renderHeader } from '../components/header.js';
import setupCart from '../components/cart.js';
import { fetchProducts } from '../api.js';
import { renderProductCards } from '../components/productCard.js';

renderHeader();
setupCart();

let products = [];
let filtered = [];
const pageSize = 9;
let currentPage = 1;

async function init(){
  products = await fetchProducts();
  renderCategories();
  applyFilters();
  setupEvents();
}

function renderCategories(){
  const cats = Array.from(new Set(products.map(p=>p.category))).sort();
  const ul = document.getElementById('category-list');
  ul.innerHTML = '';
  const all = document.createElement('li');
  all.innerHTML = `<a href="#" data-cat="" class="d-block">Tất cả</a>`;
  ul.appendChild(all);
  cats.forEach(c=>{
    const li = document.createElement('li');
    li.innerHTML = `<a href="#" data-cat="${c}" class="d-block">${c}</a>`;
    ul.appendChild(li);
  });
  ul.querySelectorAll('a').forEach(a=> a.addEventListener('click', (e)=>{
    e.preventDefault();
    const cat = a.dataset.cat;
    document.querySelectorAll('#category-list a').forEach(x=> x.classList.remove('fw-bold'));
    a.classList.add('fw-bold');
    applyFilters({category: cat});
  }));
}

function applyFilters(opts={}){
  const min = parseInt(document.getElementById('price-min').value || '0');
  const max = parseInt(document.getElementById('price-max').value || '0');
  const cat = opts.category !== undefined ? opts.category : '';

  filtered = products.filter(p=>{
    if(cat && p.category !== cat) return false;
    if(min && p.price < min) return false;
    if(max && max>0 && p.price > max) return false;
    return true;
  });
  currentPage = 1;
  renderPage();
}

function renderPage(){
  const listEl = document.getElementById('product-list');
  listEl.innerHTML = '';
  const start = (currentPage-1)*pageSize;
  const pageItems = filtered.slice(start, start+pageSize);
  pageItems.forEach(p => listEl.appendChild(renderProductCardCol(p)));
  renderPager();
}

function renderProductCardCol(p){
  // create column with bootstrap card
  const col = document.createElement('div');
  col.className = 'col';
  col.innerHTML = `
    <div class="card h-100 shadow-sm">
      <img src="${p.image}" class="card-img-top" alt="${p.title}" style="height:180px;object-fit:cover;">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${p.title}</h5>
        <p class="card-text text-muted small mb-2">${p.description || ''}</p>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="fw-bold text-danger">${(p.price).toLocaleString()}₫</div>
          <div class="small text-muted"><i class="fa-solid fa-star text-warning"></i> ${p.rating || ''}</div>
        </div>
        <div class="mt-auto d-flex gap-2">
          <button class="btn btn-outline-secondary btn-sm btn-view" data-id="${p.id}"><i class="fa-regular fa-eye"></i></button>
          <button class="btn btn-primary btn-sm btn-add" data-id="${p.id}"><i class="fa-solid fa-cart-plus"></i> Thêm</button>
        </div>
      </div>
    </div>
  `;

  const addBtn = col.querySelector('.btn-add');
  if(addBtn) addBtn.addEventListener('click', ()=> window.cart.add(p.id,1));
  const viewBtn = col.querySelector('.btn-view');
  if(viewBtn) viewBtn.addEventListener('click', async ()=>{
    try{
      const mod = await import('../components/productModal.js');
      mod.showProductModalById(p.id);
    } catch(err){
      window.location.href = `product.html?id=${p.id}`;
    }
  });

  return col;
}

function renderPager(){
  const total = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pager = document.getElementById('pager');
  pager.innerHTML = '';
  for(let i=1;i<=total;i++){
    const li = document.createElement('li');
    li.className = `page-item ${i===currentPage? 'active':''}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.querySelector('a').addEventListener('click', (e)=>{ e.preventDefault(); currentPage=i; renderPage(); });
    pager.appendChild(li);
  }
}

function setupEvents(){
  document.getElementById('apply-filter').addEventListener('click', ()=> applyFilters());
  document.getElementById('sort-select').addEventListener('change', (e)=>{
    const v=e.target.value;
    if(v==='price-asc') filtered.sort((a,b)=>a.price-b.price);
    if(v==='price-desc') filtered.sort((a,b)=>b.price-a.price);
    renderPage();
  });
}

init();