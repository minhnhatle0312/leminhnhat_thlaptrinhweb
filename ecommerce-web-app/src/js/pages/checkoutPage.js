import { renderHeader } from '../components/header.js';
import setupCart from '../components/cart.js';
import { getProductById } from '../api.js';

renderHeader();
setupCart();

function renderSummary(){
  const items = JSON.parse(localStorage.getItem('cart')||'[]');
  const el = document.getElementById('order-items');
  el.innerHTML = '';
  let total = 0;
  items.forEach(async it=>{
    const p = await getProductById(it.id);
    const row = document.createElement('div');
    row.className = 'd-flex justify-content-between';
    row.innerHTML = `<div>${p.title} x ${it.qty}</div><div>${(p.price*it.qty).toLocaleString()}₫</div>`;
    el.appendChild(row);
    total += p.price*it.qty;
    document.getElementById('order-total').textContent = total.toLocaleString()+ '₫';
  });
}

renderSummary();

document.getElementById('checkout-form')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  alert('Thanh toán mô phỏng: Cảm ơn đơn hàng!');
  localStorage.setItem('cart', JSON.stringify([]));
  window.location.href = 'index.html';
});
