# ARCHITECTURE

## Overview

UCW App is a full-stack web application composed of:

- Laravel backend for routing, auth, order/payment/admin logic, database access, and broadcasting.
- Inertia + React TypeScript frontend for customer, staff, and admin experiences.
- PostgreSQL/SQLite database for application state.
- Pakasir payment gateway for QRIS and BRI VA.
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
    customer/
    Layout/
    Modals/
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
- Layout components: admin layout/sidebar/topbar, staff layout/sidebar, customer layout.
- Modal components: order detail, cash payment, add/edit menu, category, delete confirmation, add/edit user.
- UI components: button, badge, stat card, status badge, kanban card, pagination, inputs, spinner.

Hooks:

- `useCart.ts`: localStorage-backed customer cart state.
- `useOrder.ts`: exists for order-related behavior.
- `useEcho.ts`: exists but appears empty in current snapshot.

Types:

- `customer.ts`: customer menu/order/payment types.
- `staff.ts`: staff user, Kanban order, transaction types.
- `admin.ts`: admin-related types.
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
- `order_details.menu_id -> menus.id` with cascade delete.
- `payments.order_id -> orders.id` with cascade delete.
- `reviews.order_id -> orders.id` with cascade delete.

Database architecture notes:

- Order totals are calculated server-side from `menus.price`.
- `orders.order_ref` is added by Pakasir migration and made unique.
- Payment-specific provider data is stored in `payments`.
- Order and payment status columns are converted from enum to string by the Pakasir migration.
- For production, historical order item snapshots and safer delete behavior are recommended.

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
- Webhook route: `POST /api/webhooks/pakasir`.
- Simulation route: `POST /api/dev/pakasir/payments/{order}/simulate`.
- Transaction detail API is checked before paid status is applied.

Pakasir production gaps:

- Add signature/HMAC validation if supported by Pakasir.
- Add timestamp freshness window.
- Add nonce/hash replay protection.
- Add idempotency handling for duplicate webhooks.
- Add scheduled reconciliation and expiry handling.

Midtrans status:

```text
Midtrans code exists
v
PaymentService createSnapTransaction / handleNotification / verifyPayment
v
Current UI flow mostly routes online payment to Pakasir
v
Treat Midtrans as legacy/partial unless retested
```

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
saved_models/*.pkl and *.json
v
database.py SQLAlchemy connection
```

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

- Some events currently use public `Channel` instead of `PrivateChannel`.
- `routes/channels.php` customer order channel authorization is currently permissive.
- Staff and customer UIs also use polling, which provides a demo fallback.

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
- Cash waiting verification.
- Customer payment status endpoint contract.
- Pakasir sandbox simulation.
- Admin category/menu basic behavior.
- Staff transaction page access.
- Staff export.

Missing test areas:

- Full browser E2E customer flow.
- Failed/expired payment.
- Duplicate webhook/idempotency.
- Replay attack attempt.
- Reverb end-to-end.
- Admin settings.
- AI service model failure.
- Finance export content.
- Authorization edge cases for order status APIs.

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

- Use private broadcast channels for order/payment data.
- Enforce `is_active` login.
- Rotate secrets and remove secrets from examples.
- Disable debug mode.
- Add payment webhook security and idempotency.
- Add production queue/scheduler supervision.
- Fix Docker or deploy manually with a clear VPS guide.
- Add DB indexes and historical order snapshots.
- Add backup and monitoring.

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
- Realtime uses a mix of intended Reverb and actual polling fallback.
- Payment state machine is not fully formalized.
- AI service error handling is split: Laravel fallback exists, FastAPI startup fallback does not.
- Docker deployment files do not match current folder names.
- Database delete behavior is not ideal for historical transaction data.
