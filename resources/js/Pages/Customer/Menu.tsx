import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import type { MenuItem, MenuCategory } from '@/types/customer';
import { TopBar, BottomNav } from '@/Components/customer';

interface Props {
    tableId:    string;
    menuItems?: MenuItem[];
}

const CATEGORIES: { key: MenuCategory | 'all'; label: string }[] = [
    { key: 'all',        label: 'All'        },
    { key: 'espresso',   label: 'Coffee'     },
    { key: 'cold-brews', label: 'Cold Brew'  },
    { key: 'botanicals', label: 'Botanicals' },
    { key: 'bakery',     label: 'Bakery'     },
];

const PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23E8E2DB'/%3E%3Cg opacity='.4'%3E%3Ccircle cx='200' cy='130' r='36' fill='none' stroke='%238B7B6B' stroke-width='2'/%3E%3Cpath d='M200 110 v40 M180 130 h40' stroke='%238B7B6B' stroke-width='2' stroke-linecap='round'/%3E%3C/g%3E%3Ctext x='200' y='195' text-anchor='middle' font-family='system-ui' font-size='13' fill='%238B7B6B'%3ENo image%3C/text%3E%3C/svg%3E";

const DEMO_ITEMS: MenuItem[] = [
    { id: '1', name: 'Signature Latte',     subtitle: 'House blend • Steamed milk • Local honey',      description: 'Our house-blend double espresso balanced with velvety steamed milk and a hint of local honey.', price: 45000, category: 'espresso',   imageUrl: '', isAvailable: true,  isPopular: true  },
    { id: '2', name: 'Cascara Cold Brew',   subtitle: '16oz • 5 cal • Dairy free',                     description: '18-hour slow steeped brew infused with the dried skins of the coffee cherry for a subtle fruity finish.',                              price: 52500, category: 'cold-brews', imageUrl: '', isAvailable: true,  isPopular: false },
    { id: '3', name: 'Matcha Ceremonial',   subtitle: '12oz • 120 cal • Organic',                      description: 'Whisked Uji matcha with oat milk. Earthy, creamy, and designed for steady energy throughout your session.',                          price: 60000, category: 'botanicals', imageUrl: '', isAvailable: true,  isPopular: false },
    { id: '4', name: 'Honey Oat Latte',     subtitle: 'House-made oat milk • Wildflower honey',        description: 'Our crowd-pleaser. Subtly sweet and creamy.',                                                                                        price: 48000, category: 'espresso',   imageUrl: '', isAvailable: true,  isPopular: true  },
    { id: '5', name: 'Hibiscus Cold Brew',  subtitle: 'Single origin Ethiopia • 16oz',                 description: 'Cold-steeped 18hrs with dried hibiscus.',                                                                                            price: 55000, category: 'cold-brews', imageUrl: '', isAvailable: false, isPopular: false },
    { id: '6', name: 'Artisan Croissant',   subtitle: 'Baked in-house daily',                          description: "Flaky, buttery layers. Ask your barista for today's filling.",                                                                       price: 35000, category: 'bakery',     imageUrl: '', isAvailable: true,  isPopular: false },
];

function formatIDR(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

export default function Menu({ tableId, menuItems = DEMO_ITEMS }: Props) {
    const [activeCategory, setActiveCategory] = useState<MenuCategory | 'all'>('all');
    const [search, setSearch]                 = useState('');
    const [cart, setCart]                     = useState<Record<string, number>>({});

    const filtered = useMemo(() => menuItems.filter(item => {
        const matchCat    = activeCategory === 'all' || item.category === activeCategory;
        const matchSearch = search === '' || item.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    }), [menuItems, activeCategory, search]);

    const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
    const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
        const item = menuItems.find(i => i.id === id);
        return sum + (item ? item.price * qty : 0);
    }, 0);

    function addToCart(id: string)      { setCart(p => ({ ...p, [id]: (p[id] ?? 0) + 1 })); }
    function removeFromCart(id: string) { setCart(p => { const n = { ...p }; if ((n[id] ?? 0) <= 1) delete n[id]; else n[id]--; return n; }); }

    const cartItems = Object.entries(cart)
        .map(([id, qty]) => ({ item: menuItems.find(i => i.id === id)!, qty }))
        .filter(r => r.item);

    return (
        <>
            <Head title="Menu — UCW" />
            <CustomerLayout hideTopBar>

                {/* ══════════════════════════════════════════════
                    DESKTOP: 3-column layout
                ══════════════════════════════════════════════ */}
                <div className="hidden md:flex min-h-svh" style={{ backgroundColor: '#E8E1D8' }}>

                    {/* ── Left sidebar: brand + search + categories ── */}
                    <aside
                        className="w-64 shrink-0 sticky top-0 h-svh overflow-y-auto flex flex-col p-7"
                        style={{ background: 'var(--color-ucw-bg)', borderRight: '1px solid var(--color-ucw-border)' }}
                    >
                        {/* Brand */}
                        <div className="flex items-center gap-2 mb-8">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                                <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
                            </svg>
                            <span className="font-bold text-xs tracking-[0.04em]" style={{ color: 'var(--color-ucw-dark)' }}>
                                UNAND CO-WORKSPACE
                            </span>
                        </div>

                        <h2 className="font-black leading-[1.1] tracking-tight mb-1.5" style={{ fontSize: '22px', color: 'var(--color-ucw-dark)' }}>
                            Crafted for<br />your focus.
                        </h2>
                        <p className="mb-5" style={{ fontSize: '12.5px', color: 'var(--color-ucw-text-muted)' }}>
                            Curated selections to fuel your workflow.
                        </p>

                        {/* Search */}
                        <div
                            className="flex items-center gap-2 px-3 rounded-xl mb-5"
                            style={{ height: '40px', backgroundColor: 'var(--color-ucw-border)' }}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-text-muted)" strokeWidth="2" strokeLinecap="round">
                                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                            </svg>
                            <input
                                type="search"
                                placeholder="Find your blend..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="flex-1 bg-transparent outline-none"
                                style={{ fontSize: '13px', color: 'var(--color-ucw-text)' }}
                            />
                        </div>

                        {/* Category list (vertical) */}
                        <nav className="flex flex-col gap-1">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.key}
                                    onClick={() => setActiveCategory(cat.key)}
                                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-150"
                                    style={
                                        activeCategory === cat.key
                                            ? { backgroundColor: 'var(--color-ucw-dark)', color: 'white' }
                                            : { color: 'var(--color-ucw-text-muted)', backgroundColor: 'transparent' }
                                    }
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </nav>

                        <div className="flex-1" />
                        <p className="tracking-[0.2em] uppercase" style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--color-ucw-border-dark)' }}>
                            SCAN · ORDER · FOCUS · CREATE
                        </p>
                    </aside>

                    {/* ── Center: scrollable menu grid ── */}
                    <main className="flex-1 overflow-y-auto p-7 pb-10">
                        {/* Section header */}
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h3 className="font-black text-xl" style={{ color: 'var(--color-ucw-dark)' }}>
                                    {CATEGORIES.find(c => c.key === activeCategory)?.label ?? 'Menu'}
                                </h3>
                                <p style={{ fontSize: '12px', color: 'var(--color-ucw-text-muted)' }}>
                                    {filtered.length} item{filtered.length !== 1 ? 's' : ''} available
                                </p>
                            </div>
                        </div>

                        {/* Grid */}
                        {filtered.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                                {filtered.map(item => (
                                    <MenuCardDesktop
                                        key={item.id}
                                        item={item}
                                        qty={cart[item.id] ?? 0}
                                        onAdd={() => addToCart(item.id)}
                                        onRemove={() => removeFromCart(item.id)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Banners */}
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            
                        </div>
                    </main>

                    {/* ── Right sidebar: cart ── */}
                    <aside
                        className="w-[290px] shrink-0 sticky top-0 h-svh overflow-y-auto flex flex-col p-7"
                        style={{ background: 'var(--color-ucw-bg)', borderLeft: '1px solid var(--color-ucw-border)' }}
                    >
                        <h3 className="font-black text-lg mb-1" style={{ color: 'var(--color-ucw-dark)', fontFamily: 'inherit' }}>
                            Your Order
                        </h3>
                        <p className="mb-5 text-xs" style={{ color: 'var(--color-ucw-text-muted)' }}>Table 05 · Dine in</p>

                        {cartItems.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-border-dark)" strokeWidth="1.4" strokeLinecap="round">
                                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 1.99-1.77L23 6H6" />
                                </svg>
                                <p style={{ fontSize: '13px', color: 'var(--color-ucw-text-muted)' }}>
                                    Your cart is empty.<br />Add something delicious.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-5">
                                    {cartItems.map(({ item, qty }) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 p-3 rounded-xl"
                                            style={{ background: 'var(--color-ucw-bg-warm)', border: '1px solid var(--color-ucw-border)' }}
                                        >
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--color-ucw-dark)' }}>{item.name}</p>
                                                <p className="text-xs mt-0.5" style={{ color: 'var(--color-ucw-text-muted)' }}>{formatIDR(item.price)} × {qty}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm transition-transform active:scale-90"
                                                    style={{ background: 'var(--color-ucw-border)', color: 'var(--color-ucw-dark)' }}
                                                >−</button>
                                                <span className="font-bold text-sm w-4 text-center" style={{ color: 'var(--color-ucw-dark)' }}>{qty}</span>
                                                <button
                                                    onClick={() => addToCart(item.id)}
                                                    className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm text-white transition-transform active:scale-90"
                                                    style={{ background: 'var(--color-ucw-dark)' }}
                                                >+</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ borderTop: '1px solid var(--color-ucw-border)', paddingTop: '16px' }}>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm" style={{ color: 'var(--color-ucw-text-muted)' }}>Total</span>
                                        <span className="font-bold text-base" style={{ color: 'var(--color-ucw-dark)' }}>{formatIDR(cartTotal)}</span>
                                    </div>
                                    <Link
                                        href={route('customer.cart', { tableId })}
                                        className="w-full flex items-center justify-center gap-2 rounded-[14px] font-bold text-sm text-white transition-all active:scale-[0.97]"
                                        style={{
                                            height:          '48px',
                                            backgroundColor: 'var(--color-ucw-dark)',
                                            boxShadow:       '0 6px 20px rgba(45,26,14,0.25)',
                                        }}
                                    >
                                        Place Order
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </Link>
                                </div>
                            </>
                        )}
                    </aside>
                </div>

                {/* ══════════════════════════════════════════════
                    MOBILE: original single-column layout
                ══════════════════════════════════════════════ */}
                <div className="md:hidden flex flex-col" style={{ backgroundColor: 'var(--color-ucw-bg)' }}>

                    {/* Sticky header */}
                    <div className="sticky top-0 z-30" style={{ backgroundColor: 'var(--color-ucw-bg)' }}>
                        {/* Topbar */}
                        <div className="flex items-center justify-between px-5 pt-4 pb-1">
                            <div className="flex items-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                                    <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
                                </svg>
                                <span className="font-bold tracking-tight text-sm" style={{ color: 'var(--color-ucw-dark)' }}>UNAND CO-WORKSPACE</span>
                            </div>
                            <Link
                                href={route('customer.cart', { tableId })}
                                className="relative w-9 h-9 flex items-center justify-center rounded-full transition-opacity active:opacity-60"
                                style={{ backgroundColor: 'var(--color-ucw-border)' }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 1.99-1.77L23 6H6" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>

                        {/* Title */}
                        <div className="px-5 pt-3 pb-3">
                            <h1 className="font-black leading-[1.1] tracking-tight" style={{ fontSize: '28px', color: 'var(--color-ucw-dark)' }}>
                                Crafted for your<br />focus.
                            </h1>
                            <p className="mt-1" style={{ fontSize: '13px', color: 'var(--color-ucw-text-muted)' }}>
                                Curated selections to fuel your workflow.
                            </p>
                        </div>

                        {/* Search */}
                        <div className="px-5 pb-3">
                            <div className="flex items-center gap-2.5 px-4 rounded-xl h-11" style={{ backgroundColor: 'var(--color-ucw-border)' }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-text-muted)" strokeWidth="2" strokeLinecap="round">
                                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                                </svg>
                                <input
                                    type="search"
                                    placeholder="Find your blend..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="flex-1 bg-transparent outline-none"
                                    style={{ fontSize: '13.5px', color: 'var(--color-ucw-text)' }}
                                />
                            </div>
                        </div>

                        {/* Category pills */}
                        <div className="flex gap-2 px-5 pb-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.key}
                                    onClick={() => setActiveCategory(cat.key)}
                                    className="flex-none px-4 h-9 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                                    style={
                                        activeCategory === cat.key
                                            ? { backgroundColor: 'var(--color-ucw-dark)', color: 'white' }
                                            : { backgroundColor: 'var(--color-ucw-border)', color: 'var(--color-ucw-text-muted)' }
                                    }
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        <div style={{ height: '1px', backgroundColor: 'var(--color-ucw-border)' }} />
                    </div>

                    {/* Menu list */}
                    <div className="flex flex-col pb-32" style={{ backgroundColor: 'var(--color-ucw-bg)' }}>
                        {filtered.length === 0 ? (
                            <EmptyState />
                        ) : (
                            filtered.map((item, i) => (
                                <MenuCardMobile
                                    key={item.id}
                                    item={item}
                                    qty={cart[item.id] ?? 0}
                                    onAdd={() => addToCart(item.id)}
                                    onRemove={() => removeFromCart(item.id)}
                                    isLast={i === filtered.length - 1}
                                />
                            ))
                        )}

                        
                    </div>
{/* Floating cart CTA */}
{cartCount > 0 && (
    <div
        className="fixed bottom-[78px] left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 z-40"
    >
        <Link
            href={route('customer.cart', { tableId })}
            className="w-full flex items-center justify-between px-5 rounded-2xl text-white transition-all active:scale-[0.98]"
            style={{
                height: '56px',
                backgroundColor: 'var(--color-ucw-dark)',
                boxShadow: '0 8px 24px rgba(45,26,14,0.28)',
            }}
        >
            <div className="flex flex-col">
                <span
                    className="font-bold"
                    style={{ fontSize: '14px' }}
                >
                    View Cart
                </span>

                <span
                    style={{
                        fontSize: '11px',
                        opacity: 0.75,
                    }}
                >
                    {cartCount} item{cartCount > 1 ? 's' : ''}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <span
                    className="font-bold"
                    style={{ fontSize: '15px' }}
                >
                    {formatIDR(cartTotal)}
                </span>

                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    </div>
)}
                    {/* Bottom nav */}
                    
<div
    className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40"
    style={{ backgroundColor: 'var(--color-ucw-bg)' }}
>
    <BottomNav tableId={tableId} active="menu" />
</div>


                    
                </div>

            </CustomerLayout>
        </>
    );
}

/* ─── Mobile card (vertical, full-width) ─── */
function MenuCardMobile({ item, qty, onAdd, onRemove, isLast }: {
    item: MenuItem; qty: number; onAdd: () => void; onRemove: () => void; isLast: boolean;
}) {
    return (
        <div>
            <div className="px-5 pt-5">
                <div
                    className="w-full rounded-2xl overflow-hidden mb-4 relative"
                    style={{ aspectRatio: '16/10', backgroundColor: 'var(--color-ucw-border)', opacity: item.isAvailable ? 1 : 0.55 }}
                >
                    <img
                        src={item.imageUrl || PLACEHOLDER} alt={item.name}
                        className="w-full h-full object-cover" loading="lazy"
                        onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                    />
                    {item.isPopular && item.isAvailable && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                            Popular
                        </div>
                    )}
                    {!item.isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(245,243,240,0.6)' }}>
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: 'white', color: 'var(--color-ucw-text-muted)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                Sold out
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold leading-tight flex-1" style={{ fontSize: '17px', color: item.isAvailable ? 'var(--color-ucw-text)' : 'var(--color-ucw-text-muted)' }}>
                        {item.name}
                    </h3>
                    <span className="font-bold shrink-0" style={{ fontSize: '16px', color: 'var(--color-ucw-dark)' }}>
                        {formatIDR(item.price)}
                    </span>
                </div>

                <p className="leading-relaxed mb-1" style={{ fontSize: '12.5px', color: 'var(--color-ucw-text-muted)', lineHeight: '1.6' }}>
                    {item.description}
                </p>
                <p className="uppercase tracking-wider mb-3" style={{ fontSize: '10px', color: 'var(--color-ucw-text-light)', fontWeight: 600 }}>
                    {item.subtitle}
                </p>

                {item.isAvailable && (
                    qty > 0 ? (
                        <div className="flex items-center gap-3 mb-1">
                            <button onClick={onRemove} className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg transition-transform active:scale-90" style={{ backgroundColor: 'var(--color-ucw-border)', color: 'var(--color-ucw-dark)' }}>−</button>
                            <span className="font-bold text-base w-6 text-center" style={{ color: 'var(--color-ucw-dark)' }}>{qty}</span>
                            <button onClick={onAdd} className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg transition-transform active:scale-90 text-white" style={{ backgroundColor: 'var(--color-ucw-dark)' }}>+</button>
                        </div>
                    ) : (
                        <button onClick={onAdd} className="w-full h-11 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]" style={{ backgroundColor: 'var(--color-ucw-bg-warm)', color: 'var(--color-ucw-dark)', border: '1px solid var(--color-ucw-border-dark)' }}>
                            Add to Cart
                        </button>
                    )
                )}
            </div>
            {!isLast && <div className="mt-5" style={{ height: '1px', backgroundColor: 'var(--color-ucw-border)' }} />}
            
        </div>
    );
    
}

/* ─── Desktop card (compact, grid) ─── */
function MenuCardDesktop({ item, qty, onAdd, onRemove }: {
    item: MenuItem; qty: number; onAdd: () => void; onRemove: () => void;
}) {
    return (
        <div
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{ background: 'var(--color-ucw-bg)', border: '1px solid var(--color-ucw-border)' }}
        >
            {/* Image */}
            <div className="relative" style={{ aspectRatio: '4/3', backgroundColor: 'var(--color-ucw-border)', opacity: item.isAvailable ? 1 : 0.55 }}>
                <img
                    src={item.imageUrl || PLACEHOLDER} alt={item.name}
                    className="w-full h-full object-cover" loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                />
                {item.isPopular && item.isAvailable && (
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                        Popular
                    </div>
                )}
                {!item.isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(245,243,240,0.6)' }}>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'white', color: 'var(--color-ucw-text-muted)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>Sold out</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold leading-tight flex-1" style={{ fontSize: '14px', color: item.isAvailable ? 'var(--color-ucw-text)' : 'var(--color-ucw-text-muted)' }}>
                        {item.name}
                    </h3>
                    <span className="font-bold shrink-0 text-sm" style={{ color: 'var(--color-ucw-dark)' }}>
                        {formatIDR(item.price)}
                    </span>
                </div>
                <p className="text-xs leading-relaxed mb-1" style={{ color: 'var(--color-ucw-text-muted)', lineHeight: '1.55' }}>
                    {item.description}
                </p>
                <p className="uppercase tracking-wider mb-3" style={{ fontSize: '9px', color: 'var(--color-ucw-text-light)', fontWeight: 600 }}>
                    {item.subtitle}
                </p>

                <div className="mt-auto">
                    {item.isAvailable && (
                        qty > 0 ? (
                            <div className="flex items-center gap-2">
                                <button onClick={onRemove} className="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-transform active:scale-90" style={{ backgroundColor: 'var(--color-ucw-border)', color: 'var(--color-ucw-dark)', fontSize: '16px' }}>−</button>
                                <span className="font-bold text-sm w-5 text-center" style={{ color: 'var(--color-ucw-dark)' }}>{qty}</span>
                                <button onClick={onAdd} className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-transform active:scale-90" style={{ backgroundColor: 'var(--color-ucw-dark)', fontSize: '16px' }}>+</button>
                            </div>
                        ) : (
                            <button onClick={onAdd} className="w-full h-9 rounded-xl font-semibold text-xs transition-all active:scale-[0.97]" style={{ backgroundColor: 'var(--color-ucw-bg-warm)', color: 'var(--color-ucw-dark)', border: '1px solid var(--color-ucw-border-dark)' }}>
                                Add to Cart
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Shared components ─── */
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-border-dark)" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <p style={{ color: 'var(--color-ucw-text-muted)', fontSize: '14px' }}>No items found</p>
        </div>
    );
}





