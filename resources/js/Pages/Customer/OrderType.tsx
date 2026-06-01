import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import CustomerLayout from "@/Components/Layout/CustomerLayout";
import TopBar from "@/Components/customer/navigation/TopBar";
import CustomerDesktopHeader from "@/Components/customer/common/CustomerDesktopHeader";
import CheckoutSteps from "@/Components/customer/common/CheckoutSteps";
import type { OrderType } from "@/types/customer";

interface Props {
    tableId: string;
    tableNumber?: string;
    cartCount?: number;
}

export default function OrderTypePage({
    tableId,
    tableNumber = "05",
    cartCount = 0,
}: Props) {
    const [selected, setSelected] = useState<OrderType | null>(null);
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");

    function handleConfirm() {
        if (!selected) return;

        if (selected === "takeaway" && !name.trim()) {
            setNameError("Please enter your name.");
            return;
        }

        setNameError("");
        router.visit(route("customer.estimate", { tableId }));
    }

    return (
        <>
            <Head title="Order Details — UCW" />

            <CustomerLayout hideTopBar>
                {/* MOBILE */}
                <div
                    className="md:hidden min-h-svh flex flex-col"
                    style={{ backgroundColor: "var(--color-ucw-bg)" }}
                >
                    <TopBar
                        tableId={tableId}
                        title="Order Details"
                        subtitle={`Table ${tableNumber} • Dine In`}
                        showBack
                        backHref={route("customer.cart", { tableId })}
                    />

                    <div className="flex flex-col flex-1 px-5 pb-36">
                        <div className="pt-4 pb-6">
                            <CheckoutSteps activeStep={2} />
                            <PageHeading />
                        </div>

                        <div className="flex flex-col gap-3">
                            <DineInCard
                                selected={selected === "dine-in"}
                                tableNumber={tableNumber}
                                onSelect={() => {
                                    setSelected("dine-in");
                                    setNameError("");
                                }}
                            />

                            <TakeawayCard
                                selected={selected === "takeaway"}
                                name={name}
                                nameError={nameError}
                                onSelect={() => {
                                    setSelected("takeaway");
                                    setNameError("");
                                }}
                                onNameChange={(value) => {
                                    setName(value);
                                    setNameError("");
                                }}
                            />
                        </div>

                        
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
                            title="Order Details"
                            subtitle={`Table ${tableNumber} • Choose order type`}
                            backHref={route("customer.cart", { tableId })}
                            active="cart"
                        />

                        <div className="flex-1 max-w-4xl mx-auto w-full px-8 lg:px-10 py-8">
                            <CheckoutSteps activeStep={2} />

                            <div className="mt-8">
                                <PageHeading desktop />
                            </div>

                            <div className="grid grid-cols-2 gap-5 mt-6">
                                <DineInCard
                                    selected={selected === "dine-in"}
                                    tableNumber={tableNumber}
                                    onSelect={() => {
                                        setSelected("dine-in");
                                        setNameError("");
                                    }}
                                    desktop
                                />

                                <TakeawayCard
                                    selected={selected === "takeaway"}
                                    name={name}
                                    nameError={nameError}
                                    onSelect={() => {
                                        setSelected("takeaway");
                                        setNameError("");
                                    }}
                                    onNameChange={(value) => {
                                        setName(value);
                                        setNameError("");
                                    }}
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
                                Order Details
                            </h2>

                            <p
                                className="text-xs leading-relaxed"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                Step 2 of 3 — Choose how you would like to receive
                                your order.
                            </p>
                        </div>

                        <div className="flex-1 px-8 py-6 flex flex-col gap-5">
                            <SelectedSummary
                                selected={selected}
                                tableNumber={tableNumber}
                                name={name}
                            />

                            <ExpectationTips selected={selected} />
                        </div>

                        <div className="px-8 pb-8">
                            <ConfirmButton
                                selected={selected}
                                onConfirm={handleConfirm}
                            />

                            <Link
                                href={route("customer.cart", { tableId })}
                                className="w-full flex items-center justify-center mt-3 h-10 text-sm font-medium"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                ← Back to cart
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
                ORDER DETAILS
            </p>

            <h1
                className="font-black leading-[1.1] tracking-tight"
                style={{
                    fontSize: desktop ? "34px" : "30px",
                    color: "var(--color-ucw-dark)",
                }}
            >
                How would you like
                <br />
                to enjoy your coffee?
            </h1>

            <p
                className="mt-3 leading-relaxed max-w-[440px]"
                style={{
                    fontSize: desktop ? "14px" : "13px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                Choose dine-in if you want your order delivered to the table, or
                takeaway if you prefer to pick it up by name.
            </p>
        </div>
    );
}

function DineInCard({
    selected,
    tableNumber,
    onSelect,
    desktop = false,
}: {
    selected: boolean;
    tableNumber: string;
    onSelect: () => void;
    desktop?: boolean;
}) {
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
                <OptionIcon type="dine-in" />
                {selected && <SelectedPill />}
            </div>

            <h3
                className="font-black mb-1"
                style={{
                    fontSize: "19px",
                    color: selected
                        ? "var(--color-ucw-dark)"
                        : "var(--color-ucw-text)",
                }}
            >
                Dine-in
            </h3>

            <p
                className="leading-relaxed mb-4"
                style={{
                    fontSize: "13px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                Enjoy your drink in our curated creative space.
            </p>

            <div
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ backgroundColor: "var(--color-ucw-bg-warm)" }}
            >
                <span
                    className="font-semibold uppercase tracking-[0.12em]"
                    style={{
                        fontSize: "10px",
                        color: "var(--color-ucw-text-muted)",
                    }}
                >
                    YOUR SPOT
                </span>

                <span
                    className="font-black"
                    style={{
                        fontSize: "15px",
                        color: "var(--color-ucw-dark)",
                    }}
                >
                    Table {tableNumber}
                </span>
            </div>
        </button>
    );
}

function TakeawayCard({
    selected,
    name,
    nameError,
    onSelect,
    onNameChange,
    desktop = false,
}: {
    selected: boolean;
    name: string;
    nameError: string;
    onSelect: () => void;
    onNameChange: (value: string) => void;
    desktop?: boolean;
}) {
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
                <OptionIcon type="takeaway" />
                {selected && <SelectedPill />}
            </div>

            <h3
                className="font-black mb-1"
                style={{
                    fontSize: "19px",
                    color: selected
                        ? "var(--color-ucw-dark)"
                        : "var(--color-ucw-text)",
                }}
            >
                Takeaway
            </h3>

            <p
                className="leading-relaxed mb-4"
                style={{
                    fontSize: "13px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                Perfect if you are on the move or prefer pickup.
            </p>

            {selected ? (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-col gap-1.5"
                >
                    <label
                        className="font-semibold uppercase tracking-[0.12em]"
                        style={{
                            fontSize: "10px",
                            color: "var(--color-ucw-text-muted)",
                        }}
                    >
                        YOUR NAME
                    </label>

                    <input
                        type="text"
                        placeholder="Enter name for order"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        autoFocus
                        className="w-full h-12 px-4 rounded-xl outline-none transition-colors"
                        style={{
                            fontSize: "14px",
                            backgroundColor: "var(--color-ucw-bg-warm)",
                            border: `1.5px solid ${
                                nameError
                                    ? "var(--color-ucw-red)"
                                    : "var(--color-ucw-border)"
                            }`,
                            color: "var(--color-ucw-text)",
                        }}
                    />

                    {nameError && (
                        <p
                            style={{
                                fontSize: "11px",
                                color: "var(--color-ucw-red)",
                            }}
                        >
                            {nameError}
                        </p>
                    )}
                </div>
            ) : (
                <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ backgroundColor: "var(--color-ucw-bg-warm)" }}
                >
                    <span
                        className="font-semibold uppercase tracking-[0.12em]"
                        style={{
                            fontSize: "10px",
                            color: "var(--color-ucw-text-muted)",
                        }}
                    >
                        PICKUP BY
                    </span>

                    <span
                        className="font-black"
                        style={{
                            fontSize: "15px",
                            color: "var(--color-ucw-dark)",
                        }}
                    >
                        Name
                    </span>
                </div>
            )}
        </button>
    );
}

function SelectedSummary({
    selected,
    tableNumber,
    name,
}: {
    selected: OrderType | null;
    tableNumber: string;
    name: string;
}) {
    return (
        <div>
            <p
                className="text-xs font-semibold uppercase tracking-[0.12em] mb-3"
                style={{ color: "var(--color-ucw-text-muted)" }}
            >
                Your choice
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
                        {selected === "dine-in" ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="10" rx="2" />
                                <path d="M8 13v8M16 13v8M5 21h14" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p
                            className="font-bold text-sm"
                            style={{ color: "var(--color-ucw-dark)" }}
                        >
                            {selected === "dine-in" ? "Dine-in" : "Takeaway"}
                        </p>

                        <p
                            className="text-xs mt-0.5 truncate"
                            style={{ color: "var(--color-ucw-text-muted)" }}
                        >
                            {selected === "dine-in"
                                ? `Table ${tableNumber}`
                                : name
                                  ? `Name: ${name}`
                                  : "Enter your name"}
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
                    className="flex items-center gap-3 p-4 rounded-2xl"
                    style={{
                        background: "var(--color-ucw-border)",
                        border: "1px dashed var(--color-ucw-border-dark)",
                    }}
                >
                    <p
                        className="text-sm"
                        style={{ color: "var(--color-ucw-text-muted)" }}
                    >
                        No option selected yet
                    </p>
                </div>
            )}
        </div>
    );
}

function ExpectationTips({ selected }: { selected: OrderType | null }) {
    const tips =
        selected === "takeaway"
            ? [
                  { icon: "⏱", text: "Estimated wait: 5–10 minutes" },
                  { icon: "🏷", text: "Your order will be prepared by name" },
                  { icon: "🔔", text: "We'll notify you when it is ready" },
              ]
            : [
                  { icon: "⏱", text: "Estimated wait: 5–10 minutes" },
                  { icon: "📍", text: "Order delivered to your table" },
                  { icon: "🔔", text: "We'll notify you when it is ready" },
              ];

    return (
        <div className="flex flex-col gap-3">
            <p
                className="text-xs font-semibold uppercase tracking-[0.12em]"
                style={{ color: "var(--color-ucw-text-muted)" }}
            >
                What to expect
            </p>

            {tips.map((tip) => (
                <div key={tip.text} className="flex items-center gap-3">
                    <span className="text-base">{tip.icon}</span>
                    <span
                        className="text-xs"
                        style={{ color: "var(--color-ucw-text-muted)" }}
                    >
                        {tip.text}
                    </span>
                </div>
            ))}
        </div>
    );
}

function OptionIcon({ type }: { type: "dine-in" | "takeaway" }) {
    return (
        <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--color-ucw-bg-warm)" }}
        >
            {type === "dine-in" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="10" rx="2" />
                    <path d="M8 13v8M16 13v8M5 21h14" />
                </svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
            )}
        </div>
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



function ConfirmButton({
    selected,
    onConfirm,
}: {
    selected: OrderType | null;
    onConfirm: () => void;
}) {
    return (
        <button
            onClick={onConfirm}
            disabled={!selected}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl font-bold transition-all active:scale-[0.98]"
            style={{
                height: "54px",
                fontSize: "15px",
                backgroundColor: selected
                    ? "var(--color-ucw-dark)"
                    : "var(--color-ucw-border)",
                color: selected ? "white" : "var(--color-ucw-text-muted)",
                boxShadow: selected
                    ? "0 4px 20px rgba(45,26,14,0.25)"
                    : "none",
                cursor: selected ? "pointer" : "not-allowed",
            }}
        >
            Confirm Details

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
        </button>
    );
}