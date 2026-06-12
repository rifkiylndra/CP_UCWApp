# UCW App Deployment

This guide is the short production checklist for UCW App. Production payment uses Pakasir. Midtrans remains in the codebase only as a future migration gateway and must not be active while `PAYMENT_GATEWAY=pakasir`.

## Environment

1. Copy the production template:

```bash
cp .env.production.example .env
```

2. Fill real values outside version control:

```text
APP_KEY
APP_URL
DB_PASSWORD / POSTGRES_PASSWORD
PAKASIR_PROJECT
PAKASIR_API_KEY
REVERB_APP_KEY
REVERB_APP_SECRET
```

3. Required production values:

```text
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=pgsql
PAYMENT_GATEWAY=pakasir
QUEUE_CONNECTION=redis
BROADCAST_CONNECTION=reverb
AI_SERVICE_URL=http://ai-service:8000
```

Do not use SQLite for production.

## Docker Compose

The compose stack expects these folders:

```text
docker/php/Dockerfile
docker/node/Dockerfile
docker/nginx/nginx.conf
docker/nginx/default.conf
ai_service/Dockerfile
```

Core production services:

```bash
docker compose up -d postgres redis app nginx queue scheduler reverb ai-service
```

PostgreSQL and Redis are exposed only to the internal Docker network in the main compose file. Do not publish `5432` or `6379` from the production compose stack unless there is a specific private-network operations requirement. For local debugging from the host machine, create a separate untracked `docker-compose.override.yml` that maps those ports only in a trusted development environment.

Development-only service:

```bash
docker compose --profile dev up -d node mailhog
```

## One-Time Setup

```bash
docker compose exec app php artisan key:generate --force
docker compose exec app php artisan migrate --force
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache
docker compose exec app php artisan event:cache
```

## Runtime Processes

Queue worker:

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

FastAPI AI service:

```bash
cd ai_service
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Production Operations

Database backup checklist:

- Run a daily PostgreSQL logical backup with `pg_dump`.
- Store backups outside the application container or VPS data disk.
- Encrypt backups before moving them to external storage.
- Keep at least 7 daily backups and 4 weekly backups for UAT/early production.
- Record the backup timestamp, database name, app commit/checkpoint, and operator.
- Test restore on a non-production database before relying on the backup policy.

Example backup command:

```bash
pg_dump --format=custom --no-owner --no-acl --file=/backups/ucw_$(date +%F_%H%M).dump "$DATABASE_URL"
```

Restore procedure:

1. Stop queue, scheduler, and Reverb workers to prevent writes during restore.
2. Create a fresh database or confirm the restore target is non-production.
3. Restore with `pg_restore --clean --if-exists --no-owner --dbname="$DATABASE_URL" /backups/ucw_YYYY-MM-DD_HHMM.dump`.
4. Run `php artisan migrate --force` only after confirming schema state.
5. Run a smoke test for login, customer order, Pakasir payment status, staff status update, admin dashboard, and AI fallback.
6. Restart queue, scheduler, Reverb, and FastAPI processes.

Log rotation:

- Rotate Laravel logs under `storage/logs`.
- Keep Nginx access/error logs with a retention window appropriate for the server disk.
- Keep queue worker, scheduler, Reverb, and FastAPI process logs separate enough to debug incidents.
- Alert on repeated `ERROR` logs, failed jobs, Pakasir webhook failures, and FastAPI health failures.

Process monitoring:

- Monitor `queue` worker count and failed jobs.
- Monitor `scheduler` last successful run.
- Monitor `reverb` process uptime and websocket connection errors.
- Monitor `ai-service` `/health`, including model status and database connectivity.
- Monitor PostgreSQL disk, connections, CPU, memory, and backup freshness.
- Monitor Redis memory and eviction policy if Redis is used for queues/cache.

Minimum alerting:

- Application returns 5xx repeatedly.
- Queue worker stopped or failed jobs are increasing.
- Scheduler has not run in the expected interval.
- Reverb process is down.
- FastAPI `/health` is down or reports model/database failure.
- Pakasir webhook returns non-2xx or invalid payload spikes.
- Latest database backup is older than the configured retention target.

## Dev And Simulation Routes

Pakasir simulation is routed at `/api/dev/pakasir/payments/{order}/simulate`, but the controller blocks it outside local/testing or non-production sandbox mode. Keep `PAKASIR_MODE=production` and `APP_ENV=production` in production.

## AI Artifact And Cache Policy

- Python `__pycache__` and `*.pyc` files must stay untracked. They are generated runtime artifacts and are ignored by `.gitignore`.
- `ai_service/saved_models/*.pkl` and related model metadata may stay tracked only when the model files are trusted, needed for demo/UAT, and reviewed as project-owned artifacts.
- Do not load `.pkl` model files from untrusted sources. Pickle can execute code during deserialization.
- Future production hardening should add model checksums, provenance notes, or a model registry/artifact store before replacing bundled models.

## Production Smoke Test

- Admin login works and inactive users cannot log in.
- Staff login works and inactive users cannot log in.
- Customer can create a dine-in order from the QR flow.
- Customer can create Pakasir QRIS payment.
- Customer can create Pakasir BRI VA payment.
- Pakasir webhook marks a valid payment as paid and rejects invalid project/amount/order.
- Duplicate Pakasir webhook does not process twice.
- Staff can update order status and customer sees the updated status.
- Admin dashboard and finance pages load.
- Reverb private order channel authorizes only the owning customer session or staff/admin.
- AI service health check is reachable, or Laravel fallback behavior is acceptable.

## Production-Like UAT Checklist

Customer:

- QR landing opens with the expected table context.
- Menu search/filter works and only public menu fields are visible.
- Cart, order type, estimate, order creation, and payment selection work.
- Pakasir QRIS and BRI VA creation work in the configured environment.
- Cash flow waits for staff verification.
- Order status updates through polling and Reverb when available.
- Feedback/review works only for the owning customer session and completed orders.

Staff:

- Staff login works for active users and rejects inactive users.
- Dashboard loads incoming/processing/completed orders.
- Staff can verify cash and update status.
- Transactions and export work for the selected day.

Admin:

- Admin login works for active users and rejects inactive users.
- Overview, live orders, menu/category CRUD, staff/admin CRUD, finance, export, feedback, and AI analytics load.
- AI Analytics clearly indicates live versus fallback/demo data.
- Admin Settings is smoke-tested before being used in UAT.

Operations:

- Queue, scheduler, Reverb, FastAPI, PostgreSQL, Redis, and Nginx are supervised.
- `php artisan test --filter=PakasirPaymentTest` passes in CI/local verification.
- `php artisan test --filter=CustomerOrderAccessTest` passes.
- `php artisan test --filter=OrderIntegrityTest` passes.
- `npm run build` passes.
- Backup and restore procedure has been tested on non-production data.

## Verification Commands

```bash
php artisan test --filter=PakasirPaymentTest
php artisan test --filter=OrderIntegrityTest
php artisan test --filter=CustomerOrderAccessTest
npm run build
```
