# ARCHITECTURE

## Overview

UCW App is a full-stack web application composed of:

- Laravel backend for routing, auth, order/payment/admin logic, database access, and broadcasting.
- Inertia + React TypeScript frontend for customer, staff, and admin experiences.
- PostgreSQL database for production application state, with local/test fallback where configured.
- Pakasir payment gateway for production QRIS and BRI VA.
- FastAPI AI microservice for estimation, popular menu ranking, and sentiment analysis.
- Laravel Reverb/Echo for realtime events, with polling fallback in parts of the UI.

High-level architecture:

```text
Customer Browser
v
Inertia React Customer Pages
v
Laravel Customer Controllers
v
OrderService / PaymentService / PakasirService / AiService
v
Database + Pakasir + FastAPI
v
Events / Reverb / Polling
v
Customer, Staff, Admin UI Updates
```

## Current Architecture Snapshot After Stage 1-8B And Week 1 Hardening

This section reflects the latest implementation state after the security, payment, database, deployment, AI hardening, and frontend maintainability passes.

Readiness score from the latest audit:

- Overall: 82/100
- Security: 86/100
- Backend: 80/100
- Frontend: 78/100
- Database: 85/100
- Performance: 78/100
- Maintainability: 80/100
- Production readiness: 76/100

Readiness summary:

- Demo: safe with normal smoke testing.
- UAT: reasonably safe after stage 8A/8B and Week 1 quick wins, but still needs production-like end-to-end validation.
- Production: not fully recommended yet. Observability, backup drills, alerting, payment expiry/reconciliation, and full production-like UAT are still required.

Important architecture decisions now in effect:

- Production online payment gateway is Pakasir. Midtrans code is intentionally retained as a future/legacy gateway and must not be used when `PAYMENT_GATEWAY=pakasir`.
- Payment idempotency is enforced at application level for Pakasir create/webhook flows and is backed by database-level unique indexes for provider references.
- Customer access to order, payment, status, and review pages is no longer based on `order_ref` alone. `CustomerOrderAccessService` validates session-backed customer ownership.
- Order, payment, and staff realtime channels now use private broadcast channels with authorization in `routes/channels.php` and the custom realtime auth route.
- Polling fallback remains in the customer and staff/admin UI so the app still updates if Reverb/Echo is unavailable.
- `order_details` now stores historical snapshots: `menu_name`, `unit_price`, and `subtotal`.
- Menu deletion no longer deletes historical order detail rows.
- FastAPI AI service uses safe model loading and returns fallback responses if model files or database access fail.
- Docker/deployment assets now document Laravel app, PostgreSQL, Redis, queue worker, scheduler, Reverb, Nginx, FastAPI AI service, and Pakasir production configuration.

Remaining risks that are deliberately not hidden:

- Payment expiry/reconciliation is not yet a scheduled production process.
- Public API settings/review/menu endpoints should continue to be reviewed when new fields are added.
- Some frontend components still contain inline style usage.
- There may be duplicate or legacy staff dashboard controller code.
- Some admin/staff validation remains inline instead of Form Request based.
- Production observability, alerting automation, and backup restore drills still need operational proof.
- React package version is 19.x and should be treated as the active frontend version.

## Frontend Structure

```text
resources/js/
  app.tsx
  bootstrap.js
  Pages/
    Auth/
    Customer/
    Staff/
    Admin/
  Components/
    admin/
    customer/
    Layout/
    Modals/
    shared/
    ui/
  hooks/
  lib/
  stores/
  types/
```

Entry points:

- `resources/js/app.tsx`: Inertia app setup.
- `resources/js/bootstrap.js`: axios and Laravel Echo/Reverb setup.

Customer pages:

- `Landing.tsx`
- `Menu.tsx`
- `Cart.tsx`
- `OrderType.tsx`
- `Estimate.tsx`
- `ChoosePayment.tsx`
- `OnlinePayment.tsx`
- `CashConfirmation.tsx`
- `OrderStatus.tsx`
- `Feedback.tsx`

Staff pages:

- `Dashboard.tsx`
- `Transactions.tsx`

Admin pages:

- `Login.tsx`
- `Overview.tsx`
- `LiveOrder.tsx`
- `Menu/Index.tsx`
- `Staff/Index.tsx`
- `Finances.tsx`
- `AIAnalytics.tsx`

Components:

- Customer components: menu cards, cart sidebar, navigation, checkout steps, empty state, landing content.
- Customer refactor components: payment panels, order type cards, order status cards/timeline, cart sections, estimate sections, and feedback sections under `Components/customer`.
- Admin/staff shared table components: `DataToolbar`, `PaginationFooter`, and `ActionButtons`.
- Shared order board components: reusable order Kanban board for staff dashboard and admin live orders.
- Layout components: admin layout/sidebar/topbar, staff layout/sidebar, customer layout.
- Modal components: order detail, cash payment, add/edit menu, category, delete confirmation, add/edit user.
- UI components: button, badge, stat card, status badge, kanban card, pagination, inputs, spinner.
- Shared state components: loading, empty, and error states.

Hooks:

- `useCart.ts`: localStorage-backed customer cart state.
- `useOrder.ts`: exists for order-related behavior.
- `useModalState.ts`: small reusable modal open/close/toggle state.
- `usePaymentStatusPolling.ts`: customer payment status polling helper.
- `useOrderStatusPolling.ts`: customer order status polling helper.
- `usePrivateOrderChannel.ts`: private Echo order channel subscription helper.
- `useEcho.ts`: legacy/general Echo hook file.

Types:

- `customer.ts`: customer menu/order/payment types.
- `staff.ts`: staff user, Kanban order, transaction types.
- `admin.ts`: admin-related types.
- `shared.ts`: reusable pagination, nullable, select option, and API response helpers.
- `global.d.ts`: global Echo/axios declarations.
- `ziggy.d.ts`: Ziggy route helper declarations.

## Backend Structure

```text
app/
  Http/
    Controllers/
      Customer/
      Staff/
      Admin/
    Requests/
    Resources/
    Middleware/
  Models/
  Services/
  Events/
  Jobs/
  Exports/
routes/
  web.php
  api.php
  channels.php
```

Controllers:

- `Customer/MenuController`: menu display, category and search endpoints.
- `Customer/OrderController`: cart page, order creation, status, show, cancel, estimate proxy.
- `Customer/PaymentController`: payment selection, Pakasir creation, webhook, simulation, payment status, legacy Midtrans callback.
- `Customer/ReviewController`: feedback form and review storage with sentiment analysis.
- `Staff/DashboardController`: staff dashboard, order status updates, transactions, export, statistics.
- `Staff/PaymentController`: cash verification and payment endpoints.
- `Admin/DashboardController`: overview, live orders, charts, revenue stats.
- `Admin/MenuController`: menu CRUD and image storage.
- `Admin/CategoryController`: category CRUD.
- `Admin/StaffController`: staff/admin CRUD and export.
- `Admin/FinanceController`: finance dashboard and export.
- `Admin/AnalyticsController`: AI analytics page and API endpoints.
- `Admin/SystemConfigController`: settings APIs, currently incomplete/problematic.
- `AuthController`: universal login/logout.

Services:

- `OrderService`
  - Creates orders in a transaction.
  - Calculates total from database menu prices.
  - Normalizes table numbers.
  - Updates table status.
  - Updates order status.
  - Broadcasts order events.

- `PaymentService`
  - Creates and verifies cash payments.
  - Contains legacy Midtrans Snap and notification code.
  - Broadcasts payment status updates.

- `PakasirService`
  - Creates QRIS/BRI VA transactions.
  - Retrieves transaction detail.
  - Simulates payment in sandbox/local.
  - Validates basic webhook payload.

- `AiService`
  - Calls FastAPI estimation endpoint.
  - Calls FastAPI popular menu endpoint.
  - Calls FastAPI sentiment endpoint.
  - Provides Laravel/database fallback behavior.

Events:

- `NewOrderPlaced`
- `OrderStatusUpdated`
- `PaymentStatusUpdated`

Job:

- `ProcessAiAnalysis`

Middleware:

- `RoleMiddleware`: protects admin/staff route groups.
- `HandleInertiaRequests`: shares Inertia props.

## Database Structure

Core tables:

- `users`
- `categories`
- `menus`
- `tables`
- `orders`
- `order_details`
- `payments`
- `reviews`
- `system_configs`
- Laravel `sessions`, `jobs`, `cache` tables.

Models and relationships:

```text
User
- role: admin or staff

Category
v hasMany
Menu

Menu
v belongsTo
Category
v hasMany
OrderDetail

Table
v hasMany (implicit through table_id)
Order

Order
v belongsTo
Table
v hasMany
OrderDetail
v hasMany
Payment
v hasOne
Review

OrderDetail
v belongsTo
Order
v belongsTo
Menu

Payment
v belongsTo
Order

Review
v belongsTo
Order

SystemConfig
- key/value config storage
```

Observed foreign keys:

- `menus.category_id -> categories.id` with cascade delete.
- `orders.table_id -> tables.id` nullable with set null on delete.
- `order_details.order_id -> orders.id` with cascade delete.
- `order_details.menu_id -> menus.id` is nullable and should preserve history when a menu is deleted.
- `payments.order_id -> orders.id` with cascade delete.
- `reviews.order_id -> orders.id` with cascade delete.
- `reviews.order_id` has a unique constraint to prevent duplicate reviews per order.

Database architecture notes:

- Order totals are calculated server-side from `menus.price`.
- `orders.order_ref` is added by Pakasir migration and made unique.
- Payment-specific provider data is stored in `payments`.
- Order and payment status columns are converted from enum to string by the Pakasir migration.
- `order_details` stores `menu_name`, `unit_price`, and `subtotal` snapshots for historical reporting.
- Dashboard and finance queries have additional indexes for order/payment status and created-at filtering.
- `processing` and `preparing` are normalized/mapped so customer and staff-facing status display remains consistent without destructive data changes.

## Customer Flow

```text
Customer
v
Landing
v
Menu
v
Search / Filter
v
Cart
v
Order Type
v
Estimate
v
Create Order
v
Choose Payment
v
Cash or Pakasir QRIS/BRI VA
v
Payment Status / Staff Verification / Webhook
v
Order Status
v
Feedback
```

Detailed flow:

1. Customer opens `/customer` or `/customer/menu`.
2. `Customer/MenuController@index` loads available menus and categories.
3. React `Menu.tsx` handles client-side search/filter and adds items to cart.
4. `useCart.ts` stores cart data in localStorage.
5. Customer confirms order type and estimate.
6. `Estimate.tsx` posts to `/customer/api/estimate` and `/customer/order`.
7. `Customer/OrderController@store` validates with `CreateOrderRequest`, calls AI estimation, then `OrderService::createOrder`.
8. Customer is redirected to payment selection.
9. Cash calls `PaymentService::createCashPayment`.
10. QRIS/BRI VA calls `PakasirService::createTransaction`.
11. Customer tracks status using polling and Echo listener.
12. Once completed, customer submits feedback.
13. `ReviewController@store` calls `AiService::analyzeSentiment` and saves `Review`.

## Staff Flow

```text
Staff Login
v
Dashboard
v
Incoming Orders
v
Verify Cash if needed
v
Start Processing
v
Complete Order
v
Transaction History
v
Export
```

Detailed flow:

1. Staff logs in via `/login`.
2. `AuthController` redirects staff to `/staff/dashboard`.
3. `Staff/DashboardController@index` loads incoming, processing, and completed orders.
4. `Staff/Dashboard.tsx` displays Kanban columns.
5. If payment is unpaid/waiting verification, staff opens `CashPaymentModal`.
6. Cash verification posts to `/staff/payments/order/{order}/verify-cash`.
7. Status updates are sent to `/staff/order/{order}/status`.
8. Transactions page loads today's orders and summary.
9. Export streams CSV for daily transactions.

## Admin Flow

```text
Admin Login
v
Overview
v
Live Orders
v
Menu / Category CRUD
v
Staff / Admin CRUD
v
Finance
v
AI Analytics
v
Settings (incomplete)
```

Detailed flow:

1. Admin logs in via `/login`.
2. `AuthController` redirects admin to `/admin/overview`.
3. Overview loads dashboard statistics, recent orders, top menus, and weekly sales.
4. Live Order reuses Kanban order management pattern.
5. Menu CRUD uses `Admin/MenuController` and `StoreMenuRequest`.
6. Category CRUD uses `Admin/CategoryController`.
7. Staff/Admin CRUD uses `Admin/StaffController`.
8. Finance loads monthly completed orders and metrics.
9. AI analytics calls Laravel `AiService`.
10. Settings backend routes exist but the frontend page is not present in this snapshot.

## Payment Flow

Cash:

```text
Customer Chooses Cash
v
PaymentService creates waiting_verification payment
v
Staff Dashboard
v
Staff verifies amount
v
Payment marked paid
v
Order marked confirmed if pending
v
PaymentStatusUpdated / OrderStatusUpdated events
v
Customer Order Status updates
```

Pakasir QRIS/BRI VA:

```text
Customer Chooses QRIS or BRI VA
v
Laravel PaymentController
v
PakasirService createTransaction
v
Pakasir returns payment_number / expiry / fee
v
Payment row created as unpaid
v
Customer sees QRIS or VA number
v
Pakasir Webhook
v
Laravel validates payload + transaction detail
v
Payment marked paid
v
Order marked confirmed
v
Events broadcast
v
Customer/Staff/Admin status updates
```

Current Pakasir integration:

- Methods supported: `qris`, `bri_va`.
- Internal payment methods: `qris_pakasir`, `bri_va_pakasir`.
- Active gateway is selected with `PAYMENT_GATEWAY=pakasir`.
- Webhook route: `POST /api/webhooks/pakasir`.
- Simulation route: `POST /api/dev/pakasir/payments/{order}/simulate`.
- Webhook payload is validated for project, order reference, amount, and status.
- Transaction detail API is checked before paid status is applied.
- Duplicate webhooks are treated idempotently and do not reprocess already-paid payments.
- Raw webhook data is stored only as needed for audit/debug context.
- Simulation is guarded to local/testing or sandbox mode and must not execute in production.

Pakasir production gaps:

- Add signature/HMAC validation if supported by Pakasir.
- Add timestamp freshness window.
- Add nonce/hash replay protection.
- Add scheduled reconciliation and expiry handling.
- Add explicit rate limiting to webhook traffic.

Midtrans status:

```text
Midtrans code exists
v
PaymentService createSnapTransaction / handleNotification / verifyPayment
v
Current production flow routes online payment to Pakasir when PAYMENT_GATEWAY=pakasir
v
Treat Midtrans as future/legacy integration unless PAYMENT_GATEWAY=midtrans and the flow is retested
```

Midtrans routes/controllers should remain guarded so they only run when `PAYMENT_GATEWAY=midtrans`.

## AI Analytics Flow

Serving time estimation:

```text
Customer Estimate Page
v
POST /customer/api/estimate
v
Customer/OrderController@getEstimatedTime
v
AiService::getServingTimeEstimation
v
FastAPI /api/estimation/predict
v
Fallback calculation if unavailable
v
Customer estimate display
```

Popular menu:

```text
Admin AI Analytics
v
Admin/AnalyticsController@index
v
AiService::getPopularMenus
v
FastAPI /api/menu/populer
v
Database fallback if unavailable
v
AI Analytics page ranking
```

Sentiment:

```text
Customer Feedback
v
ReviewController@store
v
AiService::analyzeSentiment
v
FastAPI /api/sentiment/analyze
v
Keyword fallback if unavailable
v
Review saved with sentiment_label
v
Admin AI Analytics sentiment summary
```

FastAPI internals:

```text
main.py
v
routers/estimation.py
routers/menu.py
routers/sentiment.py
v
model_loader.py
v
saved_models/*.pkl and *.json
v
database.py SQLAlchemy connection
```

AI failure behavior:

- Model files are loaded through safe try/catch helpers with status flags.
- `/health` reports service, estimation model, sentiment model, and database status.
- Estimation, popular menu, and sentiment endpoints return safe fallback responses if models or database access fail.
- Laravel `AiService` also keeps graceful fallbacks when FastAPI is down or times out.

## Realtime Architecture

```text
Laravel Event
v
ShouldBroadcast
v
Queue Worker
v
Reverb
v
Laravel Echo in Browser
v
Customer / Staff / Admin UI
```

Events:

- New order broadcasts to `staff-orders` and `order.{id}`.
- Order status broadcasts to `staff-orders` and `order.{id}`.
- Payment status broadcasts to `order.{id}` and `staff-payments`.

Important note:

- Order/payment/staff broadcasts use `PrivateChannel`.
- `routes/channels.php` authorizes `order.{id}` for the owning customer session or authenticated staff/admin users.
- `staff-orders` and `staff-payments` are limited to authenticated staff/admin users.
- Frontend Echo subscriptions use private channels.
- Staff and customer UIs still use polling as a fallback if Echo/Reverb fails.

## Route Architecture

`routes/web.php`:

- Auth routes.
- Staff route group with `auth` and `role:staff`.
- Admin route group with `auth` and `role:admin`.
- Customer public route group.

`routes/api.php`:

- Public API health, menu, order, payment callback/webhooks, review, settings.
- Protected API routes under `auth:sanctum`.

`routes/channels.php`:

- Broadcast channel authorization definitions.

## Validation Architecture

Form Requests:

- `CreateOrderRequest`: validates order type, table number, customer name, items, quantities, notes.
- `CreateReviewRequest`: validates rating and comment.
- `StoreMenuRequest` / `UpdateMenuRequest`: validates menu fields and image.
- `StoreCategoryRequest` / `UpdateCategoryRequest`: validates category name uniqueness.

Inline request validation still exists in some controllers:

- Staff payment verification.
- Staff/admin user CRUD.
- System config updates.
- Analytics test endpoints.

## Testing Architecture

Existing tests:

- `tests/Feature/CustomerOrderAccessTest.php`
- `tests/Feature/OrderIntegrityTest.php`
- `tests/Feature/AiServiceFallbackTest.php`
- `tests/Feature/PakasirPaymentTest.php`
- `tests/Feature/Staff/StaffTransactionsAccessTest.php`
- `tests/Feature/Admin/MenuCategoryManagementTest.php`
- `tests/Feature/Admin/StaffExportTest.php`
- `tests/Unit/OrderServiceTest.php`

Coverage highlights:

- Server-side order total calculation.
- Table number normalization.
- Pakasir create QRIS and BRI VA.
- Pakasir webhook valid/invalid payloads.
- Pakasir duplicate webhook, invalid amount, invalid project, unknown order, and production simulation guard.
- Cash waiting verification.
- Customer payment status endpoint contract.
- Pakasir sandbox simulation.
- Customer order/payment/review ownership access.
- Private broadcast channel authorization.
- Order detail snapshots, review uniqueness, status normalization, and menu delete history safety.
- Laravel AI fallback behavior when FastAPI is unavailable.
- Admin category/menu basic behavior.
- Staff transaction page access.
- Staff export.

Missing test areas:

- Full browser E2E customer flow.
- Failed/expired payment.
- Replay attack attempt.
- Reverb end-to-end in a real browser/runtime.
- Admin settings.
- Full FastAPI model failure suite outside Laravel fallback tests.
- Finance export content.
- Admin AI analytics edge cases.

## Production Architecture Recommendations

Target production shape:

```text
Nginx + SSL
v
Laravel PHP-FPM
v
PostgreSQL
v
Queue Worker + Scheduler
v
Reverb WebSocket Service
v
FastAPI AI Service
v
Pakasir Webhook over HTTPS
```

Required hardening:

- Keep private broadcast channels for order/payment data and run a production Reverb smoke test.
- Keep `is_active` login enforcement covered in auth testing.
- Rotate any real secrets outside the repository and keep examples placeholder-only.
- Disable debug mode.
- Add payment webhook signature/replay security if Pakasir supports it.
- Add explicit rate limiting for login, order creation, payment creation, and webhook endpoints.
- Add production queue/scheduler supervision.
- Use the Docker/deployment files or an equivalent VPS setup documented in `docs/DEPLOYMENT.md`.
- Maintain DB indexes and historical order snapshots through non-destructive migrations.
- Add backup, monitoring, alerting, and log retention.

## Files To Read First In A New Session

1. `docs/PROJECT_HANDOVER.md`
2. `docs/ARCHITECTURE.md`
3. `routes/web.php`
4. `routes/api.php`
5. `app/Services/OrderService.php`
6. `app/Services/PakasirService.php`
7. `app/Services/AiService.php`
8. `app/Http/Controllers/Customer/PaymentController.php`
9. `resources/js/Pages/Customer/OrderStatus.tsx`
10. `resources/js/Pages/Staff/Dashboard.tsx`
11. `resources/js/Pages/Admin/AIAnalytics.tsx`

## Known Architecture Gaps

- Settings module is architecturally incomplete.
- Realtime uses private Reverb channels with polling fallback, but full production Reverb E2E verification is still needed.
- Payment state machine is not fully formalized.
- Pakasir simulation route remains registered, although production execution is guarded.
- Public settings/review/menu APIs need a focused data exposure audit.
- Admin AI Analytics still needs type/interface cleanup, inline style cleanup, and mock/static data review.
- `ReviewController::getStatistics` raw SQL string quoting needs PostgreSQL-safe cleanup.
- Admin/staff validation is not fully Form Request based.
- Explicit rate limiting and production observability are not complete.
