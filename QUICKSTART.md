# 🚀 EcoStore - Quick Reference

## 📋 Project Overview

**Fully functional ecommerce platform** built with:
- **Backend:** Node.js + Express + Supabase
- **Frontend:** Vanilla JavaScript (modular)
- **Database:** PostgreSQL (via Supabase)
- **Deployment:** Vercel

---

## ⚡ Quick Commands

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

---

## 🔑 Configuration Status

✅ **Environment Variables** - Pre-configured in `.env.local`
```
SUPABASE_URL .......................... ✓
SUPABASE_ANON_KEY ..................... ✓
SUPABASE_SERVICE_KEY .................. ✓
Database Credentials .................. ✓
JWT_SECRET ............................ ⏳ (see below)
```

⏳ **Still Need to Do:**
1. Run setup SQL in Supabase (see SETUP_GUIDE.md)
2. Add JWT_SECRET (generate: `openssl rand -base64 32`)
3. (Optional) Add sample products

---

## 📁 File Structure

```
ISTR21Proj/
├── 🌐 index.html              Main frontend entry point
├── 📦 package.json            Dependencies & scripts
├── 🔐 .env.local              Your secrets (don't commit!)
├── 🔐 .env.example            Template for team
├── 📄 SETUP_GUIDE.md          Complete setup instructions
├── 📄 API_REFERENCE.md        API endpoints reference
│
├── 🔧 api/                    Backend server
│   ├── server.js              Express app setup
│   ├── config/
│   │   └── supabase.js        Database client
│   └── routes/
│       ├── auth.js            Login/Register API
│       ├── products.js        Product management
│       └── orders.js          Order management
│
└── 🎨 public/                 Frontend assets
    ├── css/
    │   └── styles.css         All styling
    └── js/                    Modular JavaScript
        ├── api.js             HTTP client
        ├── auth.js            Auth state manager
        ├── cart.js            Shopping cart logic
        └── products.js        Product manager
```

---

## 🎯 Core Features

### 🛍️ Shopping
- Browse products in responsive grid
- Search & filter by category
- Sort by price/date
- Add to cart (localStorage)
- Cart quantity controls

### 🔐 Authentication
- User registration with email
- Secure login (JWT tokens)
- Password encryption (bcrypt)
- Session persistence
- Logout functionality

### 📦 Orders
- Create orders from cart
- View order history
- Track order status
- Multiple items per order

### 🎨 UI/UX
- Modern responsive design
- Mobile-optimized
- Smooth animations
- Loading states
- Error handling

---

## 📡 API Endpoints (REST)

### Products
```
GET    /api/products                         List all products
GET    /api/products?category=electronics    Filter by category
GET    /api/products?sort=price-asc          Sort by price
GET    /api/products/:id                     Get single product
POST   /api/products                         Create product
PUT    /api/products/:id                     Update product
DELETE /api/products/:id                     Delete product
```

### Authentication
```
POST   /api/auth/register                    Register user
POST   /api/auth/login                       Login user
POST   /api/auth/verify                      Verify JWT token
```

### Orders
```
GET    /api/orders/user/:userId              Get user's orders
GET    /api/orders/:orderId                  Get order details
POST   /api/orders                           Create new order
PATCH  /api/orders/:orderId                  Update order status
```

### System
```
GET    /api/health                           Server status check
```

---

## 🧪 Testing

### Test Server
```javascript
// Browser console
fetch('/api/health').then(r => r.json()).then(console.log)
```

### Add Test Product
```javascript
fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test Product',
    price: 99.99,
    category: 'electronics',
    description: 'A test product',
    stock: 10
  })
}).then(r => r.json()).then(console.log)
```

### Test Registration
Click "Login" → "Sign Up" in the UI

---

## 🚀 Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to vercel.com
   - Click "New Project"
   - Select your repo
   - Click "Deploy"

3. **Add Environment Variables**
   - Project Settings → Environment Variables
   - Add all from `.env.example`
   - Redeploy

✅ **Done!** Your app is live

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| **"Cannot find module"** | Run `npm install` |
| **Port already in use** | Change PORT in `.env.local` |
| **Supabase connection error** | Verify credentials in `.env.local` |
| **Tables not found** | Run SQL script in Supabase |
| **CORS errors** | Check FRONTEND_URL matches your domain |
| **Cart not saving** | Enable localStorage in browser |

---

## 📚 Database Schema

### Users Table
```sql
id (UUID, Primary Key)
email (VARCHAR, UNIQUE)
password_hash (VARCHAR)
name (VARCHAR)
created_at (TIMESTAMP)
```

### Products Table
```sql
id (UUID, Primary Key)
name (VARCHAR)
description (TEXT)
price (DECIMAL)
category (VARCHAR)
image_url (TEXT)
stock (INTEGER)
created_at (TIMESTAMP)
```

### Orders Table
```sql
id (UUID, Primary Key)
user_id (UUID, Foreign Key)
total_amount (DECIMAL)
shipping_address (TEXT)
status (VARCHAR) - pending, processing, shipped, delivered
created_at (TIMESTAMP)
```

### Order Items Table
```sql
id (UUID, Primary Key)
order_id (UUID, Foreign Key)
product_id (UUID, Foreign Key)
quantity (INTEGER)
price (DECIMAL)
```

---

## 🔗 Useful Links

- **Supabase Dashboard:** https://app.supabase.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Express Docs:** https://expressjs.com
- **Supabase Docs:** https://supabase.com/docs
- **MDN JavaScript:** https://developer.mozilla.org

---

## 💡 Pro Tips

1. **Generate Strong JWT Secret:**
   ```bash
   openssl rand -base64 32
   ```

2. **Test API in Browser Console:**
   ```javascript
   // Get products
   fetch('/api/products').then(r => r.json()).then(console.log)
   
   // Check auth state
   console.log(auth.getUser())
   
   // View cart
   console.log(cart.getItems())
   ```

3. **Debug Network Requests:**
   - Open Developer Tools (F12)
   - Network tab
   - Check request/response

4. **Performance:**
   - Products grid: ~250 items before optimization needed
   - Cart: localStorage limit ~5MB
   - Database: Supabase free tier: 500MB

---

## 🎓 Learning Resources

- **Understand modules:** `public/js/` contains well-commented code
- **API structure:** `api/routes/` shows REST patterns
- **Database:** See SQL schema setup in SETUP_GUIDE.md
- **Deployment:** vercel.json shows how Vercel configs work

---

## ✅ Checklist

Before going live:

- [ ] Create database tables (SQL in SETUP_GUIDE.md)
- [ ] Add sample products
- [ ] Test registration/login
- [ ] Test product search
- [ ] Test cart functionality
- [ ] Test checkout flow
- [ ] Set strong JWT_SECRET
- [ ] Configure Vercel env variables
- [ ] Test production deployment
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS (Vercel automatic)
- [ ] Set up email notifications (optional)

---

## 🤝 Contributing

This codebase is structured for:
- ✅ Easy to debug (clear separation of concerns)
- ✅ Easy to extend (modular components)
- ✅ Easy to scale (add more routes/tables)
- ✅ Easy to deploy (Vercel ready)

---

## 📞 Support

- **Server issues?** Check `api/server.js` console logs
- **Frontend issues?** Open DevTools (F12) → Console
- **Database issues?** Check Supabase dashboard
- **Deployment issues?** Check Vercel deployment logs

---

**🎉 Your ecommerce platform is ready! Start building!**
