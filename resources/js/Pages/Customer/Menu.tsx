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

import { useCart } from '@/hooks/useCart';
import { firstImageUrl, MENU_IMAGE_PLACEHOLDER } from '@/lib/images';

interface CategoryConfig {
    key: string;
    label: string;
}

interface Props {
    tableId: string;
    tableNumber?: string;
    menuItems?: MenuItem[];
    serverCategories?: CategoryConfig[];
}

// DEMO_ITEMS and CATEGORIES moved to backend
const PLACEHOLDER = MENU_IMAGE_PLACEHOLDER;

export default function Menu({
    tableId,
    tableNumber = '',
    menuItems = [],
    serverCategories = [{ key: 'all', label: 'All' }],
}: Props) {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [search, setSearch] = useState('');
    const { items: cartItemsArray, addItem, adjustQuantity, total, totalItems } = useCart();

    const filtered = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return menuItems.filter((item) => {
            const matchCat =
                activeCategory === 'all' ||
                String(item.category_id) === activeCategory;
            const matchSearch =
                keyword === '' ||
                item.name.toLowerCase().includes(keyword) ||
                item.subtitle.toLowerCase().includes(keyword);

            return matchCat && matchSearch;
        });
    }, [menuItems, activeCategory, search]);

    const cartCount = totalItems;
    const cartTotal = total;

    const cartItems = cartItemsArray.map(cartItem => ({
        item:
            menuItems.find(i => i.id === cartItem.id) || {
                ...cartItem,
                category_id: 0,
                estimated_time: 15,
                category_name: 'Unknown',
                isAvailable: true,
                description: '',
            },
        qty: cartItem.quantity
    }));

    function getCartQty(id: string) {
        return cartItemsArray.find(i => i.id === id)?.quantity || 0;
    }

    function addToCart(id: string) {
        const item = menuItems.find(i => i.id === id);
        if (item) {
            addItem({
                id: item.id,
                name: item.name,
                subtitle: item.subtitle || item.description,
                price: item.price,
                imageUrl: firstImageUrl(item.imageUrl, item.image_url, item.image),
                menuId: item.id
            });
        }
    }

    function removeFromCart(id: string) {
        adjustQuantity(id, -1);
    }

    const activeLabel = serverCategories.find((c) => c.key === activeCategory)?.label ?? 'Menu';

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
                        categories={serverCategories as any}
                        activeCategory={activeCategory as any}
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
                                        item={item as any}
                                        qty={getCartQty(item.id)}
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
                            subtitle={tableNumber ? `Table ${tableNumber} • Dine In` : 'Choose items'}
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
                            {serverCategories.map((cat) => (
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
                                    item={item as any}
                                    qty={getCartQty(item.id)}
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
