import { Link } from '@inertiajs/react';
import { formatIDR } from '@/lib/currency';

interface Props {
    tableId: string;
    cartCount: number;
    cartTotal: number;
}

export default function FloatingCartButton({
    tableId,
    cartCount,
    cartTotal,
}: Props) {
    if (cartCount <= 0) return null;

    return (
        <div className="fixed bottom-[78px] left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 z-40">
            <Link
                href={route('customer.cart')}
                className="w-full flex items-center justify-between px-5 rounded-2xl text-white transition-all active:scale-[0.98]"
                style={{
                    height: '56px',
                    backgroundColor: 'var(--color-ucw-dark)',
                    boxShadow: '0 8px 24px rgba(45,26,14,0.28)',
                }}
            >
                <div className="flex flex-col">
                    <span className="font-bold" style={{ fontSize: '14px' }}>
                        View Cart
                    </span>

                    <span style={{ fontSize: '11px', opacity: 0.75 }}>
                        {cartCount} item{cartCount > 1 ? 's' : ''}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="font-bold" style={{ fontSize: '15px' }}>
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
    );
}
