const apiUrl = new URL('../../data/products.json', import.meta.url).href;

async function fetchProducts(){
  try{
    const res = await fetch(apiUrl);
    if(!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data;
  }catch(err){
    console.error(err);
    // fallback to window.api if present
    if(window.api && typeof window.api.getProducts === 'function') return window.api.getProducts();
    return [];
  }
}

async function getProductById(id){
  const list = await fetchProducts();
  return list.find(p => p.id === Number(id));
}

// expose for legacy code
window.api = window.api || { getProducts: fetchProducts, getProductById };

export { fetchProducts, getProductById };