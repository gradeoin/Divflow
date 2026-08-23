
const SYNC_TOPIC = 'divflow_restaurant_kot_live_stream_9921';
const LOCAL_STORAGE_ORDERS = 'divflow_realtime_orders_v2';
const LOCAL_STORAGE_MENU = 'divflow_custom_menu_v1';
const LOCAL_STORAGE_TABLE_STATES = 'divflow_table_states_v1';

let activeSelectedTable = '1';
let currentMenu = [];
let activeFloorFilter = 'all';

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
 inspectTableOnRightSidebar(activeSelectedTable);
 setInterval(loadOrdersInitial, 2500);
}

function switchView(viewId, btnElement) {
 document.querySelectorAll('.header-tab-btn').forEach(el => el.classList.remove('active'));
 document.querySelectorAll('.pos-content-view').forEach(el => el.classList.remove('active'));

 if (btnElement) btnElement.classList.add('active');
 const target = document.getElementById('view' + viewId.charAt(0).toUpperCase() + viewId.slice(1));
 if (target) target.classList.add('active');
}

function filterFloorTables(filterState, btnElement) {
 activeFloorFilter = filterState;
 document.querySelectorAll('.solid-chip').forEach(el => el.classList.remove('active'));
 if (btnElement) btnElement.classList.add('active');
 renderFloorPlan();
}

function getTableStateMap() {
 return JSON.parse(localStorage.getItem(LOCAL_STORAGE_TABLE_STATES) || '{}');
}

function setTableState(tableNum, stateObj) {
 const map = getTableStateMap();
 map[tableNum] = stateObj;
 localStorage.setItem(LOCAL_STORAGE_TABLE_STATES, JSON.stringify(map));

 try {
 fetch('https://ntfy.sh/' + SYNC_TOPIC, {
 method: 'POST',
 body: JSON.stringify({ type: 'TABLE_STATE_CHANGE', table: tableNum, state: stateObj })
 }).catch(() => {});
 } catch(e) {}
}

function loadMenuData() {
 const saved = localStorage.getItem(LOCAL_STORAGE_MENU);
 if (saved) currentMenu = JSON.parse(saved);
 else currentMenu = [...INITIAL_MENU];
 renderMenuEditor();
}

function saveMenuData() {
 localStorage.setItem(LOCAL_STORAGE_MENU, JSON.stringify(currentMenu));
 renderMenuEditor();
}

function renderFloorPlan() {
 const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
 const tableStateMap = getTableStateMap();
 const grid = document.getElementById('floorTablesGrid');
 if (!grid) return;
 grid.innerHTML = '';

 let vacant = 0, occupied = 0, cooking = 0, served = 0, todaySales = 0;

 for (let i = 1; i <= 12; i++) {
 const tableOrders = orders.filter(o => o.table == i && o.status !== 'Paid');
 const customState = tableStateMap[i] || { status: 'Vacant', guestName: '' };

 let state = customState.status || 'Vacant';
 let guestName = customState.guestName || 'Available Table';
 let info = 'Ready for seating';
 let total = 0;

 if (tableOrders.length > 0) {
 const hasCooking = tableOrders.some(o => o.status === 'Preparing');
 const allServed = tableOrders.every(o => o.status === 'Served');

 if (hasCooking) {
 state = 'Cooking';
 cooking++;
 info = ' In Kitchen';
 } else if (allServed) {
 state = 'Served';
 served++;
 info = ' Food on Table';
 }

 guestName = tableOrders[0].customerName || 'Guest';
 let count = 0;
 tableOrders.forEach(o => {
 total += o.total;
 count += o.items ? o.items.length : 0;
 });
 info += ' (' + count + ' items)';
 } else if (state === 'Occupied') {
 occupied++;
 info = ' Seated (Browsing Menu)';
 } else {
 state = 'Vacant';
 vacant++;
 }

 if (activeFloorFilter === 'vacant' && state !== 'Vacant') continue;
 if (activeFloorFilter === 'occupied' && state !== 'Occupied') continue;
 if (activeFloorFilter === 'cooking' && state !== 'Cooking') continue;
 if (activeFloorFilter === 'served' && state !== 'Served') continue;

 const isSelected = String(i) === activeSelectedTable;
 const card = document.createElement('div');
 card.className = `floor-pos-card state-${state} ${isSelected ? 'selected-active-table' : ''}`;
 card.onclick = () => inspectTableOnRightSidebar(i);
 card.innerHTML = `
 <div class="card-top-row">
 <span class="table-card-num">TABLE ${i < 10 ? '0' + i : i}</span>
 <span class="status-pill-solid badge-${state.toLowerCase()}">${state.toUpperCase()}</span>
 </div>
 <div class="card-mid-row">
 <div class="guest-name-txt">${guestName}</div>
 <div class="order-summary-txt">${info}</div>
 </div>
 <div class="card-bot-row">
 <span class="running-total-txt">${total > 0 ? '₹' + total : (state === 'Occupied' ? 'SEATED' : 'FREE')}</span>
 <span class="settle-cue-txt">View Bill ></span>
 </div>
 `;
 grid.appendChild(card);
 }

 orders.forEach(o => todaySales += o.total);

 if (document.getElementById('countVacant')) document.getElementById('countVacant').innerText = vacant;
 if (document.getElementById('countOccupied')) document.getElementById('countOccupied').innerText = occupied;
 if (document.getElementById('countCooking')) document.getElementById('countCooking').innerText = cooking;
 if (document.getElementById('countServed')) document.getElementById('countServed').innerText = served;
 if (document.getElementById('activeTablesCountBadge')) document.getElementById('activeTablesCountBadge').innerText = cooking + served + occupied;
 if (document.getElementById('floorTodaySales')) if (document.getElementById('floorTodaySales')) document.getElementById('floorTodaySales').innerText = '₹' + todaySales;
}

function inspectTableOnRightSidebar(tableNum) {
 activeSelectedTable = String(tableNum);
 renderFloorPlan();

 const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
 const tableStateMap = getTableStateMap();
 const customState = tableStateMap[activeSelectedTable] || { status: 'Vacant', guestName: '' };
 const tableOrders = orders.filter(o => o.table == activeSelectedTable && o.status !== 'Paid');

 document.getElementById('sheetTableTitle').innerText = 'TABLE ' + (Number(activeSelectedTable) < 10 ? '0' + activeSelectedTable : activeSelectedTable);

 let guestName = customState.guestName || 'Walk-in Guest';
 let guestPhone = 'Not provided';
 let subtotal = 0;
 let statusText = customState.status || 'VACANT';

 const list = document.getElementById('sheetItemsList');
 list.innerHTML = '';

 if (tableOrders.length > 0) {
 const isAllServed = tableOrders.every(o => o.status === 'Served');
 statusText = isAllServed ? 'FOOD SERVED' : 'IN KITCHEN';
 guestName = tableOrders[0].customerName || 'Guest';
 guestPhone = tableOrders[0].customerPhone || 'N/A';

 tableOrders.forEach(o => {
 subtotal += o.subtotal;
 const orderBox = document.createElement('div');
 orderBox.className = 'stream-order-box';
 orderBox.innerHTML = `
 <div class="stream-order-head">
 <span>#${o.id} | ${o.timestamp}</span>
 <span style="color:${o.status === 'Served' ? '#4ade80' : '#fbbf24'};">${o.status.toUpperCase()}</span>
 </div>
 ${o.items.map(i => `
 <div class="stream-dish-row">
 <span>${i.qty}x ${i.name}</span>
 <strong>₹${i.price * i.qty}</strong>
 </div>
 `).join('')}
 `;
 list.appendChild(orderBox);
 });
 } else if (customState.status === 'Occupied') {
 statusText = 'OCCUPIED';
 list.innerHTML = '<div style="text-align:center; padding:40px 14px; color:#f87171; font-size:0.9rem; font-weight:700;"> Table is occupied. Guests are seated.</div>';
 } else {
 statusText = 'VACANT';
 list.innerHTML = `
 <div style="text-align:center; padding:30px 14px; color:#94a3b8; font-size:0.85rem;">
 Table is currently vacant.
 <button class="btn-solid-blue" style="margin-top:14px; width:100%;" onclick="seatGuestsOnTable('${activeSelectedTable}')">
 Seat Guests Here
 </button>
 </div>
 `;
 }

 const statusTag = document.getElementById('sheetStatusTag');
 statusTag.innerText = statusText;
 statusTag.className = 'solid-state-badge';
 if (statusText === 'VACANT') statusTag.classList.add('badge-vacant');
 else if (statusText === 'OCCUPIED') statusTag.classList.add('badge-occupied');
 else if (statusText === 'FOOD SERVED') statusTag.classList.add('badge-served');
 else statusTag.classList.add('badge-cooking');

 document.getElementById('sheetGuestName').innerText = guestName;
 document.getElementById('sheetGuestPhone').innerText = guestPhone;

 const tax = Math.round(subtotal * 0.05);
 const total = subtotal + tax;

 document.getElementById('sheetSubtotal').innerText = '₹' + subtotal;
 document.getElementById('sheetCgst').innerText = '₹' + (tax / 2);
 document.getElementById('sheetSgst').innerText = '₹' + (tax / 2);
 document.getElementById('sheetTotal').innerText = '₹' + total;
}

function seatGuestsOnTable(tableNum) {
 const name = prompt('Enter Guest Name for Table ' + tableNum + ':', 'Dining Guests');
 if (name) {
 setTableState(tableNum, { status: 'Occupied', guestName: name, seatedAt: Date.now() });
 renderFloorPlan();
 inspectTableOnRightSidebar(tableNum);
 showToast('Table ' + tableNum + ' marked OCCUPIED by ' + name);
 }
}

function settleAndClearCurrentTable() {
 const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
 const tableOrders = orders.filter(o => o.table == activeSelectedTable);
 tableOrders.forEach(o => o.status = 'Paid');
 localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(orders));

 // Reset Table State to Vacant
 setTableState(activeSelectedTable, { status: 'Vacant', guestName: '' });

 // Broadcast CLEAR_TABLE event
 try {
 fetch('https://ntfy.sh/' + SYNC_TOPIC, {
 method: 'POST',
 body: JSON.stringify({ type: 'CLEAR_TABLE', table: activeSelectedTable, status: 'Paid' })
 }).catch(() => {});
 } catch(e) {}

 renderFloorPlan();
 renderCRM();
 renderAnalytics();
 inspectTableOnRightSidebar(activeSelectedTable);
 showToast('Table ' + activeSelectedTable + ' marked Paid & Cleared (VACANT)!');
}

function renderMenuEditor() {
 const grid = document.getElementById('menuEditorGrid');
 if (!grid) return;
 grid.innerHTML = '';

 currentMenu.forEach(item => {
 const card = document.createElement('div');
 card.className = 'menu-catalog-card';
 card.innerHTML = `
 <img src="${item.img}" class="menu-card-thumb" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'">
 <div style="flex:1;">
 <div style="font-weight:700; font-size:0.9rem; margin-bottom:2px;">${item.name}</div>
 <span>₹ <input type="number" value="${item.price}" class="menu-price-field" onchange="updateItemPrice('${item.id}', this.value)"></span>
 </div>
 <button class="btn-stock-toggle-bold" style="${item.inStock ? 'color:#4ade80;' : 'color:#f87171;'}" onclick="toggleItemStock('${item.id}')">
 ${item.inStock ? ' In Stock' : ' Sold Out'}
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
 showToast('Please enter dish name and price');
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
 showToast(name + ' added to catalog!');
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
 tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:#94a3b8;">No customer records yet.</td></tr>';
 return;
 }

 map.forEach(g => {
 const row = document.createElement('tr');
 row.innerHTML = `
 <td><strong>${g.name}</strong></td>
 <td><span style="font-family:monospace; color:#60a5fa;">${g.phone}</span></td>
 <td>${g.count} visit(s)</td>
 <td><strong>₹${g.spend}</strong></td>
 <td>Table ${g.lastTable}</td>
 <td><a href="https://wa.me/${g.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(g.name)},%20thank%20you%20for%20dining%20at%20The%20Grand%20Estate!" target="_blank" class="btn-solid-blue" style="font-size:0.75rem; padding:4px 8px; text-decoration:none; display:inline-flex;"> WhatsApp</a></td>
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
 <div class="row"><span>CGST (2.5%):</span><span>₹${tax / 2}</span></div>
 <div class="row"><span>SGST (2.5%):</span><span>₹${tax / 2}</span></div>
 <div class="line"></div>
 <div class="row" style="font-size:16px;"><strong>TOTAL:</strong><strong>₹${total}</strong></div>
 <div class="line"></div>
 <div class="center"><div>Thank you for dining with us!</div></div>
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
 card.className = 'standee-card-box';
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
 switchView('qr');
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
 } else if (payload.type === 'TABLE_STATE_CHANGE' && payload.table) {
 const map = getTableStateMap();
 map[payload.table] = payload.state;
 localStorage.setItem(LOCAL_STORAGE_TABLE_STATES, JSON.stringify(map));
 }
 }
 } catch(e) {}
 });
 renderFloorPlan();
 renderCRM();
 renderAnalytics();
 inspectTableOnRightSidebar(activeSelectedTable);
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
 } else if (payload.type === 'TABLE_STATE_CHANGE' && payload.table) {
 const map = getTableStateMap();
 map[payload.table] = payload.state;
 localStorage.setItem(LOCAL_STORAGE_TABLE_STATES, JSON.stringify(map));
 }
 renderFloorPlan();
 renderCRM();
 renderAnalytics();
 inspectTableOnRightSidebar(activeSelectedTable);
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
