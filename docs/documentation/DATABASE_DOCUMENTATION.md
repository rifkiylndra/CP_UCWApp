# Database Documentation

## 1. Overview

Database production UCW App adalah PostgreSQL. SQLite dapat dipakai untuk local/testing bila env mengarah ke SQLite, tetapi production tidak boleh default ke SQLite.

Source utama:

- `database/migrations`
- `app/Models`
- `config/database.php`
- `.env.example`
- `.env.production.example`

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
- `sessions`
- `jobs`
- `cache`

## 2. Entity Relationship Summary

```text
User
  role: admin/staff

Category
  hasMany Menu

Menu
  belongsTo Category
  hasMany OrderDetail

Table
  hasMany Order

Order
  belongsTo Table
  hasMany OrderDetail
  hasMany Payment
  hasOne Review

OrderDetail
  belongsTo Order
  belongsTo Menu nullable

Payment
  belongsTo Order

Review
  belongsTo Order

SystemConfig
  key/value
```

## 3. Tables

### `users`

Fungsi:

- Akun admin dan staff.

Kolom penting:

- `id`
- `name`
- `username` unique
- `email` unique
- `password`
- `role`: `admin` atau `staff`
- `is_active`
- `remember_token`
- timestamps

Model:

- `App\Models\User`
- Helper `isAdmin()`, `isStaff()`.

Catatan:

- Login harus menolak user inactive.
- Password seed/default tidak boleh dipakai production.

### `categories`

Fungsi:

- Kategori menu.

Kolom:

- `id`
- `name`
- `description`
- timestamps

Relasi:

- `hasMany(Menu)`

Catatan:

- Controller mencegah delete category jika masih dipakai menu.
- DB FK `menus.category_id` cascade; jangan bypass controller untuk delete production.

### `menus`

Fungsi:

- Master menu customer/admin.

Kolom:

- `id`
- `category_id`
- `name`
- `description`
- `price`
- `estimated_time`
- `image`
- `is_available`
- timestamps

Relasi:

- `belongsTo(Category)`
- `hasMany(OrderDetail)`

Constraint:

- `category_id -> categories.id` dengan cascade delete dari base migration.

Catatan integrity:

- Saat menu dihapus, model `Menu::deleting()` mengosongkan `order_details.menu_id`.
- Histori order tetap aman karena `order_details` menyimpan snapshot `menu_name`, `unit_price`, `subtotal`.

### `tables`

Fungsi:

- Meja customer dine-in dan QR context.

Kolom:

- `id`
- `table_number` unique
- `qr_code` unique
- `status`: `available` atau `occupied`
- timestamps

Relasi:

- `hasMany(Order)`

Catatan:

- `OrderService` menormalkan input nomor meja seperti `1`, `01`, `T1`, `T01`.
- Dine-in order mengubah table menjadi occupied.
- Completed dine-in order mengubah table menjadi available.

### `orders`

Fungsi:

- Header order customer.

Kolom:

- `id`
- `order_ref` unique
- `table_id` nullable
- `customer_name` nullable
- `order_type`: `dine_in` atau `takeaway`
- `order_status`
- `payment_status`
- `payment_method` nullable
- `estimated_serve_time`
- `total_price`
- timestamps

Relasi:

- `table_id -> tables.id`, nullable, `onDelete set null`.
- `hasMany order_details`
- `hasMany payments`
- `hasOne review`

Status:

- Order model mendefinisikan `pending`, `confirmed`, `preparing`, `processing`, `ready`, `completed`, `cancelled`.
- `processing` dinormalisasi untuk storage/customer-safe mapping.

Index:

- `orders_status_created_idx` pada `order_status`, `created_at`.
- `orders_payment_status_created_idx` pada `payment_status`, `order_status`, `created_at`.

Catatan:

- `total_price` dihitung server-side dari harga menu database.
- Revenue dashboard/finance hanya menghitung `completed + paid`.

### `order_details`

Fungsi:

- Detail item per order.

Kolom:

- `id`
- `order_id`
- `menu_id` nullable
- `menu_name`
- `unit_price`
- `quantity`
- `note`
- `subtotal`
- timestamps

Relasi:

- `order_id -> orders.id` cascade delete.
- `menu_id -> menus.id` nullable, `nullOnDelete` setelah hardening.

Catatan penting:

- `menu_name`, `unit_price`, dan `subtotal` adalah snapshot histori.
- Menu delete tidak boleh menghapus histori order.
- Jika menu sudah dihapus, detail order tetap dapat ditampilkan dari snapshot.

### `payments`

Fungsi:

- Record pembayaran cash, Pakasir, dan Midtrans legacy.

Kolom:

- `id`
- `order_id`
- `provider`
- `provider_reference`
- `payment_method`
- `payment_status`
- `amount`
- `fee`
- `total_payment`
- `midtrans_transaction_id`
- `payment_number`
- `expired_at`
- `paid_at`
- `completed_at`
- `raw_response`
- `raw_webhook`
- timestamps

Relasi:

- `order_id -> orders.id` cascade delete.

Index/constraint:

- `payments_status_method_created_idx` pada `payment_status`, `payment_method`, `created_at`.
- Unique `payments_provider_reference_method_unique` pada `provider`, `provider_reference`, `payment_method`.
- Unique `payments_midtrans_transaction_method_unique` pada `midtrans_transaction_id`, `payment_method`.

Payment status:

- Cash awal: `waiting_verification`.
- Paid: `paid`.
- Legacy/failure status seperti `pending`, `failed`, `refunded` dapat muncul dari Midtrans code path.

Catatan security:

- `raw_response` dan `raw_webhook` tidak boleh diekspos ke customer.
- Idempotency provider reference penting untuk duplicate webhook/retry create.

### `reviews`

Fungsi:

- Feedback customer setelah order completed.

Kolom:

- `id`
- `order_id`
- `rating` nullable
- `comment` nullable
- `sentiment_label` nullable: `positive`, `neutral`, `negative`
- timestamps

Relasi:

- `order_id -> orders.id` cascade delete.

Constraint:

- Unique `reviews_order_id_unique`.

Catatan:

- Satu order hanya boleh punya satu review.
- Rating/comment optional.
- Sentiment kosong berarti belum dianalisis atau review kosong.

### `system_configs`

Fungsi:

- Key/value configuration storage.

Kolom:

- `id`
- `key` unique
- `value`
- timestamps

Catatan:

- Jangan menyimpan secret plaintext di sini kecuali memang dirancang, dienkripsi, dan dibatasi aksesnya.
- Admin Settings perlu dikonfirmasi sebelum production.

### `sessions`

Fungsi:

- Session Laravel database driver.
- Digunakan penting untuk customer order ownership.

Catatan:

- Production `.env.production.example` memakai `SESSION_DRIVER=database`.
- `SESSION_ENCRYPT=true` di production example.

### `jobs`

Fungsi:

- Laravel database queue table.

Catatan:

- Production example memakai Redis queue, tetapi database queue tersedia.
- Pastikan queue worker sesuai `QUEUE_CONNECTION`.

### `cache`

Fungsi:

- Laravel cache table saat `CACHE_STORE=database`.

Catatan:

- Production example memakai Redis cache.

## 4. Migration Notes

Pakasir migration:

- Menambah `orders.order_ref` dan `orders.payment_method`.
- Mengubah `orders.order_status` dan `orders.payment_status` dari enum ke string.
- Menambah provider fields di `payments`.
- Mengubah `payments.payment_status` ke string.

Integrity hardening migration:

- Menambah `order_details.menu_name`.
- Menambah `order_details.unit_price`.
- Backfill snapshot dari menu saat migration.
- Mengubah `order_details.menu_id` nullable + `nullOnDelete`.
- Menambah unique review per order.
- Menambah index dashboard/payment/finance.

Idempotency migration:

- Unique provider/reference/payment method.
- Unique Midtrans transaction/payment method.

## 5. Production Database Notes

- Production wajib PostgreSQL.
- Jalankan migration dengan `php artisan migrate --force`.
- Backup memakai `pg_dump`.
- Restore harus diuji di non-production.
- Jangan menjalankan destructive migration tanpa backup dan konfirmasi.
- Jangan expose PostgreSQL port ke publik; Docker Compose utama hanya `expose` internal network.

## 6. Perlu Dikonfirmasi

- Apakah data legacy sebelum snapshot backfill sudah dicek.
- Apakah category cascade perlu diubah di migration future agar konsisten dengan controller.
- Apakah payment expiry/reconciliation akan menambah status/index baru.
- Apakah retention session/cache/jobs sudah sesuai production traffic.

