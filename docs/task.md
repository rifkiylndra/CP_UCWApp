# Task: UCW App Frontend Implementation

## Phase 0: Project Setup
- [x] Analisis Figma selesai (26 halaman, 3 section)
- [x] Scaffold Laravel 11 project
- [x] Install & konfigurasi Inertia.js v2
- [x] Install React 18 + TypeScript
- [x] Install & konfigurasi Tailwind CSS
- [x] Install Laravel Echo + Pusher
- [x] Setup base layout & routing

## Phase 1: Customer App (Mobile, width ~448px)
- [x] TypeScript types (`types/customer.ts`)
- [x] `CustomerLayout.tsx` (wrapper mobile)
- [x] **QR Landing Page** — `Pages/Customer/Landing.tsx`
- [x] **Digital Menu** — `Pages/Customer/Menu.tsx`
- [x] **Your Cart** — `Pages/Customer/Cart.tsx`
- [x] **Order Type** — `Pages/Customer/OrderType.tsx`
- [x] **Preparation Estimate** — `Pages/Customer/Estimate.tsx`
- [x] **Choose Payment** — `Pages/Customer/ChoosePayment.tsx`
- [x] **Online Payment** — `Pages/Customer/OnlinePayment.tsx`
- [x] **Cash Confirmation** — `Pages/Customer/CashConfirmation.tsx`
- [x] **Live Order Status** (Laravel Echo) — `Pages/Customer/OrderStatus.tsx`
- [x] **Your Brew is Ready!** — `Pages/Customer/OrderReady.tsx`
- [x] **Share Your Feedback** — `Pages/Customer/Feedback.tsx`

## Phase 2: Staff Dashboard (POS Desktop)
- [x] TypeScript types (`types/staff.ts`)
- [x] `StaffLayout.tsx` (sidebar minimal + topbar)
- [x] `StaffSidebar.tsx`
- [x] **Staff Login** — `Pages/Staff/Login.tsx`
- [x] **Operational Dashboard** (Kanban, Laravel Echo) — `Pages/Staff/Dashboard.tsx`
- [x] `KanbanCard.tsx` (order card component)
- [x] `OrderDetailModal.tsx` (split view modal)
- [x] **Cash Payment Verification** — modal/overlay
- [x] **Today's Transactions** — `Pages/Staff/Transactions.tsx`

## Phase 3: Admin Dashboard (Desktop 1280px)
- [x] TypeScript types (`types/admin.ts`)
- [x] `AdminLayout.tsx`
- [x] `Sidebar.tsx` (admin sidebar)
- [x] `TopBar.tsx`
- [x] **Admin Login** — `Pages/Admin/Login.tsx`
- [x] **Dashboard Overview** — `Pages/Admin/Overview.tsx`
- [x] **Live Order (Admin view)** — `Pages/Admin/LiveOrder.tsx`
- [x] **AI Analytics Hub** — `Pages/Admin/AIAnalytics.tsx`
- [x] **Menu Management** — `Pages/Admin/Menu/Index.tsx`
- [x] `AddMenuModal.tsx`
- [x] **Staff Directory** — `Pages/Admin/Staff/Index.tsx`
- [x] `AddStaffModal.tsx`
- [x] **Financial Reports** — `Pages/Admin/Finances.tsx`

## Shared UI Components
- [ ] `StatCard.tsx`
- [ ] `StatusBadge.tsx`
- [ ] `Pagination.tsx`
- [ ] `ToggleSwitch.tsx`
- [ ] `TextInput.tsx`
- [ ] `SelectInput.tsx`
