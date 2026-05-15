import { showToast } from './toast.js';

export function createProductCard(p){
  const col = document.createElement('div');
  col.className = 'col';
  col.innerHTML = `
    <div class="card h-100 shadow-sm">
      <div class="ratio ratio-16x9 bg-light skeleton-img">
        <img src="${p.image}" loading="lazy" decoding="async" class="card-img-top" alt="${p.title}" style="object-fit:contain;width:100%;height:100%;">
      </div>
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
  const imgEl = col.querySelector('img');
  const wrapper = col.querySelector('.skeleton-img');
  if(imgEl){
    imgEl.addEventListener('load', ()=>{
      if(wrapper) wrapper.classList.remove('skeleton-img');
    });
    imgEl.addEventListener('error', ()=>{
      if(wrapper) wrapper.classList.remove('skeleton-img');
      imgEl.src = 'https://via.placeholder.com/300x200?text=No+Image';
    });
  }

  col.querySelector('.btn-add').addEventListener('click', ()=> { window.cart.add(p.id,1); showToast('Đã thêm "' + p.title + '" vào giỏ', {type:'success'}); });
  col.querySelector('.btn-view').addEventListener('click', async ()=> {
    // prefer modal detail if available
    try{
      const mod = await import('../components/productModal.js');
      mod.showProductModalById(p.id);
    }catch(err){
      const url = new URL(window.location.href);
      url.pathname = url.pathname.replace(/[^\/]*$/, 'product.html');
      url.searchParams.set('id', p.id);
      window.location.href = url.toString();
    }
  });

  return col;
}

export function renderProductCards(listEl, products){
  listEl.innerHTML = '';
  products.forEach(p => listEl.appendChild(createProductCard(p)));
}