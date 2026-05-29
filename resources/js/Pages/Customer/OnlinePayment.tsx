import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import CustomerLayout from "@/Components/Layout/CustomerLayout";
import TopBar from "@/Components/customer/navigation/TopBar";
import CustomerDesktopHeader from "@/Components/customer/common/CustomerDesktopHeader";
import { formatIDR } from "@/lib/currency";

interface Props {
    tableId: string;
    tableNumber?: string;
    orderId?: string;
    orderRef?: string;
    total?: number;
}

type PaymentMethod = "qris" | "bank";

export default function OnlinePayment({
    tableId,
    tableNumber = "05",
    orderId = "ORD-8829",
    orderRef = "EB-94021",
    total = 245000,
}: Props) {
    const [selected, setSelected] = useState<PaymentMethod>("qris");
    const [paid, setPaid] = useState(false);

    function handlePaid() {
        setPaid(true);
        setTimeout(() => {
            router.visit(route("customer.status", { tableId, orderId }));
        }, 800);
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
                        subtitle={`Table ${tableNumber} • ${formatIDR(total)}`}
                        showBack
                        backHref={route("customer.payment", { tableId })}
                    />

                    <div className="flex-1 px-5 pb-36">
                        <PaymentHeader total={total} orderRef={orderRef} />

                        <div className="flex flex-col gap-3 mt-6">
                            <PaymentMethodCard
                                method="qris"
                                selected={selected === "qris"}
                                onSelect={() => setSelected("qris")}
                            />

                            <PaymentMethodCard
                                method="bank"
                                selected={selected === "bank"}
                                onSelect={() => setSelected("bank")}
                            />
                        </div>

                        <div className="mt-6">
                            {selected === "qris" ? (
                                <QrisPanel />
                            ) : (
                                <BankNagariPanel total={total} orderRef={orderRef} />
                            )}
                        </div>

                        <PaymentInstructions method={selected} />
                    </div>

                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                        style={{
                            background:
                                "linear-gradient(to top, var(--color-ucw-bg) 65%, transparent)",
                        }}
                    >
                        <PaidButton paid={paid} onPaid={handlePaid} />
                        <p
                            className="text-center mt-3 uppercase tracking-[0.12em]"
                            style={{
                                fontSize: "9px",
                                color: "var(--color-ucw-text-muted)",
                            }}
                        >
                            PAYMENT WILL BE VERIFIED BY STAFF
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
                            subtitle={`Table ${tableNumber} • Order #${orderRef}`}
                            backHref={route("customer.payment", { tableId })}
                            active="cart"
                        />

                        <div className="flex-1 max-w-4xl mx-auto w-full px-8 lg:px-10 py-8">
                            <PaymentHeader total={total} orderRef={orderRef} desktop />

                            <div className="grid grid-cols-2 gap-5 mt-7">
                                <PaymentMethodCard
                                    method="qris"
                                    selected={selected === "qris"}
                                    onSelect={() => setSelected("qris")}
                                    desktop
                                />

                                <PaymentMethodCard
                                    method="bank"
                                    selected={selected === "bank"}
                                    onSelect={() => setSelected("bank")}
                                    desktop
                                />
                            </div>

                            <div className="mt-6">
                                {selected === "qris" ? (
                                    <QrisPanel desktop />
                                ) : (
                                    <BankNagariPanel
                                        total={total}
                                        orderRef={orderRef}
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
                                Staff will verify your payment manually.
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
                                    {formatIDR(total)}
                                </p>

                                <p
                                    className="mt-1"
                                    style={{
                                        fontSize: "11px",
                                        color: "rgba(255,255,255,0.45)",
                                    }}
                                >
                                    Order #{orderRef}
                                </p>
                            </div>

                            <PaymentInstructions method={selected} compact />
                        </div>

                        <div className="px-8 pb-8">
                            <PaidButton paid={paid} onPaid={handlePaid} />

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
                {isQris ? "QRIS" : "Transfer Bank Nagari"}
            </h3>

            <p
                className="leading-relaxed"
                style={{
                    fontSize: "13px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                {isQris
                    ? "Cafe will provide the QRIS code for this order."
                    : "Transfer directly to the cafe's Bank Nagari account."}
            </p>
        </button>
    );
}

function QrisPanel({ desktop = false }: { desktop?: boolean }) {
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
                Ask staff for QRIS
            </h2>

            <p
                className="leading-relaxed mb-5"
                style={{ fontSize: "13px", color: "var(--color-ucw-text-muted)" }}
            >
                Please show this screen to the cashier or staff. They will show the
                official QRIS code for your payment.
            </p>

            <div
                className="rounded-2xl p-5 text-center"
                style={{ backgroundColor: "var(--color-ucw-bg-warm)" }}
            >
                <div
                    className="mx-auto w-28 h-28 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: "var(--color-ucw-border)" }}
                >
                    <QrisIcon active={false} large />
                </div>

                <p
                    className="font-bold uppercase tracking-[0.12em]"
                    style={{ fontSize: "10px", color: "var(--color-ucw-text-muted)" }}
                >
                    QRIS WILL BE PROVIDED BY STAFF
                </p>
            </div>
        </div>
    );
}

function BankNagariPanel({
    total,
    orderRef,
    desktop = false,
}: {
    total: number;
    orderRef: string;
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
                Bank Nagari Transfer
            </h2>

            <p
                className="leading-relaxed mb-5"
                style={{ fontSize: "13px", color: "var(--color-ucw-text-muted)" }}
            >
                Transfer the exact total amount to the cafe account below.
            </p>

            <div className="flex flex-col gap-3">
                <BankInfoRow label="Bank" value="Bank Nagari" />
                <BankInfoRow label="Account Name" value="Unand Co-Workspace Cafe" />
                <BankInfoRow label="Account Number" value="1234 5678 9012" important />
                <BankInfoRow label="Amount" value={formatIDR(total)} important />
                <BankInfoRow label="Reference" value={orderRef} />
            </div>

            <p
                className="mt-5 leading-relaxed"
                style={{ fontSize: "12px", color: "var(--color-ucw-text-muted)" }}
            >
                After transfer, press <b>I have paid</b>. Staff will verify your
                payment before preparing the order.
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
                        {isQris ? "QRIS Staff Cafe" : "Bank Nagari"}
                    </p>

                    <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--color-ucw-text-muted)" }}
                    >
                        {isQris ? "Ask staff for QR" : "Manual bank transfer"}
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
                  "Show this payment screen to staff.",
                  "Scan the QRIS code provided by the cafe.",
                  "Press I have paid after completing payment.",
              ]
            : [
                  "Transfer to Bank Nagari account shown above.",
                  "Use the order reference in transfer notes if possible.",
                  "Press I have paid after completing payment.",
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

function PaidButton({
    paid,
    onPaid,
}: {
    paid: boolean;
    onPaid: () => void;
}) {
    return (
        <button
            onClick={onPaid}
            disabled={paid}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl font-bold transition-all active:scale-[0.98] text-white"
            style={{
                height: "54px",
                fontSize: "15px",
                backgroundColor: paid
                    ? "var(--color-ucw-green)"
                    : "var(--color-ucw-dark)",
                boxShadow: "0 4px 20px rgba(45,26,14,0.22)",
            }}
        >
            {paid ? "Confirmed!" : "I have paid"}

            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
            >
                <polyline points="20 6 9 17 4 12" />
            </svg>
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