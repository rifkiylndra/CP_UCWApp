import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Components/Layout/CustomerLayout';

interface Props {
    tableId: string;
}

interface CartItem {
    id: string;
    name: string;
    subtitle: string;
    price: number;
    quantity: number;
    imageUrl: string;
    notes?: string;
}

// Demo cart state (in real app: from Inertia shared state / localStorage)
const DEMO_CART: CartItem[] = [
    { id: '1', name: 'Single Origin Flat White', subtitle: 'Ethiopian Yirgacheffe • 6oz', price: 42000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&q=75' },
    { id: '2', name: 'Honey Oat Latte', subtitle: 'House-made oat milk', price: 48000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=200&q=75' },
];

function formatIDR(n: number) {
    return `Rp ${n.toLocaleString('id-ID')}`;
}

export default function Cart({ tableId }: Props) {
    const [items, setItems] = useState<CartItem[]>(DEMO_CART);

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const serviceFee = 5000;
    const total = subtotal + serviceFee;

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

    if (items.length === 0) {
        return (
            <>
                <Head title="Your Cart" />
                <CustomerLayout showBack backHref={route('customer.menu', { tableId })} title="Your Cart">
                    <div className="flex flex-col items-center justify-center flex-1 px-8 text-center">
                        <div className="text-6xl mb-4">☕</div>
                        <h2 className="text-[18px] font-semibold mb-2" style={{ color: 'var(--color-ucw-text)' }}>Your cart is empty</h2>
                        <p className="text-[14px] mb-6" style={{ color: 'var(--color-ucw-text-muted)' }}>Add something delicious from the menu.</p>
                        <Link href={route('customer.menu', { tableId })}
                            className="px-6 py-3 rounded-2xl text-[14px] font-semibold"
                            style={{ backgroundColor: 'var(--color-ucw-dark)', color: 'white' }}>
                            Browse Menu
                        </Link>
                    </div>
                </CustomerLayout>
            </>
        );
    }

    return (
        <>
            <Head title="Your Cart" />
            <CustomerLayout
                showBack
                backHref={route('customer.menu', { tableId })}
                title="Your Cart"
                step={1}
            >
                <div className="flex flex-col flex-1 pb-36">
                    {/* ── Items ── */}
                    <div className="px-5 mt-4 flex flex-col gap-3">
                        {items.map(item => (
                            <div key={item.id} className="rounded-2xl overflow-hidden"
                                style={{ border: '1px solid var(--color-ucw-border)', backgroundColor: 'white' }}>
                                <div className="flex gap-3 p-4">
                                    <img src={item.imageUrl} alt={item.name}
                                        className="w-14 h-14 rounded-xl object-cover flex-none" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-[14px] font-semibold truncate" style={{ color: 'var(--color-ucw-text)' }}>{item.name}</h3>
                                        <p className="text-[11px] mb-2" style={{ color: 'var(--color-ucw-text-muted)' }}>{item.subtitle}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[14px] font-bold" style={{ color: 'var(--color-ucw-dark)' }}>
                                                {formatIDR(item.price)}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => adjust(item.id, -1)}
                                                    className="w-7 h-7 rounded-full flex items-center justify-center text-[16px] font-bold"
                                                    style={{ backgroundColor: 'var(--color-ucw-border)', color: 'var(--color-ucw-dark)' }}>−</button>
                                                <span className="w-4 text-center text-[14px] font-bold" style={{ color: 'var(--color-ucw-text)' }}>{item.quantity}</span>
                                                <button onClick={() => adjust(item.id, 1)}
                                                    className="w-7 h-7 rounded-full flex items-center justify-center text-[16px] font-bold"
                                                    style={{ backgroundColor: 'var(--color-ucw-dark)', color: 'white' }}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Notes input */}
                                <div className="px-4 pb-3">
                                    <input
                                        type="text"
                                        placeholder="Special request (e.g. extra hot, no sugar)"
                                        value={item.notes ?? ''}
                                        onChange={e => updateNotes(item.id, e.target.value)}
                                        className="w-full text-[12px] px-3 py-2 rounded-lg outline-none"
                                        style={{ backgroundColor: 'var(--color-ucw-bg)', border: '1px solid var(--color-ucw-border)', color: 'var(--color-ucw-text)' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Add more items ── */}
                    <Link href={route('customer.menu', { tableId })}
                        className="mx-5 mt-3 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-medium"
                        style={{ border: '1.5px dashed var(--color-ucw-border-dark)', color: 'var(--color-ucw-text-muted)' }}>
                        + Add more items
                    </Link>

                    {/* ── Price Breakdown ── */}
                    <div className="mx-5 mt-5 p-4 rounded-2xl" style={{ backgroundColor: 'white', border: '1px solid var(--color-ucw-border)' }}>
                        <div className="flex justify-between mb-2.5">
                            <span className="text-[13px]" style={{ color: 'var(--color-ucw-text-muted)' }}>Subtotal</span>
                            <span className="text-[13px] font-semibold" style={{ color: 'var(--color-ucw-text)' }}>{formatIDR(subtotal)}</span>
                        </div>
                        <div className="flex justify-between mb-3">
                            <span className="text-[13px]" style={{ color: 'var(--color-ucw-text-muted)' }}>Service fee</span>
                            <span className="text-[13px] font-semibold" style={{ color: 'var(--color-ucw-text)' }}>{formatIDR(serviceFee)}</span>
                        </div>
                        <div className="h-px" style={{ backgroundColor: 'var(--color-ucw-border)' }} />
                        <div className="flex justify-between mt-3">
                            <span className="text-[15px] font-bold" style={{ color: 'var(--color-ucw-text)' }}>Total</span>
                            <span className="text-[15px] font-black" style={{ color: 'var(--color-ucw-dark)' }}>{formatIDR(total)}</span>
                        </div>
                    </div>
                </div>

                {/* ── Fixed Footer CTA ── */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                    style={{ background: 'linear-gradient(to top, var(--color-ucw-bg) 70%, transparent)' }}>
                    <Link
                        href={route('customer.order-type', { tableId })}
                        className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[15px] font-semibold shadow-lg transition-transform active:scale-[0.98]"
                        style={{ backgroundColor: 'var(--color-ucw-dark)', color: 'white' }}
                    >
                        <span>Proceed to Order</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[14px] font-bold opacity-70">{formatIDR(total)}</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                </div>
            </CustomerLayout>
        </>
    );
}
