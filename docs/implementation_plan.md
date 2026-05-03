# Analisis Figma Lengkap: UNAND Co-Workspace App

## Ringkasan

File Figma `8L5ZvTV6Yrmk34rEdLdAvl` memiliki **3 Section utama** dengan total **26 halaman/frame**:

---

## 📱 Section 1: Customer App (12 halaman)

Ini adalah antarmuka yang digunakan oleh **pelanggan** cafe melalui QR Code. Desain mobile-first dengan layout vertikal.

| No | Nama Halaman | Node ID | Deskripsi |
|----|-------------|---------|-----------|
| 1 | **QR Landing Page** | — | Halaman landing setelah scan QR, pintu masuk ke customer flow |
| 2 | **Digital Menu** | — | Katalog menu cafe dengan kategori & preview item |
| 3 | **Your Cart** | — | Ringkasan pesanan sebelum checkout |
| 4 | **Order Type** | — | Pilihan: Dine-in / Takeaway |
| 5 | **Preparation Estimate** | — | Estimasi waktu persiapan pesanan |
| 6 | **Choose Payment** (state 1) | — | Pilihan metode pembayaran (online) |
| 7 | **Choose Payment** (state 2) | — | Pilihan metode pembayaran (cash) |
| 8 | **Online Payment** | — | Form/redirect untuk bayar online |
| 9 | **Cash Confirmation** | — | Konfirmasi setelah memilih bayar cash |
| 10 | **Live Order Status** | — | Real-time tracking status pesanan |
| 11 | **Your Brew is Ready!** | — | Notifikasi pesanan selesai |
| 12 | **Share Your Feedback** | — | Formulir rating & review setelah pesanan selesai |

**Karakteristik UI Customer App:**
- Layout mobile (width ~390px)
- Warm off-white background `#F5F3F0`
- Dark primary button `#2D1A0E` (espresso brown)
- Typography editorial coffee-themed
- Animasi slide/fade antar screen

---

## 👨‍🍳 Section 2: Staff Dashboard (5 halaman)

Antarmuka khusus **kasir dan barista** (POS internal). Desain fullscreen dengan sidebar minimal.

| No | Nama Halaman | Node ID | Deskripsi |
|----|-------------|---------|-----------|
| 1 | **Staff Login (POS)** | — | Login screen khusus staff dengan field username + password |
| 2 | **Operational Dashboard** | `1:1298` | Kanban board 3-kolom: Incoming / Processing / Completed |
| 3 | **Order Details & Actions** | `1:2325` | Modal detail order dengan gambar menu, info customer, tombol aksi |
| 4 | **Cash Payment Verification** | — | Modal/halaman verifikasi pembayaran cash dari pelanggan |
| 5 | **Today's Transactions** | `1:1854` | Riwayat transaksi harian dengan summary stats |

### Detail Halaman Staff:

#### Operational Dashboard (Kanban)
- **3 Kolom**: Incoming (badge count), Processing, Completed
- **Card order**: Order ID, Table/Nama, Item list, Payment status badge (PAID/UNPAID)
- **Tombol**: "Verify Payment" (dark), "Move Back" + "Complete" 
- **TopBar**: brand + notif + avatar user + nama staff
- **Sidebar kiri**: Logo Brew Station + Live Order + Transaction History + Clock Out

#### Order Details & Actions (Modal)
- **Split layout**: Kiri = gambar menu besar + badge "PRIORITY ORDER" + nama item
- **Kanan**: Customer info (avatar + nama + badge member + total)
- **Customization bento**: Milk Choice, Sweetener
- **Special Request**: text quote
- **Tombol**: Verify Cash Payment (CTA), Accept Order, Start Processing, Mark as Done, Cancel Order

#### Today's Transactions
- **Header**: Judul "Daily Transactions" + tanggal + Today's Revenue + Orders count
- **Summary stats**: Cash Transactions `$342.00`, Digital Payments `$906.50`, Loyalty Points `4,200 pts`
- **Tabel**: Time, Order ID, Customer/Table (avatar+initial), Total Price, Payment, Status badge

---

## 🖥️ Section 3: Admin Dashboard (9 halaman)

Antarmuka lengkap untuk **manajer/admin**. Desktop layout 1280px dengan sidebar navigasi.

| No | Nama Halaman | Node ID | Deskripsi |
|----|-------------|---------|-----------|
| 1 | **Admin Login Page** | `1:1796` | Login form centered card dengan mood image kopi di kanan |
| 2 | **Dashboard Overview** | `1:1510` | Halaman utama dengan KPI, chart, hottest sellers |
| 3 | **Operational Dashboard** | `1:1298` | Kanban live order (sama seperti Staff, tapi dari sisi admin) |
| 4 | **AI Analytics Hub** | `1:1029` | Dashboard AI dengan chart WMA, sentiment polarity, AI reviews |
| 5 | **Menu Management Table** | `1:780` | Tabel menu cafe dengan toggle availability |
| 6 | **Add / Edit Menu Modal** | `1:635` | Modal split: gambar kiri + form kanan |
| 7 | **Staff Directory Page** | `1:400` | Direktori staff dengan bento stats + table |
| 8 | **Add / Edit Staff Modal** | `1:261` | Modal form register staff baru |
| 9 | **Financial & Transaction Reports** | `1:3` | Revenue reporting dengan key metrics + tabel |

### Detail Halaman Admin:

#### Admin Login Page
- Centered card putih dengan rounded corners
- Logo (icon espresso) + "UNAND Co-Workspace"
- Fields: Username, Password
- Checkbox "Remember me" + link "Forgot Access?"
- Tombol "Login →" (dark brown full-width)
- Footer: Language + Support + copyright
- Accent: foto kopi editorial di sisi kanan (256px)

#### Dashboard Overview
- Greeting: "Morning Overview"
- **3 Summary Cards**: Total Orders (1,248), Daily Revenue ($14,520), Active Queue (18 Mins • LIVE STATUS)
- **Chart Section**: "Weekly Sales Trends" dengan toggle Daily/Weekly + line chart
- **Sidebar kanan chart**: Peak Roasting Hours bar chart, Hottest Sellers list
- **Bottom**: Loyalty Insights dark card + Active Staff Activity

#### AI Analytics Hub
- **Header**: "AI Analytics Hub" + subtitle + Model Confidence (98.4%) + Active Forecasts (2,142)
- **Efficiency Tracker**: Line chart dengan toggle Actual/AI Estimated
- **Menu Velocity (WMA)**: Popular Ranking dengan progress bar (Single Origin Flat White 84%, Honey Oat Latte 76%, dll)
- **Sentiment Polarity**: Donut chart dengan AVG Index 4.8, Positive 92%, Critical 2.4%
- **Recent AI Context Reviews**: List feedback customer dengan avatar, badge status (HIGHLY SATISFIED, OPTIMIZED, NEUTRAL)
- **Barista AI Assist**: Dark card dengan saran otomatis ("increase staff for 08:00-10:00 window")
- **Friday Rush Prediction**: Editorial image card dengan prediksi demand

#### Financial & Transaction Reports
- Header: "FINANCIAL CENTER / Revenue Reporting" + date range + Export CSV
- **4 Key Metrics**: Total Net Sales ($12,840), Average Ticket ($18.42), Active Subscriptions (142), Refund Rate (0.42%)
- **Recent Transactions Table**: Date, Order ID, Customer, Amount, Payment Method, Status, Action
- **Bottom Editorial Cards**: "Financial Insights" + "Tax Season Readiness" (image + gradient overlay)

#### Staff Directory Page
- Header: "DIRECTORY / Staff Management" + tombol "+ Add New Staff"
- **Bento Stats**: Total Staff (24), On Duty (08 • green dot), Barista of the Month (Elena Gilbert • 98%)
- **Table**: User ID, Staff Member (avatar+nama+email), Role (badge), Registration Date, Action (kebab)
- **AI Promo Card**: "Analyze Shift Performance with AI Insights" → Launch Analytics

#### Menu Management Table
- Header: "CURATED COLLECTION / Menu Management" + Category Filter + Add New Menu
- **Table**: Visual (image), Menu Identity (nama+subtitle), Collection (badge), Price Point, Availability (toggle), Actions
- **Bottom Bento**: 84% Active Availability, 12 New Seasonal Items, 4.9 Menu Popularity Score

---

## 🎨 Design System

### Color Palette
| Token | Value | Penggunaan |
|-------|-------|-----------|
| Background | `#F5F3F0` | Page background |
| Dark Primary | `#2D1A0E` | CTA buttons, sidebar, dark cards |
| Medium Brown | `#3D2A1A` | Secondary buttons |
| Border | `#E8E2DB` | Card borders, dividers |
| Text Primary | `#1A1208` | Heading, body text |
| Text Secondary | `#8B7B6B` | Labels, metadata |
| Green Accent | `#4CAF50` / `#E8F5E9` | Available status, digital payment |
| Red Alert | `#FF5252` / light red | Cancel, refund, unpaid |

### Typography
- **Heading**: Bold/Black weight, large sizes (40px untuk H1)
- **Label uppercase**: Small caps, letter-spacing untuk breadcrumb/metadata
- **Body**: Regular weight, warm off-white backgrounds

### Layout
- **Admin**: 1280px fullscreen, Sidebar 256px fixed + Main content 1024px
- **Staff**: 1280px fullscreen, Sidebar 256px minimal
- **Customer**: Mobile width ~448px

---

## Struktur Komponen React yang Akan Dibangun

```
resources/js/
├── types/
│   └── index.ts                         # TypeScript interfaces semua
├── Components/
│   ├── Layout/
│   │   ├── AdminLayout.tsx              # Admin dashboard shell
│   │   ├── StaffLayout.tsx              # Staff POS shell
│   │   ├── Sidebar.tsx                  # Admin sidebar
│   │   ├── StaffSidebar.tsx             # Staff sidebar (minimal)
│   │   └── TopBar.tsx                   # Top navigation bar
│   ├── UI/
│   │   ├── StatCard.tsx                 # KPI metric card
│   │   ├── StatusBadge.tsx              # Status pill badge
│   │   ├── Pagination.tsx               # Table pagination
│   │   ├── ToggleSwitch.tsx             # Availability toggle
│   │   ├── KanbanCard.tsx               # Order card untuk kanban
│   │   └── LineChart.tsx                # Chart placeholder
│   └── Modals/
│       ├── AddStaffModal.tsx            # Form register staff
│       ├── AddMenuModal.tsx             # Form add/edit menu
│       └── OrderDetailModal.tsx         # Staff order detail + actions
├── Pages/
│   ├── Auth/
│   │   └── AdminLogin.tsx               # Admin login page
│   ├── Admin/
│   │   ├── Overview.tsx                 # Dashboard Overview
│   │   ├── LiveOrder.tsx                # Operational/Kanban
│   │   ├── AIAnalytics.tsx              # AI Analytics Hub
│   │   ├── Finances.tsx                 # Financial Reports
│   │   ├── Staff/
│   │   │   └── Index.tsx                # Staff Directory
│   │   └── Menu/
│   │       └── Index.tsx                # Menu Management
│   └── Staff/
│       ├── Login.tsx                    # Staff POS login
│       ├── Dashboard.tsx                # Staff operational dashboard
│       └── Transactions.tsx             # Today's transactions
```

---

## Prioritas Implementasi

### Phase 1 (Foundation)
1. TypeScript interfaces (`types/index.ts`)
2. AdminLayout + Sidebar + TopBar
3. Admin Login Page

### Phase 2 (Admin Core)
4. Dashboard Overview
5. Live Order (Kanban)
6. Financial Reports

### Phase 3 (Admin Management)
7. Staff Directory + AddStaffModal
8. Menu Management + AddMenuModal
9. AI Analytics Hub

### Phase 4 (Staff POS)
10. Staff Login
11. Staff Operational Dashboard + OrderDetailModal
12. Today's Transactions

### Phase 5 (Customer App)
13. Customer App pages (mobile-first)
