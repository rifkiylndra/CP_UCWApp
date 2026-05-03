# 🤖 Panduan Penggunaan AI Agent untuk Tim CP_UCWApp

Dokumen ini menjelaskan cara menggunakan AI agent
(Antigravity, Cursor, dll) secara efektif untuk
mengerjakan project ini bersama-sama.

---

## 📁 Dokumen Penting yang Harus Diketahui

| File                   | Lokasi                       | Fungsi                            |
| ---------------------- | ---------------------------- | --------------------------------- |
| AGENTS.md              | /AGENTS.md                   | Aturan & konteks project untuk AI |
| implementation_plan.md | /docs/implementation_plan.md | Rencana implementasi lengkap      |
| task.md                | /docs/task.md                | Daftar task detail per phase      |
| PROGRESS_CHECKPOINT.md | /docs/PROGRESS_CHECKPOINT.md | Status progress terkini           |

---

## 🔰 Langkah Pertama Sebelum Mulai Kerja

### 1. Clone Repository

```bash
git clone https://github.com/Alone1011/CP_UCWApp.git
cd CP_UCWApp
```

### 2. Checkout ke Branch Kamu

```bash
# Untuk Frontend Developer
git checkout feature/frontend-staff-dashboard
git pull origin feature/frontend-staff-dashboard

# Untuk Backend Developer
git checkout feature/backend-auth
git pull origin feature/backend-auth
```

### 3. Baca Dokumen Ini Dulu (Wajib)

Sebelum buka AI agent, baca dulu:

- AGENTS.md → pahami aturan project
- PROGRESS_CHECKPOINT.md → lihat apa yang sudah selesai
- task.md → lihat task yang perlu dikerjakan

---

## 📖 Penjelasan Setiap Dokumen

### 1. AGENTS.md

Ini adalah "memori permanen" AI tentang project kita.
Berisi:

Tech stack yang digunakan (TIDAK BOLEH diganti)
Aturan penulisan kode
Struktur folder yang sudah disepakati
Role & akses setiap pengguna
Hal yang TIDAK BOLEH dilakukan AI

Kapan dibaca:
→ Setiap kali mulai sesi baru dengan AI agent
→ Paste di awal conversation SEBELUM minta apapun

### 2. implementation_plan.md

Ini adalah blueprint lengkap sistem dari awal sampai akhir.
Berisi:

Semua phase development (Phase 0 sampai selesai)
Setiap file yang perlu dibuat
Urutan pengerjaan yang benar
Dependency antar komponen

Kapan dibaca:
→ Saat mau mulai phase baru
→ Saat bingung harus buat file apa selanjutnya
→ Paste ke AI saat minta implementasi fitur baru

### 3. task.md

Ini adalah breakdown task harian yang lebih detail.
Berisi:

Task spesifik per hari/sesi
Status setiap task (selesai/belum)
Catatan teknis dari sesi sebelumnya
Error yang pernah terjadi dan solusinya

Kapan dibaca:
→ Setiap hari sebelum mulai kerja
→ Untuk tahu persis harus mulai dari mana
→ Paste ke AI untuk konteks sesi sebelumnya

### 4. PROGRESS_CHECKPOINT.md

Ini adalah status real-time project.
Berisi:

Phase mana yang sudah selesai
Issue yang sedang aktif
Model AI yang sedang dipakai
Catatan penting antar sesi

Kapan dibaca:
→ Setiap kali buka project
→ Setelah dapat update dari anggota tim lain
→ Wajib di-update setiap selesai satu task

---

## 🤖 Cara Menggunakan AI Agent

### Template Prompt Pembuka (Wajib di Setiap Sesi Baru)

Copy prompt ini, isi bagian [bracket], paste ke AI agent:
Kamu adalah senior [frontend/backend] developer
yang mengerjakan project CP_UCWApp bersama tim.
Baca dokumen konteks berikut sebelum mengerjakan apapun:
=== AGENTS.md ===
[paste seluruh isi file /AGENTS.md]
=== PROGRESS CHECKPOINT ===
[paste seluruh isi file /docs/PROGRESS_CHECKPOINT.md]
=== TASK HARI INI ===
[paste bagian task yang relevan dari /docs/task.md]
Kamu bertugas sebagai [Frontend/Backend] Developer.
Branch yang sedang dikerjakan: [nama branch kamu]
Konfirmasi bahwa kamu memahami:

Tech stack yang digunakan
Apa yang sudah selesai dikerjakan tim
Apa yang perlu kamu kerjakan hari ini

Jangan kerjakan apapun dulu. Tunggu konfirmasi saya.

---

## 👨‍💻 Panduan Khusus Frontend Developer

### Branch yang Dipakai

feature/frontend-customer-app → Phase 1 (sudah ada file)
feature/frontend-staff-dashboard → Phase 2 (belum dimulai)
feature/frontend-admin-dashboard → Phase 3 (belum dimulai)

### Setup Environment

```bash
# Install dependencies
composer install
npm install

# Copy file environment
cp .env.example .env
php artisan key:generate

# Jalankan development server
# Buka 2 terminal terpisah:

# Terminal 1:
php artisan serve

# Terminal 2:
npm run dev
```

### Prompt untuk Melanjutkan Phase 2 — Staff Dashboard

Saya Frontend Developer yang akan mengerjakan
Phase 2 Staff Dashboard.
[paste AGENTS.md]
[paste PROGRESS_CHECKPOINT.md]
Phase 1 Customer App sudah selesai oleh rekan saya.
Saya akan mulai Phase 2 dari awal.
File yang perlu dibuat di Phase 2:

resources/js/types/staff.ts
resources/js/Layouts/StaffLayout.tsx
resources/js/Pages/Staff/Login.tsx
resources/js/Pages/Staff/Dashboard.tsx
resources/js/Pages/Staff/Transactions.tsx
resources/js/Components/Staff/OrderDetailModal.tsx
resources/js/Components/Staff/PaymentVerifyModal.tsx

Mulai dari types/staff.ts dulu.
Buat TypeScript interface untuk semua data
yang dibutuhkan Staff Dashboard.

### Prompt untuk Melanjutkan Phase 3 — Admin Dashboard

Saya Frontend Developer yang akan mengerjakan
Phase 3 Admin Dashboard.
[paste AGENTS.md]
[paste PROGRESS_CHECKPOINT.md]
Phase 1 & 2 sudah selesai.
Saya akan mulai Phase 3 dari awal.
File yang perlu dibuat di Phase 3:

resources/js/types/admin.ts
resources/js/Layouts/AdminLayout.tsx
resources/js/Pages/Admin/Login.tsx
resources/js/Pages/Admin/Dashboard.tsx
resources/js/Pages/Admin/Operational.tsx
resources/js/Pages/Admin/Menu.tsx
resources/js/Pages/Admin/Staff.tsx
resources/js/Pages/Admin/Finance.tsx
resources/js/Pages/Admin/Analytics.tsx
resources/js/Pages/Admin/Settings.tsx

Mulai dari types/admin.ts dulu.

### Aturan Wajib Frontend

✅ HARUS:

Functional component + hooks (bukan class component)
TypeScript interface untuk semua props
Tailwind CSS untuk styling (tidak ada inline style)
Inertia <Link> untuk navigasi (bukan <a>)
Inertia router.post/put untuk form submit
Mobile-first untuk Customer App (max-width: 448px)
Desktop layout untuk Staff & Admin

❌ DILARANG:

Class component React
Inline style
CSS file terpisah (murni Tailwind)
Axios untuk call ke backend Laravel
(gunakan Inertia router atau fetch)

---

## 🔧 Panduan Khusus Backend Developer

### Branch yang Dipakai

feature/backend-auth → Authentication & middleware
feature/backend-api → Controller, Service, Model, Migration
feature/backend-payment → Midtrans payment integration
feature/ai-module → Python FastAPI microservice

### Setup Environment

```bash
# Install dependencies
composer install

# Setup database (setelah kita tentukan DB-nya)
php artisan migrate
php artisan db:seed

# Jalankan queue worker (untuk jobs)
php artisan queue:work

# Jalankan Reverb WebSocket server
php artisan reverb:start
```

### Prompt untuk Backend Auth

Saya Backend Developer yang mengerjakan
sistem autentikasi CP_UCWApp.
[paste AGENTS.md]
[paste PROGRESS_CHECKPOINT.md]
Yang perlu dibuat di feature/backend-auth:

Migration untuk tabel users dengan kolom:
id, name, username, email, password,
role (enum: admin, staff),
is_active (boolean), timestamps
Model User dengan:

Relasi ke tabel lain
Scope untuk filter by role
Method untuk cek role

Middleware:

AdminMiddleware
StaffMiddleware
Daftarkan di bootstrap/app.php

Auth Controller:

Login (redirect sesuai role)
Logout
Gunakan Laravel Breeze sebagai base

Route groups di routes/web.php:

/admin/_ → middleware auth + admin
/staff/_ → middleware auth + staff
/order/\* → tanpa auth (customer)

Mulai dari migration dulu.

### Prompt untuk Backend API

Saya Backend Developer yang mengerjakan
API dan business logic CP_UCWApp.
[paste AGENTS.md]
[paste PROGRESS_CHECKPOINT.md]
Yang perlu dibuat di feature/backend-api:
Migration & Model:

categories (id, name, description)
menus (id, category_id, name, description,
price, image, is_available)
tables (id, table_number, qr_code, status)
orders (id, customer_name, table_id, order_type,
order_status, payment_status,
estimated_serve_time, total_price)
order_details (id, order_id, menu_id,
quantity, note, subtotal)
reviews (id, order_id, rating, comment,
sentiment_label)
system_configs (id, key, value)

Controller & Service:

Customer: MenuController, OrderController
Staff: DashboardController, OrderController
Admin: MenuController, StaffController,
ReportController, AnalyticsController

Events untuk Realtime:

NewOrderPlaced → broadcast ke staff-orders channel
OrderStatusUpdated → broadcast ke order.{id} channel

Mulai dari migration dengan urutan yang benar
(perhatikan foreign key dependency).

### Prompt untuk AI Module (FastAPI)

Saya Backend Developer yang mengerjakan
modul AI menggunakan Python FastAPI.
[paste AGENTS.md]
Buat microservice Python FastAPI terpisah dengan:
Struktur folder:
ai_service/
├── main.py
├── requirements.txt
├── models/
│ ├── estimation.py → Multiple Linear Regression
│ ├── popular_menu.py → Weighted Moving Average
│ └── sentiment.py → Naive Bayes + TF-IDF
└── routers/
├── estimation.py
├── menu.py
└── sentiment.py
Endpoint yang dibutuhkan:
GET /api/estimation/predict
GET /api/estimation/performance
GET /api/menu/popular
POST /api/sentiment/analyze
GET /api/sentiment/summary
Port: 8000
Semua response dalam format JSON.
Mulai dari struktur folder dan main.py dulu.

### Aturan Wajib Backend

✅ HARUS:

Business logic di Service class (bukan Controller)
Validasi input di Form Request
Transformasi response di Resource class
Broadcast event untuk operasi realtime
Queue untuk operasi berat

❌ DILARANG:

Raw SQL (gunakan Eloquent/Query Builder)
Logic di Controller
Return data langsung tanpa Resource transformer

---

## 🔄 Update Checkpoint (Wajib Setelah Selesai Task)

Setiap selesai mengerjakan satu task, update
`/docs/PROGRESS_CHECKPOINT.md` dengan format:

```markdown
## Update [tanggal] — [nama kamu]

### Yang Selesai Hari Ini

- [x] [nama file/fitur yang selesai]
- [x] [nama file/fitur yang selesai]

### Catatan Teknis

- [hal penting yang perlu diketahui tim]
- [error yang ditemukan dan solusinya]

### Untuk Dikerjakan Selanjutnya

- [ ] [task berikutnya]
```

Setelah update file, commit dan push:

```bash
git add docs/PROGRESS_CHECKPOINT.md
git commit -m "docs: update progress checkpoint [tanggal]"
git push origin [nama-branch-kamu]
```

---

## 📤 Cara Push Pekerjaan ke GitHub

```bash
# 1. Pastikan di branch yang benar
git branch

# 2. Pull update terbaru dari branch kamu
git pull origin [nama-branch-kamu]

# 3. Stage file yang sudah dikerjakan
git add .

# 4. Commit dengan pesan yang jelas
git commit -m "feat: [deskripsi singkat apa yang dibuat]"

# Contoh pesan commit yang benar:
# feat: add Staff Dashboard kanban board component
# feat: add Order model and migration
# fix: fix realtime echo listener on OrderStatus page
# docs: update progress checkpoint

# 5. Push ke branch kamu
git push origin [nama-branch-kamu]
```

---

## 🔁 Cara Minta Review & Merge

Setelah satu fitur selesai dan sudah push:

Buka GitHub repository
Klik tab "Pull requests"
Klik "New pull request"
Base: develop ← Compare: [branch kamu]
Isi judul: "feat: [nama fitur yang selesai]"
Isi deskripsi dengan template yang sudah ada
Assign reviewer ke anggota tim lain
Klik "Create pull request"

---

## ⚠️ Aturan Tim yang Tidak Boleh Dilanggar

JANGAN push langsung ke main atau develop
→ Selalu lewat Pull Request
JANGAN merge PR sendiri tanpa review
→ Minimal 1 anggota tim lain harus approve
JANGAN ganti tech stack tanpa diskusi tim
→ Semua perubahan besar harus dikomunikasikan
WAJIB update PROGRESS_CHECKPOINT.md
→ Setiap selesai satu task
WAJIB pull dulu sebelum mulai kerja
→ git pull origin [branch-kamu]
Commit message harus jelas dan dalam bahasa Inggris
→ Gunakan format: feat/fix/docs/chore: [deskripsi]

---

## 💬 Komunikasi Tim

Jika menemukan masalah atau butuh diskusi:

- Buat GitHub Issue dengan template yang tersedia
- Tag anggota tim yang relevan
- Screenshot error jika ada

---

_Dokumen ini dibuat untuk memudahkan kolaborasi tim
CP_UCWApp — Unand Co-Workspace Coffee Shop System_
_Universitas Andalas — Prodi Informatika — CP300 2026_
