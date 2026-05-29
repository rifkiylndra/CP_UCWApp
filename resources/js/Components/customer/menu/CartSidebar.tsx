import { Link } from '@inertiajs/react';
import type { MenuItem } from '@/types/customer';
import { formatIDR } from '@/lib/currency';

interface CartItem {
    item: MenuItem;
    qty: number;
}

interface Props {
    tableId: string;
    cartItems: CartItem[];
    cartTotal: number;
    onAdd: (id: string) => void;
    onRemove: (id: string) => void;
}

export default function CartSidebar({
    tableId,
    cartItems,
    cartTotal,
    onAdd,
    onRemove,
}: Props) {
    return (
        <aside
            className="w-[290px] xl:w-[320px] shrink-0 sticky top-0 h-svh overflow-y-auto flex flex-col p-7"
            style={{
                background: 'var(--color-ucw-bg)',
                borderLeft: '1px solid var(--color-ucw-border)',
            }}
        >
            <h3
                className="font-black text-lg mb-1"
                style={{
                    color: 'var(--color-ucw-dark)',
                    fontFamily: 'inherit',
                }}
            >
                Your Order
            </h3>

            <p
                className="mb-5 text-xs"
                style={{ color: 'var(--color-ucw-text-muted)' }}
            >
                Table 05 · Dine in
            </p>

            {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
                    <svg
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-ucw-border-dark)"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                    >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 1.99-1.77L23 6H6" />
                    </svg>

                    <p
                        style={{
                            fontSize: '13px',
                            color: 'var(--color-ucw-text-muted)',
                        }}
                    >
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
                                style={{
                                    background: 'var(--color-ucw-bg-warm)',
                                    border: '1px solid var(--color-ucw-border)',
                                }}
                            >
                                <div className="flex-1 min-w-0">
                                    <p
                                        className="font-semibold text-sm leading-tight truncate"
                                        style={{ color: 'var(--color-ucw-dark)' }}
                                    >
                                        {item.name}
                                    </p>

                                    <p
                                        className="text-xs mt-0.5"
                                        style={{ color: 'var(--color-ucw-text-muted)' }}
                                    >
                                        {formatIDR(item.price)} × {qty}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        onClick={() => onRemove(item.id)}
                                        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm transition-transform active:scale-90"
                                        style={{
                                            background: 'var(--color-ucw-border)',
                                            color: 'var(--color-ucw-dark)',
                                        }}
                                    >
                                        −
                                    </button>

                                    <span
                                        className="font-bold text-sm w-4 text-center"
                                        style={{ color: 'var(--color-ucw-dark)' }}
                                    >
                                        {qty}
                                    </span>

                                    <button
                                        onClick={() => onAdd(item.id)}
                                        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm text-white transition-transform active:scale-90"
                                        style={{ background: 'var(--color-ucw-dark)' }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        style={{
                            borderTop: '1px solid var(--color-ucw-border)',
                            paddingTop: '16px',
                        }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <span
                                className="text-sm"
                                style={{ color: 'var(--color-ucw-text-muted)' }}
                            >
                                Total
                            </span>

                            <span
                                className="font-bold text-base"
                                style={{ color: 'var(--color-ucw-dark)' }}
                            >
                                {formatIDR(cartTotal)}
                            </span>
                        </div>

                        <Link
                            href={route('customer.cart', { tableId })}
                            className="w-full flex items-center justify-center gap-2 rounded-[14px] font-bold text-sm text-white transition-all active:scale-[0.97]"
                            style={{
                                height: '48px',
                                backgroundColor: 'var(--color-ucw-dark)',
                                boxShadow: '0 6px 20px rgba(45,26,14,0.25)',
                            }}
                        >
                            Place Order

                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </>
            )}
        </aside>
    );
}