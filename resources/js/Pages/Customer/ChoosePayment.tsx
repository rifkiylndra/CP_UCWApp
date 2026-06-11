import React, { useState } from "react";
import axios from "axios";
import { Head, Link, router } from "@inertiajs/react";
import CustomerLayout from "@/Components/Layout/CustomerLayout";
import TopBar from "@/Components/customer/navigation/TopBar";
import CustomerDesktopHeader from "@/Components/customer/common/CustomerDesktopHeader";
import CheckoutSteps from "@/Components/customer/common/CheckoutSteps";
import {
    ConfirmPaymentButton,
    PaymentError as ChoosePaymentError,
    PaymentMethodCard as ChoosePaymentMethodCard,
    SelectedPaymentSummary as ChooseSelectedPaymentSummary,
    TotalCard as ChooseTotalCard,
    type PaymentChoice,
} from "@/Components/customer/payment/ChoosePaymentBlocks";
import { formatIDR } from "@/lib/formatters";
import { useCart } from "@/hooks/useCart";
import type { PakasirPaymentResponse } from "@/types/customer";

interface Props {
    tableId: string;
    tableNumber?: string;
    total?: number;
    orderId?: number;
    orderRef?: string;
}

export default function ChoosePayment({
    tableId,
    tableNumber = "",
    total = 0,
    orderId,
    orderRef,
}: Props) {
    const [selected, setSelected] = useState<PaymentChoice>(null);
    const { clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const paymentStorageKey = `ucw-payment-${orderId || orderRef || "pending"}`;

    async function handleConfirm() {
        if (!selected) {
            setErrorMessage("Please select a payment method.");
            return;
        }

        if (!orderRef) {
            setErrorMessage("Order reference is missing. Please return to cart and try again.");
            return;
        }

        setIsProcessing(true);
        setErrorMessage("");

        try {
            if (selected === "cash") {
                const url = route("customer.payment.process", { order: orderRef });

                const res = await axios.post<PakasirPaymentResponse>(
                    url,
                    { payment_method: "cash" },
                );

                sessionStorage.setItem(paymentStorageKey, JSON.stringify(res.data));
                clearCart();
                router.visit(route("customer.payment.cash", { order: orderRef }));
                return;
            }

            const url = route("customer.payment.pakasir.order", { order: orderRef });

            const res = await axios.post<PakasirPaymentResponse>(
                url,
                { method: selected },
            );

            if (!res.data.success) {
                setErrorMessage(res.data.message || "Failed to create payment.");
                setIsProcessing(false);
                return;
            }

            sessionStorage.setItem(paymentStorageKey, JSON.stringify(res.data));
            clearCart();
            router.visit(route("customer.payment.online", { order: orderRef }));
        } catch (error: any) {
            console.error("Create payment failed", error);

            const errors = error?.response?.data?.errors;
            const firstError = errors ? Object.values(errors).flat()[0] : null;
            setErrorMessage(
                firstError ||
                    error?.response?.data?.message ||
                    "Payment could not be created. Please try again.",
            );
            setIsProcessing(false);
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
                        backHref={route("customer.estimate")}
                    />

                    <div className="flex flex-col flex-1 px-5 pb-36">
                        <div className="pt-4 pb-6">
                            <CheckoutSteps activeStep={3} />
                            <PageHeading />
                        </div>

                        <div className="flex flex-col gap-3 mb-6">
                            <ChoosePaymentMethodCard
                                type="qris"
                                selected={selected === "qris"}
                                onSelect={() => setSelected("qris")}
                            />

                            <ChoosePaymentMethodCard
                                type="bri_va"
                                selected={selected === "bri_va"}
                                onSelect={() => setSelected("bri_va")}
                            />

                            <ChoosePaymentMethodCard
                                type="cash"
                                selected={selected === "cash"}
                                onSelect={() => setSelected("cash")}
                            />
                        </div>

                        {errorMessage && <ChoosePaymentError message={errorMessage} />}
                        <ChooseTotalCard total={total} />
                        <TrustBlurb className="mt-4" />
                    </div>

                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                        style={{
                            background:
                                "linear-gradient(to top, var(--color-ucw-bg) 65%, transparent)",
                        }}
                    >
                        <ConfirmPaymentButton
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
                            backHref={route("customer.estimate")}
                            active="cart"
                        />

                        <div className="flex-1 max-w-4xl mx-auto w-full px-8 lg:px-10 py-8">
                            <CheckoutSteps activeStep={3} />

                            <div className="mt-8">
                                <PageHeading desktop />
                            </div>

                            <div className="grid grid-cols-3 gap-5 mt-7">
                                <ChoosePaymentMethodCard
                                    type="qris"
                                    selected={selected === "qris"}
                                    onSelect={() => setSelected("qris")}
                                    desktop
                                />

                                <ChoosePaymentMethodCard
                                    type="bri_va"
                                    selected={selected === "bri_va"}
                                    onSelect={() => setSelected("bri_va")}
                                    desktop
                                />

                                <ChoosePaymentMethodCard
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
                            <ChooseSelectedPaymentSummary selected={selected} />
                            {errorMessage && <ChoosePaymentError message={errorMessage} />}
                            <ChooseTotalCard total={total} compact />
                        </div>

                        <div className="px-8 pb-8">
                            <ConfirmPaymentButton
                                selected={selected}
                                onConfirm={handleConfirm}
                                isLoading={isProcessing}
                            />

                            <Link
                                href={route("customer.estimate")}
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
    type: "qris" | "bri_va" | "cash";
    selected: boolean;
    onSelect: () => void;
    desktop?: boolean;
}) {
    const isCash = type === "cash";
    const isBriVa = type === "bri_va";

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
                    {isCash ? <CashIcon active={selected} /> : <OnlineIcon active={selected} />}
                </div>

                {selected && <SelectedPill />}
            </div>

            <h3
                className="font-black mb-1"
                style={{ fontSize: "20px", color: "var(--color-ucw-dark)" }}
            >
                {isCash ? "Cash at Cashier" : isBriVa ? "BRI Virtual Account" : "QRIS Pakasir"}
            </h3>

            <p
                className="mb-4 leading-relaxed"
                style={{
                    fontSize: "13px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                {isCash
                    ? "Pay directly at the cashier after confirming your order."
                    : isBriVa
                      ? "Pay with BRI virtual account generated for this order."
                      : "Pay by scanning a QRIS code generated for this order."}
            </p>

            {isCash ? <CashMethodInfo /> : <OnlineMethodIcons labels={isBriVa ? ["BRI", "VA"] : ["QRIS"]} />}

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
                    {isCash ? "Pay on-site" : "Secure Pakasir payment"}
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

function SelectedPaymentSummary({ selected }: { selected: PaymentChoice }) {
    const title =
        selected === "cash"
            ? "Cash at Cashier"
            : selected === "bri_va"
              ? "BRI Virtual Account"
              : selected === "qris"
                ? "QRIS Pakasir"
                : "No method selected";
    const subtitle =
        selected === "cash"
            ? "Pay on-site"
            : selected === "bri_va"
              ? "BRI VA via Pakasir"
              : selected === "qris"
                ? "QRIS via Pakasir"
                : "Choose one method";

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
                        {selected === "cash" ? (
                            <CashIcon active small />
                        ) : (
                            <OnlineIcon active small />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p
                            className="font-bold text-sm"
                            style={{ color: "var(--color-ucw-dark)" }}
                        >
                            {title}
                        </p>

                        <p
                            className="text-xs mt-0.5 truncate"
                            style={{ color: "var(--color-ucw-text-muted)" }}
                        >
                            {subtitle}
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
                Based on selected menu items.
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
    selected: PaymentChoice;
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
                selected === "qris"
                    ? "Create QRIS Payment"
                    : selected === "bri_va"
                    ? "Create BRI VA Payment"
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

function OnlineMethodIcons({ labels = ["QRIS", "BRI VA"] }: { labels?: string[] }) {
    return (
        <div className="flex items-center gap-2">
            {labels.map((label) => (
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

function PaymentError({ message }: { message: string }) {
    return (
        <div
            className="rounded-2xl px-4 py-3 mb-4"
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
