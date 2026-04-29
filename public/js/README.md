// Frontend Module Dependencies
// 
// All modules use standard fetch API and localStorage
// No external libraries required (vanilla JavaScript)
//
// import { api } from '/js/api.js'
// - APIClient class with methods for all API endpoints
// - Auto-includes JWT token in headers
// - Error handling built-in
//
// import { cart } from '/js/cart.js'
// - ShoppingCart class
// - persist to localStorage
// - Observer pattern for UI updates
//
// import { auth } from '/js/auth.js'
// - AuthManager class
// - Handles login/register/logout
// - JWT token management
// - Observer pattern for auth changes
//
// import { products } from '/js/products.js'
// - ProductManager class
// - Fetches and caches products
// - Loading state management

// All modules are ES6 modules imported in index.html
// Global window object has access to:
// - window.api
// - window.cart
// - window.auth
// - window.products
