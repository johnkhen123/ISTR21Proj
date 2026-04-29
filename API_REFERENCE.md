/**
 * EcoStore Backend Server Configuration
 * 
 * All routes, middleware, and error handling configured
 * Ready for Vercel deployment
 */

// Key endpoints:
// GET  /api/health              - Server health check
// 
// GET  /api/products            - List products (filters: category, sort, limit, offset)
// GET  /api/products/:id        - Get single product
// POST /api/products            - Create product
// PUT  /api/products/:id        - Update product
// DELETE /api/products/:id      - Delete product
//
// POST /api/auth/register       - Register user
// POST /api/auth/login          - Login user
// POST /api/auth/verify         - Verify JWT token
//
// GET  /api/orders/user/:userId - Get user's orders
// GET  /api/orders/:orderId     - Get order details
// POST /api/orders              - Create order
// PATCH /api/orders/:orderId    - Update order status

// Database tables needed:
// - users (id, email, password_hash, name, created_at)
// - products (id, name, description, price, category, image_url, stock, created_at)
// - orders (id, user_id, total_amount, shipping_address, status, created_at)
// - order_items (id, order_id, product_id, quantity, price)
