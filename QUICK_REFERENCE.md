# 🎯 Quick Reference Card

## Module Cheat Sheet

### 🌐 api.js (HTTP Client)
```javascript
import { api } from '/js/api.js'

// Auth
api.login(email, password)
api.register(email, password, name)
api.verifyToken(token)

// Products
api.getProducts(filters)
api.getProduct(id)

// Orders
api.createOrder(orderData)
api.getOrders(userId)
```

### 👤 auth.js (Authentication State)
```javascript
import { auth } from '/js/auth.js'

// Methods
auth.login(email, password)
auth.register(email, password, name)
auth.logout()
auth.getUser()
auth.isAuthenticated()

// Subscribe
auth.subscribe((user) => {
  console.log('User changed:', user)
})
```

### 🛒 cart.js (Shopping Cart)
```javascript
import { cart } from '/js/cart.js'

// Methods
cart.addItem(product, quantity)
cart.removeItem(productId)
cart.updateQuantity(productId, quantity)
cart.clear()
cart.getItems()
cart.getTotal()
cart.getItemCount()

// Subscribe
cart.subscribe((items) => {
  console.log('Cart changed:', items)
})
```

### 📦 products.js (Products Manager)
```javascript
import { products } from '/js/products.js'

// Methods
await products.fetchProducts(filters)
products.getProducts()
products.isLoading()
```

### 🎨 ui.js (DOM Rendering)
```javascript
import { UI } from '/js/ui.js'

// Rendering
UI.renderProducts(productList, container)
UI.renderCartItems(items)
UI.updateCartBadge(count)
UI.updateAuthNav(user)

// Modals
UI.openModal(modalId)
UI.closeModal(modalId)
UI.showAuthForm(type)

// Forms
UI.clearLoginForm()
UI.clearRegisterForm()

// Alerts
UI.showAlert(type, message)
```

### ⚡ handlers.js (Event Handlers)
```javascript
import { handlers } from '/js/handlers.js'

// Auth
handlers.login()
handlers.register()
handlers.logout()
handlers.openAuthModal(type)
handlers.closeAuthModal()

// Cart
handlers.addToCart(productId, name, price)
handlers.updateQuantity(productId, quantity)
handlers.clearCart()
handlers.openCartModal()
handlers.closeCartModal()
handlers.checkout()

// Products
handlers.filterProducts()
handlers.scrollToSection(sectionId)
```

### 🚀 app.js (Initialization)
```javascript
import { initApp } from '/js/app.js'

// Initialize app on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initApp)
```

---

## Data Flow

```
User clicks button
    ↓
HTML calls: onclick="handlers.actionName()"
    ↓
handlers.js executes logic
    ↓
Calls state: auth.login(), cart.addItem(), etc
    ↓
State changes (observable pattern)
    ↓
Observer callbacks triggered
    ↓
Calls UI: UI.updateBadge(), UI.renderCart(), etc
    ↓
DOM updates
    ↓
User sees change ✅
```

---

## Testing Template

```javascript
// Test state module
import { cart } from './cart.js'

test('addItem increments quantity', () => {
  cart.addItem({ id: 1, price: 10 })
  cart.addItem({ id: 1, price: 10 })
  
  expect(cart.getItems()[0].quantity).toBe(2)
})

// Test handler
import { handlers } from './handlers.js'
jest.mock('./api.js')

test('login calls api.login', async () => {
  // Mock auth form inputs
  document.body.innerHTML = `
    <input id="loginEmail" value="test@test.com" />
    <input id="loginPassword" value="password" />
  `
  
  await handlers.login()
  expect(api.login).toHaveBeenCalledWith(
    'test@test.com', 'password'
  )
})

// Test UI
import { UI } from './ui.js'

test('renderProducts creates grid', () => {
  const container = document.createElement('div')
  UI.renderProducts([
    { id: 1, name: 'Test', price: 10 }
  ], container)
  
  expect(container.innerHTML).toContain('Test')
})
```

---

## File Locations

| Need | File |
|------|------|
| Change HTTP logic | `api.js` |
| Change auth | `auth.js` |
| Change cart | `cart.js` |
| Change products | `products.js` |
| Change HTML rendering | `ui.js` |
| Change user interactions | `handlers.js` |
| Change startup | `app.js` |
| Change markup | `index.html` |
| Change styling | `public/css/styles.css` |

---

## Adding a Feature

### Step-by-step

1. **Add to state** (if needed)
   ```javascript
   // In auth.js, cart.js, or products.js
   async newMethod() { ... }
   ```

2. **Add to handlers** (user action)
   ```javascript
   // In handlers.js
   newAction() {
     state.newMethod()
     UI.updateSomething()
   }
   ```

3. **Add to UI** (rendering)
   ```javascript
   // In ui.js
   renderNewFeature(data) {
     // Return HTML string
   }
   ```

4. **Wire in HTML**
   ```html
   <button onclick="handlers.newAction()">Click</button>
   ```

---

## Common Tasks

### Add async operation
```javascript
// handlers.js
async myAction() {
  try {
    const result = await api.doSomething()
    // Update state and UI
  } catch (error) {
    UI.showAlert('error', error.message)
  }
}
```

### Subscribe to state changes
```javascript
// app.js
auth.subscribe((user) => {
  UI.updateAuthNav(user)
})
```

### Get form values
```javascript
// handlers.js
const email = document.getElementById('email').value
const password = document.getElementById('password').value
```

### Call multiple endpoints
```javascript
// handlers.js
const products = await api.getProducts()
const orders = await api.getOrders(userId)
// Do something with both
```

### Clear form after submit
```javascript
// handlers.js
await auth.register(name, email, password)
UI.clearRegisterForm()
```

---

## Debugging Checklist

- [ ] Open DevTools (F12)
- [ ] Check Console for errors
- [ ] Check Network tab for API requests
- [ ] Check localStorage for state
- [ ] Add console.log() in handlers
- [ ] Check HTML elements exist
- [ ] Verify event listeners attached
- [ ] Check module imports work
- [ ] Test API endpoint manually

---

## Key Principles

### ✅ Single Responsibility
Each module does ONE thing well

### ✅ Separation of Concerns
UI ≠ Logic ≠ State ≠ HTTP

### ✅ Observable Pattern
State changes notify observers

### ✅ Easy to Test
No dependencies = easy to mock

### ✅ Easy to Debug
Know exactly where each concern lives

---

## Module Sizes

| Module | Lines | Purpose |
|--------|-------|---------|
| api.js | ~100 | HTTP requests |
| auth.js | ~80 | Auth state |
| cart.js | ~80 | Cart state |
| products.js | ~50 | Products state |
| ui.js | ~150 | DOM rendering |
| handlers.js | ~180 | Event handlers |
| app.js | ~50 | Initialization |

**Total:** ~690 lines (clean, organized, testable)

---

## Getting Help

1. **Code documentation** - Read module headers
2. **Architecture guide** - MODULAR_ARCHITECTURE.md
3. **Testing guide** - TESTING_GUIDE.md
4. **Setup guide** - SETUP_GUIDE.md
5. **API reference** - API_REFERENCE.md

---

## Pro Tips

💡 **Use console to test:**
```javascript
// Browser console
handlers.addToCart(1, 'Test', 99.99)
console.log(cart.getItems())
console.log(auth.getUser())
```

💡 **Add logging:**
```javascript
// In any handler
console.log('[handlers] actionName called', { arg1, arg2 })
```

💡 **Check state:**
```javascript
// Browser console
window.cart.getItems()
window.auth.getUser()
window.products.getProducts()
```

💡 **Test DOM updates:**
```javascript
// Browser console
document.getElementById('cartCount').textContent
```

---

**Print this card and keep it handy! 📌**
