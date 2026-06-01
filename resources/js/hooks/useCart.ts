import { useState, useEffect } from 'react';

export interface CartItem {
    id: string;
    name: string;
    subtitle: string;
    price: number;
    quantity: number;
    imageUrl: string;
    notes?: string;
    menuId: string; // the actual menu ID from backend
}

export function useCart() {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = window.localStorage.getItem('ucw_cart');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    const [orderType, setOrderType] = useState<'dine_in' | 'takeaway' | null>(() => {
        if (typeof window === 'undefined') return null;
        try {
            return window.localStorage.getItem('ucw_order_type') as 'dine_in' | 'takeaway' | null;
        } catch { return null; }
    });

    const [customerName, setCustomerName] = useState<string>(() => {
        if (typeof window === 'undefined') return '';
        try {
            return window.localStorage.getItem('ucw_customer_name') || '';
        } catch { return ''; }
    });

    useEffect(() => {
        try { window.localStorage.setItem('ucw_cart', JSON.stringify(items)); } catch {}
    }, [items]);

    useEffect(() => {
        try { 
            if (orderType) window.localStorage.setItem('ucw_order_type', orderType);
            else window.localStorage.removeItem('ucw_order_type');
        } catch {}
    }, [orderType]);

    useEffect(() => {
        try { window.localStorage.setItem('ucw_customer_name', customerName); } catch {}
    }, [customerName]);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.11); // Standard PPN 11% in Indonesia
    const total = subtotal + tax;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === newItem.id);
            if (existing) {
                return prev.map(i => 
                    i.id === newItem.id 
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...newItem, quantity: 1 }];
        });
    };

    const adjustQuantity = (id: string, delta: number) => {
        setItems(prev => prev.flatMap(item => {
            if (item.id !== id) return [item];
            const nextQuantity = item.quantity + delta;
            return nextQuantity <= 0 ? [] : [{ ...item, quantity: nextQuantity }];
        }));
    };

    const updateNotes = (id: string, notes: string) => {
        setItems(prev => prev.map(item => 
            item.id === id ? { ...item, notes } : item
        ));
    };

    const clearCart = () => {
        setItems([]);
        setOrderType(null);
        setCustomerName('');
    };

    return {
        items,
        subtotal,
        tax,
        total,
        totalItems,
        orderType,
        customerName,
        addItem,
        adjustQuantity,
        updateNotes,
        setOrderType,
        setCustomerName,
        clearCart
    };
}
