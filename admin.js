
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
  setupRealtimeSSE();
  loadOrdersInitial();
  renderMenuEditor();
  renderCRM();
  renderAnalytics();
  renderAdminStandees();
  selectInspectorTable(activeSelectedTable);

  setInterval(() => {
    renderFloorPlan();
    renderCRM();
    renderAnalytics();
  }, 2000);
}

function switchTab(tabId, btnElement) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.pos-tab-content').forEach(el => el.classList.remove('active'));

  if (btnElement) btnElement.classList.add('active');

  const titles = {
    floor: 'Interactive Floor Plan & Tables',
    menu: 'Menu Catalog & Live Price Studio',
    crm: 'Guest CRM Database',
    analytics: 'Daily Z-Report & Sales Ledger',
    qr: 'Table QR Standees Studio'
  };

  document.getElementById('pageHeading').innerText = titles[tabId] || 'Dashboard';
  const targetContent = document.getElementById('tab' + tabId.charAt(0).toUpperCase() + tabId.slice(1));
  if (targetContent) targetContent.classList.add('active');
}

function loadMenuData() {
  const saved = localStorage.getItem(LOCAL_STORAGE_MENU);
  if (saved) currentMenu = JSON.parse(saved);
  else currentMenu = [...INITIAL_MENU];
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


const LOCAL_STORAGE_TABLE_STATES = 'divflow_table_states_v1';

function getTableStateMap() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_TABLE_STATES) || '{}');
}

function setTableState(tableNum, stateObj) {
  const map = getTableStateMap();
  map[tableNum] = stateObj;
  localStorage.setItem(LOCAL_STORAGE_TABLE_STATES, JSON.stringify(map));
  
  // Broadcast table state change
  try {
    fetch('https://ntfy.sh/' + SYNC_TOPIC, {
      method: 'POST',
      body: JSON.stringify({ type: 'TABLE_STATE_CHANGE', table: tableNum, state: stateObj })
    }).catch(() => {});
  } catch(e) {}
}


function renderFloorPlan() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  const tableStateMap = getTableStateMap();
  const grid = document.getElementById('floorTablesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  let vacant = 0, occupied = 0, preparing = 0, served = 0, todaySales = 0;

  for (let i = 1; i <= 12; i++) {
    const tableOrders = orders.filter(o => o.table == i && o.status !== 'Paid');
    const customState = tableStateMap[i] || { status: 'Vacant', guestName: '' };
    
    let status = customState.status || 'Vacant';
    let total = 0;
    let guestName = customState.guestName || 'Vacant Table';
    let itemsSummary = 'Ready for seating';

    if (tableOrders.length > 0) {
      const hasPreparing = tableOrders.some(o => o.status === 'Preparing');
      const allServed = tableOrders.every(o => o.status === 'Served');

      if (hasPreparing) {
        status = 'Preparing';
        preparing++;
        itemsSummary = '🍳 Kitchen Cooking';
      } else if (allServed) {
        status = 'Served';
        served++;
        itemsSummary = '✅ Food on Table (Served)';
      } else {
        status = 'Dining';
        preparing++;
      }

      guestName = tableOrders[0].customerName || 'Guest';
      let count = 0;
      tableOrders.forEach(o => {
        total += o.total;
        count += o.items ? o.items.length : 0;
      });
      itemsSummary += ' • ' + count + ' items';
    } else if (status === 'Occupied') {
      occupied++;
      itemsSummary = 'Seated (Browsing Menu)';
    } else {
      status = 'Vacant';
      vacant++;
    }

    const card = document.createElement('div');
    card.className = `table-card status-${status}`;
    card.onclick = () => selectInspectorTable(i);
    card.innerHTML = `
      <div class="table-card-top">
        <span class="table-card-num">TABLE ${i}</span>
        <span class="table-card-badge status-tag-${status}">${status.toUpperCase()}</span>
      </div>
      <div class="table-card-mid">
        <div class="table-card-guest">${guestName}</div>
        <div class="table-card-items">${itemsSummary}</div>
      </div>
      <div class="table-card-total">${total > 0 ? '₹' + total : (status === 'Occupied' ? 'SEATED' : 'FREE')}</div>
    `;
    grid.appendChild(card);
  }

  orders.forEach(o => todaySales += o.total);

  document.getElementById('countVacant').innerText = vacant;
  document.getElementById('countDining').innerText = preparing + served + occupied;
  document.getElementById('activeTablesBadge').innerText = preparing + served + occupied;
  document.getElementById('floorTodaySales').innerText = '₹' + todaySales;
}

function selectInspectorTable(tableNum) {
  activeSelectedTable = String(tableNum);
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  const tableStateMap = getTableStateMap();
  const customState = tableStateMap[activeSelectedTable] || { status: 'Vacant', guestName: '' };
  const tableOrders = orders.filter(o => o.table == activeSelectedTable && o.status !== 'Paid');

  document.getElementById('inspectorTableTitle').innerText = 'Table ' + activeSelectedTable;

  const stream = document.getElementById('inspectorOrdersStream');
  stream.innerHTML = '';

  let subtotal = 0;
  let guestName = customState.guestName || 'Walk-in Guest';
  let guestPhone = 'Not provided';
  let statusText = customState.status || 'VACANT';

  if (tableOrders.length > 0) {
    const isAllServed = tableOrders.every(o => o.status === 'Served');
    statusText = isAllServed ? 'SERVED' : 'PREPARING';
    guestName = tableOrders[0].customerName || 'Guest';
    guestPhone = tableOrders[0].customerPhone || 'N/A';

    tableOrders.forEach(o => {
      subtotal += o.subtotal;
      const orderBlock = document.createElement('div');
      orderBlock.style.cssText = 'background:#1e293b; padding:10px; border-radius:8px; margin-bottom:8px;';
      orderBlock.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#60a5fa; font-weight:700; margin-bottom:4px;">
          <span>#${o.id} • ${o.timestamp}</span>
          <span style="color:${o.status === 'Served' ? '#4ade80' : '#fbbf24'};">${o.status.toUpperCase()}</span>
        </div>
        ${o.items.map(i => `<div class="stream-item-row"><span>${i.qty}x ${i.name}</span><span>₹${i.price * i.qty}</span></div>`).join('')}
      `;
      stream.appendChild(orderBlock);
    });
  } else if (customState.status === 'Occupied') {
    statusText = 'OCCUPIED';
    stream.innerHTML = '<div style="text-align:center; padding:30px; color:#fbbf24; font-size:0.85rem;">🪑 Table is occupied. Guests are currently browsing menu.</div>';
  } else {
    statusText = 'VACANT';
    stream.innerHTML = `
      <div style="text-align:center; padding:30px; color:#94a3b8; font-size:0.85rem;">
        Table is currently vacant.
        <button class="btn-primary btn-block" style="margin-top:14px;" onclick="seatGuestsOnTable('${activeSelectedTable}')">
          🪑 Seat Guests Here (Mark Occupied)
        </button>
      </div>
    `;
  }

  const pill = document.getElementById('inspectorStatusPill');
  pill.innerText = statusText;
  if (statusText === 'VACANT') {
    pill.style.background = 'rgba(22, 163, 74, 0.2)';
    pill.style.color = '#4ade80';
  } else if (statusText === 'SERVED') {
    pill.style.background = 'rgba(37, 99, 235, 0.25)';
    pill.style.color = '#60a5fa';
  } else if (statusText === 'PREPARING') {
    pill.style.background = 'rgba(217, 119, 6, 0.25)';
    pill.style.color = '#fbbf24';
  } else {
    pill.style.background = 'rgba(239, 68, 68, 0.2)';
    pill.style.color = '#f87171';
  }

  document.getElementById('inspectorGuestName').innerText = guestName;
  document.getElementById('inspectorGuestPhone').innerText = guestPhone;

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  document.getElementById('dockSubtotal').innerText = '₹' + subtotal;
  document.getElementById('dockTax').innerText = '₹' + tax;
  document.getElementById('dockGrandTotal').innerText = '₹' + total;
}

function seatGuestsOnTable(tableNum) {
  const name = prompt('Enter Guest Name for Table ' + tableNum + ':', 'Dining Guests');
  if (name) {
    setTableState(tableNum, { status: 'Occupied', guestName: name, seatedAt: Date.now() });
    renderFloorPlan();
    selectInspectorTable(tableNum);
    showToast('Table ' + tableNum + ' is now OCCUPIED by ' + name);
  }
}

function settleAndClearCurrentTable() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  const tableOrders = orders.filter(o => o.table == activeSelectedTable);
  tableOrders.forEach(o => o.status = 'Paid');
  localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(orders));

  // Reset Table State to Vacant
  setTableState(activeSelectedTable, { status: 'Vacant', guestName: '' });

  // Broadcast
  try {
    fetch('https://ntfy.sh/' + SYNC_TOPIC, {
      method: 'POST',
      body: JSON.stringify({ type: 'UPDATE_STATUS', table: activeSelectedTable, status: 'Paid' })
    }).catch(() => {});
  } catch(e) {}

  renderFloorPlan();
  selectInspectorTable(activeSelectedTable);
  showToast('Table ' + activeSelectedTable + ' marked as Paid & Released (VACANT)!');
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
      <div class="menu-item-meta">
        <h4>${item.name}</h4>
        <span>₹<input type="number" value="${item.price}" style="background:#111827; border:1px solid #374151; color:#fff; width:70px; border-radius:4px; padding:3px 6px; font-weight:700;" onchange="updateItemPrice('${item.id}', this.value)"></span>
      </div>
      <button class="stock-toggle ${item.inStock ? 'in-stock' : ''}" onclick="toggleItemStock('${item.id}')">
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
    showToast('Updated ' + item.name + ' to ₹' + newPrice);
  }
}

function toggleItemStock(id) {
  const item = currentMenu.find(i => i.id === id);
  if (item) {
    item.inStock = !item.inStock;
    saveMenuData();
    showToast(item.name + (item.inStock ? ' is now IN STOCK' : ' marked as SOLD OUT'));
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
  const img = document.getElementById('addDishImg').value.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

  if (!name || !price) {
    showToast('Please enter dish name and price');
    return;
  }

  const newDish = {
    id: 'dish_' + Date.now(),
    name,
    category,
    price,
    isVeg,
    inStock: true,
    img
  };

  currentMenu.push(newDish);
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
    specialNotes: 'Punched by Cashier/Waiter',
    subtotal,
    tax,
    total,
    status: 'Preparing',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: Date.now()
  };

  const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  existing.push(newOrder);
  localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(existing));

  try {
    fetch('https://ntfy.sh/' + SYNC_TOPIC, {
      method: 'POST',
      body: JSON.stringify({ type: 'NEW_ORDER', order: newOrder })
    }).catch(() => {});
  } catch(e) {}

  closeModal('modalPunchOrder');
  renderFloorPlan();
  selectInspectorTable(table);
  showToast('Order #' + kotId + ' dispatched for Table ' + table);
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function renderCRM() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  const crmMap = new Map();

  orders.forEach(o => {
    const phone = o.customerPhone || 'N/A';
    const name = o.customerName || 'Guest';
    if (phone !== 'N/A' && phone.length > 5) {
      if (!crmMap.has(phone)) {
        crmMap.set(phone, { name, phone, visits: 1, spend: o.total, lastTable: o.table });
      } else {
        const record = crmMap.get(phone);
        record.visits++;
        record.spend += o.total;
        record.lastTable = o.table;
      }
    }
  });

  const tbody = document.getElementById('crmTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (crmMap.size === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:#94a3b8;">No customer CRM records captured yet. Place orders to populate.</td></tr>';
    return;
  }

  crmMap.forEach(guest => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${guest.name}</strong></td>
      <td><span style="font-family:monospace; color:#60a5fa;">${guest.phone}</span></td>
      <td>${guest.visits} visit(s)</td>
      <td><strong>₹${guest.spend}</strong></td>
      <td>Table ${guest.lastTable}</td>
      <td><a href="https://wa.me/${guest.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(guest.name)},%20thank%20you%20for%20dining%20at%20The%20Grand%20Estate!%20Enjoy%2015%25%20off%20on%20your%20next%20visit." target="_blank" class="btn-primary" style="font-size:0.75rem; padding:4px 8px; text-decoration:none; display:inline-flex;">💬 WhatsApp</a></td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById('crmLeadsBadge').innerText = crmMap.size;
}

function exportCrmCsv() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  let csvContent = 'data:text/csv;charset=utf-8,Guest Name,Mobile Number,Total Orders,Total Spent\n';

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
    csvContent += `"${g.name}","${g.phone}",${g.count},${g.total}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'restaurant_crm_customers.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('CRM data exported to CSV!');
}

function renderAnalytics() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  let totalSales = 0;
  orders.forEach(o => totalSales += o.total);

  const aov = orders.length > 0 ? Math.round(totalSales / orders.length) : 0;
  const gst = Math.round(totalSales * 0.05);

  document.getElementById('analyticRevenue').innerText = '₹' + totalSales;
  document.getElementById('analyticTablesCount').innerText = orders.length;
  document.getElementById('analyticAov').innerText = '₹' + aov;
  document.getElementById('analyticGst').innerText = '₹' + gst;

  const upiTotal = Math.round(totalSales * 0.75);
  const cashTotal = totalSales - upiTotal;

  document.getElementById('tenderUpiAmount').innerText = '₹' + upiTotal;
  document.getElementById('tenderCashAmount').innerText = '₹' + cashTotal;
}

function printDailyZReport() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  let totalSales = 0;
  orders.forEach(o => totalSales += o.total);
  const gst = Math.round(totalSales * 0.05);

  const win = window.open('', '', 'width=380,height=550');
  win.document.write(`
    <html>
    <head>
      <title>Daily Z-Report</title>
      <style>body { font-family: monospace; padding: 20px; font-size: 14px; } .center { text-align: center; } .line { border-top: 1px dashed #000; margin: 8px 0; } .row { display: flex; justify-content: space-between; margin: 4px 0; }</style>
    </head>
    <body>
      <div class="center">
        <h2>THE GRAND ESTATE BISTRO</h2>
        <h3>DAILY CLOSING Z-REPORT</h3>
        <div>Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</div>
      </div>
      <div class="line"></div>
      <div class="row"><span>Total Orders:</span><span>${orders.length}</span></div>
      <div class="row"><span>Gross Sales:</span><span>₹${totalSales}</span></div>
      <div class="row"><span>GST Collected (5%):</span><span>₹${gst}</span></div>
      <div class="line"></div>
      <div class="row"><span>UPI / Digital:</span><span>₹${Math.round(totalSales * 0.75)}</span></div>
      <div class="row"><span>Cash in Drawer:</span><span>₹${totalSales - Math.round(totalSales * 0.75)}</span></div>
      <div class="line"></div>
      <div class="center"><strong>*** REGISTER BALANCED & CLOSED ***</strong></div>
    </body>
    </html>
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
    const TOKENS = {"1":"T1_9e8a7b4f","2":"T2_4c5d6e1a","3":"T3_7f8a9b2c","4":"T4_1a2b3c9d","5":"T5_8d9e0f5e","6":"T6_3c4d5e8a","7":"T7_6f7a8b1c","8":"T8_2a3b4c7d"};
      const targetUrl = `${baseUrl}/?t=${TOKENS[i]}`;
    const encoded = encodeURIComponent(targetUrl);
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encoded}&margin=4`;

    const card = document.createElement('div');
    card.className = 'admin-standee-card';
    card.innerHTML = `
      <div style="font-weight:800; font-size:1.1rem; text-transform:uppercase;">THE GRAND ESTATE</div>
      <div style="font-size:0.75rem; color:#64748b; margin-bottom:12px;">Digital Dining Table QR</div>
      <img src="${qrApiUrl}" style="width:160px; height:160px; margin-bottom:12px;">
      <div style="background:#0f172a; color:#fff; font-weight:800; padding:6px 14px; border-radius:6px; font-size:1.1rem;">TABLE ${i}</div>
    `;
    container.appendChild(card);
  }
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
    <head>
      <title>GST Invoice — Table ${activeSelectedTable}</title>
      <style>body { font-family: monospace; padding: 20px; font-size: 13px; } .center { text-align: center; } .line { border-top: 1px dashed #000; margin: 8px 0; } .row { display: flex; justify-content: space-between; margin: 4px 0; }</style>
    </head>
    <body>
      <div class="center">
        <h2>THE GRAND ESTATE BISTRO</h2>
        <div>GSTIN: 27AABCT3518Q1Z4</div>
        <h3>TAX INVOICE — TABLE ${activeSelectedTable}</h3>
        <div>Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</div>
      </div>
      <div class="line"></div>
      ${tableOrders.map(o => o.items.map(i => `<div class="row"><span>${i.qty}x ${i.name}</span><span>₹${i.price * i.qty}</span></div>`).join('')).join('')}
      <div class="line"></div>
      <div class="row"><span>Subtotal:</span><span>₹${subtotal}</span></div>
      <div class="row"><span>CGST (2.5%):</span><span>₹${tax / 2}</span></div>
      <div class="row"><span>SGST (2.5%):</span><span>₹${tax / 2}</span></div>
      <div class="line"></div>
      <div class="row" style="font-size:16px;"><strong>TOTAL:</strong><strong>₹${total}</strong></div>
      <div class="line"></div>
      <div class="center"><div>Thank you for dining with us!</div></div>
    </body>
    </html>
  `);
  win.document.close();
  win.print();
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

  // Pull cloud stream history
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
      selectInspectorTable(activeSelectedTable);
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
          selectInspectorTable(activeSelectedTable);
        }
      } catch(err) {}
    };
  } catch(e) {}
}

function showToast(msg) {
  const toast = document.getElementById('adminToast');
  if (!toast) return;
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

window.onload = init;

function printStandeesClean() {
  switchTab('qr');
  setTimeout(() => {
    window.print();
  }, 100);
}
