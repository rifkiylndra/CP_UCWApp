export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'superadmin';
    avatar?: string;
}

// ==========================================
// ── DASHBOARD OVERVIEW
// ==========================================
export interface DashboardMetrics {
    totalOrders: number;
    dailyRevenue: number;
    activeQueue: number;
    loyaltyInsights: number; // e.g. active members or points issued
}

export interface WeeklySalesTrend {
    day: string;
    sales: number;
}

export interface PeakRoastingHour {
    time: string;
    volume: number; // order volume
}

export interface HottestSeller {
    id: string;
    name: string;
    salesCount: number;
    trend: 'up' | 'down' | 'neutral';
    trendPercentage?: number;
}

export interface ActiveStaffActivity {
    id: string;
    name: string;
    role: string;
    status: 'on_duty' | 'break' | 'off_duty';
    shiftInfo: string;
    avatar?: string;
}

// ==========================================
// ── AI ANALYTICS HUB
// ==========================================
export interface AiCoreMetrics {
    modelConfidence: number; // percentage (0-100)
    activeForecasts: number;
}

export interface EfficiencyTracker {
    time: string;
    efficiencyScore: number;
}

export interface PopularRankingItem {
    id: string;
    name: string;
    percentage: number;
    category: string;
}

export interface SentimentPolarity {
    satisfied: number; // percentage
    neutral: number; // percentage
    critical: number; // percentage
}

export interface AiContextReview {
    id: string;
    customerName: string;
    reviewText: string;
    sentiment: 'satisfied' | 'neutral' | 'critical';
    date: string;
}

export interface AiSuggestion {
    id: string;
    title: string;
    description: string;
    type: 'assist' | 'prediction'; // e.g. Barista AI Assist or Friday Rush Prediction
}

// ==========================================
// ── MENU MANAGEMENT
// ==========================================
export interface AdminMenuItem {
    id: string;
    name: string;
    subtitle?: string;
    category: string; // e.g. Espresso, Non-Coffee, Pastry
    price: number;
    isAvailable: boolean;
    imageUrl?: string;
    popularityScore?: number;
}

export interface MenuManagementStats {
    availabilityPercentage: number;
    seasonalItemsCount: number;
}

// ==========================================
// ── STAFF DIRECTORY
// ==========================================
export interface StaffDirectoryMember {
    id: string;
    staffId: string;
    name: string;
    email: string;
    role: string;
    registrationDate: string;
    avatar?: string;
    status?: 'active' | 'inactive';
}

export interface StaffDirectoryStats {
    totalStaff: number;
    onDuty: number;
    baristaOfMonth?: string; // name of the staff
}

// ==========================================
// ── FINANCIAL REPORTS
// ==========================================
export interface FinancialMetrics {
    netSales: number;
    avgTicket: number;
    subscriptions: number;
    refundRate: number; // percentage
}

export interface FinancialTransaction {
    id: string;
    date: string; // ISO date string or formatted date
    orderId: string;
    customerName: string;
    amount: number;
    paymentMethod: string; // e.g. CASH, QRIS, DEBIT
    status: 'paid' | 'unpaid' | 'completed' | 'processing' | 'pending' | 'refunded';
}
