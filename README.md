# ☕ UNAND Co-Workspace (UCW) App

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Sistem Manajemen Coffee Shop Berbasis QR Ordering dan AI untuk **Unand Co-Workspace**. Proyek ini dikembangkan sebagai pemenuhan tugas Capstone Project (CP300) Program Studi Informatika, Universitas Andalas.

## 👥 Tim Pengembang

Proyek ini dikembangkan secara kolaboratif oleh:
- **UI/UX Designer**: Perancangan antarmuka, user flow, dan design system (Figma).
- **Frontend Developer**: Implementasi UI/UX menggunakan React, Inertia, dan Tailwind CSS.
- **Backend Developer**: Pengembangan core logic Laravel, integrasi AI, dan arsitektur database.

## ✨ Fitur Utama

### 📱 Customer App (QR Ordering)
- Akses menu via scan QR Code (tanpa perlu register/login).
- Pemesanan *Dine-in* atau *Takeaway*.
- Tracking status pesanan secara *real-time*.
- Pembayaran via Midtrans (QRIS/E-Wallet) atau Cash.

### 👨‍🍳 Staff Dashboard
- Kanban board untuk manajemen pesanan secara *real-time*.
- Verifikasi pembayaran tunai.
- Riwayat dan rekap transaksi harian.

### 🖥️ Admin Dashboard
- Manajemen Menu, Kategori, dan Ketersediaan (*Availability*).
- Manajemen data Staff dan Roles.
- Laporan Keuangan dan Analytics.
- **AI Analytics Hub** untuk insight berbasis kecerdasan buatan.

## 🧠 Kapabilitas AI (Microservice)

Aplikasi ini didukung oleh *AI Microservice* (Python FastAPI) yang menyediakan:
1. **Multiple Linear Regression (MLR)**: Memprediksi dan memberikan estimasi waktu penyajian pesanan berdasarkan antrean dan kompleksitas pesanan.
2. **Weighted Moving Average (WMA)**: Menganalisis pergerakan tren penjualan untuk menentukan *ranking* menu terpopuler secara dinamis.
3. **Naive Bayes + TF-IDF**: Menganalisis sentimen dari ulasan/feedback pelanggan secara otomatis (Positif, Netral, Negatif).

## 🛠️ Tech Stack

- **Backend (Core)**: Laravel 12
- **Frontend**: React 18 + Inertia.js v2 + TypeScript
- **Styling**: Tailwind CSS v4
- **Realtime**: Laravel Reverb + Laravel Echo
- **Database**: PostgreSQL
- **AI Service**: Python FastAPI

## 📁 Struktur Project

```text
CP_UCWApp/
├── app/                  # Backend Controller, Models, Services
├── bootstrap/            # Laravel App configuration
├── config/               # Laravel configurations
├── database/             # Migrations & Seeders
├── docs/                 # Dokumentasi (Panduan, Spesifikasi API)
├── public/               # App entry point & static assets
├── resources/
│   ├── css/              # Tailwind Design Tokens (app.css)
│   ├── js/
│   │   ├── Components/   # React Reusable Components
│   │   ├── Pages/        # Inertia React Pages (Customer, Staff, Admin)
│   │   ├── types/        # TypeScript Interfaces
│   │   └── app.tsx       # Frontend Entry Point
│   └── views/            # Blade Root Template (app.blade.php)
├── routes/               # Backend Routes (web, api, console, channels)
└── ...
```

## 🔄 Status Development

Berikut adalah pantauan progres pengembangan aplikasi UCW App (diupdate berkala):

| Phase | Modul | Status | Keterangan |
|-------|-------|--------|------------|
| **Phase 0** | Project Setup & Foundation | ✅ Selesai | Scaffold Laravel 11, Inertia, React 18, Tailwind v4, Reverb |
| **Phase 1** | Customer App (QR Flow) | ✅ Selesai | 12 Halaman (Menu, Cart, Payment, Tracking, Feedback) |
| **Phase 2** | Staff Dashboard (POS) | ⏳ Belum Dimulai | Kanban Live Order, Cash Verification, Transaksi |
| **Phase 3** | Admin Dashboard | ⏳ Belum Dimulai | KPI, AI Analytics Hub, Staff & Menu CRUD |
| **Phase 4** | Integrasi Backend & Database | ⏳ Belum Dimulai | ORM Eloquent, Seeder, Webhook Midtrans |
| **Phase 5** | AI Microservice | ⏳ Belum Dimulai | Python FastAPI Endpoint (MLR, WMA, Sentimen) |

## 🚀 Panduan Pengembangan

Silakan baca dokumen panduan berikut untuk berkontribusi pada proyek ini:

- [Panduan Kontribusi (CONTRIBUTING.md)](CONTRIBUTING.md)
- [Panduan Frontend Developer (docs/FRONTEND_GUIDE.md)](docs/FRONTEND_GUIDE.md)
- [Panduan Backend Developer (docs/BACKEND_GUIDE.md)](docs/BACKEND_GUIDE.md)
- [Spesifikasi API AI (docs/API_SPEC.md)](docs/API_SPEC.md)

## 📦 Instalasi Lokal

```bash
# 1. Clone repository
git clone https://github.com/your-org/CP_UCWApp.git
cd CP_UCWApp

# 2. Setup Backend (Laravel)
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed

# 3. Setup Frontend
npm install
npm run build

# 4. Jalankan Service
php artisan serve
npm run dev
php artisan reverb:start
```
*(Catatan: Microservice FastAPI dijalankan secara terpisah di port 8000).*

---
© 2026 Universitas Andalas - Prodi Informatika.
