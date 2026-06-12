# Progress Checkpoint - UCW App

## Last Updated: 2026-06-11 WIB

## Project
- Nama: Sistem Manajemen Coffee Shop Unand Co-Workspace
- Stack aktif: Laravel 12, Inertia.js v2, React 19 + TypeScript, Tailwind CSS, PostgreSQL untuk production, Pakasir Payment Gateway aktif, Midtrans future/legacy, FastAPI AI Service, Laravel Reverb.
- Catatan versi: `package.json` memakai React 19.x dan dokumentasi utama sekarang mengikuti versi tersebut.
- Status umum: customer flow berjalan dan sudah lebih aman, staff dashboard berjalan, admin dashboard makin siap demo/UAT, AI dan Pakasir sudah di-hardening, frontend sudah lebih modular.

---

## Checkpoint Terbaru Setelah Tahap 1-7F

Skor audit ulang terbaru:

- Overall: 82/100
- Security: 86/100
- Backend: 80/100
- Frontend: 78/100
- Database: 85/100
- Performance: 78/100
- Maintainability: 80/100
- Production readiness: 76/100

Status kesiapan:

- Demo: aman.
- UAT: cukup aman, tetapi sebaiknya selesaikan quick wins tahap 8A dulu.
- Production: belum direkomendasikan penuh sebelum rate limiting, observability, backup, route hardening, dan UAT end-to-end production-like.

Progress tahap 1-7F:

- [x] Tahap 1 critical quick fixes:
  - secret asli di `.env.example` dan `docker-compose.yml` diganti placeholder;
  - `.env` tidak ikut tracked;
  - `SystemConfigController` import `Log` diperbaiki;
  - import casing `Components/UI` menjadi `Components/ui` diperbaiki;
  - missing route/resource/page fatal diperbaiki;
  - login sekarang mengecek `is_active`.
- [x] Tahap 2 payment gateway:
  - production payment aktif memakai Pakasir;
  - Midtrans tetap disimpan sebagai future/legacy gateway;
  - `PAYMENT_GATEWAY=pakasir` ditambahkan;
  - webhook Pakasir divalidasi dan dibuat idempotent;
  - simulasi Pakasir diblokir untuk production.
- [x] Tahap 3 customer order access dan realtime:
  - `order_ref` tidak lagi cukup untuk akses order customer;
  - `CustomerOrderAccessService` berbasis session digunakan untuk ownership;
  - endpoint customer order/payment/status/review dikunci;
  - broadcast order/payment/staff memakai `PrivateChannel`;
  - frontend Echo memakai private channel;
  - polling fallback tetap dipertahankan.
- [x] Tahap 4 database integrity:
  - `order_details` menyimpan snapshot `menu_name`, `unit_price`, dan `subtotal`;
  - menu delete tidak menghapus histori order detail;
  - `reviews.order_id` diberi unique constraint;
  - index dashboard/payment/finance ditambahkan;
  - status `processing`/`preparing` distandarkan agar customer-safe.
- [x] Tahap 5 deployment readiness:
  - `.env.production.example` ditambahkan;
  - production tidak diarahkan default ke SQLite;
  - docker-compose path diperbaiki;
  - Dockerfile AI service, node, nginx, php/supervisor config ditambahkan;
  - `docs/DEPLOYMENT.md` ditambahkan;
  - queue, scheduler, Reverb, FastAPI, PostgreSQL, Redis, dan Pakasir production dijelaskan.
- [x] Tahap 6 AI service hardening:
  - FastAPI model loading dibuat aman dengan `model_loader.py`;
  - service tetap hidup jika model hilang/corrupt;
  - `/health` menampilkan status model dan database;
  - endpoint estimation, sentiment, dan popular menu punya fallback;
  - Laravel `AiService` fallback diperkuat;
  - `AiServiceFallbackTest` ditambahkan.
- [x] Tahap 7A-7F frontend refactor:
  - shared formatter/status/type/components/hooks ditambahkan;
  - customer payment page dipecah;
  - `OrderType`, `OrderStatus`, `Feedback`, `Cart`, `Estimate`, dan `CashConfirmation` dipisah ke komponen reusable;
  - Staff/Admin order kanban memakai reusable `OrderKanbanBoard`;
  - admin/staff table memakai reusable `DataToolbar`, `PaginationFooter`, dan `ActionButtons`;
  - build dan test terkait dilaporkan lulus pada tahap refactor.

Hasil verifikasi terakhir yang relevan:

- `npm run build`: lulus pada tahap frontend refactor terkait.
- `git diff --check`: lulus pada tahap refactor terkait.
- `php artisan test --filter=CustomerOrderAccessTest`: lulus pada tahap akses order/realtime terkait.
- `php artisan test --filter=PakasirPaymentTest`: lulus pada tahap payment terkait.
- `php artisan test --filter=OrderIntegrityTest`: lulus pada tahap database integrity terkait.
- `php artisan test --filter=AiServiceFallbackTest`: lulus pada tahap AI fallback terkait.

Masalah tersisa yang perlu dibawa ke tahap berikutnya:

- [ ] `ReviewController::getStatistics` raw SQL string quoting berisiko di PostgreSQL.
- [ ] Admin AI Analytics masih perlu cleanup type/interface, `any`, inline style, dan mock data.
- [ ] Route simulasi Pakasir masih registered, walau controller sudah guard.
- [ ] Public API settings/review/menu perlu audit data exposure.
- [ ] Rate limiting eksplisit untuk login, order creation, payment creation, dan webhook belum lengkap.
- [ ] Inline style frontend masih banyak di beberapa komponen customer/admin.
- [ ] Ada kemungkinan duplicate/legacy Staff dashboard controller.
- [ ] Admin/staff validation belum semuanya memakai Form Request.
- [ ] Observability, backup, alerting, dan log retention production belum detail.
- [x] Dokumentasi utama disinkronkan dengan React 19 sesuai `package.json`.

Next step tahap 8A:

1. Perbaiki query/statistik review agar aman untuk PostgreSQL.
2. Audit public API settings/review/menu untuk data exposure.
3. Tambahkan rate limiting eksplisit untuk login, order creation, payment creation, dan Pakasir webhook.
4. Hardening route dev/simulation/debug agar tidak registered atau tidak accessible di production sesuai kebutuhan.
5. Cleanup Admin AI Analytics type/interface, `any`, inline style, dan mock/static data yang masih tersisa.
6. Tambahkan smoke/UAT checklist production-like untuk PostgreSQL, Redis, queue, scheduler, Reverb, FastAPI, dan Pakasir.

---

## Checkpoint Tahap 8B

Fokus tahap 8B:

- [x] Cleanup `resources/js/Pages/Admin/AIAnalytics.tsx`:
  - type/interface props dan view model ditambahkan;
  - `any` yang mudah diganti dihapus;
  - angka statis `Active Forecasts 2,142` diganti menjadi jumlah tracker points aktual;
  - data live/fallback/demo diberi label agar tidak misleading;
  - loading, empty, dan fallback/error state ditampilkan tanpa redesign besar.
- [x] Backend maintainability kecil:
  - validasi `Admin/StaffController@store` dipindah ke `StoreStaffRequest`;
  - validasi `Admin/StaffController@update` dipindah ke `UpdateStaffRequest`;
  - payload dan redirect response tetap sama.
- [x] Audit controller staff legacy:
  - route aktif `routes/web.php` dan `routes/api.php` memakai `App\Http\Controllers\Staff\DashboardController`;
  - `App\Http\Controllers\Staff\StaffDashboardController` berisi dummy data dan tidak ditemukan referensi route/test;
  - file tidak dihapus pada tahap ini, direkomendasikan sebagai kandidat cleanup setelah konfirmasi.
- [x] Production operations documentation:
  - `docs/DEPLOYMENT.md` ditambah backup checklist, restore procedure, log rotation, monitoring/alerting, process monitoring, production-like smoke test, dan UAT checklist singkat.

Next after 8B:

1. Konfirmasi apakah `StaffDashboardController.php` boleh dihapus atau dipindahkan sebagai arsip.
2. Lanjut cleanup Admin AI Analytics backend agar efficiency data tidak memakai fallback slot statis tanpa flag eksplisit.
3. Tambahkan CI/checklist untuk backup restore drill dan process monitoring.

---

## Checkpoint Week 1 Final Hardening

- [x] CSRF exception dipersempit agar route customer payment/review biasa kembali memakai CSRF normal.
- [x] Response customer order/payment disanitasi agar tidak mengekspos `raw_response`, `raw_webhook`, provider payload, atau field transaksi internal.
- [x] `OrderService::getOrderStatistics()` menghitung `revenue_today` hanya dari order `completed` dengan `payment_status=paid`.
- [x] `/realtime/auth` diberi throttle ringan tanpa mengubah private channel authorization.
- [x] Python `__pycache__/*.pyc` dibersihkan dari Git tracking dan tetap di-ignore.
- [x] Payment idempotency diperkuat dengan unique index provider reference/payment method dan Midtrans transaction/payment method.
- [x] Pakasir create payment memakai update-or-create berdasarkan provider reference agar retry tidak membuat duplikasi payment.
- [x] `docker-compose.yml` tidak lagi publish PostgreSQL/Redis ke host dari compose utama.
- [x] Pagination admin tidak lagi render label melalui `dangerouslySetInnerHTML`.
- [x] Policy AI artifact/cache dan Docker host-port override dicatat di deployment docs.

Next priorities:

1. Jalankan UAT production-like penuh dengan PostgreSQL, Redis, Reverb, queue, scheduler, FastAPI, dan Pakasir sandbox/production sesuai target.
2. Tambahkan payment expiry/reconciliation job untuk Pakasir unpaid/expired transaction.
3. Tambahkan observability nyata: health checks, alerting, failed jobs monitor, log retention, dan backup freshness alert.
4. Putuskan cleanup final untuk legacy `StaffDashboardController.php`.
4. Lanjut Form Request terbatas untuk controller admin/staff lain yang masih aman.

---

## Checkpoint UAT Feedback CSRF

Hasil UAT sementara:

- Customer: flow utama aman. Bug feedback/review CSRF ditemukan saat submit feedback dan sudah diperbaiki.
- Staff: aman pada UAT sementara.
- Admin: AI Analytics belum bisa dibuka dan akan ditangani rekan; area ini sengaja tidak disentuh pada checkpoint ini.

Perubahan feedback CSRF:

- `resources/js/bootstrap.js` memperkuat axios same-origin request dengan `withCredentials`, `withXSRFToken`, nama cookie/header XSRF Laravel, dan interceptor yang membaca meta `csrf-token` terbaru sebelum request.
- `resources/js/Pages/Customer/Feedback.tsx` sekarang mengirim `_token` dan header `X-CSRF-TOKEN` eksplisit pada submit feedback.
- `resources/js/Components/customer/feedback/FeedbackBlocks.tsx` menonaktifkan tombol submit saat request berjalan untuk mencegah double-submit.
- Route customer feedback/review tetap tidak dimasukkan ke CSRF exception.

Hasil verifikasi:

- `npm.cmd run build`: lulus.
- `php -l` untuk file PHP yang masih modified di worktree: lulus.
- `php artisan test --filter=CustomerOrderAccessTest`: lulus.
- `php artisan test --filter=ReviewStatisticsTest`: lulus.
- `git diff --check`: lulus.

Next step:

1. Re-test feedback customer langsung di browser/UAT device untuk memastikan tidak ada lagi 419/CSRF mismatch.
2. Follow up Admin AI Analytics dengan rekan yang menangani area tersebut.

---

## Ringkasan Status Akhir

- [x] Customer app utama selesai dan sudah diperbaiki beberapa bug penting.
- [x] Staff dashboard selesai dan usability kanban sudah ditingkatkan.
- [x] Admin dashboard hampir selesai, termasuk halaman Feedback baru.
- [x] Admin Overview memakai data penjualan aktual, bukan dummy.
- [x] Admin Finances memakai filter bulan yang benar dan export sesuai bulan.
- [x] AI analytics sudah tersambung ke FastAPI dengan fallback.
- [x] Pakasir sandbox, webhook, dan status pembayaran sudah berjalan.
- [x] Dokumentasi handover permanen sudah dibuat.
- [ ] Admin Settings masih menjadi prioritas lanjutan.
- [ ] Full UAT dan deployment production checklist masih perlu dijalankan.

---

## Dokumentasi Permanen

Dokumentasi handover sudah dibuat agar project bisa dilanjutkan di chat baru atau oleh AI agent lain tanpa kehilangan konteks.

- [x] `docs/PROJECT_HANDOVER.md`
  - Menjelaskan tujuan project, tech stack, struktur, status frontend/backend/database/payment/AI, route penting, migration, environment variables, known issues, remaining tasks, testing, deployment, dan prompt untuk sesi berikutnya.
- [x] `docs/ARCHITECTURE.md`
  - Menjelaskan struktur frontend/backend/database, flow customer/staff/admin/payment/AI, models, controllers, services, pages, components, hooks, types, relasi database, integrasi Pakasir, dan status Midtrans.

---

## Bugfix Customer App

### Menu Image
- [x] Audit field gambar menu di model/database/frontend.
- [x] Menyamakan field gambar menjadi `image`, `image_url`, dan `imageUrl` pada data yang dikirim backend.
- [x] Menambahkan helper `resources/js/lib/images.ts`.
- [x] Memastikan fallback image hanya dipakai jika gambar kosong atau error.
- [x] Memperbaiki tampilan gambar menu pada customer, cart, estimate, order status, staff order detail, dan admin menu.
- [x] Menjalankan `php artisan storage:link`.

Catatan:
- Seluruh 40 gambar menu asli Unand Co-Workspace telah berhasil di-copy ke public storage dan tidak ada lagi item yang mengalami fallback akibat aset hilang.

### OrderStatus Timer
- [x] Timer OrderStatus diperbaiki agar memakai `createdAt + estimatedServeTime`.
- [x] Timer update tiap detik memakai interval.
- [x] Interval dibersihkan saat unmount.
- [x] Timer tidak reset setelah refresh karena basisnya timestamp order.
- [x] Timer berhenti untuk status `ready`, `completed`, dan `cancelled`.
- [x] Status `processing` ikut dipetakan dengan benar.

### Customer Feedback Optional
- [x] Menghapus kewajiban rating.
- [x] Menghapus kewajiban komentar.
- [x] Menghapus minimal komentar 10 karakter.
- [x] Customer bisa submit:
  - rating saja
  - komentar saja
  - rating + komentar
  - kosong sebagai skip feedback
- [x] Payload final:
  - `rating`: angka 1-5 atau `null`
  - `comment`: string trimmed atau `null`
- [x] Backend validation diubah menjadi:
  - `rating => nullable|integer|min:1|max:5`
  - `comment => nullable|string|max:1000`
- [x] Migration baru dibuat dan dijalankan agar `reviews.rating` bisa `null`.
- [x] AI sentiment tidak dipanggil jika feedback benar-benar kosong.
- [x] Admin feedback mampu menampilkan rating kosong sebagai `No rating` dan sentiment kosong sebagai `not analyzed`.

---

## Staff Dashboard

### Status
- [x] Staff Dashboard berjalan.
- [x] Incoming, Processing, Completed tetap memakai flow status yang sama.
- [x] Payment verification tetap memakai endpoint lama.
- [x] Polling tetap berjalan, tidak diubah.

### Usability Saat Order Banyak
- [x] Search order ditambahkan di atas board.
- [x] Search bersifat client-side realtime.
- [x] Search mencakup:
  - order id / order ref
  - nomor meja
  - customer name
  - order type
  - nama menu dalam order
- [x] Mobile kanban menjadi horizontal swipe/snap satu kolom per layar.
- [x] Tablet menampilkan 2 kolom.
- [x] Desktop menampilkan 3 kolom.
- [x] Isi kolom mobile dibatasi `max-h-[68vh]` dan scroll internal.
- [x] Area desktop ditinggikan:
  - `lg:h-[calc(100vh-178px)]`
  - `lg:min-h-[76vh]`
- [x] Header kolom dibuat sticky saat isi kolom discroll.

Komponen baru:
- [x] `resources/js/Components/ui/OrderSearchInput.tsx`

---

## Admin Dashboard

### Admin Feedback Page
- [x] Halaman baru dibuat: `resources/js/Pages/Admin/Feedback.tsx`.
- [x] Route baru:
  - `GET /admin/feedback` => `admin.feedback`
  - `GET /admin/feedback/export` => `admin.feedback.export`
- [x] Backend baru:
  - `app/Http/Controllers/Admin/FeedbackController.php`
  - `app/Http/Requests/Admin/FeedbackFilterRequest.php`
  - `app/Services/FeedbackService.php`
- [x] Halaman menampilkan:
  - daftar feedback customer
  - rating
  - komentar
  - order ref
  - customer/table/order type
  - menu terkait
  - tanggal
  - sentiment AI jika ada
  - filter rating
  - filter sentiment
  - search komentar/customer/order ref/menu
  - pagination
  - export CSV
- [x] Sidebar desktop admin ditambah menu Feedback.
- [x] Mobile bottom nav admin ditambah Feedback.

### Admin Live Orders
- [x] Search order ditambahkan di atas kanban.
- [x] Search client-side realtime berdasarkan order ref, meja, customer, dan nama menu.
- [x] Mobile kanban dibuat horizontal swipe/snap satu kolom per layar.
- [x] Tablet 2 kolom.
- [x] Desktop 3 kolom.
- [x] Isi kolom mobile `max-h-[68vh]` dengan scroll internal.
- [x] Area desktop ditinggikan:
  - `lg:h-[calc(100vh-176px)]`
  - `lg:min-h-[76vh]`
- [x] Header kolom sticky.
- [x] Endpoint, polling, dan status flow tidak diubah.

### Admin Overview
- [x] Weekly Sales Trend tidak memakai dummy lagi.
- [x] Chart memakai order aktual dengan:
  - `order_status = completed`
  - `payment_status = paid`
- [x] Weekly mode:
  - menampilkan Senin sampai Jumat
  - memakai minggu aktif
  - menampilkan count transaksi dan nominal revenue
- [x] Daily mode:
  - menampilkan jam operasional 09:00 sampai 18:00
  - data per jam
  - tombol Daily/Weekly mengubah query `mode`
- [x] Empty state ditampilkan jika tidak ada order paid/completed.
- [x] Peak Roasting Hours tidak hardcoded lagi.
- [x] Peak hours dihitung dari top 3 jam dengan order terbanyak.
- [x] Hottest Sellers tidak lagi memakai gambar dummy Unsplash.
- [x] Fallback angka dummy seperti `1,248`, `14,520`, dan `18` dihapus.

Endpoint terkait:
- `GET /admin/overview?mode=daily|weekly`
- `GET /admin/statistics/orders-chart?mode=daily|weekly`

### Admin Finances
- [x] Filter bulan diperbaiki agar memakai route name yang benar:
  - dari `admin.finances`
  - menjadi `admin.finances-page`
- [x] Semua data finance mengikuti query `month=YYYY-MM`.
- [x] Hanya order `completed + paid` yang dihitung sebagai revenue.
- [x] Data yang mengikuti filter bulan:
  - total sales
  - transaction count
  - average daily sales
  - average order value
  - comparison cards
  - table transaksi
  - pagination
  - export CSV
- [x] Tabel transaksi diurutkan terbaru ke terlama.
- [x] Avatar/foto customer dummy dihapus.
- [x] Customer column sekarang memakai:
  - customer name jika ada
  - table number jika ada
  - order type jika ada
  - fallback `Guest`
- [x] Empty state ditampilkan jika bulan tidak punya transaksi paid.

Endpoint terkait:
- `GET /admin/finances?month=YYYY-MM`
- `GET /admin/finances/export?month=YYYY-MM`

### Admin AI Analytics
- [x] Perbaikan visual donut chart Sentiment Polarity agar dinamis menggunakan CSS `conic-gradient` berdasarkan data sentimen riil (`positive_percentage`, `neutral_percentage`, `negative_percentage`).
- [x] Integrasi grafik Efficiency Tracker dengan data pelayanan riil (selisih waktu bayar/dibuat dengan waktu selesai) vs estimasi AI model (Multiple Linear Regression) per-jam.
- [x] Menampilkan data tren secara interaktif menggunakan Recharts AreaChart & Custom Tooltip.

Endpoint terkait:
- `GET /admin/ai-analytics`

---

## Backend / Data Correctness

- [x] Revenue Overview dan Finance disaring dengan `completed + paid`.
- [x] Query chart Overview dibuat aman berbasis Eloquent.
- [x] Query Finance memakai eager loading `table` dan `payments`.
- [x] Export CSV Finance mengikuti filter bulan.
- [x] Export CSV Feedback mengikuti filter aktif.
- [x] Payment status unpaid/cancelled tidak dihitung sebagai revenue.
- [x] Timezone memakai `config('app.timezone', 'Asia/Jakarta')` pada format data penting.

---

## File Penting Yang Dibuat / Diubah Pada Sesi Ini

### Baru
- `docs/PROJECT_HANDOVER.md`
- `docs/ARCHITECTURE.md`
- `resources/js/lib/images.ts`
- `resources/js/Components/ui/OrderSearchInput.tsx`
- `resources/js/Pages/Admin/Feedback.tsx`
- `app/Http/Controllers/Admin/FeedbackController.php`
- `app/Http/Requests/Admin/FeedbackFilterRequest.php`
- `app/Services/FeedbackService.php`
- `database/migrations/2026_06_08_000002_make_review_feedback_optional.php`

### Diubah
- `app/Models/Menu.php`
- `app/Http/Controllers/Customer/MenuController.php`
- `app/Http/Controllers/Customer/ReviewController.php`
- `app/Http/Controllers/Staff/DashboardController.php`
- `app/Http/Controllers/Admin/DashboardController.php`
- `app/Http/Controllers/Admin/FinanceController.php`
- `app/Services/AiService.php`
- `routes/web.php`
- `resources/js/Pages/Customer/Menu.tsx`
- `resources/js/Pages/Customer/Cart.tsx`
- `resources/js/Pages/Customer/Estimate.tsx`
- `resources/js/Pages/Customer/OrderStatus.tsx`
- `resources/js/Pages/Customer/Feedback.tsx`
- `resources/js/Pages/Staff/Dashboard.tsx`
- `resources/js/Pages/Admin/LiveOrder.tsx`
- `resources/js/Pages/Admin/Menu/Index.tsx`
- `resources/js/Pages/Admin/Overview.tsx`
- `resources/js/Pages/Admin/Finances.tsx`
- `resources/js/Pages/Admin/Feedback.tsx`
- `resources/js/Components/Layout/Sidebar.tsx`
- `resources/js/Components/Layout/MobileBottomNavAdmin.tsx`
- `resources/js/Components/Modals/OrderDetailModal.tsx`
- `resources/js/Components/customer/menu/MenuCardMobile.tsx`
- `resources/js/Components/customer/menu/MenuCardDesktop.tsx`
- `resources/js/types/customer.ts`
- `database/migrations/2026_05_11_123121_create_reviews_table.php`

---

## Verifikasi Yang Sudah Dilakukan

- [x] `php artisan storage:link`
- [x] `php artisan migrate`
- [x] `php artisan route:list --name=admin.feedback`
- [x] `php artisan route:list --name=admin.finances`
- [x] `php artisan route:list --name=admin.statistics`
- [x] PHP lint untuk controller/request/service/migration yang ditambahkan atau diubah.
- [x] `npm.cmd run build` berhasil beberapa kali setelah perubahan frontend.
- [x] Smoke test `DashboardController@getOrdersChartData`:
  - mode `daily` mengembalikan label 09:00-18:00
  - mode `weekly` mengembalikan label Mon-Fri

Catatan:
- `npm run build` di PowerShell sempat terkendala Execution Policy `npm.ps1`, sehingga build dijalankan dengan `npm.cmd run build`.
- `php artisan tinker` sempat gagal karena PsySH mencoba menulis ke `C:/Users/USER/AppData/Roaming/PsySH`; smoke test diganti memakai PHP bootstrap.
- `git status` sempat gagal karena Git menandai repo sebagai `dubious ownership`; konfigurasi global Git tidak diubah.

---

## Known Issues / Catatan Tersisa

- [ ] Admin Settings belum selesai.
- [x] Seluruh asset gambar menu asli dari UCW sudah tersedia di storage dan terhubung.
- [ ] Full UAT end-to-end perlu dilakukan lagi setelah semua data dummy dihapus.
- [ ] Deployment production checklist perlu dituntaskan:
  - env production
  - queue
  - scheduler
  - Reverb/WebSocket
  - SSL
  - webhook URL public
  - FastAPI service/Docker
- [ ] Test otomatis khusus Admin Overview dan Finances belum tersedia.
- [ ] Audit keamanan production masih perlu final pass sebelum deploy.

---

## Checkpoint Analisis & Rencana Sinkronisasi Timer (Sesi Terbaru)

Pada sesi ini, beberapa analisis masalah operasional telah dilakukan dan direncanakan solusinya:

### Analisis Bug & Kendala
1. **Gambar Menu Tidak Muncul**: 
   - Diidentifikasi bahwa setelah impor data menu, gambar tidak muncul di halaman detail live order dan order status. Folder `menu-ucw` berisi data gambar disarankan untuk tidak dihapus, dan disarankan penggunaan `.gitignore` jika ukurannya terlalu besar untuk push ke repository.
2. **Bug Konfirmasi Pembayaran**:
   - Terdapat kendala saat konfirmasi pembayaran pada dashboard admin/staff yang telah dianalisis.
3. **Sentimen AI Rating 2 Bintang (Neutral)**:
   - Ditemukan bahwa AI model mengklasifikasikan rating 2 bintang sebagai "neutral", bukan "negative". Analisis model telah dilakukan untuk memperbaiki akurasi klasifikasi sentimen ini.

### Rencana Sinkronisasi Timer Pembuatan Pesanan
- **Masalah**: Waktu pada halaman pelacakan pesanan pelanggan (`remainingSeconds`) berjalan dari waktu pembuatan pesanan (`created_at`), sementara pada dashboard Live Order Admin/Staff perlu penyesuaian yang sinkron.
- **Solusi yang Direncanakan (Disetujui)**:
  - Hitung mundur pelanggan akan dijeda (menampilkan "Estimasi: X menit") saat status masih `pending` atau `confirmed` (baru selesai bayar).
  - Waktu mulai berjalan (**countdown aktif**) HANYA setelah Staff/Barista mengonfirmasi **"Start Processing"** (status berubah menjadi `processing`/`preparing`).
  - Kartu pesanan (Kanban Card) Barista akan menampilkan hitung mundur waktu persiapan yang identik dengan pelanggan, dihitung dari `updated_at` saat pesanan mulai diproses.
  - Kartu Barista akan berkedip merah jika waktu habis (`00:00`) sebagai peringatan keterlambatan pesanan.
  - *Implementation plan* lengkap dalam Bahasa Indonesia telah disetujui.

---

## Next Priorities

1. Selesaikan Admin Settings.
2. Jalankan UAT customer end-to-end:
   - menu
   - cart
   - order type
   - estimate
   - QRIS
   - BRI VA
   - cash
   - order status
   - feedback optional/skip
3. Jalankan UAT staff:
   - login
   - search order
   - update status
   - verify cash
   - transactions
   - export
4. Jalankan UAT admin:
   - overview daily/weekly
   - live orders search/kanban
   - menu CRUD + image
   - staff CRUD
   - finances month filter + export
   - AI analytics
   - feedback page + export
5. Siapkan deployment:
   - Laravel app
   - database production
   - storage link
   - queue worker
   - Reverb
   - Pakasir webhook public URL
   - FastAPI AI service

---

## Next Session Starting Prompt

Lanjutkan project UCW App. Baca dulu:
- `AGENTS.md`
- `docs/PROJECT_HANDOVER.md`
- `docs/ARCHITECTURE.md`
- `docs/PROGRESS_CHECKPOINT.md`

Status terakhir:
- Customer flow sudah berjalan dan akses order/payment/status/review sudah dilindungi ownership session.
- Payment production memakai Pakasir; Midtrans tetap ada sebagai future/legacy gateway dan tidak boleh terpanggil saat `PAYMENT_GATEWAY=pakasir`.
- Pakasir webhook sudah divalidasi, cek transaction detail, idempotent untuk duplicate webhook, dan route simulasi sudah guard dari production.
- Broadcast order/payment/staff sudah private channel; polling fallback tetap ada.
- Database sudah menyimpan order detail snapshot, menjaga histori saat menu dihapus, unique review per order, index dashboard/payment/finance, dan mapping status customer-safe.
- FastAPI AI service sudah safe model loading, `/health` status model/database, dan fallback endpoint; Laravel `AiService` juga fallback.
- Frontend customer sudah banyak dipecah ke komponen reusable; staff/admin order kanban dan table toolbar/pagination/action juga reusable.
- Project aman untuk demo, cukup aman untuk UAT setelah quick wins 8A, tetapi belum direkomendasikan production penuh.

Prioritas berikutnya:
1. Tahap 8A quick wins:
   - PostgreSQL-safe `ReviewController::getStatistics`;
   - audit data exposure public API settings/review/menu;
   - explicit rate limiting login/order/payment/webhook;
   - hardening route dev/simulation/debug;
   - cleanup Admin AI Analytics.
2. Jalankan UAT penuh di environment production-like.
3. Lengkapi observability, backup, alerting, log retention, dan runbook production.
4. Lanjutkan cleanup frontend inline style/type yang masih tersisa.
