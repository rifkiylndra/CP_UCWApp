// resources/js/Components/customer/BottomNav.tsx
// ─────────────────────────────────────────────
//  Reusable bottom navigation for all Customer pages
//  Tabs: Menu | Cart | Orders | Profile
// ─────────────────────────────────────────────

import { Link } from '@inertiajs/react';

export type NavTab = 'menu' | 'cart' | 'orders' ;

interface BottomNavProps {
    tableId:  string;
    active:   NavTab;
    /** Optional: show cart badge on Cart tab icon */
    cartCount?: number;
}

export default function BottomNav({ tableId, active, cartCount = 0 }: BottomNavProps) {
    const tabs: {
        key:   NavTab;
        label: string;
        href:  string;
        icon:  (isActive: boolean) => React.ReactNode;
    }[] = [
        {
            key:   'menu',
            label: 'Menu',
            href:  route('customer.menu', { tableId }),
            icon:  (a) => (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor"
                    strokeWidth={a ? 2.2 : 1.8}
                    strokeLinecap="round" strokeLinejoin="round"
                >
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1="6" y1="1" x2="6" y2="4" />
                    <line x1="10" y1="1" x2="10" y2="4" />
                    <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
            ),
        },
        {
            key:   'cart',
            label: 'Cart',
            href:  route('customer.cart', { tableId }),
            icon:  (a) => (
                <span className="relative inline-flex">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor"
                        strokeWidth={a ? 2.2 : 1.8}
                        strokeLinecap="round" strokeLinejoin="round"
                    >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 1.99-1.77L23 6H6" />
                    </svg>
                    {cartCount > 0 && (
                        <span
                            className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full
                                       flex items-center justify-center text-[9px] font-bold text-white"
                            style={{ backgroundColor: 'var(--color-ucw-dark)' }}
                        >
                            {cartCount > 9 ? '9+' : cartCount}
                        </span>
                    )}
                </span>
            ),
        },
        {
            key:   'orders',
            label: 'Orders',
            href:  '#',
            icon:  (a) => (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor"
                    strokeWidth={a ? 2.2 : 1.8}
                    strokeLinecap="round" strokeLinejoin="round"
                >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
            ),
        },
        
    ];

    return (
        <div
            className="grid grid-cols-4 px-2 py-2 border-t"
            style={{ borderColor: 'var(--color-ucw-border)' }}
        >
            {tabs.map(tab => {
                const isActive = tab.key === active;
                return (
                    <Link
                        key={tab.key}
                        href={tab.href}
                        className="flex flex-col items-center gap-1 py-1 transition-opacity active:opacity-60"
                        style={{
                            color: isActive
                                ? 'var(--color-ucw-dark)'
                                : 'var(--color-ucw-text-muted)',
                        }}
                    >
                        {tab.icon(isActive)}
                        <span style={{
                            fontSize:   '10px',
                            fontWeight: isActive ? 700 : 500,
                        }}>
                            {tab.label}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}