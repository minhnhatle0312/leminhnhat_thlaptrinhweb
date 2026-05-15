import { renderHeader } from '../components/header.js';
import setupCart from '../components/cart.js';
import { getProductById } from '../api.js';

renderHeader();
setupCart();

async function render(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const root = document.getElementById('page-root');
  const prod = await getProductById(id);
  if(!prod){
    root.innerHTML = '<div class="alert alert-warning">Sản phẩm không tìm thấy.</div>';
    return;
  }

  root.innerHTML = `
    <div class="row g-4">
      <div class="col-md-6">
        <img src="${prod.image}" class="img-fluid rounded shadow-sm" alt="${prod.title}">
      </div>
      <div class="col-md-6">
        <h2>${prod.title}</h2>
        <div class="text-muted mb-2">${prod.category} • Đã bán ${prod.sold}</div>
        <div class="h4 text-danger">${prod.price.toLocaleString()}₫</div>
        <p class="mt-3">${prod.description || ''}</p>
        <div class="d-flex gap-2 mt-3">
          <button class="btn btn-primary" id="buy-now">Mua ngay</button>
          <button class="btn btn-outline-secondary" id="add-cart">Thêm vào giỏ</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('add-cart').addEventListener('click', ()=>{
    window.cart.add(prod.id,1);
    alert('Đã thêm vào giỏ hàng');
  });
  document.getElementById('buy-now').addEventListener('click', ()=>{
    window.cart.add(prod.id,1);
    window.location.href = 'checkout.html';
  });
}

render();