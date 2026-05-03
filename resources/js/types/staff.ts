// ─────────────────────────────────────────────
//  UCW App — TypeScript Interfaces
//  Staff Dashboard Types
// ─────────────────────────────────────────────

import type { OrderStatus, PaymentMethod, MenuItem } from './customer';

export type StaffRole = 'barista' | 'cashier' | 'manager' | 'supervisor';

export type KanbanColumn = 'incoming' | 'processing' | 'completed';

// ── Staff Member ──
export interface StaffMember {
    id: string;
    name: string;
    username: string;
    role: StaffRole;
    avatarUrl?: string;
    registeredAt: string;
    isOnDuty: boolean;
    brewStation?: string;
}

// ── Order Item (for Staff view) ──
export interface OrderItem {
    menuItem: MenuItem;
    quantity: number;
    size?: string;
    notes?: string;
    customizations?: Record<string, string>;
}

// ── Kanban Order Card ──
export interface KanbanOrder {
    id: string;
    orderId: string;
    tableLabel: string;      // "Table 04" | "Takeaway: Sarah"
    orderType: 'dine-in' | 'takeaway';
    items: OrderItem[];
    totalAmount: number;
    paymentMethod: PaymentMethod;
    isPaid: boolean;
    status: KanbanColumn;
    specialRequest?: string;
    placedAt: string;
    avgWaitMins: number;
    customerName?: string;
    isPriority?: boolean;
}

// ── Transaction Record ──
export interface TransactionRecord {
    id: string;
    orderId: string;
    time: string;
    customerLabel: string;
    customerAvatar?: string;
    customerInitials?: string;
    totalPrice: number;
    paymentMethod: PaymentMethod;
    status: 'completed' | 'refunded' | 'pending';
}

// ── Daily Summary ──
export interface DailySummary {
    date: string;
    cashTotal: number;
    digitalTotal: number;
    loyaltyPoints: number;
    totalRevenue: number;
    totalOrders: number;
}

// ── Staff Page Props ──
export interface StaffPageProps {
    staff?: StaffMember;
    orders?: KanbanOrder[];
    transactions?: TransactionRecord[];
    summary?: DailySummary;
}
