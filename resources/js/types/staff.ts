// ─────────────────────────────────────────────
//  UCW App — TypeScript Interfaces
//  Staff Dashboard Types
// ─────────────────────────────────────────────

import type { OrderStatus, PaymentMethod, MenuItem } from './customer';

// ── Staff Member ──
export type StaffRole = 'barista' | 'head-barista' | 'cashier' | 'manager';

export interface StaffUser {
    id: string;
    name: string;
    username: string;
    role: StaffRole | string;
    position: string;        // Contoh: "HEAD BARISTA"
    avatarUrl?: string;
    avatar?: string;
    shiftInfo?: string;     // Contoh: "Active Shift: 06.00-14.00"
    brewStation?: string;   // Contoh: "Brew Station 1"
}

// ── Kanban Column ──
export type KanbanColumn = 'incoming' | 'processing' | 'completed';

// ── Order Item (untuk UI Staff) ──
export interface OrderItem {
    id: string;
    menuItem: MenuItem;
    quantity: number;
    milkChoice?: string;    // Customization dari modal detail
    sweetener?: string;     // Customization dari modal detail
    size?: string;
    notes?: string;         // Catatan khusus per item
}

// ── Kanban Order Card ──
export interface KanbanOrder {
    id: string;
    orderId: string;
    tableLabel: string;      // "Table 04" atau "Takeaway: Sarah"
    orderType: 'dine-in' | 'takeaway';
    items: OrderItem[];
    totalAmount: number;
    paymentMethod: PaymentMethod;
    isPaid: boolean;         // Menentukan badge PAID / UNPAID
    status: KanbanColumn;
    placedAt: string;        // Waktu order dibuat
    avgWaitMins?: number;
    
    // Detail khusus untuk Order Detail Modal
    customerName?: string;
    customerAvatar?: string;
    customerBadge?: string;  // Contoh: "Gold Member • 124 pts"
    specialRequest?: string; // Teks quote di order detail
    isPriority?: boolean;    // Menentukan badge PRIORITY ORDER
}

// ── Transaction Record ──
export interface DailyTransaction {
    id: string;
    time: string;            // Contoh: "08:42 AM"
    orderId: string;
    customerName: string;
    customerAvatar?: string;
    customerInitial?: string;
    totalPrice: number;
    paymentMethod: PaymentMethod;
    status: 'completed' | 'pending' | 'refunded';
}

// ── Payment Summary ──
export interface PaymentSummary {
    date: string;
    totalRevenue: number;
    totalOrders: number;
    cashTransactions: number;
    digitalPayments: number;
    loyaltyPoints: number;
}

// ── Page Props (Global) ──
export interface StaffPageProps {
    auth: {
        user: StaffUser;
    };
    orders?: KanbanOrder[];
    transactions?: DailyTransaction[];
    summary?: PaymentSummary;
}
