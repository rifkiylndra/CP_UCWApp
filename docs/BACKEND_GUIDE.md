# Backend Developer Guide

Panduan pengembangan *server-side* aplikasi UCW App menggunakan **Laravel 11, PostgreSQL, dan arsitektur Service Pattern**.

## 📁 Struktur Direktori Penting

```text
app/
├── Http/
│   ├── Controllers/     # Entry point request, panggil Service, return Inertia/JSON
│   ├── Middleware/      # Pengecekan otorisasi Role (Admin/Staff)
│   └── Requests/        # Validasi Form Request
├── Services/            # Business Logic UTAMA (OrderService, AiProxyService)
├── Events/              # Event untuk broadcasting via Reverb
├── Listeners/           # Listener untuk background process
└── Models/              # Model Eloquent Database
```

## 📜 Aturan Pengembangan Laravel

1. **Thin Controller, Fat Service**: 
   - Jangan taruh logika bisnis yang kompleks di dalam Controller.
   - Controller hanya bertugas memvalidasi request (menggunakan Form Request), memanggil `Service`, dan mereturn response (Inertia view atau JSON).
2. **Form Request**: 
   - Semua input POST/PUT/PATCH harus divalidasi menggunakan Form Request terpisah (`php artisan make:request`).
3. **API Resources**: 
   - Gunakan API Resource untuk memformat response data JSON jika diperlukan, jangan kirim model utuh ke frontend.
4. **Eloquent / Query Builder**: 
   - Gunakan ORM Eloquent bawaan Laravel. Tidak diizinkan menggunakan *raw SQL string* (DB::raw boleh jika sangat terpaksa).

## ⚡ Laravel Reverb & Broadcasting

Project ini menggunakan **Laravel Reverb** untuk WebSockets.
- Pastikan event class mengimplementasikan `ShouldBroadcast` atau `ShouldBroadcastNow`.
- Gunakan `PrivateChannel` untuk data sensitif, dan `Channel` (public) untuk live order customer.
- Jalankan antrean broadcast dengan `php artisan queue:work` dan `php artisan reverb:start`.

## 🤖 Integrasi AI (FastAPI Proxy)

Microservice FastAPI berjalan di `http://localhost:8000`. Laravel bertindak sebagai **Proxy**. Backend bertugas untuk mem-fetch hasil AI menggunakan HTTP Client Laravel (`Illuminate\Support\Facades\Http`) lalu mengirimkannya ke Frontend via Inertia props atau JSON response.

*Contoh (di dalam Service Class):*
```php
$response = Http::timeout(5)->get(config('services.ai.url') . '/api/menu/popular');
return $response->json();
```

## 💳 Payment Gateway (Midtrans)

Integrasi pembayaran menggunakan Midtrans. Pastikan transaksi dibuat dari Backend (Laravel) untuk mendapatkan `snap_token`, dan callback (webhook) dari Midtrans di-handle oleh Backend untuk mengubah status order menjadi `paid`.
