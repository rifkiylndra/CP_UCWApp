import { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import CustomerLayout from '@/Components/Layout/CustomerLayout';
import type { MenuCategory, MenuItem } from '@/types/customer';

import { BottomNav, TopBar } from '@/Components/customer';
import EmptyState from '@/Components/customer/common/EmptyState';
import MenuCardMobile from '@/Components/customer/menu/MenuCardMobile';
import MenuCardDesktop from '@/Components/customer/menu/MenuCardDesktop';
import MenuSidebar from '@/Components/customer/menu/MenuSidebar';
import CartSidebar from '@/Components/customer/menu/CartSidebar';
import FloatingCartButton from '@/Components/customer/menu/FloatingCartButton';

interface Props {
    tableId: string;
    tableNumber?: string;
    menuItems?: MenuItem[];
}

const CATEGORIES: { key: MenuCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'espresso', label: 'Coffee' },
    { key: 'cold-brews', label: 'Cold Brew' },
    { key: 'botanicals', label: 'Botanicals' },
    { key: 'bakery', label: 'Bakery' },
];

const PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23E8E2DB'/%3E%3Cg opacity='.4'%3E%3Ccircle cx='200' cy='130' r='36' fill='none' stroke='%238B7B6B' stroke-width='2'/%3E%3Cpath d='M200 110 v40 M180 130 h40' stroke='%238B7B6B' stroke-width='2' stroke-linecap='round'/%3E%3C/g%3E%3Ctext x='200' y='195' text-anchor='middle' font-family='system-ui' font-size='13' fill='%238B7B6B'%3ENo image%3C/text%3E%3C/svg%3E";

const DEMO_ITEMS: MenuItem[] = [
    {
        id: '1',
        name: 'Signature Latte',
        subtitle: 'House blend • Steamed milk • Local honey',
        description:
            'Our house-blend double espresso balanced with velvety steamed milk and a hint of local honey.',
        price: 45000,
        category: 'espresso',
        imageUrl: '',
        isAvailable: true,
        isPopular: true,
    },
    {
        id: '2',
        name: 'Cascara Cold Brew',
        subtitle: '16oz • 5 cal • Dairy free',
        description:
            '18-hour slow steeped brew infused with the dried skins of the coffee cherry for a subtle fruity finish.',
        price: 52500,
        category: 'cold-brews',
        imageUrl: '',
        isAvailable: true,
        isPopular: false,
    },
    {
        id: '3',
        name: 'Matcha Ceremonial',
        subtitle: '12oz • 120 cal • Organic',
        description:
            'Whisked Uji matcha with oat milk. Earthy, creamy, and designed for steady energy throughout your session.',
        price: 60000,
        category: 'botanicals',
        imageUrl: '',
        isAvailable: true,
        isPopular: false,
    },
    {
        id: '4',
        name: 'Honey Oat Latte',
        subtitle: 'House-made oat milk • Wildflower honey',
        description: 'Our crowd-pleaser. Subtly sweet and creamy.',
        price: 48000,
        category: 'espresso',
        imageUrl: '',
        isAvailable: true,
        isPopular: true,
    },
    {
        id: '5',
        name: 'Hibiscus Cold Brew',
        subtitle: 'Single origin Ethiopia • 16oz',
        description: 'Cold-steeped 18hrs with dried hibiscus.',
        price: 55000,
        category: 'cold-brews',
        imageUrl: '',
        isAvailable: false,
        isPopular: false,
    },
    {
        id: '6',
        name: 'Artisan Croissant',
        subtitle: 'Baked in-house daily',
        description: "Flaky, buttery layers. Ask your barista for today's filling.",
        price: 35000,
        category: 'bakery',
        imageUrl: '',
        isAvailable: true,
        isPopular: false,
    },
];

export default function Menu({
    tableId,
    tableNumber = '05',
    menuItems = DEMO_ITEMS,
}: Props) {
    const [activeCategory, setActiveCategory] = useState<MenuCategory | 'all'>('all');
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState<Record<string, number>>({});

    const filtered = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return menuItems.filter((item) => {
            const matchCat = activeCategory === 'all' || item.category === activeCategory;
            const matchSearch =
                keyword === '' ||
                item.name.toLowerCase().includes(keyword) ||
                item.subtitle.toLowerCase().includes(keyword);

            return matchCat && matchSearch;
        });
    }, [menuItems, activeCategory, search]);

    const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

    const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
        const item = menuItems.find((i) => i.id === id);
        return sum + (item ? item.price * qty : 0);
    }, 0);

    const cartItems = Object.entries(cart)
        .map(([id, qty]) => ({
            item: menuItems.find((i) => i.id === id)!,
            qty,
        }))
        .filter((row) => row.item);

    function addToCart(id: string) {
        setCart((prev) => ({
            ...prev,
            [id]: (prev[id] ?? 0) + 1,
        }));
    }

    function removeFromCart(id: string) {
        setCart((prev) => {
            const next = { ...prev };

            if ((next[id] ?? 0) <= 1) {
                delete next[id];
            } else {
                next[id]--;
            }

            return next;
        });
    }

    const activeLabel = CATEGORIES.find((c) => c.key === activeCategory)?.label ?? 'Menu';

    return (
        <>
            <Head title="Menu — UCW" />

            <CustomerLayout hideTopBar>
                {/* DESKTOP */}
                <div
                    className="hidden md:flex h-svh max-h-svh overflow-hidden"
                    style={{ backgroundColor: '#E8E1D8' }}
                >
                    <MenuSidebar
                        categories={CATEGORIES}
                        activeCategory={activeCategory}
                        search={search}
                        onSearchChange={setSearch}
                        onCategoryChange={setActiveCategory}
                    />

                    <main className="flex-1 overflow-y-auto p-6 lg:p-7 pb-10">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h3
                                    className="font-black text-xl"
                                    style={{ color: 'var(--color-ucw-dark)' }}
                                >
                                    {activeLabel}
                                </h3>

                                <p
                                    style={{
                                        fontSize: '12px',
                                        color: 'var(--color-ucw-text-muted)',
                                    }}
                                >
                                    {filtered.length} item
                                    {filtered.length !== 1 ? 's' : ''} available
                                </p>
                            </div>
                        </div>

                        {filtered.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div
                                className="grid gap-4"
                                style={{
                                    gridTemplateColumns:
                                        'repeat(auto-fill, minmax(220px, 1fr))',
                                }}
                            >
                                {filtered.map((item) => (
                                    <MenuCardDesktop
                                        key={item.id}
                                        item={item}
                                        qty={cart[item.id] ?? 0}
                                        onAdd={() => addToCart(item.id)}
                                        onRemove={() => removeFromCart(item.id)}
                                        placeholder={PLACEHOLDER}
                                    />
                                ))}
                            </div>
                        )}
                    </main>

                    <CartSidebar
                        tableId={tableId}
                        cartItems={cartItems}
                        cartTotal={cartTotal}
                        onAdd={addToCart}
                        onRemove={removeFromCart}
                    />
                </div>

                {/* MOBILE */}
                <div
                    className="md:hidden flex flex-col min-h-svh"
                    style={{ backgroundColor: 'var(--color-ucw-bg)' }}
                >
                    <div
                        className="sticky top-0 z-30"
                        style={{ backgroundColor: 'var(--color-ucw-bg)' }}
                    >
                        <TopBar
                            tableId={tableId}
                            title="UNAND CO-WORKSPACE"
                            subtitle={`Table ${tableNumber} • Dine In`}
                        />

                        <div className="px-5 pt-3 pb-3">
                            <h1
                                className="font-black leading-[1.1] tracking-tight"
                                style={{
                                    fontSize: '28px',
                                    color: 'var(--color-ucw-dark)',
                                }}
                            >
                                Crafted for your<br />focus.
                            </h1>

                            <p
                                className="mt-1"
                                style={{
                                    fontSize: '13px',
                                    color: 'var(--color-ucw-text-muted)',
                                }}
                            >
                                Curated selections to fuel your workflow.
                            </p>
                        </div>

                        <div className="px-5 pb-3">
                            <div
                                className="flex items-center gap-2.5 px-4 rounded-xl h-11"
                                style={{ backgroundColor: 'var(--color-ucw-border)' }}
                            >
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="var(--color-ucw-text-muted)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="M21 21l-4.35-4.35" />
                                </svg>

                                <input
                                    type="search"
                                    placeholder="Find your blend..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1 bg-transparent outline-none min-w-0"
                                    style={{
                                        fontSize: '13.5px',
                                        color: 'var(--color-ucw-text)',
                                    }}
                                />
                            </div>
                        </div>

                        <div
                            className="flex gap-2 px-5 pb-3 overflow-x-auto"
                            style={{ scrollbarWidth: 'none' }}
                        >
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.key}
                                    onClick={() => setActiveCategory(cat.key)}
                                    className="flex-none px-4 h-9 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                                    style={
                                        activeCategory === cat.key
                                            ? {
                                                  backgroundColor: 'var(--color-ucw-dark)',
                                                  color: 'white',
                                              }
                                            : {
                                                  backgroundColor: 'var(--color-ucw-border)',
                                                  color: 'var(--color-ucw-text-muted)',
                                              }
                                    }
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        <div
                            style={{
                                height: '1px',
                                backgroundColor: 'var(--color-ucw-border)',
                            }}
                        />
                    </div>

                    <div
                        className="flex flex-col pb-40"
                        style={{ backgroundColor: 'var(--color-ucw-bg)' }}
                    >
                        {filtered.length === 0 ? (
                            <EmptyState />
                        ) : (
                            filtered.map((item, index) => (
                                <MenuCardMobile
                                    key={item.id}
                                    item={item}
                                    qty={cart[item.id] ?? 0}
                                    onAdd={() => addToCart(item.id)}
                                    onRemove={() => removeFromCart(item.id)}
                                    isLast={index === filtered.length - 1}
                                    placeholder={PLACEHOLDER}
                                />
                            ))
                        )}
                    </div>

                    <FloatingCartButton
                        tableId={tableId}
                        cartCount={cartCount}
                        cartTotal={cartTotal}
                    />

                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40"
                        style={{ backgroundColor: 'var(--color-ucw-bg)' }}
                    >
                        <BottomNav
                            tableId={tableId}
                            active="menu"
                            cartCount={cartCount}
                        />
                    </div>
                </div>
            </CustomerLayout>
        </>
    );
}