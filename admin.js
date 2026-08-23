
const SYNC_TOPIC = 'divflow_restaurant_kot_live_stream_9921';
const LOCAL_STORAGE_ORDERS = 'divflow_realtime_orders_v2';
const LOCAL_STORAGE_MENU = 'divflow_custom_menu_v1';

let activeSelectedTable = '4';
let currentMenu = [];

const INITIAL_MENU = [
  { id: 'st1', name: 'Charcoal Smoked Paneer Tikka', category: 'starters', price: 280, isVeg: true, inStock: true, img: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80' },
  { id: 'st2', name: 'Wok Tossed Crispy Pepper Corn', category: 'starters', price: 220, isVeg: true, inStock: true, img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=600&q=80' },
  { id: 'st3', name: 'Tandoori Murgh Malai Tikka', category: 'starters', price: 340, isVeg: false, inStock: true, img: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80' },
  { id: 'pz1', name: 'Artisanal Margherita Pizza', category: 'pizzas', price: 350, isVeg: true, inStock: true, img: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80' },
  { id: 'mn1', name: 'Signature Butter Chicken', category: 'mains', price: 380, isVeg: false, inStock: true, img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80' },
  { id: 'mn2', name: 'Slow Simmered Dal Makhani', category: 'mains', price: 260, isVeg: true, inStock: true, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80' },
  { id: 'br1', name: 'Roasted Garlic Butter Naan', category: 'breads', price: 65, isVeg: true, inStock: true, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80' },
  { id: 'dr1', name: 'Artisan Cold Brew Glacé', category: 'beverages', price: 140, isVeg: true, inStock: true, img: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80' }
];

function init() {
  loadMenuData();
  loadOrdersInitial();
  setupRealtimeSSE();
  renderAdminStandees();
  setInterval(loadOrdersInitial, 2500);
}

function switchTab(viewId, btnElement) {
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.pos-view').forEach(el => el.classList.remove('active'));

  if (btnElement) btnElement.classList.add('active');
  const target = document.getElementById('view' + viewId.charAt(0).toUpperCase() + viewId.slice(1));
  if (target) target.classList.add('active');
}

function loadMenuData() {
  const saved = localStorage.getItem(LOCAL_STORAGE_MENU);
  if (saved) currentMenu = JSON.parse(saved);
  else currentMenu = [...INITIAL_MENU];
  renderMenuEditor();
  populateDishSelect();
}

function saveMenuData() {
  localStorage.setItem(LOCAL_STORAGE_MENU, JSON.stringify(currentMenu));
  renderMenuEditor();
  populateDishSelect();
}

function populateDishSelect() {
  const select = document.getElementById('punchDishSelect');
  if (!select) return;
  select.innerHTML = '';
  currentMenu.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.innerText = `${item.name} (₹${item.price})`;
    select.appendChild(opt);
  });
}

function renderFloorPlan() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  const grid = document.getElementById('floorTablesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  let vacant = 0, cooking = 0, served = 0, todaySales = 0;

  for (let i = 1; i <= 12; i++) {
    const tableOrders = orders.filter(o => o.table == i && o.status !== 'Paid');
    let state = 'Vacant';
    let guestName = 'Vacant Table';
    let info = 'Ready for seating';
    let total = 0;

    if (tableOrders.length > 0) {
      const hasCooking = tableOrders.some(o => o.status === 'Preparing');
      const allServed = tableOrders.every(o => o.status === 'Served');

      if (hasCooking) {
        state = 'Cooking';
        cooking++;
        info = '🍳 In Kitchen';
      } else if (allServed) {
        state = 'Served';
        served++;
        info = '✅ Food on Table';
      }

      guestName = tableOrders[0].customerName || 'Guest';
      let count = 0;
      tableOrders.forEach(o => {
        total += o.total;
        count += o.items ? o.items.length : 0;
      });
      info += ' (' + count + ' items)';
    } else {
      vacant++;
    }

    const card = document.createElement('div');
    card.className = `pos-table-card state-${state}`;
    card.onclick = () => openTableCheckoutSheet(i);
    card.innerHTML = `
      <div class="card-top">
        <span class="card-num">TABLE ${i}</span>
        <span class="card-pill">${state.toUpperCase()}</span>
      </div>
      <div class="card-mid">
        <div class="card-guest">${guestName}</div>
        <div class="card-info">${info}</div>
      </div>
      <div class="card-bot">
        <span class="card-total">${total > 0 ? '₹' + total : 'FREE'}</span>
        <span class="card-hint">Tap to Settle ➔</span>
      </div>
    `;
    grid.appendChild(card);
  }

  orders.forEach(o => todaySales += o.total);

  if (document.getElementById('countVacant')) document.getElementById('countVacant').innerText = vacant;
  if (document.getElementById('countCooking')) document.getElementById('countCooking').innerText = cooking;
  if (document.getElementById('countServed')) document.getElementById('countServed').innerText = served;
  if (document.getElementById('activeTablesCountBadge')) document.getElementById('activeTablesCountBadge').innerText = cooking + served;
  if (document.getElementById('floorTodaySales')) document.getElementById('floorTodaySales').innerText = '₹' + todaySales;
}

function openTableCheckoutSheet(tableNum) {
  activeSelectedTable = String(tableNum);
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  const tableOrders = orders.filter(o => o.table == activeSelectedTable && o.status !== 'Paid');

  document.getElementById('sheetTableTitle').innerText = 'TABLE ' + activeSelectedTable;

  let guestName = 'Walk-in Guest';
  let guestPhone = 'Not provided';
  let subtotal = 0;
  let statusText = 'VACANT';

  const list = document.getElementById('sheetItemsList');
  list.innerHTML = '';

  if (tableOrders.length > 0) {
    const isAllServed = tableOrders.every(o => o.status === 'Served');
    statusText = isAllServed ? 'SERVED' : 'COOKING';
    guestName = tableOrders[0].customerName || 'Guest';
    guestPhone = tableOrders[0].customerPhone || 'N/A';

    tableOrders.forEach(o => {
      subtotal += o.subtotal;
      const orderBox = document.createElement('div');
      orderBox.className = 'sheet-order-card';
      orderBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#60a5fa; font-weight:700; margin-bottom:6px;">
          <span>#${o.id} • ${o.timestamp}</span>
          <span style="color:${o.status === 'Served' ? '#4ade80' : '#fbbf24'};">${o.status.toUpperCase()}</span>
        </div>
        ${o.items.map(i => `
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin:2px 0;">
            <span>${i.qty}x ${i.name}</span>
            <span>₹${i.price * i.qty}</span>
          </div>
        `).join('')}
      `;
      list.appendChild(orderBox);
    });
  } else {
    list.innerHTML = '<div style="text-align:center; padding:40px 20px; color:#94a3b8; font-size:0.9rem;">Table is currently vacant and clean.</div>';
  }

  const statusTag = document.getElementById('sheetStatusTag');
  statusTag.innerText = statusText;
  if (statusText === 'VACANT') {
    statusTag.style.background = 'rgba(34, 197, 94, 0.2)';
    statusTag.style.color = '#4ade80';
  } else if (statusText === 'SERVED') {
    statusTag.style.background = 'rgba(59, 130, 246, 0.25)';
    statusTag.style.color = '#60a5fa';
  } else {
    statusTag.style.background = 'rgba(245, 158, 11, 0.25)';
    statusTag.style.color = '#fbbf24';
  }

  document.getElementById('sheetGuestName').innerText = guestName;
  document.getElementById('sheetGuestPhone').innerText = guestPhone;

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  document.getElementById('sheetSubtotal').innerText = '₹' + subtotal;
  document.getElementById('sheetTax').innerText = '₹' + tax;
  document.getElementById('sheetTotal').innerText = '₹' + total;

  document.getElementById('tableModalOverlay').style.display = 'flex';
}

function closeTableModal() {
  document.getElementById('tableModalOverlay').style.display = 'none';
}

function settleAndClearCurrentTable() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  const tableOrders = orders.filter(o => o.table == activeSelectedTable);
  tableOrders.forEach(o => o.status = 'Paid');
  localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(orders));

  // Broadcast CLEAR_TABLE event
  try {
    fetch('https://ntfy.sh/' + SYNC_TOPIC, {
      method: 'POST',
      body: JSON.stringify({ type: 'CLEAR_TABLE', table: activeSelectedTable, status: 'Paid' })
    }).catch(() => {});
  } catch(e) {}

  closeTableModal();
  renderFloorPlan();
  renderCRM();
  renderAnalytics();
  showToast('Table ' + activeSelectedTable + ' marked Paid & Cleared!');
}

function renderMenuEditor() {
  const grid = document.getElementById('menuEditorGrid');
  if (!grid) return;
  grid.innerHTML = '';

  currentMenu.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-item-row';
    card.innerHTML = `
      <img src="${item.img}" class="menu-item-thumb" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'">
      <div style="flex:1;">
        <div style="font-weight:700; font-size:0.9rem; margin-bottom:2px;">${item.name}</div>
        <span>₹<input type="number" value="${item.price}" style="background:#0f172a; border:1px solid #334155; color:#fff; width:65px; border-radius:4px; padding:2px 6px; font-weight:700;" onchange="updateItemPrice('${item.id}', this.value)"></span>
      </div>
      <button class="btn-secondary" style="${item.inStock ? 'color:#4ade80;' : 'color:#f87171;'}" onclick="toggleItemStock('${item.id}')">
        ${item.inStock ? '✓ In Stock' : '✕ Sold Out'}
      </button>
    `;
    grid.appendChild(card);
  });
}

function updateItemPrice(id, newPrice) {
  const item = currentMenu.find(i => i.id === id);
  if (item) {
    item.price = Number(newPrice);
    saveMenuData();
    showToast('Price updated to ₹' + newPrice);
  }
}

function toggleItemStock(id) {
  const item = currentMenu.find(i => i.id === id);
  if (item) {
    item.inStock = !item.inStock;
    saveMenuData();
    showToast(item.name + (item.inStock ? ' In Stock' : ' Sold Out'));
  }
}

function openAddDishModal() {
  document.getElementById('modalAddDish').style.display = 'flex';
}

function submitNewDish() {
  const name = document.getElementById('addDishName').value.trim();
  const price = Number(document.getElementById('addDishPrice').value);
  const category = document.getElementById('addDishCategory').value;
  const isVeg = document.getElementById('addDishVeg').value === 'true';

  if (!name || !price) {
    showToast('Enter dish name and price');
    return;
  }

  currentMenu.push({
    id: 'dish_' + Date.now(),
    name,
    category,
    price,
    isVeg,
    inStock: true,
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  });

  saveMenuData();
  closeModal('modalAddDish');
  document.getElementById('addDishName').value = '';
  document.getElementById('addDishPrice').value = '';
  showToast(name + ' added to menu!');
}

function openNewOrderModal() {
  document.getElementById('modalPunchOrder').style.display = 'flex';
}

function submitManualOrder() {
  const table = document.getElementById('punchTableSelect').value;
  const guestName = document.getElementById('punchGuestName').value.trim() || 'Walk-in Guest';
  const dishId = document.getElementById('punchDishSelect').value;
  const qty = Number(document.getElementById('punchQty').value) || 1;

  const dish = currentMenu.find(i => i.id === dishId);
  if (!dish) return;

  const subtotal = dish.price * qty;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const kotId = 'KOT-' + Math.floor(100 + Math.random() * 900);
  const newOrder = {
    id: kotId,
    table,
    customerName: guestName,
    customerPhone: 'Walk-in',
    items: [{ name: dish.name, qty, price: dish.price }],
    specialNotes: 'Punched at Counter',
    subtotal,
    tax,
    total,
    status: 'Preparing',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: Date.now()
  };

  saveOrderLocal(newOrder);

  try {
    fetch('https://ntfy.sh/' + SYNC_TOPIC, {
      method: 'POST',
      body: JSON.stringify({ type: 'NEW_ORDER', order: newOrder })
    }).catch(() => {});
  } catch(e) {}

  closeModal('modalPunchOrder');
  renderFloorPlan();
  showToast('Order #' + kotId + ' sent to kitchen!');
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function renderCRM() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  const map = new Map();

  orders.forEach(o => {
    const phone = o.customerPhone || 'N/A';
    const name = o.customerName || 'Guest';
    if (phone !== 'N/A' && phone.length > 5) {
      if (!map.has(phone)) map.set(phone, { name, phone, count: 1, spend: o.total, lastTable: o.table });
      else {
        const r = map.get(phone);
        r.count++;
        r.spend += o.total;
        r.lastTable = o.table;
      }
    }
  });

  const tbody = document.getElementById('crmTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (map.size === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:#94a3b8;">No customer CRM records captured yet.</td></tr>';
    return;
  }

  map.forEach(g => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${g.name}</strong></td>
      <td>${g.phone}</td>
      <td>${g.count} visit(s)</td>
      <td><strong>₹${g.spend}</strong></td>
      <td>Table ${g.lastTable}</td>
      <td><a href="https://wa.me/${g.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(g.name)},%20thank%20you%20for%20dining%20at%20The%20Grand%20Estate!" target="_blank" class="btn-punch-order" style="font-size:0.75rem; padding:4px 8px; text-decoration:none; display:inline-flex;">💬 WhatsApp</a></td>
    `;
    tbody.appendChild(row);
  });
}

function exportCrmCsv() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  let csv = 'data:text/csv;charset=utf-8,Name,Phone,Total Orders,Total Spent\n';
  const map = new Map();

  orders.forEach(o => {
    const phone = o.customerPhone || 'Walk-in';
    const name = o.customerName || 'Guest';
    if (!map.has(phone)) map.set(phone, { name, phone, count: 1, total: o.total });
    else {
      const g = map.get(phone);
      g.count++;
      g.total += o.total;
    }
  });

  map.forEach(g => {
    csv += `"${g.name}","${g.phone}",${g.count},${g.total}\n`;
  });

  const encoded = encodeURI(csv);
  const link = document.createElement('a');
  link.setAttribute('href', encoded);
  link.setAttribute('download', 'crm_customers.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('CRM data exported to CSV!');
}

function renderAnalytics() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  let total = 0;
  orders.forEach(o => total += o.total);

  const aov = orders.length > 0 ? Math.round(total / orders.length) : 0;
  const gst = Math.round(total * 0.05);

  if (document.getElementById('analyticRevenue')) document.getElementById('analyticRevenue').innerText = '₹' + total;
  if (document.getElementById('analyticTablesCount')) document.getElementById('analyticTablesCount').innerText = orders.length;
  if (document.getElementById('analyticAov')) document.getElementById('analyticAov').innerText = '₹' + aov;
  if (document.getElementById('analyticGst')) document.getElementById('analyticGst').innerText = '₹' + gst;
}

function printDailyZReport() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  let total = 0;
  orders.forEach(o => total += o.total);

  const win = window.open('', '', 'width=380,height=550');
  win.document.write(`
    <html>
    <head><title>Z-Report</title><style>body { font-family: monospace; padding: 20px; font-size: 13px; } .center { text-align: center; } .line { border-top: 1px dashed #000; margin: 8px 0; } .row { display: flex; justify-content: space-between; margin: 4px 0; }</style></head>
    <body>
      <div class="center"><h2>THE GRAND ESTATE</h2><h3>DAILY CLOSING Z-REPORT</h3><div>${new Date().toLocaleString()}</div></div>
      <div class="line"></div>
      <div class="row"><span>Total Orders:</span><span>${orders.length}</span></div>
      <div class="row"><span>Gross Sales:</span><span>₹${total}</span></div>
      <div class="row"><span>GST (5%):</span><span>₹${Math.round(total * 0.05)}</span></div>
      <div class="line"></div>
      <div class="center"><strong>*** REGISTER BALANCED & CLOSED ***</strong></div>
    </body></html>
  `);
  win.document.close();
  win.print();
}

function printTableTaxInvoice() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  const tableOrders = orders.filter(o => o.table == activeSelectedTable);
  if (tableOrders.length === 0) {
    showToast('No active orders on Table ' + activeSelectedTable);
    return;
  }

  let subtotal = 0;
  tableOrders.forEach(o => subtotal += o.subtotal);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const win = window.open('', '', 'width=380,height=550');
  win.document.write(`
    <html>
    <head><title>Invoice Table ${activeSelectedTable}</title><style>body { font-family: monospace; padding: 20px; font-size: 13px; } .center { text-align: center; } .line { border-top: 1px dashed #000; margin: 8px 0; } .row { display: flex; justify-content: space-between; margin: 4px 0; }</style></head>
    <body>
      <div class="center"><h2>THE GRAND ESTATE BISTRO</h2><div>GSTIN: 27AABCT3518Q1Z4</div><h3>TAX INVOICE — TABLE ${activeSelectedTable}</h3><div>${new Date().toLocaleString()}</div></div>
      <div class="line"></div>
      ${tableOrders.map(o => o.items.map(i => `<div class="row"><span>${i.qty}x ${i.name}</span><span>₹${i.price * i.qty}</span></div>`).join('')).join('')}
      <div class="line"></div>
      <div class="row"><span>Subtotal:</span><span>₹${subtotal}</span></div>
      <div class="row"><span>GST (5%):</span><span>₹${tax}</span></div>
      <div class="line"></div>
      <div class="row" style="font-size:16px;"><strong>TOTAL:</strong><strong>₹${total}</strong></div>
      <div class="line"></div>
      <div class="center"><div>Thank you!</div></div>
    </body></html>
  `);
  win.document.close();
  win.print();
}

function renderAdminStandees() {
  const container = document.getElementById('adminStandeesGrid');
  if (!container) return;
  container.innerHTML = '';
  const baseUrl = 'https://divflow.pages.dev';

  for (let i = 1; i <= 8; i++) {
    const targetUrl = `${baseUrl}/?table=${i}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(targetUrl)}&margin=4`;

    const card = document.createElement('div');
    card.className = 'admin-standee-card';
    card.innerHTML = `
      <div style="font-weight:800; font-size:1rem; text-transform:uppercase;">THE GRAND ESTATE</div>
      <div style="font-size:0.75rem; color:#64748b; margin-bottom:8px;">Table Standee</div>
      <img src="${qrApiUrl}" style="width:140px; height:140px; margin-bottom:8px;">
      <div style="background:#0f172a; color:#fff; font-weight:800; padding:6px 12px; border-radius:6px; font-size:1rem;">TABLE ${i}</div>
    `;
    container.appendChild(card);
  }
}

function printStandeesClean() {
  switchTab('qr');
  setTimeout(() => window.print(), 100);
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
  renderFloorPlan();
  renderCRM();
  renderAnalytics();

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
      renderFloorPlan();
      renderCRM();
      renderAnalytics();
    })
    .catch(() => {});
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
          }
          renderFloorPlan();
          renderCRM();
          renderAnalytics();
        }
      } catch(err) {}
    };
  } catch(e) {}
}

function showToast(msg) {
  const t = document.getElementById('adminToast');
  if (!t) return;
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

window.onload = init;
