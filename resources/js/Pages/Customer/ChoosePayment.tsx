import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import CustomerLayout from "@/Components/Layout/CustomerLayout";
import TopBar from "@/Components/customer/navigation/TopBar";
import CustomerDesktopHeader from "@/Components/customer/common/CustomerDesktopHeader";
import CheckoutSteps from "@/Components/customer/common/CheckoutSteps";
import { formatIDR } from "@/lib/currency";
import { useCart } from "@/hooks/useCart";

interface Props {
    tableId: string;
    tableNumber?: string;
    total?: number;
    orderId?: number;
}

type PaymentGroup = "online" | "cash" | null;

export default function ChoosePayment({
    tableId,
    tableNumber = "05",
    total = 145000,
    orderId,
}: Props) {
    const [selected, setSelected] = useState<PaymentGroup>(null);
    const { clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);

    // Initialize Snap script
    React.useEffect(() => {
        const script = document.createElement('script');
        // Sandbox environment URL (update to production if needed)
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute('data-client-key', "SB-Mid-client-XXXXX"); // Placeholder
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    async function handleConfirm() {
        if (!selected || !orderId) return;

        if (selected === "cash") {
            // Clear cart upon choosing payment since order is saved and payment method is selected
            clearCart();
            router.visit(route("customer.payment.cash", { tableId, orderId }));
            return;
        }

        if (selected === "online") {
            setIsProcessing(true);
            try {
                // Fetch snap token from backend
                const res = await window.axios.post(`/customer/order/${orderId}/payment/process`, {
                    payment_method: "midtrans"
                });

                if (res.data.token) {
                    clearCart();
                    // Open Snap window
                    (window as any).snap.pay(res.data.token, {
                        onSuccess: function (result: any) {
                            router.visit(route("customer.status", { order: orderId }));
                        },
                        onPending: function (result: any) {
                            router.visit(route("customer.status", { order: orderId }));
                        },
                        onError: function (result: any) {
                            setIsProcessing(false);
                            alert("Payment failed!");
                        },
                        onClose: function () {
                            setIsProcessing(false);
                        }
                    });
                } else {
                    // Fallback to manual online payment if Midtrans token isn't generated
                    clearCart();
                    router.visit(route("customer.payment.online", { tableId, orderId }));
                }
            } catch (e) {
                console.error("Failed to process payment", e);
                // Fallback on error
                clearCart();
                router.visit(route("customer.payment.online", { tableId, orderId }));
            }
        }
    }

    return (
        <>
            <Head title="Choose Payment — UCW" />

            <CustomerLayout hideTopBar>
                {/* MOBILE */}
                <div
                    className="md:hidden min-h-svh flex flex-col"
                    style={{ backgroundColor: "var(--color-ucw-bg)" }}
                >
                    <TopBar
                        tableId={tableId}
                        title="Choose Payment"
                        subtitle={`Table ${tableNumber} • ${formatIDR(total)}`}
                        showBack
                        backHref={route("customer.estimate", { tableId })}
                    />

                    <div className="flex flex-col flex-1 px-5 pb-36">
                        <div className="pt-4 pb-6">
                            <CheckoutSteps activeStep={3} />
                            <PageHeading />
                        </div>

                        <div className="flex flex-col gap-3 mb-6">
                            <PaymentMethodCard
                                type="online"
                                selected={selected === "online"}
                                onSelect={() => setSelected("online")}
                            />

                            <PaymentMethodCard
                                type="cash"
                                selected={selected === "cash"}
                                onSelect={() => setSelected("cash")}
                            />
                        </div>

                        <TotalCard total={total} />
                        <TrustBlurb className="mt-4" />
                    </div>

                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                        style={{
                            background:
                                "linear-gradient(to top, var(--color-ucw-bg) 65%, transparent)",
                        }}
                    >
                        <ConfirmButton
                            selected={selected}
                            onConfirm={handleConfirm}
                            isLoading={isProcessing}
                        />
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
                            title="Choose Payment"
                            subtitle={`Table ${tableNumber} • Select payment method`}
                            backHref={route("customer.estimate", { tableId })}
                            active="cart"
                        />

                        <div className="flex-1 max-w-4xl mx-auto w-full px-8 lg:px-10 py-8">
                            <CheckoutSteps activeStep={3} />

                            <div className="mt-8">
                                <PageHeading desktop />
                            </div>

                            <div className="grid grid-cols-2 gap-5 mt-7">
                                <PaymentMethodCard
                                    type="online"
                                    selected={selected === "online"}
                                    onSelect={() => setSelected("online")}
                                    desktop
                                />

                                <PaymentMethodCard
                                    type="cash"
                                    selected={selected === "cash"}
                                    onSelect={() => setSelected("cash")}
                                    desktop
                                />
                            </div>

                            <TrustBlurb className="mt-6 max-w-2xl" />
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
                                borderBottom: "1px solid var(--color-ucw-border)",
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
                                Choose how you want to complete your payment.
                            </p>
                        </div>

                        <div className="flex-1 px-8 py-6 flex flex-col gap-5">
                            <SelectedPaymentSummary selected={selected} />
                            <TotalCard total={total} compact />
                        </div>

                        <div className="px-8 pb-8">
                            <ConfirmButton
                                selected={selected}
                                onConfirm={handleConfirm}
                                isLoading={isProcessing}
                            />

                            <Link
                                href={route("customer.estimate", { tableId })}
                                className="w-full flex items-center justify-center mt-3 h-10 text-sm font-medium"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                ← Review order
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
        <div>
            <p
                className="font-semibold uppercase tracking-[0.15em] mb-2"
                style={{
                    fontSize: "10px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                PAYMENT METHOD
            </p>

            <h1
                className="font-black leading-[1.08] tracking-tight mb-3"
                style={{
                    fontSize: desktop ? "36px" : "31px",
                    color: "var(--color-ucw-dark)",
                }}
            >
                Choose how you'd
                <br />
                like to pay.
            </h1>

            <p
                className="leading-relaxed max-w-[460px]"
                style={{
                    fontSize: desktop ? "14px" : "13px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                Select a payment method to continue your order.
            </p>
        </div>
    );
}

function PaymentMethodCard({
    type,
    selected,
    onSelect,
    desktop = false,
}: {
    type: "online" | "cash";
    selected: boolean;
    onSelect: () => void;
    desktop?: boolean;
}) {
    const isOnline = type === "online";

    return (
        <button
            onClick={onSelect}
            className="w-full rounded-3xl p-5 text-left transition-all duration-200"
            style={{
                backgroundColor: "white",
                border: `1.5px solid ${
                    selected ? "var(--color-ucw-dark)" : "var(--color-ucw-border)"
                }`,
                boxShadow: selected ? "0 14px 35px rgba(45,26,14,0.10)" : "none",
                minHeight: desktop ? "260px" : "auto",
            }}
        >
            <div className="flex items-start justify-between mb-4">
                <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                        backgroundColor: selected
                            ? "var(--color-ucw-dark)"
                            : "var(--color-ucw-bg-warm)",
                    }}
                >
                    {isOnline ? <OnlineIcon active={selected} /> : <CashIcon active={selected} />}
                </div>

                {selected && <SelectedPill />}
            </div>

            <h3
                className="font-black mb-1"
                style={{ fontSize: "20px", color: "var(--color-ucw-dark)" }}
            >
                {isOnline ? "Online Payment" : "Cash at Cashier"}
            </h3>

            <p
                className="mb-4 leading-relaxed"
                style={{
                    fontSize: "13px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                {isOnline
                    ? "Pay using QRIS, e-wallet, or virtual account."
                    : "Pay directly at the cashier after confirming your order."}
            </p>

            {isOnline ? <OnlineMethodIcons /> : <CashMethodInfo />}

            <div className="flex items-center gap-1.5 mt-5">
                <span
                    className="font-bold uppercase tracking-[0.1em]"
                    style={{
                        fontSize: "11px",
                        color: selected
                            ? "var(--color-ucw-dark)"
                            : "var(--color-ucw-text-muted)",
                    }}
                >
                    {isOnline ? "Secure payment" : "Pay on-site"}
                </span>

                <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={
                        selected
                            ? "var(--color-ucw-dark)"
                            : "var(--color-ucw-text-muted)"
                    }
                    strokeWidth="2.5"
                    strokeLinecap="round"
                >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </div>
        </button>
    );
}

function SelectedPaymentSummary({ selected }: { selected: PaymentGroup }) {
    return (
        <div>
            <p
                className="text-xs font-semibold uppercase tracking-[0.12em] mb-3"
                style={{ color: "var(--color-ucw-text-muted)" }}
            >
                Payment method
            </p>

            {selected ? (
                <div
                    className="flex items-center gap-3 p-4 rounded-2xl"
                    style={{
                        background: "var(--color-ucw-bg-warm)",
                        border: "1px solid var(--color-ucw-border)",
                    }}
                >
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: "var(--color-ucw-dark)" }}
                    >
                        {selected === "online" ? (
                            <OnlineIcon active small />
                        ) : (
                            <CashIcon active small />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p
                            className="font-bold text-sm"
                            style={{ color: "var(--color-ucw-dark)" }}
                        >
                            {selected === "online"
                                ? "Online Payment"
                                : "Cash at Cashier"}
                        </p>

                        <p
                            className="text-xs mt-0.5 truncate"
                            style={{ color: "var(--color-ucw-text-muted)" }}
                        >
                            {selected === "online"
                                ? "QRIS / E-Wallet / Transfer"
                                : "Pay on-site"}
                        </p>
                    </div>

                    <span
                        className="text-[9px] font-bold px-2.5 py-1 rounded-full text-white shrink-0"
                        style={{ backgroundColor: "var(--color-ucw-dark)" }}
                    >
                        SELECTED
                    </span>
                </div>
            ) : (
                <div
                    className="p-4 rounded-2xl"
                    style={{
                        background: "var(--color-ucw-border)",
                        border: "1px dashed var(--color-ucw-border-dark)",
                    }}
                >
                    <p
                        className="text-sm"
                        style={{ color: "var(--color-ucw-text-muted)" }}
                    >
                        No method selected yet
                    </p>
                </div>
            )}
        </div>
    );
}

function TotalCard({
    total,
    compact = false,
}: {
    total: number;
    compact?: boolean;
}) {
    return (
        <div
            className="rounded-2xl p-5"
            style={{
                backgroundColor: "white",
                border: "1px solid var(--color-ucw-border)",
            }}
        >
            <p
                className="font-semibold uppercase tracking-[0.12em] mb-1"
                style={{
                    fontSize: "10px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                TOTAL PAYMENT
            </p>

            <p
                className="font-black leading-tight"
                style={{
                    fontSize: compact ? "24px" : "30px",
                    color: "var(--color-ucw-dark)",
                }}
            >
                {formatIDR(total)}
            </p>

            <p
                className="mt-1"
                style={{ fontSize: "11px", color: "var(--color-ucw-text-muted)" }}
            >
                Includes taxes and service fee.
            </p>
        </div>
    );
}

function TrustBlurb({ className = "" }: { className?: string }) {
    return (
        <div className={`flex gap-3 items-start px-1 ${className}`}>
            <svg
                className="shrink-0 mt-0.5"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-ucw-text-muted)"
                strokeWidth="1.8"
                strokeLinecap="round"
            >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>

            <p
                className="leading-relaxed"
                style={{
                    fontSize: "12px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                Guest checkout is available. You do not need an account to continue
                your order.
            </p>
        </div>
    );
}

function ConfirmButton({
    selected,
    onConfirm,
    isLoading = false
}: {
    selected: PaymentGroup;
    onConfirm: () => void;
    isLoading?: boolean;
}) {
    return (
        <button
            onClick={onConfirm}
            disabled={!selected || isLoading}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl font-bold transition-all active:scale-[0.98]"
            style={{
                height: "54px",
                fontSize: "15px",
                backgroundColor: isLoading || !selected
                    ? "var(--color-ucw-border)"
                    : "var(--color-ucw-dark)",
                color: isLoading || !selected ? "var(--color-ucw-text-muted)" : "white",
                boxShadow: selected && !isLoading ? "0 4px 20px rgba(45,26,14,0.25)" : "none",
                cursor: selected && !isLoading ? "pointer" : "not-allowed",
            }}
        >
            {isLoading ? "Processing..." : (
                selected === "online"
                    ? "Continue to Online Payment"
                    : selected === "cash"
                    ? "Continue with Cash"
                    : "Select Payment Method"
            )}

            {!isLoading && (
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            )}
        </button>
    );
}

function SelectedPill() {
    return (
        <span
            className="px-3 py-1 rounded-full font-bold tracking-wider text-white"
            style={{
                fontSize: "9px",
                backgroundColor: "var(--color-ucw-dark)",
            }}
        >
            SELECTED
        </span>
    );
}

function OnlineIcon({
    active,
    small = false,
}: {
    active: boolean;
    small?: boolean;
}) {
    return (
        <svg
            width={small ? "16" : "22"}
            height={small ? "16" : "22"}
            viewBox="0 0 24 24"
            fill="none"
            stroke={active ? "white" : "var(--color-ucw-dark)"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M16 12h.01" strokeWidth="2.5" />
            <path d="M2 10h20" />
        </svg>
    );
}

function CashIcon({
    active,
    small = false,
}: {
    active: boolean;
    small?: boolean;
}) {
    return (
        <svg
            width={small ? "16" : "22"}
            height={small ? "16" : "22"}
            viewBox="0 0 24 24"
            fill="none"
            stroke={active ? "white" : "var(--color-ucw-dark)"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <circle cx="12" cy="12" r="3" />
            <path d="M6 12h.01M18 12h.01" strokeWidth="2.5" />
        </svg>
    );
}

function OnlineMethodIcons() {
    return (
        <div className="flex items-center gap-2">
            {["QRIS", "VA", "E-Wallet"].map((label) => (
                <div
                    key={label}
                    className="h-8 px-2.5 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "var(--color-ucw-bg-warm)" }}
                >
                    <span
                        className="font-bold"
                        style={{
                            fontSize: "9px",
                            color: "var(--color-ucw-dark)",
                        }}
                    >
                        {label}
                    </span>
                </div>
            ))}
        </div>
    );
}

function CashMethodInfo() {
    return (
        <div
            className="rounded-xl px-4 py-3"
            style={{ backgroundColor: "var(--color-ucw-bg-warm)" }}
        >
            <p
                style={{
                    fontSize: "12px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                Please prepare exact cash or pay at the cashier counter.
            </p>
        </div>
    );
}