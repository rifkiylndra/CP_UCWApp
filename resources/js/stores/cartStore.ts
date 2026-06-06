import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, MenuItem } from '@/types/customer';

interface CartState {
    items:         CartItem[];
    tableId:       string | null;
    orderType:     'dine_in' | 'takeaway' | null;
    customerName:  string | null;

    // Computed
    totalItems:  () => number;
    totalAmount: () => number;

    // Actions
    setTableId:      (id: string) => void;
    setOrderType:    (type: 'dine_in' | 'takeaway') => void;
    setCustomerName: (name: string) => void;
    addItem:         (menuItem: MenuItem) => void;
    incrementItem:   (id: string) => void;
    decrementItem:   (id: string) => void;
    removeItem:      (id: string) => void;
    updateNote:      (id: string, note: string) => void;
    clearCart:       () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items:        [],
            tableId:      null,
            orderType:    null,
            customerName: null,

            // ── Computed ──
            totalItems:  () => get().items.reduce((sum, i) => sum + i.quantity, 0),
            totalAmount: () => get().items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0),

            // ── Actions ──
            setTableId:      (id)   => set({ tableId: id }),
            setOrderType:    (type) => set({ orderType: type }),
            setCustomerName: (name) => set({ customerName: name }),

            addItem: (menuItem) => set((state) => {
                const existing = state.items.find(i => i.id === menuItem.id);
                if (existing) {
                    return {
                        items: state.items.map(i =>
                            i.id === menuItem.id
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        ),
                    };
                }
                return {
                    items: [...state.items, {
                        id:       menuItem.id,
                        menuItem,
                        quantity: 1,
                    }],
                };
            }),

            incrementItem: (id) => set((state) => ({
                items: state.items.map(i =>
                    i.id === id ? { ...i, quantity: i.quantity + 1 } : i
                ),
            })),

            decrementItem: (id) => set((state) => ({
                items: state.items.map(i =>
                    i.id === id && i.quantity > 1
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                ),
            })),

            removeItem: (id) => set((state) => ({
                items: state.items.filter(i => i.id !== id),
            })),

            updateNote: (id, note) => set((state) => ({
                items: state.items.map(i =>
                    i.id === id ? { ...i, notes: note } : i
                ),
            })),

            clearCart: () => set({ items: [], orderType: null, customerName: null }),
        }),
        {
            name:    'ucw-cart',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
