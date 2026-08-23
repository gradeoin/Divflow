
const SYNC_KEY = 'divflow_m3_restaurant_orders_sync';
let audioEnabled = true;
let knownOrderIds = new Set();

function init() {
  loadOrders();
  setInterval(loadOrders, 2000);

  // Instant multi-tab BroadcastChannel sync
  try {
    const channel = new BroadcastChannel('divflow_restaurant_sync');
    channel.onmessage = (e) => {
      if (e.data?.type === 'NEW_ORDER') {
        playDingSound();
        loadOrders();
      }
    };
  } catch(e) {}
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
  document.getElementById('audioToggleBtn').innerText = audioEnabled ? '🔔 Sound: ON' : '🔕 Sound: OFF';
}

function loadOrders() {
  const orders = JSON.parse(localStorage.getItem(SYNC_KEY) || '[]');
  
  let hasNew = false;
  orders.forEach(o => {
    if (!knownOrderIds.has(o.id)) {
      knownOrderIds.add(o.id);
      hasNew = true;
    }
  });

  if (hasNew && knownOrderIds.size > 0) {
    playDingSound();
  }

  const activeOrders = orders.filter(o => o.status !== 'Paid');
  const prepCount = activeOrders.filter(o => o.status === 'Preparing').length;
  let totalSales = 0;
  orders.forEach(o => totalSales += o.total);

  document.getElementById('activeOrdersCount').innerText = activeOrders.length;
  document.getElementById('totalPreparingCount').innerText = prepCount;
  document.getElementById('totalTodaySales').innerText = '₹' + totalSales;

  const grid = document.getElementById('kdsGrid');
  grid.innerHTML = '';

  if (activeOrders.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:60px; color:#64748b; font-size:1.2rem;">🍳 Kitchen is all clear! Waiting for incoming table orders...</div>';
    return;
  }

  [...activeOrders].reverse().forEach(order => {
    const card = document.createElement('div');
    card.className = `m3-kot-card status-${order.status}`;
    card.innerHTML = `
      <div class="m3-kot-head">
        <span class="m3-kot-title">TABLE ${order.table}</span>
        <span class="m3-kot-meta">#${order.id} • ${order.timestamp}</span>
      </div>
      <div class="m3-kot-items">
        ${order.items.map(i => `
          <div class="m3-kot-item-row">
            <span><span class="m3-kot-qty">${i.qty}x</span> <strong>${i.name}</strong></span>
            <span>₹${i.price * i.qty}</span>
          </div>
        `).join('')}
        ${order.specialNotes !== 'None' ? `
          <div class="m3-kot-notes">
            <strong>⚠️ Chef Instructions:</strong> ${order.specialNotes}
          </div>
        ` : ''}
      </div>
      <div class="m3-kot-foot">
        ${order.status === 'Preparing' ? `
          <button class="m3-action-btn btn-serve" onclick="updateOrderStatus('${order.id}', 'Served')">
            ✅ Mark as Served
          </button>
        ` : `
          <button class="m3-action-btn btn-paid" onclick="updateOrderStatus('${order.id}', 'Paid')">
            💰 Mark as Paid
          </button>
        `}
        <button class="m3-action-btn btn-print" onclick="printKOT('${order.id}')" title="Print KOT Slip">
          🖨️
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function updateOrderStatus(id, newStatus) {
  const orders = JSON.parse(localStorage.getItem(SYNC_KEY) || '[]');
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = newStatus;
    localStorage.setItem(SYNC_KEY, JSON.stringify(orders));
    loadOrders();
  }
}

function printKOT(id) {
  const orders = JSON.parse(localStorage.getItem(SYNC_KEY) || '[]');
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
        .item { display: flex; justify-content: space-between; margin: 4px 0; }
      </style>
    </head>
    <body>
      <div class="center">
        <h2>SPICE & SLICE BISTRO</h2>
        <h3>KITCHEN ORDER TICKET (KOT)</h3>
        <h1>TABLE ${order.table}</h1>
        <div>#${order.id} | ${order.timestamp}</div>
      </div>
      <div class="line"></div>
      ${order.items.map(i => `<div class="item"><span>${i.qty}x ${i.name}</span><span>₹${i.price * i.qty}</span></div>`).join('')}
      <div class="line"></div>
      <div><strong>Notes:</strong> ${order.specialNotes}</div>
      <div class="line"></div>
      <div class="item"><strong>TOTAL:</strong><strong>₹${order.total}</strong></div>
    </body>
    </html>
  `);
  printWin.document.close();
  printWin.print();
}

function clearAllOrders() {
  if (confirm('Clear all active orders?')) {
    localStorage.removeItem(SYNC_KEY);
    knownOrderIds.clear();
    loadOrders();
  }
}

window.onload = init;
