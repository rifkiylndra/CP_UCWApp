# UCW App Project Documentation

## 1. Project Overview

UCW App atau Unand Co-Workspace App adalah aplikasi web untuk manajemen coffee shop/co-working space Unand Co-Workspace. Sistem ini mendukung customer self-ordering berbasis QR, cart dan checkout, estimasi waktu pesanan berbasis AI service, pembayaran cash dan online, staff dashboard untuk operasional order, admin dashboard untuk monitoring/CRUD/laporan, realtime update, dan AI analytics.

Tujuan utama project:

- Mempercepat proses pemesanan tanpa registrasi customer.
- Mengurangi antrian manual di kasir.
- Memberi staff dashboard untuk memproses order dan memverifikasi pembayaran.
- Memberi admin dashboard untuk menu, staff, finance, live order, feedback, dan analytics.
- Mengintegrasikan Pakasir sebagai payment gateway production untuk QRIS dan BRI VA.
- Menyediakan FastAPI AI service untuk estimasi waktu, menu populer, dan analisis sentimen.

Target pengguna:

- Customer: pengunjung coffee shop, tanpa login, diidentifikasi lewat session order.
- Staff: operator/barista/kasir, dengan login role `staff`.
- Admin: pengelola sistem, dengan login role `admin`.
- Developer/maintainer: pihak yang melanjutkan deployment, UAT, dan maintenance.

Status saat dokumentasi ini dibuat:

- Demo: siap.
- UAT: layak diuji.
- Production: perlu final deployment dan production-like UAT.
- Kondisi umum: development utama sudah selesai; fase aktif adalah production preparation, deployment, observability, dan UAT production-like.

Batasan project:

- Pakasir adalah payment gateway aktif untuk production saat ini.
- Midtrans tetap ada di codebase sebagai future/legacy gateway, bukan flow production aktif.
- FastAPI AI service dapat down tanpa menghentikan flow utama karena Laravel memiliki fallback.
- Realtime menggunakan Laravel Reverb/Echo, tetapi UI tetap memiliki polling fallback di area penting.
- Admin Settings masih perlu dipastikan penuh sebelum dipakai production.
- Beberapa inline style frontend masih ada dan menjadi catatan maintainability, bukan blocker runtime.

## 2. Tech Stack Aktual

Sumber verifikasi:

- `composer.json`
- `package.json`
- `.env.example`
- `.env.production.example`
- `docker-compose.yml`
- `config/services.php`
- `config/database.php`
- `config/broadcasting.php`

Stack utama:

| Layer | Teknologi |
| --- | --- |
| Backend | Laravel 12, PHP 8.2+ |
| Bridge | Inertia Laravel + `@inertiajs/react` |
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| Build | Vite 7 |
| Realtime | Laravel Reverb + Laravel Echo + Pusher JS client |
| Database lokal/testing | SQLite dapat digunakan jika env mengarah ke SQLite |
| Database production | PostgreSQL |
| Queue/cache production | Redis sesuai `.env.production.example`; database queue masih tersedia untuk lokal |
| Payment production | Pakasir |
| Future payment gateway | Midtrans |
| AI service | Python FastAPI |
| Chart/export | Recharts, Maatwebsite Excel, CSV streaming |
| Deployment assets | Docker Compose, Nginx, PHP-FPM, Supervisor, AI Dockerfile |

Catatan versi:

- README lama masih menyebut React 18, tetapi `package.json` memakai React 19. Dokumentasi ini mengikuti repository aktual.
- `.env.production.example` mengarahkan production ke PostgreSQL, Redis, Reverb, Pakasir, dan AI service internal Docker.

## 3. System Architecture

Arsitektur aplikasi adalah Laravel monolith dengan frontend Inertia React dan microservice FastAPI terpisah untuk AI.

```text
Customer Browser
    |
    v
Inertia React Frontend
    |
    v
Laravel Backend
    |
    +--> PostgreSQL Database
    +--> Pakasir Payment Gateway
    +--> FastAPI AI Service
    +--> Queue Worker / Scheduler
    |
    v
Realtime Events via Laravel Reverb
    |
    v
Customer, Staff, Admin UI
```

Production target:

```text
Internet
  |
  v
Nginx + SSL
  |
  +--> Laravel PHP-FPM
  |      |
  |      +--> PostgreSQL
  |      +--> Redis
  |      +--> Pakasir HTTPS API/Webhook
  |      +--> FastAPI AI Service
  |
  +--> Reverb WebSocket endpoint
```

Karakteristik arsitektur:

- Laravel menangani routing, auth, role, order, payment, admin, staff, API proxy/fallback, dan broadcast.
- React/Inertia menangani UI customer/staff/admin tanpa API SPA terpisah penuh.
- FastAPI dipakai untuk model AI dan membaca database melalui SQLAlchemy.
- Queue worker dibutuhkan untuk operasi background dan broadcast queued.
- Scheduler sudah tersedia di Docker Compose, tetapi job payment expiry/reconciliation perlu ditambahkan bila production membutuhkan rekonsiliasi otomatis.
- Nginx melayani Laravel public directory dan proxy WebSocket `/app/` ke Reverb.

## 4. Main User Flows

Customer flow:

```text
Landing
  -> Menu
  -> Cart
  -> Order Type
  -> Estimate
  -> Create Order
  -> Choose Payment
  -> QRIS / BRI VA / Cash
  -> Order Status
  -> Feedback
```

Staff flow:

```text
Login
  -> Dashboard Kanban
  -> Verify Cash Payment
  -> Update Order Status
  -> Transactions
  -> Export
```

Admin flow:

```text
Login
  -> Overview
  -> Live Order
  -> Menu / Category Management
  -> Staff/Admin Management
  -> Finance
  -> Feedback
  -> AI Analytics
  -> Settings
```

## 5. Payment Architecture

Payment production aktif adalah Pakasir.

Cash payment:

```text
Customer pilih cash
  -> PaymentService membuat payment waiting_verification
  -> Staff verify amount
  -> Payment paid
  -> Order pending menjadi confirmed
  -> PaymentStatusUpdated / OrderStatusUpdated broadcast
```

Pakasir payment:

```text
Customer pilih QRIS atau BRI VA
  -> Laravel Customer PaymentController
  -> PakasirService create transaction
  -> Payment row disimpan
  -> Customer melihat QR/VA/payment number
  -> Pakasir webhook
  -> Laravel validasi payload + cek transaction detail
  -> Payment paid
  -> Order confirmed
  -> Broadcast realtime + polling fallback
```

Midtrans:

- Tetap ada di `PaymentService` sebagai future/legacy gateway.
- Tidak dianggap aktif jika `PAYMENT_GATEWAY=pakasir`.
- Perlu retest penuh sebelum migrasi ke Midtrans.

## 6. Realtime Architecture

Event broadcast:

| Event | Channel | Tipe | Listener UI |
| --- | --- | --- | --- |
| `NewOrderPlaced` | `staff-orders`, `order.{id}` | PrivateChannel | Staff/Admin order board, customer status |
| `OrderStatusUpdated` | `staff-orders`, `order.{id}` | PrivateChannel | Customer status, staff/admin board |
| `PaymentStatusUpdated` | `order.{id}`, `staff-payments` | PrivateChannel | Customer payment/status, staff payment view |

Authorization:

- `staff-orders` dan `staff-payments` hanya untuk user role staff/admin.
- `order.{orderId}` hanya untuk staff/admin atau customer session pemilik order.
- `/realtime/auth` dipakai sebagai auth endpoint Echo dan diberi throttle ringan.
- UI customer dan staff/admin tetap melakukan polling fallback bila Reverb tidak tersedia.

## 7. AI Architecture

FastAPI service berada di `ai_service`.

Endpoint utama:

- `GET /health`
- `POST /api/estimation/predict`
- `GET /api/estimation/info`
- `GET /api/menu/populer`
- `POST /api/sentiment/analyze`
- `GET /api/sentiment/summary`
- `POST /api/sentiment/bulk`

Model:

- Multiple Linear Regression untuk estimasi waktu.
- Weighted Moving Average untuk menu populer.
- Naive Bayes + TF-IDF hybrid dengan rating untuk sentimen.

Fallback:

- FastAPI tetap start jika `.pkl`/`.json` model hilang atau corrupt.
- Endpoint AI mengembalikan fallback saat model/database gagal.
- Laravel `AiService` juga menyediakan fallback berbasis database/heuristic.
- File `.pkl` harus diperlakukan sebagai trusted artifact. Jangan load pickle dari sumber tidak terpercaya.

## 8. Security Summary

Yang sudah terlihat di repository:

- `.env` tidak boleh didokumentasikan dengan secret asli.
- `.env.example` dan `.env.production.example` memakai placeholder.
- Login mengecek `is_active`.
- Role middleware membatasi staff/admin route group.
- Customer order/payment/status/review memakai `CustomerOrderAccessService` berbasis session.
- Private realtime channel membatasi order/customer/staff event.
- Pakasir webhook divalidasi terhadap project, order ref, amount, status, method, dan transaction detail.
- Payment create/webhook dibuat idempotent dengan application logic dan unique index database.
- CSRF exception dipersempit ke webhook/callback payment.
- Throttle tersedia untuk login, order/payment creation, Pakasir webhook, simulation, dan realtime auth.
- Public customer payment/order response disanitasi dari raw provider payload.
- Docker Compose utama tidak publish PostgreSQL/Redis ke host.
- AI pickle model policy perlu dijaga.

Remaining risks:

- Signature/timestamp/nonce webhook Pakasir perlu ditambahkan jika Pakasir menyediakan mekanisme tersebut.
- Payment expiry/reconciliation otomatis belum menjadi proses scheduled production.
- Observability, alerting, backup freshness alert, dan restore drill perlu dibuktikan.
- Full E2E test browser belum lengkap.
- Admin Settings perlu smoke test sebelum production.

## 9. Documentation Index

File dokumentasi detail:

- `docs/documentation/BACKEND_DOCUMENTATION.md`
- `docs/documentation/FRONTEND_DOCUMENTATION.md`
- `docs/documentation/AI_SERVICE_DOCUMENTATION.md`
- `docs/documentation/DATABASE_DOCUMENTATION.md`
- `docs/documentation/API_ROUTES_DOCUMENTATION.md`
- `docs/documentation/DEPLOYMENT_GUIDE.md`
- `docs/documentation/UAT_CHECKLIST.md`
- `docs/documentation/MAINTENANCE_GUIDE.md`

## 10. Known Issues and Next Steps

Known issues:

- Production belum final sampai deployment dan UAT production-like selesai.
- Admin AI Analytics perlu dipastikan FastAPI service running untuk data live.
- Webhook signature/timestamp/nonce perlu ditambahkan jika Pakasir menyediakan mekanisme signature.
- Observability/alerting production perlu dipasang.
- Full browser E2E test belum lengkap.
- Frontend inline style masih bisa dirapikan bertahap.
- Legacy `StaffDashboardController` ada tetapi route aktif memakai `Staff\DashboardController`; cleanup perlu konfirmasi.
- Admin Settings perlu konfirmasi kesiapan.
- Payment expiry/reconciliation Pakasir belum otomatis.

Roadmap:

- Before Production: final env, SSL, migrate, build, queue, scheduler, Reverb, AI service, Pakasir webhook, smoke test, backup restore drill.
- Week 1 After Deployment: monitor failed jobs, webhook failures, 5xx, AI health, Reverb stability, backup freshness.
- Month 1: tambah reconciliation/expiry job, observability dashboard, E2E test, alerting formal.
- Future Improvements: Midtrans migration jika dibutuhkan, stronger AI model registry/checksum, frontend Tailwind-only cleanup, broader Form Request coverage.

