# UAT Checklist

## 1. Scope

Checklist ini untuk production-like UAT UCW App sebelum go-live.

Environment yang disarankan:

- `APP_ENV=production` atau staging production-like.
- `APP_DEBUG=false`.
- PostgreSQL.
- Redis untuk cache/queue.
- Queue worker aktif.
- Scheduler aktif.
- Reverb aktif.
- FastAPI AI service aktif.
- Pakasir sandbox/production sesuai target UAT.
- SSL/domain publik untuk webhook.

## 2. Customer UAT

### Landing and Menu

- [ ] QR/landing membuka `/customer` dengan table context yang benar.
- [ ] Customer bisa masuk ke menu.
- [ ] Menu menampilkan kategori.
- [ ] Search menu bekerja.
- [ ] Filter kategori bekerja.
- [ ] Gambar menu tampil, fallback hanya muncul jika image memang kosong/error.
- [ ] Menu unavailable tidak bisa dipesan.
- [ ] Data publik menu tidak mengekspos field internal.

### Cart

- [ ] Add item ke cart.
- [ ] Quantity bisa dinaikkan.
- [ ] Quantity bisa diturunkan.
- [ ] Item bisa dihapus.
- [ ] Total harga cart benar.
- [ ] Cart tetap ada setelah refresh sesuai localStorage.
- [ ] Empty cart state tampil.

### Order Type

- [ ] Dine-in bisa dipilih.
- [ ] Dine-in wajib table number.
- [ ] Nomor meja `1`, `01`, `T1`, `T01` diproses sesuai data.
- [ ] Takeaway bisa dipilih.
- [ ] Takeaway wajib customer name.
- [ ] Validasi error tampil jelas.

### Estimate

- [ ] Estimasi AI tampil jika FastAPI aktif.
- [ ] Estimasi fallback tampil jika FastAPI dimatikan.
- [ ] Create order berhasil.
- [ ] Backend mengabaikan harga frontend dan menghitung dari database.
- [ ] Order detail snapshot tersimpan.

### Payment - QRIS

- [ ] Customer memilih QRIS.
- [ ] Pakasir transaction QRIS dibuat.
- [ ] Payment number/QR/instruksi tampil.
- [ ] Amount dan total payment benar.
- [ ] Expiry tampil jika provider mengirim expiry.
- [ ] Payment status polling berjalan.
- [ ] Webhook valid mengubah payment menjadi paid.
- [ ] Order menjadi confirmed.
- [ ] Customer status berubah.

### Payment - BRI VA

- [ ] Customer memilih BRI VA.
- [ ] Pakasir transaction BRI VA dibuat.
- [ ] VA/payment number tampil.
- [ ] Amount dan total payment benar.
- [ ] Payment status polling berjalan.
- [ ] Webhook valid mengubah payment menjadi paid.
- [ ] Order menjadi confirmed.
- [ ] Customer status berubah.

### Payment - Cash

- [ ] Customer memilih cash.
- [ ] Payment status menjadi `waiting_verification`.
- [ ] Customer melihat instruksi cash.
- [ ] Staff melihat order/payment menunggu verifikasi.
- [ ] Staff verify amount cukup.
- [ ] Jika amount kurang, error tampil.
- [ ] Setelah verified, payment menjadi paid.
- [ ] Order pending menjadi confirmed.
- [ ] Customer status berubah.

### Order Status

- [ ] Customer bisa membuka status hanya dari session pemilik order.
- [ ] Session berbeda ditolak 403.
- [ ] Status pending/confirmed/preparing/ready/completed tampil benar.
- [ ] Payment status tampil benar.
- [ ] Items tampil dari snapshot.
- [ ] Polling fallback memperbarui status.
- [ ] Reverb private channel memperbarui status jika aktif.
- [ ] Setelah completed, tombol feedback tampil.

### Feedback

- [ ] Feedback hanya bisa dibuka untuk order milik customer.
- [ ] Feedback hanya untuk order completed.
- [ ] Submit rating saja berhasil.
- [ ] Submit komentar saja berhasil.
- [ ] Submit rating + komentar berhasil.
- [ ] Submit kosong sebagai skip berhasil sesuai flow.
- [ ] Duplicate review ditolak/ditangani.
- [ ] Sentiment tersimpan jika ada feedback bermakna.
- [ ] Tidak ada CSRF 419 saat submit.

## 3. Staff UAT

### Auth

- [ ] Staff aktif bisa login.
- [ ] Staff inactive tidak bisa login.
- [ ] Staff diarahkan ke dashboard.
- [ ] Staff tidak bisa mengakses admin route.
- [ ] Logout berhasil.

### Dashboard

- [ ] Dashboard menampilkan incoming orders.
- [ ] Dashboard menampilkan processing orders.
- [ ] Dashboard menampilkan completed orders.
- [ ] Search order bekerja untuk order ref/id, meja, customer, order type, nama menu.
- [ ] Mobile kanban bisa horizontal swipe.
- [ ] Desktop menampilkan board dengan layout stabil.
- [ ] Polling reload berjalan tanpa mengganggu interaksi.

### Cash Verification

- [ ] Modal cash verification terbuka.
- [ ] Amount kurang ditolak.
- [ ] Amount cukup diterima.
- [ ] Change dihitung benar.
- [ ] Payment status updated.
- [ ] Customer menerima update via polling/realtime.

### Order Status Update

- [ ] Staff bisa start processing.
- [ ] Status tersimpan sebagai preparing/processing mapping sesuai aturan.
- [ ] Staff bisa complete order.
- [ ] Table dine-in kembali available setelah completed.
- [ ] Customer melihat perubahan status.

### Transactions

- [ ] Transactions page bisa dibuka staff.
- [ ] Guest redirect dari transactions.
- [ ] Summary transaksi benar.
- [ ] Data transaksi harian benar.
- [ ] Export transaksi berhasil.

## 4. Admin UAT

### Auth

- [ ] Admin aktif bisa login.
- [ ] Admin inactive tidak bisa login.
- [ ] Admin diarahkan ke overview.
- [ ] Admin bisa logout.
- [ ] Admin bisa mengakses admin route.

### Overview

- [ ] KPI tampil.
- [ ] Daily chart tampil untuk jam operasional.
- [ ] Weekly chart tampil untuk hari kerja.
- [ ] Revenue hanya menghitung completed + paid.
- [ ] Recent orders tampil.
- [ ] Hottest sellers memakai data aktual.
- [ ] Empty state tampil jika belum ada data.

### Live Order

- [ ] Live order board tampil.
- [ ] Search order bekerja.
- [ ] Admin bisa lihat detail order.
- [ ] Admin bisa update status bila flow memang diizinkan.
- [ ] Admin bisa verify cash bila flow memang diizinkan.
- [ ] Polling fallback berjalan.
- [ ] Reverb update berjalan jika aktif.

### Menu Management

- [ ] List menu tampil.
- [ ] Tambah menu berhasil.
- [ ] Upload gambar menu berhasil.
- [ ] Edit menu berhasil.
- [ ] Delete menu berhasil jika aman.
- [ ] Delete menu tidak menghapus histori order detail.
- [ ] Availability sesuai expected behavior.
- [ ] Validasi menu tampil.

### Category Management

- [ ] List category tampil.
- [ ] Tambah category berhasil.
- [ ] Edit category berhasil.
- [ ] Delete category kosong berhasil.
- [ ] Delete category yang masih dipakai menu ditolak.
- [ ] Validasi category tampil.

### Staff/Admin Management

- [ ] List staff/admin tampil.
- [ ] Tambah staff berhasil.
- [ ] Tambah admin berhasil jika role diizinkan.
- [ ] Edit user berhasil.
- [ ] Deactivate/delete user sesuai expected behavior.
- [ ] Export staff/admin berhasil.
- [ ] Filter role export berhasil.

### Finance

- [ ] Finance page tampil.
- [ ] Filter bulan bekerja.
- [ ] Total sales benar untuk completed + paid.
- [ ] Transaction count benar.
- [ ] Average daily sales benar.
- [ ] Average order value benar.
- [ ] Tabel transaksi urut terbaru.
- [ ] Export finance mengikuti filter bulan.
- [ ] Empty state tampil untuk bulan kosong.

### Feedback

- [ ] Feedback page tampil.
- [ ] Filter rating bekerja.
- [ ] Filter sentiment bekerja.
- [ ] Search komentar/customer/order ref/menu bekerja.
- [ ] Pagination bekerja.
- [ ] Export feedback mengikuti filter.
- [ ] Review kosong/rating kosong tampil aman.

### AI Analytics

- [ ] Page terbuka tanpa error.
- [ ] FastAPI `/health` ok.
- [ ] Popular menu tampil dari AI/database.
- [ ] Sentiment polarity tampil.
- [ ] Efficiency tracker tampil.
- [ ] Data fallback/demo diberi label jelas.
- [ ] Jika FastAPI dimatikan, page tetap graceful.

### Settings

- [ ] Admin Settings page bisa dibuka.
- [ ] System settings API tidak mengekspos secret.
- [ ] Payment settings tidak menampilkan API key asli.
- [ ] Update settings bekerja atau dinyatakan belum dipakai.
- [ ] Route settings nested tidak konflik dengan `{key}`.

## 5. System UAT

### Realtime

- [ ] Reverb process running.
- [ ] `/realtime/auth` mengembalikan auth untuk channel valid.
- [ ] Customer session owner bisa subscribe `order.{id}`.
- [ ] Customer lain ditolak subscribe `order.{id}`.
- [ ] Staff/admin bisa subscribe `staff-orders`.
- [ ] Guest ditolak subscribe `staff-orders`.
- [ ] Payment update terkirim ke customer.
- [ ] Staff/admin tetap update lewat polling saat Reverb down.

### Payment Webhook

- [ ] Pakasir webhook URL public HTTPS.
- [ ] Valid QRIS webhook diterima.
- [ ] Valid BRI VA webhook diterima.
- [ ] Duplicate webhook idempotent.
- [ ] Invalid amount ditolak.
- [ ] Invalid project ditolak.
- [ ] Unknown order ditolak.
- [ ] Raw provider payload tidak tampil di customer API.

### AI Service

- [ ] `GET /health` ok.
- [ ] Estimation predict ok.
- [ ] Popular menu ok atau fallback.
- [ ] Sentiment analyze ok atau fallback.
- [ ] Missing/corrupt model scenario tidak mematikan service di staging test.

### Production Env

- [ ] `APP_ENV=production`.
- [ ] `APP_DEBUG=false`.
- [ ] `DB_CONNECTION=pgsql`.
- [ ] `PAYMENT_GATEWAY=pakasir`.
- [ ] `PAKASIR_MODE=production` untuk go-live.
- [ ] `BROADCAST_CONNECTION=reverb`.
- [ ] Queue worker running.
- [ ] Scheduler running.
- [ ] Redis running.
- [ ] PostgreSQL tidak publish public port.
- [ ] Redis tidak publish public port.

### Backup

- [ ] Backup harian berjalan.
- [ ] Backup tersimpan di lokasi eksternal.
- [ ] Backup terenkripsi.
- [ ] Restore drill berhasil di non-production.
- [ ] Backup freshness alert tersedia.

## 6. Test Commands

```bash
php artisan test
npm run build
```

Windows PowerShell:

```bash
npm.cmd run build
```

Focused:

```bash
php artisan test --filter=PakasirPaymentTest
php artisan test --filter=CustomerOrderAccessTest
php artisan test --filter=OrderIntegrityTest
php artisan test --filter=ReviewStatisticsTest
php artisan test --filter=AiServiceFallbackTest
```

## 7. UAT Sign-Off

Perlu dikonfirmasi sebelum production:

- Semua critical checklist customer/staff/admin lulus.
- Pakasir webhook sudah diuji dengan URL final.
- Reverb diuji end-to-end.
- FastAPI online dan fallback diuji.
- Backup/restore drill lulus.
- Monitoring/alerting minimal aktif.
- Known issues yang diterima sudah dicatat oleh owner project.

