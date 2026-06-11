# Progress Checkpoint - UCW App

## Last Updated: 2026-06-08 23:59 WIB

## Project
- Nama: Sistem Manajemen Coffee Shop Unand Co-Workspace
- Stack aktif: Laravel 12, Inertia.js v2, React 18 + TypeScript, Tailwind CSS, PostgreSQL/SQLite, Pakasir Payment Gateway, FastAPI AI Service, Laravel Reverb.
- Status umum: customer flow berjalan, staff dashboard berjalan, admin dashboard makin siap demo/UAT, AI dan Pakasir sudah terintegrasi.

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
- Beberapa file gambar seed seperti `menus/americano.jpg` belum ada di storage, sehingga item tersebut tetap akan fallback sampai asset asli disediakan.

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
- [ ] Beberapa asset gambar menu dari seed belum tersedia di storage, sehingga fallback image masih muncul untuk item yang asset-nya hilang.
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
- Customer flow sudah berjalan.
- Bug gambar menu sudah diperbaiki memakai helper image URL dan accessor `Menu::image_url`.
- Timer OrderStatus sudah berjalan berdasarkan `createdAt + estimatedServeTime`.
- Customer Feedback sudah optional, bisa rating saja, komentar saja, kombinasi, atau skip kosong.
- Admin Feedback page sudah dibuat dengan filter, search, pagination, dan export CSV.
- Staff Dashboard dan Admin Live Orders sudah punya search client-side, mobile kanban scroll/snap, sticky header, dan desktop board lebih tinggi.
- Admin Overview sudah memakai data completed + paid untuk weekly/daily sales trend dan peak hours.
- Admin Finances sudah memakai filter bulan yang benar, completed + paid revenue, table tanpa avatar dummy, dan export CSV sesuai bulan.

Prioritas berikutnya:
1. Selesaikan Admin Settings.
2. Jalankan UAT penuh.
3. Siapkan deployment production.
