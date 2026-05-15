import { getProductById } from '../api.js';

let modalEl, bsModal;

function ensureModal(){
  if(modalEl) return modalEl;
  modalEl = document.createElement('div');
  modalEl.innerHTML = `
    <div class="modal fade" id="productDetailModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="productDetailModalLabel"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6" id="pm-image"></div>
              <div class="col-md-6" id="pm-body"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalEl);
  const el = document.getElementById('productDetailModal');
  // bootstrap Modal will be created on show
  return el;
}

export async function showProductModalById(id){
  const prod = await getProductById(id);
  if(!prod) return;
  const el = ensureModal();
  document.getElementById('productDetailModalLabel').textContent = prod.title;
  document.getElementById('pm-image').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;min-height:240px;">
      <img src="${prod.image}" loading="lazy" decoding="async" class="img-fluid rounded" alt="${prod.title}" style="object-fit:contain;max-height:360px;" />
    </div>
  `;
  document.getElementById('pm-body').innerHTML = `
    <div class="h4 text-danger">${prod.price.toLocaleString()}₫</div>
    <p class="text-muted small mb-1">${prod.category} • Đã bán ${prod.sold}</p>
    <p>${prod.description || ''}</p>
    <div class="d-flex gap-2 mt-3">
      <button class="btn btn-primary" id="pm-add">Thêm vào giỏ</button>
      <a class="btn btn-outline-secondary" href="product.html?id=${prod.id}">Xem chi tiết</a>
    </div>
  `;
  // wire add
  setTimeout(()=>{
    document.getElementById('pm-add')?.addEventListener('click', ()=>{
      window.cart.add(prod.id,1);
      // update cart and close
      document.getElementById('productDetailModal') && bootstrap.Modal.getInstance(document.getElementById('productDetailModal'))?.hide();
      window.dispatchEvent(new Event('cart-updated'));
    });
  },50);

  bsModal = new bootstrap.Modal(el);
  bsModal.show();
}

export default showProductModalById;
