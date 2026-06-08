# Progress Checkpoint — UCW App Frontend

## Last Updated: [2026-06-08 19:25:00]

## Model
- Model sebelumnya : Claude Sonnet 4.6 — quota habis 2x
- Model aktif baru : Gemini 3.1 Pro (Low)

---

## BACKEND PROGRESS (Branch: features/backend-database)
- [x] Database Schema & Models
- [x] Backend Services & Events
- [x] Staff Dashboard Implementation (Backend)
- [x] Controller Fixes

---

## ISSUE AKTIF

### ISSUE #1 — Blade Template Tidak Render (PRIORITY SEKARANG)
Error  : Browser tampilkan teks literal "@routes"
URL    : http://127.0.0.1:8000/order/T01
Cause  : app.blade.php kemungkinan tidak lengkap/rusak
Fix    :
  1. Cek & perbaiki resources/views/app.blade.php
  2. Pastikan route /order/{table} return Inertia::render()
  3. php artisan config:clear && view:clear && route:clear
  4. Restart php artisan serve + npm run dev
Status : [x] Resolved (Ziggy & ziggy-js sudah terinstall, cache sudah dibersihkan)

### ISSUE #2 — Build Verification
Status : npm run dev sudah berjalan ✓
         Tapi halaman belum render karena Issue #1
         
### ISSUE #3 — MCP Error
Status : [ ] Belum dicek

---

## PHASE 0 — SELESAI ✅
- [x] Scaffold Laravel 11
- [x] Inertia.js v2
- [x] React 18 + TypeScript
- [x] Tailwind CSS
- [x] Laravel Reverb
- [x] Base layout & routing
- [x] npm run dev berjalan ✓

## PHASE 1 — Customer App — SELESAI ✅ (render belum verified)
- [x] types/customer.ts
- [x] CustomerLayout.tsx
- [x] Landing.tsx
- [x] Menu.tsx
- [x] Cart.tsx
- [x] OrderType.tsx
- [x] Estimate.tsx
- [x] ChoosePayment.tsx
- [x] OnlinePayment.tsx
- [x] CashConfirmation.tsx
- [x] OrderStatus.tsx
- [x] OrderReady.tsx
- [x] Feedback.tsx

## PHASE 2 — Staff Dashboard — SELESAI ✅
- [x] types/staff.ts
- [x] StaffLayout.tsx
- [x] Staff/Login.tsx
- [x] Staff/Dashboard.tsx
- [x] Staff/OrderDetailModal.tsx
- [x] Staff/CashPaymentModal.tsx
- [x] Staff/Transactions.tsx

## PHASE 3 — Admin Dashboard — HAMPIR SELESAI 🟡
- [x] types/admin.ts
- [x] AdminLayout.tsx
- [x] Admin/Login.tsx
- [x] Admin/Overview.tsx (sebelumnya Dashboard)
- [x] Admin/LiveOrder.tsx (sebelumnya Operational)
- [x] Admin/Menu/Index.tsx
- [x] Admin/Staff/Index.tsx
- [x] Admin/Finances.tsx
- [x] Admin/AIAnalytics.tsx
- [ ] Admin/Settings.tsx

## PHASE 4 — AI Module — IN PROGRESS ⏳
- [x] git checkout feature/ai-module
- [x] Buat struktur folder ai_service/ dengan sub-folder
- [x] Copy semua .pkl dan .json dari CP_UCW_app ke saved_models/
- [x] Buat requirements.txt — pastikan scikit-learn==1.5.1
- [x] pip install -r requirements.txt
- [x] Buat config.py + database.py
- [x] Buat schemas/schemas.py
- [x] Buat routers/estimation.py
- [x] Buat routers/sentiment.py
- [x] Buat routers/menu.py
- [x] Buat main.py
- [x] uvicorn main:app --port 8001 berhasil jalan
- [x] Test /health, /api/estimation/predict, /api/sentiment/analyze
- [x] Tambah AI_SERVICE_URL=http://localhost:8001 ke .env Laravel
- [x] Update AiService.php — sesuaikan format request/response
- [x] Merge ke develop
- [x] Test dari Laravel: AnalyticsController → AiService → FastAPI
- [x] **[BUGFIX]** Upgrade pydantic ke >=2.9.2 untuk kompatibilitas Python 3.13
- [x] **[BUGFIX]** Fix URL route `/customer/api/estimate` di `Estimate.tsx`
- [x] **[BUGFIX]** Fix pemetaan response `estimated_min_time` dan `estimated_max_time` di `AiService.php`
- [ ] Tambahkan WMA training notebook (menu populer) — menyusul

---

## ISSUE SELESAI HARI INI ✅
- Menghapus direktori `ai-service` ganda sisa merge conflict.
- Menyelesaikan masalah _incompatibility_ pustaka FastAPI & Pydantic dengan versi Python 3.13 milik user dengan melakukan upgrade library.
- Memperbaiki komunikasi Frontend-Backend terkait AI (URL Route API Estimate 405 Method Not Allowed).
- Memperbaiki pengiriman parameter `range_min` dan `range_max` yang terputus dari _FastAPI_ ke _React_ yang menyebabkan AI selalu menampilkan estimasi 10-15 menit statis.
- Memperbaiki *Method Not Allowed* pada manajemen staf dan menyatukan `AddAdminModal.tsx` menjadi `AddUserModal.tsx`.
- Menghubungkan halaman dasbor `Finances.tsx` milik Admin dengan data dinamis dan fitur *Export CSV*.
- Menghubungkan dasbor `AIAnalytics.tsx` Admin dengan integrasi modul kecerdasan buatan (*FastAPI*) sesungguhnya.
- Menghubungkan dasbor `Overview.tsx` Admin dengan matriks mingguan dan data riil.
- Mengintegrasikan fitur pencarian, lencana warna, dan *Export CSV* untuk `Transactions.tsx` di sisi Staf.
- **[BUGFIX]** Memperbaiki penolakan pengiriman *feedback* pelanggan dengan memindahkan *endpoint* ke rutinitas *order completed*.
- **[BUGFIX]** Memperbaiki *Live Order Dashboard* yang menyebabkan pesanan dengan pembayaran tunai (*cash*) menghilang setelah dikonfirmasi; kini pesanan tetap muncul di kolom *Incoming*.
- **[BUGFIX]** Memperbaiki *listener* WebSocket (Laravel Echo) pada antarmuka pelanggan agar cocok dengan *payload* *backend*, sehingga *timer* dan status benar-benar *real-time*.
- **[BUGFIX]** Mengatasi _error_ `Cannot read properties of undefined (reading 'post')` saat pelanggan menekan bintang rating di halaman _Feedback_ akibat pustaka _axios_ yang belum didefinisikan secara global.
- **[BUGFIX]** Memperbaiki _AI Sentiment Analytics_ (grafik stagnan 0% dan rating hilang) dengan mengatasi _mismatch_ kunci JSON (`sentimen` vs `sentiment_label`) antara _FastAPI_ dan Laravel.
- **[BUGFIX]** Memetakan kembali output _query_ statistik bahasa Indonesia dari _FastAPI_ ke dalam ENUM standar _database_ PostgreSQL (`positive`, `neutral`, `negative`) agar dasbor analitik kembali berjalan normal.

## TUGAS SELANJUTNYA
- Testing integrasi seluruhnya dan persiapan Deployment.
- Mengerjakan modul Settings (Konfigurasi Sistem) Admin.
