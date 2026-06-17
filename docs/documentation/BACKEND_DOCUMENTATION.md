# Backend Documentation

## 1. Overview

Backend UCW App dibangun dengan Laravel 12. Backend menangani:

- Web route dan Inertia response.
- Auth universal untuk admin/staff.
- Customer QR ordering tanpa login.
- Order lifecycle.
- Payment cash dan Pakasir.
- Midtrans legacy/future gateway.
- Staff dashboard dan transaction export.
- Admin dashboard, menu/category CRUD, staff/admin CRUD, finance, feedback, AI analytics, settings.
- Private realtime broadcast via Laravel Reverb.
- Laravel-side AI proxy/fallback.

Struktur utama:

```text
app/
  Http/
    Controllers/
      Admin/
      Customer/
      Staff/
    Requests/
      Admin/
      Customer/
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

## 2. Middleware, Auth, and Role

Auth controller utama:

- `App\Http\Controllers\AuthController`
  - `showLogin()`: render halaman login universal.
  - `login(Request)`: validasi login, cek `is_active`, login user, redirect berdasarkan role.
  - `logout(Request)`: logout, invalidate session, regenerate CSRF token.

Controller auth legacy/khusus:

- `AdminAuthController`
- `StaffAuthController`

Catatan:

- Route aktif utama memakai `/login` universal.
- `Admin/Login.tsx` masih ada di frontend, tetapi route admin login khusus perlu dikonfirmasi sebelum dianggap aktif.

Role middleware:

- Alias: `role`.
- Staff route: `auth`, `role:staff`.
- Admin route: `auth`, `role:admin`.

Throttle:

- `POST /login`: `throttle:10,1`
- Customer order/payment creation: `throttle:30,1`
- Pakasir webhook: `throttle:120,1`
- `/realtime/auth`: `throttle:60,1`

CSRF exception:

- `api/webhooks/pakasir`
- `api/payment/callback`
- `customer/payment/callback`

## 3. Customer Controllers

### `Customer/MenuController`

Tanggung jawab:

- Menampilkan menu customer.
- Memberikan endpoint filter category/search/detail menu.
- Mengirim field gambar publik (`image`, `image_url`, `imageUrl`) dan data kategori.

Route terkait:

- `GET /customer/menu`
- `GET /customer/menu/category/{category}`
- `GET /customer/menu/search`
- `GET /customer/menu/{menu}`
- API public mirror: `/api/menu/*`

Output utama:

- Inertia page `Customer/Menu`.
- JSON menu/category untuk endpoint API.

Catatan keamanan:

- Hanya data menu publik yang perlu diekspos.
- Audit data exposure perlu dilakukan saat field menu baru ditambahkan.

### `Customer/OrderController`

Tanggung jawab:

- Render cart page.
- Membuat order customer.
- Menampilkan status/order detail.
- Cancel order.
- Menghitung estimasi via `AiService`.
- Sanitasi response order/payment publik.

Route terkait:

- `GET /customer/cart`
- `POST /customer/order`
- `GET /customer/order/{order}/status`
- `GET /customer/order/{order}`
- `POST /customer/order/{order}/cancel`
- `GET /customer/table/{table}/orders`
- `POST /customer/api/estimate`

Dependency:

- `OrderService`
- `AiService`
- `CustomerOrderAccessService`
- `CreateOrderRequest`

Validasi utama:

- `order_type`: dine-in/takeaway.
- Dine-in membutuhkan `table_number`.
- Takeaway membutuhkan `customer_name`.
- Items harus ada dan quantity valid.
- Menu harus available; harga frontend diabaikan.

Catatan keamanan:

- Order yang baru dibuat diberi session access token oleh `CustomerOrderAccessService`.
- Customer tidak boleh akses order hanya dengan menebak `order_ref`.
- Output publik tidak mengekspos `raw_response`, `raw_webhook`, atau payload provider.

### `Customer/PaymentController`

Tanggung jawab:

- Render payment selection.
- Memproses cash/Pakasir/Midtrans legacy callback.
- Membuat Pakasir QRIS/BRI VA transaction.
- Menerima webhook Pakasir.
- Menyediakan payment status customer.
- Menyediakan sandbox simulation route saat non-production.

Route terkait:

- `GET /customer/order/{order}/payment`
- `POST /customer/order/{order}/payment/process`
- `POST /customer/order/{order}/payments/pakasir`
- `GET /customer/order/{order}/payment/online`
- `GET /customer/order/{order}/payment/cash`
- `GET /customer/order/{order}/payment/status`
- `POST /api/webhooks/pakasir`
- `POST /api/dev/pakasir/payments/{order}/simulate` jika environment mengizinkan
- `POST /customer/payment/callback` untuk Midtrans legacy

Dependency:

- `PaymentService`
- `PakasirService`
- `CustomerOrderAccessService`

Pakasir flow:

- Method provider: `qris`, `bri_va`.
- Method internal: `qris_pakasir`, `bri_va_pakasir`.
- Payment dibuat/update idempotent dengan provider/reference/method.
- Webhook valid jika project, order ref, status completed, method, amount cocok.
- Controller juga mengecek transaction detail sebelum paid.

Catatan keamanan:

- Simulation route tidak didaftarkan di production dan controller tetap guard.
- Webhook belum terlihat memakai signature/timestamp/nonce. Jika Pakasir mendukung, ini perlu ditambahkan.
- Raw webhook disimpan untuk audit tetapi tidak diekspos ke customer.

### `Customer/ReviewController`

Tanggung jawab:

- Render feedback page.
- Simpan review.
- Panggil `AiService::analyzeSentiment` bila ada feedback bermakna.
- Ambil review order/recent/statistics.

Route terkait:

- `GET /customer/order/{order}/review`
- `POST /customer/order/{order}/complete-transaction`
- `GET /customer/order/{order}/reviews`
- `GET /customer/reviews/recent`
- `GET /customer/reviews/statistics`
- API public mirror: `/api/review/*`

Validasi:

- `CreateReviewRequest`
- `rating`: nullable integer 1-5.
- `comment`: nullable string max 1000.

Catatan:

- `reviews.order_id` unique, satu review per order.
- Customer ownership dicek untuk route order-specific.
- Public recent/statistics perlu diaudit saat field review baru ditambahkan.

## 4. Staff Controllers

### `Staff/DashboardController`

Tanggung jawab:

- Render staff dashboard.
- Mengambil order per status.
- Update order status.
- Mengambil detail order.
- Menampilkan transactions.
- Export transactions CSV.
- Statistik staff.

Route terkait:

- `GET /staff/dashboard`
- `GET /staff/transactions`
- `GET /staff/transactions/export`
- `GET /staff/orders/status/{status}`
- `PUT /staff/order/{order}/status`
- `GET /staff/order/{order}`
- `GET /staff/orders/today`
- `GET /staff/statistics`

Dependency:

- `OrderService`

Catatan:

- Status `processing` dinormalisasi sebagai `preparing` di storage/customer-safe mapping.
- Staff board punya polling fallback dari frontend.

### `Staff/PaymentController`

Tanggung jawab:

- Verifikasi cash payment.
- Detail payment.
- List payment hari ini.
- Statistik payment.
- Refund endpoint.

Route terkait:

- `POST /staff/payments/order/{order}/verify-cash`
- `GET /staff/payments/{payment}`
- `GET /staff/payments/today`
- `GET /staff/payments/statistics`
- `POST /staff/payments/{payment}/refund`

Dependency:

- `PaymentService`

Catatan:

- Validasi amount masih inline di controller, belum seluruhnya Form Request.
- Refund perlu dikonfirmasi flow production-nya sebelum dipakai.

### `Staff/StaffDashboardController`

Status:

- File ada, berisi dashboard dummy/legacy.
- Route aktif di `web.php` dan `api.php` memakai `Staff\DashboardController`.
- Cleanup file legacy perlu konfirmasi sebelum penghapusan.

## 5. Admin Controllers

### `Admin/DashboardController`

Tanggung jawab:

- Overview dashboard.
- Live order page.
- Statistik dashboard.
- Recent orders.
- Top menus.
- Chart daily/weekly.
- Revenue statistics.

Route terkait:

- `GET /admin/overview`
- `GET /admin/live-order`
- `GET /admin/statistics/orders-chart`
- `GET /admin/statistics/revenue`

Catatan:

- Revenue dihitung dari order `completed` dan `payment_status=paid`.
- Chart memakai Eloquent/query builder agar lebih portable.

### `Admin/MenuController`

Tanggung jawab:

- Render menu management.
- Store/update/delete menu.
- Upload image menu.

Route terkait:

- `GET /admin/menu`
- `POST /admin/menu`
- `POST /admin/menu/{menu}`
- `DELETE /admin/menu/{menu}`

Validasi:

- `StoreMenuRequest`
- `UpdateMenuRequest`

Catatan integrity:

- `Menu::deleting()` mengosongkan `order_details.menu_id`.
- Histori order tetap memakai snapshot `menu_name`, `unit_price`, `subtotal`.

### `Admin/CategoryController`

Tanggung jawab:

- Category CRUD.

Route terkait:

- `GET /admin/menu-categories`
- `POST /admin/menu-categories`
- `PUT /admin/menu-categories/{category}`
- `DELETE /admin/menu-categories/{category}`

Validasi:

- `StoreCategoryRequest`
- `UpdateCategoryRequest`

Catatan:

- Controller mencegah delete category jika masih dipakai menu.
- Database FK `menus.category_id` masih cascade; jangan bypass controller di production.

### `Admin/StaffController`

Tanggung jawab:

- Staff/admin user directory.
- Create/update/delete user.
- Export staff/admin CSV.

Route terkait:

- `GET /admin/staff`
- `GET /admin/staff/export`
- `POST /admin/staff`
- `PUT /admin/staff/{staff}`
- `DELETE /admin/staff/{staff}`

Validasi:

- `StoreStaffRequest`
- `UpdateStaffRequest`

Catatan:

- Password harus diganti untuk production.
- Seed/default password tidak boleh dipakai production.

### `Admin/FinanceController`

Tanggung jawab:

- Finance dashboard bulanan.
- Transaction list.
- Export finance CSV.

Route terkait:

- `GET /admin/finances`
- `GET /admin/finances/export`

Catatan:

- Hanya order `completed + paid` dihitung revenue.
- Filter memakai `month=YYYY-MM`.

### `Admin/AnalyticsController`

Tanggung jawab:

- Render AI analytics.
- Proxy data AI serving time, popular menu, sentiment.
- Model performance endpoint.
- Check AI service status.

Route terkait:

- `GET /admin/ai-analytics`
- `GET /admin/analytics/serving-time`
- `GET /admin/analytics/popular-menus`
- `POST /admin/analytics/analyze-sentiment`
- `GET /admin/analytics/sentiment-summary`
- `GET /admin/analytics/model-performance`

Dependency:

- `AiService`

Catatan:

- Jika FastAPI down, UI/backend harus menampilkan fallback/demo label dengan jelas.
- Model performance sebagian masih berupa data statis/mock; perlu dikonfirmasi jika dipakai laporan production.

### `Admin/FeedbackController`

Tanggung jawab:

- Halaman feedback admin.
- Filter rating/sentiment/search.
- Export feedback CSV.

Route terkait:

- `GET /admin/feedback`
- `GET /admin/feedback/export`

Dependency:

- `FeedbackService`
- `FeedbackFilterRequest`

### `Admin/SystemConfigController`

Tanggung jawab:

- System settings API.
- Payment settings API.
- Render settings/index bila digunakan.

Route terkait:

- `GET /admin/settings`
- `GET /admin/settings/all`
- `GET /admin/settings/{key}`
- `PUT /admin/settings/{key}`
- `PUT /admin/settings`
- `GET /admin/settings/payment/settings`
- `PUT /admin/settings/payment/settings`

Catatan:

- Halaman frontend `Admin/SystemConfig.tsx` ada.
- Kesiapan production Admin Settings perlu dikonfirmasi melalui smoke test.
- Beberapa validasi masih inline.

## 6. Services

### `OrderService`

Fungsi:

- Membuat order dalam database transaction.
- Mengambil harga menu dari database, bukan dari frontend.
- Menyimpan snapshot order detail.
- Normalisasi nomor meja.
- Mengubah table menjadi occupied untuk dine-in.
- Broadcast `NewOrderPlaced`.
- Update order status dan broadcast `OrderStatusUpdated`.
- Mengosongkan table saat dine-in completed.
- Statistik order dashboard.

Method penting:

- `createOrder(array $orderData, array $orderItems): Order`
- `updateOrderStatus(int $orderId, string $status): Order`
- `getOrdersByStatus(string $status)`
- `getOrderStatistics(): array`

Production note:

- Pastikan queue/broadcast worker berjalan agar event realtime terkirim.

### `PaymentService`

Fungsi:

- Cash payment waiting verification.
- Staff cash verification.
- Midtrans Snap/notification legacy.

Method penting:

- `createCashPayment(Order $order)`
- `verifyCashPayment(Order $order, float $amountReceived)`
- `createSnapTransaction(Order $order, array $customerData = [])`
- `handleNotification(array $notification)`
- `verifyPayment(Payment $payment)`

Production note:

- Midtrans bukan gateway aktif jika `PAYMENT_GATEWAY=pakasir`.
- Cash verification harus dilakukan user staff/admin terotorisasi.

### `PakasirService`

Fungsi:

- Create QRIS/BRI VA transaction.
- Get transaction detail.
- Sandbox simulation.
- Basic webhook validation.
- Map provider method ke internal method.
- Sanitasi error agar API key tidak bocor di log/response.

Method penting:

- `createTransaction(Order $order, string $method)`
- `createQrisTransaction(Order $order)`
- `createBriVaTransaction(Order $order)`
- `getTransactionDetail(Order $order)`
- `simulatePayment(Order $order)`
- `validateWebhook(array $payload, Order $order)`
- `paymentMethodForPakasirMethod(string $method)`

Production note:

- Credential harus dari env: `<PAKASIR_PROJECT>`, `<PAKASIR_API_KEY>`.
- Tambahkan signature/replay validation jika tersedia dari Pakasir.

### `AiService`

Fungsi:

- Laravel wrapper untuk FastAPI.
- Estimasi serving time.
- Popular menu ranking.
- Sentiment analysis.
- Sentiment summary.
- Fallback jika FastAPI gagal.

Method penting:

- `getServingTimeEstimation(array $orderData)`
- `getPopularMenus(int $limit = 10)`
- `analyzeSentiment(?string $reviewText = '', ?int $rating = null)`
- `getSentimentSummary()`

Production note:

- `AI_SERVICE_URL` harus mengarah ke FastAPI (`http://ai-service:8000` di Docker).
- Timeout default dari config perlu disesuaikan dengan kebutuhan production.

### `CustomerOrderAccessService`

Fungsi:

- Memberikan akses session ke order baru.
- Mengecek customer session ownership.
- Mengizinkan staff/admin mengakses order.

Method penting:

- `grant(Request $request, Order $order)`
- `canAccess(Request $request, Order $order)`
- `abortUnlessCanAccess(Request $request, Order $order)`

Catatan keamanan:

- `order_ref` saja tidak boleh dianggap authorization.
- Customer perlu session yang sama dengan pembuat order.

### `FeedbackService`

Fungsi:

- Query feedback admin.
- Summary feedback.
- Format row export.

Digunakan oleh:

- `Admin\FeedbackController`.

## 7. Events and Jobs

Events:

- `NewOrderPlaced`
  - Channel: `staff-orders`, `order.{id}`
  - Broadcast name: `order.placed`
- `OrderStatusUpdated`
  - Channel: `staff-orders`, `order.{id}`
  - Broadcast name: `order.status.updated`
- `PaymentStatusUpdated`
  - Channel: `order.{id}`, `staff-payments`
  - Broadcast name: `payment.status.updated`

Job:

- `ProcessAiAnalysis`
  - Menganalisis review via `AiService`.
  - Saat ini review controller terlihat memanggil AI secara langsung; pemakaian job perlu dikonfirmasi bila ingin full async.

## 8. Resources

Resources tersedia:

- `OrderResource`
- `OrderDetailResource`
- `PaymentResource`
- `ReviewResource`

Catatan:

- Customer public response juga diformat manual di controller agar payload provider sensitif tidak bocor.
- Jika resource dipakai untuk API publik baru, pastikan raw provider payload tetap tidak diekspos.

## 9. Backend Known Risks

- Webhook Pakasir belum memakai signature/timestamp/nonce jika provider mendukung.
- Payment expiry/reconciliation belum otomatis.
- Admin/staff beberapa endpoint masih validasi inline.
- Admin Settings perlu smoke test production-like.
- `StaffDashboardController` legacy perlu keputusan cleanup.
- Full browser E2E belum tersedia.

