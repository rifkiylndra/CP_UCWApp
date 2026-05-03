# Task: UCW App Frontend Implementation

## Phase 0: Project Setup
- [x] Analisis Figma selesai (26 halaman, 3 section)
- [ ] Scaffold Laravel 11 project
- [ ] Install & konfigurasi Inertia.js v2
- [ ] Install React 18 + TypeScript
- [ ] Install & konfigurasi Tailwind CSS
- [ ] Install Laravel Echo + Pusher
- [ ] Setup base layout & routing

## Phase 1: Customer App (Mobile, width ~448px)
- [ ] TypeScript types (`types/customer.ts`)
- [ ] `CustomerLayout.tsx` (wrapper mobile)
- [ ] **QR Landing Page** — `Pages/Customer/Landing.tsx`
- [ ] **Digital Menu** — `Pages/Customer/Menu.tsx`
- [ ] **Your Cart** — `Pages/Customer/Cart.tsx`
- [ ] **Order Type** — `Pages/Customer/OrderType.tsx`
- [ ] **Preparation Estimate** — `Pages/Customer/Estimate.tsx`
- [ ] **Choose Payment** — `Pages/Customer/ChoosePayment.tsx`
- [ ] **Online Payment** — `Pages/Customer/OnlinePayment.tsx`
- [ ] **Cash Confirmation** — `Pages/Customer/CashConfirmation.tsx`
- [ ] **Live Order Status** (Laravel Echo) — `Pages/Customer/OrderStatus.tsx`
- [ ] **Your Brew is Ready!** — `Pages/Customer/OrderReady.tsx`
- [ ] **Share Your Feedback** — `Pages/Customer/Feedback.tsx`

## Phase 2: Staff Dashboard (POS Desktop)
- [ ] TypeScript types (`types/staff.ts`)
- [ ] `StaffLayout.tsx` (sidebar minimal + topbar)
- [ ] `StaffSidebar.tsx`
- [ ] **Staff Login** — `Pages/Staff/Login.tsx`
- [ ] **Operational Dashboard** (Kanban, Laravel Echo) — `Pages/Staff/Dashboard.tsx`
- [ ] `KanbanCard.tsx` (order card component)
- [ ] `OrderDetailModal.tsx` (split view modal)
- [ ] **Cash Payment Verification** — modal/overlay
- [ ] **Today's Transactions** — `Pages/Staff/Transactions.tsx`

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
