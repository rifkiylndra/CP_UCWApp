# Frontend Documentation

## 1. Overview

Frontend UCW App memakai Inertia.js + React TypeScript. React version aktif dari `package.json` adalah React 19. Styling utama memakai Tailwind CSS 4, tetapi masih ada inline style di beberapa komponen legacy/refactor sehingga cleanup bertahap masih menjadi known issue.

Struktur utama:

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

## 2. Entry Point and Bootstrap

### `resources/js/app.tsx`

Fungsi:

- Import `resources/css/app.css`.
- Import bootstrap axios/Echo.
- Setup Inertia React dengan `createInertiaApp`.
- Resolve pages dari `./Pages/**/*.tsx`.
- Render root React 19 dengan `createRoot`.
- Configure `@laravel/echo-react` broadcaster `reverb`.

### `resources/js/bootstrap.js`

Fungsi:

- Setup axios global.
- Mengaktifkan same-origin credential dan XSRF Laravel.
- Membaca meta `csrf-token` setiap request.
- Setup Laravel Echo dengan Reverb.
- Menggunakan auth endpoint `/realtime/auth`.
- Menggunakan env `VITE_REVERB_*`.

Catatan:

- Frontend tidak memanggil FastAPI langsung. Display AI melalui Laravel controller/proxy/fallback.
- Customer/staff/admin route internal memakai Inertia `route()` dan `router`/`Link`.

## 3. State Management

Cart state:

- `hooks/useCart.ts`
  - Menyimpan `ucw_cart`, `ucw_order_type`, `ucw_customer_name`, dan `ucw_table_number` di `localStorage`.
  - Dipakai oleh flow customer cart/order type/estimate.

Zustand:

- `stores/cartStore.ts`
  - Ada store cart berbasis Zustand persist.
  - Perlu dikonfirmasi apakah masih aktif dipakai semua halaman atau sebagian sudah menggunakan `useCart`.

Polling/realtime state:

- `usePaymentStatusPolling.ts`: polling endpoint payment status customer.
- `useOrderStatusPolling.ts`: polling endpoint order/payment status customer.
- `usePrivateOrderChannel.ts`: subscribe private Echo channel `order.{orderId}`.
- Staff/Admin dashboard juga memakai polling reload berkala.

## 4. Customer Pages

### `Customer/Landing.tsx`

Fungsi:

- Halaman awal customer setelah QR/landing.
- Menerima `tableId` dari query.
- Navigasi ke menu.

Komponen:

- `LandingContentCard`
- Customer branding/header components.

Route:

- `GET /customer`
- Redirect root `/` ke customer landing.

### `Customer/Menu.tsx`

Fungsi:

- Menampilkan daftar menu dan kategori.
- Search/filter menu client-side.
- Add to cart.

Props utama:

- `menus`
- `categories`
- `tableId`

Komponen:

- `MenuSidebar`
- `MenuCardMobile`
- `MenuCardDesktop`
- `CartSidebar`
- `FloatingCartButton`
- Customer navigation.

Route:

- `GET /customer/menu`
- Data dari `Customer/MenuController@index`.

Catatan:

- Gambar menu memakai helper image/fallback di frontend dan `image_url` dari backend.

### `Customer/Cart.tsx`

Fungsi:

- Menampilkan item cart.
- Update quantity/remove item.
- Ringkasan harga.
- Lanjut ke order type.

State:

- `useCart`.

Komponen:

- `CartBlocks`
- `CartItem`

Route:

- `GET /customer/cart`
- Next: `customer.order-type`.

### `Customer/OrderType.tsx`

Fungsi:

- Memilih `dine_in` atau `takeaway`.
- Menyimpan table number/customer name.

State:

- `useCart`.

Komponen:

- `OrderTypeCard`
- `SelectedOrderTypeSummary`
- `ExpectationTips`
- `OrderTypeActions`

Route:

- `GET /customer/order-type`
- Next: `customer.estimate`.

### `Customer/Estimate.tsx`

Fungsi:

- Mengirim cart/order info ke Laravel AI estimation proxy.
- Menampilkan estimasi.
- Membuat order.

Action:

- `POST /customer/api/estimate`
- `POST /customer/order`

Dependency frontend:

- axios.
- `useCart`.

Komponen:

- `EstimateBlocks`

Catatan:

- Harga frontend tidak dipercaya backend; backend menghitung ulang dari database.

### `Customer/ChoosePayment.tsx`

Fungsi:

- Memilih metode pembayaran QRIS, BRI VA, atau cash.
- Cash memanggil payment process.
- Online memanggil create Pakasir payment.

Action:

- Cash: `POST /customer/order/{order}/payment/process`
- Pakasir: `POST /customer/order/{order}/payments/pakasir`
- Redirect ke `payment.cash` atau `payment.online`.

Komponen:

- `ChoosePaymentBlocks`

### `Customer/OnlinePayment.tsx`

Fungsi:

- Menampilkan QRIS/BRI VA instruction.
- Menampilkan payment number, total payment, expiry.
- Polling status pembayaran.
- Bisa recreate/refresh Pakasir payment.

Hooks:

- `usePaymentStatusPolling`.

Action:

- `GET /customer/order/{order}/payment/online`
- `GET /customer/order/{order}/payment/status`
- `POST /customer/order/{order}/payments/pakasir`

Komponen:

- `OnlinePaymentBlocks`

### `Customer/CashConfirmation.tsx`

Fungsi:

- Menampilkan instruksi pembayaran cash.
- Menunggu verifikasi staff.
- Subscribe private order channel dan polling fallback.

Realtime:

- `Echo.private(order.{id})`
- Fallback `router.reload`.

Route:

- `GET /customer/order/{order}/payment/cash`

Komponen:

- `CashConfirmationBlocks`

### `Customer/OrderStatus.tsx`

Fungsi:

- Menampilkan status order, payment, items, estimasi/timer, dan action feedback.
- Subscribe private order channel.
- Polling status fallback.
- Bisa memulai ulang payment online jika belum paid.

Hooks:

- `usePrivateOrderChannel`
- `useOrderStatusPolling`

Action:

- `GET /customer/order/{order}/status`
- `GET /customer/order/{order}/payment/status`
- `POST /customer/order/{order}/payments/pakasir`

Komponen:

- `OrderSummaryCard`
- `PaymentStatusCard`
- `OrderStatusTimeline`
- `OrderTimerBlocks`
- `OrderItemsList`
- `ReadyOrderPopup`
- `OrderStatusActions`

### `Customer/Feedback.tsx`

Fungsi:

- Submit review optional.
- Rating boleh kosong.
- Comment boleh kosong.
- Jika kosong semua, diperlakukan sebagai skip feedback sesuai backend behavior.

Action:

- `POST /customer/order/{order}/complete-transaction`

Komponen:

- `FeedbackBlocks`

Catatan:

- Mengirim `_token` dan header CSRF eksplisit.
- Tombol submit disabled saat request berjalan.

### Additional Customer Pages

- `PaymentSuccess.tsx`
- `PaymentError.tsx`
- `Review.tsx`

Status:

- Halaman pendukung/legacy tersedia.
- Flow utama memakai `Feedback.tsx` dan payment cash/online pages.

## 5. Staff Pages

### `Staff/Dashboard.tsx`

Fungsi:

- Staff Kanban dashboard.
- Search order.
- Update order status.
- Verify cash payment.
- Polling reload berkala.

Props:

- `orders`
- `statistics`
- `user`

Action:

- `PUT /staff/order/{order}/status`
- `POST /staff/payments/order/{order}/verify-cash`

Komponen:

- `StaffLayout`
- `OrderKanbanBoard`
- `OrderDetailModal`
- `CashPaymentModal`
- `OrderSearchInput`

Catatan:

- Menggunakan axios untuk update status/verify cash.
- Polling fallback tetap dipakai.

### `Staff/Transactions.tsx`

Fungsi:

- Menampilkan transaksi harian.
- Summary payment.
- Export.

Route:

- `GET /staff/transactions`
- `GET /staff/transactions/export`

## 6. Admin Pages

### `Admin/Overview.tsx`

Fungsi:

- Dashboard KPI.
- Weekly/daily sales trend.
- Peak hours.
- Hottest sellers.
- Recent orders.

Action:

- `GET /admin/overview?mode=daily|weekly`
- `GET /admin/statistics/orders-chart?mode=daily|weekly`

### `Admin/LiveOrder.tsx`

Fungsi:

- Admin live order kanban.
- Search order.
- Update order status.
- Verify cash payment.
- Polling fallback.

Action:

- Memakai endpoint staff order/payment update:
  - `PUT /staff/order/{order}/status`
  - `POST /staff/payments/order/{order}/verify-cash`

Catatan:

- Admin route render dilindungi role admin, tetapi update memakai staff endpoint di frontend. Ini berjalan bila authorization backend mengizinkan; perlu smoke test production-like.

### `Admin/Menu/Index.tsx`

Fungsi:

- Menu management.
- Category management modal.
- Add/edit/delete menu.

Action:

- `POST /admin/menu`
- `POST /admin/menu/{menu}`
- `DELETE /admin/menu/{menu}`
- `POST /admin/menu-categories`
- `PUT /admin/menu-categories/{category}`
- `DELETE /admin/menu-categories/{category}`

Komponen:

- `AddMenuModal`
- `MenuCategoryModal`
- `DeleteConfirmModal`

Catatan:

- Availability toggle perlu dikonfirmasi apakah sudah terhubung backend pada semua UI.

### `Admin/Staff/Index.tsx`

Fungsi:

- Staff/admin CRUD.
- Search/filter.
- Export.

Action:

- `GET /admin/staff`
- `POST /admin/staff`
- `PUT /admin/staff/{staff}`
- `DELETE /admin/staff/{staff}`
- `GET /admin/staff/export`

Komponen:

- `AddAdminModal`
- `DataToolbar`
- `PaginationFooter`
- `ActionButtons`

### `Admin/Finances.tsx`

Fungsi:

- Finance dashboard per bulan.
- Transaction table.
- Export CSV.

Action:

- `GET /admin/finances?month=YYYY-MM`
- `GET /admin/finances/export?month=YYYY-MM`

Catatan:

- Revenue harus completed + paid.

### `Admin/Feedback.tsx`

Fungsi:

- Feedback list.
- Filter rating/sentiment/search.
- Export.

Action:

- `GET /admin/feedback`
- `GET /admin/feedback/export`

### `Admin/AIAnalytics.tsx`

Fungsi:

- AI analytics dashboard.
- Popular menu ranking.
- Sentiment polarity.
- Efficiency tracker.
- AI service status/fallback label.

Route:

- `GET /admin/ai-analytics`

Catatan:

- Pastikan FastAPI service running untuk data live.
- Jika data fallback/demo, UI harus tetap menandai sumber data.

### `Admin/SystemConfig.tsx`

Fungsi:

- UI settings/config.

Route backend:

- `/admin/settings/*`

Status:

- Perlu smoke test/konfirmasi sebelum dipakai production.

## 7. Reusable Components

Admin/shared:

- `Components/admin/DataToolbar.tsx`
- `Components/admin/PaginationFooter.tsx`
- `Components/admin/ActionButtons.tsx`
- `Components/shared/LoadingState.tsx`
- `Components/shared/EmptyState.tsx`
- `Components/shared/ErrorState.tsx`
- `Components/shared/order-kanban/OrderKanbanBoard.tsx`

UI:

- `Button`
- `Badge`
- `StatusBadge`
- `KanbanCard`
- `Pagination`
- `SelectInput`
- `TextInput`
- `ToggleSwitch`
- `Spinner`
- `StatCard`
- `OrderSearchInput`

Customer reusable:

- Cart blocks.
- Estimate blocks.
- Feedback blocks.
- Payment blocks.
- Order status cards/timeline/timer.
- Order type cards/actions.
- Menu cards/sidebar.
- Navigation/top/bottom bars.

Helpers:

- `lib/formatters.ts`
- `lib/currency.ts`
- `lib/status.ts`
- `lib/images.ts`
- `lib/orderKanban.ts`
- `lib/pagination.ts`
- `lib/cn.ts`
- `lib/api.ts`

Types:

- `types/customer.ts`
- `types/staff.ts`
- `types/admin.ts`
- `types/shared.ts`
- `types/global.d.ts`
- `types/ziggy.d.ts`

## 8. Frontend Known Issues

- Masih banyak inline `style={...}` di beberapa page/component. Ini tidak sesuai aturan ideal Tailwind-only dan perlu cleanup bertahap.
- Beberapa component/page legacy masih ada untuk payment/review.
- Admin Settings perlu smoke test.
- Full E2E browser test belum lengkap.
- Cart localStorage perlu dipastikan clear sesuai flow final setelah order/feedback.

