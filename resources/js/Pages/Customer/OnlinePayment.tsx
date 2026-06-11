import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { Head, Link, router } from "@inertiajs/react";
import CustomerLayout from "@/Components/Layout/CustomerLayout";
import TopBar from "@/Components/customer/navigation/TopBar";
import CustomerDesktopHeader from "@/Components/customer/common/CustomerDesktopHeader";
import {
    BriVaPanel as OnlineBriVaPanel,
    OnlinePaymentMethodCard,
    PaymentHeader as OnlinePaymentHeader,
    PaymentInstructions as OnlinePaymentInstructions,
    PaymentStatusCard,
    PaymentSummaryCard,
    QrisPanel as OnlineQrisPanel,
    SelectedMethodSummary as OnlineSelectedMethodSummary,
    TrackPaymentButton as OnlineTrackPaymentButton,
} from "@/Components/customer/payment/OnlinePaymentBlocks";
import { usePaymentStatusPolling } from "@/hooks/usePaymentStatusPolling";
import { formatIDR } from "@/lib/formatters";
import { getPaymentStatusLabel } from "@/lib/status";
import type { PakasirMethod, PaymentMethod as BackendPaymentMethod, PaymentStatus, PakasirPaymentResponse } from "@/types/customer";

interface Props {
    tableId: string;
    tableNumber?: string;
    orderId?: string;
    orderRef?: string;
    total?: number;
    paymentMethod?: BackendPaymentMethod | null;
    paymentStatus?: PaymentStatus;
    pakasirMethod?: PakasirMethod | null;
    paymentNumber?: string | null;
    totalPayment?: number | null;
    expiredAt?: string | null;
}

type PaymentMethod = "qris" | "bri_va";

function readStoredPayment(orderId?: string): Partial<PakasirPaymentResponse> {
    if (!orderId || typeof window === "undefined") return {};

    try {
        return JSON.parse(sessionStorage.getItem(`ucw-payment-${orderId}`) || "{}");
    } catch {
        return {};
    }
}

function methodFromPaymentMethod(method?: BackendPaymentMethod | null): PaymentMethod | null {
    if (method === "qris_pakasir") return "qris";
    if (method === "bri_va_pakasir") return "bri_va";
    return null;
}

export default function OnlinePayment({
    tableId,
    tableNumber = "",
    orderId,
    orderRef,
    total,
    paymentMethod,
    paymentStatus,
    pakasirMethod,
    paymentNumber,
    totalPayment,
    expiredAt,
}: Props) {
    const stored = useMemo(() => readStoredPayment(orderId), [orderId]);
    const initialMethod =
        pakasirMethod ||
        methodFromPaymentMethod(paymentMethod) ||
        stored.pakasirMethod ||
        "qris";
    const [selected, setSelected] = useState<PaymentMethod>(initialMethod);
    const [copied, setCopied] = useState(false);
    const [currentPaymentStatus, setCurrentPaymentStatus] = useState<PaymentStatus>(
        paymentStatus ?? stored.paymentStatus ?? "unpaid",
    );
    const [paymentMessage, setPaymentMessage] = useState("Waiting for Pakasir payment confirmation.");
    const [isRecreatingPayment, setIsRecreatingPayment] = useState(false);

    const resolvedOrderId = String(orderId || stored.orderId || "");
    const resolvedOrderRef = orderRef || stored.orderRef || "-";
    const resolvedTotal = total ?? stored.total ?? 0;
    const resolvedPaymentNumber = paymentNumber ?? stored.paymentNumber ?? "";
    const resolvedTotalPayment = totalPayment ?? stored.totalPayment ?? resolvedTotal;
    const resolvedExpiredAt = expiredAt ?? stored.expiredAt ?? null;
    const isPaymentRetryable = currentPaymentStatus === "expired" || currentPaymentStatus === "failed";

    const handlePaymentPaid = useCallback(() => {
        router.visit(route("customer.order.status", { order: resolvedOrderRef }));
    }, [resolvedOrderRef]);

    usePaymentStatusPolling({
        orderRef: resolvedOrderRef,
        currentPaymentStatus,
        onStatusChange: setCurrentPaymentStatus,
        onPaid: handlePaymentPaid,
        onMessageChange: setPaymentMessage,
    });

    function handleTrackOrder() {
        if (!resolvedOrderRef || resolvedOrderRef === "-") return;
        router.visit(route("customer.status", { order: resolvedOrderRef }));
    }

    async function handleCopyPaymentNumber() {
        if (!resolvedPaymentNumber) return;

        await navigator.clipboard.writeText(resolvedPaymentNumber);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    }

    async function handlePayAgain() {
        if (!resolvedOrderRef || resolvedOrderRef === "-") return;

        setIsRecreatingPayment(true);
        setPaymentMessage("");

        try {
            const res = await axios.post<PakasirPaymentResponse>(
                route("customer.payment.pakasir.order", { order: resolvedOrderRef }),
                { method: selected },
            );

            sessionStorage.setItem(`ucw-payment-${resolvedOrderRef}`, JSON.stringify(res.data));
            setCurrentPaymentStatus(res.data.paymentStatus || "unpaid");
            router.visit(route("customer.payment.online", { order: resolvedOrderRef }));
        } catch (error: unknown) {
            const message =
                typeof error === "object" &&
                error !== null &&
                "response" in error &&
                typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
                    ? (error as { response: { data: { message: string } } }).response.data.message
                    : "Could not create a new payment. Please try again.";

            setPaymentMessage(message);
            setIsRecreatingPayment(false);
        }
    }

    return (
        <>
            <Head title="Online Payment — UCW" />

            <CustomerLayout hideTopBar>
                {/* MOBILE */}
                <div
                    className="md:hidden min-h-svh flex flex-col"
                    style={{ backgroundColor: "var(--color-ucw-bg)" }}
                >
                    <TopBar
                        tableId={tableId}
                        title="Online Payment"
                        subtitle={tableNumber ? `Table ${tableNumber} • ${formatIDR(resolvedTotalPayment)}` : formatIDR(resolvedTotalPayment)}
                        showBack
                        backHref={route("customer.payment", { order: resolvedOrderRef })}
                    />

                    <div className="flex-1 px-5 pb-36">
                        <OnlinePaymentHeader total={resolvedTotalPayment} orderRef={resolvedOrderRef} />

                        <div className="flex flex-col gap-3 mt-6">
                            <OnlinePaymentMethodCard
                                method="qris"
                                selected={selected === "qris"}
                                onSelect={() => setSelected("qris")}
                            />

                            <OnlinePaymentMethodCard
                                method="bri_va"
                                selected={selected === "bri_va"}
                                onSelect={() => setSelected("bri_va")}
                            />
                        </div>

                        <div className="mt-6">
                            {selected === "qris" ? (
                                <OnlineQrisPanel
                                    paymentNumber={resolvedPaymentNumber}
                                    orderRef={resolvedOrderRef}
                                    totalPayment={resolvedTotalPayment}
                                    expiredAt={resolvedExpiredAt}
                                />
                            ) : (
                                <OnlineBriVaPanel
                                    paymentNumber={resolvedPaymentNumber}
                                    orderRef={resolvedOrderRef}
                                    totalPayment={resolvedTotalPayment}
                                    expiredAt={resolvedExpiredAt}
                                    copied={copied}
                                    onCopy={handleCopyPaymentNumber}
                                />
                            )}
                        </div>

                        <OnlinePaymentInstructions method={selected} />
                        <PaymentStatusCard status={currentPaymentStatus} message={paymentMessage} />
                    </div>

                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                        style={{
                            background:
                                "linear-gradient(to top, var(--color-ucw-bg) 65%, transparent)",
                        }}
                    >
                        {isPaymentRetryable ? (
                            <OnlineTrackPaymentButton
                                label={isRecreatingPayment ? "Creating Payment..." : "Pay Again"}
                                onTrack={handlePayAgain}
                                disabled={isRecreatingPayment}
                            />
                        ) : (
                            <OnlineTrackPaymentButton onTrack={handleTrackOrder} />
                        )}
                        <p
                            className="text-center mt-3 uppercase tracking-[0.12em]"
                            style={{
                                fontSize: "9px",
                                color: "var(--color-ucw-text-muted)",
                            }}
                        >
                            {getPaymentStatusLabel(currentPaymentStatus)}
                        </p>
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
                            title="Online Payment"
                            subtitle={tableNumber ? `Table ${tableNumber} • Order #${resolvedOrderRef}` : `Order #${resolvedOrderRef}`}
                            backHref={route("customer.payment", { order: resolvedOrderRef })}
                            active="cart"
                        />

                        <div className="flex-1 max-w-4xl mx-auto w-full px-8 lg:px-10 py-8">
                            <OnlinePaymentHeader total={resolvedTotalPayment} orderRef={resolvedOrderRef} desktop />

                            <div className="grid grid-cols-2 gap-5 mt-7">
                                <OnlinePaymentMethodCard
                                    method="qris"
                                    selected={selected === "qris"}
                                    onSelect={() => setSelected("qris")}
                                    desktop
                                />

                                <OnlinePaymentMethodCard
                                    method="bri_va"
                                    selected={selected === "bri_va"}
                                    onSelect={() => setSelected("bri_va")}
                                    desktop
                                />
                            </div>

                            <div className="mt-6">
                                {selected === "qris" ? (
                                    <OnlineQrisPanel
                                        paymentNumber={resolvedPaymentNumber}
                                        orderRef={resolvedOrderRef}
                                        totalPayment={resolvedTotalPayment}
                                        expiredAt={resolvedExpiredAt}
                                    />
                                ) : (
                                    <OnlineBriVaPanel
                                        paymentNumber={resolvedPaymentNumber}
                                        orderRef={resolvedOrderRef}
                                        totalPayment={resolvedTotalPayment}
                                        expiredAt={resolvedExpiredAt}
                                        copied={copied}
                                        onCopy={handleCopyPaymentNumber}
                                    />
                                )}
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
                                className="text-xs"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                Pakasir will confirm QRIS and BRI VA payments automatically.
                            </p>
                        </div>

                        <div className="flex-1 px-8 py-6 flex flex-col gap-5">
                            <OnlineSelectedMethodSummary selected={selected} />

                            <PaymentSummaryCard
                                totalPayment={resolvedTotalPayment}
                                orderRef={resolvedOrderRef}
                            />

                            <OnlinePaymentInstructions method={selected} compact />
                            <PaymentStatusCard status={currentPaymentStatus} message={paymentMessage} />
                        </div>

                        <div className="px-8 pb-8">
                            {isPaymentRetryable ? (
                                <OnlineTrackPaymentButton
                                    label={isRecreatingPayment ? "Creating Payment..." : "Pay Again"}
                                    onTrack={handlePayAgain}
                                    disabled={isRecreatingPayment}
                                />
                            ) : (
                                <OnlineTrackPaymentButton onTrack={handleTrackOrder} />
                            )}

                            <Link
                                href={route("customer.payment", { order: resolvedOrderRef })}
                                className="w-full flex items-center justify-center mt-3 h-10 text-sm font-medium"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                ← Change payment method
                            </Link>
                        </div>
                    </aside>
                </div>
            </CustomerLayout>
        </>
    );
}
