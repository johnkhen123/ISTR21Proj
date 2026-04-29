/**
 * UI Module - Handles all DOM rendering and updates
 * Separated from business logic for easy testing and maintenance
 */

export const UI = {
  // Product rendering
  renderProducts(productList, container) {
    if (productList.length === 0) {
      container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><p>No products found</p></div>';
      return;
    }

    container.innerHTML = productList.map(product => `
      <div class="product-card">
        <img src="${product.image_url || 'https://via.placeholder.com/250x200?text=' + encodeURIComponent(product.name)}" alt="${product.name}" class="product-image">
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description || 'Quality product'}</p>
          <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
          <button class="btn btn-primary" onclick="window.handlers.addToCart(${product.id}, '${product.name}', ${product.price})" style="width: 100%;">
            Add to Cart
          </button>
        </div>
      </div>
    `).join('');
  },

  // Cart rendering
  renderCartItems(items) {
    const container = document.getElementById('cartItems');

    if (items.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 40px;">Your cart is empty</p>';
      return;
    }

    let html = '<table style="width: 100%; margin-bottom: 20px;"><tr style="border-bottom: 1px solid var(--border-color);"><th style="text-align: left; padding: 10px;">Product</th><th style="text-align: center; padding: 10px;">Qty</th><th style="text-align: right; padding: 10px;">Price</th></tr>';

    items.forEach(item => {
      html += `
        <tr style="border-bottom: 1px solid var(--border-color);">
          <td style="padding: 10px;">${item.name}</td>
          <td style="text-align: center; padding: 10px;">
            <input type="number" value="${item.quantity}" min="1" style="width: 50px;" onchange="window.handlers.updateQuantity(${item.id}, this.value)">
          </td>
          <td style="text-align: right; padding: 10px;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    });

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    html += '</table>';
    html += `<h3 style="text-align: right; font-size: 20px; margin-bottom: 20px;">Total: $${total.toFixed(2)}</h3>`;
    html += '<button class="btn btn-primary" onclick="window.handlers.checkout()" style="width: 100%; margin-bottom: 10px;">Checkout</button>';
    html += '<button class="btn btn-danger" onclick="window.handlers.clearCart()" style="width: 100%;">Clear Cart</button>';

    container.innerHTML = html;
  },

  // Cart UI update
  updateCartBadge(count) {
    const badge = document.getElementById('cartCount');
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  },

  // Auth UI update
  updateAuthNav(user) {
    const authNav = document.getElementById('authNav');
    if (user) {
      authNav.innerHTML = `
        <span style="color: white; margin-right: 10px;">👤 ${user.name || user.email}</span>
        <button class="btn btn-secondary" onclick="window.handlers.logout()">Logout</button>
      `;
    } else {
      authNav.innerHTML = `<a href="#" class="btn btn-secondary" onclick="window.handlers.openAuthModal('login'); return false;">Login</a>`;
    }
  },

  // Modal management
  openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
  },

  closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
  },

  showAuthForm(type) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authTitle = document.getElementById('authTitle');

    if (type === 'login') {
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      authTitle.textContent = 'Login';
    } else {
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      authTitle.textContent = 'Create Account';
    }
  },

  // Form clearing
  clearLoginForm() {
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
  },

  clearRegisterForm() {
    document.getElementById('registerName').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
  },

  // Alerts
  showAlert(type, message) {
    alert(message);
  }
};
