
const MENU_DATA = [
 { id: 'st1', name: 'Charcoal Smoked Paneer Tikka', category: 'starters', price: 280, isVeg: true, signature: true, desc: 'Artisanal cottage cheese marinated in hung curd, hand-pounded spices, char-grilled in clay oven.', img: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80' },
 { id: 'st2', name: 'Wok Tossed Crispy Pepper Corn', category: 'starters', price: 220, isVeg: true, signature: false, desc: 'Tender corn kernels flash-fried with scallions, bell peppers, cracked black pepper and rock salt.', img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=600&q=80' },
 { id: 'st3', name: 'Tandoori Murgh Malai Tikka', category: 'starters', price: 340, isVeg: false, signature: true, desc: 'Prime boneless chicken infused with crushed cardamom, cream, cheddar cheese and yellow chili.', img: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80' },
 { id: 'pz1', name: 'Artisanal Margherita Pizza', category: 'pizzas', price: 350, isVeg: true, signature: true, desc: 'Fermented sourdough crust, San Marzano tomato reduction, fresh Fior di Latte mozzarella, organic basil.', img: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80' },
 { id: 'mn1', name: 'Signature Butter Chicken', category: 'mains', price: 380, isVeg: false, signature: true, desc: 'Charcoal-roasted chicken simmered in rich satin tomato-cashew reduction with fenugreek butter.', img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80' },
 { id: 'mn2', name: 'Slow Simmered Dal Makhani', category: 'mains', price: 260, isVeg: true, signature: true, desc: 'Overnight charcoal-simmered whole black lentils enriched with churned butter and dairy cream.', img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80' },
 { id: 'br1', name: 'Roasted Garlic Butter Naan', category: 'breads', price: 65, isVeg: true, signature: true, desc: 'Clay oven baked leavened flatbread infused with roasted garlic confit and churned butter.', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80' },
 { id: 'dr1', name: 'Artisan Cold Brew Glacé', category: 'beverages', price: 140, isVeg: true, signature: true, desc: 'Slow-steeped arabica cold brew blended with dairy cream, Madagascar vanilla bean gelato.', img: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80' }
];

let currentTable = '4';
let currentCategory = 'all';
let isVegOnly = false;
let cart = {};

const SYNC_TOPIC = 'divflow_restaurant_kot_live_stream_9921';
const LOCAL_STORAGE_ORDERS = 'divflow_realtime_orders_v2';
const LOCAL_STORAGE_MENU = 'divflow_custom_menu_v1';

// Unique Dining Session ID for current customer party
let currentSessionId = sessionStorage.getItem('divflow_current_session_id') || ('sess_' + Date.now());
sessionStorage.setItem('divflow_current_session_id', currentSessionId);

function init() {
 const urlParams = new URLSearchParams(window.location.search);
 const tableParam = urlParams.get('table') || urlParams.get('t');
 if (tableParam) {
 currentTable = tableParam.replace(/[^0-9]/g, '') || '4';
 }

 if (document.getElementById('tableNumberDisplay')) document.getElementById('tableNumberDisplay').innerText = 'Table ' + currentTable;
 if (document.getElementById('drawerTableNumber')) document.getElementById('drawerTableNumber').innerText = 'Table ' + currentTable;

 const savedName = localStorage.getItem('divflow_guest_name');
 if (savedName && document.getElementById('guestNameInput')) document.getElementById('guestNameInput').value = savedName;

 renderMenu();
 loadOrdersInitial();
 setupRealtimeSSE();
 setInterval(loadOrdersInitial, 3000);
}

function getActiveMenuData() {
 const custom = localStorage.getItem(LOCAL_STORAGE_MENU);
 if (custom) {
 try {
 const parsed = JSON.parse(custom);
 if (Array.isArray(parsed) && parsed.length > 0) return parsed;
 } catch(e) {}
 }
 return MENU_DATA;
}

function renderMenu() {
 const grid = document.getElementById('menuGrid');
 if (!grid) return;
 grid.innerHTML = '';

 const activeMenu = getActiveMenuData();
 const searchVal = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();

 const filtered = activeMenu.filter(item => {
 if (currentCategory !== 'all' && item.category !== currentCategory) return false;
 if (isVegOnly && !item.isVeg) return false;
 if (searchVal && !item.name.toLowerCase().includes(searchVal)) return false;
 return true;
 });

 if (filtered.length === 0) {
 grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:#94a3b8;">No selections match your filter.</div>';
 return;
 }

 filtered.forEach(item => {
 const qty = cart[item.id] ? cart[item.id].qty : 0;
 const isSoldOut = item.inStock === false;
 const card = document.createElement('div');
 card.className = 'food-card' + (isSoldOut ? ' sold-out' : '');
 card.innerHTML = `
 <div class="food-img-frame">
 <img src="${item.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}" class="food-img" alt="${item.name}">
 <div class="food-badge-overlay">
 <span class="fssai-indicator ${item.isVeg ? 'veg' : 'nonveg'}"><span class="fssai-dot"></span></span>
 ${item.signature ? '<span class="signature-tag">SIGNATURE</span>' : ''}
 </div>
 </div>
 <div class="food-body">
 <div class="food-header">
 <h3 class="food-title">${item.name}</h3>
 <span class="food-price">₹${item.price}</span>
 </div>
 <p class="food-desc">${item.desc || 'Signature recipe crafted fresh by our master chefs.'}</p>
 <div class="food-footer">
 ${isSoldOut ? `
 <span style="font-size:0.75rem; font-weight:800; color:#ef4444;">OUT OF STOCK</span>
 ` : (qty === 0 ? `
 <button class="btn-add-item" onclick="addToCart('${item.id}')">ADD TO ORDER</button>
 ` : `
 <div class="qty-controller">
 <button class="qty-btn" onclick="decreaseQty('${item.id}')">−</button>
 <span class="qty-value">${qty}</span>
 <button class="qty-btn" onclick="increaseQty('${item.id}')">+</button>
 </div>
 `)}
 </div>
 </div>
 `;
 grid.appendChild(card);
 });
}

function filterCategory(cat, btn) {
 currentCategory = cat;
 document.querySelectorAll('.cat-tab').forEach(el => el.classList.remove('active'));
 if (btn) btn.classList.add('active');
 renderMenu();
}

function toggleVegOnly() {
 isVegOnly = !isVegOnly;
 document.getElementById('vegFilterBtn')?.classList.toggle('active', isVegOnly);
 renderMenu();
}

function handleSearch() { renderMenu(); }

function addToCart(id) {
 const activeMenu = getActiveMenuData();
 const item = activeMenu.find(i => i.id === id);
 if (!item) return;
 cart[id] = { item, qty: 1 };
 updateCartUI();
 showToast(item.name + ' added');
}

function increaseQty(id) {
 if (cart[id]) {
 cart[id].qty++;
 updateCartUI();
 }
}

function decreaseQty(id) {
 if (cart[id]) {
 cart[id].qty--;
 if (cart[id].qty <= 0) delete cart[id];
 updateCartUI();
 }
}

function updateCartUI() {
 let count = 0;
 let subtotal = 0;

 for (let id in cart) {
 count += cart[id].qty;
 subtotal += cart[id].item.price * cart[id].qty;
 }

 const tax = Math.round(subtotal * 0.05);
 const grandTotal = subtotal + tax;

 if (document.getElementById('headerCartCount')) document.getElementById('headerCartCount').innerText = count;

 const floatBar = document.getElementById('stickyCartBar');
 if (floatBar) {
 if (count > 0) {
 floatBar.style.display = 'flex';
 document.getElementById('fabCountText').innerText = count + (count === 1 ? ' ITEM' : ' ITEMS');
 document.getElementById('fabPriceText').innerText = '₹' + grandTotal;
 } else {
 floatBar.style.display = 'none';
 }
 }

 const drawerList = document.getElementById('drawerCartList');
 if (drawerList) {
 drawerList.innerHTML = '';
 for (let id in cart) {
 const item = cart[id].item;
 const qty = cart[id].qty;
 const row = document.createElement('div');
 row.className = 'drawer-row';
 row.innerHTML = `
 <div class="drawer-item-details">
 <div class="drawer-item-title">${item.name}</div>
 <div class="drawer-item-sub">₹${item.price} × ${qty} = <strong>₹${item.price * qty}</strong></div>
 </div>
 <div class="qty-controller" style="width:100px;">
 <button class="qty-btn" onclick="decreaseQty('${id}')">−</button>
 <span class="qty-value">${qty}</span>
 <button class="qty-btn" onclick="increaseQty('${id}')">+</button>
 </div>
 `;
 drawerList.appendChild(row);
 }
 }

 if (document.getElementById('drawerSubtotal')) document.getElementById('drawerSubtotal').innerText = '₹' + subtotal;
 if (document.getElementById('drawerTax')) document.getElementById('drawerTax').innerText = '₹' + tax;
 if (document.getElementById('drawerGrandTotal')) document.getElementById('drawerGrandTotal').innerText = '₹' + grandTotal;

 renderMenu();
}

function toggleCart() {
 const overlay = document.getElementById('cartDrawerOverlay');
 const drawer = document.getElementById('cartDrawer');
 if (!drawer) return;
 const isShown = drawer.classList.contains('open');

 if (isShown) {
 if (overlay) overlay.style.display = 'none';
 drawer.classList.remove('open');
 } else {
 if (overlay) overlay.style.display = 'block';
 drawer.classList.add('open');
 }
}

async function placeOrder() {
 const guestName = (document.getElementById('guestNameInput')?.value || '').trim() || ('Guest (Table ' + currentTable + ')');
 const guestPhone = (document.getElementById('guestPhoneInput')?.value || '').trim() || 'N/A';

 localStorage.setItem('divflow_guest_name', guestName);

 const items = [];
 let subtotal = 0;

 for (let id in cart) {
 items.push({
 name: cart[id].item.name,
 qty: cart[id].qty,
 price: cart[id].item.price
 });
 subtotal += cart[id].item.price * cart[id].qty;
 }

 if (items.length === 0) {
 showToast('Please add items to your cart first!');
 return;
 }

 const tax = Math.round(subtotal * 0.05);
 const total = subtotal + tax;
 const specialNotes = (document.getElementById('orderNotesInput')?.value || '').trim();

 const kotId = 'KOT-' + Math.floor(100 + Math.random() * 900);
 const newOrder = {
 id: kotId,
 table: currentTable,
 sessionId: currentSessionId,
 customerName: guestName,
 customerPhone: guestPhone,
 items,
 specialNotes: specialNotes || 'None',
 subtotal,
 tax,
 total,
 status: 'Preparing',
 timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
 createdAt: Date.now()
 };

 saveOrderLocal(newOrder);

 // Broadcast to cloud for Kitchen & Admin
 try {
 fetch('https://ntfy.sh/' + SYNC_TOPIC, {
 method: 'POST',
 headers: { 'Title': 'NEW_ORDER' },
 body: JSON.stringify({ type: 'NEW_ORDER', order: newOrder })
 }).catch(() => {});
 } catch(e) {}

 cart = {};
 if (document.getElementById('orderNotesInput')) document.getElementById('orderNotesInput').value = '';
 updateCartUI();
 toggleCart();

 showToast(' Order #' + kotId + ' sent to kitchen!');
 updateOrderStatusBanner();
}

function saveOrderLocal(order) {
 const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
 const idx = existing.findIndex(o => o.id === order.id);
 if (idx >= 0) existing[idx] = order;
 else existing.push(order);
 localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(existing));
}

function updateOrderStatusLocal(orderId, status) {
 const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
 const order = existing.find(o => o.id === orderId);
 if (order) {
 order.status = status;
 localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(existing));
 }
}

function loadOrdersInitial() {
 fetch('https://ntfy.sh/' + SYNC_TOPIC + '/json?poll=1')
 .then(r => r.text())
 .then(text => {
 const lines = text.trim().split('\n');
 lines.forEach(line => {
 try {
 const data = JSON.parse(line);
 if (data.message) {
 const payload = JSON.parse(data.message);
 if (payload.type === 'NEW_ORDER' && payload.order) {
 saveOrderLocal(payload.order);
 } else if (payload.type === 'UPDATE_STATUS' && payload.orderId) {
 updateOrderStatusLocal(payload.orderId, payload.status);
 } else if (payload.type === 'CLEAR_TABLE' && payload.table == currentTable) {
 // Table was cleared by manager: reset session
 currentSessionId = 'sess_' + Date.now();
 sessionStorage.setItem('divflow_current_session_id', currentSessionId);
 }
 }
 } catch(e) {}
 });
 updateOrderStatusBanner();
 })
 .catch(() => {});

 updateOrderStatusBanner();
}

function setupRealtimeSSE() {
 try {
 const es = new EventSource('https://ntfy.sh/' + SYNC_TOPIC + '/sse');
 es.onmessage = (e) => {
 try {
 const data = JSON.parse(e.data);
 if (data.message) {
 const payload = JSON.parse(data.message);
 if (payload.type === 'NEW_ORDER' && payload.order) {
 saveOrderLocal(payload.order);
 } else if (payload.type === 'UPDATE_STATUS' && payload.orderId) {
 updateOrderStatusLocal(payload.orderId, payload.status);
 } else if (payload.type === 'CLEAR_TABLE' && payload.table == currentTable) {
 currentSessionId = 'sess_' + Date.now();
 sessionStorage.setItem('divflow_current_session_id', currentSessionId);
 }
 updateOrderStatusBanner();
 }
 } catch(err) {}
 };
 } catch(e) {}
}

function updateOrderStatusBanner() {
 const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
 // Only show active un-paid orders belonging to current table
 const activeOrders = orders.filter(o => o.table === currentTable && o.status !== 'Paid' && (o.sessionId === currentSessionId || !o.sessionId));

 const banner = document.getElementById('orderStatusBanner');
 if (!banner) return;

 if (activeOrders.length > 0) {
 const latest = activeOrders[activeOrders.length - 1];
 banner.style.display = 'flex';
 document.getElementById('bannerStatusTitle').innerText = `Order #${latest.id} | ${latest.status.toUpperCase()}`;
 
 let totalBill = 0;
 activeOrders.forEach(o => totalBill += o.total);
 document.getElementById('bannerBillAmount').innerText = '₹' + totalBill;
 } else {
 banner.style.display = 'none';
 }
}

function openBillModal() {
 const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
 const activeOrders = orders.filter(o => o.table === currentTable && o.status !== 'Paid' && (o.sessionId === currentSessionId || !o.sessionId));

 const container = document.getElementById('billOrdersList');
 if (!container) return;
 container.innerHTML = '';

 let subtotal = 0;
 activeOrders.forEach(o => {
 subtotal += o.subtotal;
 const card = document.createElement('div');
 card.style.cssText = 'background:#f8fafc; padding:12px; border-radius:8px; margin-bottom:8px; border:1px solid #e2e8f0;';
 card.innerHTML = `
 <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700; color:#2563eb; margin-bottom:6px;">
 <span>#${o.id} | ${o.timestamp}</span>
 <span>${o.status.toUpperCase()}</span>
 </div>
 ${o.items.map(i => `
 <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin:2px 0;">
 <span>${i.qty}x ${i.name}</span>
 <span>₹${i.price * i.qty}</span>
 </div>
 `).join('')}
 `;
 container.appendChild(card);
 });

 const tax = Math.round(subtotal * 0.05);
 const total = subtotal + tax;

 if (document.getElementById('billSubtotal')) document.getElementById('billSubtotal').innerText = '₹' + subtotal;
 if (document.getElementById('billTax')) document.getElementById('billTax').innerText = '₹' + tax;
 if (document.getElementById('billTotalPayable')) document.getElementById('billTotalPayable').innerText = '₹' + total;

 if (document.getElementById('billModalOverlay')) document.getElementById('billModalOverlay').style.display = 'flex';
}

function closeBillModal() {
 if (document.getElementById('billModalOverlay')) document.getElementById('billModalOverlay').style.display = 'none';
}

function requestFinalBill() {
 showToast('Captain notified for Table ' + currentTable);
 closeBillModal();
}

function callWaiter() {
 showToast('Captain summoned to Table ' + currentTable);
}

function showToast(msg) {
 const t = document.getElementById('toastNotification');
 if (!t) return;
 t.innerText = msg;
 t.classList.add('show');
 setTimeout(() => t.classList.remove('show'), 2500);
}

if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', init);
} else {
 init();
}
