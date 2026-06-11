import { Link } from "@inertiajs/react";
import { formatIDR } from "@/lib/currency";
import { firstImageUrl, MENU_IMAGE_PLACEHOLDER, useFallbackImage } from "@/lib/images";
import type { CartItem } from "@/hooks/useCart";

interface EmptyCartProps {
    tableId: string;
    desktop?: boolean;
}

interface CartItemListProps {
    items: CartItem[];
    onAdjust: (id: string, delta: number) => void;
    onUpdateNotes: (id: string, notes: string) => void;
    desktop?: boolean;
}

interface CartSummaryCardProps {
    subtotal: number;
    total: number;
    className?: string;
    compact?: boolean;
}

interface CartActionsProps {
    tableId: string;
    className?: string;
}

export function CartEmptyState({ tableId, desktop = false }: EmptyCartProps) {
    return (
        <div className="flex flex-col items-center justify-center flex-1 px-8 text-center py-20">
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ backgroundColor: "var(--color-ucw-border)" }}
            >
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-ucw-text-muted)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 1.99-1.77L23 6H6" />
                </svg>
            </div>

            <h2
                className="font-bold mb-1.5"
                style={{
                    fontSize: desktop ? "22px" : "18px",
                    color: "var(--color-ucw-text)",
                }}
            >
                Your cart is empty
            </h2>

            <p
                className="text-sm mb-6"
                style={{ color: "var(--color-ucw-text-muted)" }}
            >
                Add something delicious from the menu.
            </p>

            <Link
                href={route("customer.menu")}
                className="px-6 h-11 rounded-xl text-sm font-semibold flex items-center text-white"
                style={{ backgroundColor: "var(--color-ucw-dark)" }}
            >
                Browse Menu
            </Link>
        </div>
    );
}

export function CartItemList({
    items,
    onAdjust,
    onUpdateNotes,
    desktop = false,
}: CartItemListProps) {
    return (
        <>
            {items.map((item, index) => (
                <div key={item.id}>
                    <CartItemRow
                        item={item}
                        onAdjust={onAdjust}
                        onUpdateNotes={onUpdateNotes}
                        desktop={desktop}
                    />

                    {index < items.length - 1 && (
                        <div
                            style={{
                                height: "1px",
                                backgroundColor: "var(--color-ucw-border)",
                            }}
                        />
                    )}
                </div>
            ))}
        </>
    );
}

export function MiniCartItemList({ items }: { items: CartItem[] }) {
    return (
        <>
            {items.map((item) => (
                <MiniCartItem key={item.id} item={item} />
            ))}
        </>
    );
}

export function CartSummaryCard({
    subtotal,
    total,
    className = "",
    compact = false,
}: CartSummaryCardProps) {
    return (
        <div className={className}>
            <div className="flex justify-between items-center mb-3">
                <span
                    className="font-semibold uppercase tracking-[0.12em]"
                    style={{ fontSize: "11px", color: "var(--color-ucw-text-muted)" }}
                >
                    SUBTOTAL
                </span>
                <span
                    className="font-semibold"
                    style={{ fontSize: "14px", color: "var(--color-ucw-text)" }}
                >
                    {formatIDR(subtotal)}
                </span>
            </div>

            <div style={{ height: "1px", backgroundColor: "var(--color-ucw-border)" }} />

            <div className="flex justify-between items-center mt-4">
                <span
                    className="font-black"
                    style={{
                        fontSize: compact ? "15px" : "17px",
                        color: "var(--color-ucw-text)",
                    }}
                >
                    Total
                </span>

                <span
                    className="font-black"
                    style={{
                        fontSize: compact ? "18px" : "22px",
                        color: "var(--color-ucw-dark)",
                    }}
                >
                    {formatIDR(total)}
                </span>
            </div>
        </div>
    );
}

export function AddMoreLink({ className = "" }: CartActionsProps) {
    return (
        <Link
            href={route("customer.menu")}
            className={`flex items-center justify-center gap-1.5 h-11 rounded-xl text-sm font-medium transition-opacity active:opacity-60 ${className}`}
            style={{
                border: "1.5px dashed var(--color-ucw-border-dark)",
                color: "var(--color-ucw-text-muted)",
            }}
        >
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            >
                <path d="M12 5v14M5 12h14" />
            </svg>
            Add more items
        </Link>
    );
}

export function CheckoutButton({ tableId: _tableId }: { tableId: string }) {
    return (
        <Link
            href={route("customer.order-type")}
            className="w-full flex items-center justify-between px-6 rounded-2xl font-bold transition-all active:scale-[0.98] text-white"
            style={{
                height: "56px",
                fontSize: "15px",
                backgroundColor: "var(--color-ucw-dark)",
                boxShadow: "0 4px 20px rgba(45,26,14,0.25)",
            }}
        >
            <span>Proceed to Checkout</span>

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
        </Link>
    );
}

function CartItemRow({
    item,
    onAdjust,
    onUpdateNotes,
    desktop = false,
}: {
    item: CartItem;
    onAdjust: (id: string, delta: number) => void;
    onUpdateNotes: (id: string, notes: string) => void;
    desktop?: boolean;
}) {
    const imageSrc = firstImageUrl(item.imageUrl);

    return (
        <div className={desktop ? "py-6" : "py-5"}>
            <div className="flex gap-4">
                <div
                    className="rounded-2xl overflow-hidden shrink-0"
                    style={{
                        width: desktop ? "124px" : "110px",
                        height: desktop ? "112px" : "100px",
                        backgroundColor: "var(--color-ucw-border)",
                    }}
                >
                    <img
                        src={imageSrc || MENU_IMAGE_PLACEHOLDER}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={useFallbackImage}
                    />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                        <div className="flex items-start justify-between gap-2">
                            <h3
                                className="font-bold leading-tight flex-1"
                                style={{
                                    fontSize: desktop ? "16px" : "15px",
                                    color: "var(--color-ucw-text)",
                                }}
                            >
                                {item.name}
                            </h3>

                            <span
                                className="font-bold shrink-0"
                                style={{
                                    fontSize: "15px",
                                    color: "var(--color-ucw-dark)",
                                }}
                            >
                                {formatIDR(item.price)}
                            </span>
                        </div>

                        <p
                            className="mt-1 leading-snug"
                            style={{
                                fontSize: "12px",
                                color: "var(--color-ucw-text-muted)",
                            }}
                        >
                            {item.subtitle}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                        <button
                            onClick={() => onAdjust(item.id, -1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-transform active:scale-90"
                            style={{
                                backgroundColor: "var(--color-ucw-border)",
                                color: "var(--color-ucw-dark)",
                            }}
                        >
                            -
                        </button>

                        <span
                            className="w-5 text-center font-bold"
                            style={{
                                fontSize: "15px",
                                color: "var(--color-ucw-text)",
                            }}
                        >
                            {item.quantity}
                        </span>

                        <button
                            onClick={() => onAdjust(item.id, 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-transform active:scale-90 text-white"
                            style={{ backgroundColor: "var(--color-ucw-dark)" }}
                        >
                            +
                        </button>

                        <button
                            onClick={() => onAdjust(item.id, -item.quantity)}
                            className="ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-opacity active:opacity-50"
                            style={{ color: "var(--color-ucw-text-muted)" }}
                        >
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14H6L5 6" />
                                <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <input
                type="text"
                placeholder="Add special notes (e.g. Extra hot, oat milk...)"
                value={item.notes ?? ""}
                onChange={(event) => onUpdateNotes(item.id, event.target.value)}
                className="w-full mt-3 px-4 h-10 rounded-xl text-xs outline-none"
                style={{
                    backgroundColor: "var(--color-ucw-bg-warm)",
                    border: "1px solid var(--color-ucw-border)",
                    color: "var(--color-ucw-text)",
                }}
            />
        </div>
    );
}

function MiniCartItem({ item }: { item: CartItem }) {
    const imageSrc = firstImageUrl(item.imageUrl);

    return (
        <div className="flex items-center gap-3">
            <div
                className="w-12 h-12 rounded-xl overflow-hidden shrink-0"
                style={{ backgroundColor: "var(--color-ucw-border)" }}
            >
                <img
                    src={imageSrc || MENU_IMAGE_PLACEHOLDER}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={useFallbackImage}
                />
            </div>

            <div className="flex-1 min-w-0">
                <p
                    className="font-semibold text-sm leading-tight truncate"
                    style={{ color: "var(--color-ucw-dark)" }}
                >
                    {item.name}
                </p>

                <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--color-ucw-text-muted)" }}
                >
                    {formatIDR(item.price)} x {item.quantity}
                </p>
            </div>

            <span
                className="font-bold text-sm shrink-0"
                style={{ color: "var(--color-ucw-dark)" }}
            >
                {formatIDR(item.price * item.quantity)}
            </span>
        </div>
    );
}
