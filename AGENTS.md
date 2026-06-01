# AGENTS.md

# Unand Co-Workspace — Coffee Shop Management System

# Baca file ini sebelum mengerjakan task apapun di project ini.

---

## Identitas Project

Nama sistem : Sistem Manajemen Coffee Shop Unand Co-Workspace
Jenis : Web application berbasis QR Ordering + AI Analytics
Institusi : Universitas Andalas — Program Studi Informatika
Dokumen ref : CP300-TA2026.08.00X (tersedia di /docs/CP300.pdf)

---

## Tech Stack — TIDAK BOLEH DIGANTI TANPA KONFIRMASI

| Layer      | Teknologi                       |
| ---------- | ------------------------------- |
| Backend    | Laravel 12                      |
| Bridge     | Inertia.js v2                   |
| Frontend   | React 18 (functional component) |
| Styling    | Tailwind CSS                    |
| Realtime   | Laravel Reverb + Laravel Echo   |
| AI Service | Python FastAPI (port 8000)      |
| Database   | PostgreSQL                      |
| Payment    | Midtrans (Snap.js)              |
| Auth       | Laravel Breeze (multi-role)     |

---

## Aturan Penulisan Kode — WAJIB DIIKUTI

### React / Frontend

- Selalu gunakan functional component + hooks
- Tidak boleh ada class component
- TypeScript props interface wajib untuk setiap komponen
- Gunakan Inertia `<Link>` bukan `<a>` untuk navigasi internal
- Gunakan Inertia `router.post/put/delete` bukan fetch untuk form
- Fetch ke FastAPI boleh gunakan native fetch() atau axios
- Tidak boleh ada inline style — murni Tailwind CSS
- Komponen reusable taruh di /Components, halaman di /Pages

### Laravel / Backend

- Gunakan Service class untuk business logic
  (jangan taruh logic di Controller)
- Gunakan Form Request untuk semua validasi input
- Gunakan Resource untuk transformasi JSON response
- Gunakan Event + Listener untuk semua operasi yang perlu broadcast
- Gunakan Queue untuk operasi berat (send email, AI processing)
- Tidak boleh ada raw SQL — gunakan Eloquent atau Query Builder

### Penamaan

- File React : PascalCase.jsx (MenuCard.jsx)
- File Laravel : PascalCase.php (OrderService.php)
- Route name : snake_case dengan prefix role
  (customer.menu, staff.dashboard, admin.analytics)
- Event name : PascalCase (NewOrderPlaced, OrderStatusUpdated)
- DB kolom : snake_case (order_status, payment_method)

---

## Struktur Folder — TIDAK BOLEH DIUBAH

### Frontend (resources/js/)

Pages/
├── Customer/ → Landing, Menu, Cart, OrderType, PreEstimation,
│ Payment, PaymentOnline, OrderStatus,
│ OrderDone, Feedback
├── Staff/ → Login, Dashboard, Transactions
└── Admin/ → Login, Dashboard, Operational, Menu,
Staff, Finance, Analytics, Settings
Components/
├── Customer/ → MenuCard, CategoryFilter, SearchBar,
│ CartItem, OrderStatusCard, BottomNavigation
├── Staff/ → OrderKanbanColumn, OrderCard,
│ OrderDetailModal, PaymentVerifyModal
├── Admin/ → MetricCard, SidebarNav, MenuTable,
│ StaffTable, AnalyticsChart
└── Shared/ → LoadingSkeleton, EmptyState, NotificationBell

### Backend (app/)

Http/Controllers/
├── Customer/ → MenuController, OrderController, ReviewController
├── Staff/ → DashboardController, OrderController, PaymentController
└── Admin/ → DashboardController, MenuController, StaffController,
AnalyticsController, ReportController
Services/ → OrderService, PaymentService, AiService
Events/ → NewOrderPlaced, OrderStatusUpdated, PaymentStatusUpdated
Listeners/ → BroadcastNewOrder, BroadcastStatusUpdate

---

## Role & Akses

| Role     | Login | Route Prefix | Middleware       |
| -------- | ----- | ------------ | ---------------- |
| Admin    | Ya    | /admin       | auth, role:admin |
| Staff    | Ya    | /staff       | auth, role:staff |
| Customer | Tidak | /            | -                |

Customer diidentifikasi via session (table_number dari QR scan).
Tidak ada registrasi customer — langsung akses via QR.

---

## Aktor & Use Case Utama

### Customer (tanpa login)

UC-01 Akses menu via QR code
UC-02 Buat pesanan (dine-in / takeaway)
UC-02 Pembayaran (Midtrans atau tunai)
UC-03 Pantau status pesanan realtime
UC-07 Submit review setelah pesanan selesai

### Staff (dengan login)

UC-03 Kelola status pesanan (pending→processing→completed)
UC-02 Verifikasi pembayaran tunai
UC-06 Lihat riwayat transaksi harian

### Admin (dengan login)

UC-04 CRUD menu & kategori
UC-05 Kelola akun Staff
UC-06 Monitoring pesanan & laporan keuangan
UC-08 Dashboard AI Analytics
UC-09 Konfigurasi sistem (metode pembayaran, notifikasi)

---

## Modul AI (FastAPI — port 8000)

### Endpoint yang tersedia:

GET /api/estimation/predict → MLR: estimasi waktu penyajian
GET /api/estimation/performance → MLR: performa model
GET /api/menu/popular → WMA: ranking menu populer
POST /api/sentiment/analyze → Naive Bayes: analisis 1 review
GET /api/sentiment/summary → distribusi sentimen keseluruhan

### Cara panggil dari Laravel (AiService.php):

Http::get('http://localhost:8000/api/...')

### Cara panggil dari React (hanya untuk display):

fetch('/api/ai/...') → lewat Laravel proxy, bukan langsung ke FastAPI

---

## Realtime Events

| Event                | Channel         | Listener di          |
| -------------------- | --------------- | -------------------- |
| NewOrderPlaced       | staff-orders    | Staff/Dashboard.jsx  |
| OrderStatusUpdated   | order.{orderId} | Customer/OrderStatus |
| PaymentStatusUpdated | order.{orderId} | Customer/OrderStatus |

---

## Desain & UI

Desain sumber : Figma (sudah dikonversi via MCP)
Theme : Dark theme
Primary color : #1A1A1A
Accent color : #C8A96E (coffee gold)
Mobile-first : Customer app max-width 430px
Desktop : Staff & Admin dashboard

---

## Hal yang TIDAK BOLEH Dilakukan AI

- Jangan ganti tech stack tanpa konfirmasi eksplisit
- Jangan buat inline style — gunakan Tailwind
- Jangan buat class component React
- Jangan taruh business logic di Controller
- Jangan panggil FastAPI langsung dari React
  (harus lewat proxy Laravel)
- Jangan hapus atau rename file yang sudah ada
  tanpa konfirmasi
- Jangan generate migration yang merusak
  schema yang sudah ada

---

## Status Project (update manual saat ada progress)

- [x] Konversi desain Figma via MCP
- [ ] Database migration & seeder
- [ ] Authentication multi-role
- [x] Customer flow (order & payment)
- [ ] Staff dashboard realtime
- [ ] Admin dashboard & CRUD
- [ ] Midtrans payment integration
- [ ] Laravel Reverb realtime
- [ ] FastAPI AI microservice
- [ ] Testing & QA
