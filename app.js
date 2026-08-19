const SUPABASE_URL = 'https://vgnmkikduqpiarxjbqpg.supabase.co';
const SUPABASE_KEY = window.MILLET_MITRA_SUPABASE_KEY || '';
const db = SUPABASE_KEY ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
let cart = JSON.parse(localStorage.getItem('milletMitraCart') || '[]');
const $ = (id) => document.getElementById(id);
function money(v){return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(v||0)}
function renderCart(){ $('cartCount').textContent=cart.reduce((n,i)=>n+i.quantity,0); $('cartItems').innerHTML=cart.length?cart.map((i,n)=>`<div class="cart-line"><div><strong>${i.name}</strong><small>${money(i.price)} × ${i.quantity}</small></div><button data-remove="${n}">×</button></div>`).join(''):'<div class="empty">Your cart is waiting for something good.</div>'; $('cartTotal').textContent=money(cart.reduce((s,i)=>s+i.price*i.quantity,0)); }
function openCart(){$('cartDrawer').classList.add('open');$('overlay').classList.add('show')}
function closeCart(){$('cartDrawer').classList.remove('open');$('overlay').classList.remove('show')}
$('cartButton').onclick=openCart;$('closeCart').onclick=closeCart;$('overlay').onclick=closeCart;
$('cartItems').onclick=e=>{const b=e.target.closest('[data-remove]');if(!b)return;cart.splice(Number(b.dataset.remove),1);localStorage.setItem('milletMitraCart',JSON.stringify(cart));renderCart()};
renderCart();

async function loadCatalog(){
 if(!db){$('productGrid').innerHTML='<div class="empty">Our collection is being prepared.</div>';return;}
 const {data,error}=await db.from('products').select('*').eq('is_active',true).order('featured',{ascending:false});
 if(error){$('productGrid').innerHTML='<div class="empty">Catalogue temporarily unavailable.</div>';return;}
 if(!data.length){$('productGrid').innerHTML='<div class="empty">Our first collection is being prepared. Products will appear here soon.</div>';return;}
 $('productGrid').innerHTML=data.map(p=>`<article class="product-card"><div class="product-image">${p.name.slice(0,1)}</div><div class="product-info"><h3>${p.name}</h3><p>${p.short_description||'Thoughtfully selected for everyday living.'}</p><div class="price-row"><span class="price">${money(p.price)}</span><button class="add" data-add="${p.id}">+</button></div></div></article>`).join('');
 $('productGrid').onclick=e=>{const b=e.target.closest('[data-add]');if(!b)return;const p=data.find(x=>x.id===b.dataset.add);const old=cart.find(x=>x.product_id===p.id);if(old)old.quantity++;else cart.push({product_id:p.id,name:p.name,price:p.price,quantity:1});localStorage.setItem('milletMitraCart',JSON.stringify(cart));renderCart();openCart()};
}
loadCatalog();
