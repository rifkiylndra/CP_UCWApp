// ─────────────────────────────────────────────
//  UCW App — TypeScript Interfaces
//  Customer App Types
// ─────────────────────────────────────────────

export type OrderType = 'dine-in' | 'takeaway';

export type PaymentMethod = 'cash' | 'qris' | 'card' | 'gopay' | 'ovo';

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
    order?: CustomerOrder;
    menuItems?: MenuItem[];
    cartItems?: CartItem[];
}
