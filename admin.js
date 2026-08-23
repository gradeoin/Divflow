
const SYNC_TOPIC = 'divflow_restaurant_kot_live_stream_9921';
const LOCAL_STORAGE_ORDERS = 'divflow_realtime_orders_v2';
const LOCAL_STORAGE_MENU = 'divflow_custom_menu_v1';

let activeSelectedTable = '4';
let currentMenu = [];

// Default Initial Menu
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
  renderFloorPlan();
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

function switchTab(tabId) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.pos-tab-content').forEach(el => el.classList.remove('active'));

  event.currentTarget.classList.add('active');

  const titles = {
    floor: 'Interactive Floor Plan & Tables',
    menu: 'Menu Catalog & Live Price Studio',
    crm: 'Guest CRM & WhatsApp Leads',
    analytics: 'Sales Analytics & Daily Z-Report',
    qr: 'QR Standee Studio'
  };

  document.getElementById('pageHeading').innerText = titles[tabId] || 'Dashboard';
  document.getElementById('tab' + tabId.charAt(0).toUpperCase() + tabId.slice(1)).classList.add('active');
}

function loadMenuData() {
  const saved = localStorage.getItem(LOCAL_STORAGE_MENU);
  if (saved) currentMenu = JSON.parse(saved);
  else currentMenu = [...INITIAL_MENU];
}

function saveMenuData() {
  localStorage.setItem(LOCAL_STORAGE_MENU, JSON.stringify(currentMenu));
  renderMenuEditor();
}

function renderFloorPlan() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  const grid = document.getElementById('floorTablesGrid');
  grid.innerHTML = '';

  let vacant = 0, dining = 0, billing = 0, todaySales = 0;

  for (let i = 1; i <= 12; i++) {
    const tableOrders = orders.filter(o => o.table == i && o.status !== 'Paid');
    let status = 'Vacant';
    let total = 0;
    let guestName = 'Vacant Table';
    let itemsSummary = 'No active orders';

    if (tableOrders.length > 0) {
      status = 'Dining';
      dining++;
      guestName = tableOrders[0].customerName || 'Guest';
      let count = 0;
      tableOrders.forEach(o => {
        total += o.total;
        count += o.items ? o.items.length : 0;
      });
      itemsSummary = count + (count === 1 ? ' item active' : ' items active');
    } else {
      vacant++;
    }

    const card = document.createElement('div');
    card.className = `table-card status-${status}`;
    card.onclick = () => selectInspectorTable(i);
    card.innerHTML = `
      <div class="table-card-top">
        <span class="table-card-num">TABLE ${i}</span>
        <span class="table-card-badge">${status}</span>
      </div>
      <div class="table-card-mid">
        <div class="table-card-guest">${guestName}</div>
        <div class="table-card-items">${itemsSummary}</div>
      </div>
      <div class="table-card-total">₹${total}</div>
    `;
    grid.appendChild(card);
  }

  orders.forEach(o => todaySales += o.total);

  document.getElementById('countVacant').innerText = vacant;
  document.getElementById('countDining').innerText = dining;
  document.getElementById('countBilling').innerText = billing;
  document.getElementById('activeTablesBadge').innerText = dining;
  document.getElementById('floorTodaySales').innerText = '₹' + todaySales;
}

function selectInspectorTable(tableNum) {
  activeSelectedTable = String(tableNum);
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  const tableOrders = orders.filter(o => o.table == activeSelectedTable && o.status !== 'Paid');

  document.getElementById('inspectorTableTitle').innerText = 'Table ' + activeSelectedTable;

  const stream = document.getElementById('inspectorOrdersStream');
  stream.innerHTML = '';

  let subtotal = 0;
  let guestName = 'Walk-in Guest';
  let guestPhone = 'Not provided';

  if (tableOrders.length > 0) {
    document.getElementById('inspectorStatusPill').innerText = 'ACTIVE DINING';
    document.getElementById('inspectorStatusPill').style.background = 'rgba(217, 119, 6, 0.2)';
    document.getElementById('inspectorStatusPill').style.color = '#fbbf24';
    guestName = tableOrders[0].customerName || 'Guest';
    guestPhone = tableOrders[0].customerPhone || 'N/A';

    tableOrders.forEach(o => {
      subtotal += o.subtotal;
      const orderBlock = document.createElement('div');
      orderBlock.style.cssText = 'background:#1e293b; padding:10px; border-radius:8px; margin-bottom:8px;';
      orderBlock.innerHTML = `
        <div style="font-size:0.75rem; color:#60a5fa; font-weight:700; margin-bottom:4px;">#${o.id} • ${o.timestamp}</div>
        ${o.items.map(i => `<div class="stream-item-row"><span>${i.qty}x ${i.name}</span><span>₹${i.price * i.qty}</span></div>`).join('')}
      `;
      stream.appendChild(orderBlock);
    });
  } else {
    document.getElementById('inspectorStatusPill').innerText = 'VACANT';
    document.getElementById('inspectorStatusPill').style.background = 'rgba(22, 163, 74, 0.2)';
    document.getElementById('inspectorStatusPill').style.color = '#4ade80';
    stream.innerHTML = '<div style="text-align:center; padding:30px; color:#94a3b8; font-size:0.85rem;">Table is currently vacant.</div>';
  }

  document.getElementById('inspectorGuestName').innerText = guestName;
  document.getElementById('inspectorGuestPhone').innerText = guestPhone;

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  document.getElementById('dockSubtotal').innerText = '₹' + subtotal;
  document.getElementById('dockTax').innerText = '₹' + tax;
  document.getElementById('dockGrandTotal').innerText = '₹' + total;
}

function settleTable(tenderMode) {
  showToast('Payment marked via ' + tenderMode + ' for Table ' + activeSelectedTable);
}

function settleAndClearCurrentTable() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  const tableOrders = orders.filter(o => o.table == activeSelectedTable);
  tableOrders.forEach(o => o.status = 'Paid');
  localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(orders));

  // Broadcast
  try {
    fetch('https://ntfy.sh/' + SYNC_TOPIC, {
      method: 'POST',
      body: JSON.stringify({ type: 'UPDATE_STATUS', table: activeSelectedTable, status: 'Paid' })
    }).catch(() => {});
  } catch(e) {}

  renderFloorPlan();
  selectInspectorTable(activeSelectedTable);
  showToast('Table ' + activeSelectedTable + ' settled & cleared!');
}

function renderMenuEditor() {
  const grid = document.getElementById('menuEditorGrid');
  grid.innerHTML = '';

  currentMenu.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-item-row';
    card.innerHTML = `
      <img src="${item.img}" class="menu-item-thumb" alt="${item.name}">
      <div class="menu-item-meta">
        <h4>${item.name}</h4>
        <span>₹<input type="number" value="${item.price}" style="background:#111827; border:1px solid #374151; color:#fff; width:65px; border-radius:4px; padding:2px 4px;" onchange="updateItemPrice('${item.id}', this.value)"></span>
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
    showToast('Updated ' + item.name + ' price to ₹' + newPrice);
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
  tbody.innerHTML = '';

  crmMap.forEach(guest => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${guest.name}</strong></td>
      <td><span style="font-family:monospace; color:#60a5fa;">${guest.phone}</span></td>
      <td>${guest.visits} visit(s)</td>
      <td><strong>₹${guest.spend}</strong></td>
      <td>Table ${guest.lastTable}</td>
      <td><a href="https://wa.me/${guest.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(guest.name)},%20thank%20you%20for%20dining%20at%20The%20Grand%20Estate!%20Enjoy%2015%25%20off%20on%20your%20next%20visit." target="_blank" class="btn-primary" style="font-size:0.75rem; padding:4px 8px; text-decoration:none; display:inline-flex;">💬 WhatsApp Offer</a></td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById('crmLeadsBadge').innerText = crmMap.size;
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

function renderAdminStandees() {
  const container = document.getElementById('adminStandeesGrid');
  container.innerHTML = '';
  const baseUrl = 'https://divflow.pages.dev';

  for (let i = 1; i <= 8; i++) {
    const targetUrl = `${baseUrl}/?table=${i}`;
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
  if (tableOrders.length === 0) return;

  let subtotal = 0;
  tableOrders.forEach(o => subtotal += o.subtotal);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const win = window.open('', '', 'width=380,height=550');
  win.document.write(`
    <html>
    <head>
      <title>GST Invoice — Table ${activeSelectedTable}</title>
      <style>
        body { font-family: monospace; padding: 20px; font-size: 13px; }
        .center { text-align: center; }
        .line { border-top: 1px dashed #000; margin: 8px 0; }
        .row { display: flex; justify-content: space-between; margin: 4px 0; }
      </style>
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
      <div class="center">
        <div>Thank you for dining with us!</div>
      </div>
    </body>
    </html>
  `);
  win.document.close();
  win.print();
}

function setupRealtimeSSE() {
  try {
    const es = new EventSource('https://ntfy.sh/' + SYNC_TOPIC + '/sse');
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.message) {
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
  alert(msg);
}

window.onload = init;
