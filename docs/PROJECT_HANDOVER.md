# PROJECT HANDOVER

## Project Name

Unand Co-Workspace (UCW) App - Coffee Shop Management System.

## Purpose

UCW App is a QR ordering and coffee shop management web application for Unand Co-Workspace. It supports customer self-ordering without login, staff order operations, admin management, Pakasir payment integration, and AI analytics powered by a FastAPI service.

## Current Project State

Estimated progress based on the current repository snapshot:

- Customer app: 85-90% complete for demo. Main order flow, payment selection, Pakasir online payment display, cash confirmation, order tracking, and feedback exist. Customer order access is now session/ownership protected.
- Staff dashboard: 80-88% complete for demo. Kanban dashboard, order status updates, cash verification, transactions page, export, private realtime subscription, and polling fallback exist.
- Admin dashboard: 70-80% complete. Overview, live orders, menu/category CRUD, staff/admin CRUD, finance, exports, and AI analytics pages exist. Settings is partially wired and still needs review.
- Backend core: 82-88% complete. Main models, controllers, services, requests, migrations, Pakasir tests, ownership tests, AI fallback tests, and order/payment flows exist.
- Database: 82-88% complete. Historical order detail snapshots, safer menu delete behavior, review uniqueness, and dashboard/payment indexes are now present.
- Payment gateway: 82-88% complete for current production gateway choice. Pakasir is active for production QRIS/BRI VA; Midtrans remains in the codebase as future/legacy integration and should only run when explicitly configured.
- AI analytics: 75-82% complete. FastAPI has safe model loading and endpoint fallbacks; Laravel `AiService` also has graceful fallback behavior. Admin AI Analytics still needs frontend cleanup.
- Deployment readiness: 70-78%. Production env example, Docker paths, Nginx/PHP/AI service assets, queue, scheduler, Reverb, Redis, PostgreSQL, and deployment docs exist. Observability, backup, alerting, and production-like UAT remain open.

Latest audit score after stages 1-7F:

- Overall: 82/100
- Security: 86/100
- Backend: 80/100
- Frontend: 78/100
- Database: 85/100
- Performance: 78/100
- Maintainability: 80/100
- Production readiness: 76/100

Overall demo readiness: safe.
Overall UAT readiness: reasonably safe, but stage 8A quick wins should be completed first.
Overall production readiness: not fully recommended until rate limiting, observability, backup, route hardening, and production-like end-to-end UAT are complete.

## Tech Stack

Observed in repository:

- Backend: Laravel 12 according to `composer.json` (`laravel/framework ^12.0`).
- Frontend bridge: Inertia Laravel and `@inertiajs/react`.
- Frontend: React 19 with TypeScript. `package.json` is the source of truth for the active frontend version.
- Styling: Tailwind CSS v4.
- Realtime: Laravel Reverb, Laravel Echo, Pusher JS client.
- Database: PostgreSQL for production/deployment. SQLite may still be used in local/test contexts where configured, but production must not default to SQLite.
- Payment: Pakasir is the active production gateway through `PAYMENT_GATEWAY=pakasir`. Midtrans service code remains for future migration/legacy support and should be guarded by `PAYMENT_GATEWAY=midtrans`.
- AI service: Python FastAPI under `ai_service`.
- Queue: Laravel database queue.
- Export: Maatwebsite Excel for staff export; CSV streaming for finance/staff transactions.

Important version notes:

- User context mentioned Laravel 11.
- AGENTS/README mention Laravel 12.
- Actual `composer.json` uses Laravel 12.
- Legacy notes may mention older frontend versions.
- Actual `package.json` uses React 19 package versions, and current documentation should treat React 19 as active.

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
- Customer refactor components: payment panels, order type cards, order status timeline/cards, cart sections, estimate sections, cash confirmation sections, and feedback sections under `Components/customer`.
- Staff/Admin order cards and modals: `Components/UI/KanbanCard.tsx`, `Components/Modals/OrderDetailModal.tsx`, `CashPaymentModal.tsx`.
- Shared order board: reusable `OrderKanbanBoard` used by staff dashboard and admin live orders.
- Admin/staff table helpers: `DataToolbar`, `PaginationFooter`, and `ActionButtons`.
- Admin layout: `Components/Layout/AdminLayout.tsx`, `Sidebar.tsx`, `MobileBottomNavAdmin.tsx`.
- Admin modals: `AddMenuModal`, `MenuCategoryModal`, `DeleteConfirmModal`, `AddAdminModal`.

Important hooks/types:

- `resources/js/hooks/useCart.ts`: localStorage-backed customer cart.
- `resources/js/hooks/useOrder.ts`: order-related hook file exists.
- `resources/js/hooks/useModalState.ts`: reusable modal state.
- `resources/js/hooks/usePaymentStatusPolling.ts`: customer payment polling helper.
- `resources/js/hooks/useOrderStatusPolling.ts`: customer order polling helper.
- `resources/js/hooks/usePrivateOrderChannel.ts`: private Echo order channel helper.
- `resources/js/types/customer.ts`
- `resources/js/types/staff.ts`
- `resources/js/types/admin.ts`
- `resources/js/types/shared.ts`
- `resources/js/lib/formatters.ts`
- `resources/js/lib/status.ts`
- `resources/js/types/global.d.ts`

Frontend known issues:

- Frontend is more modular after stages 7A-7F, but refactor is not 100% complete.
- Several components still use inline `style` attributes, although project rules say Tailwind-only. This is a maintainability/rule mismatch, not necessarily a runtime blocker.
- Admin AI Analytics still needs type/interface cleanup, removal of remaining `any`, inline style cleanup, and mock/static data review.
- Customer cart uses `localStorage` and is not clearly cleared after successful order/feedback.
- Admin menu availability toggle is visual only and does not call backend.
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

- No explicit login throttle was found.
- Explicit rate limiting is still incomplete for order creation, payment creation, and webhook traffic.
- Customer order/payment/status/review endpoints now use ownership checks, but public settings/review/menu APIs still need a data exposure audit.
- Realtime events now use private channels, but production Reverb E2E should still be smoke-tested.
- Controllers still contain some business logic; not all logic is fully moved into services.
- Some admin/staff validation is still inline instead of Form Request based.
- `ReviewController::getStatistics` raw SQL string quoting should be made PostgreSQL-safe.
- There may be duplicate or legacy staff dashboard controller code that needs cleanup.

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
- `order_details` now stores `menu_name`, `unit_price`, and `subtotal` snapshots.
- `order_details.menu_id` no longer deletes historical order detail rows when a menu is deleted.
- `reviews.order_id` has a unique constraint to prevent duplicate reviews.
- Order/payment filtering indexes were added for dashboard, finance, and payment queries.
- `processing` and `preparing` are standardized/mapped so customer and staff views read status consistently.

Database known risks:

- `menus.category_id` cascades on delete. Category controller prevents deletion when menus exist, but database still allows cascade if bypassed.
- Existing legacy data before snapshot backfill should be reviewed during UAT.
- Additional production query profiling is still recommended after real data volume grows.

## Payment Gateway Status

Pakasir is the active payment gateway integration.

Implemented:

- Create QRIS transaction.
- Create BRI VA transaction.
- Store Pakasir payment data.
- Active gateway selection through `PAYMENT_GATEWAY=pakasir`.
- Pakasir webhook endpoint: `POST /api/webhooks/pakasir`.
- Transaction detail check before marking payment paid.
- Webhook validation for project, order reference, amount, and status.
- Idempotent duplicate webhook handling.
- Sandbox simulation endpoint: `POST /api/dev/pakasir/payments/{order}/simulate`, guarded outside local/testing or sandbox mode.
- Tests exist for QRIS, BRI VA, webhook success, duplicate webhook, invalid amount, invalid project, invalid order, missing credential message, credential rejection message, and production simulation guard.

Not production-ready yet:

- No webhook signature/HMAC validation found.
- No timestamp/nonce/replay protection found.
- No scheduled reconciliation for expired/failed/stale payments.
- No automated transition to `expired` based on `expired_at`.
- Explicit webhook rate limiting is still needed.
- Simulation route is still registered, although controller guard blocks production execution.

Midtrans status:

- `PaymentService` still contains Midtrans Snap creation, notification handling, and status verification code.
- Current production customer flow maps online methods to Pakasir when `PAYMENT_GATEWAY=pakasir`.
- Midtrans routes/controllers should stay guarded so they only run when `PAYMENT_GATEWAY=midtrans`.
- Midtrans implementation should be treated as future/legacy unless retested for a migration.

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

- FastAPI model loading is now guarded through safe loader/status flags, so missing/corrupt model files should not prevent startup.
- `/health` reports model and database status.
- Estimation, popular menu, and sentiment endpoints have fallback responses when model/database access fails.
- Laravel `AiService` uses fallback behavior, which helps the app continue when FastAPI is down or times out.
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

- React 19 is the active frontend version and has been aligned in the main project instructions.
- Production examples and compose files should stay placeholder-only; any historical real secrets must be considered rotated outside the repo.
- Admin Settings still needs a focused verification pass.
- Pakasir webhook still lacks signature/replay hardening if Pakasir supports it, although payload validation and idempotency are now present.
- Pakasir simulation route is not registered for production routing and remains guarded for non-production sandbox/local usage.
- Public settings/review/menu APIs should be re-audited whenever new fields are added.
- Login, customer order creation, customer payment creation, Pakasir webhook, and realtime auth now have explicit lightweight throttle coverage.
- Customer cart may retain old items after successful checkout.
- Admin menu availability toggle is not wired to backend.
- Admin AI Analytics has been cleaned up, but remaining inline styles and backend analytics portability should continue to be reviewed.
- Payment reliability still needs scheduled Pakasir expiry/reconciliation for stale unpaid transactions.
- There may be duplicate or legacy staff dashboard controller code.
- Some admin/staff validation is not yet Form Request based.
- Default seed passwords must not be used in production.
- Observability, backup, alerting, and log retention are not fully specified for production.
- No complete E2E test suite was found.

## Remaining Tasks

Before demo:

- Clear customer cart after order or manually clear browser storage before demo.
- Avoid Admin Settings in demo unless it has been specifically smoke-tested.
- Confirm Pakasir sandbox credentials and webhook URL.
- Run smoke test for QRIS, BRI VA, cash, staff update, and feedback.
- Start Laravel, queue worker, Reverb, and FastAPI before demo.

Before UAT:

- Complete stage 8A quick wins.
- Add UAT checklist for every customer/staff/admin flow.
- Add tests for failed/expired payment, replay attempt, rate limiting, and admin settings.
- Validate mobile and desktop layouts.
- Validate exports.
- Validate AI service online/offline behavior.
- Add admin settings page or remove route from sidebar if not used.

Before production:

- Confirm all leaked/committed secrets are rotated outside the repository.
- Harden webhook validation with signature/replay checks if supported by Pakasir.
- Add payment reconciliation and expiry handling.
- Keep private broadcast channels and verify Reverb in production-like environment.
- Add active-user auth tests and login throttling/rate limiting.
- Use production env with SSL.
- Follow `docs/DEPLOYMENT.md` and `.env.production.example`.
- Add backups, log rotation, queue/scheduler supervision, and monitoring.

## Next Priorities

1. UAT: full customer/staff/admin end-to-end test on production-like PostgreSQL, Redis, Reverb, queue, scheduler, FastAPI, and Pakasir setup.
2. Production observability: backup restore drill, alerting, log retention, failed job monitoring, and operational runbook.
3. Payment reliability: scheduled reconciliation and expiry handling for stale Pakasir transactions.
4. Security hardening: add Pakasir signature/replay validation if the provider exposes a supported mechanism.
5. Legacy cleanup: decide whether `App\Http\Controllers\Staff\StaffDashboardController` can be deleted after external reference confirmation.
6. Frontend maintainability: continue removing inline style and standardize remaining local types.
7. Admin analytics backend: make remaining analytics queries portable across SQLite/PostgreSQL.

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

Current state after stages 1-8B and Week 1 hardening: Customer flow is safe for demo and now protects order/payment/status/review access with session-backed ownership. Pakasir is the active production payment gateway through PAYMENT_GATEWAY=pakasir; Midtrans remains as future/legacy code and should only run when PAYMENT_GATEWAY=midtrans. Pakasir webhook has project/order/amount/status validation, transaction detail checking, duplicate webhook idempotency, production simulation guard, and database-backed provider reference idempotency. Broadcast channels are private with polling fallback and realtime auth throttle. Database integrity has order detail snapshots, safer menu delete behavior, unique review per order, useful indexes, payment idempotency indexes, and customer-safe processing/preparing status mapping. FastAPI AI service uses safe model loading, /health status, and fallback responses; Laravel AiService also falls back gracefully. Frontend has been modularized through shared formatters/status helpers/types/components/hooks, customer component extraction, shared order Kanban, admin/staff table helpers, and safe pagination label rendering, but it is not fully finished.

Known priorities: production-like UAT, Pakasir signature/replay hardening if supported, payment expiry/reconciliation, production observability/backup/alerting/log retention, backup restore drill, and remaining analytics query portability.

Start by reading docs/PROJECT_HANDOVER.md, docs/ARCHITECTURE.md, docs/PROGRESS_CHECKPOINT.md, and docs/DEPLOYMENT.md, then inspect the relevant files before changing anything.
```

## Parts Not Fully Confirmed From Repository

- Actual Pakasir dashboard configuration and real webhook URL.
- Whether Reverb works end-to-end in the current runtime environment.
- Whether FastAPI is currently running and serving all endpoints.
- Whether deployed production infrastructure exists.
- Whether every UI page has been manually tested on mobile and desktop.
- Whether `.env` secrets have already been rotated outside the repository.
- Whether Midtrans is intentionally retained or should be removed.
