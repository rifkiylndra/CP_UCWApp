import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { TopBar, BottomNav } from '@/Components/customer';

interface Props {
    tableId: string;
}

interface CartItem {
    id:       string;
    name:     string;
    subtitle: string;
    price:    number;
    quantity: number;
    imageUrl: string;
    notes?:   string;
}

const PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23E8E2DB'/%3E%3C/svg%3E";

const DEMO_CART: CartItem[] = [
    { id: '1', name: 'Signature Flat White', subtitle: 'Double shot espresso, velvety microfoam', price: 55000, quantity: 1, imageUrl: '' },
    { id: '2', name: 'Almond Croissant',     subtitle: 'Flaky pastry with frangipane filling',   price: 47500, quantity: 2, imageUrl: '' },
];

function formatIDR(n: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR',
        minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(n);
}

export default function Cart({ tableId }: Props) {
    const [items, setItems] = useState<CartItem[]>(DEMO_CART);

    const subtotal   = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax        = Math.round(subtotal * 0.08);
    const total      = subtotal + tax;
    const totalItems = items.reduce((s, i) => s + i.quantity, 0);

    function adjust(id: string, delta: number) {
        setItems(prev =>
            prev.flatMap(i => {
                if (i.id !== id) return [i];
                const next = i.quantity + delta;
                return next <= 0 ? [] : [{ ...i, quantity: next }];
            })
        );
    }

    function updateNotes(id: string, notes: string) {
        setItems(prev => prev.map(i => i.id === id ? { ...i, notes } : i));
    }

    /* ── Empty state ── */
    if (items.length === 0) {
        return (
            <>
                <Head title="Your Cart" />
                <CustomerLayout showBack backHref={route('customer.menu', { tableId })} hideTopBar>
                    <div className="flex flex-col items-center justify-center flex-1 px-8 text-center py-20">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: 'var(--color-ucw-border)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 1.99-1.77L23 6H6" />
                            </svg>
                        </div>
                        <h2 className="font-bold text-lg mb-1.5" style={{ color: 'var(--color-ucw-text)' }}>Your cart is empty</h2>
                        <p className="text-sm mb-6" style={{ color: 'var(--color-ucw-text-muted)' }}>Add something delicious from the menu.</p>
                        <Link
                            href={route('customer.menu', { tableId })}
                            className="px-6 h-11 rounded-xl text-sm font-semibold flex items-center text-white"
                            style={{ backgroundColor: 'var(--color-ucw-dark)' }}
                        >
                            Browse Menu
                        </Link>
                    </div>
                </CustomerLayout>
            </>
        );
    }

    return (
        <>
            <Head title="Your Cart — UCW" />
            <CustomerLayout showBack backHref={route('customer.menu', { tableId })} hideTopBar>

                {/* ══════════════════════════════════════════════
                    MOBILE layout
                ══════════════════════════════════════════════ */}
                <div className="md:hidden flex flex-col flex-1" style={{ backgroundColor: 'var(--color-ucw-bg)' }}>
                    <TopBar tableId={tableId} cartCount={totalItems} />

                    <div className="flex flex-col flex-1 pb-52">
                        {/* Title */}
                        <div className="px-5 pt-5 pb-3">
                            <h1 className="font-black text-2xl leading-tight" style={{ color: 'var(--color-ucw-dark)' }}>
                                Review your selection
                            </h1>
                            <p className="mt-1 font-semibold uppercase tracking-[0.14em]" style={{ fontSize: '10px', color: 'var(--color-ucw-text-muted)' }}>
                                YOUR MORNING RITUAL, CURATED
                            </p>
                        </div>

                        {/* Items */}
                        <div className="flex flex-col px-5 gap-0">
                            {items.map((item, idx) => (
                                <div key={item.id}>
                                    <CartItemRow item={item} onAdjust={adjust} onUpdateNotes={updateNotes} />
                                    {idx < items.length - 1 && (
                                        <div style={{ height: '1px', backgroundColor: 'var(--color-ucw-border)' }} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add more */}
                        <AddMoreLink tableId={tableId} className="mx-5 mt-2" />

                        {/* Summary */}
                        <PriceSummary subtotal={subtotal} tax={tax} total={total} className="mx-5 mt-6" />
                    </div>

                    {/* Fixed bottom CTA */}
                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40"
                        style={{ backgroundColor: 'var(--color-ucw-bg)' }}
                    >
                        <div className="px-5 pt-4 pb-2">
                            <CheckoutButton tableId={tableId} />
                        </div>
                        <BottomNav tableId={tableId} active="cart" />
                    </div>
                </div>

                {/* ══════════════════════════════════════════════
                    DESKTOP layout — two columns
                ══════════════════════════════════════════════ */}
                <div className="hidden md:flex min-h-svh" style={{ backgroundColor: '#E8E1D8' }}>

                    {/* ── Left: cart items ── */}
                    <main className="flex-1 overflow-y-auto">

                        {/* Desktop top bar */}
                        <div
                            className="sticky top-0 z-30 flex items-center justify-between px-10 py-5"
                            style={{ background: 'var(--color-ucw-bg)', borderBottom: '1px solid var(--color-ucw-border)' }}
                        >
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route('customer.menu', { tableId })}
                                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                                    style={{ backgroundColor: 'var(--color-ucw-border)' }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                </Link>
                                <div className="flex items-center gap-2">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                                        <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
                                    </svg>
                                    <span className="font-bold text-sm tracking-[0.04em]" style={{ color: 'var(--color-ucw-dark)' }}>UNAND CO-WORKSPACE</span>
                                </div>
                            </div>

                            {/* Nav tabs */}
                            <div className="flex items-center gap-1">
                                {[
                                    { label: 'Menu',   href: route('customer.menu', { tableId }), active: false },
                                    { label: 'Cart',   href: '#',                                 active: true  },
                                    { label: 'Orders', href: '#',                                 active: false },
                                ].map(tab => (
                                    <Link
                                        key={tab.label}
                                        href={tab.href}
                                        className="px-4 h-8 rounded-full text-sm font-semibold flex items-center transition-all"
                                        style={tab.active
                                            ? { backgroundColor: 'var(--color-ucw-dark)', color: 'white' }
                                            : { color: 'var(--color-ucw-text-muted)' }
                                        }
                                    >
                                        {tab.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Items */}
                        <div className="max-w-2xl mx-auto px-10 py-8">
                            <h1 className="font-black leading-tight mb-1" style={{ fontSize: '28px', color: 'var(--color-ucw-dark)' }}>
                                Review your selection
                            </h1>
                            <p className="font-semibold uppercase tracking-[0.14em] mb-8" style={{ fontSize: '10px', color: 'var(--color-ucw-text-muted)' }}>
                                YOUR MORNING RITUAL, CURATED
                            </p>

                            <div className="flex flex-col">
                                {items.map((item, idx) => (
                                    <div key={item.id}>
                                        <CartItemRow item={item} onAdjust={adjust} onUpdateNotes={updateNotes} desktop />
                                        {idx < items.length - 1 && (
                                            <div style={{ height: '1px', backgroundColor: 'var(--color-ucw-border)' }} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <AddMoreLink tableId={tableId} className="mt-4" />
                        </div>
                    </main>

                    {/* ── Right: order summary panel ── */}
                    <aside
                        className="w-[340px] shrink-0 sticky top-0 h-svh overflow-y-auto flex flex-col"
                        style={{ background: 'var(--color-ucw-bg)', borderLeft: '1px solid var(--color-ucw-border)' }}
                    >
                        {/* Header */}
                        <div className="px-8 pt-8 pb-5" style={{ borderBottom: '1px solid var(--color-ucw-border)' }}>
                            <h2 className="font-black text-xl mb-0.5" style={{ color: 'var(--color-ucw-dark)' }}>Order Summary</h2>
                            <p className="text-xs" style={{ color: 'var(--color-ucw-text-muted)' }}>
                                Table 05 · {totalItems} item{totalItems !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {/* Mini cart list */}
                        <div className="flex-1 overflow-y-auto px-8 py-5 flex flex-col gap-4">
                            {items.map(item => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-xl overflow-hidden shrink-0"
                                        style={{ backgroundColor: 'var(--color-ucw-border)' }}
                                    >
                                        <img
                                            src={item.imageUrl || PLACEHOLDER} alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm leading-tight truncate" style={{ color: 'var(--color-ucw-dark)' }}>{item.name}</p>
                                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-ucw-text-muted)' }}>
                                            {formatIDR(item.price)} × {item.quantity}
                                        </p>
                                    </div>
                                    <span className="font-bold text-sm shrink-0" style={{ color: 'var(--color-ucw-dark)' }}>
                                        {formatIDR(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Price breakdown + CTA */}
                        <div className="px-8 pb-8" style={{ borderTop: '1px solid var(--color-ucw-border)', paddingTop: '20px' }}>
                            <PriceSummary subtotal={subtotal} tax={tax} total={total} className="" compact />

                            <div className="mt-6">
                                <CheckoutButton tableId={tableId} />
                            </div>

                            <Link
                                href={route('customer.menu', { tableId })}
                                className="w-full flex items-center justify-center mt-3 h-10 rounded-xl text-sm font-medium transition-opacity active:opacity-60"
                                style={{ color: 'var(--color-ucw-text-muted)' }}
                            >
                                ← Continue shopping
                            </Link>
                        </div>
                    </aside>
                </div>

            </CustomerLayout>
        </>
    );
}

/* ─── Shared sub-components ─── */

function CartItemRow({
    item, onAdjust, onUpdateNotes, desktop = false,
}: {
    item:           CartItem;
    onAdjust:       (id: string, delta: number) => void;
    onUpdateNotes:  (id: string, notes: string) => void;
    desktop?:       boolean;
}) {
    return (
        <div className="py-5">
            <div className="flex gap-4">
                {/* Thumbnail */}
                <div
                    className="rounded-2xl overflow-hidden shrink-0"
                    style={{
                        width:           desktop ? '120px' : '110px',
                        height:          desktop ? '110px' : '100px',
                        backgroundColor: 'var(--color-ucw-border)',
                    }}
                >
                    <img
                        src={item.imageUrl || PLACEHOLDER} alt={item.name}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                    />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold leading-tight flex-1" style={{ fontSize: desktop ? '16px' : '15px', color: 'var(--color-ucw-text)' }}>
                                {item.name}
                            </h3>
                            <span className="font-bold shrink-0" style={{ fontSize: '15px', color: 'var(--color-ucw-dark)' }}>
                                {formatIDR(item.price)}
                            </span>
                        </div>
                        <p className="mt-1 leading-snug" style={{ fontSize: '12px', color: 'var(--color-ucw-text-muted)' }}>
                            {item.subtitle}
                        </p>
                    </div>

                    {/* Stepper + delete */}
                    <div className="flex items-center gap-3 mt-3">
                        <button
                            onClick={() => onAdjust(item.id, -1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-transform active:scale-90"
                            style={{ backgroundColor: 'var(--color-ucw-border)', color: 'var(--color-ucw-dark)' }}
                        >−</button>
                        <span className="w-5 text-center font-bold" style={{ fontSize: '15px', color: 'var(--color-ucw-text)' }}>
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => onAdjust(item.id, 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-transform active:scale-90 text-white"
                            style={{ backgroundColor: 'var(--color-ucw-dark)' }}
                        >+</button>

                        <button
                            onClick={() => onAdjust(item.id, -item.quantity)}
                            className="ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-opacity active:opacity-50"
                            style={{ color: 'var(--color-ucw-text-muted)' }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14H6L5 6" />
                                <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Notes input */}
            <input
                type="text"
                placeholder="Add special notes (e.g. Extra hot, oat milk...)"
                value={item.notes ?? ''}
                onChange={e => onUpdateNotes(item.id, e.target.value)}
                className="w-full mt-3 px-4 h-10 rounded-xl text-xs outline-none"
                style={{
                    backgroundColor: 'var(--color-ucw-bg-warm)',
                    border:          '1px solid var(--color-ucw-border)',
                    color:           'var(--color-ucw-text)',
                }}
            />
        </div>
    );
}

function PriceSummary({
    subtotal, tax, total, className = '', compact = false,
}: {
    subtotal: number; tax: number; total: number; className?: string; compact?: boolean;
}) {
    return (
        <div className={className}>
            <div className="flex justify-between items-center mb-3">
                <span className="font-semibold uppercase tracking-[0.12em]" style={{ fontSize: '11px', color: 'var(--color-ucw-text-muted)' }}>SUBTOTAL</span>
                <span className="font-semibold" style={{ fontSize: '14px', color: 'var(--color-ucw-text)' }}>{formatIDR(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
                <span className="font-semibold uppercase tracking-[0.12em]" style={{ fontSize: '11px', color: 'var(--color-ucw-text-muted)' }}>TAX (8%)</span>
                <span className="font-semibold" style={{ fontSize: '14px', color: 'var(--color-ucw-text)' }}>{formatIDR(tax)}</span>
            </div>
            <div style={{ height: '1px', backgroundColor: 'var(--color-ucw-border)' }} />
            <div className="flex justify-between items-center mt-4">
                <span className="font-black" style={{ fontSize: compact ? '15px' : '17px', color: 'var(--color-ucw-text)' }}>Total</span>
                <span className="font-black" style={{ fontSize: compact ? '18px' : '22px', color: 'var(--color-ucw-dark)' }}>{formatIDR(total)}</span>
            </div>
        </div>
    );
}

function AddMoreLink({ tableId, className = '' }: { tableId: string; className?: string }) {
    return (
        <Link
            href={route('customer.menu', { tableId })}
            className={`flex items-center justify-center gap-1.5 h-11 rounded-xl text-sm font-medium transition-opacity active:opacity-60 ${className}`}
            style={{ border: '1.5px dashed var(--color-ucw-border-dark)', color: 'var(--color-ucw-text-muted)' }}
        >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
            </svg>
            Add more items
        </Link>
    );
}

function CheckoutButton({ tableId }: { tableId: string }) {
    return (
        <Link
            href={route('customer.order-type', { tableId })}
            className="w-full flex items-center justify-between px-6 rounded-2xl font-bold transition-all active:scale-[0.98] text-white"
            style={{
                height:          '56px',
                fontSize:        '15px',
                backgroundColor: 'var(--color-ucw-dark)',
                boxShadow:       '0 4px 20px rgba(45,26,14,0.25)',
            }}
        >
            <span>Proceed to Checkout</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </Link>
    );
}