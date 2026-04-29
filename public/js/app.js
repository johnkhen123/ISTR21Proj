/**
 * App Initialization Module
 * Handles app startup, event listeners, and state subscriptions
 */

import { api } from './api.js';
import { auth } from './auth.js';
import { cart } from './cart.js';
import { products } from './products.js';
import { UI } from './ui.js';
import { handlers, debounce } from './handlers.js';

export async function initApp() {
  // Load initial data
  await loadProducts();
  
  // Update initial UI state
  updateUI();
  
  // Setup event listeners
  setupEventListeners();
  
  // Subscribe to state changes
  subscribeToStateChanges();
}

async function loadProducts() {
  try {
    await products.fetchProducts();
    const container = document.getElementById('productsList');
    UI.renderProducts(products.getProducts(), container);
  } catch (error) {
    UI.showAlert('error', 'Failed to load products: ' + error.message);
  }
}

function updateUI() {
  // Update cart badge
  const cartCount = cart.getItemCount();
  UI.updateCartBadge(cartCount);
  
  // Update auth nav
  const user = auth.getUser();
  UI.updateAuthNav(user);
}

function setupEventListeners() {
  // Search and filter inputs
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  
  if (searchInput) searchInput.addEventListener('input', debounce(() => handlers.filterProducts(), 300));
  if (categoryFilter) categoryFilter.addEventListener('change', () => handlers.filterProducts());
  if (sortFilter) sortFilter.addEventListener('change', () => handlers.filterProducts());
  
  // Cart link
  const cartLink = document.querySelector('a[href="#cart"]');
  if (cartLink) {
    cartLink.onclick = (e) => {
      e.preventDefault();
      handlers.openCartModal();
    };
  }
  
  // Modal close buttons
  document.addEventListener('click', (e) => {
    if (e.target.id === 'authModal') {
      handlers.closeAuthModal();
    }
    if (e.target.id === 'cartModal') {
      handlers.closeCartModal();
    }
  });
}

function subscribeToStateChanges() {
  // Subscribe to cart changes
  cart.subscribe(() => {
    const count = cart.getItemCount();
    UI.updateCartBadge(count);
  });
  
  // Subscribe to auth changes
  auth.subscribe(() => {
    const user = auth.getUser();
    UI.updateAuthNav(user);
  });
}

// Make handlers globally available for inline onclick handlers in HTML
window.handlers = handlers;
