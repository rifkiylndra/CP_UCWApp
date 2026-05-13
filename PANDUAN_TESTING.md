# 🧪 Panduan Testing — UCW App

**Status**: ✅ Siap untuk Testing  
**Tanggal**: 13 Mei 2026  
**Branch**: `feature/backend-api`

---

## 🚀 Setup Cepat (30 Detik)

### 1. Reset Database dengan Data Demo
```bash
php artisan migrate:fresh --seed
```

### 2. Jalankan Laravel Server (Terminal 1)
```bash
php artisan serve
```
Akses di: **http://127.0.0.1:8000**

### 3. Jalankan Vite Dev Server (Terminal 2)
```bash
npm run dev
```

**Selesai!** Aplikasi siap di-test.

---

## 🔑 Akun Testing

### Admin
```
Username: admin
Password: password123
```

### Staff (Pilih salah satu)
```
Username: staff1
Password: password123

Username: staff2
Password: password123

Username: staff3
Password: password123
```

### Customer
```
Tidak perlu login
Akses via QR: /order/T01 (atau T02-T10)
```

---

## 📋 Skenario Testing

### 1️⃣ Test Login Admin

**URL**: http://127.0.0.1:8000/admin/login

**Langkah**:
1. Buka URL di atas
2. Masukkan username: `admin`
3. Masukkan password: `password123`
4. Klik tombol "Login Access"

**Yang Diharapkan**:
- ✅ Login berhasil
- ✅ Redirect ke `/admin/overview`
- ✅ Tampil dashboard admin dengan:
  - Greeting "Morning Overview"
  - 3 kartu statistik (Total Orders, Daily Revenue, Active Queue)
  - Grafik Weekly Sales Trends
  - Visualisasi Peak Roasting Hours
  - Daftar Hottest Sellers
  - Bagian Active Staff Activity
  - Kartu Loyalty Insights

**Test Tambahan**:
- [ ] Coba login dengan password salah → Harus tampil error
- [ ] Coba login dengan field kosong → Harus tampil error
- [ ] Centang "Remember me" → Harus tersimpan
- [ ] Klik logout → Harus kembali ke login page

---

### 2️⃣ Test Login Staff

**URL**: http://127.0.0.1:8000/staff/login

**Langkah**:
1. Buka URL di atas
2. Masukkan username: `staff1`
3. Masukkan password: `password123`
4. Klik tombol "Login to System"

**Yang Diharapkan**:
- ✅ Login berhasil
- ✅ Redirect ke `/staff/dashboard`
- ✅ Tampil dashboard staff dengan:
  - Kanban board dengan 3 kolom (Pending, Processing, Completed)
  - Kartu order dengan info customer
  - Status badge untuk setiap order
  - Payment status indicator

**Test Tambahan**:
- [ ] Coba dengan staff2 dan staff3
- [ ] Coba login dengan password salah
- [ ] Coba login dengan field kosong
- [ ] Klik logout

---

### 3️⃣ Test Customer Landing Page

**URL**: http://127.0.0.1:8000/order/T01

**Langkah**:
1. Buka URL di atas
2. Lihat landing page

**Yang Diharapkan**:
- ✅ Tampil halaman landing dengan:
  - Branding UCW
  - Background image kopi
  - Tombol "Start Ordering"
  - Nomor meja (T01)

**Test Tambahan**:
- [ ] Klik "Start Ordering" → Harus ke menu page
- [ ] Coba dengan table ID berbeda (T02, T03, dst)
- [ ] Test responsive design (buka F12, toggle device toolbar)

---

### 4️⃣ Test Customer Menu Page

**URL**: http://127.0.0.1:8000/order/T01/menu

**Langkah**:
1. Dari landing page, klik "Start Ordering"
2. Atau akses URL langsung

**Yang Diharapkan**:
- ✅ Tampil menu page dengan:
  - Filter kategori (All, Espresso, Cold Brews, Botanicals, Bakery)
  - Daftar menu items dengan:
    - Gambar produk
    - Nama produk
    - Harga dalam format Rp
    - Badge "Popular" (jika applicable)
    - Status ketersediaan
  - Tombol "Add to Cart"

**Test Tambahan**:
- [ ] Klik kategori berbeda → Filter harus bekerja
- [ ] Cari produk → Search harus bekerja
- [ ] Klik "Add to Cart" → Item harus masuk ke cart
- [ ] Lihat cart icon → Harus tampil jumlah item

---

### 5️⃣ Test Customer Cart

**URL**: http://127.0.0.1:8000/order/T01/cart

**Langkah**:
1. Dari menu page, tambahkan beberapa items
2. Klik cart icon atau akses URL langsung

**Yang Diharapkan**:
- ✅ Tampil cart page dengan:
  - Daftar items yang ditambahkan
  - Kontrol quantity (+ dan -)
  - Subtotal per item
  - Total harga keseluruhan
  - Tombol "Proceed to Checkout"

**Test Tambahan**:
- [ ] Ubah quantity → Total harus update
- [ ] Hapus item → Item harus hilang dari cart
- [ ] Cart kosong → Harus tampil pesan "Cart is empty"
- [ ] Klik "Proceed" → Harus ke order type page

---

### 6️⃣ Test Order Type Selection

**URL**: http://127.0.0.1:8000/order/T01/order-type

**Langkah**:
1. Dari cart, klik "Proceed"
2. Atau akses URL langsung

**Yang Diharapkan**:
- ✅ Tampil pilihan order type:
  - Dine-in (makan di tempat)
  - Takeaway (bawa pulang)

**Test Tambahan**:
- [ ] Pilih Dine-in → Harus tersimpan
- [ ] Pilih Takeaway → Harus tersimpan
- [ ] Klik "Next" → Harus ke payment page

---

### 7️⃣ Test Payment Method Selection

**URL**: http://127.0.0.1:8000/order/T01/payment

**Langkah**:
1. Dari order type, lanjutkan
2. Atau akses URL langsung

**Yang Diharapkan**:
- ✅ Tampil pilihan payment method:
  - Online Payment (Midtrans)
  - Cash Payment
  - Total amount display

**Test Tambahan**:
- [ ] Pilih Online Payment → Harus tersimpan
- [ ] Pilih Cash Payment → Harus tersimpan
- [ ] Jumlah harus sesuai dengan cart total

---

### 8️⃣ Test Order Status Tracking

**URL**: http://127.0.0.1:8000/order/T01/status/1

**Langkah**:
1. Setelah order dibuat, akses URL dengan order ID
2. Atau dari order confirmation page

**Yang Diharapkan**:
- ✅ Tampil order status page dengan:
  - Status pesanan (Pending/Processing/Completed)
  - Estimated serve time
  - Daftar items yang dipesan
  - Detail order

**Test Tambahan**:
- [ ] Status harus sesuai dengan order
- [ ] Items harus lengkap
- [ ] Estimated time harus ditampilkan

---

## 🔐 Test Access Control

### Test 1: Admin Akses Staff Route
1. Login sebagai admin
2. Coba akses `/staff/dashboard`
3. **Harapan**: Redirect ke `/admin/login`

### Test 2: Staff Akses Admin Route
1. Login sebagai staff
2. Coba akses `/admin/overview`
3. **Harapan**: Redirect ke `/staff/login`

### Test 3: Tanpa Login Akses Protected Route
1. Logout atau buka incognito
2. Coba akses `/admin/overview`
3. **Harapan**: Redirect ke `/admin/login`

---

## 📱 Test Responsive Design

### Mobile (430px)
1. Buka F12 (Developer Tools)
2. Klik "Toggle device toolbar" (Ctrl+Shift+M)
3. Pilih iPhone 12 atau device mobile lainnya
4. Test semua halaman:
   - [ ] Admin login page
   - [ ] Admin dashboard
   - [ ] Staff login page
   - [ ] Staff dashboard
   - [ ] Customer landing
   - [ ] Customer menu
   - [ ] Customer cart

**Yang Diharapkan**:
- ✅ Tidak ada horizontal scroll
- ✅ Semua tombol bisa diklik
- ✅ Text readable
- ✅ Layout menyesuaikan

### Tablet (768px)
1. Pilih iPad atau tablet lainnya
2. Test semua halaman
3. **Harapan**: Layout menyesuaikan dengan baik

### Desktop (1024px+)
1. Buka di browser normal
2. Test semua halaman
3. **Harapan**: Full layout tampil dengan sempurna

---

## 🎨 Test Design Consistency

### Warna
- [ ] Primary color: #1A1208 (coklat gelap)
- [ ] Accent color: #C8A96E (emas kopi)
- [ ] Background: #F5F3F0 (krem terang)

### Typography
- [ ] Heading: Font bold, ukuran besar
- [ ] Body: Font regular, readable
- [ ] Labels: Font bold, ukuran kecil

### Spacing
- [ ] Padding konsisten di semua card
- [ ] Margin konsisten antar section
- [ ] Border radius: 24px untuk card

---

## 🐛 Troubleshooting

### Error: "Cannot GET /admin/login"
**Solusi**: Pastikan Laravel server running
```bash
php artisan serve
```

### Error: Styles tidak loading (halaman berantakan)
**Solusi**: Pastikan Vite dev server running
```bash
npm run dev
```

### Error: "SQLSTATE[08006]" (Database error)
**Solusi**: 
1. Pastikan PostgreSQL running
2. Check `.env` database credentials
3. Run: `php artisan migrate:fresh --seed`

### Error: "Ziggy error: 'tableId' parameter is required"
**Solusi**: Gunakan URL format yang benar
```
✅ Benar: /order/T01/menu
❌ Salah: /order/menu
```

### Halaman blank atau error
**Solusi**:
1. Buka browser console (F12)
2. Lihat error message
3. Hard refresh (Ctrl+Shift+R)
4. Clear cache browser

---

## 📊 Checklist Testing

### Admin Testing
- [ ] Login berhasil
- [ ] Dashboard tampil dengan benar
- [ ] Semua stat cards tampil
- [ ] Grafik dan visualisasi tampil
- [ ] Staff activity section tampil
- [ ] Logout berhasil
- [ ] Responsive design OK

### Staff Testing
- [ ] Login berhasil
- [ ] Dashboard tampil dengan benar
- [ ] Kanban board tampil
- [ ] Order cards tampil
- [ ] Tab switching bekerja
- [ ] Logout berhasil
- [ ] Responsive design OK

### Customer Testing
- [ ] Landing page tampil
- [ ] Menu page tampil
- [ ] Category filter bekerja
- [ ] Add to cart bekerja
- [ ] Cart page tampil
- [ ] Order type selection bekerja
- [ ] Payment selection bekerja
- [ ] Order status tracking bekerja
- [ ] Responsive design OK

### Access Control Testing
- [ ] Admin tidak bisa akses staff route
- [ ] Staff tidak bisa akses admin route
- [ ] Tanpa login tidak bisa akses protected route
- [ ] Redirect bekerja dengan benar

### Form Validation Testing
- [ ] Login dengan field kosong → Error
- [ ] Login dengan password salah → Error
- [ ] Error message jelas dan helpful

---

## 📝 Catatan Testing

### Issues Ditemukan
1. Issue: _______________
   - Severity: High/Medium/Low
   - Steps: _______________
   - Expected: _______________
   - Actual: _______________

2. Issue: _______________
   - Severity: High/Medium/Low
   - Steps: _______________
   - Expected: _______________
   - Actual: _______________

### Observations
- _______________
- _______________
- _______________

---

## ✅ Sign-Off

- **Tested By**: _______________
- **Date**: _______________
- **Overall Status**: [ ] Pass [ ] Fail
- **Ready for Next Phase**: [ ] Yes [ ] No

---

## 📚 Dokumentasi Lainnya

- **QUICK_START.md** - Setup cepat
- **TESTING_GUIDE.md** - Panduan testing detail (English)
- **TESTING_CHECKLIST.md** - Checklist lengkap (English)
- **STATUS.md** - Status project
- **AGENTS.md** - Project rules

---

**Selamat Testing! 🎉**

Jika ada pertanyaan atau issues, silakan buat issue di GitHub atau hubungi tim development.
