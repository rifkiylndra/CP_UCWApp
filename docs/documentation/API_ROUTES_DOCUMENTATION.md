# API and Routes Documentation

## 1. Overview

Route UCW App berada di:

- `routes/web.php`
- `routes/api.php`
- `routes/channels.php`

Jenis route:

- Web/Inertia route untuk customer, staff, admin.
- API route public/protected.
- Webhook route.
- Realtime auth route.
- Broadcast channel authorization.

Jangan menulis secret atau provider payload asli di dokumentasi/API response publik.

## 2. Auth Routes

| Method | URL | Name | Controller | Middleware | Response |
| --- | --- | --- | --- | --- | --- |
| GET | `/login` | `login` | `AuthController@showLogin` | web | Inertia login |
| POST | `/login` | `login.post` | `AuthController@login` | `throttle:10,1` | Redirect berdasarkan role |
| POST | `/logout` | `logout` | `AuthController@logout` | web/auth expected by form | Redirect login |

Security:

- Login mengecek `is_active`.
- Session diregenerate saat login.

## 3. Realtime Auth Route

| Method | URL | Controller | Middleware | Response |
| --- | --- | --- | --- | --- |
| POST | `/realtime/auth` | closure in `web.php` | `throttle:60,1` | Echo auth JSON |

Behavior:

- `private-staff-orders` dan `private-staff-payments` hanya staff/admin.
- `private-order.{id}` hanya staff/admin atau customer owner session.
- Fallback ke `Broadcast::auth($request)` untuk channel lain.

## 4. Customer Web Routes

Prefix: `/customer`

| Method | URL | Name | Controller | Middleware | Response |
| --- | --- | --- | --- | --- | --- |
| GET | `/customer` | `customer.landing` | closure | web | `Customer/Landing` |
| GET | `/customer/menu` | `customer.menu` | `Customer\MenuController@index` | web | `Customer/Menu` |
| GET | `/customer/cart` | `customer.cart` | `Customer\OrderController@cart` | web | `Customer/Cart` |
| GET | `/customer/order-type` | `customer.order-type` | closure | web | `Customer/OrderType` |
| GET | `/customer/estimate` | `customer.estimate` | closure | web | `Customer/Estimate` |
| POST | `/customer/order` | `customer.order.store` | `Customer\OrderController@store` | `throttle:30,1` | JSON order/redirect data |
| POST | `/customer/api/estimate` | `customer.api.estimate` | `Customer\OrderController@getEstimatedTime` | web | JSON estimate |
| GET | `/customer/order/{order}/status` | `customer.order.status` | `Customer\OrderController@status` | ownership check inside | `Customer/OrderStatus` |
| GET | `/customer/status/{order}` | `customer.status` | `Customer\OrderController@status` | ownership check inside | `Customer/OrderStatus` |
| GET | `/customer/order/{order}` | `customer.order.show` | `Customer\OrderController@show` | ownership check inside | JSON sanitized order |
| POST | `/customer/order/{order}/cancel` | `customer.order.cancel` | `Customer\OrderController@cancel` | ownership check inside | JSON/redirect |
| GET | `/customer/table/{table}/orders` | `customer.table.orders` | `Customer\OrderController@getTableOrders` | web | JSON |

Menu customer:

| Method | URL | Name | Controller |
| --- | --- | --- | --- |
| GET | `/customer/menu/category/{category}` | `customer.menu.byCategory` | `Customer\MenuController@getByCategory` |
| GET | `/customer/menu/search` | `customer.menu.search` | `Customer\MenuController@search` |
| GET | `/customer/menu/{menu}` | `customer.menu.show` | `Customer\MenuController@show` |

Payment customer:

| Method | URL | Name | Controller | Middleware |
| --- | --- | --- | --- | --- |
| GET | `/customer/order/{order}/payment` | `customer.payment` | `Customer\PaymentController@index` | ownership check |
| POST | `/customer/order/{order}/payment/process` | `customer.payment.process` | `Customer\PaymentController@process` | `throttle:30,1` |
| POST | `/customer/order/{order}/payments/pakasir` | `customer.payment.pakasir.order` | `Customer\PaymentController@createPakasirPaymentByOrder` | `throttle:30,1` |
| POST | `/customer/{tableId}/orders/{order}/payments/pakasir` | `customer.payment.pakasir` | `Customer\PaymentController@createPakasirPayment` | `throttle:30,1` |
| GET | `/customer/order/{order}/payment/success` | `customer.payment.success` | `Customer\PaymentController@success` | ownership check |
| GET | `/customer/order/{order}/payment/error` | `customer.payment.error` | `Customer\PaymentController@error` | ownership check |
| GET | `/customer/order/{order}/payment/status` | `customer.payment.status` | `Customer\PaymentController@checkStatus` | ownership check |
| GET | `/customer/order/{order}/payment/cash` | `customer.payment.cash` | closure | ownership check |
| GET | `/customer/order/{order}/payment/online` | `customer.payment.online` | closure | ownership check |
| POST | `/customer/payment/callback` | `customer.payment.callback` | `Customer\PaymentController@callback` | CSRF except |

Review customer:

| Method | URL | Name | Controller |
| --- | --- | --- | --- |
| GET | `/customer/order/{order}/review` | `customer.review.create` | `Customer\ReviewController@create` |
| POST | `/customer/order/{order}/complete-transaction` | `customer.review.store` | `Customer\ReviewController@store` |
| GET | `/customer/order/{order}/reviews` | `customer.review.list` | `Customer\ReviewController@getOrderReviews` |
| GET | `/customer/reviews/recent` | `customer.review.recent` | `Customer\ReviewController@getRecentReviews` |
| GET | `/customer/reviews/statistics` | `customer.review.statistics` | `Customer\ReviewController@getStatistics` |
| GET | `/customer/order/{order}/feedback` | `customer.feedback` | closure | ownership + completed check |

Backward-compatible redirects:

- `/{tableId}` style customer paths redirect to current customer routes.
- Numeric order URL redirects to `order_ref` URL.

## 5. Staff Routes

Prefix: `/staff`

Middleware: `auth`, `role:staff`

| Method | URL | Name | Controller |
| --- | --- | --- | --- |
| GET | `/staff/dashboard` | `staff.dashboard` | `Staff\DashboardController@index` |
| GET | `/staff/transactions` | `staff.transactions` | `Staff\DashboardController@transactions` |
| GET | `/staff/transactions/export` | `staff.transactions.export` | `Staff\DashboardController@exportTransactions` |
| GET | `/staff/orders/status/{status}` | `staff.orders.byStatus` | `Staff\DashboardController@getOrdersByStatus` |
| PUT | `/staff/order/{order}/status` | `staff.order.updateStatus` | `Staff\DashboardController@updateOrderStatus` |
| GET | `/staff/order/{order}` | `staff.order.details` | `Staff\DashboardController@getOrderDetails` |
| GET | `/staff/orders/today` | `staff.orders.today` | `Staff\DashboardController@getTodayOrders` |
| GET | `/staff/statistics` | `staff.statistics` | `Staff\DashboardController@getStatistics` |

Staff payment:

| Method | URL | Name | Controller |
| --- | --- | --- | --- |
| POST | `/staff/payments/order/{order}/verify-cash` | `staff.payments.verifyCash` | `Staff\PaymentController@verifyCashPayment` |
| GET | `/staff/payments/{payment}` | `staff.payments.details` | `Staff\PaymentController@getPaymentDetails` |
| GET | `/staff/payments/today` | `staff.payments.today` | `Staff\PaymentController@getTodayPayments` |
| GET | `/staff/payments/statistics` | `staff.payments.statistics` | `Staff\PaymentController@getPaymentStatistics` |
| POST | `/staff/payments/{payment}/refund` | `staff.payments.refund` | `Staff\PaymentController@refundPayment` |

## 6. Admin Routes

Prefix: `/admin`

Middleware: `auth`, `role:admin`

Dashboard:

| Method | URL | Name | Controller |
| --- | --- | --- | --- |
| GET | `/admin/overview` | `admin.overview` | `Admin\DashboardController@overview` |
| GET | `/admin/live-order` | `admin.live-order` | `Admin\DashboardController@liveOrder` |
| GET | `/admin/statistics/orders-chart` | `admin.statistics.ordersChart` | `Admin\DashboardController@getOrdersChartData` |
| GET | `/admin/statistics/revenue` | `admin.statistics.revenue` | `Admin\DashboardController@getRevenueStatistics` |

Menu/category:

| Method | URL | Name | Controller |
| --- | --- | --- | --- |
| GET | `/admin/menu` | `admin.menu` | `Admin\MenuController@index` |
| POST | `/admin/menu` | `admin.menu.store` | `Admin\MenuController@store` |
| POST | `/admin/menu/{menu}` | `admin.menu.update` | `Admin\MenuController@update` |
| DELETE | `/admin/menu/{menu}` | `admin.menu.destroy` | `Admin\MenuController@destroy` |
| GET | `/admin/menu-categories` | `admin.menu-categories.index` | `Admin\CategoryController@index` |
| POST | `/admin/menu-categories` | `admin.menu-categories.store` | `Admin\CategoryController@store` |
| PUT | `/admin/menu-categories/{category}` | `admin.menu-categories.update` | `Admin\CategoryController@update` |
| DELETE | `/admin/menu-categories/{category}` | `admin.menu-categories.destroy` | `Admin\CategoryController@destroy` |

Staff/admin:

| Method | URL | Name | Controller |
| --- | --- | --- | --- |
| GET | `/admin/staff` | `admin.staff` | `Admin\StaffController@index` |
| GET | `/admin/staff/export` | `admin.staff.export` | `Admin\StaffController@export` |
| POST | `/admin/staff` | `admin.staff.store` | `Admin\StaffController@store` |
| PUT | `/admin/staff/{staff}` | `admin.staff.update` | `Admin\StaffController@update` |
| DELETE | `/admin/staff/{staff}` | `admin.staff.destroy` | `Admin\StaffController@destroy` |

Finance/feedback:

| Method | URL | Name | Controller |
| --- | --- | --- | --- |
| GET | `/admin/finances` | `admin.finances-page` | `Admin\FinanceController@index` |
| GET | `/admin/finances/export` | `admin.finances.export` | `Admin\FinanceController@export` |
| GET | `/admin/feedback` | `admin.feedback` | `Admin\FeedbackController@index` |
| GET | `/admin/feedback/export` | `admin.feedback.export` | `Admin\FeedbackController@export` |

AI analytics:

| Method | URL | Name | Controller |
| --- | --- | --- | --- |
| GET | `/admin/ai-analytics` | `admin.analytics-page` | `Admin\AnalyticsController@index` |
| GET | `/admin/analytics/serving-time` | `admin.analytics.servingTime` | `Admin\AnalyticsController@getServingTimeEstimation` |
| GET | `/admin/analytics/popular-menus` | `admin.analytics.popularMenus` | `Admin\AnalyticsController@getPopularMenus` |
| POST | `/admin/analytics/analyze-sentiment` | `admin.analytics.analyzeSentiment` | `Admin\AnalyticsController@analyzeSentiment` |
| GET | `/admin/analytics/sentiment-summary` | `admin.analytics.sentimentSummary` | `Admin\AnalyticsController@getSentimentSummaryData` |
| GET | `/admin/analytics/model-performance` | `admin.analytics.modelPerformance` | `Admin\AnalyticsController@getModelPerformance` |

Settings:

| Method | URL | Name | Controller |
| --- | --- | --- | --- |
| GET | `/admin/settings` | `admin.settings.index` | `Admin\SystemConfigController@index` |
| GET | `/admin/settings/all` | `admin.settings.all` | `Admin\SystemConfigController@getAll` |
| GET | `/admin/settings/{key}` | `admin.settings.get` | `Admin\SystemConfigController@get` |
| PUT | `/admin/settings/{key}` | `admin.settings.update` | `Admin\SystemConfigController@update` |
| PUT | `/admin/settings` | `admin.settings.updateMultiple` | `Admin\SystemConfigController@updateMultiple` |
| GET | `/admin/settings/system/settings` | `admin.settings.system` | `Admin\SystemConfigController@getSettings` |
| GET | `/admin/settings/payment/settings` | `admin.settings.payment` | `Admin\SystemConfigController@getPaymentSettings` |
| PUT | `/admin/settings/payment/settings` | `admin.settings.updatePayment` | `Admin\SystemConfigController@updatePaymentSettings` |

Catatan:

- Route settings dengan `{key}` muncul sebelum beberapa path nested. Jika ada konflik matching, perlu smoke test route settings.

## 7. API Routes

Base: `/api`

Public API:

| Method | URL | Controller | Middleware | Notes |
| --- | --- | --- | --- | --- |
| GET | `/api/health` | closure | api | UCW API health |
| GET | `/api/menu` | `Customer\MenuController@index` | api | Public menu |
| GET | `/api/menu/category/{category}` | `Customer\MenuController@getByCategory` | api | Public menu filter |
| GET | `/api/menu/search` | `Customer\MenuController@search` | api | Public search |
| GET | `/api/menu/{menu}` | `Customer\MenuController@show` | api | Public detail |
| POST | `/api/order` | `Customer\OrderController@store` | `throttle:30,1` | QR order |
| GET | `/api/order/{order}` | `Customer\OrderController@show` | api | Ownership check in controller |
| GET | `/api/order/table/{table}/orders` | `Customer\OrderController@getTableOrders` | api | Table orders |
| POST | `/api/payment/callback` | `Customer\PaymentController@callback` | CSRF except | Midtrans legacy |
| POST | `/api/webhooks/pakasir` | `Customer\PaymentController@pakasirWebhook` | `throttle:120,1` | Pakasir webhook |
| POST | `/api/dev/pakasir/payments/{order}/simulate` | `Customer\PaymentController@simulatePakasirPayment` | conditional + throttle | Local/testing/sandbox only |
| POST | `/api/review/order/{order}` | `Customer\ReviewController@store` | api | Review |
| GET | `/api/review/order/{order}` | `Customer\ReviewController@getOrderReviews` | api | Review list |
| GET | `/api/review/recent` | `Customer\ReviewController@getRecentReviews` | api | Public recent |
| GET | `/api/review/statistics` | `Customer\ReviewController@getStatistics` | api | Public statistics |
| GET | `/api/settings/system` | `Admin\SystemConfigController@getSettings` | api | Public system settings |

Protected API:

- Middleware: `auth:sanctum`, `api`.
- Staff subroutes also require `role:staff`.
- Admin subroutes also require `role:admin`.

Protected API duplicates some staff/admin web endpoints for programmatic access.

## 8. Webhook Routes

Pakasir:

- `POST /api/webhooks/pakasir`
- Middleware: API + throttle.
- CSRF exempt.
- Validates project/order/status/method/amount.
- Checks Pakasir transaction detail.
- Idempotent for duplicate webhook.

Midtrans legacy:

- `POST /api/payment/callback`
- `POST /customer/payment/callback`
- CSRF exempt.
- Treat as future/legacy unless `PAYMENT_GATEWAY=midtrans` and flow retested.

## 9. Broadcast Channels

Defined in `routes/channels.php`.

| Channel | Authorization |
| --- | --- |
| `App.Models.User.{id}` | user id matches |
| `staff-orders` | staff/admin |
| `staff-payments` | staff/admin |
| `order.{orderId}` | staff/admin or customer owner session |
| `admin-analytics` | admin |

## 10. Perlu Dikonfirmasi

- Settings route matching order untuk nested paths.
- Public settings/review/menu exposure saat field baru ditambahkan.
- Admin LiveOrder update endpoint memakai staff URL; perlu UAT authorization.
- Midtrans callback route harus tetap non-active untuk production Pakasir.

