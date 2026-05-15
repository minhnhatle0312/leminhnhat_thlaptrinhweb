import { renderHeader } from '../components/header.js';
import setupCart from '../components/cart.js';
import { fetchProducts } from '../api.js';
import { renderProductCards } from '../components/productCard.js';

renderHeader();
setupCart();

const state = {
  products: [],
  filtered: [],
  page: 1,
  pageSize: 12,
};

function showSkeletons(container, count=8){
  container.innerHTML = '';
  for(let i=0;i<count;i++){
    const col = document.createElement('div'); col.className='col';
    const card = document.createElement('div'); card.className='card skeleton h-100';
    card.innerHTML = `<div class="ratio ratio-16x9 bg-light"></div><div class="card-body"><h5 class="card-title">&nbsp;</h5><p class="card-text">&nbsp;</p></div>`;
    col.appendChild(card);
    container.appendChild(col);
  }
}

function applyFilters(){
  const q = document.getElementById('quick-search')?.value?.toLowerCase() || '';
  const sort = document.getElementById('sort-select')?.value || 'featured';
  let list = state.products.filter(p => p.title.toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q) );
  if(sort==='price-asc') list.sort((a,b)=>a.price-b.price);
  if(sort==='price-desc') list.sort((a,b)=>b.price-a.price);
  state.filtered = list;
  state.page = 1;
  renderPage();
}

function renderPage(){
  const container = document.getElementById('product-list');
  const start = (state.page-1)*state.pageSize;
  const pageItems = state.filtered.slice(start, start+state.pageSize);
  renderProductCards(container, pageItems);
  renderPagination();
}

function renderPagination(){
  const total = state.filtered.length;
  const pages = Math.max(1, Math.ceil(total/state.pageSize));
  let pager = document.getElementById('catalog-pager');
  if(!pager){
    pager = document.createElement('nav'); pager.id='catalog-pager'; pager.className='mt-3';
    document.querySelector('.catalog')?.appendChild(pager);
  }
  const ul = document.createElement('ul'); ul.className='pagination';
  for(let p=1;p<=pages;p++){
    const li = document.createElement('li'); li.className = 'page-item' + (p===state.page? ' active':'');
    li.innerHTML = `<a class="page-link" href="#">${p}</a>`;
    li.addEventListener('click', (e)=>{ e.preventDefault(); state.page=p; renderPage(); });
    ul.appendChild(li);
  }
  pager.innerHTML=''; pager.appendChild(ul);
}

(async ()=>{
  const listEl = document.getElementById('product-list');
  showSkeletons(listEl,12);
  const products = await fetchProducts();
  state.products = products;
  state.filtered = products.slice();
  renderPage();

  // wire search & sort
  document.getElementById('quick-search')?.addEventListener('input', ()=> applyFilters());
  document.getElementById('sort-select')?.addEventListener('change', ()=> applyFilters());

  // listen to global quick-search event (from header)
  window.addEventListener('quick-search', (e)=>{
    const q = (e && e.detail) || '';
    const input = document.getElementById('quick-search');
    if(input){ input.value = q; }
    applyFilters();
  });

  // animate badge when cart updates
  window.addEventListener('cart-updated', ()=>{
    const badge = document.getElementById('cart-count');
    if(badge){
      badge.classList.remove('badge-pulse');
      // reflow
      void badge.offsetWidth;
      badge.classList.add('badge-pulse');
    }
  });

  // initialize hero carousel with JS to ensure reliable behavior
  try{
    const heroEl = document.getElementById('heroCarousel');
    if(heroEl){
      // eslint-disable-next-line no-undef
      let bsCarousel;
      try{
        bsCarousel = bootstrap.Carousel.getInstance(heroEl) || new bootstrap.Carousel(heroEl, {interval:false, pause:false, ride:false});
      }catch(err){
        bsCarousel = null;
      }

      const prevBtn = heroEl.querySelector('.carousel-control-prev');
      const nextBtn = heroEl.querySelector('.carousel-control-next');

      function manualSlide(direction){
        const items = Array.from(heroEl.querySelectorAll('.carousel-item'));
        const activeIndex = items.findIndex(i=>i.classList.contains('active'));
        if(activeIndex === -1) return;
        let nextIndex = direction==='next' ? activeIndex+1 : activeIndex-1;
        if(nextIndex < 0) nextIndex = items.length -1;
        if(nextIndex >= items.length) nextIndex = 0;
        items[activeIndex].classList.remove('active');
        items[nextIndex].classList.add('active');
      }

      if(prevBtn) prevBtn.addEventListener('click', (e)=>{ e.preventDefault(); if(bsCarousel) try{ bsCarousel.prev(); }catch(_){ manualSlide('prev'); } else manualSlide('prev'); });
      if(nextBtn) nextBtn.addEventListener('click', (e)=>{ e.preventDefault(); if(bsCarousel) try{ bsCarousel.next(); }catch(_){ manualSlide('next'); } else manualSlide('next'); });
    }
  }catch(e){
    // ignore if bootstrap not available yet
    console.warn('Carousel init error', e);
  }
})();
