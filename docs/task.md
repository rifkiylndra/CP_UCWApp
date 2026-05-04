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
- [ ] TypeScript types (`types/admin.ts`)
- [ ] `AdminLayout.tsx`
- [ ] `Sidebar.tsx` (admin sidebar)
- [ ] `TopBar.tsx`
- [ ] **Admin Login** — `Pages/Admin/Login.tsx`
- [ ] **Dashboard Overview** — `Pages/Admin/Overview.tsx`
- [ ] **Live Order (Admin view)** — `Pages/Admin/LiveOrder.tsx`
- [ ] **AI Analytics Hub** — `Pages/Admin/AIAnalytics.tsx`
- [ ] **Menu Management** — `Pages/Admin/Menu/Index.tsx`
- [ ] `AddMenuModal.tsx`
- [ ] **Staff Directory** — `Pages/Admin/Staff/Index.tsx`
- [ ] `AddStaffModal.tsx`
- [ ] **Financial Reports** — `Pages/Admin/Finances.tsx`

## Shared UI Components
- [ ] `StatCard.tsx`
- [ ] `StatusBadge.tsx`
- [ ] `Pagination.tsx`
- [ ] `ToggleSwitch.tsx`
- [ ] `TextInput.tsx`
- [ ] `SelectInput.tsx`
