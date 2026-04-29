/**
 * Testing Guide for Modular EcoStore
 * 
 * Because the code is modular, each piece can be tested independently.
 * This guide shows how to test each module.
 */

// ============================================================================
// TESTING THE API MODULE (api.js)
// ============================================================================

// Test: APIClient makes GET request correctly
describe('APIClient.getProducts()', () => {
  test('should make GET request to /api/products', async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [] })
      })
    )

    const { api } = await import('./api.js')
    const result = await api.getProducts()

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/products'),
      expect.any(Object)
    )
  })

  test('should include JWT token in Authorization header', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [] })
      })
    )

    const { api } = await import('./api.js')
    api.setToken('test-token')
    await api.getProducts()

    const callArgs = fetch.mock.calls[0][1]
    expect(callArgs.headers.Authorization).toContain('Bearer')
  })
})

// ============================================================================
// TESTING AUTH MODULE (auth.js)
// ============================================================================

// Test: AuthManager login updates state
describe('AuthManager.login()', () => {
  test('should set user and token on successful login', async () => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    }
    global.localStorage = localStorageMock

    // Mock api
    jest.mock('./api.js', () => ({
      api: {
        login: jest.fn(() => Promise.resolve({
          user: { id: '123', email: 'test@test.com' },
          token: 'jwt-token'
        }))
      }
    }))

    const { auth } = await import('./auth.js')
    await auth.login('test@test.com', 'password')

    expect(auth.isAuthenticated()).toBe(true)
    expect(auth.getUser().email).toBe('test@test.com')
  })

  test('should notify subscribers when user changes', async () => {
    const callback = jest.fn()
    const { auth } = await import('./auth.js')
    
    auth.subscribe(callback)
    // subscribe is called immediately
    expect(callback).toHaveBeenCalled()
  })
})

// ============================================================================
// TESTING CART MODULE (cart.js)
// ============================================================================

// Test: ShoppingCart adds items
describe('ShoppingCart.addItem()', () => {
  test('should add product to cart', () => {
    const { cart } = require('./cart.js')
    
    const product = { id: 1, name: 'Test', price: 10 }
    cart.addItem(product)
    
    expect(cart.getItems().length).toBe(1)
    expect(cart.getItems()[0].name).toBe('Test')
  })

  test('should increment quantity for duplicate items', () => {
    const { cart } = require('./cart.js')
    
    const product = { id: 1, name: 'Test', price: 10 }
    cart.addItem(product)
    cart.addItem(product)
    
    expect(cart.getItems().length).toBe(1)
    expect(cart.getItems()[0].quantity).toBe(2)
  })

  test('should calculate correct total', () => {
    const { cart } = require('./cart.js')
    
    cart.addItem({ id: 1, name: 'A', price: 10 })
    cart.addItem({ id: 2, name: 'B', price: 20 })
    
    expect(cart.getTotal()).toBe(30)
  })

  test('should notify subscribers when item added', () => {
    const { cart } = require('./cart.js')
    const callback = jest.fn()
    
    cart.subscribe(callback)
    cart.addItem({ id: 1, name: 'Test', price: 10 })
    
    expect(callback).toHaveBeenCalled()
  })

  test('should persist to localStorage', () => {
    const { cart } = require('./cart.js')
    
    cart.addItem({ id: 1, name: 'Test', price: 10 })
    
    const saved = JSON.parse(localStorage.getItem('cart'))
    expect(saved[0].id).toBe(1)
  })
})

// ============================================================================
// TESTING HANDLERS MODULE (handlers.js)
// ============================================================================

// Test: Handler calls correct methods
describe('handlers.addToCart()', () => {
  test('should call cart.addItem with correct product', async () => {
    const cartSpy = jest.spyOn(cart, 'addItem')
    const product = { id: 1, name: 'Test', price: 10 }
    
    // Mock products module
    jest.spyOn(products, 'getProducts').mockReturnValue([product])
    
    await handlers.addToCart(1, 'Test', 10)
    
    expect(cartSpy).toHaveBeenCalledWith(product)
  })

  test('should show alert if product not found', () => {
    const alertSpy = jest.spyOn(window, 'alert')
    jest.spyOn(products, 'getProducts').mockReturnValue([])
    
    handlers.addToCart(999, 'Test', 10)
    
    expect(alertSpy).toHaveBeenCalled()
  })
})

// ============================================================================
// TESTING UI MODULE (ui.js)
// ============================================================================

// Test: UI rendering produces correct HTML
describe('UI.renderProducts()', () => {
  test('should create product card for each product', () => {
    const container = document.createElement('div')
    const products = [
      { id: 1, name: 'Test', price: 10, description: 'Test product' }
    ]
    
    UI.renderProducts(products, container)
    
    expect(container.innerHTML).toContain('Test')
    expect(container.innerHTML).toContain('$10.00')
    expect(container.querySelector('.product-card')).toBeTruthy()
  })

  test('should show empty message when no products', () => {
    const container = document.createElement('div')
    UI.renderProducts([], container)
    
    expect(container.textContent).toContain('No products found')
  })
})

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

// Test: Full flow from click to cart update
describe('Add to cart flow', () => {
  test('should go from click → handler → state → UI', async () => {
    // Setup DOM
    document.body.innerHTML = `
      <button onclick="window.handlers.addToCart(1, 'Test', 10)">Add</button>
      <span id="cartCount">0</span>
    `

    // Mock products
    jest.spyOn(products, 'getProducts').mockReturnValue([
      { id: 1, name: 'Test', price: 10 }
    ])

    // Click button
    document.querySelector('button').click()

    // Verify cart updated
    expect(cart.getItemCount()).toBe(1)

    // Verify UI updated
    setTimeout(() => {
      expect(document.getElementById('cartCount').textContent).toBe('1')
    }, 100)
  })
})

// ============================================================================
// HOW TO RUN TESTS
// ============================================================================

/*

1. Install Jest:
   npm install --save-dev jest

2. Create test files:
   public/js/__tests__/api.test.js
   public/js/__tests__/auth.test.js
   public/js/__tests__/cart.test.js
   public/js/__tests__/handlers.test.js
   public/js/__tests__/ui.test.js

3. Add to package.json:
   "test": "jest"
   "test:watch": "jest --watch"

4. Run tests:
   npm test
   npm run test:watch

*/

// ============================================================================
// EXAMPLE TEST FILE STRUCTURE
// ============================================================================

/*

public/js/__tests__/
├── api.test.js           - Test API client
├── auth.test.js          - Test authentication
├── cart.test.js          - Test shopping cart
├── handlers.test.js      - Test event handlers
├── ui.test.js            - Test UI rendering
├── products.test.js      - Test product manager
└── integration.test.js   - Test full flows

*/

// ============================================================================
// BENEFITS OF MODULAR TESTING
// ============================================================================

/*

✅ Test one module without others
✅ Easy to mock dependencies
✅ Fast test execution
✅ Easy to find broken code
✅ Refactor with confidence
✅ Catch regressions early
✅ Document expected behavior
✅ Drive development (TDD)

*/
