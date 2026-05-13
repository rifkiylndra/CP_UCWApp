// resources/js/Components/customer/TopBar.tsx
// ─────────────────────────────────────────────
//  Reusable top bar for all Customer pages
//  Shows: logo + brand name (left), cart icon badge (right)
// ─────────────────────────────────────────────

import { Link } from '@inertiajs/react';

interface TopBarProps {
    tableId:   string;
    cartCount?: number;
}

export default function TopBar({ tableId, cartCount = 0 }: TopBarProps) {
    return (
        <div
            className="flex items-center justify-between px-5 pt-safe pt-4 pb-3"
            style={{ backgroundColor: 'var(--color-ucw-bg)' }}
        >
            {/* ── Left: Logo + Brand ── */}
            <div className="flex items-center gap-2">
                <svg
                    width="20" height="20" viewBox="0 0 24 24"
                    fill="none" stroke="var(--color-ucw-dark)"
                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                >
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1="6" y1="1" x2="6" y2="4" />
                    <line x1="10" y1="1" x2="10" y2="4" />
                    <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
                <span
                    className="font-bold text-sm tracking-tight"
                    style={{ color: 'var(--color-ucw-dark)' }}
                >
                    UNAND CO-WORKSPACE
                </span>
            </div>

            {/* ── Right: Cart icon with badge ── */}
            <Link
                href={route('customer.cart', { tableId })}
                className="relative w-9 h-9 flex items-center justify-center rounded-full transition-opacity active:opacity-60"
                style={{ backgroundColor: 'var(--color-ucw-border)' }}
                aria-label={`Cart (${cartCount} items)`}
            >
                <svg
                    width="17" height="17" viewBox="0 0 24 24"
                    fill="none" stroke="var(--color-ucw-dark)"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 1.99-1.77L23 6H6" />
                </svg>

                {/* Badge — only shown when cart has items */}
                {cartCount > 0 && (
                    <span
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full
                                   flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ backgroundColor: 'var(--color-ucw-dark)' }}
                    >
                        {cartCount > 99 ? '99+' : cartCount}
                    </span>
                )}
            </Link>
        </div>
    );
}