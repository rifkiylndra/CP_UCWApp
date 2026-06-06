import { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import CustomerLayout from "@/Components/Layout/CustomerLayout";
import TopBar from "@/Components/customer/navigation/TopBar";
import CustomerDesktopHeader from "@/Components/customer/common/CustomerDesktopHeader";
import CheckoutSteps from "@/Components/customer/common/CheckoutSteps";
import { formatIDR } from "@/lib/currency";
import { useCart } from "@/hooks/useCart";

interface Props {
    tableId: string;
    tableNumber?: string;
}

const PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23E8E2DB'/%3E%3C/svg%3E";

export default function Estimate({
    tableId,
    tableNumber: initialTableNumber = "",
}: Props) {
    const {
        items,
        subtotal,
        total,
        totalItems,
        customerName,
        orderType,
        tableNumber,
    } = useCart();
    
    const [estimatedMinMin, setEstimatedMinMin] = useState<number>(10);
    const [estimatedMinMax, setEstimatedMinMax] = useState<number>(15);
    const [isLoadingEstimate, setIsLoadingEstimate] = useState(true);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const displayTableNumber = tableNumber || initialTableNumber;

    const handleCreateOrder = async () => {
        if (isCreatingOrder) return;
        setIsCreatingOrder(true);
        setErrorMessage("");

        try {
            const payload = {
                table_number: orderType === "dine_in" ? tableNumber.trim() : null,
                customer_name: customerName.trim() || null,
                order_type: orderType || 'dine_in',
                items: items.map(i => ({
                    menu_id: Number(i.menuId || i.id),
                    quantity: i.quantity,
                    note: i.notes?.trim() || null
                }))
            };
            
            const res = await axios.post('/customer/order', payload);
            if (res.data.success && res.data.redirect_url) {
                sessionStorage.setItem(`ucw-order-${res.data.order_id}`, JSON.stringify(res.data));
                window.location.href = res.data.redirect_url;
            } else {
                setErrorMessage(res.data.message || "Order could not be created.");
                setIsCreatingOrder(false);
            }
        } catch (error) {
            console.error("Order error", error);
            if (axios.isAxiosError(error)) {
                const errors = error.response?.data?.errors;
                const firstError = errors ? Object.values(errors).flat()[0] : null;
                setErrorMessage(
                    String(firstError || error.response?.data?.message || "Order could not be created. Please check your details.")
                );
            } else {
                setErrorMessage("Order could not be created. Please try again.");
            }
            setIsCreatingOrder(false);
        }
    };

    useEffect(() => {
        if (items.length === 0) return;
        
        axios.post('/customer/api/estimate', {
            items: items.map(i => ({ menu_id: Number(i.menuId || i.id), quantity: i.quantity }))
        })
        .then(res => {
            if (res.data) {
                setEstimatedMinMin(res.data.estimated_min_time || 10);
                setEstimatedMinMax(res.data.estimated_max_time || 15);
            }
        })
        .catch(err => console.error("Failed to fetch estimate", err))
        .finally(() => setIsLoadingEstimate(false));
    }, [items]);

    return (
        <>
            <Head title="Order Confirmation — UCW" />

            <CustomerLayout hideTopBar>
                {/* MOBILE */}
                <div
                    className="md:hidden min-h-svh flex flex-col"
                    style={{ backgroundColor: "var(--color-ucw-bg)" }}
                >
                    <TopBar
                        tableId={tableId}
                        title="Confirm Order"
                        subtitle={`${orderType === "takeaway" ? "Takeaway" : displayTableNumber ? `Table ${displayTableNumber}` : "Dine In"} • ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
                        showBack
                        backHref={route("customer.order-type")}
                    />

                    <div className="flex flex-col flex-1 px-5 pb-36">
                        <div className="pt-4 pb-6">
                            <CheckoutSteps activeStep={3} />
                            <PageHeading />
                        </div>

                        <EstimationCard
                            minMin={estimatedMinMin}
                            minMax={estimatedMinMax}
                            isLoading={isLoadingEstimate}
                        />

                        <SelectionList
                            items={items}
                            className="mt-6"
                        />

                        <PriceSummary
                            subtotal={subtotal}
                            total={total}
                            className="mt-6"
                        />
                    </div>

                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                        style={{
                            background:
                                "linear-gradient(to top, var(--color-ucw-bg) 65%, transparent)",
                        }}
                    >
                        {errorMessage && <OrderError message={errorMessage} />}
                        <PaymentButton onClick={handleCreateOrder} isLoading={isCreatingOrder} />
                        <TrustNote />
                    </div>
                </div>

                {/* DESKTOP */}
                <div
                    className="hidden md:flex h-svh max-h-svh overflow-hidden"
                    style={{ backgroundColor: "#E8E1D8" }}
                >
                    <main className="flex-1 overflow-y-auto flex flex-col">
                        <CustomerDesktopHeader
                            tableId={tableId}
                            title="Confirm Order"
                            subtitle={`${orderType === "takeaway" ? "Takeaway" : displayTableNumber ? `Table ${displayTableNumber}` : "Dine In"} • Review estimate`}
                            backHref={route("customer.order-type")}
                            active="cart"
                        />

                        <div className="flex-1 max-w-4xl mx-auto w-full px-8 lg:px-10 py-8">
                            <CheckoutSteps activeStep={3} />

                            <div className="mt-8">
                                <PageHeading desktop />
                            </div>

                            <div className="mt-7 max-w-xl">
                                <EstimationCard
                                    minMin={estimatedMinMin}
                                    minMax={estimatedMinMax}
                                    isLoading={isLoadingEstimate}
                                    desktop
                                />

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
                                        The estimate is calculated from the
                                        current queue, selected menu items, and
                                        preparation complexity. You can still
                                        edit your basket before payment.
                                    </p>

                                    <Link
                                        href={route("customer.cart")}
                                        className="inline-flex items-center mt-4 text-sm font-semibold transition-opacity active:opacity-60"
                                        style={{
                                            color: "var(--color-ucw-dark)",
                                        }}
                                    >
                                        Edit basket →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </main>

                    <aside
                        className="w-[360px] shrink-0 sticky top-0 h-svh overflow-y-auto flex flex-col"
                        style={{
                            background: "var(--color-ucw-bg)",
                            borderLeft: "1px solid var(--color-ucw-border)",
                        }}
                    >
                        <div
                            className="px-8 pt-8 pb-5"
                            style={{
                                borderBottom:
                                    "1px solid var(--color-ucw-border)",
                            }}
                        >
                            <h2
                                className="font-black text-xl mb-0.5"
                                style={{ color: "var(--color-ucw-dark)" }}
                            >
                                Payment Summary
                            </h2>

                            <p
                                className="text-xs leading-relaxed"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                Ready in {estimatedMinMin}–{estimatedMinMax}{" "}
                                minutes. Review your total before payment.
                            </p>
                        </div>

                        <div className="flex-1 px-8 py-6">
                            <MiniItemList items={items} />
                        </div>

                        <div
                            className="px-8 pb-8"
                            style={{
                                borderTop: "1px solid var(--color-ucw-border)",
                                paddingTop: "20px",
                            }}
                        >
                            <PriceSummary
                                subtotal={subtotal}
                                total={total}
                                compact
                            />

                            <div className="mt-6">
                                <PaymentButton onClick={handleCreateOrder} isLoading={isCreatingOrder} />
                                {errorMessage && <OrderError message={errorMessage} />}
                                <TrustNote />
                            </div>

                            <Link
                                href={route("customer.cart")}
                                className="w-full flex items-center justify-center mt-3 h-10 text-sm font-medium"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                ← Edit basket
                            </Link>
                        </div>
                    </aside>
                </div>
            </CustomerLayout>
        </>
    );
}

function PageHeading({ desktop = false }: { desktop?: boolean }) {
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

function EstimationCard({
    minMin,
    minMax,
    isLoading = false,
    desktop = false,
}: {
    minMin: number;
    minMax: number;
    isLoading?: boolean;
    desktop?: boolean;
}) {
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
                            {minMin}–{minMax}
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

function SelectionList({
    items,
    className = "",
    desktop = false,
}: {
    items: any[];
    className?: string;
    desktop?: boolean;
}) {
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

function OrderSelectionItem({ item }: { item: any }) {
    return (
        <div className="flex items-center gap-3">
            <div
                className="w-14 h-14 rounded-xl overflow-hidden shrink-0"
                style={{ backgroundColor: "var(--color-ucw-border)" }}
            >
                <img
                    src={item.imageUrl || PLACEHOLDER}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = PLACEHOLDER;
                    }}
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
                    {item.quantity}× • {item.subtitle}
                </p>
            </div>
        </div>
    );
}

function MiniItemList({ items }: { items: any[] }) {
    return (
        <div className="flex flex-col gap-4">
            {items.map((item) => (
                <OrderSelectionItem key={item.id} item={item} />
            ))}
        </div>
    );
}

function PriceSummary({
    subtotal,
    total,
    className = "",
    compact = false,
}: {
    subtotal: number;
    total: number;
    className?: string;
    compact?: boolean;
}) {
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

function PaymentButton({ onClick, isLoading }: { onClick: () => void; isLoading: boolean }) {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl font-bold transition-all active:scale-[0.98] text-white"
            style={{
                height: "54px",
                fontSize: "15px",
                backgroundColor: isLoading ? "var(--color-ucw-border)" : "var(--color-ucw-dark)",
                color: isLoading ? "var(--color-ucw-text-muted)" : "white",
                boxShadow: isLoading ? "none" : "0 4px 20px rgba(45,26,14,0.25)",
                cursor: isLoading ? "not-allowed" : "pointer"
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

function OrderError({ message }: { message: string }) {
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

function TrustNote() {
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
