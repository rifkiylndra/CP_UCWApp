# Panduan Kontribusi (Contributing Guide)

Terima kasih telah berkontribusi pada pengembangan **CP_UCWApp**! Dokumen ini berisi aturan dan standar yang harus diikuti oleh tim (UI/UX, Frontend, dan Backend) agar kolaborasi berjalan lancar.

## 🌿 Git Branching Strategy

Kita menggunakan alur kerja berbasis fitur (*feature branch workflow*).

1. **`main`**: Branch utama, harus selalu *stable* dan siap rilis. Tidak boleh *commit* langsung ke `main`.
2. **`dev`**: Branch integrasi untuk pengujian bersama. Semua PR fitur mengarah ke branch ini.
3. **Branch Fitur/Bugfix**: Dibuat dari `dev`. Penamaan branch harus mengikuti format:
   - `feature/nama-fitur` (contoh: `feature/cart-ui`)
   - `bugfix/nama-bug` (contoh: `bugfix/payment-error`)
   - `hotfix/nama-hotfix` (untuk perbaikan mendesak di `main`)

## ✍️ Standar Commit Message (Conventional Commits)

Gunakan format berikut saat melakukan commit:
`<tipe>: <deskripsi singkat>`

**Tipe yang diizinkan:**
- `feat`: Menambahkan fitur baru
- `fix`: Memperbaiki bug
- `ui`: Perubahan tampilan / styling Tailwind (khusus Frontend/UI)
- `refactor`: Refactoring kode (tanpa menambah fitur / memperbaiki bug)
- `docs`: Update dokumentasi (README, panduan)
- `chore`: Update dependencies, konfigurasi, dll.

*Contoh:*
- `feat: add checkout form layout`
- `fix: resolve reverb connection timeout`
- `ui: update espresso color token on dashboard`

## 🔁 Pull Request (PR)

1. Buat PR dari branch fitur ke `dev`.
2. Isi deskripsi PR menggunakan *Template PR* yang sudah disediakan.
3. PR harus di-review minimal oleh 1 anggota tim lainnya.
4. **Backend Developer** wajib mereview PR terkait integrasi API.
5. **Frontend Developer** wajib mereview PR terkait UI/UX consistency.

## 🤝 Pembagian Peran

- **UI/UX Designer**: Menyediakan desain Figma, aset, dan mengawasi implementasi UI agar *pixel-perfect*. Jika ada perubahan *flow*, wajib diinformasikan ke FE & BE.
- **Frontend Developer**: Fokus pada `resources/js/` dan komponen React. Dilarang mengubah struktur database atau business logic di controller tanpa kordinasi.
- **Backend Developer**: Fokus pada `app/`, `database/`, dan `routes/`. Memastikan semua endpoints, real-time Reverb, dan AI Service berjalan baik dan terdokumentasi.

Jika ada kebuntuan (blocker), segera diskusikan di grup proyek!
