import { renderHeader } from '../components/header.js';
import setupCart from '../components/cart.js';

renderHeader();
setupCart();

document.getElementById('contact-form')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  alert('Cảm ơn bạn đã gửi liên hệ!');
  document.getElementById('contact-form').reset();
});
