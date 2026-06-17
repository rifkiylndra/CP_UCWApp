# Spatially-Structured Scientific Poster Content (A1 Dimensions)
## Topik: Sistem Manajemen Coffee Shop Berbasis QR Ordering dan Artificial Intelligence untuk Meningkatkan Efisiensi Operasional Unand Co-Workspace (UCW)

---

## 🏛️ HEADER UTAMA POSTER
* **Logo Institusi:** `[LOGO UNIVERSITAS ANDALAS]`
* **Judul Penelitian:** SISTEM MANAJEMEN COFFEE SHOP BERBASIS QR ORDERING DAN ARTIFICIAL INTELLIGENCE UNTUK MENINGKATKAN EFISIENSI OPERASIONAL UNAND CO-WORKSPACE (UCW)
* **Identitas Penulis:** Muhammad Galid Avero (2111522002) • Reynard Ghazy Tsaqif (2111522012) • Rifki Yuliandra (2111523001)
* **Afiliasi:** Departemen Informatika • Fakultas Teknologi Informasi • Universitas Andalas
* **Tagline Utama:** QR Ordering + FastAPI Machine Learning Microservice untuk Estimasi Waktu Penyajian Real-Time dan Analisis Sentimen Ulasan

---

## ① LATAR BELAKANG
* **Masalah Antrean Fisik:** Proses pemesanan konvensional di Unand Co-Workspace sering kali menyebabkan penumpukan antrean pada jam-jam sibuk perkuliahan (peak hours).
* **Kurangnya Estimasi Waktu:** Pelanggan tidak mengetahui berapa lama pesanan mereka akan disajikan, yang mengakibatkan ketidakpastian dan ketidakpuasan.
* **Kesulitan Manajemen Menu:** Pihak manajemen kesulitan menganalisis menu yang sedang tren secara dinamis serta memantau kualitas pelayanan berdasarkan feedback ulasan pelanggan secara real-time.
* **Solusi Sistem Terintegrasi:**
  * QR Ordering mandiri yang memudahkan pelanggan memesan langsung dari meja.
  * Estimasi waktu tunggu otomatis berbasis beban antrean dapur menggunakan model Multiple Linear Regression.
  * Sentiment analysis feedback pelanggan menggunakan Multinomial Naive Bayes + TF-IDF dengan Hybrid Decision Logic.
  * Analisis popularitas menu dengan Weighted Moving Average (WMA) pada dashboard admin.

---

## ② INOVASI UTAMA
* **FastAPI ML Microservice:** Pemisahan arsitektur komputasi AI menggunakan FastAPI Python untuk memisahkan beban kerja inferensi model dari core server Laravel.
* **Hybrid Decision Logic Sentimen:** Aturan hibrida dengan batas keyakinan 0.70 untuk menyelesaikan kontradiksi komentar teks vs rating bintang, dan menerapkan *rating override* jika keyakinan AI rendah.
* **Estimasi Waktu Adaptif:** Prediksi waktu saji menggunakan 6 variabel operasional riil (kopi espresso, kopi manual brew, non-kopi, makanan, antrean dapur, dan status peak hours).
* **Real-time Synchronization:** Integrasi Laravel Reverb (WebSockets) untuk sinkronisasi live order timer antara customer tracking page dan staff kanban board.

---

## ③ TUJUAN PENELITIAN
* Membangun sistem transaksi QR ordering terintegrasi untuk Unand Co-Workspace.
* Mengimplementasikan microservice FastAPI untuk inferensi model machine learning secara independen.
* Memprediksi waktu penyajian pesanan secara akurat guna mengurangi ketidakpastian pelanggan.
* Mengklasifikasikan sentimen ulasan ulasan secara otomatis untuk membantu evaluasi kualitas pelayanan cafe.
* Menyediakan visualisasi analitik tren penjualan dan popularitas menu berbasis statistik bagi manajemen cafe.

---

## ④ METODOLOGI PENELITIAN

### A. Pembagian Skenario Data
* **Dataset MLR (Estimasi Waktu):**
  * 1.000 baris data simulasi operasional berbasis wawancara barista UCW (`data_estimasi_waktu_ucw.csv`).
  * Variabel independen: jumlah_kopi, jumlah_kopi_manual, jumlah_non_kopi, jumlah_makanan, antrian_dapur, is_peak_hour.
  * Variabel dependen: waktu_penyajian (menit).
* **Dataset Sentimen (Naïve Bayes):**
  * 900 baris ulasan seimbang (300 positif, 300 netral, 300 negatif) + 135 ulasan kosong.
  * Representasi teks: TF-IDF vectorizer.
* **Dataset WMA (Menu Populer):**
  * Histori penjualan mingguan dari PostgreSQL Cafe pada periode November 2025 - Mei 2026.

### B. Pipeline Pipa Sistem
`Customer Scan QR -> Menu Selection -> Pre-estimasi MLR (FastAPI) -> Laravel Order Creation -> Payment (Pakasir QRIS/Cash) -> Broadcast Order (Laravel Reverb) -> Barista Dashboard (Kanban Card Timer) -> Completed Order -> Customer Submit Review -> Sentiment Classification (FastAPI NB + Hybrid) -> Saved to PostgreSQL -> Admin AI Analytics (Sentiment Polarity & WMA Menu Ranking)`

* **Placeholder Komponen Visual:** `[DIAGRAM ALUR KERJA SISTEM INTEGRASI LARAVEL & FASTAPI]`

---

## ⑤ HASIL MODEL & TABEL METRIK

### A. Metrik Evaluasi Model AI (FastAPI Microservice)
| Model AI / Metode | Metrik Evaluasi | Nilai Hasil Pengujian | Keterangan Performa |
| :--- | :---: | :---: | :--- |
| **MLR (Estimasi Waktu)** | R² Score | **0.8811** | Model menjelaskan 88.11% varians waktu saji aktual |
| | MAE (Mean Absolute Error) | **1.51 menit** | Selisih rata-rata estimasi hanya ±90 detik |
| | RMSE | **2.13 menit** | Sensitivitas rendah terhadap fluktuasi error |
| | MAPE | **12.56%** | Akurasi persentase error sangat baik |
| **Naïve Bayes + TF-IDF** | Akurasi Klasifikasi | **92.67%** | Ketepatan prediksi sentimen pada data uji |
| | Macro F1-Score | **92.68%** | Distribusi performa seimbang di seluruh kelas |
| | Presisi (Pos/Net/Neg) | **95% / 90% / 93%** | Tingkat ketepatan positif, netral, dan negatif |
| | Recall (Pos/Net/Neg) | **92% / 93% / 93%** | Tingkat sensitivitas positif, netral, dan negatif |

### B. Blok KPI Card Utama (Highlight Angka Besar)
* **1.51 menit** — MAE ESTIMASI WAKTU (MLR)
* **88.11%** — R² SCORE ESTIMASI WAKTU
* **92.67%** — AKURASI KLASIFIKASI SENTIMEN
* **92.68%** — F1-SCORE MACRO SENTIMEN

---

## ⑥ ANALISIS PEMODELAN AI
* **Formula Regresi Estimasi Waktu (MLR):**
  `Y = 1.917 + 0.935(jumlah_kopi) + 1.918(jumlah_kopi_manual) + 1.048(jumlah_non_kopi) + 4.846(jumlah_makanan) + 0.597(antrian_dapur) + 5.883(is_peak_hour)`
  * *Intercept (1.917 menit)*: Waktu persiapan dasar minimum per order.
  * *Kopi Manual Brew (1.918 menit/item)* memakan waktu dua kali lipat lebih lama dibanding kopi mesin espresso (*0.935 menit/item*).
  * *Makanan (4.846 menit/item)* merupakan penyumbang durasi persiapan terlama di dapur.
* **Analisis Hybrid Decision Logic (Sentimen):**
  * Menggunakan threshold keyakinan **`0.70`**. Jika terjadi konflik antara prediksi AI dan rating bintang pelanggan (contoh: teks positif tapi bintang 2), sistem memeriksa skor keyakinan AI. Jika keyakinan AI `< 0.70`, maka **rating override** diterapkan (menyesuaikan sentimen dengan rating bintang pelanggan) demi mencegah bias netral pada review negatif/positif yang ragu-ragu.
* **Placeholder Visual (Disusun Horizontal):** `[GRAFIK: kurva_estimasi_vs_aktual.png]` | `[GRAFIK: confusion_matrix_sentiment.png]` | `[GRAFIK: trend_penjualan_wma.png]`

---

## ⑦ PRODUK APLIKASI INTEGRASI

### A. Arsitektur Komponen 3-Tier System
* **Client Interface (Customer & Staff Web App)**: Web responsif berbasis React 19, Inertia.js v2, dan Tailwind CSS. Menyajikan antarmuka mobile-friendly untuk customer dan desktop kanban/tabel untuk staff/admin.
* **Core Application Server (Laravel 12)**: Menangani database PostgreSQL, otentikasi role-based, manajemen transaksi, job queue, serta websocket broadcast via Laravel Reverb.
* **AI Engine Microservice (FastAPI)**: Server mandiri Python yang melayani endpoint estimasi waktu penyajian, klasifikasi sentimen ulasan, dan kalkulasi ranking menu terpopuler (WMA).

### B. Tata Letak Dokumentasi UI Aplikasi
* **Hero Visual Kiri/Tengah Bawah:** Mockup Web App Customer (Halaman QR Menu, Estimasi Waktu, Pelacakan Pesanan, dan Feedback) & Dashboard Barista (Kanban Board Live Order dengan Countdown Timer).
* **Komponen Badge Status Real-Time:**
  * 🟤 PENDING / CONFIRMED (Menunggu pembayaran / dikonfirmasi)
  * 🟡 PREPARING (Sedang diproses di dapur - Timer berjalan)
  * 🟢 READY / COMPLETED (Pesanan siap diambil / selesai)
* **Placeholder Mockup Ragam Halaman:** `[SCREENSHOT CUSTOMER MENU]` | `[SCREENSHOT TRACKING ORDER]` | `[SCREENSHOT BARISTA KANBAN]` | `[SCREENSHOT ADMIN AI ANALYTICS]`

---

## ⑧ MEKANISME RANTAI KERJA SISTEM
1. **Scan QR Code:** Pelanggan memindai QR code di meja untuk membuka menu kafe secara instan tanpa login.
2. **Pre-estimasi Waktu Saji:** Saat memilih menu di keranjang, sistem memanggil FastAPI untuk menampilkan perkiraan waktu tunggu berdasarkan isi keranjang dan panjang antrean dapur aktual.
3. **Pembayaran Digital:** Pelanggan membayar secara aman menggunakan e-wallet/QRIS via Pakasir Payment Gateway.
4. **Real-time Broadcast:** Begitu pembayaran terverifikasi, order dikirimkan secara langsung (real-time) ke dashboard Kanban Barista via Laravel Reverb.
5. **Proses Dapur & Live Countdown:** Barista menekan "Start Processing", yang akan memicu waktu mundur persiapan pesanan berjalan serempak di layar barista dan layar pelacakan pelanggan.
6. **Penyajian & Feedback:** Setelah pesanan selesai diambil, pelanggan memberikan ulasan opsional (rating/komentar).
7. **Analisis Sentimen & Dashboard Admin:** Ulasan dianalisis sentimennya secara otomatis oleh FastAPI dan hasilnya ditampilkan beserta statistik WMA pada dashboard admin.

---

## ⑨ KESIMPULAN UTAMA
* **Integrasi AI dan QR Ordering Berhasil:** Sistem berhasil diimplementasikan dengan membagi beban kerja antara Laravel 12 dan FastAPI Python secara optimal.
* **Akurasi Estimasi Sangat Tinggi:** Model MLR terbukti andal memprediksi waktu tunggu operasional barista dengan rata-rata kesalahan (MAE) hanya 1.51 menit.
* **Logika Hibrida Sentimen Responsif:** Penerapan Hybrid Decision Logic dengan threshold 0.70 sukses mengatasi anomali komentar-rating dan review tanpa komentar dengan akurasi pengujian mencapai 92.67%.
* **Efisiensi Operasional Meningkat:** Dashboard Kanban barista dan AI Analytics admin mempermudah operasional dapur kafe serta memantau kualitas pelayanan secara real-time.

---

## ⑩ PENGEMBANGAN DAN SARAN LANJUT
* Menambahkan modul pengenalan wajah (*YOLOv8-Face*) pada meja pesanan untuk mendeteksi pelanggan reguler dan memberikan rekomendasi menu otomatis.
* Mengembangkan modul peramalan stok bahan baku (*Inventory Forecasting*) menggunakan model deret waktu seperti ARIMA atau LSTM pada FastAPI.
* Mengintegrasikan sistem antrean fisik kafe dengan pemanggilan suara otomatis (*Text-to-Speech*) saat status pesanan diubah menjadi "Ready" di dashboard staff.

---

## 🖨️ KAKI POSTER (FOOTER MULTI-QR)
* **Identitas Hak Cipta:** Tim Capstone Project Informatika Universitas Andalas (2026) — M. Galid Avero, Reynard Ghazy T., Rifki Yuliandra
* **Komponen Akses Tautan Berdampingan:**
  * **[QR CODE 1]** Tautan Repositori GitHub Proyek (Laravel & FastAPI Microservice)
  * **[QR CODE 2]** Tautan Video Demonstrasi Alur Kerja Aplikasi (Customer, Barista, & Admin Dashboard)

---

## 🎨 PALET WARNA VISUAL POSTER
* **Warna Latar Belakang:** Krem lembut khas serat kertas kopi (#FAF7F5) dengan pola mesh digital tipis transparan.
* **Header Banner (Sleek Dark):** #271310 (Warna cokelat gelap kopi espresso)
* **Section Divider Bar:** #8A7B77 (Warna cokelat abu-abu netral)
* **Warna Aksen Utama:** #5E735B (Hijau sage untuk status sukses / selesai / pembayaran aman)
* **Gaya Ikonografi:** Line Art bertema Coffee Shop, Real-time WebSockets, dan Artificial Intelligence.
