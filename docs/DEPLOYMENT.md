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

## Dev And Simulation Routes

Pakasir simulation is routed at `/api/dev/pakasir/payments/{order}/simulate`, but the controller blocks it outside local/testing or non-production sandbox mode. Keep `PAKASIR_MODE=production` and `APP_ENV=production` in production.

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

## Verification Commands

```bash
php artisan test --filter=PakasirPaymentTest
php artisan test --filter=OrderIntegrityTest
php artisan test --filter=CustomerOrderAccessTest
npm run build
```
