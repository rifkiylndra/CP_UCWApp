import { useState } from "react";
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
