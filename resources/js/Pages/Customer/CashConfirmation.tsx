import { Head, Link, router } from "@inertiajs/react";
import CustomerLayout from "@/Components/Layout/CustomerLayout";
import TopBar from "@/Components/customer/navigation/TopBar";
import BottomNav from "@/Components/customer/navigation/BottomNav";
import CustomerDesktopHeader from "@/Components/customer/common/CustomerDesktopHeader";
import { formatIDR } from "@/lib/currency";

interface Props {
    tableId: string;
    orderId?: string;
    orderRef?: string;
    total?: number;
    orderTime?: string;
    tableNumber?: string;
    cartCount?: number;
}

function nowTime() {
    return new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function CashConfirmation({
    tableId,
    orderId = "ORD-8829",
    orderRef = "UCW-88291",
    total = 425000,
    orderTime = nowTime(),
    tableNumber = "05",
    cartCount = 0,
}: Props) {
    return (
        <>
            <Head title="Cash Payment — UCW" />

            <CustomerLayout hideTopBar>
                {/* MOBILE */}
                <div
                    className="md:hidden min-h-svh flex flex-col"
                    style={{ backgroundColor: "var(--color-ucw-bg)" }}
                >
                    <TopBar
                        tableId={tableId}
                        title="Cash Payment"
                        subtitle={`Table ${tableNumber} • ${formatIDR(total)}`}
                        showBack
                        backHref={route("customer.payment", { tableId })}
                    />

                    <div className="flex flex-col flex-1 px-5 pb-36">
                        <HeroSection total={total} orderRef={orderRef} />

                        <div className="flex flex-col gap-3 mt-6">
                            <IdentifyCard orderRef={orderRef} />
                            <OrderDetailsCard
                                orderRef={orderRef}
                                orderTime={orderTime}
                                total={total}
                                tableNumber={tableNumber}
                            />
                        </div>

                        <CashInstructionSteps
                            orderRef={orderRef}
                            total={total}
                            className="mt-7"
                        />

                        <AssistanceNote className="mt-7 text-center" />

                        <div
                            className="rounded-3xl overflow-hidden mt-6"
                            style={{ height: "170px" }}
                        >
                            
                        </div>
                    </div>

                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40"
                        style={{ backgroundColor: "var(--color-ucw-bg)" }}
                    >
                        <div className="px-5 pt-4 pb-2">
                            <TrackButton tableId={tableId} orderId={orderId} />
                        </div>

                        <BottomNav
                            tableId={tableId}
                            active="orders"
                            cartCount={cartCount}
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
                            title="Cash Payment"
                            subtitle={`Table ${tableNumber} • Pay at cashier`}
                            backHref={route("customer.payment", { tableId })}
                            active="track"
                        />

                        <div className="flex-1 max-w-4xl mx-auto w-full px-8 lg:px-10 py-8">
                            <HeroSection total={total} orderRef={orderRef} desktop />

                            <div className="grid grid-cols-2 gap-5 mt-7">
                                <IdentifyCard orderRef={orderRef} desktop />
                                <OrderDetailsCard
                                    orderRef={orderRef}
                                    orderTime={orderTime}
                                    total={total}
                                    tableNumber={tableNumber}
                                    desktop
                                />
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
                                Cash Payment
                            </h2>

                            <p
                                className="text-xs leading-relaxed"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                Please complete your payment at the cashier counter.
                            </p>
                        </div>

                        <div className="flex-1 px-8 py-6 flex flex-col gap-5">
                            <StatusBadge />

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

                            <CashInstructionSteps
                                orderRef={orderRef}
                                total={total}
                                compact
                            />

                            <AssistanceNote />
                        </div>

                        <div className="px-8 pb-8">
                            <TrackButton tableId={tableId} orderId={orderId} />

                            <Link
                                href={route("customer.payment", { tableId })}
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

function HeroSection({
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

function IdentifyCard({
    orderRef,
    desktop = false,
}: {
    orderRef: string;
    desktop?: boolean;
}) {
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

function OrderDetailsCard({
    orderRef,
    orderTime,
    total,
    tableNumber,
    desktop = false,
}: {
    orderRef: string;
    orderTime: string;
    total: number;
    tableNumber: string;
    desktop?: boolean;
}) {
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
            <DetailRow label="Table" value={`Table ${tableNumber}`} />
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

function CashInstructionSteps({
    orderRef,
    total,
    className = "",
    desktop = false,
    compact = false,
}: {
    orderRef: string;
    total: number;
    className?: string;
    desktop?: boolean;
    compact?: boolean;
}) {
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

function AssistanceNote({ className = "" }: { className?: string }) {
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

function StatusBadge() {
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
                Waiting for payment verification
            </p>
        </div>
    );
}

function TrackButton({
    tableId,
    orderId,
}: {
    tableId: string;
    orderId: string;
}) {
    return (
        <button
            onClick={() =>
                router.visit(route("customer.status", { tableId, orderId }))
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