// ─────────────────────────────────────────────
//  UCW App — TypeScript Interfaces
//  Customer App Types
// ─────────────────────────────────────────────

export type OrderType = 'dine_in' | 'takeaway';

export type PaymentMethod = 'cash' | 'qris_pakasir' | 'bri_va_pakasir';

export type PakasirMethod = 'qris' | 'bri_va';

export type PaymentStatus =
    | 'unpaid'
    | 'waiting_verification'
    | 'paid'
    | 'failed'
    | 'expired';

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'completed'
    | 'cancelled';

export type MenuCategory = string;

// ── Menu Item ──
export interface MenuItem {
    id: string;
    category_id: number;
    name: string;
    subtitle: string;
    description: string;
    price: number;
    estimated_time: number;
    category_name?: string | null;
    imageUrl: string;
    isAvailable: boolean;
    isPopular?: boolean;
}

// ── Cart Item ──
export interface CartItem {
    id: string;
    menuItem: MenuItem;
    quantity: number;
    notes?: string;
    customizations?: {
        milk?: string;
        sweetener?: string;
        size?: string;
    };
}

// ── Customer Order ──
export interface CustomerOrder {
    id: string;
    orderId: string;
    tableId: string;
    orderType: OrderType;
    items: CartItem[];
    totalAmount: number;
    paymentMethod?: PaymentMethod;
    status: OrderStatus;
    estimatedMinutes: number;
    placedAt: string;
    notes?: string;
}

export interface Payment {
    id: number;
    provider?: 'pakasir' | 'manual' | 'midtrans' | string | null;
    provider_reference?: string | null;
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
    amount: number;
    fee?: number | null;
    total_payment?: number | null;
    payment_number?: string | null;
    expired_at?: string | null;
    paid_at?: string | null;
    completed_at?: string | null;
}

export interface OrderDetail {
    id: number;
    menu_id: number;
    quantity: number;
    note?: string | null;
    subtotal: number;
    menu?: {
        id: number;
        name: string;
        description?: string | null;
        image?: string | null;
        image_url?: string | null;
    };
}

export interface Order {
    id: number;
    order_ref: string;
    table_id?: number | null;
    order_status: OrderStatus;
    payment_status: PaymentStatus;
    payment_method?: PaymentMethod | null;
    estimated_serve_time?: number | null;
    total_price: number;
    created_at: string;
    order_details?: OrderDetail[];
    payments?: Payment[];
}

export interface PakasirPaymentResponse {
    success: boolean;
    message?: string;
    orderId: number | string;
    orderRef: string;
    total: number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    pakasirMethod?: PakasirMethod;
    paymentNumber?: string | null;
    totalPayment?: number | null;
    expiredAt?: string | null;
    payment_id?: number;
}

export interface CustomerPaymentStatusResponse {
    success?: boolean;
    order_id?: number | string;
    order_ref?: string;
    payment_status?: PaymentStatus;
    payment_method?: PaymentMethod | null;
    order_status?: OrderStatus;
    total_price?: number;
    estimated_serve_time?: number | null;
    created_at?: string | null;
    table_number?: string | null;
    orderId?: number | string;
    orderRef?: string;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod | null;
    orderStatus?: OrderStatus;
    total?: number;
    estimatedServeTime?: number | null;
    createdAt?: string | null;
    tableNumber?: string | null;
    items?: {
        id: string;
        menuId?: string;
        name?: string | null;
        quantity?: number;
        note?: string | null;
        subtotal?: number;
    }[];
}

// ── Feedback ──
export interface CustomerFeedback {
    orderId: string;
    rating: number;      // 1–5
    comment: string;
    serviceRating: number;
    ambiance: number;
}

// ── Page Props ──
export interface CustomerPageProps {
    tableId: string;
    orderId?: string;
    orderRef?: string;
    order?: CustomerOrder;
    menuItems?: MenuItem[];
    cartItems?: CartItem[];
}
