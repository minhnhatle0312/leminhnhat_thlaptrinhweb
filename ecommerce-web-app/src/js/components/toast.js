export function showToast(message, {type='primary', delay=3000, icon='' } = {}){
  const container = document.getElementById('toast-container');
  if(!container) return;
  const id = 'toast-' + Date.now();
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div id="${id}" class="toast align-items-center text-bg-${type} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          <span class="toast-icon me-2">${icon||''}</span>
          <span class="toast-text">${message}</span>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;
  container.appendChild(wrapper);
  const toastEl = document.getElementById(id);
  const bsToast = bootstrap.Toast.getOrCreateInstance(toastEl, {delay});
  bsToast.show();
  toastEl.addEventListener('hidden.bs.toast', ()=>{
    wrapper.remove();
  });
  return bsToast;
}

export const toastPresets = {
  success: (msg, opts={}) => showToast(msg, Object.assign({type:'success', icon:'<i class="fa-solid fa-circle-check"></i>'}, opts)),
  danger: (msg, opts={}) => showToast(msg, Object.assign({type:'danger', icon:'<i class="fa-solid fa-triangle-exclamation"></i>'}, opts)),
  warn: (msg, opts={}) => showToast(msg, Object.assign({type:'warning', icon:'<i class="fa-solid fa-triangle-exclamation"></i>'}, opts)),
}
