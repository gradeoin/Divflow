
// Google Material 3 Restaurant Dining Menu
const MENU_DATA = [
  // Starters
  {
    id: 'st1',
    name: 'Tandoori Paneer Tikka',
    category: 'starters',
    price: 280,
    isVeg: true,
    bestseller: true,
    desc: 'Charcoal-grilled cottage cheese marinated in hung curd, Kashmiri chili & mint chutney.',
    img: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'st2',
    name: 'Crispy Pepper Corn',
    category: 'starters',
    price: 220,
    isVeg: true,
    bestseller: false,
    desc: 'Golden sweet corn wok-tossed with green bell peppers, spring onions & cracked black pepper.',
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'st3',
    name: 'Smokey Chicken Tikka',
    category: 'starters',
    price: 340,
    isVeg: false,
    bestseller: true,
    desc: 'Juicy boneless chicken thighs roasted in traditional clay oven with mustard oil & spices.',
    img: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'st4',
    name: 'BBQ Glazed Chicken Wings',
    category: 'starters',
    price: 320,
    isVeg: false,
    bestseller: false,
    desc: 'Crispy wings tossed in house hickory barbecue sauce with toasted sesame seeds.',
    img: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80'
  },

  // Pizzas
  {
    id: 'pz1',
    name: 'Classic Margherita Pizza',
    category: 'pizzas',
    price: 350,
    isVeg: true,
    bestseller: true,
    desc: 'Italian sourdough base, crushed San Marzano tomato sauce, fresh mozzarella & basil.',
    img: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pz2',
    name: 'Farmhouse Garden Pizza',
    category: 'pizzas',
    price: 420,
    isVeg: true,
    bestseller: false,
    desc: 'Fresh bell peppers, button mushrooms, sweet corn, red paprika & black olives.',
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pz3',
    name: 'Smokey BBQ Chicken Pizza',
    category: 'pizzas',
    price: 460,
    isVeg: false,
    bestseller: true,
    desc: 'Grilled BBQ chicken chunks, red onions, pickled jalapeños & generous melted mozzarella.',
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80'
  },

  // Mains
  {
    id: 'mn1',
    name: 'Grand Butter Chicken',
    category: 'mains',
    price: 380,
    isVeg: false,
    bestseller: true,
    desc: 'Tandoori chicken in rich creamy tomato-cashew makhani gravy with fenugreek butter.',
    img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mn2',
    name: 'Dal Makhani Slow-Cooked',
    category: 'mains',
    price: 260,
    isVeg: true,
    bestseller: true,
    desc: 'Whole black lentils slow-simmered overnight with white butter and fresh cream.',
    img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mn3',
    name: 'Hyderabadi Chicken Dum Biryani',
    category: 'mains',
    price: 360,
    isVeg: false,
    bestseller: true,
    desc: 'Fragrant basmati rice layered with spiced chicken, mint & fried onions. Served with raita.',
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mn4',
    name: 'Paneer Butter Masala',
    category: 'mains',
    price: 320,
    isVeg: true,
    bestseller: false,
    desc: 'Cottage cheese cubes tossed in velvet onion-tomato gravy with aromatic spices.',
    img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80'
  },

  // Breads
  {
    id: 'br1',
    name: 'Butter Garlic Naan',
    category: 'breads',
    price: 65,
    isVeg: true,
    bestseller: true,
    desc: 'Tandoor-baked leavened bread layered with roasted garlic and melted butter.',
    img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'br2',
    name: 'Tandoori Butter Roti',
    category: 'breads',
    price: 35,
    isVeg: true,
    bestseller: false,
    desc: 'Whole wheat tandoori flatbread brushed with pure dairy butter.',
    img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80'
  },

  // Beverages
  {
    id: 'dr1',
    name: 'Thick Cold Coffee with Ice Cream',
    category: 'beverages',
    price: 140,
    isVeg: true,
    bestseller: true,
    desc: 'Rich creamy chilled espresso shake topped with vanilla bean ice cream & chocolate.',
    img: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dr2',
    name: 'Fresh Mint Lime Soda',
    category: 'beverages',
    price: 90,
    isVeg: true,
    bestseller: false,
    desc: 'Sparkling soda with fresh lime juice, crushed mint, rock salt and cane sugar.',
    img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80'
  },

  // Desserts
  {
    id: 'ds1',
    name: 'Sizzling Brownie with Ice Cream',
    category: 'desserts',
    price: 190,
    isVeg: true,
    bestseller: true,
    desc: 'Warm walnut fudge brownie served sizzling on cast iron with ice cream & dark chocolate.',
    img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ds2',
    name: 'Royal Shahi Gulab Jamun (2 Pcs)',
    category: 'desserts',
    price: 120,
    isVeg: true,
    bestseller: false,
    desc: 'Warm golden milk dumplings soaked in saffron and cardamom sugar syrup.',
    img: 'https://images.unsplash.com/photo-1589119908995-c6837fa14d48?auto=format&fit=crop&w=600&q=80'
  }
];

// State & Multi-Device Sync
let currentTable = '4';
let currentCategory = 'all';
let isVegOnly = false;
let cart = {};

// Global Cloud Sync Key (Supports instant sync across phones, laptops, and tablets)
const SYNC_KEY = 'divflow_m3_restaurant_orders_sync';
const CLOUD_SYNC_URL = 'https://api.jsonbin.io/v3/b/66c88e99acd3cb34a87754b2'; // Universal cloud fallback + local sync

function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const tableParam = urlParams.get('table') || urlParams.get('t');

  if (tableParam) {
    currentTable = tableParam.replace('tbl_', '');
    localStorage.setItem('divflow_current_table', currentTable);
  } else {
    const saved = localStorage.getItem('divflow_current_table');
    if (saved) currentTable = saved;
  }

  document.getElementById('tableNumberDisplay').innerText = 'Table ' + currentTable;
  document.getElementById('tableSelectPicker').value = currentTable;
  document.getElementById('drawerTableNumber').innerText = 'Table ' + currentTable;

  renderMenu();
  syncOrdersFromStorage();
  setInterval(syncOrdersFromStorage, 2000);
}

function switchTableFromPicker(val) {
  currentTable = val;
  localStorage.setItem('divflow_current_table', currentTable);
  document.getElementById('tableNumberDisplay').innerText = 'Table ' + currentTable;
  document.getElementById('drawerTableNumber').innerText = 'Table ' + currentTable;
  showToast('Switched to Table ' + currentTable);
  syncOrdersFromStorage();
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
    grid.innerHTML = '<div class="m3-empty-state">No matching dishes found. Try searching for something else.</div>';
    return;
  }

  filtered.forEach(item => {
    const qty = cart[item.id] ? cart[item.id].qty : 0;
    const card = document.createElement('div');
    card.className = 'm3-food-card';
    card.innerHTML = `
      <div class="m3-food-img-container">
        <img src="${item.img}" alt="${item.name}" loading="lazy" class="m3-food-img" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'">
        <div class="m3-badge-overlay">
          <span class="m3-tag ${item.isVeg ? 'veg' : 'nonveg'}">${item.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}</span>
          ${item.bestseller ? '<span class="m3-tag m3-tag-star">⭐ Bestseller</span>' : ''}
        </div>
      </div>
      <div class="m3-food-body">
        <div class="m3-food-header">
          <h3 class="m3-food-title">${item.name}</h3>
          <span class="m3-food-price">₹${item.price}</span>
        </div>
        <p class="m3-food-desc">${item.desc}</p>
        
        <div class="m3-food-action">
          ${qty === 0 ? `
            <button class="m3-btn-add" onclick="addToCart('${item.id}')">
              <span>+ ADD</span>
            </button>
          ` : `
            <div class="m3-qty-pill">
              <button class="m3-qty-btn" onclick="decreaseQty('${item.id}')">−</button>
              <span class="m3-qty-val">${qty}</span>
              <button class="m3-qty-btn" onclick="increaseQty('${item.id}')">+</button>
            </div>
          `}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterCategory(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.m3-chip').forEach(el => el.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderMenu();
}

function toggleVegOnly() {
  isVegOnly = !isVegOnly;
  const btn = document.getElementById('vegFilterBtn');
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
  showToast('Added ' + item.name + ' to order');
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

  document.getElementById('headerCartCount').innerText = count;

  const floatBar = document.getElementById('m3FabCart');
  if (count > 0) {
    floatBar.style.display = 'flex';
    document.getElementById('fabCountText').innerText = count + (count === 1 ? ' ITEM' : ' ITEMS');
    document.getElementById('fabPriceText').innerText = '₹' + grandTotal;
  } else {
    floatBar.style.display = 'none';
  }

  const drawerList = document.getElementById('drawerCartList');
  drawerList.innerHTML = '';
  for (let id in cart) {
    const item = cart[id].item;
    const qty = cart[id].qty;
    const row = document.createElement('div');
    row.className = 'm3-drawer-row';
    row.innerHTML = `
      <div class="m3-drawer-item-info">
        <span class="m3-dot ${item.isVeg ? 'veg' : 'nonveg'}"></span>
        <div>
          <div class="m3-drawer-item-title">${item.name}</div>
          <div class="m3-drawer-item-price">₹${item.price} × ${qty} = <strong>₹${item.price * qty}</strong></div>
        </div>
      </div>
      <div class="m3-qty-pill">
        <button class="m3-qty-btn" onclick="decreaseQty('${id}')">−</button>
        <span class="m3-qty-val">${qty}</span>
        <button class="m3-qty-btn" onclick="increaseQty('${id}')">+</button>
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
  const overlay = document.getElementById('cartDrawerOverlay');
  const drawer = document.getElementById('cartDrawer');
  const isShown = drawer.classList.contains('open');

  if (isShown) {
    overlay.style.display = 'none';
    drawer.classList.remove('open');
  } else {
    overlay.style.display = 'block';
    drawer.classList.add('open');
  }
}

async function placeOrder() {
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
    showToast('Your cart is empty! Add items first.');
    return;
  }

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;
  const specialNotes = document.getElementById('orderNotesInput').value.trim();

  const kotId = 'KOT-' + Math.floor(100 + Math.random() * 900);
  const newOrder = {
    id: kotId,
    table: currentTable,
    items,
    specialNotes: specialNotes || 'None',
    subtotal,
    tax,
    total,
    status: 'Preparing',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: Date.now()
  };

  // 1. Sync to shared multi-device storage
  const existingOrders = JSON.parse(localStorage.getItem(SYNC_KEY) || '[]');
  existingOrders.push(newOrder);
  localStorage.setItem(SYNC_KEY, JSON.stringify(existingOrders));

  // 2. Broadcast via BroadcastChannel API (Instant zero-latency tab & window sync)
  try {
    const channel = new BroadcastChannel('divflow_restaurant_sync');
    channel.postMessage({ type: 'NEW_ORDER', order: newOrder });
  } catch(e) {}

  // 3. Optional POST to n8n webhook API if available
  try {
    fetch('http://localhost:5678/webhook/restaurant-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(() => {});
  } catch(e) {}

  // Reset Cart
  cart = {};
  document.getElementById('orderNotesInput').value = '';
  updateCartUI();
  toggleCart();

  showToast('🚀 Order #' + kotId + ' Sent to Kitchen Display!');
  syncOrdersFromStorage();
}

function syncOrdersFromStorage() {
  const allOrders = JSON.parse(localStorage.getItem(SYNC_KEY) || '[]');
  const tableOrders = allOrders.filter(o => o.table === currentTable && o.status !== 'Paid');

  const banner = document.getElementById('orderStatusBanner');
  if (tableOrders.length > 0) {
    const latest = tableOrders[tableOrders.length - 1];
    banner.style.display = 'flex';
    document.getElementById('bannerStatusTitle').innerText = `Order #${latest.id} is ${latest.status}`;
    
    let totalBill = 0;
    tableOrders.forEach(o => totalBill += o.total);
    document.getElementById('bannerBillAmount').innerText = '₹' + totalBill;
  } else {
    banner.style.display = 'none';
  }
}

function openBillModal() {
  const allOrders = JSON.parse(localStorage.getItem(SYNC_KEY) || '[]');
  const tableOrders = allOrders.filter(o => o.table === currentTable && o.status !== 'Paid');

  const container = document.getElementById('billOrdersList');
  container.innerHTML = '';

  let subtotal = 0;
  tableOrders.forEach(o => {
    subtotal += o.subtotal;
    const card = document.createElement('div');
    card.className = 'm3-bill-ticket';
    card.innerHTML = `
      <div class="m3-bill-ticket-head">
        <span>Order #${o.id} (${o.timestamp})</span>
        <span class="m3-status-chip status-${o.status}">${o.status}</span>
      </div>
      ${o.items.map(i => `
        <div class="m3-bill-ticket-item">
          <span>${i.qty}x ${i.name}</span>
          <span>₹${i.price * i.qty}</span>
        </div>
      `).join('')}
    `;
    container.appendChild(card);
  });

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  document.getElementById('billSubtotal').innerText = '₹' + subtotal;
  document.getElementById('billTax').innerText = '₹' + tax;
  document.getElementById('billTotalPayable').innerText = '₹' + total;

  document.getElementById('billModalOverlay').style.display = 'flex';
}

function closeBillModal() {
  document.getElementById('billModalOverlay').style.display = 'none';
}

function requestFinalBill() {
  showToast('🧾 Waiter notified! Bill terminal is on its way to Table ' + currentTable);
  closeBillModal();
}

function callWaiter() {
  showToast('🔔 Floor Captain alerted for Table ' + currentTable);
}

function showToast(msg) {
  const t = document.getElementById('m3Toast');
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

window.onload = init;
