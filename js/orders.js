// ============================================================
//  VELVET TABLE — Orders Logic
// ============================================================

const ORDERS_KEY = 'velvetTable_orders';
const ORDER_STATUS = ['pending', 'preparing', 'ready', 'served'];
const STATUS_LABELS = {
  pending:   { label: '⏳ Pending',   color: 'warning' },
  preparing: { label: '👨‍🍳 Preparing', color: 'info' },
  ready:     { label: '✅ Ready',     color: 'success' },
  served:    { label: '🍽 Served',    color: 'muted' }
};

const Orders = {
  list: [],

  load() {
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      this.list = saved ? JSON.parse(saved) : [];
    } catch { this.list = []; }
    return this;
  },

  save() {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(this.list));
    return this;
  },

  create(cartItems, tableNum, customerName, notes = '') {
    const id = 'ORD-' + Date.now().toString(36).toUpperCase();
    const order = {
      id,
      table: tableNum,
      customer: customerName || 'Guest',
      items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      notes,
      status: 'pending',
      subtotal: cartItems.reduce((s, i) => s + i.price * i.qty, 0),
      tax: cartItems.reduce((s, i) => s + i.price * i.qty, 0) * 0.08,
      service: cartItems.reduce((s, i) => s + i.price * i.qty, 0) * 0.05,
      total: cartItems.reduce((s, i) => s + i.price * i.qty, 0) * 1.13,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.list.unshift(order);
    this.save();
    return order;
  },

  updateStatus(orderId, newStatus) {
    const order = this.list.find(o => o.id === orderId);
    if (order && ORDER_STATUS.includes(newStatus)) {
      order.status = newStatus;
      order.updatedAt = Date.now();
      this.save();
      return true;
    }
    return false;
  },

  getById(orderId) {
    return this.list.find(o => o.id === orderId) || null;
  },

  getByTable(tableNum) {
    return this.list.filter(o => o.table == tableNum && o.status !== 'served');
  },

  getActive() {
    return this.list.filter(o => o.status !== 'served');
  },

  getStats() {
    const today = new Date(); today.setHours(0,0,0,0);
    const todaysOrders = this.list.filter(o => o.createdAt >= today.getTime());
    return {
      totalOrders: todaysOrders.length,
      revenue: todaysOrders.reduce((s, o) => s + o.total, 0),
      activeOrders: this.list.filter(o => o.status === 'preparing').length,
      pendingOrders: this.list.filter(o => o.status === 'pending').length
    };
  },

  getWeeklyRevenue() {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const result = days.map(d => ({ day: d, revenue: 0 }));
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    this.list
      .filter(o => now - o.createdAt < weekMs)
      .forEach(o => {
        const d = new Date(o.createdAt).getDay();
        result[d].revenue += o.total;
      });
    return result;
  },

  getTimeAgo(ts) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    return `${Math.floor(diff/3600)}h ago`;
  },

  clear() { this.list = []; this.save(); }
};

// ── Seed some demo orders if empty ──
function seedDemoOrders() {
  if (Orders.list.length > 0) return;
  const demos = [
    { table: 3, customer: 'Sophie M.', items: [{id:'m1',name:'Prime Ribeye Steak',price:5699,qty:2},{id:'d1',name:'Dark Chocolate Fondant',price:1349,qty:2},{id:'r1',name:'Velvet Negroni',price:1499,qty:2}], status:'preparing', notes:'Medium rare please', ago: 12 },
    { table: 7, customer: 'James K.', items: [{id:'m2',name:'Black Truffle Tagliatelle',price:3199,qty:1},{id:'r4',name:'House Mocktail',price:849,qty:1}], status:'pending', notes:'', ago: 3 },
    { table: 5, customer: 'Table 5', items: [{id:'s2',name:'Seared Scallops',price:1999,qty:2},{id:'m4',name:'Grilled Sea Bass',price:3699,qty:2},{id:'d2',name:'Crème Brûlée',price:1179,qty:2}], status:'ready', notes:'Anniversary dinner', ago: 25 },
    { table: 12, customer: 'Aria T.', items: [{id:'s1',name:'Burrata & Heirloom Tomato',price:1499,qty:1},{id:'m5',name:'Wild Mushroom Wellington',price:3049,qty:1}], status:'served', notes:'', ago: 60 },
  ];
  demos.forEach(d => {
    const subtotal = d.items.reduce((s,i) => s + i.price*i.qty, 0);
    Orders.list.push({
      id: 'ORD-' + Math.random().toString(36).substr(2,6).toUpperCase(),
      table: d.table, customer: d.customer, items: d.items,
      notes: d.notes, status: d.status,
      subtotal, tax: subtotal*0.08, service: subtotal*0.05, total: subtotal*1.13,
      createdAt: Date.now() - d.ago * 60000, updatedAt: Date.now() - d.ago * 60000
    });
  });
  Orders.save();
}
