import { getProductById } from '../api.js';
import { showToast } from './toast.js';

function _get(){
  return JSON.parse(localStorage.getItem('cart')||'[]');
}

function _save(items){
  localStorage.setItem('cart', JSON.stringify(items));
  window.dispatchEvent(new Event('cart-updated'));
}

function add(id, qty=1){
  const items = _get();
  const found = items.find(i=>i.id===id);
  if(found) found.qty += qty;
  else items.push({id, qty});
  _save(items);
  showToast('Đã thêm vào giỏ hàng', {type:'success'});
}

function remove(id){
  const items = _get().filter(i=>i.id!==id);
  _save(items);
}

function updateQty(id, qty){
  const items = _get();
  const found = items.find(i=>i.id===id);
  if(found) found.qty = Math.max(1, qty);
  _save(items);
}

async function render(){
  const container = document.getElementById('cart-offcanvas-body') || document.getElementById('cart-drawer');
  const items = _get();
  container.innerHTML = `<div class="p-3"><h5>Giỏ hàng (${items.reduce((s,i)=>s+i.qty,0)})</h5></div>`;
  const badge = document.getElementById('cart-count');
  if(badge) badge.textContent = items.reduce((s,i)=>s+i.qty,0);

  if(items.length===0){
    container.innerHTML += `<div class="p-3 text-muted">Giỏ hàng trống. Thêm vài món nhé!</div>`;
    return;
  }

  const list = document.createElement('div');
  list.className = 'p-3';
  let totalPrice = 0;

  for(const it of items){
    const prod = await getProductById(it.id);
    const row = document.createElement('div');
    row.className = 'd-flex align-items-center mb-3';
    row.innerHTML = `
      <img src="${prod.image}" style="width:64px;height:64px;object-fit:cover;border-radius:8px">
      <div class="ms-3 flex-grow-1">
        <div class="fw-bold">${prod.title}</div>
        <div class="text-muted small">${(prod.price).toLocaleString()}₫</div>
        <div class="btn-group btn-group-sm mt-2" role="group">
          <button class="btn btn-outline-secondary qty-dec" data-id="${it.id}">-</button>
          <button class="btn btn-light">${it.qty}</button>
          <button class="btn btn-outline-secondary qty-inc" data-id="${it.id}">+</button>
          <button class="btn btn-outline-danger btn-remove ms-2" data-id="${it.id}"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;
    list.appendChild(row);
    totalPrice += prod.price * it.qty;
  }

  container.appendChild(list);

  const footer = document.createElement('div');
  footer.className = 'p-3 d-flex justify-content-between align-items-center border-top';
  footer.innerHTML = `
    <div class="fw-bold">Tổng: ${(totalPrice).toLocaleString()}₫</div>
    <div>
      <button class="btn btn-sm btn-outline-secondary" id="clear-cart">Xóa hết</button>
      <button class="btn btn-sm btn-primary" id="checkout">Thanh toán</button>
    </div>
  `;
  container.appendChild(footer);

  // events
  container.querySelectorAll('.qty-inc').forEach(b=> b.addEventListener('click', e=>{
    const id = +e.target.closest('button').dataset.id;
    const current = _get().find(i=>i.id===id).qty;
    updateQty(id, current+1);
    render();
  }));
  container.querySelectorAll('.qty-dec').forEach(b=> b.addEventListener('click', e=>{
    const id = +e.target.closest('button').dataset.id;
    const current = _get().find(i=>i.id===id).qty;
    updateQty(id, Math.max(1, current-1));
    render();
  }));
  container.querySelectorAll('.btn-remove').forEach(b=> b.addEventListener('click', e=>{
    const id = +e.target.closest('button').dataset.id;
    remove(id);
    render();
    showToast('Đã xóa sản phẩm', {type:'danger'});
  }));

  container.querySelector('#clear-cart').addEventListener('click', ()=>{ _save([]); render(); showToast('Đã xóa toàn bộ giỏ hàng', {type:'warning'}); });
  container.querySelector('#checkout').addEventListener('click', ()=> {
    showToast('Thanh toán mô phỏng: Cảm ơn bạn đã mua hàng!', {type:'success'});
    _save([]);
    render();
    // hide offcanvas if present
    const offEl = document.getElementById('cartOffcanvas');
    if(offEl){
      const off = bootstrap.Offcanvas.getInstance(offEl);
      if(off) off.hide();
    }
  });
}

export function setupCart(){
  window.cart = { add, remove, updateQty, render };
  // trigger count update
  window.dispatchEvent(new Event('cart-updated'));
  render();
  // update badge on cart-updated
  window.addEventListener('cart-updated', ()=>{
    const items = _get();
    const badge = document.getElementById('cart-count');
    if(badge) badge.textContent = items.reduce((s,i)=>s+i.qty,0);
  });
}

export default setupCart;