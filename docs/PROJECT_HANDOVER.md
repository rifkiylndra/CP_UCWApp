# PROJECT HANDOVER

## Project Name

Unand Co-Workspace (UCW) App - Coffee Shop Management System.

## Purpose

UCW App is a QR ordering and coffee shop management web application for Unand Co-Workspace. It supports customer self-ordering without login, staff order operations, admin management, Pakasir payment integration, and AI analytics powered by a FastAPI service.

## Current Project State

Estimated progress based on the current repository snapshot:

- Customer app: 85-90% complete for demo. Main order flow, payment selection, cash confirmation, online payment display, order tracking, and feedback exist.
- Staff dashboard: 75-85% complete for demo. Kanban dashboard, order status updates, cash verification, transactions page, and export exist. Realtime is mostly polling-backed.
- Admin dashboard: 65-75% complete. Overview, live orders, menu/category CRUD, staff/admin CRUD, finance, exports, and AI analytics pages exist. Settings is not fully wired.
- Backend core: 75-85% complete. Main models, controllers, services, requests, migrations, Pakasir tests, and order/payment flows exist.
- Database: 70-80% complete. Schema is usable, but production integrity improvements are still needed.
- Payment gateway: 70-80% complete for sandbox; not production-ready until webhook hardening, replay protection, and reconciliation are added.
- AI analytics: 65-75% complete. Laravel fallback is present; FastAPI service exists with saved models, but startup/model failure handling and DB compatibility need hardening.
- Deployment readiness: 40-50%. Config, Docker, production env, SSL, queue, Reverb, and security hardening still need work.

Overall demo readiness: possible with controlled setup and mitigation.
Overall UAT readiness: not yet complete.
Overall production readiness: not yet complete.

## Tech Stack

Observed in repository:

- Backend: Laravel 12 according to `composer.json` (`laravel/framework ^12.0`).
- Frontend bridge: Inertia Laravel and `@inertiajs/react`.
- Frontend: React with TypeScript. `package.json` currently uses React 19 packages, even though project docs mention React 18.
- Styling: Tailwind CSS v4.
- Realtime: Laravel Reverb, Laravel Echo, Pusher JS client.
- Database: SQLite locally by default, PostgreSQL intended for production/deployment.
- Payment: Pakasir sandbox integration is current. Midtrans service code remains as legacy/partial support.
- AI service: Python FastAPI under `ai_service`.
- Queue: Laravel database queue.
- Export: Maatwebsite Excel for staff export; CSV streaming for finance/staff transactions.

Important version mismatch:

- User context mentioned Laravel 11.
- AGENTS/README mention Laravel 12.
- Actual `composer.json` uses Laravel 12.
- User context mentioned React 18.
- Actual `package.json` uses React 19 package versions.

## Main Project Structure

```text
app/
  Events/
  Exports/
  Http/
    Controllers/
      Admin/
      Customer/
      Staff/
    Middleware/
    Requests/
    Resources/
  Jobs/
  Models/
  Services/

ai_service/
  main.py
  routers/
  schemas/
  saved_models/

config/
database/
  migrations/
  seeders/
resources/
  css/
  js/
    Components/
    Layouts/
    Pages/
    hooks/
    lib/
    stores/
    types/
routes/
tests/
docs/
```

## Frontend Status

Customer pages exist:

- `resources/js/Pages/Customer/Landing.tsx`
- `resources/js/Pages/Customer/Menu.tsx`
- `resources/js/Pages/Customer/Cart.tsx`
- `resources/js/Pages/Customer/OrderType.tsx`
- `resources/js/Pages/Customer/Estimate.tsx`
- `resources/js/Pages/Customer/ChoosePayment.tsx`
- `resources/js/Pages/Customer/OnlinePayment.tsx`
- `resources/js/Pages/Customer/CashConfirmation.tsx`
- `resources/js/Pages/Customer/OrderStatus.tsx`
- `resources/js/Pages/Customer/Feedback.tsx`

Staff pages exist:

- `resources/js/Pages/Staff/Dashboard.tsx`
- `resources/js/Pages/Staff/Transactions.tsx`

Admin pages exist:

- `resources/js/Pages/Admin/Login.tsx`
- `resources/js/Pages/Admin/Overview.tsx`
- `resources/js/Pages/Admin/LiveOrder.tsx`
- `resources/js/Pages/Admin/Menu/Index.tsx`
- `resources/js/Pages/Admin/Staff/Index.tsx`
- `resources/js/Pages/Admin/Finances.tsx`
- `resources/js/Pages/Admin/AIAnalytics.tsx`

Important frontend components:

- Customer navigation and layout: `Components/customer/navigation`, `Components/Layout/CustomerLayout.tsx`.
- Customer menu: `MenuSidebar`, `MenuCardMobile`, `MenuCardDesktop`, `CartSidebar`, `FloatingCartButton`.
- Staff/Admin order cards and modals: `Components/UI/KanbanCard.tsx`, `Components/Modals/OrderDetailModal.tsx`, `CashPaymentModal.tsx`.
- Admin layout: `Components/Layout/AdminLayout.tsx`, `Sidebar.tsx`, `MobileBottomNavAdmin.tsx`.
- Admin modals: `AddMenuModal`, `MenuCategoryModal`, `DeleteConfirmModal`, `AddAdminModal`.

Important hooks/types:

- `resources/js/hooks/useCart.ts`: localStorage-backed customer cart.
- `resources/js/hooks/useOrder.ts`: order-related hook file exists.
- `resources/js/hooks/useEcho.ts`: exists but appears empty in current snapshot.
- `resources/js/types/customer.ts`
- `resources/js/types/staff.ts`
- `resources/js/types/admin.ts`
- `resources/js/types/global.d.ts`

Frontend known issues:

- Several components use inline `style` attributes, although project rules say Tailwind-only. This is a rule mismatch, not necessarily a runtime blocker.
- Staff/Admin Kanban sends status `processing`, while Customer OrderStatus stepper mainly expects `preparing`, which can make progress display confusing.
- Customer cart uses `localStorage` and is not clearly cleared after successful order/feedback.
- Admin menu availability toggle is visual only and does not call backend.
- Admin Settings route exists in backend but no matching `resources/js/Pages/Admin/SystemConfig.tsx` was found.
- Some text appears mojibake/encoding-corrupted in UI strings and docs.

## Backend Status

Main controllers:

- Auth: `AuthController`, `AdminAuthController`, `StaffAuthController`.
- Customer: `MenuController`, `OrderController`, `PaymentController`, `ReviewController`.
- Staff: `DashboardController`, `PaymentController`.
- Admin: `DashboardController`, `MenuController`, `CategoryController`, `StaffController`, `FinanceController`, `AnalyticsController`, `SystemConfigController`.

Main services:

- `OrderService`: creates orders, calculates totals from database prices, updates order status, frees tables, retrieves order statistics.
- `PaymentService`: cash payment, cash verification, legacy Midtrans Snap/notification support.
- `PakasirService`: create Pakasir QRIS/BRI VA transactions, get transaction detail, sandbox simulation, validate webhook payload.
- `AiService`: Laravel-side proxy/fallback wrapper for FastAPI estimation, popular menu, sentiment analysis, and sentiment summary.

Main events:

- `NewOrderPlaced`
- `OrderStatusUpdated`
- `PaymentStatusUpdated`

Main job:

- `ProcessAiAnalysis`: queued sentiment analysis for reviews. Current review controller directly calls AI rather than dispatching this job.

Backend known issues:

- `SystemConfigController` uses `Log::info()` and `Log::error()` without importing the `Log` facade, so update endpoints can fatal.
- Auth login does not check `is_active`.
- No explicit login throttle was found.
- Some public customer APIs expose order data by `order_ref`.
- Realtime events use public channels for some order/payment updates.
- Controllers still contain some business logic; not all logic is fully moved into services.

## Database Status

Important models:

- `User`
- `Category`
- `Menu`
- `Table`
- `Order`
- `OrderDetail`
- `Payment`
- `Review`
- `SystemConfig`

Important migrations:

- `2026_05_11_123002_create_users_table.php`
- `2026_05_11_123052_create_categories_table.php`
- `2026_05_11_123058_create_menus_table.php`
- `2026_05_11_123103_create_tables_table.php`
- `2026_05_11_123108_create_orders_table.php`
- `2026_05_11_123113_create_order_details_table.php`
- `2026_05_11_123117_create_payments_table.php`
- `2026_05_11_123121_create_reviews_table.php`
- `2026_05_11_123125_create_system_configs_table.php`
- `2026_05_11_134409_create_sessions_table.php`
- `2026_06_03_161500_add_estimated_time_to_menus_table.php`
- `2026_06_06_000001_add_pakasir_payment_fields.php`
- Laravel cache/jobs migrations.

Database status:

- Base tables exist.
- Pakasir migration adds `order_ref`, `payment_method`, provider fields, payment number, fee, total payment, expiry, completed timestamp, raw response, and raw webhook.
- `orders.order_ref` becomes unique.
- Order/payment status enum constraints are changed to string in the Pakasir migration.

Database known risks:

- `order_details.menu_id` cascades on delete. Deleting a menu can delete historical order detail rows.
- `menus.category_id` cascades on delete. Category controller prevents deletion when menus exist, but database still allows cascade if bypassed.
- Order detail does not store menu name/price snapshot, so historical reporting depends on current menu records.
- No unique idempotency constraint for Pakasir provider reference/payment method.
- Additional indexes are recommended for production order/payment dashboards.

## Payment Gateway Status

Pakasir is the active payment gateway integration.

Implemented:

- Create QRIS transaction.
- Create BRI VA transaction.
- Store Pakasir payment data.
- Pakasir webhook endpoint: `POST /api/webhooks/pakasir`.
- Transaction detail check before marking payment paid.
- Sandbox simulation endpoint: `POST /api/dev/pakasir/payments/{order}/simulate`.
- Tests exist for QRIS, BRI VA, webhook success, invalid amount, invalid project, invalid order, missing credential message, credential rejection message, and sandbox simulation.

Not production-ready yet:

- No webhook signature/HMAC validation found.
- No timestamp/nonce/replay protection found.
- No explicit idempotency key or unique provider transaction constraint.
- No scheduled reconciliation for expired/failed/stale payments.
- No automated transition to `expired` based on `expired_at`.
- Simulation route must be guaranteed unavailable in production.

Midtrans status:

- `PaymentService` still contains Midtrans Snap creation, notification handling, and status verification code.
- Current customer flow maps online methods to Pakasir.
- Some Midtrans routes/comments remain legacy.
- Midtrans implementation should be treated as partial/legacy unless retested.

## AI Analytics Status

FastAPI service location:

- `ai_service/main.py`
- `ai_service/routers/estimation.py`
- `ai_service/routers/menu.py`
- `ai_service/routers/sentiment.py`
- `ai_service/saved_models/`

Implemented endpoints:

- `GET /health`
- `POST /api/estimation/predict`
- `GET /api/estimation/info`
- `GET /api/menu/populer`
- `POST /api/sentiment/analyze`
- `GET /api/sentiment/summary`
- `POST /api/sentiment/bulk`

Laravel AI integration:

- `AiService::getServingTimeEstimation()`
- `AiService::getPopularMenus()`
- `AiService::analyzeSentiment()`
- `AiService::getSentimentSummary()`

AI known issues:

- FastAPI loads pickle/model files at import time without guard; missing/corrupt model files can prevent service startup.
- WMA SQL uses database-specific syntax and likely needs adjustment for SQLite/PostgreSQL compatibility.
- Laravel `AiService` uses fallback behavior, which helps the app continue when FastAPI is down.
- Admin model performance endpoint returns mock/static model data.

## Progress by Module

Customer:

- Landing: implemented.
- Menu: implemented.
- Search/filter: implemented client-side.
- Cart: implemented.
- Order type: implemented.
- Estimate: implemented with AI proxy/fallback.
- Payment selection: implemented.
- QRIS/BRI VA payment: implemented through Pakasir.
- Cash payment: implemented with staff verification.
- Order status: implemented with polling and Echo listener attempt.
- Feedback: implemented with AI sentiment call.

Staff:

- Login: implemented through universal login route.
- Dashboard: implemented.
- Incoming orders: implemented.
- Processing orders: implemented.
- Ready orders: concept exists via status support, but UI column naming is incoming/processing/completed.
- Cash verification: implemented.
- Transaction history: implemented.
- Export: implemented as CSV.

Admin:

- Login: universal login exists; `Admin/Login.tsx` also exists.
- Overview: implemented.
- Live orders: implemented.
- Menu CRUD: implemented.
- Category CRUD: implemented.
- Staff/Admin CRUD: implemented.
- Staff export: implemented.
- Finances: implemented.
- Finance export: implemented as CSV.
- AI analytics: implemented but partly static/fallback.
- Settings: backend routes exist, frontend page not found and controller has a `Log` import issue.

## Important Routes

Public/auth:

- `GET /`
- `GET /login`
- `POST /login`
- `POST /logout`

Customer:

- `GET /customer`
- `GET /customer/menu`
- `GET /customer/cart`
- `GET /customer/order-type`
- `GET /customer/estimate`
- `POST /customer/order`
- `GET /customer/order/{order}/payment`
- `POST /customer/order/{order}/payment/process`
- `POST /customer/order/{order}/payments/pakasir`
- `GET /customer/order/{order}/payment/online`
- `GET /customer/order/{order}/payment/cash`
- `GET /customer/order/{order}/payment/status`
- `GET /customer/order/{order}/status`
- `GET /customer/order/{order}/feedback`
- `POST /customer/order/{order}/complete-transaction`
- `POST /customer/api/estimate`

API:

- `GET /api/health`
- `POST /api/webhooks/pakasir`
- `POST /api/dev/pakasir/payments/{order}/simulate`

Staff:

- `GET /staff/dashboard`
- `GET /staff/transactions`
- `GET /staff/transactions/export`
- `PUT /staff/order/{order}/status`
- `GET /staff/order/{order}`
- `POST /staff/payments/order/{order}/verify-cash`

Admin:

- `GET /admin/overview`
- `GET /admin/live-order`
- `GET /admin/ai-analytics`
- `GET /admin/menu`
- `POST /admin/menu`
- `POST /admin/menu/{menu}`
- `DELETE /admin/menu/{menu}`
- `GET /admin/menu-categories`
- `POST /admin/menu-categories`
- `PUT /admin/menu-categories/{category}`
- `DELETE /admin/menu-categories/{category}`
- `GET /admin/staff`
- `POST /admin/staff`
- `PUT /admin/staff/{staff}`
- `DELETE /admin/staff/{staff}`
- `GET /admin/staff/export`
- `GET /admin/finances`
- `GET /admin/finances/export`
- `GET /admin/analytics/*`
- `GET/PUT /admin/settings/*`

## Environment Variables Used

Do not copy real secrets into documentation or commits. Use placeholders.

Application:

- `APP_NAME`
- `APP_ENV`
- `APP_KEY`
- `APP_DEBUG`
- `APP_URL`
- `APP_LOCALE`
- `APP_TIMEZONE` or app timezone config equivalent

Database/cache/session/queue:

- `DB_CONNECTION`
- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`
- `SESSION_DRIVER`
- `SESSION_LIFETIME`
- `SESSION_ENCRYPT`
- `SESSION_DOMAIN`
- `CACHE_STORE`
- `QUEUE_CONNECTION`
- `DB_QUEUE_CONNECTION`
- `DB_QUEUE_TABLE`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`

Realtime/Reverb:

- `BROADCAST_CONNECTION`
- `REVERB_APP_ID`
- `REVERB_APP_KEY`
- `REVERB_APP_SECRET`
- `REVERB_HOST`
- `REVERB_PORT`
- `REVERB_SCHEME`
- `REVERB_SERVER_HOST`
- `REVERB_SERVER_PORT`
- `VITE_REVERB_APP_KEY`
- `VITE_REVERB_HOST`
- `VITE_REVERB_PORT`
- `VITE_REVERB_SCHEME`

Payment:

- `PAKASIR_PROJECT`
- `PAKASIR_API_KEY`
- `PAKASIR_MODE`
- `PAKASIR_BASE_URL`
- `MIDTRANS_SERVER_KEY`
- `MIDTRANS_CLIENT_KEY`
- `MIDTRANS_IS_PRODUCTION`
- `MIDTRANS_IS_SANITIZED`
- `MIDTRANS_IS_3DS`

AI:

- `AI_SERVICE_URL`
- `AI_SERVICE_TIMEOUT`

Build:

- `VITE_APP_NAME`

## Known Issues

- Actual stack versions differ from some project instructions.
- Pakasir API key appears in `.env.example`; rotate and replace with placeholder.
- Admin Settings frontend page missing.
- `SystemConfigController` missing `Log` import.
- Payment webhook lacks signature/replay/idempotency hardening.
- Reverb channels are not fully private/protected.
- Customer order channel auth currently allows access without session/order validation.
- Customer cart may retain old items after successful checkout.
- Staff status `processing` and customer status `preparing` mismatch.
- Admin menu availability toggle is not wired to backend.
- Docker compose references missing/mismatched paths (`ai-service`, `docker/node`, nginx files).
- AI service model loading can fail service startup.
- AI WMA SQL may fail depending on DB driver.
- `is_active` is not enforced during login.
- Default seed passwords must not be used in production.
- No complete E2E test suite was found.

## Remaining Tasks

Before demo:

- Fix or work around `processing` vs `preparing` customer tracking display.
- Clear customer cart after order or manually clear browser storage before demo.
- Avoid Admin Settings in demo until fixed.
- Confirm Pakasir sandbox credentials and webhook URL.
- Run smoke test for QRIS, BRI VA, cash, staff update, and feedback.
- Start Laravel, queue worker, Reverb, and FastAPI before demo.

Before UAT:

- Add UAT checklist for every customer/staff/admin flow.
- Add tests for failed/expired payment, duplicate webhook, replay attempt, and admin settings.
- Validate mobile and desktop layouts.
- Validate exports.
- Validate AI service online/offline behavior.
- Add admin settings page or remove route from sidebar if not used.

Before production:

- Rotate leaked/committed secrets.
- Harden webhook validation.
- Add payment idempotency/reconciliation.
- Protect broadcast channels.
- Enforce active users and login throttle.
- Use production env with SSL.
- Fix Docker/deployment configuration.
- Add indexes and data-integrity safeguards.
- Add backups, log rotation, queue/scheduler supervision, and monitoring.

## Next Priorities

1. Security hardening: secrets, webhook signature/replay, auth active check, broadcast privacy.
2. Payment reliability: idempotency, duplicate webhook handling, expiry/reconcile jobs.
3. Demo polish: status mismatch, cart cleanup, settings avoidance/fix.
4. Deployment setup: production env, SSL, queue, scheduler, Reverb, AI Docker.
5. Testing: PHPUnit feature tests plus Playwright smoke tests.
6. Database integrity: historical snapshots, delete restrictions, indexes.

## How To Run The Project Locally

Laravel:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Frontend:

```bash
npm install
npm run dev
```

Queue:

```bash
php artisan queue:work
```

Reverb:

```bash
php artisan reverb:start
```

FastAPI AI service:

```bash
cd ai_service
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000
```

If Laravel is configured with `AI_SERVICE_URL`, ensure it matches the FastAPI port.

## How To Test The Project

PHPUnit:

```bash
php artisan test
```

Frontend build:

```bash
npm run build
```

Manual smoke test:

1. Open `/customer/menu`.
2. Add menu item.
3. Go to cart.
4. Select dine-in or takeaway.
5. Confirm estimate and create order.
6. Choose QRIS, BRI VA, or cash.
7. For cash, login staff and verify payment.
8. Staff updates order status.
9. Customer checks order status.
10. Customer submits feedback after completed.

## How To Test Payment Gateway

Pakasir QRIS/BRI VA sandbox:

1. Configure `PAKASIR_PROJECT`, `PAKASIR_API_KEY`, `PAKASIR_MODE=sandbox`, and `PAKASIR_BASE_URL`.
2. Create an order through customer flow.
3. Choose QRIS or BRI VA.
4. Confirm a row is created in `payments`.
5. Use Pakasir sandbox payment simulation if available:

```bash
POST /api/dev/pakasir/payments/{order_ref}/simulate
```

6. Confirm `orders.payment_status=paid` and `orders.order_status=confirmed`.
7. Confirm customer order status updates through polling/realtime.

Webhook endpoint:

```text
POST /api/webhooks/pakasir
```

Feature tests:

```bash
php artisan test --filter=PakasirPaymentTest
```

## How To Deploy To Production

Minimum production checklist:

1. Prepare server with PHP 8.2+, Composer, Node, PostgreSQL, Redis if used, Nginx/Apache, Python for AI, and SSL.
2. Set production `.env`:
   - `APP_ENV=production`
   - `APP_DEBUG=false`
   - `APP_URL=https://your-domain`
   - production database credentials
   - production Pakasir credentials
   - production Reverb host/scheme
   - `QUEUE_CONNECTION=database` or Redis
   - `AI_SERVICE_URL=http://127.0.0.1:8000` or internal Docker URL.
3. Install dependencies:

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build
```

4. Run:

```bash
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

5. Run long-lived processes with Supervisor/systemd:
   - queue worker
   - Laravel Reverb
   - scheduler
   - FastAPI service
6. Configure HTTPS and webhook URL in Pakasir dashboard.
7. Disable/remove sandbox simulation endpoint in production.
8. Verify:
   - login
   - customer order
   - QRIS/BRI VA create transaction
   - webhook receive
   - staff dashboard
   - admin dashboard
   - AI analytics fallback/online status
9. Add backup, monitoring, log rotation, and failed job monitoring.

## Next Session Starting Prompt

Use this prompt when continuing in a new AI session:

```text
You are working on UCW App, a Laravel 12 + Inertia + React TypeScript coffee shop management system for Unand Co-Workspace. The app has a customer QR ordering flow, staff dashboard, admin dashboard, Pakasir payment integration, Laravel Reverb/Echo realtime, and FastAPI AI analytics under ai_service.

Important constraints: do not change tech stack without confirmation; do not alter database destructively; use Laravel services for business logic; use Form Requests for validation; use Inertia routing for internal frontend navigation; React components are functional.

Current state: Customer flow is mostly complete for demo. Staff dashboard exists with polling-backed Kanban and cash verification. Admin overview/live orders/menu/staff/finance/AI pages exist, but Admin Settings is incomplete. Pakasir sandbox QRIS/BRI VA and webhook are implemented with tests, but production hardening is still needed. FastAPI AI service exists and Laravel has fallbacks, but model startup and WMA SQL need hardening.

Known priorities: fix processing/preparing status mismatch, clear cart after order, repair Admin Settings or hide it, rotate Pakasir key from .env.example, harden Pakasir webhook with signature/replay/idempotency, protect broadcast channels, enforce is_active on login, fix Docker deployment paths, add payment expiry/reconciliation, add production env and queue/Reverb/AI supervision.

Start by reading docs/PROJECT_HANDOVER.md and docs/ARCHITECTURE.md, then inspect the relevant files before changing anything.
```

## Parts Not Fully Confirmed From Repository

- Actual Pakasir dashboard configuration and real webhook URL.
- Whether Reverb works end-to-end in the current runtime environment.
- Whether FastAPI is currently running and serving all endpoints.
- Whether deployed production infrastructure exists.
- Whether every UI page has been manually tested on mobile and desktop.
- Whether `.env` secrets have already been rotated outside the repository.
- Whether Midtrans is intentionally retained or should be removed.
