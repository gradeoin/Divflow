
const SYNC_TOPIC = 'divflow_restaurant_kot_live_stream_9921';
const LOCAL_STORAGE_ORDERS = 'divflow_realtime_orders_v2';
let audioEnabled = true;
let knownOrderIds = new Set();

function init() {
  loadOrdersInitial();
  setupRealtimeSSE();
  setInterval(loadOrdersFromStorage, 2000);
}

function playDingSound() {
  if (!audioEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch(e) {}
}

function toggleAudio() {
  audioEnabled = !audioEnabled;
  document.getElementById('audioToggleBtn').innerText = audioEnabled ? 'AUDIO ALERT: ON' : 'AUDIO ALERT: OFF';
}

function loadOrdersInitial() {
  loadOrdersFromStorage();

  // Pull cloud history
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
      loadOrdersFromStorage();
    })
    .catch(() => {});
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
            playDingSound();
            loadOrdersFromStorage();
          } else if (payload.type === 'UPDATE_STATUS' && payload.orderId) {
            updateOrderStatusLocal(payload.orderId, payload.status);
            loadOrdersFromStorage();
          }
        }
      } catch(e) {}
    };
  } catch(e) {}
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

function loadOrdersFromStorage() {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  
  // Track new orders
  orders.forEach(o => {
    if (!knownOrderIds.has(o.id)) {
      knownOrderIds.add(o.id);
    }
  });

  const activeOrders = orders.filter(o => o.status !== 'Paid');
  const prepCount = activeOrders.filter(o => o.status === 'Preparing').length;
  let totalSales = 0;
  orders.forEach(o => totalSales += o.total);

  if (document.getElementById('activeOrdersCount')) document.getElementById('activeOrdersCount').innerText = activeOrders.length;
  if (document.getElementById('totalPreparingCount')) document.getElementById('totalPreparingCount').innerText = prepCount;

  const grid = document.getElementById('kdsGrid');
  grid.innerHTML = '';

  if (activeOrders.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:60px; color:#64748b; font-size:1.1rem; font-weight:700; letter-spacing:0.04em;">KITCHEN CLEAR — AWAITING INCOMING GUEST DISPATCHES</div>';
    return;
  }

  
  
  [...activeOrders].reverse().forEach(order => {
    const isServed = order.status === 'Served';
    const card = document.createElement('div');
    card.className = `ticket-card status-${order.status}`;
    card.innerHTML = `
      <div class="ticket-head">
        <span class="ticket-table">TABLE ${order.table} • <span style="font-size:0.9rem; font-weight:600; color:#93c5fd;">${order.customerName || "Guest"}</span></span>
        <span class="ticket-id-badge">#${order.id} • ${order.timestamp}</span>
      </div>
      <div class="ticket-body">
        ${order.items.map(i => `
          <div class="ticket-item">
            <span><span class="ticket-qty">${i.qty}x</span> <strong style="font-size:1.05rem;">${i.name}</strong></span>
          </div>
        `).join('')}
        ${order.specialNotes && order.specialNotes !== 'None' ? `
          <div class="ticket-notes">
            <strong>⚠️ CHEF INSTRUCTIONS:</strong> ${order.specialNotes}
          </div>
        ` : ''}
      </div>
      <div class="ticket-foot">
        ${!isServed ? `
          <button class="ticket-action-btn btn-serve" onclick="broadcastStatusUpdate('${order.id}', 'Served')">
            ✅ MARK AS SERVED
          </button>
        ` : `
          <div style="flex:1; text-align:center; padding:10px; font-weight:800; font-size:0.8rem; color:#4ade80; background:rgba(22,163,74,0.2); border-radius:6px;">
            ✓ SERVED TO TABLE
          </div>
        `}
        <button class="ticket-action-btn btn-print" onclick="printKOT('${order.id}')" title="Print Kitchen Slip">
          PRINT KOT
        </button>
      </div>
    `;
    grid.appendChild(card);
  });


}

function broadcastStatusUpdate(orderId, newStatus) {
  updateOrderStatusLocal(orderId, newStatus);
  loadOrdersFromStorage();

  // Broadcast to global cloud stream for Admin POS & Guest Phone
  try {
    fetch('https://ntfy.sh/' + SYNC_TOPIC, {
      method: 'POST',
      headers: { 'Title': 'UPDATE_STATUS' },
      body: JSON.stringify({ type: 'UPDATE_STATUS', orderId: orderId, status: newStatus })
    }).catch(e => console.error(e));
  } catch(e) {}
  return;
  updateOrderStatusLocal(orderId, newStatus);
  loadOrdersFromStorage();

  // Broadcast to global cloud stream
  try {
    fetch('https://ntfy.sh/' + SYNC_TOPIC, {
      method: 'POST',
      headers: { 'Title': 'UPDATE_STATUS' },
      body: JSON.stringify({ type: 'UPDATE_STATUS', orderId, status: newStatus })
    }).catch(e => console.error(e));
  } catch(e) {}
}


function printKOT(id) {
  const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS) || '[]');
  const order = orders.find(o => o.id === id);
  if (!order) return;

  const printWin = window.open('', '', 'width=350,height=500');
  printWin.document.write(`
    <html>
    <head>
      <title>KOT #${order.id}</title>
      <style>
        body { font-family: monospace; padding: 20px; font-size: 14px; }
        .center { text-align: center; }
        .line { border-top: 1px dashed #000; margin: 10px 0; }
        .item { font-size: 16px; font-weight: bold; margin: 8px 0; }
      </style>
    </head>
    <body>
      <div class="center">
        <h2>KITCHEN ORDER TICKET (KOT)</h2>
        <h1>TABLE ${order.table}</h1>
        <div>Guest: ${order.customerName || 'Walk-in'}</div>
        <div>#${order.id} | ${order.timestamp}</div>
      </div>
      <div class="line"></div>
      ${order.items.map(i => `<div class="item"><span>${i.qty}x ${i.name}</span></div>`).join('')}
      <div class="line"></div>
      ${order.specialNotes && order.specialNotes !== 'None' ? `<div><strong>Instructions:</strong> ${order.specialNotes}</div><div class="line"></div>` : ''}
      <div class="center"><strong>*** DISPATCH WHEN READY ***</strong></div>
    </body>
    </html>
  `);
  printWin.document.close();
  printWin.print();
}


function clearAllOrders() {
  if (confirm('Clear active kitchen display tickets?')) {
    localStorage.removeItem(LOCAL_STORAGE_ORDERS);
    knownOrderIds.clear();
    loadOrdersFromStorage();
  }
}

window.onload = init;
