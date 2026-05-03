// ─────────────────────────────────────────────
//  UCW App — TypeScript Interfaces
//  Admin Dashboard Types
// ─────────────────────────────────────────────

import type { MenuItem, MenuCategory } from './customer';
import type { StaffMember, TransactionRecord } from './staff';

export type AdminNavItem =
    | 'overview'
    | 'live-order'
    | 'ai-analytics'
    | 'menu'
    | 'staff'
    | 'finances'
    | 'settings';

// ── Admin User ──
export interface AdminUser {
    id: string;
    name: string;
    username: string;
    role: 'admin' | 'master-roaster';
    avatarUrl?: string;
}

// ── KPI Metric ──
export interface KPIMetric {
    label: string;
    value: string;
    trend?: number;         // % change
    trendLabel?: string;
    variant?: 'light' | 'dark';
}

// ── Chart Data Point ──
export interface ChartDataPoint {
    label: string;          // e.g. "MON", "TUE"
    actual: number;
    estimated?: number;
}

// ── AI Review ──
export interface AIReview {
    id: string;
    customerName: string;
    avatarUrl?: string;
    sentiment: 'highly-satisfied' | 'optimized' | 'neutral' | 'critical';
    comment: string;
    timestamp: string;
}

// ── Menu Velocity Item ──
export interface MenuVelocityItem {
    name: string;
    percentage: number;
}

// ── Staff Directory Stats ──
export interface StaffDirectoryStats {
    totalStaff: number;
    onDuty: number;
    baristaOfMonth: {
        name: string;
        rating: number;
        avatarUrl?: string;
    };
}

// ── Financial Transaction ──
export interface FinancialTransaction extends TransactionRecord {
    date: string;
    customerId?: string;
    customerName?: string;
    customerAvatarUrl?: string;
}

// ── Financial Summary ──
export interface FinancialSummary {
    totalNetSales: number;
    averageTicket: number;
    activeSubscriptions: number;
    refundRate: number;
}

// ── Admin Page Props ──
export interface AdminPageProps {
    admin?: AdminUser;
    activeNav?: AdminNavItem;
    kpis?: KPIMetric[];
    staffStats?: StaffDirectoryStats;
    staffMembers?: StaffMember[];
    menuItems?: MenuItem[];
    transactions?: FinancialTransaction[];
    financialSummary?: FinancialSummary;
    aiReviews?: AIReview[];
    chartData?: ChartDataPoint[];
    menuVelocity?: MenuVelocityItem[];
}
