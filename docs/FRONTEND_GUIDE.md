# Frontend Developer Guide

Panduan khusus untuk pengembangan bagian *client-side* dari aplikasi UCW App menggunakan **React, Inertia.js, TypeScript, dan Tailwind CSS**.

## 📁 Struktur Direktori Frontend

Semua kode frontend berada di dalam `resources/js/`.

```text
resources/js/
├── Components/       # Komponen reusable (UI, Layout, Modals)
│   ├── Admin/
│   ├── Customer/
│   ├── Layout/       # Wrapper layout setiap role (AdminLayout, dll)
│   ├── Modals/
│   ├── Shared/
│   └── UI/           # Base component (Button, Input, StatCard)
├── Pages/            # Halaman aplikasi (di-load via Inertia)
│   ├── Admin/
│   ├── Auth/
│   ├── Customer/
│   └── Staff/
├── types/            # TypeScript interfaces & types (WAJIB)
├── app.tsx           # Entry point aplikasi
└── bootstrap.js      # Setup Laravel Echo & Axios
```

## 📜 Aturan Penulisan React

1. **Functional Components**: Selalu gunakan komponen fungsional dengan Hooks (`useState`, `useEffect`, dll).
2. **TypeScript**: Setiap komponen harus memiliki *interface props* yang jelas. Tidak boleh ada tipe `any` kecuali sangat terpaksa.
3. **Inertia Link**: Gunakan komponen `<Link>` dari `@inertiajs/react` untuk semua navigasi internal aplikasi agar bersifat SPA (Single Page Application). Hindari tag `<a>` biasa.
4. **Form Handling**: Gunakan `useForm` dari `@inertiajs/react` untuk menangani form submission ke backend Laravel.

## 🎨 Styling (Tailwind CSS)

- **Murni Tailwind**: Tidak diperbolehkan menggunakan *inline style* (`style={{...}}`) kecuali untuk kalkulasi dinamis (seperti lebar progress bar).
- **Design Tokens**: Gunakan variabel warna UCW yang sudah didefinisikan di `resources/css/app.css` (misal: `var(--color-ucw-dark)`, `var(--color-ucw-text-muted)`).
- **Mobile-first**: Untuk `Pages/Customer/`, desain dibuat khusus mobile (lebar layar statis `max-w-[480px]`).

## ⚡ Komunikasi Real-time (Laravel Echo)

Untuk halaman *Staff Dashboard* dan *Customer Order Status*, kita menggunakan Laravel Echo untuk listen event dari Reverb.

*Contoh implementasi:*
```tsx
import { useEffect } from 'react';

useEffect(() => {
    window.Echo.channel(`order.${orderId}`)
        .listen('OrderStatusUpdated', (e: any) => {
            console.log('Status baru:', e.status);
            // Update state React
        });
    return () => {
        window.Echo.leaveChannel(`order.${orderId}`);
    };
}, [orderId]);
```

## 🤖 Menghubungi API AI

Panggilan ke service AI (FastAPI) tidak boleh dilakukan langsung dari Frontend untuk menghindari isu CORS dan security. Panggil melalui *endpoint proxy* Laravel yang telah dibuat oleh Backend.
