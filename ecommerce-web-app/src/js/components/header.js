export function renderHeader(){
  const header = document.getElementById('header');
  header.innerHTML = `
    <div class="header-inner container d-flex align-items-center justify-content-between py-2">
      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-outline-secondary d-md-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileNav" aria-controls="mobileNav" aria-label="Menu">
          <i class="fa-solid fa-bars"></i>
        </button>
        <button class="btn btn-outline-secondary d-md-none ms-1" id="mobile-search-toggle" aria-label="Tìm kiếm">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
        <a class="logo d-flex align-items-center gap-2 text-decoration-none text-dark" href="index.html"><i class="fa-solid fa-shop"></i> <strong>E-Shop</strong></a>
      </div>
      <nav class="me-3 d-none d-md-block">
        <a href="index.html" class="me-3 text-decoration-none">Trang chủ</a>
        <a href="category.html" class="me-3 text-decoration-none">Sản phẩm</a>
        <a href="about.html" class="me-3 text-decoration-none">Giới thiệu</a>
        <a href="contact.html" class="text-decoration-none">Liên hệ</a>
      </nav>
      <div class="search d-flex align-items-center flex-grow-1 mx-3">
        <input id="global-search" class="form-control form-control-sm" placeholder="Tìm sản phẩm, danh mục..." aria-label="search" />
        <button class="btn btn-light ms-2" id="search-btn" aria-label="Tìm"><i class="fa-solid fa-magnifying-glass"></i></button>
      </div>
      <div class="nav-actions d-flex align-items-center">
        <a class="btn btn-link d-none d-md-inline" href="#" aria-label="Yêu thích"><i class="fa-regular fa-heart"></i></a>
        <button class="btn btn-primary d-flex align-items-center" id="cart-btn" data-bs-toggle="offcanvas" data-bs-target="#cartOffcanvas" aria-controls="cartOffcanvas" aria-label="Giỏ hàng">
          <i class="fa-solid fa-bag-shopping me-2"></i>
          <span id="cart-count" class="badge bg-danger">0</span>
        </button>
      </div>
    </div>
  `;

  // inject mobile nav offcanvas and cart offcanvas + toast container once
  if(!document.getElementById('mobileNav')){
    const mobileNav = document.createElement('div');
    mobileNav.innerHTML = `
      <div class="offcanvas offcanvas-start" tabindex="-1" id="mobileNav">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title">E-Shop</h5>
          <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="list-unstyled">
            <li><a href="index.html" class="d-block py-2">Trang chủ</a></li>
            <li><a href="category.html" class="d-block py-2">Sản phẩm</a></li>
            <li><a href="about.html" class="d-block py-2">Giới thiệu</a></li>
            <li><a href="contact.html" class="d-block py-2">Liên hệ</a></li>
          </ul>
        </div>
      </div>
    `;
    document.body.appendChild(mobileNav);
  }

  if(!document.getElementById('cartOffcanvas')){
    const cartOff = document.createElement('div');
    cartOff.innerHTML = `
      <div class="offcanvas offcanvas-end" tabindex="-1" id="cartOffcanvas" aria-labelledby="cartOffcanvasLabel">
        <div class="offcanvas-header">
          <h5 id="cartOffcanvasLabel">Giỏ hàng</h5>
          <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body" id="cart-offcanvas-body"></div>
      </div>
    `;
    document.body.appendChild(cartOff);
  }

  if(!document.getElementById('toast-container')){
    const toastWrap = document.createElement('div');
    toastWrap.innerHTML = `<div id="toast-container" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1080;"></div>`;
    document.body.appendChild(toastWrap);
  }

  const cartBtn = document.getElementById('cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');

  function updateCartCount(){
    const cart = JSON.parse(localStorage.getItem('cart')||'[]');
    const total = cart.reduce((s,i)=>s + i.qty,0);
    document.getElementById('cart-count').textContent = total;
  }

  cartBtn.addEventListener('click', ()=>{
    const open = cartDrawer.classList.toggle('open');
    cartDrawer.setAttribute('aria-hidden', !open);
    if(window.cart && typeof window.cart.render === 'function') window.cart.render();
  });

  const globalSearchEl = document.getElementById('global-search');
  globalSearchEl.addEventListener('input', (e)=>{
    window.dispatchEvent(new CustomEvent('quick-search', {detail:e.target.value}));
  });
  // handle Enter to perform search or navigate to category page
  globalSearchEl.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
      const q = e.target.value.trim();
      if(!q) return;
      // if on home page, dispatch quick-search; otherwise navigate to category.html?q=...
      const isHome = /index\.html?$|\/$/.test(window.location.pathname);
      if(isHome){
        window.dispatchEvent(new CustomEvent('quick-search', {detail:q}));
        // focus results
        const list = document.getElementById('product-list');
        if(list) list.scrollIntoView({behavior:'smooth'});
      }else{
        const url = new URL(window.location.href);
        url.pathname = url.pathname.replace(/[^\/]*$/, 'category.html');
        url.searchParams.set('q', q);
        window.location.href = url.toString();
      }
    }
  });
  // search button click
  document.getElementById('search-btn').addEventListener('click', ()=>{
    const q = globalSearchEl.value.trim();
    if(!q) return;
    window.dispatchEvent(new CustomEvent('quick-search', {detail:q}));
    const list = document.getElementById('product-list');
    if(list) list.scrollIntoView({behavior:'smooth'});
  });

  updateCartCount();
  window.addEventListener('cart-updated', updateCartCount);

  document.getElementById('hero-shop')?.addEventListener('click', ()=> window.scrollTo({top: document.getElementById('product-list').offsetTop - 60, behavior:'smooth'}));

  // Header shrink on scroll
  const headerEl = document.getElementById('header');
  function onScrollHeader(){
    const sc = window.scrollY || window.pageYOffset;
    if(sc > 40) headerEl.classList.add('header-shrink'); else headerEl.classList.remove('header-shrink');
  }
  window.addEventListener('scroll', onScrollHeader);

  // search expand on focus
  const globalSearch = document.getElementById('global-search');
  globalSearch?.addEventListener('focus', ()=> headerEl.classList.add('search-focus'));
  globalSearch?.addEventListener('blur', ()=> headerEl.classList.remove('search-focus'));

  // mobile search toggle
  const mobileSearchToggle = document.getElementById('mobile-search-toggle');
  mobileSearchToggle?.addEventListener('click', ()=>{
    headerEl.classList.toggle('mobile-search-open');
    const input = document.getElementById('global-search');
    if(headerEl.classList.contains('mobile-search-open')){
      setTimeout(()=> input?.focus(), 120);
    }else{
      input?.blur();
    }
  });

  // logo hover animation (small tilt)
  const logo = headerEl.querySelector('.logo');
  logo?.addEventListener('mouseenter', ()=> logo.classList.add('logo-hover'));
  logo?.addEventListener('mouseleave', ()=> logo.classList.remove('logo-hover'));
}