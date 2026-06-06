import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Head, Link, router } from "@inertiajs/react";
import QRCode from "react-qr-code";
import CustomerLayout from "@/Components/Layout/CustomerLayout";
import TopBar from "@/Components/customer/navigation/TopBar";
import CustomerDesktopHeader from "@/Components/customer/common/CustomerDesktopHeader";
import { formatIDR } from "@/lib/currency";
import type { CustomerPaymentStatusResponse, PakasirMethod, PaymentMethod as BackendPaymentMethod, PaymentStatus, PakasirPaymentResponse } from "@/types/customer";

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

    useEffect(() => {
        if (!resolvedOrderRef || resolvedOrderRef === "-") return;

        let cancelled = false;

        async function pollPaymentStatus() {
            try {
                const res = await axios.get<CustomerPaymentStatusResponse>(
                    `/customer/order/${encodeURIComponent(resolvedOrderRef)}/payment/status`,
                );

                if (cancelled) return;

                const nextPaymentStatus = res.data.paymentStatus ?? res.data.payment_status;

                if (nextPaymentStatus) {
                    setCurrentPaymentStatus(nextPaymentStatus);
                }

                if (nextPaymentStatus === "paid") {
                    router.visit(route("customer.order.status", { order: resolvedOrderRef }));
                    return;
                }

                if (nextPaymentStatus === "expired") {
                    setPaymentMessage("Payment has expired. Please create a new payment.");
                    return;
                }

                if (nextPaymentStatus === "failed") {
                    setPaymentMessage("Payment failed. Please create a new payment.");
                    return;
                }

                setPaymentMessage("Waiting for Pakasir payment confirmation.");
            } catch {
                if (!cancelled && currentPaymentStatus === "unpaid") {
                    setPaymentMessage("Still waiting for payment confirmation. We will retry shortly.");
                }
            }
        }

        pollPaymentStatus();
        const interval = window.setInterval(pollPaymentStatus, 7000);

        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, [resolvedOrderRef, currentPaymentStatus]);

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
                        <PaymentHeader total={resolvedTotalPayment} orderRef={resolvedOrderRef} />

                        <div className="flex flex-col gap-3 mt-6">
                            <PaymentMethodCard
                                method="qris"
                                selected={selected === "qris"}
                                onSelect={() => setSelected("qris")}
                            />

                            <PaymentMethodCard
                                method="bri_va"
                                selected={selected === "bri_va"}
                                onSelect={() => setSelected("bri_va")}
                            />
                        </div>

                        <div className="mt-6">
                            {selected === "qris" ? (
                                <QrisPanel
                                    paymentNumber={resolvedPaymentNumber}
                                    orderRef={resolvedOrderRef}
                                    totalPayment={resolvedTotalPayment}
                                    expiredAt={resolvedExpiredAt}
                                />
                            ) : (
                                <BriVaPanel
                                    paymentNumber={resolvedPaymentNumber}
                                    orderRef={resolvedOrderRef}
                                    totalPayment={resolvedTotalPayment}
                                    expiredAt={resolvedExpiredAt}
                                    copied={copied}
                                    onCopy={handleCopyPaymentNumber}
                                />
                            )}
                        </div>

                        <PaymentInstructions method={selected} />
                        <PaymentNotice status={currentPaymentStatus} message={paymentMessage} />
                    </div>

                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                        style={{
                            background:
                                "linear-gradient(to top, var(--color-ucw-bg) 65%, transparent)",
                        }}
                    >
                        {isPaymentRetryable ? (
                            <TrackPaymentButton
                                label={isRecreatingPayment ? "Creating Payment..." : "Pay Again"}
                                onTrack={handlePayAgain}
                                disabled={isRecreatingPayment}
                            />
                        ) : (
                            <TrackPaymentButton onTrack={handleTrackOrder} />
                        )}
                        <p
                            className="text-center mt-3 uppercase tracking-[0.12em]"
                            style={{
                                fontSize: "9px",
                                color: "var(--color-ucw-text-muted)",
                            }}
                        >
                            {formatPaymentStatus(currentPaymentStatus)}
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
                            <PaymentHeader total={resolvedTotalPayment} orderRef={resolvedOrderRef} desktop />

                            <div className="grid grid-cols-2 gap-5 mt-7">
                                <PaymentMethodCard
                                    method="qris"
                                    selected={selected === "qris"}
                                    onSelect={() => setSelected("qris")}
                                    desktop
                                />

                                <PaymentMethodCard
                                    method="bri_va"
                                    selected={selected === "bri_va"}
                                    onSelect={() => setSelected("bri_va")}
                                    desktop
                                />
                            </div>

                            <div className="mt-6">
                                {selected === "qris" ? (
                                    <QrisPanel
                                        paymentNumber={resolvedPaymentNumber}
                                        orderRef={resolvedOrderRef}
                                        totalPayment={resolvedTotalPayment}
                                        expiredAt={resolvedExpiredAt}
                                        desktop
                                    />
                                ) : (
                                    <BriVaPanel
                                        paymentNumber={resolvedPaymentNumber}
                                        orderRef={resolvedOrderRef}
                                        totalPayment={resolvedTotalPayment}
                                        expiredAt={resolvedExpiredAt}
                                        copied={copied}
                                        onCopy={handleCopyPaymentNumber}
                                        desktop
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
                            <SelectedMethodSummary selected={selected} />

                            <div
                                className="rounded-2xl p-5"
                                style={{ backgroundColor: "var(--color-ucw-dark)" }}
                            >
                                <p
                                    className="font-semibold uppercase tracking-[0.12em] mb-1"
                                    style={{
                                        fontSize: "10px",
                                        color: "rgba(255,255,255,0.55)",
                                    }}
                                >
                                    TOTAL PAYMENT
                                </p>

                                <p
                                    className="font-black"
                                    style={{ fontSize: "28px", color: "white" }}
                                >
                                    {formatIDR(resolvedTotalPayment)}
                                </p>

                                <p
                                    className="mt-1"
                                    style={{
                                        fontSize: "11px",
                                        color: "rgba(255,255,255,0.45)",
                                    }}
                                >
                                    Order #{resolvedOrderRef}
                                </p>
                            </div>

                            <PaymentInstructions method={selected} compact />
                            <PaymentNotice status={currentPaymentStatus} message={paymentMessage} />
                        </div>

                        <div className="px-8 pb-8">
                            {isPaymentRetryable ? (
                                <TrackPaymentButton
                                    label={isRecreatingPayment ? "Creating Payment..." : "Pay Again"}
                                    onTrack={handlePayAgain}
                                    disabled={isRecreatingPayment}
                                />
                            ) : (
                                <TrackPaymentButton onTrack={handleTrackOrder} />
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

function PaymentHeader({
    total,
    orderRef,
    desktop = false,
}: {
    total: number;
    orderRef: string;
    desktop?: boolean;
}) {
    return (
        <div className={desktop ? "" : "pt-5"}>
            <p
                className="font-semibold uppercase tracking-[0.15em] mb-2"
                style={{
                    fontSize: "10px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                ONLINE PAYMENT
            </p>

            <h1
                className="font-black leading-[1.08] tracking-tight"
                style={{
                    fontSize: desktop ? "36px" : "31px",
                    color: "var(--color-ucw-dark)",
                }}
            >
                Complete your
                <br />
                payment.
            </h1>

            <div
                className="mt-5 rounded-3xl p-5"
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
                    TOTAL AMOUNT
                </p>

                <p
                    className="font-black leading-none"
                    style={{
                        fontSize: desktop ? "36px" : "34px",
                        color: "var(--color-ucw-dark)",
                    }}
                >
                    {formatIDR(total)}
                </p>

                <p
                    className="mt-2"
                    style={{
                        fontSize: "12px",
                        color: "var(--color-ucw-text-muted)",
                    }}
                >
                    Order #{orderRef}
                </p>
            </div>
        </div>
    );
}

function PaymentMethodCard({
    method,
    selected,
    onSelect,
    desktop = false,
}: {
    method: PaymentMethod;
    selected: boolean;
    onSelect: () => void;
    desktop?: boolean;
}) {
    const isQris = method === "qris";

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
                minHeight: desktop ? "210px" : "auto",
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
                    {isQris ? (
                        <QrisIcon active={selected} />
                    ) : (
                        <BankIcon active={selected} />
                    )}
                </div>

                {selected && <SelectedPill />}
            </div>

            <h3
                className="font-black mb-1"
                style={{ fontSize: "20px", color: "var(--color-ucw-dark)" }}
            >
                {isQris ? "QRIS" : "BRI Virtual Account"}
            </h3>

            <p
                className="leading-relaxed"
                style={{
                    fontSize: "13px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                {isQris
                    ? "Scan the QRIS code generated for this order."
                    : "Pay to the BRI virtual account generated for this order."}
            </p>
        </button>
    );
}

function QrisPanel({
    paymentNumber,
    orderRef,
    totalPayment,
    expiredAt,
    desktop = false,
}: {
    paymentNumber: string;
    orderRef: string;
    totalPayment: number;
    expiredAt?: string | null;
    desktop?: boolean;
}) {
    return (
        <div
            className="rounded-3xl p-5"
            style={{
                backgroundColor: "white",
                border: "1px solid var(--color-ucw-border)",
            }}
        >
            <h2
                className="font-black mb-2"
                style={{ fontSize: "18px", color: "var(--color-ucw-dark)" }}
            >
                Scan QRIS
            </h2>

            <p
                className="leading-relaxed mb-5"
                style={{ fontSize: "13px", color: "var(--color-ucw-text-muted)" }}
            >
                Scan this QRIS code and complete the exact payment amount.
            </p>

            <div
                className="rounded-2xl p-5 text-center"
                style={{ backgroundColor: "var(--color-ucw-bg-warm)" }}
            >
                <div
                    className="mx-auto w-44 h-44 rounded-2xl flex items-center justify-center mb-4 p-4"
                    style={{ backgroundColor: "white" }}
                >
                    {paymentNumber ? (
                        <QRCode value={paymentNumber} size={144} />
                    ) : (
                        <QrisIcon active={false} large />
                    )}
                </div>

                <BankInfoRow label="Order" value={orderRef} />
                <BankInfoRow label="Amount" value={formatIDR(totalPayment)} important />
                <BankInfoRow label="Expires" value={formatExpiry(expiredAt)} />
            </div>
        </div>
    );
}

function BriVaPanel({
    paymentNumber,
    orderRef,
    totalPayment,
    expiredAt,
    copied,
    onCopy,
    desktop = false,
}: {
    paymentNumber: string;
    orderRef: string;
    totalPayment: number;
    expiredAt?: string | null;
    copied: boolean;
    onCopy: () => void;
    desktop?: boolean;
}) {
    return (
        <div
            className="rounded-3xl p-5"
            style={{
                backgroundColor: "white",
                border: "1px solid var(--color-ucw-border)",
            }}
        >
            <h2
                className="font-black mb-2"
                style={{ fontSize: "18px", color: "var(--color-ucw-dark)" }}
            >
                BRI Virtual Account
            </h2>

            <p
                className="leading-relaxed mb-5"
                style={{ fontSize: "13px", color: "var(--color-ucw-text-muted)" }}
            >
                Transfer the exact total amount to the virtual account below.
            </p>

            <div className="flex flex-col gap-3">
                <BankInfoRow label="Bank" value="BRI Virtual Account" />
                <BankInfoRow label="VA Number" value={paymentNumber || "-"} important />
                <BankInfoRow label="Amount" value={formatIDR(totalPayment)} important />
                <BankInfoRow label="Reference" value={orderRef} />
                <BankInfoRow label="Expires" value={formatExpiry(expiredAt)} />
            </div>

            <button
                onClick={onCopy}
                disabled={!paymentNumber}
                className="mt-4 w-full h-11 rounded-xl font-bold transition-all active:scale-[0.98]"
                style={{
                    backgroundColor: "var(--color-ucw-bg-warm)",
                    border: "1px solid var(--color-ucw-border)",
                    color: "var(--color-ucw-dark)",
                }}
            >
                {copied ? "VA Copied" : "Copy VA Number"}
            </button>

            <p
                className="mt-5 leading-relaxed"
                style={{ fontSize: "12px", color: "var(--color-ucw-text-muted)" }}
            >
                Pakasir will confirm this payment automatically after the transfer
                is completed.
            </p>
        </div>
    );
}

function BankInfoRow({
    label,
    value,
    important = false,
}: {
    label: string;
    value: string;
    important?: boolean;
}) {
    return (
        <div
            className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3"
            style={{
                backgroundColor: important
                    ? "var(--color-ucw-dark)"
                    : "var(--color-ucw-bg-warm)",
            }}
        >
            <span
                className="font-semibold uppercase tracking-[0.12em]"
                style={{
                    fontSize: "10px",
                    color: important
                        ? "rgba(255,255,255,0.55)"
                        : "var(--color-ucw-text-muted)",
                }}
            >
                {label}
            </span>

            <span
                className="font-black text-right"
                style={{
                    fontSize: "14px",
                    color: important ? "white" : "var(--color-ucw-dark)",
                }}
            >
                {value}
            </span>
        </div>
    );
}

function SelectedMethodSummary({ selected }: { selected: PaymentMethod }) {
    const isQris = selected === "qris";

    return (
        <div>
            <p
                className="text-xs font-semibold uppercase tracking-[0.12em] mb-3"
                style={{ color: "var(--color-ucw-text-muted)" }}
            >
                Selected method
            </p>

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
                    {isQris ? <QrisIcon active small /> : <BankIcon active small />}
                </div>

                <div>
                    <p
                        className="font-bold text-sm"
                        style={{ color: "var(--color-ucw-dark)" }}
                    >
                        {isQris ? "QRIS Pakasir" : "BRI Virtual Account"}
                    </p>

                    <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--color-ucw-text-muted)" }}
                    >
                        {isQris ? "Scan generated QRIS" : "Use generated VA number"}
                    </p>
                </div>
            </div>
        </div>
    );
}

function PaymentInstructions({
    method,
    compact = false,
}: {
    method: PaymentMethod;
    compact?: boolean;
}) {
    const steps =
        method === "qris"
            ? [
                  "Scan the QRIS code shown on this screen.",
                  "Pay the exact total amount.",
                  "Track your order while Pakasir confirms payment.",
              ]
            : [
                  "Transfer to the BRI virtual account shown above.",
                  "Pay the exact total amount before expiry.",
                  "Track your order while Pakasir confirms payment.",
              ];

    return (
        <div className={compact ? "" : "mt-7"}>
            <p
                className="font-semibold uppercase tracking-[0.14em] mb-4"
                style={{
                    fontSize: "10px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                PAYMENT INSTRUCTIONS
            </p>

            <div className="flex flex-col gap-3">
                {steps.map((step, index) => (
                    <div key={step} className="flex gap-3">
                        <span
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-white"
                            style={{
                                fontSize: "10px",
                                backgroundColor: "var(--color-ucw-dark)",
                            }}
                        >
                            {index + 1}
                        </span>

                        <p
                            className="leading-relaxed"
                            style={{
                                fontSize: "13px",
                                color: "var(--color-ucw-text-muted)",
                            }}
                        >
                            {step}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PaymentNotice({
    status,
    message,
}: {
    status: PaymentStatus;
    message: string;
}) {
    if (!message) return null;

    const isProblem = status === "expired" || status === "failed";

    return (
        <div
            className="mt-5 rounded-2xl px-4 py-3"
            style={{
                backgroundColor: isProblem ? "var(--color-ucw-amber-bg)" : "white",
                border: `1px solid ${isProblem ? "var(--color-ucw-amber)" : "var(--color-ucw-border)"}`,
            }}
        >
            <p
                className="font-semibold"
                style={{
                    fontSize: "12px",
                    color: isProblem ? "#92620A" : "var(--color-ucw-text-muted)",
                }}
            >
                {message}
            </p>
        </div>
    );
}

function TrackPaymentButton({
    onTrack,
    label = "Track Payment Status",
    disabled = false,
}: {
    onTrack: () => void;
    label?: string;
    disabled?: boolean;
}) {
    return (
        <button
            onClick={onTrack}
            disabled={disabled}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl font-bold transition-all active:scale-[0.98] text-white"
            style={{
                height: "54px",
                fontSize: "15px",
                backgroundColor: "var(--color-ucw-dark)",
                boxShadow: "0 4px 20px rgba(45,26,14,0.22)",
                opacity: disabled ? 0.7 : 1,
            }}
        >
            {label}

            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
            >
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </button>
    );
}

function formatExpiry(expiredAt?: string | null) {
    if (!expiredAt) return "-";

    return new Date(expiredAt).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatPaymentStatus(status?: PaymentStatus) {
    const labels: Record<PaymentStatus, string> = {
        unpaid: "Waiting Payment",
        waiting_verification: "Waiting Verification",
        paid: "Payment Received",
        failed: "Payment Failed",
        expired: "Payment Expired",
    };

    return labels[status || "unpaid"];
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

function QrisIcon({
    active,
    small = false,
    large = false,
}: {
    active: boolean;
    small?: boolean;
    large?: boolean;
}) {
    const size = large ? 52 : small ? 16 : 22;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={active ? "white" : "var(--color-ucw-dark)"}
            strokeWidth="1.8"
            strokeLinecap="round"
        >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="3" height="3" />
            <rect x="18" y="14" width="3" height="3" />
            <rect x="14" y="18" width="3" height="3" />
        </svg>
    );
}

function BankIcon({
    active,
    small = false,
}: {
    active: boolean;
    small?: boolean;
}) {
    const size = small ? 16 : 22;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={active ? "white" : "var(--color-ucw-dark)"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="3" y1="22" x2="21" y2="22" />
            <line x1="6" y1="18" x2="6" y2="11" />
            <line x1="10" y1="18" x2="10" y2="11" />
            <line x1="14" y1="18" x2="14" y2="11" />
            <line x1="18" y1="18" x2="18" y2="11" />
            <polygon points="12 2 20 7 4 7" />
        </svg>
    );
}
