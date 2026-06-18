// ============================================================
//  VELVET TABLE — Cart Logic
// ============================================================

const CART_KEY = 'velvetTable_cart';
const TAX_RATE = 0.08;
const SERVICE_RATE = 0.05;
const CURRENCY_VERSION = 'inr_v1';

// ── Clear old USD-priced data on first INR load ──
if (localStorage.getItem('velvetTable_currencyVersion') !== CURRENCY_VERSION) {
  localStorage.removeItem('velvetTable_cart');
  localStorage.removeItem('velvetTable_orders');
  localStorage.setItem('velvetTable_currencyVersion', CURRENCY_VERSION);
}


const Cart = {
  items: [],

  load() {
    try {
      const saved = localStorage.getItem(CART_KEY);
      this.items = saved ? JSON.parse(saved) : [];
    } catch { this.items = []; }
    return this;
  },

  save() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items));
    return this;
  },

  add(item, qty = 1) {
    const existing = this.items.find(i => i.id === item.id);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push({ ...item, qty });
    }
    this.save();
    return this;
  },

  remove(itemId) {
    this.items = this.items.filter(i => i.id !== itemId);
    this.save();
    return this;
  },

  updateQty(itemId, delta) {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.qty = Math.max(0, item.qty + delta);
      if (item.qty === 0) this.remove(itemId);
      else this.save();
    }
    return this;
  },

  getQty(itemId) {
    const item = this.items.find(i => i.id === itemId);
    return item ? item.qty : 0;
  },

  getCount() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  getSubtotal() {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  getTax() { return this.getSubtotal() * TAX_RATE; },
  getService() { return this.getSubtotal() * SERVICE_RATE; },
  getTotal() { return this.getSubtotal() + this.getTax() + this.getService(); },

  clear() {
    this.items = [];
    this.save();
    return this;
  },

  isEmpty() { return this.items.length === 0; }
};

// ── Utility: Format currency (Indian Rupees) ──
function formatPrice(val) {
  return '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Utility: Toast notifications ──
function showToast(msg, type = 'info', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: '🔔', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '🔔'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── Utility: Navbar scroll effect ──
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
  // Mobile menu
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }
}

// ── Utility: Animate elements on scroll ──
function initScrollAnimations() {
  const els = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${el.dataset.delay || '0s'}, transform 0.6s ease ${el.dataset.delay || '0s'}`;
    observer.observe(el);
  });
}

// ── Init on DOM ready ──
document.addEventListener('DOMContentLoaded', () => {
  Cart.load();
  initNavbar();
  initScrollAnimations();
});
