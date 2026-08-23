
// The Grand Estate Hospitality Menu
const MENU_DATA = [
  // Starters
  {
    id: 'st1',
    name: 'Charcoal Smoked Paneer Tikka',
    category: 'starters',
    price: 280,
    isVeg: true,
    signature: true,
    desc: 'Artisanal cottage cheese marinated in hung curd, hand-pounded spices, char-grilled in clay oven.',
    img: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'st2',
    name: 'Wok Tossed Crispy Pepper Corn',
    category: 'starters',
    price: 220,
    isVeg: true,
    signature: false,
    desc: 'Tender corn kernels flash-fried with scallions, bell peppers, cracked black pepper and rock salt.',
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'st3',
    name: 'Tandoori Murgh Malai Tikka',
    category: 'starters',
    price: 340,
    isVeg: false,
    signature: true,
    desc: 'Prime boneless chicken infused with crushed cardamom, cream, cheddar cheese and yellow chili.',
    img: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'st4',
    name: 'Hickory Glazed Chicken Wings',
    category: 'starters',
    price: 320,
    isVeg: false,
    signature: false,
    desc: 'Crisp chicken wings glazed in house-crafted smoked barbecue reduction, toasted white sesame.',
    img: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80'
  },

  // Pizzas
  {
    id: 'pz1',
    name: 'Artisanal Margherita Pizza',
    category: 'pizzas',
    price: 350,
    isVeg: true,
    signature: true,
    desc: 'Fermented sourdough crust, San Marzano tomato reduction, fresh Fior di Latte mozzarella, organic basil.',
    img: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pz2',
    name: 'Verdure Rustica Pizza',
    category: 'pizzas',
    price: 420,
    isVeg: true,
    signature: false,
    desc: 'Roasted sweet peppers, button mushrooms, charred sweet corn, sun-ripened olives and aged parmesan.',
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pz3',
    name: 'Smoked Barbecue Chicken Pizza',
    category: 'pizzas',
    price: 460,
    isVeg: false,
    signature: true,
    desc: 'Shredded smoked chicken, caramelized shallots, pickled jalapeños and smoked provolone cheese.',
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80'
  },

  // Mains
  {
    id: 'mn1',
    name: 'Signature Butter Chicken',
    category: 'mains',
    price: 380,
    isVeg: false,
    signature: true,
    desc: 'Charcoal-roasted chicken simmered in rich satin tomato-cashew reduction with fenugreek butter.',
    img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mn2',
    name: 'Slow Simmered Dal Makhani',
    category: 'mains',
    price: 260,
    isVeg: true,
    signature: true,
    desc: 'Overnight charcoal-simmered whole black lentils enriched with churned butter and dairy cream.',
    img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mn3',
    name: 'Nawabi Chicken Dum Biryani',
    category: 'mains',
    price: 360,
    isVeg: false,
    signature: true,
    desc: 'Aged basmati rice sealed on dum with marinated spring chicken, saffron and caramelized onions.',
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mn4',
    name: 'Paneer Makhani Royale',
    category: 'mains',
    price: 320,
    isVeg: true,
    signature: false,
    desc: 'Fresh cottage cheese batons in velvety spiced tomato-onion reduction with fresh coriander.',
    img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80'
  },

  // Breads
  {
    id: 'br1',
    name: 'Roasted Garlic Butter Naan',
    category: 'breads',
    price: 65,
    isVeg: true,
    signature: true,
    desc: 'Clay oven baked leavened flatbread infused with roasted garlic confit and churned butter.',
    img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'br2',
    name: 'Traditional Tandoori Roti',
    category: 'breads',
    price: 35,
    isVeg: true,
    signature: false,
    desc: 'Whole wheat crisp flatbread baked in the tandoor, finished with clarified butter.',
    img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80'
  },

  // Beverages
  {
    id: 'dr1',
    name: 'Artisan Cold Brew Glacé',
    category: 'beverages',
    price: 140,
    isVeg: true,
    signature: true,
    desc: 'Slow-steeped arabica cold brew blended with dairy cream, Madagascar vanilla bean gelato.',
    img: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dr2',
    name: 'Preserved Mint Lime Cooler',
    category: 'beverages',
    price: 90,
    isVeg: true,
    signature: false,
    desc: 'Hand-pressed key lime, Himalayan pink rock salt, organic cane sugar and sparkling soda.',
    img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80'
  },

  // Desserts
  {
    id: 'ds1',
    name: 'Sizzling Valrhona Brownie',
    category: 'desserts',
    price: 190,
    isVeg: true,
    signature: true,
    desc: 'Dark chocolate walnut torte served on hot skillet with vanilla gelato and warm ganache.',
    img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ds2',
    name: 'Shahi Kesari Gulab Jamun (2 Pcs)',
    category: 'desserts',
    price: 120,
    isVeg: true,
    signature: false,
    desc: 'Khoya dumplings infused with saffron and green cardamom, soaked in warm rose syrup.',
    img: 'https://images.unsplash.com/photo-1589119908995-c6837fa14d48?auto=format&fit=crop&w=600&q=80'
  }
];

let currentTable = '4';
let currentCategory = 'all';
let isVegOnly = false;
let cart = {};

// Global Multi-Device Real-Time Pub/Sub Channel
const SYNC_TOPIC = 'divflow_restaurant_kot_live_stream_9921';
const LOCAL_STORAGE_ORDERS = 'divflow_realtime_orders_v2';
let allTableOrders = [];


const VALID_TABLE_TOKENS = {
  'T1_9e8a7b4f': '1',
  'T2_4c5d6e1a': '2',
  'T3_7f8a9b2c': '3',
  'T4_1a2b3c9d': '4',
  'T5_8d9e0f5e': '5',
  'T6_3c4d5e8a': '6',
  'T7_6f7a8b1c': '7',
  'T8_2a3b4c7d': '8'
};

let isTableSecurityVerified = false;

function validateTableSecurity() {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenParam = urlParams.get('t') || urlParams.get('token');
  const tableParam = urlParams.get('table');

  // Check if opened via valid cryptographic QR token
  if (tokenParam && VALID_TABLE_TOKENS[tokenParam]) {
    currentTable = VALID_TABLE_TOKENS[tokenParam];
    isTableSecurityVerified = true;
    sessionStorage.setItem('divflow_verified_table_token', tokenParam);
    sessionStorage.setItem('divflow_verified_table', currentTable);
  } else {
    // Check if session has a previously verified token
    const savedToken = sessionStorage.getItem('divflow_verified_table_token');
    if (savedToken && VALID_TABLE_TOKENS[savedToken]) {
      currentTable = VALID_TABLE_TOKENS[savedToken];
      isTableSecurityVerified = true;
    } else if (tableParam && Object.values(VALID_TABLE_TOKENS).includes(tableParam)) {
      // User typed raw ?table=X without cryptographic token: LOCK ACCESS
      isTableSecurityVerified = false;
      currentTable = tableParam;
    } else {
      isTableSecurityVerified = false;
      currentTable = '4';
    }
  }

  // If table access is locked due to manual URL tampering:
  const banner = document.getElementById('tableSecurityLockBanner');
  const dispatchBtn = document.querySelector('.btn-dispatch-order');
  const addButtons = document.querySelectorAll('.btn-add-item');

  if (!isTableSecurityVerified) {
    if (banner) banner.style.display = 'flex';
    if (dispatchBtn) {
      dispatchBtn.disabled = true;
      dispatchBtn.style.opacity = '0.5';
      dispatchBtn.style.cursor = 'not-allowed';
      dispatchBtn.innerText = '🔒 SCAN TABLE QR TO ORDER';
    }
  } else {
    if (banner) banner.style.display = 'none';
    if (dispatchBtn) {
      dispatchBtn.disabled = false;
      dispatchBtn.style.opacity = '1';
      dispatchBtn.style.cursor = 'pointer';
      dispatchBtn.innerText = 'DISPATCH ORDER TO KITCHEN';
    }
  }

  document.getElementById('tableNumberDisplay').innerText = 'Table ' + currentTable;
  document.getElementById('drawerTableNumber').innerText = 'Table ' + currentTable;
}

function init() {
  validateTableSecurity();
  const urlParams = new URLSearchParams(window.location.search);
  const tableParam = urlParams.get('table') || urlParams.get('t');

  if (tableParam) {
    currentTable = tableParam.replace('tbl_', '');
    localStorage.setItem('divflow_current_table', currentTable);
  } else {
    const saved = localStorage.getItem('divflow_current_table');
    if (saved) currentTable = saved;
  }

  // Pre-fill guest details if previously saved
  const savedName = localStorage.getItem('divflow_guest_name');
  const savedPhone = localStorage.getItem('divflow_guest_phone');
  if (savedName && document.getElementById('guestNameInput')) document.getElementById('guestNameInput').value = savedName;
  if (savedPhone && document.getElementById('guestPhoneInput')) document.getElementById('guestPhoneInput').value = savedPhone;

  document.getElementById('tableNumberDisplay').innerText = 'Table ' + currentTable;
  document.getElementById('tableSelectPicker').value = currentTable;
  document.getElementById('drawerTableNumber').innerText = 'Table ' + currentTable;

  renderMenu();
  loadOrdersInitial();
  setupRealtimeSSE();
}

function switchTableFromPicker(val) {
  currentTable = val;
  localStorage.setItem('divflow_current_table', currentTable);
  document.getElementById('tableNumberDisplay').innerText = 'Table ' + currentTable;
  document.getElementById('drawerTableNumber').innerText = 'Table ' + currentTable;
  showToast('Switched to Table ' + currentTable);
  updateOrderStatusBanner();
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
    grid.innerHTML = '<div class="empty-state">No selections found matching your search.</div>';
    return;
  }

  filtered.forEach(item => {
    const qty = cart[item.id] ? cart[item.id].qty : 0;
    const card = document.createElement('div');
    card.className = 'food-card';
    card.innerHTML = `
      <div class="food-img-frame">
        <img src="${item.img}" alt="${item.name}" loading="lazy" class="food-img" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'">
        <div class="food-badge-overlay">
          <span class="fssai-indicator ${item.isVeg ? 'veg' : 'nonveg'}">
            <span class="fssai-dot"></span>
          </span>
          ${item.signature ? '<span class="signature-tag">SIGNATURE</span>' : ''}
        </div>
      </div>
      <div class="food-body">
        <div class="food-header">
          <h3 class="food-title">${item.name}</h3>
          <span class="food-price">₹${item.price}</span>
        </div>
        <p class="food-desc">${item.desc}</p>
        
        <div class="food-footer">
          ${qty === 0 ? `
            <button class="btn-add-item" onclick="addToCart('${item.id}')">
              <span>ADD TO ORDER</span>
            </button>
          ` : `
            <div class="qty-controller">
              <button class="qty-btn" onclick="decreaseQty('${item.id}')">−</button>
              <span class="qty-value">${qty}</span>
              <button class="qty-btn" onclick="increaseQty('${item.id}')">+</button>
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
  document.querySelectorAll('.cat-tab').forEach(el => el.classList.remove('active'));
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

  document.getElementById('headerCartCount').innerText = count;

  const floatBar = document.getElementById('stickyCartBar');
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
    row.className = 'drawer-row';
    row.innerHTML = `
      <div class="drawer-item-details">
        <span class="fssai-indicator ${item.isVeg ? 'veg' : 'nonveg'}"><span class="fssai-dot"></span></span>
        <div>
          <div class="drawer-item-title">${item.name}</div>
          <div class="drawer-item-sub">₹${item.price} × ${qty} = <strong>₹${item.price * qty}</strong></div>
        </div>
      </div>
      <div class="qty-controller">
        <button class="qty-btn" onclick="decreaseQty('${id}')">−</button>
        <span class="qty-value">${qty}</span>
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

// =========================================================================
// Real-Time Multi-Device Cloud Sync via Global Pub/Sub (ntfy.sh) + n8n Webhook
// =========================================================================
async function placeOrder() {
  if (!isTableSecurityVerified) {
    showToast('🔒 Access Denied: You must physically scan the QR code on Table ' + currentTable + ' to place an order.');
    return;
  }
  const guestName = (document.getElementById('guestNameInput')?.value || '').trim();
  const guestPhone = (document.getElementById('guestPhoneInput')?.value || '').trim();

  if (!guestName) {
    showToast('Please enter your Guest Name before placing order.');
    document.getElementById('guestNameInput')?.focus();
    return;
  }

  localStorage.setItem('divflow_guest_name', guestName);
  if (guestPhone) localStorage.setItem('divflow_guest_phone', guestPhone);

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
    showToast('Your order selection is empty.');
    return;
  }

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;
  const specialNotes = document.getElementById('orderNotesInput').value.trim();

  const kotId = 'KOT-' + Math.floor(100 + Math.random() * 900);
  const newOrder = {
    id: kotId,
    table: currentTable,
    customerName: guestName,
    customerPhone: guestPhone || 'N/A',
    items,
    specialNotes: specialNotes || 'None',
    subtotal,
    tax,
    total,
    status: 'Preparing',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: Date.now()
  };

  // 1. Save locally for instant rendering
  saveOrderLocal(newOrder);

  // 2. Publish to Global Multi-Device Cloud Stream (Instant sub-second delivery to Laptop/Tablet)
  try {
    fetch('https://ntfy.sh/' + SYNC_TOPIC, {
      method: 'POST',
      headers: { 'Title': 'NEW_ORDER' },
      body: JSON.stringify({ type: 'NEW_ORDER', order: newOrder })
    }).catch(e => console.error('Cloud stream pub error:', e));
  } catch(e) {}

  // 3. Dispatch to local n8n workflow engine if active
  try {
    fetch('http://localhost:5678/webhook/restaurant-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(() => {});
  } catch(e) {}

  // Reset Cart UI
  cart = {};
  document.getElementById('orderNotesInput').value = '';
  updateCartUI();
  toggleCart();

  showToast('Order #' + kotId + ' dispatched to kitchen.');
  updateOrderStatusBanner();
}

function saveOrderLocal(order) {
  const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  const idx = existing.findIndex(o => o.id === order.id);
  if (idx >= 0) existing[idx] = order;
  else existing.push(order);
  localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(existing));
  allTableOrders = existing;
}

function loadOrdersInitial() {
  allTableOrders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  
  // Fetch historical cloud orders for synchronization
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
    const eventSource = new EventSource('https://ntfy.sh/' + SYNC_TOPIC + '/sse');
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message) {
          const payload = JSON.parse(data.message);
          if (payload.type === 'NEW_ORDER' && payload.order) {
            saveOrderLocal(payload.order);
            updateOrderStatusBanner();
          } else if (payload.type === 'UPDATE_STATUS' && payload.orderId) {
            updateOrderStatusLocal(payload.orderId, payload.status);
            updateOrderStatusBanner();
          }
        }
      } catch(e) {}
    };
  } catch(e) {}
}

function updateOrderStatusLocal(orderId, status) {
  const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  const order = existing.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(existing));
    allTableOrders = existing;
  }
}

function updateOrderStatusBanner() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  const tableOrders = orders.filter(o => o.table === currentTable && o.status !== 'Paid');

  const banner = document.getElementById('orderStatusBanner');
  if (tableOrders.length > 0) {
    const latest = tableOrders[tableOrders.length - 1];
    banner.style.display = 'flex';
    document.getElementById('bannerStatusTitle').innerText = `Order #${latest.id} in ${latest.status}`;
    
    let totalBill = 0;
    tableOrders.forEach(o => totalBill += o.total);
    document.getElementById('bannerBillAmount').innerText = '₹' + totalBill;
  } else {
    banner.style.display = 'none';
  }
}

function openBillModal() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  const tableOrders = orders.filter(o => o.table === currentTable && o.status !== 'Paid');

  const container = document.getElementById('billOrdersList');
  container.innerHTML = '';

  let subtotal = 0;
  tableOrders.forEach(o => {
    subtotal += o.subtotal;
    const card = document.createElement('div');
    card.className = 'bill-ticket';
    card.innerHTML = `
      <div class="bill-ticket-head">
        <span>Order #${o.id} • ${o.timestamp}</span>
        <span class="status-pill ${o.status.toLowerCase()}">${o.status.toUpperCase()}</span>
      </div>
      ${o.items.map(i => `
        <div class="bill-ticket-row">
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
  showToast('Service captain notified. Bill terminal dispatched to Table ' + currentTable);
  closeBillModal();
}

function callWaiter() {
  showToast('Service captain summoned for Table ' + currentTable);
}

function showToast(msg) {
  const t = document.getElementById('toastNotification');
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

window.onload = init;
