import { Link } from "@inertiajs/react";
import { formatIDR } from "@/lib/currency";
import { firstImageUrl, MENU_IMAGE_PLACEHOLDER, useFallbackImage } from "@/lib/images";
import type { CartItem } from "@/hooks/useCart";

interface EstimateHeaderProps {
    desktop?: boolean;
}

interface EstimateResultCardProps {
    minMin: number;
    minMax: number;
    isLoading?: boolean;
    desktop?: boolean;
}

interface EstimateOrderSummaryProps {
    items: CartItem[];
    className?: string;
    desktop?: boolean;
}

interface EstimatePriceSummaryProps {
    subtotal: number;
    total: number;
    className?: string;
    compact?: boolean;
}

export function EstimateHeader({ desktop = false }: EstimateHeaderProps) {
    return (
        <div className={desktop ? "" : "mt-6"}>
            <p
                className="font-semibold uppercase tracking-[0.15em] mb-2"
                style={{
                    fontSize: "10px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                ORDER CONFIRMATION
            </p>

            <h1
                className="font-black leading-[1.1] tracking-tight"
                style={{
                    fontSize: desktop ? "36px" : "31px",
                    color: "var(--color-ucw-dark)",
                }}
            >
                Review your
                <br />
                morning ritual.
            </h1>

            <p
                className="mt-3 leading-relaxed max-w-[460px]"
                style={{
                    fontSize: desktop ? "14px" : "13px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                We use the current queue and order complexity to estimate when
                your drinks will be ready.
            </p>
        </div>
    );
}

export function EstimateResultCard({
    minMin,
    minMax,
    isLoading = false,
    desktop = false,
}: EstimateResultCardProps) {
    return (
        <div
            className="rounded-3xl p-5 flex flex-col"
            style={{
                backgroundColor: "var(--color-ucw-dark)",
                minHeight: desktop ? "100%" : "auto",
            }}
        >
            <div className="flex items-center gap-2 mb-4">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>

                <span
                    className="font-semibold uppercase tracking-[0.14em]"
                    style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)" }}
                >
                    LIVE AI ESTIMATION
                </span>
            </div>

            <p
                className="mb-1"
                style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}
            >
                Estimated Serve Time
            </p>

            <div className="flex items-baseline gap-2 mb-5 h-[64px]">
                {isLoading ? (
                    <div className="w-24 h-12 bg-white/20 rounded-xl animate-pulse" />
                ) : (
                    <>
                        <span
                            className="font-black leading-none"
                            style={{
                                fontSize: desktop ? "64px" : "52px",
                                color: "white",
                            }}
                        >
                            {minMin}-{minMax}
                        </span>

                        <span
                            className="font-semibold"
                            style={{
                                fontSize: "20px",
                                color: "rgba(255,255,255,0.55)",
                            }}
                        >
                            min
                        </span>
                    </>
                )}
            </div>

            <div className="flex-1" />

            <div
                className="rounded-2xl p-4"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            >
                <div className="flex gap-2.5">
                    <svg
                        className="shrink-0 mt-0.5"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(255,255,255,0.45)"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>

                    <p
                        className="leading-relaxed"
                        style={{
                            fontSize: "12px",
                            color: "rgba(255,255,255,0.45)",
                        }}
                    >
                        Calculated based on the current kitchen queue and your
                        order complexity.
                    </p>
                </div>
            </div>
        </div>
    );
}

export function EstimateInfoCard() {
    return (
        <div
            className="mt-6 rounded-3xl p-5"
            style={{
                backgroundColor: "var(--color-ucw-bg)",
                border: "1px solid var(--color-ucw-border)",
            }}
        >
            <h2
                className="font-black mb-2"
                style={{
                    fontSize: "18px",
                    color: "var(--color-ucw-dark)",
                }}
            >
                Your order is almost ready to confirm
            </h2>

            <p
                className="leading-relaxed"
                style={{
                    fontSize: "13px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                The estimate is calculated from the current queue, selected menu
                items, and preparation complexity. You can still edit your basket
                before payment.
            </p>

            <Link
                href={route("customer.cart")}
                className="inline-flex items-center mt-4 text-sm font-semibold transition-opacity active:opacity-60"
                style={{
                    color: "var(--color-ucw-dark)",
                }}
            >
                {"Edit basket ->"}
            </Link>
        </div>
    );
}

export function EstimateOrderSummary({
    items,
    className = "",
    desktop = false,
}: EstimateOrderSummaryProps) {
    return (
        <div
            className={`rounded-3xl ${desktop ? "p-5" : ""} ${className}`}
            style={
                desktop
                    ? {
                          backgroundColor: "var(--color-ucw-bg)",
                          border: "1px solid var(--color-ucw-border)",
                      }
                    : {}
            }
        >
            <div className="flex items-center justify-between mb-4">
                <h2
                    className="font-bold"
                    style={{ fontSize: "16px", color: "var(--color-ucw-dark)" }}
                >
                    Your Selection
                </h2>

                <Link
                    href={route("customer.cart")}
                    className="font-semibold transition-opacity active:opacity-60"
                    style={{
                        fontSize: "13px",
                        color: "var(--color-ucw-text-muted)",
                    }}
                >
                    Edit Basket
                </Link>
            </div>

            <div className="flex flex-col gap-4">
                {items.map((item) => (
                    <OrderSelectionItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}

export function MiniEstimateItemList({ items }: { items: CartItem[] }) {
    return (
        <div className="flex flex-col gap-4">
            {items.map((item) => (
                <OrderSelectionItem key={item.id} item={item} />
            ))}
        </div>
    );
}

export function EstimatePriceSummary({
    subtotal,
    total,
    className = "",
    compact = false,
}: EstimatePriceSummaryProps) {
    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-3">
                <span
                    className="font-semibold uppercase tracking-[0.12em]"
                    style={{
                        fontSize: "11px",
                        color: "var(--color-ucw-text-muted)",
                    }}
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

            <div
                style={{
                    height: "1px",
                    backgroundColor: "var(--color-ucw-border)",
                    marginBottom: "16px",
                }}
            />

            <div className="flex items-center justify-between">
                <span
                    className="font-black"
                    style={{
                        fontSize: compact ? "15px" : "18px",
                        color: "var(--color-ucw-text)",
                    }}
                >
                    Total
                </span>

                <span
                    className="font-black"
                    style={{
                        fontSize: compact ? "18px" : "24px",
                        color: "var(--color-ucw-dark)",
                    }}
                >
                    {formatIDR(total)}
                </span>
            </div>
        </div>
    );
}

export function EstimatePaymentButton({
    onClick,
    isLoading,
}: {
    onClick: () => void;
    isLoading: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl font-bold transition-all active:scale-[0.98] text-white"
            style={{
                height: "54px",
                fontSize: "15px",
                backgroundColor: isLoading
                    ? "var(--color-ucw-border)"
                    : "var(--color-ucw-dark)",
                color: isLoading ? "var(--color-ucw-text-muted)" : "white",
                boxShadow: isLoading
                    ? "none"
                    : "0 4px 20px rgba(45,26,14,0.25)",
                cursor: isLoading ? "not-allowed" : "pointer",
            }}
        >
            {isLoading ? "Processing..." : "Continue to Payment"}
            {!isLoading && (
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            )}
        </button>
    );
}

export function EstimateOrderError({ message }: { message: string }) {
    return (
        <div
            className="rounded-2xl px-4 py-3 mb-3"
            style={{
                backgroundColor: "var(--color-ucw-amber-bg)",
                border: "1px solid var(--color-ucw-amber)",
            }}
        >
            <p
                className="font-semibold"
                style={{ fontSize: "12px", color: "#92620A" }}
            >
                {message}
            </p>
        </div>
    );
}

export function EstimateTrustNote() {
    return (
        <p
            className="text-center mt-2.5 uppercase tracking-[0.14em]"
            style={{
                fontSize: "9px",
                color: "var(--color-ucw-text-muted)",
            }}
        >
            SECURE CHECKOUT BY UCW
        </p>
    );
}

function OrderSelectionItem({ item }: { item: CartItem }) {
    const imageSrc = firstImageUrl(item.imageUrl);

    return (
        <div className="flex items-center gap-3">
            <div
                className="w-14 h-14 rounded-xl overflow-hidden shrink-0"
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
                <div className="flex items-start justify-between gap-2">
                    <h3
                        className="font-bold leading-tight"
                        style={{
                            fontSize: "14px",
                            color: "var(--color-ucw-text)",
                        }}
                    >
                        {item.name}
                    </h3>

                    <span
                        className="font-bold shrink-0"
                        style={{
                            fontSize: "14px",
                            color: "var(--color-ucw-dark)",
                        }}
                    >
                        {formatIDR(item.price * item.quantity)}
                    </span>
                </div>

                <p
                    className="mt-0.5 uppercase tracking-wider"
                    style={{
                        fontSize: "10px",
                        color: "var(--color-ucw-text-muted)",
                    }}
                >
                    {item.quantity}x - {item.subtitle}
                </p>
            </div>
        </div>
    );
}
