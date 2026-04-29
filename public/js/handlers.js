/**
 * Event Handlers - All user interaction logic
 * Separated for easy testing and maintenance
 */

import { api } from './api.js';
import { auth } from './auth.js';
import { cart } from './cart.js';
import { products } from './products.js';
import { UI } from './ui.js';

export const handlers = {
  // Authentication handlers
  async login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      UI.showAlert('error', 'Please fill in all fields');
      return;
    }

    try {
      await auth.login(email, password);
      UI.closeModal('authModal');
      UI.clearLoginForm();
      UI.showAlert('success', 'Logged in successfully!');
    } catch (error) {
      UI.showAlert('error', 'Login failed: ' + error.message);
    }
  },

  async register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (!name || !email || !password) {
      UI.showAlert('error', 'Please fill in all fields');
      return;
    }

    try {
      await auth.register(email, password, name);
      UI.closeModal('authModal');
      UI.clearRegisterForm();
      UI.showAlert('success', 'Account created successfully!');
    } catch (error) {
      UI.showAlert('error', 'Registration failed: ' + error.message);
    }
  },

  logout() {
    auth.logout();
    UI.showAlert('success', 'Logged out successfully!');
  },

  openAuthModal(type) {
    UI.openModal('authModal');
    UI.showAuthForm(type);
  },

  closeAuthModal() {
    UI.closeModal('authModal');
  },

  // Cart handlers
  openCartModal() {
    UI.openModal('cartModal');
    const items = cart.getItems();
    UI.renderCartItems(items);
  },

  closeCartModal() {
    UI.closeModal('cartModal');
  },

  addToCart(productId, name, price) {
    const product = products.getProducts().find(p => p.id === productId);
    if (product) {
      cart.addItem(product);
      UI.showAlert('success', `Added ${name} to cart!`);
    }
  },

  updateQuantity(productId, quantity) {
    cart.updateQuantity(productId, parseInt(quantity));
    const items = cart.getItems();
    UI.renderCartItems(items);
  },

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      cart.clear();
      UI.renderCartItems([]);
    }
  },

  async checkout() {
    if (!auth.isAuthenticated()) {
      UI.showAlert('error', 'Please login to checkout');
      this.closeCartModal();
      this.openAuthModal('login');
      return;
    }

    const items = cart.getItems();
    if (items.length === 0) {
      UI.showAlert('error', 'Cart is empty');
      return;
    }

    try {
      const orderData = {
        user_id: auth.getUser().id,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: cart.getTotal(),
        shipping_address: 'TBD',
        status: 'pending'
      };

      await api.createOrder(orderData);
      cart.clear();
      this.closeCartModal();
      UI.showAlert('success', 'Order placed successfully!');
    } catch (error) {
      UI.showAlert('error', 'Checkout failed: ' + error.message);
    }
  },

  // Product filtering handlers
  async filterProducts() {
    const search = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    const sort = document.getElementById('sortFilter').value;

    let filtered = products.getProducts().filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.description?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !category || p.category === category;
      return matchSearch && matchCategory;
    });

    // Apply sorting
    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    const container = document.getElementById('productsList');
    UI.renderProducts(filtered, container);
  },

  scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Debounce helper for filter inputs
export function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}
