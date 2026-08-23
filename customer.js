
// Menu Database
const MENU_DATA = [
  // Starters
  { id: 'st1', name: 'Paneer Tikka', category: 'starters', price: 280, isVeg: true, isChef: true, desc: 'Charcoal-grilled cottage cheese marinated in tandoori spices & mint.' },
  { id: 'st2', name: 'Crispy Pepper Corn', category: 'starters', price: 220, isVeg: true, isChef: false, desc: 'Golden sweet corn wok-tossed with green chili, spring onions & cracked pepper.' },
  { id: 'st3', name: 'Chicken Tikka Smokey', category: 'starters', price: 340, isVeg: false, isChef: true, desc: 'Juicy chicken chunks smoked in earthen clay oven with crushed spices.' },
  { id: 'st4', name: 'BBQ Wings (6 Pcs)', category: 'starters', price: 320, isVeg: false, isChef: false, desc: 'Crispy fried chicken wings coated in house sweet-smokey barbecue glaze.' },
  
  // Pizzas
  { id: 'pz1', name: 'Classic Margherita Pizza', category: 'pizzas', price: 350, isVeg: true, isChef: false, desc: 'Hand-stretched sourdough crust with San Marzano tomatoes, fresh mozzarella & basil.' },
  { id: 'pz2', name: 'Farmhouse Garden Pizza', category: 'pizzas', price: 420, isVeg: true, isChef: true, desc: 'Loaded with bell peppers, sweet corn, button mushrooms, red paprika & olives.' },
  { id: 'pz3', name: 'BBQ Chicken Feast Pizza', category: 'pizzas', price: 460, isVeg: false, isChef: true, desc: 'Grilled BBQ chicken, red onions, jalapeños & smoked gouda cheese.' },

  // Mains
  { id: 'mn1', name: 'Butter Chicken Grand', category: 'mains', price: 380, isVeg: false, isChef: true, desc: 'Tender tandoori chicken simmered in a velvety buttery tomato-cashew gravy.' },
  { id: 'mn2', name: 'Dal Makhani Slow-Cooked', category: 'mains', price: 260, isVeg: true, isChef: true, desc: 'Black lentils slow-cooked overnight with white butter and aromatic spices.' },
  { id: 'mn3', name: 'Hyderabadi Dum Biryani (Chicken)', category: 'mains', price: 360, isVeg: false, isChef: true, desc: 'Aromatic long-grain basmati layered with spiced chicken, served with salan & raita.' },
  { id: 'mn4', name: 'Paneer Butter Masala', category: 'mains', price: 320, isVeg: true, isChef: false, desc: 'Fresh paneer cubes in creamy mildly spiced onion-tomato gravy.' },

  // Breads
  { id: 'br1', name: 'Butter Naan', category: 'breads', price: 50, isVeg: true, isChef: false, desc: 'Fluffy tandoor-baked flatbread glazed with melted butter.' },
  { id: 'br2', name: 'Garlic Butter Naan', category: 'breads', price: 65, isVeg: true, isChef: false, desc: 'Layered naan topped with roasted garlic flakes, cilantro & butter.' },
  { id: 'br3', name: 'Tandoori Roti', category: 'breads', price: 35, isVeg: true, isChef: false, desc: 'Whole wheat flatbread baked crisp in the tandoor.' },

  // Drinks
  { id: 'dr1', name: 'Cold Coffee with Ice Cream', category: 'beverages', price: 140, isVeg: true, isChef: true, desc: 'Thick creamy espresso blended with chocolate syrup & vanilla ice cream.' },
  { id: 'dr2', name: 'Fresh Lime Soda (Sweet/Salted)', category: 'beverages', price: 90, isVeg: true, isChef: false, desc: 'Refreshing bubbly lime drink with rock salt and crushed mint.' },
  { id: 'dr3', name: 'Virgin Mojito Mint', category: 'beverages', price: 150, isVeg: true, isChef: false, desc: 'Muddled fresh mint, lime wedges, cane sugar & sparkling water.' },

  // Desserts
  { id: 'ds1', name: 'Sizzling Brownie with Ice Cream', category: 'desserts', price: 190, isVeg: true, isChef: true, desc: 'Warm fudge brownie served on a hot skillet with dark chocolate sauce.' },
  { id: 'ds2', name: 'Hot Gulab Jamun (2 Pcs)', category: 'desserts', price: 120, isVeg: true, isChef: false, desc: 'Melt-in-mouth milk dumplings soaked in cardamom saffron syrup.' }
];

// State
let currentTable = '4';
let isTableUnlocked = false;
let currentCategory = 'all';
let isVegOnly = false;
let cart = {}; // { 'st1': { item, qty } }

// Storage Sync
const STORAGE_ORDERS_KEY = 'divflow_restaurant_orders_v1';

function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const tableParam = urlParams.get('table') || urlParams.get('t');
  const tokenParam = urlParams.get('token') || urlParams.get('pin');

  if (tableParam) {
    currentTable = tableParam.replace('tbl_', '');
  }

  // Check if already unlocked in session
  const sessionToken = sessionStorage.getItem('divflow_table_verified');
  if (sessionToken === '8492' || tokenParam === '8492' || tokenParam === 'tbl_valid') {
    isTableUnlocked = true;
    document.getElementById('pinOverlay').style.display = 'none';
  } else {
    document.getElementById('pinOverlay').style.display = 'flex';
    document.getElementById('manualTableSelect').value = currentTable;
  }

  document.getElementById('tableNumberDisplay').innerText = 'Table ' + currentTable;
  document.getElementById('drawerTableNumber').innerText = 'Table ' + currentTable;

  renderMenu();
  updateOrderStatusBanner();
  setInterval(updateOrderStatusBanner, 3000);
}

function verifyTableManual() {
  const pin = document.getElementById('tablePinInput').value.trim();
  const selectedTable = document.getElementById('manualTableSelect').value;

  // Master demo PIN is 8492
  if (pin === '8492' || pin === '1234') {
    currentTable = selectedTable;
    sessionStorage.setItem('divflow_table_verified', '8492');
    sessionStorage.setItem('divflow_active_table', currentTable);
    isTableUnlocked = true;
    document.getElementById('pinOverlay').style.display = 'none';
    document.getElementById('tableNumberDisplay').innerText = 'Table ' + currentTable;
    document.getElementById('drawerTableNumber').innerText = 'Table ' + currentTable;
    showToast('Table ' + currentTable + ' Verified!');
    updateOrderStatusBanner();
  } else {
    document.getElementById('pinError').style.display = 'block';
  }
}

function renderMenu() {
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = '';

  const searchVal = document.getElementById('searchInput').value.toLowerCase().trim();

  const filtered = MENU_DATA.filter(item => {
    if (currentCategory !== 'all' && item.category !== currentCategory) return false;
    if (isVegOnly && !item.isVeg) return false;
    if (searchVal && !item.name.toLowerCase().includes(searchVal) && !item.desc.toLowerCase().includes(searchVal)) return false;
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<div style="text-align:center; padding:40px; color:#8b949e;">No dishes found matching your search.</div>';
    return;
  }

  filtered.forEach(item => {
    const qty = cart[item.id] ? cart[item.id].qty : 0;
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <div class="card-details">
        <div class="card-badges">
          <span class="badge-tag ${item.isVeg ? 'veg' : 'nonveg'}">${item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}</span>
          ${item.isChef ? '<span class="badge-tag badge-chef">⭐ Chef Special</span>' : ''}
        </div>
        <div class="item-title">${item.name}</div>
        <div class="item-desc">${item.desc}</div>
        <div class="item-price">₹${item.price}</div>
      </div>
      <div class="card-action">
        ${qty === 0 ? `
          <button class="btn-add" onclick="addToCart('${item.id}')">+ Add</button>
        ` : `
          <div class="qty-control">
            <button class="qty-btn" onclick="decreaseQty('${item.id}')">-</button>
            <span class="qty-val">${qty}</span>
            <button class="qty-btn" onclick="increaseQty('${item.id}')">+</button>
          </div>
        `}
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
  renderMenu();
}

function toggleVegOnly() {
  isVegOnly = !isVegOnly;
  const btn = document.getElementById('vegOnlyBtn');
  btn.classList.toggle('active', isVegOnly);
  renderMenu();
}

function handleSearch() {
  renderMenu();
}

function addToCart(id) {
  const item = MENU_DATA.find(i => i.id === id);
  if (!item) return;
  cart[id] = { item, qty: 1 };
  updateCartUI();
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

  // Header count
  document.getElementById('cartCountBadge').innerText = count;

  // Floating Bar
  const floatBar = document.getElementById('floatingCartBar');
  if (count > 0) {
    floatBar.style.display = 'flex';
    document.getElementById('floatItemsCount').innerText = count + (count === 1 ? ' item' : ' items');
    document.getElementById('floatTotalPrice').innerText = '₹' + grandTotal;
  } else {
    floatBar.style.display = 'none';
  }

  // Drawer list
  const drawerList = document.getElementById('drawerItemsList');
  drawerList.innerHTML = '';
  for (let id in cart) {
    const row = document.createElement('div');
    row.className = 'drawer-item-row';
    row.innerHTML = `
      <div>
        <div class="drawer-item-name">${cart[id].item.name}</div>
        <div style="font-size:0.8rem; color:#8b949e;">₹${cart[id].item.price} × ${cart[id].qty} = ₹${cart[id].item.price * cart[id].qty}</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="decreaseQty('${id}')">-</button>
        <span class="qty-val">${cart[id].qty}</span>
        <button class="qty-btn" onclick="increaseQty('${id}')">+</button>
      </div>
    `;
    drawerList.appendChild(row);
  }

  document.getElementById('drawerSubtotal').innerText = '₹' + subtotal;
  document.getElementById('drawerTax').innerText = '₹' + tax;
  document.getElementById('drawerGrandTotal').innerText = '₹' + grandTotal;

  renderMenu();
}

function toggleCart() {
  const overlay = document.getElementById('cartOverlay');
  const drawer = document.getElementById('cartDrawer');
  const isVisible = drawer.style.display === 'flex';

  overlay.style.display = isVisible ? 'none' : 'block';
  drawer.style.display = isVisible ? 'none' : 'flex';
}

function placeOrder() {
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
    showToast('Your cart is empty!');
    return;
  }

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;
  const specialNotes = document.getElementById('orderSpecialNotes').value.trim();

  const kotId = 'KOT-' + Math.floor(100 + Math.random() * 900);
  const newOrder = {
    id: kotId,
    table: currentTable,
    items,
    specialNotes: specialNotes || 'None',
    subtotal,
    tax,
    total,
    status: 'Preparing', // Preparing -> Ready -> Served -> Paid
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: Date.now()
  };

  // Save to shared localStorage (synced with kitchen.html)
  const existingOrders = JSON.parse(localStorage.getItem(STORAGE_ORDERS_KEY) || '[]');
  existingOrders.push(newOrder);
  localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(existingOrders));

  // Reset Cart
  cart = {};
  document.getElementById('orderSpecialNotes').value = '';
  updateCartUI();
  toggleCart();

  showToast('🎉 Order #' + kotId + ' Sent to Kitchen!');
  updateOrderStatusBanner();
}

function updateOrderStatusBanner() {
  const allOrders = JSON.parse(localStorage.getItem(STORAGE_ORDERS_KEY) || '[]');
  const tableOrders = allOrders.filter(o => o.table === currentTable && o.status !== 'Paid');

  const banner = document.getElementById('orderStatusBanner');
  if (tableOrders.length > 0) {
    const latest = tableOrders[tableOrders.length - 1];
    banner.style.display = 'flex';
    document.getElementById('bannerStatusTitle').innerText = `Order #${latest.id} is ${latest.status}`;
    
    let totalBill = 0;
    tableOrders.forEach(o => totalBill += o.total);
    document.getElementById('bannerBillTotal').innerText = totalBill;
  } else {
    banner.style.display = 'none';
  }
}

function openBillModal() {
  const allOrders = JSON.parse(localStorage.getItem(STORAGE_ORDERS_KEY) || '[]');
  const tableOrders = allOrders.filter(o => o.table === currentTable && o.status !== 'Paid');

  const container = document.getElementById('billOrdersContainer');
  container.innerHTML = '';

  let subtotal = 0;
  tableOrders.forEach(o => {
    subtotal += o.subtotal;
    const card = document.createElement('div');
    card.style.cssText = 'background:#0d1117; padding:12px; border-radius:10px; margin-bottom:10px; text-align:left;';
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:6px; color:#58a6ff;">
        <span>#${o.id} (${o.timestamp})</span>
        <span style="color:#d29922;">${o.status}</span>
      </div>
      ${o.items.map(i => `<div style="font-size:0.85rem; display:flex; justify-content:space-between;"><span>${i.qty}x ${i.name}</span><span>₹${i.price * i.qty}</span></div>`).join('')}
    `;
    container.appendChild(card);
  });

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  document.getElementById('billSubtotal').innerText = '₹' + subtotal;
  document.getElementById('billTax').innerText = '₹' + tax;
  document.getElementById('billGrandTotal').innerText = '₹' + total;

  document.getElementById('billOverlay').style.display = 'flex';
}

function closeBillModal() {
  document.getElementById('billOverlay').style.display = 'none';
}

function requestBill() {
  showToast('🧾 Waiter notified! Bill is on its way to Table ' + currentTable);
  closeBillModal();
}

function callWaiter() {
  showToast('🔔 Floor Captain alerted for Table ' + currentTable + '!');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

window.onload = init;
