# UCW App Deployment Guide: Render + Supabase

Dokumentasi ini digunakan untuk deploy demo/UAT gratis UCW App menggunakan Render dan Supabase. Targetnya adalah aplikasi bisa online untuk presentasi, smoke test, dan UAT awal tanpa mengubah arsitektur Laravel Inertia yang sudah ada.

Panduan ini bukan panduan production final. Untuk production serius, tetap siapkan worker permanen, scheduler, monitoring, backup, log retention, dan hardening webhook.

---

## 1. Deployment Architecture

```text
Customer/Admin/Staff Browser
        |
        v
Render Laravel Web Service
        |
        v
Supabase PostgreSQL
        |
        v
Render FastAPI AI Service
        |
        v
Pakasir Sandbox Webhook
```

Komponen deployment:

- Render Laravel Web Service menjalankan Laravel 12, Inertia, React TypeScript, dan hasil build Vite.
- Supabase PostgreSQL menjadi database demo/UAT.
- Render FastAPI Web Service menjalankan AI service dari folder `ai_service`.
- Pakasir Sandbox dipakai dulu untuk test QRIS dan BRI VA.
- Realtime demo memakai polling fallback yang sudah tersedia di UI customer/staff/admin.
- Laravel Reverb/Echo tersedia di project, tetapi tidak wajib untuk demo gratis.

Mode demo yang direkomendasikan:

```text
BROADCAST_CONNECTION=log
CACHE_STORE=database
QUEUE_CONNECTION=database
SESSION_DRIVER=database
PAYMENT_GATEWAY=pakasir
PAKASIR_MODE=sandbox
```

---

## 2. Why Not Vercel?

Vercel tidak dipakai sebagai pilihan utama karena project ini memakai Laravel Inertia, bukan React SPA terpisah.

Alasannya:

- React frontend dibuild oleh Vite dan disajikan dari Laravel.
- Routing internal memakai Inertia/Laravel route.
- Auth, session, CSRF, dan form action bergantung pada Laravel web app.
- Jika React dipisah ke Vercel, perlu perubahan besar pada routing, auth, CSRF, API contract, dan asset handling.
- Untuk demo, lebih aman deploy Laravel + Inertia sebagai satu aplikasi di Render.

Railway boleh dipertimbangkan sebagai alternatif hosting all-in-one, tetapi untuk panduan ini Render + Supabase adalah rekomendasi utama.

---

## 3. Required Accounts

Checklist akun:

- [ ] GitHub
- [ ] Render
- [ ] Supabase
- [ ] Pakasir
- [ ] Custom domain, opsional

Checklist akses:

- [ ] Repository UCW App sudah ada di GitHub.
- [ ] Akun Render dapat membaca repository.
- [ ] Akun Supabase dapat membuat project PostgreSQL.
- [ ] Akun Pakasir memiliki sandbox credential.

---

## 4. Pre-Deployment Checklist

Sebelum deploy:

- [ ] Semua perubahan sudah di-push ke GitHub.
- [ ] Branch deployment sudah jelas, misalnya `develop` atau `main`.
- [ ] `.env.example` aman dan tidak berisi secret asli.
- [ ] `.env.production.example` tersedia.
- [ ] `composer install` lokal aman.
- [ ] `npm run build` lokal berhasil.
- [ ] Test penting Laravel berhasil.
- [ ] AI service bisa jalan lokal.
- [ ] Pakasir sandbox credential tersedia.
- [ ] Supabase project siap dibuat.
- [ ] Tidak ada secret asli di dokumentasi, commit, atau issue tracker.

Command lokal:

```bash
composer install
npm install
npm run build
php artisan test
```

Untuk Windows PowerShell:

```bash
npm.cmd run build
```

Focused test yang disarankan sebelum demo:

```bash
php artisan test --filter=PakasirPaymentTest
php artisan test --filter=CustomerOrderAccessTest
php artisan test --filter=OrderIntegrityTest
php artisan test --filter=AiServiceFallbackTest
```

---

## 5. Setup Supabase PostgreSQL

Langkah:

1. Login ke Supabase.
2. Buat project baru.
3. Buka halaman database connection settings.
4. Ambil database connection detail.
5. Catat host, port, database, username, dan password.
6. Gunakan PostgreSQL connection untuk Laravel.

Contoh env Laravel:

```env
DB_CONNECTION=pgsql
DB_HOST=<SUPABASE_DB_HOST>
DB_PORT=5432
DB_DATABASE=<SUPABASE_DB_NAME>
DB_USERNAME=<SUPABASE_DB_USER>
DB_PASSWORD=<SUPABASE_DB_PASSWORD>
DB_SSLMODE=require
```

Catatan:

- Jangan expose password Supabase di dokumentasi, screenshot publik, atau commit.
- Pastikan database Supabase bisa diakses dari Render.
- Jika Supabase menyediakan beberapa connection mode, gunakan connection yang paling cocok untuk aplikasi web demo.
- Jika connection direct tidak stabil atau dibatasi, cek opsi pooler dari Supabase dan sesuaikan host/port/username sesuai dashboard.
- Jika Supabase memakai SSL, gunakan `DB_SSLMODE=require` atau nilai SSL yang sesuai.
- Untuk demo awal dengan database kosong, migration Laravel aman dijalankan.

---

## 6. Deploy FastAPI AI Service to Render

Deploy AI service lebih dulu agar URL-nya bisa dipakai pada env Laravel.

Langkah:

1. Login ke Render.
2. Buat Web Service baru.
3. Connect GitHub repository UCW App.
4. Pilih branch deployment.
5. Set root directory:

```text
ai_service
```

6. Set build command:

```bash
pip install -r requirements.txt
```

7. Set start command:

```bash
python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

8. Tambahkan environment variables AI service jika diperlukan.

Minimal env AI service untuk demo:

```env
PYTHONUNBUFFERED=1
DB_CONNECTION=pgsql
DB_HOST=<SUPABASE_DB_HOST>
DB_PORT=5432
DB_DATABASE=<SUPABASE_DB_NAME>
DB_USERNAME=<SUPABASE_DB_USER>
DB_PASSWORD=<SUPABASE_DB_PASSWORD>
```

Jika Supabase membutuhkan SSL dan AI service gagal connect database, perlu dikonfirmasi apakah SQLAlchemy URL di `ai_service/config.py` perlu parameter SSL. Untuk demo, AI tetap bisa fallback jika database tidak tersedia, tetapi popular menu/sentiment summary live dapat kosong/fallback.

9. Setelah deploy, cek health:

```text
https://<ai-service-name>.onrender.com/health
```

Expected result:

- `status` service ok.
- Estimation model status loaded atau fallback reason jelas.
- Sentiment model status loaded atau fallback reason jelas.
- Database status ok jika env database benar.
- Jika database unavailable, service tetap hidup dan Laravel tetap punya fallback.

Troubleshooting:

- `uvicorn not found`: pastikan build command menjalankan `pip install -r requirements.txt`.
- Missing dependency: cek `ai_service/requirements.txt` dan Render build log.
- Model file missing: cek folder `ai_service/saved_models` ikut ter-push ke GitHub jika memang dibutuhkan untuk demo.
- Database connection failed: cek Supabase host, port, username, password, SSL, dan Render env.
- Service sleeping/cold start: Render free service dapat sleep; akses pertama bisa lambat.

---

## 7. Deploy Laravel + Inertia App to Render

Langkah:

1. Login ke Render.
2. Buat Web Service baru.
3. Connect GitHub repository UCW App.
4. Pilih branch deployment.
5. Set root directory ke root project.
6. Pilih environment yang sesuai untuk PHP/Laravel atau Docker sesuai opsi di bawah.

### Option A: Manual Build Command untuk Demo

Opsi ini paling sederhana untuk demo/UAT gratis.

Build command:

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

Start command:

```bash
php artisan serve --host 0.0.0.0 --port $PORT
```

Catatan:

- Ini cukup untuk demo/UAT gratis.
- Ini bukan setup production paling ideal karena tidak memakai Nginx + PHP-FPM.
- Render free instance bisa sleep, sehingga akses pertama bisa lambat.
- Jika build gagal karena Node/PHP version, set version runtime di Render sesuai kebutuhan project.

### Option B: Docker Production Setup

Repo sudah memiliki Docker-related files:

```text
docker/php/Dockerfile
docker/nginx/default.conf
docker/nginx/nginx.conf
docker/php/supervisord.conf
ai_service/Dockerfile
docker-compose.yml
```

Gunakan Docker jika konfigurasi sudah matang dan platform deployment mendukung kebutuhan multi-process dengan jelas.

Catatan:

- Untuk production serius lebih baik gunakan Nginx + PHP-FPM + Supervisor.
- Untuk demo cepat gratis, Option A lebih sederhana.
- Docker Compose lokal di repo berisi beberapa service, sedangkan Render Web Service biasanya menjalankan satu service per deploy. Jangan menganggap seluruh `docker-compose.yml` otomatis jalan di satu Render Web Service.

---

## 8. Laravel Environment Variables on Render

Set env berikut di Render Laravel Web Service.

```env
APP_NAME="UCW App"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://<laravel-app-name>.onrender.com
APP_KEY=<GENERATED_APP_KEY>

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=<SUPABASE_DB_HOST>
DB_PORT=5432
DB_DATABASE=<SUPABASE_DB_NAME>
DB_USERNAME=<SUPABASE_DB_USER>
DB_PASSWORD=<SUPABASE_DB_PASSWORD>
DB_SSLMODE=require

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

CACHE_STORE=database
QUEUE_CONNECTION=database

FILESYSTEM_DISK=local

PAYMENT_GATEWAY=pakasir
PAKASIR_MODE=sandbox
PAKASIR_PROJECT=<PAKASIR_PROJECT>
PAKASIR_API_KEY=<PAKASIR_API_KEY>
PAKASIR_BASE_URL=<PAKASIR_BASE_URL>

AI_SERVICE_URL=https://<ai-service-name>.onrender.com
AI_SERVICE_TIMEOUT=10

BROADCAST_CONNECTION=log

VITE_APP_NAME="${APP_NAME}"
```

Catatan:

- `APP_DEBUG=false` wajib untuk demo online.
- `APP_KEY` harus valid.
- `APP_URL` harus URL Render Laravel.
- `AI_SERVICE_URL` harus URL Render FastAPI.
- Pakasir mulai dari sandbox dulu.
- `BROADCAST_CONNECTION=log` boleh untuk demo karena polling fallback tersedia.
- Untuk demo gratis tanpa Redis, gunakan `CACHE_STORE=database` dan `QUEUE_CONNECTION=database`.
- Jika session bermasalah di browser, cek `APP_URL`, `SESSION_DOMAIN`, `SESSION_DRIVER`, dan HTTPS URL.
- Jangan set `PAYMENT_GATEWAY=midtrans` untuk demo ini.

---

## 9. Generate APP_KEY

Generate APP_KEY dari lokal:

```bash
php artisan key:generate --show
```

Copy hasilnya ke Render environment variable:

```env
APP_KEY=base64:<generated-key>
```

Catatan:

- Jangan commit APP_KEY.
- Jangan menaruh APP_KEY di dokumentasi publik.
- Jika APP_KEY berubah setelah ada session/data encrypted, session lama bisa invalid.

---

## 10. Database Migration and Storage Link

Jalankan dari Render Shell untuk Laravel service:

```bash
php artisan migrate --force
php artisan storage:link
```

Jika ada seeder demo dan sudah dipastikan aman:

```bash
php artisan db:seed --force
```

Catatan:

- Jalankan seeder hanya jika memang aman.
- Jangan jalankan fresh migration di database berisi data penting.
- Untuk demo awal database kosong, migration aman.
- `storage:link` diperlukan agar upload/gambar menu yang berada di storage public bisa diakses.
- Render filesystem pada free service dapat bersifat ephemeral untuk file runtime tertentu. Untuk demo, upload lokal bisa cukup; untuk production serius gunakan object storage.

---

## 11. Queue and Scheduler for Free Demo

Untuk demo gratis:

- `QUEUE_CONNECTION=database` cukup.
- Jika tidak ada worker permanen, job queue mungkin tidak otomatis berjalan.
- Banyak flow utama tetap berjalan karena order/payment/status utama diproses synchronously.
- AI sentiment saat ini dapat dipanggil langsung oleh controller, tetapi job background tetap perlu worker jika dipakai.

Jalankan manual dari Render Shell jika diperlukan:

```bash
php artisan queue:work --stop-when-empty
```

Untuk production serius:

- Gunakan worker terpisah.
- Gunakan scheduler.
- Gunakan Supervisor, systemd, Render paid worker, VPS, atau managed worker.
- Monitor failed jobs.

---

## 12. Pakasir Sandbox Setup

Langkah:

1. Login ke dashboard Pakasir.
2. Gunakan credential sandbox.
3. Set env Laravel:

```env
PAYMENT_GATEWAY=pakasir
PAKASIR_MODE=sandbox
PAKASIR_PROJECT=<PAKASIR_PROJECT>
PAKASIR_API_KEY=<PAKASIR_API_KEY>
PAKASIR_BASE_URL=https://app.pakasir.com
```

4. Set webhook URL:

```text
https://<laravel-app-name>.onrender.com/api/webhooks/pakasir
```

5. Test QRIS.
6. Test BRI VA.
7. Pastikan payment status berubah.
8. Pastikan customer tidak melihat raw provider payload.

Catatan:

- Jangan langsung production payment asli sebelum UAT selesai.
- Setelah demo aman, baru ganti ke credential production Pakasir.
- Webhook Pakasir di Laravel ada di `POST /api/webhooks/pakasir`.
- Route simulation Pakasir hanya untuk local/testing/non-production sandbox sesuai guard aplikasi; jangan bergantung pada simulation route untuk demo public jika tidak tersedia.
- Midtrans tetap future gateway dan tidak dipakai sekarang.

---

## 13. Realtime Strategy for Demo

Project sudah mendukung Laravel Reverb/private channel:

- `NewOrderPlaced`
- `OrderStatusUpdated`
- `PaymentStatusUpdated`
- Private channel `order.{id}`
- Private channel `staff-orders`
- Private channel `staff-payments`

Untuk demo gratis:

- WebSocket boleh ditunda.
- Polling fallback cukup untuk memastikan order status/payment status tetap update.
- `BROADCAST_CONNECTION=log` dapat dipakai untuk demo.
- Reverb bisa diaktifkan nanti jika hosting mendukung long-running WebSocket process.

Jika nanti mengaktifkan Reverb:

- Siapkan service terpisah untuk `php artisan reverb:start`.
- Set `BROADCAST_CONNECTION=reverb`.
- Set `REVERB_APP_ID`, `REVERB_APP_KEY`, `REVERB_APP_SECRET`.
- Set `VITE_REVERB_*`.
- Uji `/realtime/auth` dan private channel authorization.

---

## 14. Smoke Test Checklist

### Customer

- [ ] Landing/menu terbuka.
- [ ] Tambah item ke cart.
- [ ] Update quantity.
- [ ] Pilih dine-in.
- [ ] Pilih takeaway.
- [ ] Buat order.
- [ ] Pilih QRIS Pakasir.
- [ ] Pilih BRI VA Pakasir.
- [ ] Pilih cash.
- [ ] Status order update melalui polling.
- [ ] Feedback/review berhasil.
- [ ] Customer tidak bisa akses order dari session berbeda.

### Staff

- [ ] Login staff.
- [ ] Dashboard order tampil.
- [ ] Search order bekerja.
- [ ] Verify cash.
- [ ] Update status order.
- [ ] Transactions terbuka.
- [ ] Export transaksi berjalan.

### Admin

- [ ] Login admin.
- [ ] Overview terbuka.
- [ ] Live order terbuka.
- [ ] Menu CRUD.
- [ ] Category CRUD.
- [ ] Staff/admin CRUD.
- [ ] Finance terbuka.
- [ ] Export finance/staff/feedback berjalan.
- [ ] AI analytics terbuka.
- [ ] Settings tidak dipakai untuk demo kecuali sudah smoke-tested.

### System

- [ ] Laravel app online.
- [ ] `/api/health` Laravel online.
- [ ] Supabase connected.
- [ ] FastAPI `/health` online.
- [ ] AI analytics fallback aman.
- [ ] Pakasir webhook masuk.
- [ ] CSRF normal.
- [ ] Session normal.
- [ ] Tidak ada debug error page.
- [ ] Tidak ada raw provider response exposed.

---

## 15. Troubleshooting

### APP_KEY missing

Gejala:

- Laravel gagal boot.
- Error encryption key missing.

Solusi:

```bash
php artisan key:generate --show
```

Set di Render:

```env
APP_KEY=base64:<generated-key>
```

### Vite manifest not found

Gejala:

- Laravel error manifest tidak ditemukan.
- UI asset tidak load.

Solusi:

- Pastikan build command menjalankan `npm ci`.
- Pastikan build command menjalankan `npm run build`.
- Cek folder `public/build` terbentuk saat build.
- Cek Render build log untuk error TypeScript/Vite.

### Database connection failed

Gejala:

- Migration gagal.
- App error saat query.
- AI `/health` database unavailable.

Solusi:

- Cek `DB_HOST`.
- Cek `DB_PORT`.
- Cek `DB_DATABASE`.
- Cek `DB_USERNAME`.
- Cek `DB_PASSWORD`.
- Cek `DB_SSLMODE`.
- Pastikan Supabase menerima connection dari Render.
- Jika memakai pooler, pastikan host/port/username sesuai format Supabase.

### Migration failed

Solusi:

- Cek Render Shell output.
- Cek permission user database.
- Cek migration yang gagal.
- Pastikan database belum berisi constraint/data konflik.
- Untuk demo kosong, reset database hanya jika tidak ada data penting.
- Jangan menjalankan destructive command pada database yang sudah berisi data UAT penting.

### AI service fallback mode

Solusi:

- Cek AI service Render aktif.
- Buka:

```text
https://<ai-service-name>.onrender.com/health
```

- Cek `AI_SERVICE_URL` di Laravel.
- Cek Render cold start.
- Cek Render logs.
- Cek model files di `ai_service/saved_models`.
- Cek env database AI service jika endpoint popular/sentiment summary butuh data.

Catatan:

- Fallback mode tidak selalu blocker demo.
- Pastikan UI/penjelasan demo menyatakan AI fallback jika FastAPI/model/database belum ready.

### Pakasir webhook not received

Solusi:

- Cek webhook URL di dashboard Pakasir:

```text
https://<laravel-app-name>.onrender.com/api/webhooks/pakasir
```

- Cek route `POST /api/webhooks/pakasir`.
- Cek env `PAKASIR_PROJECT`.
- Cek env `PAKASIR_API_KEY`.
- Cek env `PAKASIR_MODE=sandbox`.
- Cek Render logs Laravel.
- Pastikan URL public HTTPS.
- Pastikan order amount dan order ref cocok.

### CSRF token mismatch

Solusi:

- Clear browser/session.
- Cek `APP_URL`.
- Cek `SESSION_DRIVER=database`.
- Pastikan tabel `sessions` sudah ada dari migration.
- Cek request frontend memakai axios/Inertia normal.
- Jangan masukkan customer form normal ke CSRF exception.
- Pastikan akses memakai domain Render yang sama, bukan mix custom domain dan onrender domain.

### Render cold start

Solusi:

- Tunggu beberapa detik saat akses pertama.
- Refresh halaman.
- Buka AI `/health` dulu sebelum demo AI Analytics.
- Untuk production serius gunakan paid hosting atau service yang tidak sleep.

### Queue not processing

Solusi:

```bash
php artisan queue:work --stop-when-empty
```

Untuk production:

- Gunakan worker terpisah.
- Monitor failed jobs.
- Jangan bergantung pada manual shell command.

---

## 16. Free Hosting Limitations

Risiko hosting gratis:

- Service bisa sleep.
- Cold start saat akses pertama.
- Resource CPU/RAM terbatas.
- Worker/scheduler tidak stabil atau tidak permanen.
- WebSocket/Reverb belum ideal.
- File upload runtime bisa terbatas/ephemeral.
- Tidak cocok untuk production traffic serius.
- Cocok untuk demo, UAT, dan presentasi.

Mitigasi demo:

- Buka Laravel URL beberapa menit sebelum presentasi.
- Buka AI `/health` sebelum membuka AI Analytics.
- Siapkan data demo di Supabase.
- Gunakan polling fallback.
- Pakai Pakasir sandbox.

---

## 17. Production Upgrade Path

Jika nanti naik production serius:

- Gunakan VPS, Render paid, atau Railway paid.
- Gunakan Nginx + PHP-FPM.
- Gunakan PostgreSQL managed.
- Gunakan Redis.
- Jalankan queue worker permanen.
- Jalankan scheduler.
- Jalankan Reverb service.
- Tambahkan backup otomatis.
- Tambahkan monitoring.
- Tambahkan log retention.
- Gunakan custom domain.
- Pastikan SSL aktif.
- Ganti ke Pakasir production credential setelah UAT lulus.
- Tambahkan webhook security tambahan jika Pakasir menyediakan signature/timestamp/nonce.
- Tambahkan payment expiry/reconciliation job.
- Tambahkan restore drill dan alert backup freshness.

---

## 18. Final Deployment Order

1. Push repo terbaru ke GitHub.
2. Buat Supabase PostgreSQL.
3. Deploy FastAPI AI service ke Render.
4. Cek FastAPI `/health`.
5. Deploy Laravel + Inertia app ke Render.
6. Set Laravel env di Render.
7. Generate APP_KEY.
8. Run migration.
9. Run storage link.
10. Set Pakasir sandbox webhook.
11. Smoke test customer.
12. Smoke test staff.
13. Smoke test admin.
14. UAT payment sandbox.
15. Update progress report.

---

## 19. Deployment Status Template

```markdown
## Deployment Status

Date:
Branch:
Commit Hash:
Laravel URL:
AI Service URL:
Database Provider:
Payment Mode:
Realtime Mode:

### Result
- [ ] Laravel app online
- [ ] Database connected
- [ ] Migration completed
- [ ] AI service online
- [ ] Pakasir webhook configured
- [ ] Customer flow tested
- [ ] Staff flow tested
- [ ] Admin flow tested

### Known Issues
-

### Next Step
-
```

