# 🧪 Testing Guide — UCW App

## Server Status ✅

- **Laravel Server**: http://127.0.0.1:8000
- **Vite Dev Server**: Running (auto-reload enabled)
- **Database**: PostgreSQL (ucw_app) — Fresh migration + seeded with demo data

---

## 📋 Test Credentials

### Admin Account
```
Username: admin
Password: password123
Role: Admin
```

### Staff Accounts
```
Username: staff1
Password: password123
Role: Staff

Username: staff2
Password: password123
Role: Staff

Username: staff3
Password: password123
Role: Staff
```

---

## 🧪 Testing Scenarios

### 1️⃣ Admin Login & Dashboard

**URL**: http://127.0.0.1:8000/admin/login

**Steps**:
1. Buka URL di atas
2. Masukkan username: `admin`
3. Masukkan password: `password123`
4. Klik "Login Access"

**Expected Results**:
- ✅ Login berhasil
- ✅ Redirect ke `/admin/overview`
- ✅ Tampil Admin Dashboard dengan:
  - Morning Overview greeting
  - 3 StatCards (Total Orders, Daily Revenue, Active Queue)
  - Weekly Sales Trends chart placeholder
  - Peak Roasting Hours visualization
  - Hottest Sellers list
  - Active Staff Activity section
  - Loyalty Insights card

**Test Points**:
- [ ] Form validation (try empty fields)
- [ ] Invalid credentials (wrong password)
- [ ] Remember me checkbox
- [ ] Logout button (top right)
- [ ] Responsive design (test on mobile)

---

### 2️⃣ Staff Login & Dashboard

**URL**: http://127.0.0.1:8000/staff/login

**Steps**:
1. Buka URL di atas
2. Masukkan username: `staff1` (atau staff2/staff3)
3. Masukkan password: `password123`
4. Klik "Login to System"

**Expected Results**:
- ✅ Login berhasil
- ✅ Redirect ke `/staff/dashboard`
- ✅ Tampil Staff Dashboard dengan:
  - Kanban board layout (Pending, Processing, Completed)
  - Order cards dengan customer info
  - Order status badges
  - Payment status indicators

**Test Points**:
- [ ] Form validation
- [ ] Invalid credentials
- [ ] Remember me checkbox
- [ ] Logout button
- [ ] Tab switching (Pending → Processing → Completed)

---

### 3️⃣ Customer Flow (QR Scan)

**URL**: http://127.0.0.1:8000/order/T01

**Steps**:
1. Buka URL di atas (T01 adalah table ID dari QR code)
2. Lihat Landing page dengan UCW branding
3. Klik "Start Ordering"

**Expected Results**:
- ✅ Landing page tampil dengan:
  - UCW branding
  - Coffee mood background image
  - "Start Ordering" button
  - Table number display (T01)

**Test Points**:
- [ ] Landing page loads correctly
- [ ] Navigation to menu works
- [ ] Responsive design

---

### 4️⃣ Customer Menu Page

**URL**: http://127.0.0.1:8000/order/T01/menu

**Steps**:
1. Dari landing page, klik "Start Ordering"
2. Atau akses URL langsung

**Expected Results**:
- ✅ Menu page tampil dengan:
  - Category filter (All, Espresso, Cold Brews, Botanicals, Bakery)
  - Menu items dengan:
    - Product image
    - Product name & subtitle
    - Price (Rp format)
    - Popular badge (jika applicable)
    - Availability status
  - Search functionality
  - Add to cart button

**Test Points**:
- [ ] Category filtering works
- [ ] Menu items display correctly
- [ ] Images load properly
- [ ] Price formatting (Rp)
- [ ] Add to cart functionality
- [ ] Unavailable items show disabled state

---

### 5️⃣ Customer Cart

**URL**: http://127.0.0.1:8000/order/T01/cart

**Steps**:
1. Dari menu page, tambahkan beberapa items
2. Klik cart icon atau akses URL langsung

**Expected Results**:
- ✅ Cart page tampil dengan:
  - List of added items
  - Quantity controls
  - Item subtotal
  - Total price calculation
  - Proceed to checkout button

**Test Points**:
- [ ] Items display correctly
- [ ] Quantity can be changed
- [ ] Total price updates
- [ ] Remove item works
- [ ] Empty cart state

---

### 6️⃣ Order Type Selection

**URL**: http://127.0.0.1:8000/order/T01/order-type

**Steps**:
1. Dari cart, klik "Proceed"
2. Atau akses URL langsung

**Expected Results**:
- ✅ Order type page tampil dengan:
  - Dine-in option
  - Takeaway option
  - Selection UI

**Test Points**:
- [ ] Both options selectable
- [ ] Selection persists
- [ ] Navigation to next step works

---

### 7️⃣ Payment Method Selection

**URL**: http://127.0.0.1:8000/order/T01/payment

**Steps**:
1. Dari order type, lanjutkan
2. Atau akses URL langsung

**Expected Results**:
- ✅ Payment page tampil dengan:
  - Online payment option (Midtrans)
  - Cash payment option
  - Total amount display

**Test Points**:
- [ ] Both payment methods selectable
- [ ] Amount displays correctly
- [ ] Navigation works

---

### 8️⃣ Order Status Tracking

**URL**: http://127.0.0.1:8000/order/T01/status/1

**Steps**:
1. Setelah order dibuat, akses URL dengan order ID
2. Atau dari order confirmation page

**Expected Results**:
- ✅ Order status page tampil dengan:
  - Current order status (Pending/Processing/Completed)
  - Estimated serve time
  - Order items list
  - Real-time status updates (jika Reverb connected)

**Test Points**:
- [ ] Status displays correctly
- [ ] Estimated time shows
- [ ] Items list complete
- [ ] Real-time updates work (if Reverb running)

---

## 🔐 Access Control Tests

### Admin-Only Routes
```
GET /admin/login → ✅ Public
GET /admin/overview → ✅ Requires admin role
GET /admin/analytics → ✅ Requires admin role
GET /admin/menu → ✅ Requires admin role
GET /admin/staff → ✅ Requires admin role
```

**Test**:
1. Login as staff
2. Try to access `/admin/overview`
3. Should redirect to `/staff/login`

### Staff-Only Routes
```
GET /staff/login → ✅ Public
GET /staff/dashboard → ✅ Requires staff role
GET /staff/transactions → ✅ Requires staff role
```

**Test**:
1. Login as admin
2. Try to access `/staff/dashboard`
3. Should redirect to `/admin/login`

---

## 🐛 Common Issues & Solutions

### Issue: "Ziggy error: 'tableId' parameter is required"
**Solution**: Ensure you're accessing customer routes with tableId parameter
```
✅ Correct: /order/T01/menu
❌ Wrong: /order/menu
```

### Issue: Login page not loading
**Solution**: 
1. Check if Laravel server is running: `php artisan serve`
2. Check if Vite dev server is running: `npm run dev`
3. Clear browser cache (Ctrl+Shift+Delete)

### Issue: Styles not loading
**Solution**:
1. Ensure Vite dev server is running
2. Check browser console for errors
3. Try hard refresh (Ctrl+Shift+R)

### Issue: Database connection error
**Solution**:
1. Verify PostgreSQL is running
2. Check `.env` database credentials
3. Run `php artisan migrate:fresh --seed` again

---

## 📊 Database Seeded Data

### Users
- 1 Admin account (admin/password123)
- 3 Staff accounts (staff1/staff2/staff3 with password123)

### Menu
- 5 Categories (Espresso, Cold Brews, Botanicals, Bakery, Pastries)
- 17 Menu items with images and pricing

### Tables
- 10 Tables (T01-T10) for dine-in service

### System Config
- Default system configurations

---

## 🚀 Next Steps After Testing

1. **Test Midtrans Integration**
   - Configure MIDTRANS_SERVER_KEY and MIDTRANS_CLIENT_KEY in .env
   - Test online payment flow

2. **Test Realtime Features**
   - Start Laravel Reverb: `php artisan reverb:start`
   - Test order status updates in real-time

3. **Test AI Service**
   - Start FastAPI service on port 8000
   - Test menu popularity predictions
   - Test sentiment analysis on reviews

4. **Performance Testing**
   - Load test with multiple concurrent users
   - Monitor database query performance
   - Check API response times

---

## 📝 Notes

- All test data is seeded fresh on each `migrate:fresh --seed`
- Customer sessions are stored in database (SESSION_DRIVER=database)
- Realtime features require Laravel Reverb to be running
- AI features require FastAPI service on port 8000

---

**Last Updated**: May 13, 2026
**Status**: Ready for Testing ✅
