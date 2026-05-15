import { fetchProducts } from './api.js';
import { renderHeader } from './components/header.js';
import { renderProductCards } from './components/productCard.js';
import setupCart from './components/cart.js';

document.addEventListener('DOMContentLoaded', async ()=>{
  renderHeader();
  setupCart();

  const products = await fetchProducts();
  const listEl = document.getElementById('product-list');
  renderProductCards(listEl, products);

  // Wire search/sort
  window.addEventListener('quick-search', (e)=>{
    const q = (e.detail||'').toLowerCase().trim();
    if(!q) return renderProductCards(listEl, products);
    renderProductCards(listEl, products.filter(p=> (p.title||'').toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q)));
  });

  document.getElementById('sort-select')?.addEventListener('change', (e)=>{
    const v = e.target.value;
    const items = products.slice();
    if(v==='price-asc') items.sort((a,b)=>a.price-b.price);
    if(v==='price-desc') items.sort((a,b)=>b.price-a.price);
    renderProductCards(listEl, items);
  });

  // lazy load images
  document.querySelectorAll('img').forEach(img=> img.loading = 'lazy');
});