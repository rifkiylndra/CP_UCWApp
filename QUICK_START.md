# 🚀 Quick Start — UCW App Testing

## ⚡ 30-Second Setup

```bash
# 1. Fresh database with demo data
php artisan migrate:fresh --seed

# 2. Start Laravel server (Terminal 1)
php artisan serve

# 3. Start Vite dev server (Terminal 2)
npm run dev
```

**Done!** Aplikasi siap di test di http://127.0.0.1:8000

---

## 🔑 Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `password123` |
| Staff | `staff1` | `password123` |
| Staff | `staff2` | `password123` |
| Staff | `staff3` | `password123` |

---

## 🎯 Test URLs

### Admin
- **Login**: http://127.0.0.1:8000/admin/login
- **Dashboard**: http://127.0.0.1:8000/admin/overview
- **Analytics**: http://127.0.0.1:8000/admin/analytics
- **Menu Management**: http://127.0.0.1:8000/admin/menu
- **Staff Management**: http://127.0.0.1:8000/admin/staff
- **Reports**: http://127.0.0.1:8000/admin/reports

### Staff
- **Login**: http://127.0.0.1:8000/staff/login
- **Dashboard**: http://127.0.0.1:8000/staff/dashboard
- **Transactions**: http://127.0.0.1:8000/staff/transactions

### Customer
- **Landing**: http://127.0.0.1:8000/order/T01
- **Menu**: http://127.0.0.1:8000/order/T01/menu
- **Cart**: http://127.0.0.1:8000/order/T01/cart
- **Order Type**: http://127.0.0.1:8000/order/T01/order-type
- **Payment**: http://127.0.0.1:8000/order/T01/payment
- **Order Status**: http://127.0.0.1:8000/order/T01/status/1

---

## 📋 What to Test

### ✅ Priority 1 (Must Test)
1. **Admin Login** → `/admin/login`
   - Login dengan `admin` / `password123`
   - Verify redirect ke `/admin/overview`
   - Check dashboard displays correctly

2. **Staff Login** → `/staff/login`
   - Login dengan `staff1` / `password123`
   - Verify redirect ke `/staff/dashboard`
   - Check dashboard displays correctly

3. **Customer Flow** → `/order/T01`
   - View landing page
   - Navigate to menu
   - Add items to cart
   - Proceed to checkout

### ✅ Priority 2 (Should Test)
1. **Access Control**
   - Login as staff, try to access admin routes
   - Login as admin, try to access staff routes
   - Verify proper redirects

2. **Form Validation**
   - Try login with empty fields
   - Try login with wrong credentials
   - Verify error messages

3. **Responsive Design**
   - Test on mobile (F12 → Toggle device toolbar)
   - Test on tablet
   - Test on desktop

### ✅ Priority 3 (Nice to Test)
1. **Admin Dashboard Features**
   - Check all stat cards
   - Check charts and visualizations
   - Check staff activity section

2. **Staff Dashboard Features**
   - Check kanban board
   - Check order cards
   - Check status updates

3. **Customer Features**
   - Check category filtering
   - Check search functionality
   - Check cart calculations

---

## 🐛 Common Issues

### "Cannot GET /admin/login"
**Solution**: Make sure Laravel server is running
```bash
php artisan serve
```

### Styles not loading (page looks broken)
**Solution**: Make sure Vite dev server is running
```bash
npm run dev
```

### "SQLSTATE[08006]" (Database error)
**Solution**: Check PostgreSQL is running and credentials are correct in `.env`

### "Ziggy error: 'tableId' parameter is required"
**Solution**: Use correct URL format: `/order/T01/menu` (not `/order/menu`)

---

## 📊 Database Info

**Database**: PostgreSQL
**Name**: `ucw_app`
**User**: `postgres`
**Password**: `PostgreSQL_P`

**Seeded Data**:
- 1 Admin user
- 3 Staff users
- 5 Menu categories
- 17 Menu items
- 10 Tables (T01-T10)

---

## 🔄 Reset Database

Jika ingin reset database ke state awal:

```bash
php artisan migrate:fresh --seed
```

---

## 📝 Documentation

- **Full Testing Guide**: `TESTING_GUIDE.md`
- **Testing Checklist**: `TESTING_CHECKLIST.md`
- **API Specification**: `docs/API_SPEC.md`
- **Project Rules**: `AGENTS.md`

---

## 🎬 Demo Flow

### Admin Demo (5 minutes)
1. Go to `/admin/login`
2. Login with `admin` / `password123`
3. Explore `/admin/overview` dashboard
4. Check stat cards and visualizations
5. Logout

### Staff Demo (5 minutes)
1. Go to `/staff/login`
2. Login with `staff1` / `password123`
3. Explore `/staff/dashboard` kanban board
4. Check order cards
5. Logout

### Customer Demo (5 minutes)
1. Go to `/order/T01`
2. Click "Start Ordering"
3. Browse menu items
4. Add items to cart
5. Proceed through checkout flow

---

## ✨ Features Ready to Test

✅ **Authentication**
- Multi-role login (Admin, Staff)
- Role-based access control
- Session management

✅ **Admin Dashboard**
- Overview with stat cards
- Staff activity monitoring
- Menu and staff management links

✅ **Staff Dashboard**
- Kanban board for order management
- Order status tracking
- Payment verification

✅ **Customer App**
- QR-based table identification
- Menu browsing with categories
- Shopping cart
- Order type selection
- Payment method selection
- Order status tracking

---

## 🚀 Next Phase

After testing is complete:
1. Midtrans payment integration
2. Laravel Reverb realtime updates
3. FastAPI AI service integration
4. Advanced admin analytics

---

**Status**: ✅ Ready for Testing
**Last Updated**: May 13, 2026
