import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Components/Layout/CustomerLayout';
import type { MenuItem, MenuCategory } from '@/types/customer';

interface Props {
    tableId: string;
    menuItems?: MenuItem[];
}

const CATEGORIES: { key: MenuCategory; label: string; emoji: string }[] = [
    { key: 'all',        label: 'All',        emoji: '✦' },
    { key: 'espresso',   label: 'Espresso',   emoji: '☕' },
    { key: 'cold-brews', label: 'Cold Brews', emoji: '🧊' },
    { key: 'botanicals', label: 'Botanicals', emoji: '🌿' },
    { key: 'bakery',     label: 'Bakery',     emoji: '🥐' },
];

// ── Demo data ──
const DEMO_ITEMS: MenuItem[] = [
    { id: '1', name: 'Single Origin Flat White', subtitle: 'Ethiopian Yirgacheffe • 6oz', description: 'Silky microfoam over a double ristretto shot.', price: 42000, category: 'espresso', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=75', isAvailable: true, isPopular: true },
    { id: '2', name: 'Honey Oat Latte', subtitle: 'House-made oat milk • Wildflower honey', description: 'Our crowd-pleaser. Subtly sweet and creamy.', price: 48000, category: 'espresso', imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&q=75', isAvailable: true, isPopular: true },
    { id: '3', name: 'Cascara Tonic', subtitle: 'Coffee cherry tea • Q tonic • 12oz', description: 'Effervescent, floral, and complex.', price: 52000, category: 'cold-brews', imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=75', isAvailable: true },
    { id: '4', name: 'Hibiscus Cold Brew', subtitle: 'Single origin Ethiopia • 16oz', description: 'Cold-steeped 18hrs with dried hibiscus.', price: 55000, category: 'cold-brews', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=75', isAvailable: false },
    { id: '5', name: 'Yuzu Basil Cooler', subtitle: 'Japanese yuzu • Thai basil • Sparkling', description: 'Bright citrus meets herbaceous freshness.', price: 50000, category: 'botanicals', imageUrl: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=75', isAvailable: true },
    { id: '6', name: 'Artisan Pastry Selection', subtitle: 'Baked in-house daily', description: 'Ask your barista for today\'s selection.', price: 35000, category: 'bakery', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=75', isAvailable: true },
];

function formatIDR(n: number) {
    return `Rp ${n.toLocaleString('id-ID')}`;
}

export default function Menu({ tableId, menuItems = DEMO_ITEMS }: Props) {
    const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
    const [cart, setCart] = useState<Record<string, number>>({});

    const filtered = activeCategory === 'all'
        ? menuItems
        : menuItems.filter(i => i.category === activeCategory);

    const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

    function addToCart(id: string) {
        setCart(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    }
    function removeFromCart(id: string) {
        setCart(prev => {
            const next = { ...prev };
            if ((next[id] ?? 0) <= 1) delete next[id];
            else next[id]--;
            return next;
        });
    }

    return (
        <>
            <Head title="Menu" />
            <CustomerLayout
                showBack
                backHref={route('customer.landing', { tableId })}
                title="Our Menu"
            >
                <div className="flex flex-col flex-1 pb-28">
                    {/* ── Category Filter ── */}
                    <div className="flex gap-2 px-5 py-3 overflow-x-auto no-scrollbar">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className="flex-none flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 whitespace-nowrap"
                                style={activeCategory === cat.key ? {
                                    backgroundColor: 'var(--color-ucw-dark)',
                                    color: 'white',
                                } : {
                                    backgroundColor: 'var(--color-ucw-border)',
                                    color: 'var(--color-ucw-text-muted)',
                                }}
                            >
                                <span className="text-[12px]">{cat.emoji}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* ── Menu Grid ── */}
                    <div className="px-5 flex flex-col gap-4 mt-2">
                        {filtered.map(item => (
                            <div
                                key={item.id}
                                className="flex gap-4 p-4 rounded-2xl transition-all"
                                style={{ backgroundColor: item.isAvailable ? 'white' : 'var(--color-ucw-bg-warm)', border: '1px solid var(--color-ucw-border)' }}
                            >
                                {/* Image */}
                                <div className="relative flex-none w-[80px] h-[80px] rounded-xl overflow-hidden">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        style={{ opacity: item.isAvailable ? 1 : 0.4 }}
                                    />
                                    {item.isPopular && item.isAvailable && (
                                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
                                            style={{ backgroundColor: 'var(--color-ucw-dark)', color: 'white' }}>
                                            ✦ Top
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[14px] font-semibold leading-tight mb-0.5 truncate"
                                        style={{ color: item.isAvailable ? 'var(--color-ucw-text)' : 'var(--color-ucw-text-light)' }}>
                                        {item.name}
                                    </h3>
                                    <p className="text-[11px] leading-relaxed mb-2 line-clamp-2"
                                        style={{ color: 'var(--color-ucw-text-muted)' }}>
                                        {item.subtitle}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[14px] font-bold"
                                            style={{ color: 'var(--color-ucw-dark)' }}>
                                            {formatIDR(item.price)}
                                        </span>

                                        {/* Cart controls */}
                                        {item.isAvailable ? (
                                            cart[item.id] ? (
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="w-7 h-7 rounded-full flex items-center justify-center text-[16px] font-bold transition-transform active:scale-90"
                                                        style={{ backgroundColor: 'var(--color-ucw-border)', color: 'var(--color-ucw-dark)' }}
                                                    >−</button>
                                                    <span className="text-[14px] font-bold w-4 text-center"
                                                        style={{ color: 'var(--color-ucw-dark)' }}>
                                                        {cart[item.id]}
                                                    </span>
                                                    <button
                                                        onClick={() => addToCart(item.id)}
                                                        className="w-7 h-7 rounded-full flex items-center justify-center text-[16px] font-bold transition-transform active:scale-90"
                                                        style={{ backgroundColor: 'var(--color-ucw-dark)', color: 'white' }}
                                                    >+</button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => addToCart(item.id)}
                                                    className="w-7 h-7 rounded-full flex items-center justify-center text-[16px] font-bold transition-transform active:scale-90"
                                                    style={{ backgroundColor: 'var(--color-ucw-dark)', color: 'white' }}
                                                >+</button>
                                            )
                                        ) : (
                                            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                                                style={{ backgroundColor: 'var(--color-ucw-border)', color: 'var(--color-ucw-text-muted)' }}>
                                                Sold out
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Floating Cart Button ── */}
                {cartCount > 0 && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 z-50">
                        <Link
                            href={route('customer.cart', { tableId })}
                            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[15px] font-semibold shadow-xl transition-transform active:scale-[0.98]"
                            style={{ backgroundColor: 'var(--color-ucw-dark)', color: 'white' }}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                                    style={{ backgroundColor: 'white', color: 'var(--color-ucw-dark)' }}>
                                    {cartCount}
                                </div>
                                <span>View Cart</span>
                            </div>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                )}
            </CustomerLayout>
        </>
    );
}
