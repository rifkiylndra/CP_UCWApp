import { router } from "@inertiajs/react";
import { formatIDR } from "@/lib/formatters";
import type { PaymentStatus } from "@/types/customer";

interface CashConfirmationHeaderProps {
    total: number;
    orderRef: string;
    desktop?: boolean;
}

interface CashIdentifyCardProps {
    orderRef: string;
    desktop?: boolean;
}

interface CashPaymentSummaryProps {
    orderRef: string;
    orderTime: string;
    total: number;
    tableNumber: string;
    desktop?: boolean;
}

interface CashInstructionCardProps {
    orderRef: string;
    total: number;
    className?: string;
    compact?: boolean;
}

export function CashConfirmationHeader({
    total,
    orderRef,
    desktop = false,
}: CashConfirmationHeaderProps) {
    return (
        <div className={desktop ? "" : "pt-5"}>
            <p
                className="font-semibold uppercase tracking-[0.15em] mb-2"
                style={{
                    fontSize: "10px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                CASH PAYMENT
            </p>

            <h1
                className="font-black leading-[1.08] tracking-tight"
                style={{
                    fontSize: desktop ? "36px" : "31px",
                    color: "var(--color-ucw-dark)",
                }}
            >
                Please pay at
                <br />
                the cashier.
            </h1>

            <p
                className="mt-3 leading-relaxed max-w-[460px]"
                style={{
                    fontSize: desktop ? "14px" : "13px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                Show this order screen to the cashier and complete your payment
                before your order is prepared.
            </p>

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
                    AMOUNT TO PAY
                </p>

                <p
                    className="font-black leading-none"
                    style={{
                        fontSize: desktop ? "38px" : "34px",
                        color: "var(--color-ucw-dark)",
                    }}
                >
                    {formatIDR(total)}
                </p>

                <div
                    className="inline-flex mt-4 px-3 py-1.5 rounded-full"
                    style={{
                        backgroundColor: "var(--color-ucw-amber-bg)",
                        border: "1px solid var(--color-ucw-amber)",
                    }}
                >
                    <span
                        className="font-bold uppercase tracking-[0.12em]"
                        style={{ fontSize: "9px", color: "#92620A" }}
                    >
                        Waiting for cashier verification
                    </span>
                </div>

                <p
                    className="mt-3"
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

export function CashIdentifyCard({
    orderRef,
    desktop = false,
}: CashIdentifyCardProps) {
    return (
        <div
            className="rounded-3xl p-5 relative overflow-hidden h-full"
            style={{
                backgroundColor: "white",
                border: "1px solid var(--color-ucw-border)",
            }}
        >
            <p
                className="font-semibold uppercase tracking-[0.14em] mb-2"
                style={{
                    fontSize: "10px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                STEP 01
            </p>

            <h3
                className="font-black mb-2"
                style={{ fontSize: "18px", color: "var(--color-ucw-dark)" }}
            >
                Identify Your Order
            </h3>

            <p
                className="leading-relaxed"
                style={{
                    fontSize: "13px",
                    color: "var(--color-ucw-text-muted)",
                    maxWidth: desktop ? "82%" : "78%",
                }}
            >
                Show your Order ID to the cashier:
            </p>

            <p
                className="font-black mt-3"
                style={{
                    fontSize: "20px",
                    color: "var(--color-ucw-dark)",
                }}
            >
                #{orderRef}
            </p>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                <svg
                    width="78"
                    height="78"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-ucw-dark)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="3" height="3" />
                    <rect x="18" y="14" width="3" height="3" />
                    <rect x="14" y="18" width="3" height="3" />
                </svg>
            </div>
        </div>
    );
}

export function CashPaymentSummary({
    orderRef,
    orderTime,
    total,
    tableNumber,
}: CashPaymentSummaryProps) {
    return (
        <div
            className="rounded-3xl p-5 h-full"
            style={{
                backgroundColor: "white",
                border: "1px solid var(--color-ucw-border)",
            }}
        >
            <p
                className="font-semibold uppercase tracking-[0.14em] mb-4"
                style={{
                    fontSize: "10px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                ORDER DETAILS
            </p>

            <DetailRow label="Order ID" value={`#${orderRef}`} strong />
            <DetailRow label="Table" value={tableNumber ? `Table ${tableNumber}` : "Takeaway"} />
            <DetailRow label="Time" value={orderTime} />

            <div
                style={{
                    height: "1px",
                    backgroundColor: "var(--color-ucw-border)",
                    margin: "16px 0",
                }}
            />

            <DetailRow label="Total Amount" value={formatIDR(total)} strong />
        </div>
    );
}

export function CashInstructionCard({
    orderRef,
    total,
    className = "",
    compact = false,
}: CashInstructionCardProps) {
    const steps = [
        "Go to the cashier counter.",
        `Show your Order ID: #${orderRef}.`,
        `Pay ${formatIDR(total)} to the cashier.`,
        "Wait for staff verification.",
    ];

    return (
        <div
            className={`${className} ${compact ? "" : "rounded-3xl p-5"}`}
            style={
                compact
                    ? {}
                    : {
                          backgroundColor: "white",
                          border: "1px solid var(--color-ucw-border)",
                      }
            }
        >
            <p
                className="font-semibold uppercase tracking-[0.14em] mb-4"
                style={{
                    fontSize: "10px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                WHAT TO DO
            </p>

            <div className="flex flex-col gap-3">
                {steps.map((step, index) => (
                    <div key={step} className="flex gap-3">
                        <span
                            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-white"
                            style={{
                                fontSize: "11px",
                                backgroundColor: "var(--color-ucw-dark)",
                            }}
                        >
                            {index + 1}
                        </span>

                        <p
                            className="leading-relaxed"
                            style={{
                                fontSize: compact ? "13px" : "14px",
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

export function CashAssistanceNote({ className = "" }: { className?: string }) {
    return (
        <div className={className}>
            <p
                className="font-semibold mb-1"
                style={{ fontSize: "13px", color: "var(--color-ucw-text)" }}
            >
                Need assistance?
            </p>

            <p
                style={{
                    fontSize: "12px",
                    color: "var(--color-ucw-text-muted)",
                    lineHeight: "1.6",
                }}
            >
                Our staff is ready to help you at the main counter.
                <br />
                Average verification time: around 2 minutes.
            </p>
        </div>
    );
}

export function CashStatusCard({ status }: { status: PaymentStatus }) {
    return (
        <div
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{
                background: "var(--color-ucw-amber-bg)",
                border: "1px solid var(--color-ucw-amber)",
            }}
        >
            <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "#92620A" }}
            />

            <p
                className="font-bold uppercase tracking-[0.12em]"
                style={{
                    fontSize: "10px",
                    color: "#92620A",
                }}
            >
                {status === "paid" ? "Payment received" : "Waiting for cash verification"}
            </p>
        </div>
    );
}

export function CashAmountDueCard({
    total,
    orderRef,
}: {
    total: number;
    orderRef: string;
}) {
    return (
        <div
            className="rounded-2xl p-5"
            style={{ background: "var(--color-ucw-dark)" }}
        >
            <p
                className="font-semibold uppercase tracking-[0.12em] mb-1"
                style={{
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.55)",
                }}
            >
                AMOUNT DUE
            </p>

            <p
                className="font-black mb-1"
                style={{ fontSize: "30px", color: "white" }}
            >
                {formatIDR(total)}
            </p>

            <p
                style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.45)",
                }}
            >
                Order #{orderRef}
            </p>
        </div>
    );
}

export function CashTrackButton({ orderRef }: { orderRef: string }) {
    return (
        <button
            onClick={() =>
                router.visit(route("customer.status", { order: orderRef }))
            }
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl font-bold transition-all active:scale-[0.98] text-white"
            style={{
                height: "54px",
                fontSize: "15px",
                backgroundColor: "var(--color-ucw-dark)",
                boxShadow: "0 4px 20px rgba(45,26,14,0.2)",
            }}
        >
            Track My Order

            <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
            >
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </button>
    );
}

function DetailRow({
    label,
    value,
    strong = false,
}: {
    label: string;
    value: string;
    strong?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4 mb-3 last:mb-0">
            <span
                style={{
                    fontSize: "13px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                {label}
            </span>

            <span
                className={strong ? "font-black" : "font-semibold"}
                style={{
                    fontSize: strong ? "15px" : "14px",
                    color: strong
                        ? "var(--color-ucw-dark)"
                        : "var(--color-ucw-text)",
                }}
            >
                {value}
            </span>
        </div>
    );
}
