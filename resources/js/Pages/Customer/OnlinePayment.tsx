import { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";

interface Props {
    tableId: string;
    orderId?: string;
    orderRef?: string;
    total?: number;
    orderTime?: string;
    cartCount?: number;
}

type MethodTab = "qris" | "ewallet" | "bank";

function formatIDR(n: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(n);
}

export default function OnlinePayment({
    tableId,
    orderId = "ORD-8829",
    orderRef = "EB-94021",
    total = 245000,
    orderTime = "10:45 AM",
    cartCount = 0,
}: Props) {
    const [selected, setSelected] = useState<MethodTab>("qris");
    const [timeLeft, setTimeLeft] = useState(300);
    const [isExpired, setIsExpired] = useState(false);
    const [paid, setPaid] = useState(false);

    useEffect(() => {
        if (selected !== "qris") return;
        setTimeLeft(300);
        setIsExpired(false);
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsExpired(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [selected]);

    const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const secs = String(timeLeft % 60).padStart(2, "0");

    function handlePaid() {
        setPaid(true);
        setTimeout(
            () => router.visit(route("customer.status", { tableId, orderId })),
            800,
        );
    }

    const METHODS: {
        key: MethodTab;
        label: string;
        sub: string;
        icon: React.ReactNode;
    }[] = [
        {
            key: "qris",
            label: "QRIS",
            sub: "INSTANT VERIFICATION",
            icon: (
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-ucw-dark)"
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
            ),
        },
        {
            key: "ewallet",
            label: "E-Wallet",
            sub: "GoPay, OVO, or Dana",
            icon: (
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-ucw-dark)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M16 12h.01" strokeWidth="2.5" />
                    <path d="M2 10h20" />
                </svg>
            ),
        },
        {
            key: "bank",
            label: "Bank Transfer",
            sub: "Virtual Account",
            icon: (
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-ucw-dark)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                >
                    <line x1="3" y1="22" x2="21" y2="22" />
                    <line x1="6" y1="18" x2="6" y2="11" />
                    <line x1="10" y1="18" x2="10" y2="11" />
                    <line x1="14" y1="18" x2="14" y2="11" />
                    <line x1="18" y1="18" x2="18" y2="11" />
                    <polygon points="12 2 20 7 4 7" />
                </svg>
            ),
        },
    ];

    return (
        <>
            <Head title="Online Payment — UCW" />
            <CustomerLayout hideTopBar>
                {/* ══════════════════════════════════════════════
                    MOBILE
                ══════════════════════════════════════════════ */}
                <div
                    className="md:hidden min-h-svh flex flex-col"
                    style={{ backgroundColor: "#F8F7F5" }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 pt-5 pb-4">
                        <button
                            onClick={() =>
                                router.visit(
                                    route("customer.payment", { tableId }),
                                )
                            }
                            className="w-9 h-9 flex items-center justify-center"
                            style={{ color: "var(--color-ucw-dark)" }}
                        >
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M19 12H5" />
                                <path d="M12 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <h1
                            className="font-black text-base"
                            style={{ color: "var(--color-ucw-dark)" }}
                        >
                            UNAND CO-WORKSPACE
                        </h1>

                        <button
                            className="w-9 h-9 flex items-center justify-center"
                            style={{ color: "var(--color-ucw-dark)" }}
                        >
                            <svg
                                width="21"
                                height="21"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.1 9a3 3 0 1 1 5.8 1c-.5.9-1.4 1.3-2.1 1.9-.6.5-.8.9-.8 1.6" />
                                <path d="M12 17h.01" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 px-6 pb-36">
                        {/* Amount */}
                        <div className="text-center pt-10 pb-11">
                            <p
                                className="uppercase tracking-[0.18em] mb-3"
                                style={{
                                    fontSize: "10px",
                                    color: "var(--color-ucw-text-muted)",
                                }}
                            >
                                TOTAL AMOUNT DUE
                            </p>

                            <h2
                                className="font-black leading-none"
                                style={{
                                    fontSize: "36px",
                                    color: "var(--color-ucw-dark)",
                                }}
                            >
                                {formatIDR(total)}
                            </h2>

                            <div
                                className="inline-flex items-center gap-2 mt-5 px-4 h-7 rounded-full"
                                style={{
                                    backgroundColor: "#DDEFD8",
                                    color: "#526B4E",
                                    fontSize: "12px",
                                }}
                            >
                                <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M7 2h10v2H7z" />
                                    <path d="M11 13V8h2v6l4 2-.9 1.8z" />
                                    <path
                                        d="M12 4a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"
                                        fill="currentColor"
                                        opacity=".9"
                                    />
                                </svg>
                                Pay before 14:20 ({mins}m {secs}s)
                            </div>
                        </div>

                        {/* QRIS Card */}
                        <div
                            className="rounded-[30px] px-6 pt-8 pb-7 text-center"
                            style={{ backgroundColor: "white" }}
                        >
                            <div
                                className="mx-auto rounded-xl overflow-hidden mb-6"
                                style={{
                                    width: "250px",
                                    maxWidth: "100%",
                                    backgroundColor: "#F1F1F1",
                                }}
                            >
                                <img
                                    src="/images/qris-demo.png"
                                    alt="QRIS Payment Code"
                                    className="w-full h-auto object-contain"
                                />
                            </div>

                            <div className="flex justify-center gap-4 mb-7">
                                {["GPay", "OVO", "Dana", "LinkAja"].map(
                                    (name) => (
                                        <div
                                            key={name}
                                            className="w-6 h-6 flex items-center justify-center text-[7px] text-white"
                                            style={{
                                                backgroundColor: "#6F6F6F",
                                            }}
                                        >
                                            {name}
                                        </div>
                                    ),
                                )}
                            </div>

                            <h3
                                className="font-black text-lg mb-2"
                                style={{ color: "var(--color-ucw-dark)" }}
                            >
                                Scan with QRIS
                            </h3>

                            <p
                                className="leading-relaxed mx-auto"
                                style={{
                                    fontSize: "14px",
                                    color: "var(--color-ucw-text-muted)",
                                    maxWidth: "260px",
                                }}
                            >
                                Save QR or scan directly from your e-wallet app
                                to pay instantly.
                            </p>
                        </div>

                        {/* Other payment methods */}
                        <div className="mt-6 flex flex-col gap-7">
                            <PaymentOptionCard
                                title="Bank Transfer"
                                subtitle="BCA, Mandiri, BNI, BRI"
                                type="bank"
                                onClick={() => setSelected("bank")}
                            />

                            <PaymentOptionCard
                                title="E-Wallets"
                                subtitle="GoPay, OVO, Dana, LinkAja"
                                type="wallet"
                                onClick={() => setSelected("ewallet")}
                            />
                        </div>

                        {/* Instructions */}
                        <div className="mt-14">
                            <p
                                className="text-center uppercase tracking-[0.18em] mb-7"
                                style={{
                                    fontSize: "10px",
                                    color: "var(--color-ucw-text-muted)",
                                }}
                            >
                                PAYMENT INSTRUCTIONS
                            </p>

                            <PaymentStep
                                number="01"
                                title="Download or Screenshot QR Code"
                            >
                                Save the QRIS code above to your phone&apos;s
                                gallery.
                            </PaymentStep>

                            <PaymentStep
                                number="02"
                                title="Open Your Payment App"
                            >
                                Navigate to the &apos;Scan&apos; or &apos;QR
                                Pay&apos; feature in your preferred banking or
                                e-wallet app.
                            </PaymentStep>

                            <PaymentStep number="03" title="Confirm & Pay">
                                Select the QR image from gallery, verify the
                                amount, and enter your PIN.
                            </PaymentStep>
                        </div>

                        <div
                            className="flex items-center justify-center gap-2 mt-14 uppercase tracking-[0.15em]"
                            style={{
                                fontSize: "10px",
                                color: "var(--color-ucw-text-muted)",
                            }}
                        >
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <rect
                                    x="5"
                                    y="11"
                                    width="14"
                                    height="10"
                                    rx="2"
                                />
                                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                            </svg>
                            Secure 256-bit SSL Payment
                        </div>
                    </div>

                    {/* Fixed bottom CTA */}
                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-6 pt-5 pb-7 z-50"
                        style={{ backgroundColor: "#F8F7F5" }}
                    >
                        <PaidButton paid={paid} onPaid={handlePaid} />

                        <p
                            className="text-center mt-4 uppercase tracking-[-0.02em]"
                            style={{
                                fontSize: "9px",
                                color: "var(--color-ucw-text-muted)",
                            }}
                        >
                            YOUR BOOKING WILL BE CONFIRMED AUTOMATICALLY AFTER
                            PAYMENT
                        </p>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════
                    DESKTOP — two columns
                ══════════════════════════════════════════════ */}
                <div
                    className="hidden md:flex min-h-svh"
                    style={{ backgroundColor: "#E8E1D8" }}
                >
                    {/* Left: method selection */}
                    <main className="flex-1 overflow-y-auto flex flex-col">
                        {/* Top bar */}
                        <div
                            className="sticky top-0 z-30 flex items-center justify-between px-10 py-5"
                            style={{
                                background: "var(--color-ucw-bg)",
                                borderBottom:
                                    "1px solid var(--color-ucw-border)",
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route("customer.payment", {
                                        tableId,
                                    })}
                                    className="w-9 h-9 rounded-full flex items-center justify-center"
                                    style={{
                                        backgroundColor:
                                            "var(--color-ucw-border)",
                                    }}
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="var(--color-ucw-dark)"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    >
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                </Link>
                                <div className="flex items-center gap-2">
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="var(--color-ucw-dark)"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    >
                                        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                                        <line x1="6" y1="1" x2="6" y2="4" />
                                        <line x1="10" y1="1" x2="10" y2="4" />
                                        <line x1="14" y1="1" x2="14" y2="4" />
                                    </svg>
                                    <span
                                        className="font-bold text-sm tracking-[0.04em]"
                                        style={{
                                            color: "var(--color-ucw-dark)",
                                        }}
                                    >
                                        UNAND CO-WORKSPACE
                                    </span>
                                </div>
                            </div>
                            <span
                                className="text-xs font-semibold uppercase tracking-[0.12em]"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                Secure Checkout
                            </span>
                        </div>

                        <div className="flex-1 max-w-xl mx-auto w-full px-10 py-10">
                            <OrderTotalHeader
                                total={total}
                                orderRef={orderRef}
                                orderTime={orderTime}
                                desktop
                            />

                            <h2
                                className="font-bold mb-5"
                                style={{
                                    fontSize: "18px",
                                    color: "var(--color-ucw-dark)",
                                }}
                            >
                                Choose Payment Method
                            </h2>

                            <div className="flex flex-col gap-3">
                                {METHODS.map((m) => (
                                    <MethodCard
                                        key={m.key}
                                        method={m}
                                        selected={selected === m.key}
                                        onSelect={() => setSelected(m.key)}
                                        isQris={m.key === "qris"}
                                        mins={mins}
                                        secs={secs}
                                        isExpired={isExpired}
                                        desktop
                                    />
                                ))}
                            </div>
                        </div>
                    </main>

                    {/* Right: summary + CTA */}
                    <aside
                        className="w-[300px] shrink-0 sticky top-0 h-svh overflow-y-auto flex flex-col"
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
                                Payment
                            </h2>
                            <p
                                className="text-xs"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                Order #{orderRef}
                            </p>
                        </div>

                        <div className="flex-1 px-8 py-6 flex flex-col gap-5">
                            {/* Selected method badge */}
                            <div>
                                <p
                                    className="text-xs font-semibold uppercase tracking-[0.12em] mb-3"
                                    style={{
                                        color: "var(--color-ucw-text-muted)",
                                    }}
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
                                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                                        style={{
                                            backgroundColor:
                                                "var(--color-ucw-dark)",
                                        }}
                                    >
                                        {
                                            METHODS.find(
                                                (m) => m.key === selected,
                                            )?.icon
                                        }
                                    </div>
                                    <div>
                                        <p
                                            className="font-bold text-sm"
                                            style={{
                                                color: "var(--color-ucw-dark)",
                                            }}
                                        >
                                            {
                                                METHODS.find(
                                                    (m) => m.key === selected,
                                                )?.label
                                            }
                                        </p>
                                        <p
                                            className="text-[10px] uppercase tracking-wider mt-0.5"
                                            style={{
                                                color: "var(--color-ucw-text-muted)",
                                            }}
                                        >
                                            {
                                                METHODS.find(
                                                    (m) => m.key === selected,
                                                )?.sub
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Total */}
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
                                    ORDER TOTAL
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
                                    Incl. all taxes and fees
                                </p>
                            </div>

                            {/* Timer (qris only) */}
                            {selected === "qris" && (
                                <div
                                    className="flex items-center gap-2 px-4 py-3 rounded-xl"
                                    style={{
                                        background: "var(--color-ucw-bg-warm)",
                                        border: "1px solid var(--color-ucw-border)",
                                    }}
                                >
                                    <svg
                                        width="13"
                                        height="13"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke={
                                            isExpired
                                                ? "var(--color-ucw-red)"
                                                : "var(--color-ucw-text-muted)"
                                        }
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <span
                                        style={{
                                            fontSize: "12px",
                                            color: isExpired
                                                ? "var(--color-ucw-red)"
                                                : "var(--color-ucw-text-muted)",
                                            fontVariantNumeric: "tabular-nums",
                                        }}
                                    >
                                        {isExpired
                                            ? "QR Expired — refresh to regenerate"
                                            : `QR expires in ${mins}:${secs}`}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="px-8 pb-8 flex flex-col gap-3">
                            <PaidButton paid={paid} onPaid={handlePaid} />
                            <p
                                className="text-center uppercase tracking-[0.12em]"
                                style={{
                                    fontSize: "9px",
                                    color: "var(--color-ucw-text-muted)",
                                }}
                            >
                                VERIFICATION TAKES 10–30 SECONDS
                            </p>
                        </div>
                    </aside>
                </div>
            </CustomerLayout>
        </>
    );
}

/* ─── Sub-components ─── */

function OrderTotalHeader({
    total,
    orderRef,
    orderTime,
    desktop = false,
}: {
    total: number;
    orderRef?: string;
    orderTime?: string;
    desktop?: boolean;
}) {
    return (
        <div className={`text-center ${desktop ? "mb-8" : "mb-6"}`}>
            <p
                className="font-semibold uppercase tracking-[0.14em] mb-1"
                style={{
                    fontSize: "10px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                ORDER TOTAL
            </p>
            <p
                className="font-black leading-none mb-1"
                style={{
                    fontSize: desktop ? "44px" : "38px",
                    color: "var(--color-ucw-dark)",
                }}
            >
                {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                }).format(total)}
            </p>
            <p
                style={{
                    fontSize: "12px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                Order #{orderRef} • Today, {orderTime}
            </p>
        </div>
    );
}

function MethodCard({
    method,
    selected,
    onSelect,
    isQris,
    mins,
    secs,
    isExpired,
    desktop = false,
}: {
    method: {
        key: MethodTab;
        label: string;
        sub: string;
        icon: React.ReactNode;
    };
    selected: boolean;
    onSelect: () => void;
    isQris: boolean;
    mins: string;
    secs: string;
    isExpired: boolean;
    desktop?: boolean;
}) {
    const Checkmark = () => (
        <div
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: "var(--color-ucw-dark)" }}
        >
            <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
            >
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </div>
    );

    return (
        <div
            className="rounded-2xl overflow-hidden transition-all duration-300"
            style={{
                border: `1.5px solid ${selected ? "var(--color-ucw-dark)" : "var(--color-ucw-border)"}`,
                backgroundColor: "white",
            }}
        >
            <button
                onClick={onSelect}
                className="w-full flex items-center gap-3 p-4 text-left"
            >
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--color-ucw-bg-warm)" }}
                >
                    {method.icon}
                </div>
                <div className="flex-1">
                    <p
                        className="font-bold"
                        style={{
                            fontSize: "15px",
                            color: "var(--color-ucw-dark)",
                        }}
                    >
                        {method.label}
                    </p>
                    <p
                        style={{
                            fontSize: "11px",
                            color: "var(--color-ucw-text-muted)",
                        }}
                    >
                        {method.sub}
                    </p>
                </div>
                {selected && <Checkmark />}
            </button>

            {/* QRIS expanded panel */}
            {selected && isQris && (
                <div className="px-4 pb-5">
                    <div
                        className="rounded-xl p-4 mb-4"
                        style={{ backgroundColor: "var(--color-ucw-bg-warm)" }}
                    >
                        {[
                            "Scan the QR code with your payment app.",
                            "Verify the merchant name Unand Co-Workspace.",
                        ].map((text, i) => (
                            <div key={i} className="flex gap-3 mb-2 last:mb-0">
                                <span
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                                    style={{
                                        fontSize: "10px",
                                        backgroundColor:
                                            "var(--color-ucw-dark)",
                                        marginTop: "1px",
                                    }}
                                >
                                    {i + 1}
                                </span>
                                <p
                                    style={{
                                        fontSize: "13px",
                                        color: "var(--color-ucw-text)",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    {text}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* QR placeholder */}
                    <div
                        className="rounded-2xl flex flex-col items-center py-6"
                        style={{ backgroundColor: "var(--color-ucw-bg-warm)" }}
                    >
                        <div
                            className="w-[160px] h-[160px] rounded-xl mb-4 flex items-center justify-center"
                            style={{
                                backgroundColor: "var(--color-ucw-border)",
                            }}
                        >
                            <svg
                                width="120"
                                height="120"
                                viewBox="0 0 120 120"
                                fill="none"
                            >
                                <rect
                                    x="8"
                                    y="8"
                                    width="28"
                                    height="28"
                                    fill="var(--color-ucw-dark)"
                                    rx="3"
                                />
                                <rect
                                    x="12"
                                    y="12"
                                    width="20"
                                    height="20"
                                    fill="var(--color-ucw-bg)"
                                    rx="1"
                                />
                                <rect
                                    x="16"
                                    y="16"
                                    width="12"
                                    height="12"
                                    fill="var(--color-ucw-dark)"
                                    rx="1"
                                />
                                <rect
                                    x="84"
                                    y="8"
                                    width="28"
                                    height="28"
                                    fill="var(--color-ucw-dark)"
                                    rx="3"
                                />
                                <rect
                                    x="88"
                                    y="12"
                                    width="20"
                                    height="20"
                                    fill="var(--color-ucw-bg)"
                                    rx="1"
                                />
                                <rect
                                    x="92"
                                    y="16"
                                    width="12"
                                    height="12"
                                    fill="var(--color-ucw-dark)"
                                    rx="1"
                                />
                                <rect
                                    x="8"
                                    y="84"
                                    width="28"
                                    height="28"
                                    fill="var(--color-ucw-dark)"
                                    rx="3"
                                />
                                <rect
                                    x="12"
                                    y="88"
                                    width="20"
                                    height="20"
                                    fill="var(--color-ucw-bg)"
                                    rx="1"
                                />
                                <rect
                                    x="16"
                                    y="92"
                                    width="12"
                                    height="12"
                                    fill="var(--color-ucw-dark)"
                                    rx="1"
                                />
                                {[44, 50, 56, 62, 68, 74].map((x) =>
                                    [44, 50, 56, 62, 68, 74].map((y) =>
                                        (x + y) % 12 < 6 ? (
                                            <rect
                                                key={`${x}-${y}`}
                                                x={x}
                                                y={y}
                                                width="4"
                                                height="4"
                                                fill="var(--color-ucw-dark)"
                                                rx="0.5"
                                            />
                                        ) : null,
                                    ),
                                )}
                            </svg>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={
                                    isExpired
                                        ? "var(--color-ucw-red)"
                                        : "var(--color-ucw-text-muted)"
                                }
                                strokeWidth="2"
                                strokeLinecap="round"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span
                                style={{
                                    fontSize: "12px",
                                    color: isExpired
                                        ? "var(--color-ucw-red)"
                                        : "var(--color-ucw-text-muted)",
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {isExpired
                                    ? "QR Expired"
                                    : `Expires in ${mins}:${secs}`}
                            </span>
                        </div>
                        <p
                            className="font-bold uppercase tracking-[0.12em]"
                            style={{
                                fontSize: "10px",
                                color: "var(--color-ucw-text-muted)",
                            }}
                        >
                            SCAN TO PAY
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

function PaidButton({ paid, onPaid }: { paid: boolean; onPaid: () => void }) {
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

function PaymentOptionCard({
    title,
    subtitle,
    type,
    onClick,
}: {
    title: string;
    subtitle: string;
    type: 'bank' | 'wallet';
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="w-full rounded-[28px] px-6 py-6 flex items-center text-left transition-all active:scale-[0.98]"
            style={{ backgroundColor: '#F3F2F1' }}
        >
            <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mr-5"
                style={{ backgroundColor: 'white', color: 'var(--color-ucw-dark)' }}
            >
                {type === 'bank' ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21h18" />
                        <path d="M5 21V10h14v11" />
                        <path d="M7 10V7l5-3 5 3v3" />
                        <path d="M9 21v-6" />
                        <path d="M15 21v-6" />
                    </svg>
                ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="M16 12h.01" />
                        <path d="M3 9h18" />
                    </svg>
                )}
            </div>

            <div className="flex-1">
                <h3 className="font-black mb-1" style={{ fontSize: '16px', color: 'var(--color-ucw-dark)' }}>
                    {title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-ucw-text-muted)' }}>
                    {subtitle}
                </p>
            </div>

            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CDBBB4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
            </svg>
        </button>
    );
}

function PaymentStep({
    number,
    title,
    children,
}: {
    number: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex gap-6 mb-9 last:mb-0">
            <span
                className="font-black leading-none shrink-0"
                style={{ fontSize: '28px', color: '#EAE4E1' }}
            >
                {number}
            </span>

            <div>
                <h4 className="font-black mb-1.5" style={{ fontSize: '15px', color: 'var(--color-ucw-dark)' }}>
                    {title}
                </h4>
                <p className="leading-relaxed" style={{ fontSize: '14px', color: 'var(--color-ucw-text-muted)' }}>
                    {children}
                </p>
            </div>
        </div>
    );
}
