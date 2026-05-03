# Panduan Kontribusi (Contributing Guide)

Selamat datang di tim pengembangan **UCW App**! Dokumen ini dibuat agar kolaborasi tim kita (UI/UX, Frontend, dan Backend) dapat berjalan lancar, rapi, dan minim konflik. Mohon baca dan ikuti panduan ini dengan saksama.

---

## 1. Cara Clone Repository

Untuk mulai berkontribusi, hal pertama yang harus dilakukan adalah melakukan clone repository ini ke komputer lokal kamu.

```bash
# Clone repository ke komputer lokal
git clone https://github.com/organisasi-kamu/CP_UCWApp.git

# Masuk ke folder project
cd CP_UCWApp
```

---

## 2. Cara Setup Environment Local

Setelah berhasil clone, lakukan tahapan berikut untuk menyiapkan environment lokal kamu:

### Setup Backend (Laravel)
```bash
# Install dependency PHP
composer install

# Copy file environment dan buat application key
cp .env.example .env
php artisan key:generate

# Lakukan migrasi database beserta data dummy
php artisan migrate --seed
```

### Setup Frontend (React & Tailwind)
```bash
# Install dependency NPM
npm install

# Build aset frontend (untuk development)
npm run dev
```

### Menjalankan Aplikasi
```bash
# Jalankan server lokal Laravel (jalan di terminal 1)
php artisan serve

# Jalankan Vite untuk hot-reloading Frontend (jalan di terminal 2)
npm run dev

# Jalankan server Websocket Reverb untuk real-time (jalan di terminal 3)
php artisan reverb:start
```
*(Pastikan Microservice AI FastAPI juga berjalan di port 8000 secara terpisah).*

---

## 3. Branch Naming Convention

Kita tidak boleh bekerja langsung di branch `main` atau `develop`. Selalu buat branch baru dari `develop`. Penamaan branch harus mengikuti format berikut:

- **Frontend Fitur Baru**   : `feature/frontend-[nama-fitur]`
  *(Contoh: `feature/frontend-cart-ui`)*
- **Backend Fitur Baru**    : `feature/backend-[nama-fitur]`
  *(Contoh: `feature/backend-payment-api`)*
- **Perbaikan Bug**         : `fix/[nama-bug]`
  *(Contoh: `fix/login-error`)*

**Cara membuat branch baru:**
```bash
# Pastikan kamu berada di branch develop dan sudah up-to-date
git checkout develop
git pull origin develop

# Buat branch baru dan langsung pindah ke branch tersebut
git checkout -b feature/frontend-nama-fitur
```

---

## 4. Commit Message Convention

Kita menggunakan standar **Conventional Commits** agar riwayat (history) project rapi dan mudah dibaca. Format dasarnya adalah: `tipe: deskripsi singkat`.

Gunakan tipe berikut sesuai dengan perubahan yang kamu lakukan:
- `feat`: Menambahkan fitur baru (Frontend atau Backend).
- `fix`: Memperbaiki bug atau error.
- `chore`: Perubahan pada setup, konfigurasi, atau update dependency.
- `docs`: Mengubah atau menambahkan dokumentasi (seperti file README).
- `style`: Perubahan khusus pada styling/UI (Tailwind CSS, margin, padding) yang tidak mengubah logika.
- `refactor`: Menulis ulang atau merapikan kode tanpa mengubah fungsionalitasnya.

*Contoh yang benar:*
- `feat: menambahkan halaman checkout untuk customer`
- `fix: memperbaiki error CORS saat panggil AI endpoint`
- `style: menyesuaikan warna tombol espresso sesuai desain Figma`

---

## 5. Cara Membuat Pull Request (PR)

Setelah pekerjaanmu selesai di branch lokal, saatnya menggabungkan kode ke branch `develop` melalui Pull Request.

1. **Push branch kamu ke GitHub:**
   ```bash
   git push origin nama-branch-kamu
   ```
2. Buka repository GitHub, kamu akan melihat tombol **"Compare & pull request"**. Klik tombol tersebut.
3. Pastikan *base branch* adalah `develop` dan *compare branch* adalah branch kamu.
4. Isi judul dan deskripsi PR. Gunakan **PR Template** yang sudah disediakan (beri centang pada bagian yang relevan).
5. Tambahkan rekan tim kamu sebagai **Reviewer**.

---

## 6. Code Review Process

Setiap Pull Request **wajib direview** oleh minimal 1 anggota tim lainnya sebelum bisa digabungkan (*merge*).

- **Untuk Frontend**: Pastikan UI sudah sesuai desain Figma (pixel-perfect) dan responsif.
- **Untuk Backend**: Pastikan API response sesuai format standar dan tidak ada *query* database yang berpotensi lambat.
- Jika ada perbaikan yang diminta (*Requested Changes*), perbaiki kode di lokal, commit lagi, lalu push ke branch yang sama. PR akan otomatis ter-update.
- Jika kode sudah disetujui, reviewer akan memberikan status **Approved**.

---

## 7. Aturan Merge ke Develop dan Main

1. **Ke branch `develop`**:
   - Merge ke `develop` HANYA boleh dilakukan setelah PR mendapatkan status **Approved** dari rekan tim.
   - Pihak yang melakukan merge adalah pembuat PR itu sendiri atau reviewer.
   - Sangat disarankan menggunakan opsi **Squash and merge** agar riwayat commit di `develop` tetap bersih.

2. **Ke branch `main`**:
   - Branch `main` merepresentasikan aplikasi versi *production* (siap rilis).
   - Merge ke `main` HANYA dilakukan pada saat *sprint review* atau saat aplikasi sudah diuji secara menyeluruh di `develop`.
   - Proses merge ke `main` harus dilakukan dan disepakati bersama oleh seluruh anggota tim.
