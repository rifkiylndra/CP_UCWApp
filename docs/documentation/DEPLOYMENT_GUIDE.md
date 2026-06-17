# Deployment Guide

## 1. Scope

Panduan ini untuk production preparation dan deployment UCW App. Production payment gateway aktif adalah Pakasir. Midtrans tetap future gateway dan tidak aktif selama `PAYMENT_GATEWAY=pakasir`.

Target deployment yang tersedia di repo:

- Docker Compose.
- Nginx.
- PHP-FPM.
- Supervisor.
- PostgreSQL.
- Redis.
- Laravel queue worker.
- Laravel scheduler.
- Laravel Reverb.
- FastAPI AI service.

## 2. Production Environment

Mulai dari template:

```bash
cp .env.production.example .env
```

Isi value production di luar version control:

```text
APP_KEY=<APP_KEY>
APP_URL=https://your-domain.example
DB_PASSWORD=<DB_PASSWORD>
POSTGRES_PASSWORD=<POSTGRES_PASSWORD>
PAKASIR_PROJECT=<PAKASIR_PROJECT>
PAKASIR_API_KEY=<PAKASIR_API_KEY>
REVERB_APP_KEY=<REVERB_APP_KEY>
REVERB_APP_SECRET=<REVERB_APP_SECRET>
```

Nilai penting:

```text
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=pgsql
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=database
BROADCAST_CONNECTION=reverb
PAYMENT_GATEWAY=pakasir
PAKASIR_MODE=production
AI_SERVICE_URL=http://ai-service:8000
```

Jangan gunakan SQLite untuk production.

## 3. Docker Compose Services

Service utama:

- `postgres`: PostgreSQL 15 internal network.
- `redis`: Redis 7 internal network.
- `app`: Laravel PHP-FPM.
- `nginx`: web server publik port 80/443.
- `queue`: `php artisan queue:work redis`.
- `scheduler`: loop `php artisan schedule:run`.
- `reverb`: WebSocket server.
- `ai-service`: FastAPI service port 8000.

Service dev:

- `node`: Vite dev server profile `dev`.
- `mailhog`: mail testing profile `dev`.

Jalankan production stack:

```bash
docker compose up -d postgres redis app nginx queue scheduler reverb ai-service
```

Catatan security:

- Compose utama tidak publish PostgreSQL `5432` atau Redis `6379` ke host.
- Jika butuh akses lokal, gunakan `docker-compose.override.yml` yang tidak di-commit.

## 4. Build and One-Time Setup

Jika memakai image Docker repo:

- `docker/php/Dockerfile` menjalankan `composer install --no-dev`, `npm install`, dan `npm run build`.
- `docker/node/Dockerfile` untuk dev profile.
- `ai_service/Dockerfile` menginstall dependency Python dan menjalankan uvicorn.

One-time Laravel setup:

```bash
docker compose exec app php artisan key:generate --force
docker compose exec app php artisan migrate --force
docker compose exec app php artisan storage:link
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache
docker compose exec app php artisan event:cache
```

Jika deploy non-Docker:

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

Windows PowerShell untuk build lokal:

```bash
npm.cmd run build
```

## 5. Nginx

File:

- `docker/nginx/nginx.conf`
- `docker/nginx/default.conf`

Behavior:

- Root: `/var/www/html/public`.
- Laravel request: `try_files $uri $uri/ /index.php?$query_string`.
- PHP: `fastcgi_pass app:9000`.
- WebSocket/Reverb: `/app/` proxy ke `http://reverb:8080`.
- Security headers dasar:
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`

Production:

- Pasang SSL valid.
- Pastikan `REVERB_HOST`, `REVERB_PORT`, dan `REVERB_SCHEME` sesuai domain HTTPS.

## 6. Runtime Processes

Queue:

```bash
php artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
```

Scheduler:

```bash
php artisan schedule:run --verbose --no-interaction
```

Reverb:

```bash
php artisan reverb:start --host=0.0.0.0 --port=8080
```

FastAPI:

```bash
cd ai_service
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Supervisor:

- `docker/php/supervisord.conf` saat ini menjalankan PHP-FPM.
- Queue/scheduler/Reverb dipisah sebagai service Compose.
- Untuk non-Docker VPS, bisa memakai Supervisor/systemd per process.

## 7. Pakasir Setup

Env:

```text
PAYMENT_GATEWAY=pakasir
PAKASIR_PROJECT=<PAKASIR_PROJECT>
PAKASIR_API_KEY=<PAKASIR_API_KEY>
PAKASIR_MODE=production
PAKASIR_BASE_URL=https://app.pakasir.com
```

Webhook URL:

```text
https://your-domain.example/api/webhooks/pakasir
```

Smoke test:

- Create order.
- Create QRIS.
- Create BRI VA.
- Confirm payment row created.
- Trigger real/sandbox webhook sesuai environment.
- Confirm duplicate webhook idempotent.
- Confirm invalid project/amount/order rejected.

Security:

- Jika Pakasir mendukung signature/HMAC, timestamp, atau nonce, tambahkan sebelum go-live.
- Jangan expose route simulation di production. Repo hanya mendaftarkan route simulation untuk local/testing/non-production sandbox.

## 8. FastAPI AI Service

Local:

```bash
cd ai_service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Docker:

```bash
docker compose up -d ai-service
```

Health check:

```text
http://127.0.0.1:8000/health
```

Production internal health:

```bash
docker compose exec ai-service python -c "import urllib.request; print(urllib.request.urlopen('http://127.0.0.1:8000/health').status)"
```

Catatan:

- AI down tidak boleh memblokir order flow karena Laravel fallback tersedia.
- Admin AI Analytics perlu label fallback/demo jika service/model tidak ready.

## 9. Backup

Daily PostgreSQL backup:

```bash
pg_dump --format=custom --no-owner --no-acl --file=/backups/ucw_YYYY-MM-DD_HHMM.dump "$DATABASE_URL"
```

Checklist:

- Backup disimpan di luar container/app disk.
- Backup dienkripsi sebelum external storage.
- Simpan minimal 7 daily dan 4 weekly untuk awal production/UAT.
- Catat timestamp, database, commit/checkpoint, dan operator.
- Test restore ke non-production.

## 10. Restore

Procedure:

1. Stop queue, scheduler, Reverb, dan proses yang bisa menulis data.
2. Pastikan target restore adalah non-production atau production yang sudah disetujui.
3. Buat database baru atau bersihkan target sesuai SOP.
4. Restore:

```bash
pg_restore --clean --if-exists --no-owner --dbname="$DATABASE_URL" /backups/ucw_YYYY-MM-DD_HHMM.dump
```

5. Jalankan `php artisan migrate --force` hanya setelah schema state dicek.
6. Smoke test login, customer order, payment status, staff update, admin dashboard, AI fallback.
7. Restart queue, scheduler, Reverb, FastAPI.

## 11. Monitoring and Log Rotation

Monitor:

- HTTP 5xx.
- Laravel logs `storage/logs`.
- Failed jobs.
- Queue worker alive.
- Scheduler last successful run.
- Reverb uptime/WebSocket errors.
- FastAPI `/health`.
- PostgreSQL disk/connections/CPU/memory.
- Redis memory/eviction.
- Pakasir webhook non-2xx/invalid payload.
- Backup freshness.

Log rotation:

- Laravel logs.
- Nginx access/error logs.
- Queue worker logs.
- Scheduler logs.
- Reverb logs.
- FastAPI logs.

Minimum alert:

- App returns repeated 5xx.
- Queue stopped or failed jobs rising.
- Scheduler stale.
- Reverb down.
- AI health down or model/database failure.
- Pakasir webhook failure spike.
- Latest backup older than target.

## 12. Deployment Checklist

1. Set env production.
2. Rotate/generate all secrets outside repo.
3. Install dependencies.
4. Build frontend.
5. Run migration.
6. Run `storage:link`.
7. Cache config/routes/views/events.
8. Start app/PHP-FPM.
9. Start queue.
10. Start scheduler.
11. Start Reverb.
12. Start AI service.
13. Configure Nginx + SSL.
14. Configure Pakasir webhook.
15. Run smoke test.
16. Run backup.
17. Run restore drill in non-production.
18. Enable monitoring/alerting.

## 13. Verification Commands

```bash
php artisan test
npm run build
```

Windows PowerShell:

```bash
npm.cmd run build
```

Focused tests:

```bash
php artisan test --filter=PakasirPaymentTest
php artisan test --filter=CustomerOrderAccessTest
php artisan test --filter=OrderIntegrityTest
php artisan test --filter=AiServiceFallbackTest
php artisan test --filter=ReviewStatisticsTest
```

## 14. Perlu Dikonfirmasi

- Domain final dan SSL provider.
- Pakasir dashboard webhook URL final.
- Apakah signature/timestamp/nonce tersedia dari Pakasir.
- Strategy backup storage eksternal.
- Monitoring/alerting stack yang akan dipakai.
- Apakah deploy memakai Docker Compose penuh atau VPS manual.

