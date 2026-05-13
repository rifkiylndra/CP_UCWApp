# ✅ Testing Checklist — UCW App

## 🎯 Quick Start

**Servers Running**:
- [ ] Laravel: http://127.0.0.1:8000
- [ ] Vite Dev: Running (auto-reload)
- [ ] Database: PostgreSQL (seeded)

---

## 🔐 Authentication Tests

### Admin Login
- [ ] Navigate to `/admin/login`
- [ ] Enter username: `admin`
- [ ] Enter password: `password123`
- [ ] Click "Login Access"
- [ ] Verify redirect to `/admin/overview`
- [ ] Verify admin name displayed in header
- [ ] Test logout button
- [ ] Test "Remember me" checkbox
- [ ] Test invalid credentials (wrong password)
- [ ] Test empty fields validation

### Staff Login
- [ ] Navigate to `/staff/login`
- [ ] Enter username: `staff1`
- [ ] Enter password: `password123`
- [ ] Click "Login to System"
- [ ] Verify redirect to `/staff/dashboard`
- [ ] Verify staff name displayed
- [ ] Test logout button
- [ ] Test with staff2 and staff3 accounts
- [ ] Test invalid credentials
- [ ] Test empty fields validation

### Access Control
- [ ] Login as admin, try to access `/staff/dashboard` → Should redirect
- [ ] Login as staff, try to access `/admin/overview` → Should redirect
- [ ] Access `/admin/login` without auth → Should show login page
- [ ] Access `/staff/login` without auth → Should show login page

---

## 📊 Admin Dashboard Tests

### Admin Overview Page (`/admin/overview`)
- [ ] Page loads without errors
- [ ] Morning Overview greeting displays
- [ ] StatCards display:
  - [ ] Total Orders card
  - [ ] Daily Revenue card
  - [ ] Active Queue card
- [ ] Weekly Sales Trends section displays
- [ ] Peak Roasting Hours chart displays
- [ ] Hottest Sellers list displays with:
  - [ ] Seller names
  - [ ] Revenue amounts
  - [ ] Ranking numbers
- [ ] Active Staff Activity section displays with:
  - [ ] Staff avatars
  - [ ] Staff names
  - [ ] Staff roles
  - [ ] Online status indicators
- [ ] Loyalty Insights card displays
- [ ] All colors match UCW theme (#1A1208, #C8A96E)
- [ ] Responsive on mobile (max-width: 430px)
- [ ] Responsive on tablet
- [ ] Responsive on desktop

### Admin Navigation
- [ ] Sidebar navigation visible
- [ ] Menu Management link works
- [ ] Staff Management link works
- [ ] Reports link works
- [ ] Analytics link works
- [ ] Logout button works

---

## 👥 Staff Dashboard Tests

### Staff Dashboard Page (`/staff/dashboard`)
- [ ] Page loads without errors
- [ ] Kanban board displays with 3 columns:
  - [ ] Pending column
  - [ ] Processing column
  - [ ] Completed column
- [ ] Order cards display with:
  - [ ] Customer name
  - [ ] Order ID
  - [ ] Order status badge
  - [ ] Payment status badge
  - [ ] Total price
  - [ ] Order time
- [ ] Tab switching works (Pending → Processing → Completed)
- [ ] Order cards are clickable
- [ ] Order detail modal opens
- [ ] Status update buttons work
- [ ] Payment verification works
- [ ] Responsive design on mobile
- [ ] Responsive design on tablet
- [ ] Responsive design on desktop

### Staff Navigation
- [ ] Dashboard link works
- [ ] Transactions link works
- [ ] Logout button works

---

## 🛒 Customer Flow Tests

### Customer Landing Page (`/order/T01`)
- [ ] Page loads without errors
- [ ] UCW branding displays
- [ ] Coffee mood background image loads
- [ ] "Start Ordering" button visible
- [ ] Table number displays (T01)
- [ ] Navigation to menu works
- [ ] Responsive on mobile (max-width: 430px)

### Customer Menu Page (`/order/T01/menu`)
- [ ] Page loads without errors
- [ ] Menu items display with:
  - [ ] Product image
  - [ ] Product name
  - [ ] Product subtitle
  - [ ] Price in Rp format
  - [ ] Popular badge (if applicable)
  - [ ] Availability status
- [ ] Category filter works:
  - [ ] All category
  - [ ] Espresso category
  - [ ] Cold Brews category
  - [ ] Botanicals category
  - [ ] Bakery category
- [ ] Search functionality works
- [ ] Add to cart button works
- [ ] Unavailable items show disabled state
- [ ] Cart icon shows item count
- [ ] Responsive design

### Customer Cart Page (`/order/T01/cart`)
- [ ] Page loads without errors
- [ ] Added items display with:
  - [ ] Product image
  - [ ] Product name
  - [ ] Quantity
  - [ ] Item price
  - [ ] Subtotal
- [ ] Quantity can be increased
- [ ] Quantity can be decreased
- [ ] Remove item button works
- [ ] Total price updates correctly
- [ ] Proceed to checkout button works
- [ ] Empty cart state displays correctly
- [ ] Responsive design

### Customer Order Type Page (`/order/T01/order-type`)
- [ ] Page loads without errors
- [ ] Dine-in option displays
- [ ] Takeaway option displays
- [ ] Selection works
- [ ] Proceed button works
- [ ] Responsive design

### Customer Payment Page (`/order/T01/payment`)
- [ ] Page loads without errors
- [ ] Online payment option displays
- [ ] Cash payment option displays
- [ ] Total amount displays correctly
- [ ] Selection works
- [ ] Proceed button works
- [ ] Responsive design

### Customer Order Status Page (`/order/T01/status/1`)
- [ ] Page loads without errors
- [ ] Order status displays
- [ ] Estimated serve time displays
- [ ] Order items list displays
- [ ] Order details display correctly
- [ ] Real-time updates work (if Reverb running)
- [ ] Responsive design

---

## 🎨 UI/UX Tests

### Design Consistency
- [ ] All pages use UCW color scheme:
  - [ ] Primary: #1A1208 (dark brown)
  - [ ] Accent: #C8A96E (coffee gold)
  - [ ] Background: #F5F3F0 (light cream)
- [ ] Typography is consistent
- [ ] Spacing is consistent
- [ ] Border radius is consistent (24px for cards)
- [ ] Shadows are consistent

### Responsive Design
- [ ] Mobile (430px max-width):
  - [ ] All pages fit without horizontal scroll
  - [ ] Touch targets are adequate (min 44px)
  - [ ] Text is readable
- [ ] Tablet (768px):
  - [ ] Layout adapts properly
  - [ ] Navigation works
- [ ] Desktop (1024px+):
  - [ ] Full layout displays
  - [ ] Sidebar visible (if applicable)

### Accessibility
- [ ] All buttons have proper labels
- [ ] Form inputs have labels
- [ ] Error messages are clear
- [ ] Color contrast is sufficient
- [ ] Focus states are visible
- [ ] Keyboard navigation works

---

## 🔗 Route Tests

### Public Routes
- [ ] GET `/` → Redirects to `/order/T01`
- [ ] GET `/admin/login` → Shows admin login page
- [ ] GET `/staff/login` → Shows staff login page
- [ ] GET `/order/T01` → Shows customer landing page
- [ ] GET `/order/T01/menu` → Shows menu page

### Protected Routes (Admin)
- [ ] GET `/admin/overview` → Requires admin auth
- [ ] GET `/admin/analytics` → Requires admin auth
- [ ] GET `/admin/menu` → Requires admin auth
- [ ] GET `/admin/staff` → Requires admin auth
- [ ] GET `/admin/reports` → Requires admin auth
- [ ] POST `/admin/logout` → Logs out admin

### Protected Routes (Staff)
- [ ] GET `/staff/dashboard` → Requires staff auth
- [ ] GET `/staff/transactions` → Requires staff auth
- [ ] POST `/staff/logout` → Logs out staff

---

## 🐛 Error Handling Tests

### Form Validation
- [ ] Admin login with empty username → Shows error
- [ ] Admin login with empty password → Shows error
- [ ] Staff login with empty username → Shows error
- [ ] Staff login with empty password → Shows error
- [ ] Invalid credentials → Shows error message

### Database Errors
- [ ] Database connection error → Shows error page
- [ ] Missing data → Shows appropriate message

### Network Errors
- [ ] Slow network → Shows loading state
- [ ] Failed request → Shows error message
- [ ] Timeout → Shows timeout message

---

## 📱 Mobile Testing

### iPhone/Mobile (430px)
- [ ] Admin login page responsive
- [ ] Staff login page responsive
- [ ] Admin dashboard responsive
- [ ] Staff dashboard responsive
- [ ] Customer landing responsive
- [ ] Customer menu responsive
- [ ] Customer cart responsive
- [ ] All buttons clickable on touch
- [ ] No horizontal scroll

### Tablet (768px)
- [ ] All pages display correctly
- [ ] Navigation works
- [ ] Layout adapts properly

---

## 🚀 Performance Tests

### Page Load Times
- [ ] Admin login page loads < 2s
- [ ] Admin dashboard loads < 3s
- [ ] Staff dashboard loads < 3s
- [ ] Customer menu loads < 2s
- [ ] No console errors

### Asset Loading
- [ ] All images load
- [ ] All CSS loads
- [ ] All JavaScript loads
- [ ] No 404 errors in console

---

## 📝 Notes & Issues Found

### Issues
1. [ ] Issue: _______________
   - [ ] Severity: High/Medium/Low
   - [ ] Steps to reproduce: _______________
   - [ ] Expected: _______________
   - [ ] Actual: _______________

2. [ ] Issue: _______________
   - [ ] Severity: High/Medium/Low
   - [ ] Steps to reproduce: _______________
   - [ ] Expected: _______________
   - [ ] Actual: _______________

### Observations
- [ ] _______________
- [ ] _______________
- [ ] _______________

---

## ✅ Sign-Off

- **Tested By**: _______________
- **Date**: _______________
- **Overall Status**: [ ] Pass [ ] Fail
- **Ready for Next Phase**: [ ] Yes [ ] No

---

**Last Updated**: May 13, 2026
