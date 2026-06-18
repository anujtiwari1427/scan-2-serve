// ============================================================
//  VELVET TABLE — Admin Dashboard Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  Orders.load();
  seedDemoOrders();
  initAdminNav();
  showPage('dashboard');
  startLiveRefresh();
});

// ── Auth ──
async function hashText(text) {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function checkAuth() {
  if (sessionStorage.getItem('scan2serve_admin_auth') === 'true') {
    document.getElementById('admin-login-screen').style.display = 'none';
    document.getElementById('admin-layout').style.display = 'grid';
  }
}

async function handleLogin() {
  const id = document.getElementById('login-id').value.trim();
  const pass = document.getElementById('login-pass').value.trim();
  
  // SHA-256 hashes for ID "admin" and Password "admin123"
  const validIdHash = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
  const validPassHash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

  const idHash = await hashText(id);
  const passHash = await hashText(pass);

  if (idHash === validIdHash && passHash === validPassHash) {
    sessionStorage.setItem('scan2serve_admin_auth', 'true');
    document.getElementById('admin-login-screen').style.display = 'none';
    document.getElementById('admin-layout').style.display = 'grid';
    document.getElementById('login-error').style.display = 'none';
    showToast('Login successful!', 'success');
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
}

// ── Navigation ──
function initAdminNav() {
  document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = link.dataset.page;
      showPage(page);
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

function showPage(page) {
  document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (!el) return;
  el.classList.add('active');
  const titles = {
    dashboard: { title: 'Dashboard', sub: 'Overview of today\'s operations' },
    orders: { title: 'Live Orders', sub: 'Real-time order queue' },
    qr: { title: 'QR Codes', sub: 'Generate & download table QR codes' },
    menu: { title: 'Menu Manager', sub: 'Add, edit, or remove menu items' },
    tables: { title: 'Table Status', sub: 'Manage table occupancy' }
  };
  const t = titles[page] || { title: page, sub: '' };
  document.getElementById('topbar-title').textContent = t.title;
  document.getElementById('topbar-sub').textContent = t.sub;

  if (page === 'dashboard') renderDashboard();
  else if (page === 'orders') renderOrders();
  else if (page === 'qr') renderQRPage();
  else if (page === 'menu') renderMenuManager();
  else if (page === 'tables') renderTables();
}

// ── Live Refresh ──
function startLiveRefresh() {
  setInterval(() => {
    const activePage = document.querySelector('.admin-page.active');
    if (!activePage) return;
    const id = activePage.id.replace('page-', '');
    if (id === 'dashboard') renderDashboard();
    else if (id === 'orders') renderOrders();
    updatePendingBadge();
  }, 10000);
  updatePendingBadge();
}

function updatePendingBadge() {
  Orders.load();
  const pending = Orders.list.filter(o => o.status === 'pending').length;
  const badge = document.getElementById('orders-badge');
  if (badge) { badge.textContent = pending || ''; badge.style.display = pending ? 'flex' : 'none'; }
}

// ── Dashboard ──
function renderDashboard() {
  Orders.load();
  const stats = Orders.getStats();
  setInner('stat-orders', stats.totalOrders);
  setInner('stat-revenue', `₹${stats.revenue.toLocaleString('en-IN', {maximumFractionDigits:0})}`);
  setInner('stat-active', stats.activeOrders);
  setInner('stat-pending', stats.pendingOrders);
  renderRevenueChart();
  renderRecentOrders();
}

function renderRevenueChart() {
  const data = Orders.getWeeklyRevenue();
  const max = Math.max(...data.map(d => d.revenue), 1);
  const container = document.getElementById('revenue-chart');
  if (!container) return;
  container.innerHTML = data.map(d => `
    <div class="bar-col">
      <div class="bar" style="height:${Math.max(4, (d.revenue/max)*160)}px" data-value="₹${d.revenue.toLocaleString('en-IN',{maximumFractionDigits:0})}"></div>
      <span class="bar-label">${d.day}</span>
    </div>
  `).join('');
}

function renderRecentOrders() {
  Orders.load();
  const container = document.getElementById('recent-orders-list');
  if (!container) return;
  const recent = Orders.list.slice(0, 5);
  if (recent.length === 0) { container.innerHTML = '<p style="color:var(--text-faint);font-size:0.85rem;text-align:center;padding:24px">No orders yet</p>'; return; }
  container.innerHTML = recent.map(o => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border);">
      <div>
        <div style="font-size:0.88rem;font-weight:600">${o.id}</div>
        <div style="font-size:0.78rem;color:var(--text-muted)">Table ${o.table} · ${Orders.getTimeAgo(o.createdAt)}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:0.88rem;color:var(--gold);font-family:'Playfair Display',serif">₹${o.total.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
        <span class="badge badge-${STATUS_LABELS[o.status].color}" style="font-size:0.68rem">${STATUS_LABELS[o.status].label}</span>
      </div>
    </div>
  `).join('');
}

// ── Orders Queue ──
function renderOrders() {
  Orders.load();
  const container = document.getElementById('orders-container');
  if (!container) return;
  const active = Orders.getActive();
  if (active.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 24px;color:var(--text-faint);">
        <div style="font-size:3rem;margin-bottom:16px">🍽</div>
        <h3 style="font-size:1rem;color:var(--text-muted)">No active orders</h3>
        <p style="font-size:0.85rem;margin-top:8px">Orders will appear here in real-time</p>
      </div>`;
    return;
  }
  // Sort: pending first, then preparing, then ready
  const sortOrder = { pending: 0, preparing: 1, ready: 2, served: 3 };
  active.sort((a, b) => sortOrder[a.status] - sortOrder[b.status]);
  container.innerHTML = active.map(o => renderOrderCard(o)).join('');
}

function renderOrderCard(o) {
  const st = STATUS_LABELS[o.status];
  const next = ORDER_STATUS[ORDER_STATUS.indexOf(o.status) + 1];
  const nextLabel = next ? `Mark as ${next.charAt(0).toUpperCase() + next.slice(1)}` : 'Completed';
  return `
    <div class="order-card" id="order-${o.id}">
      <div class="order-card-header ${o.status}">
        <div>
          <div class="order-num">${o.id}</div>
          <div class="order-table">🪑 Table ${o.table} · ${o.customer}</div>
        </div>
        <div style="text-align:right">
          <span class="badge badge-${st.color}">${st.label}</span>
          <div class="order-time" style="margin-top:4px">⏱ ${Orders.getTimeAgo(o.createdAt)}</div>
        </div>
      </div>
      <div class="order-card-body">
        <div class="order-card-items">
          ${o.items.map(i => `<div class="order-card-item"><span>${i.qty}× ${i.name}</span><span>₹${(i.price*i.qty).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}</span></div>`).join('')}
        </div>
        ${o.notes ? `<div class="order-notes">📝 ${o.notes}</div>` : ''}
        <div style="display:flex;justify-content:space-between;font-size:0.88rem;font-weight:600">
          <span>Total</span>
          <span style="color:var(--gold);font-family:'Playfair Display',serif">₹${o.total.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
        </div>
      </div>
      <div class="order-card-footer">
        ${next ? `<button class="order-status-btn primary" onclick="advanceOrder('${o.id}','${next}')">${nextLabel}</button>` : `<button class="order-status-btn" disabled>✓ Served</button>`}
        <button class="order-status-btn" onclick="cancelOrder('${o.id}')" style="flex:0;padding:8px 12px;color:var(--danger);border-color:rgba(232,80,80,0.3)">🗑</button>
      </div>
    </div>`;
}

function advanceOrder(id, newStatus) {
  Orders.load();
  Orders.updateStatus(id, newStatus);
  renderOrders();
  updatePendingBadge();
  showToast(`Order ${id} → ${newStatus}`, 'success');
}

function cancelOrder(id) {
  if (!confirm('Remove this order?')) return;
  Orders.list = Orders.list.filter(o => o.id !== id);
  Orders.save();
  renderOrders();
  updatePendingBadge();
}

// ── QR Code Page ──
function renderQRPage() {
  const container = document.getElementById('qr-grid');
  if (!container) return;
  const tables = Array.from({length: 20}, (_, i) => i + 1);
  container.innerHTML = tables.map(t => `
    <div class="qr-table-card">
      <div class="qr-table-name">Table ${t}</div>
      <div class="qr-table-sub">Scan to view menu</div>
      <div class="qr-code-wrap" id="qr-wrap-${t}"></div>
      <div class="qr-actions">
        <button class="btn btn-outline btn-sm" onclick="downloadQR(${t})">⬇ Download</button>
        <button class="btn btn-ghost btn-sm" onclick="copyQRLink(${t})">🔗 Copy</button>
      </div>
    </div>
  `).join('');
  // Generate QR codes using qrcodejs
  tables.forEach(t => {
    const wrap = document.getElementById(`qr-wrap-${t}`);
    if (!wrap || !window.QRCode) return;
    wrap.innerHTML = '';
    try {
      new QRCode(wrap, {
        text: `${window.location.origin}${window.location.pathname.replace('admin.html', '')}menu.html?table=${t}`,
        width: 144, height: 144,
        colorDark: '#000000', colorLight: '#FFFFFF',
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch(e) { wrap.innerHTML = `<div style="color:#999;font-size:0.7rem;text-align:center">QR ${t}</div>`; }
  });
}

function downloadQR(tableNum) {
  const wrap = document.getElementById(`qr-wrap-${tableNum}`);
  if (!wrap) return;
  const canvas = wrap.querySelector('canvas');
  if (!canvas) { showToast('QR canvas not ready', 'error'); return; }
  const link = document.createElement('a');
  link.download = `scan2serve-${tableNum}-qr.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast(`QR code for Table ${tableNum} downloaded!`, 'success');
}

function copyQRLink(tableNum) {
  const url = `${window.location.origin}${window.location.pathname.replace('admin.html', '')}menu.html?table=${tableNum}`;
  navigator.clipboard.writeText(url).then(() => showToast('Link copied to clipboard!', 'success'));
}

// ── Menu Manager ──
let menuCatFilter = 'all';

function filterMenuCat(btn, cat) {
  menuCatFilter = cat;
  document.querySelectorAll('#menu-cat-filter .btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderMenuManager();
}

function renderMenuManager() {
  const container = document.getElementById('admin-menu-grid');
  if (!container) return;
  const cats = menuCatFilter === 'all' ? Object.keys(MENU_DATA) : [menuCatFilter];
  const allItems = cats.flatMap(k =>
    MENU_DATA[k] ? MENU_DATA[k].items.map(item => ({ ...item, categoryLabel: MENU_DATA[k].label })) : []
  );
  const countEl = document.getElementById('menu-item-count');
  if (countEl) countEl.textContent = `${allItems.length} items`;
  container.innerHTML = allItems.map(item => `
    <div class="admin-item-card">
      <img class="admin-item-img" src="${item.image}" alt="${item.name}" onerror="this.style.background='var(--bg-elevated)';this.src=''">
      <div class="admin-item-info">
        <div class="admin-item-name">${item.name}</div>
        <div class="admin-item-price">₹${item.price.toLocaleString('en-IN')}</div>
        <div class="admin-item-cat">${item.categoryLabel}</div>
        <div class="admin-item-actions">
          <button class="btn btn-ghost btn-sm" onclick="editItem('${item.id}')">✏️</button>
          <button class="btn btn-sm" style="background:rgba(232,80,80,0.1);color:var(--danger);border:1px solid rgba(232,80,80,0.3)" onclick="showToast('Item management coming soon!','info')">🗑</button>
        </div>
      </div>
    </div>
  `).join('');
}

function editItem(id) {
  showToast('Item editing panel — coming soon!', 'info');
}

// ── Tables ──
function renderTables() {
  const container = document.getElementById('tables-grid');
  if (!container) return;
  const statuses = ['available','occupied','occupied','available','reserved','available','occupied','occupied','available','available','reserved','occupied','available','available','occupied','available','available','occupied','available','available'];
  container.innerHTML = Array.from({length:20},(_,i)=>i+1).map((t, idx) => `
    <div class="table-status-card ${statuses[idx]}" onclick="toggleTableStatus(this,'${statuses[idx]}',${t})">
      <div class="table-icon">🍽</div>
      <div class="table-name">Table ${t}</div>
      <div class="table-state">${statuses[idx]}</div>
    </div>
  `).join('');
}

function toggleTableStatus(el, current, tableNum) {
  const cycle = { available: 'occupied', occupied: 'reserved', reserved: 'available' };
  const next = cycle[current];
  el.className = `table-status-card ${next}`;
  el.querySelector('.table-state').textContent = next;
  el.onclick = () => toggleTableStatus(el, next, tableNum);
  showToast(`Table ${tableNum} → ${next}`, 'info');
}

// ── Helper ──
function setInner(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
