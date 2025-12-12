/* user.js: cart + auth helpers + simple UI behaviors */

const api = {
  fetchMeds: async (q='') => {
    const url = q ? `/medicine/search?q=${encodeURIComponent(q)}` : '/medicine/list';
    const res = await fetch(url);
    return res.json();
  }
};

function renderMedicines(container, meds){
  const html = meds.map(m => `
    <div class="card">
      <img src="/uploads/medicines/${m.image || 'placeholder.png'}" alt="${m.name}" />
      <h3>${m.name}</h3>
      <p class="small">Brand: ${m.brand || '-'}</p>
      <p>₹${m.price} <span class="small"> | Stock: ${m.stock}</span></p>
      <div class="meta">
        <button class="btn btn-primary" onclick="addToCart('${m._id}','${escapeHtml(m.name)}',${m.price},'${m.image||''}',${m.stock})">Add to Cart</button>
        <button class="btn btn-outline" onclick="viewDetails('${m._id}')">Details</button>
      </div>
    </div>
  `).join('');
  container.innerHTML = html;
}

function escapeHtml(text){
  return (text+'').replace(/'/g,"&#39;").replace(/"/g,"&quot;");
}

async function loadHome(){
  const container = document.getElementById('medGrid');
  const meds = await api.fetchMeds();
  renderMedicines(container, meds);
}

function getCart(){
  return JSON.parse(localStorage.getItem('cart')||'[]');
}
function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); }
function addToCart(id,name,price,image,stock){
  if(stock<=0){ alert('Out of stock'); return; }
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === id);
  if(idx>-1){ cart[idx].qty += 1; } else { cart.push({ id, name, price, image, qty:1 }); }
  saveCart(cart);
  showCartCount();
  alert('Added to cart');
}

function showCartCount(){
  const count = getCart().reduce((s,i)=>s+i.qty,0);
  const el = document.getElementById('cartCount');
  if(el) el.textContent = count;
}

function viewDetails(id){
  location.href = `/medicine/${id}`;
}

/* search */
async function doSearch(evt){
  evt && evt.preventDefault();
  const q = document.getElementById('q').value.trim();
  const res = await api.fetchMeds(q);
  renderMedicines(document.getElementById('medGrid'), res);
}

/* checkout (simple) */
async function placeOrder(){
  const cart = getCart();
  if(cart.length===0){ alert('Cart empty'); return; }
  const token = localStorage.getItem('token');
  const res = await fetch('/orders', {
    method:'POST',
    headers: {
      'Content-Type':'application/json',
      ...(token?{ 'Authorization':'Bearer '+token }:{})
    },
    body: JSON.stringify({ items: cart })
  });
  const data = await res.json();
  if(data._id){ localStorage.removeItem('cart'); showCartCount(); location.href = `/orders/${data._id}`; }
  else alert(data.message || 'Order failed');
}

/* init */
document.addEventListener('DOMContentLoaded', ()=> {
  showCartCount();
  const searchForm = document.getElementById('searchForm');
  if(searchForm) searchForm.addEventListener('submit', doSearch);
});
