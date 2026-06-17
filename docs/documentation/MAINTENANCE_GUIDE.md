# Maintenance Guide

## 1. Routine Operations

Komponen yang perlu dijaga:

- Laravel app.
- PostgreSQL.
- Redis.
- Queue worker.
- Scheduler.
- Reverb.
- FastAPI AI service.
- Nginx/SSL.
- Pakasir webhook.
- Storage uploads.
- Backups and logs.

## 2. Add or Update Menu

Via Admin UI:

1. Login sebagai admin.
2. Buka `/admin/menu`.
3. Tambah atau edit menu.
4. Isi category, name, description, price, estimated time, availability, image.
5. Simpan.
6. Smoke test di `/customer/menu`.

Catatan:

- Jangan update harga langsung dari database kecuali darurat dan tercatat.
- Order baru akan memakai harga terbaru.
- Order lama tetap memakai snapshot `unit_price` dan `subtotal`.
- Delete menu tidak boleh menghapus histori order detail.

## 3. Add Staff/Admin

Via Admin UI:

1. Login admin.
2. Buka `/admin/staff`.
3. Tambah user.
4. Pilih role `staff` atau `admin`.
5. Set password awal.
6. Pastikan user mengganti password sesuai SOP jika fitur tersedia.
7. Pastikan `is_active=true`.

Catatan:

- Nonaktifkan user yang keluar tim.
- Jangan memakai password seed/default di production.

## 4. Check Logs

Laravel:

```bash
tail -f storage/logs/laravel.log
```

Docker:

```bash
docker compose logs -f app
docker compose logs -f nginx
docker compose logs -f queue
docker compose logs -f scheduler
docker compose logs -f reverb
docker compose logs -f ai-service
```

Hal yang dicari:

- Repeated 5xx.
- Validation error yang berulang.
- Pakasir webhook failure.
- AI service timeout.
- Queue failed jobs.
- Reverb auth/channel error.

## 5. Check Queue

Worker:

```bash
docker compose ps queue
docker compose logs -f queue
```

Manual:

```bash
php artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
```

Failed jobs:

```bash
php artisan queue:failed
```

Retry failed job:

```bash
php artisan queue:retry <id>
```

Catatan:

- Investigasi root cause sebelum retry massal.
- Jika job menyentuh payment, pastikan idempotency aman.

## 6. Check Scheduler

Docker:

```bash
docker compose ps scheduler
docker compose logs -f scheduler
```

Manual run:

```bash
php artisan schedule:run --verbose --no-interaction
```

Catatan:

- Payment expiry/reconciliation belum terlihat sebagai job production final. Jika ditambahkan, monitor scheduler wajib.

## 7. Check Reverb

Docker:

```bash
docker compose ps reverb
docker compose logs -f reverb
```

Manual:

```bash
php artisan reverb:start --host=0.0.0.0 --port=8080
```

Frontend env yang harus cocok:

```text
VITE_REVERB_APP_KEY
VITE_REVERB_HOST
VITE_REVERB_PORT
VITE_REVERB_SCHEME
```

Backend env:

```text
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=<REVERB_APP_ID>
REVERB_APP_KEY=<REVERB_APP_KEY>
REVERB_APP_SECRET=<REVERB_APP_SECRET>
```

Smoke test:

- Customer owner session subscribe `order.{id}`.
- Customer non-owner ditolak.
- Staff/admin subscribe `staff-orders`.
- Update order status terlihat di customer.

## 8. Check AI Service

Health:

```text
http://127.0.0.1:8000/health
```

Docker:

```bash
docker compose ps ai-service
docker compose logs -f ai-service
```

Manual:

```bash
cd ai_service
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Checks:

- `status=ok`.
- Estimation model loaded atau fallback reason jelas.
- Sentiment model/vectorizer loaded atau fallback reason jelas.
- Database status ok.

Catatan:

- Jika AI down, Laravel fallback tetap berjalan.
- Admin AI Analytics mungkin menampilkan fallback/demo label.
- Jangan mengganti `.pkl` dari sumber tidak terpercaya.

## 9. Check Pakasir Webhook

Env:

```text
PAYMENT_GATEWAY=pakasir
PAKASIR_PROJECT=<PAKASIR_PROJECT>
PAKASIR_API_KEY=<PAKASIR_API_KEY>
PAKASIR_MODE=production
PAKASIR_BASE_URL=https://app.pakasir.com
```

Webhook:

```text
https://your-domain.example/api/webhooks/pakasir
```

Checklist:

- Webhook endpoint reachable over HTTPS.
- Pakasir dashboard memakai URL final.
- Laravel log tidak mencatat invalid project/amount/order untuk transaksi valid.
- Duplicate webhook tidak membuat payment double.
- Customer API tidak menampilkan raw webhook.

Jika webhook gagal:

1. Cek Nginx access/error log.
2. Cek Laravel log.
3. Cek env Pakasir project/API key.
4. Cek order_ref dan amount.
5. Cek transaction detail ke Pakasir.
6. Jangan mark paid manual tanpa audit trail.

## 10. Backup Database

PostgreSQL backup:

```bash
pg_dump --format=custom --no-owner --no-acl --file=/backups/ucw_YYYY-MM-DD_HHMM.dump "$DATABASE_URL"
```

Checklist:

- Backup terenkripsi.
- Backup keluar dari server/container.
- Retention minimal disepakati.
- Backup timestamp dicatat.
- Backup freshness dimonitor.

## 11. Restore Database

Procedure:

1. Umumkan maintenance window jika production.
2. Stop queue, scheduler, Reverb.
3. Pastikan target restore benar.
4. Restore:

```bash
pg_restore --clean --if-exists --no-owner --dbname="$DATABASE_URL" /backups/ucw_YYYY-MM-DD_HHMM.dump
```

5. Jalankan smoke test.
6. Restart services.
7. Catat incident/restore report.

Smoke test setelah restore:

- Login admin.
- Login staff.
- Customer menu.
- Create order test.
- Payment status.
- Staff update status.
- Admin overview.
- AI health/fallback.

## 12. Rollback

Principles:

- Jangan rollback database destruktif tanpa backup.
- Rollback app code harus cocok dengan schema.
- Jika migration sudah berjalan, cek apakah migration backward aman.
- Payment-related rollback harus ekstra hati-hati karena webhook bisa masuk saat rollback.

Safe rollback outline:

1. Put app into maintenance mode bila perlu.
2. Stop queue/scheduler sementara.
3. Backup database current state.
4. Deploy previous known-good app image/commit.
5. Jangan otomatis `migrate:rollback` kecuali migration dipastikan aman.
6. Clear/cache config route view jika perlu.
7. Smoke test.
8. Restart queue/scheduler.

Commands:

```bash
php artisan down
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan up
```

## 13. Update Dependencies

Backend:

```bash
composer outdated
composer update --dry-run
php artisan test
```

Frontend:

```bash
npm outdated
npm audit
npm run build
```

Windows PowerShell:

```bash
npm.cmd run build
```

Guidelines:

- Jangan update dependency besar langsung di production branch.
- Test customer/staff/admin critical flow.
- Perhatikan React/Inertia/Tailwind major changes.
- Perhatikan Laravel/Reverb changes.

## 14. Run Tests

Full:

```bash
php artisan test
npm run build
```

Focused:

```bash
php artisan test --filter=PakasirPaymentTest
php artisan test --filter=CustomerOrderAccessTest
php artisan test --filter=OrderIntegrityTest
php artisan test --filter=ReviewStatisticsTest
php artisan test --filter=AiServiceFallbackTest
php artisan test --filter=StaffTransactionsAccessTest
php artisan test --filter=MenuCategoryManagementTest
php artisan test --filter=StaffExportTest
```

Coverage tersedia:

- Pakasir create QRIS/BRI VA, webhook, idempotency, simulation guard.
- Customer order ownership dan sanitized response.
- Order integrity snapshot/menu delete/review unique/revenue.
- Review statistics.
- AI Laravel fallback.
- Admin menu/category.
- Admin staff export.
- Staff transactions access.

## 15. Operational Known Risks

- Payment expiry/reconciliation belum otomatis.
- Pakasir signature/replay hardening perlu ditambahkan bila provider mendukung.
- Observability/alerting production perlu dipasang.
- Full browser E2E belum lengkap.
- Admin Settings perlu smoke test.
- Frontend inline style cleanup masih pending.
- Legacy staff dashboard controller cleanup perlu konfirmasi.

## 16. Emergency Contacts and Ownership

Perlu dikonfirmasi oleh tim:

- Owner server/VPS.
- Owner domain/SSL.
- Owner Pakasir dashboard.
- Owner database backup.
- Owner AI model artifact.
- Owner production incident response.

