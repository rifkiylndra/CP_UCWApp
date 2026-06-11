import { formatIDR } from "@/lib/formatters";
import { getPaymentMethodLabel } from "@/lib/status";

export type PaymentChoice = "qris" | "bri_va" | "cash" | null;
export type ConcretePaymentChoice = Exclude<PaymentChoice, null>;

interface PaymentMethodCardProps {
    type: ConcretePaymentChoice;
    selected: boolean;
    onSelect: () => void;
    desktop?: boolean;
}

export function PaymentMethodCard({
    type,
    selected,
    onSelect,
    desktop = false,
}: PaymentMethodCardProps) {
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

            <h3 className="font-black mb-1" style={{ fontSize: "20px", color: "var(--color-ucw-dark)" }}>
                {getPaymentMethodTitle(type)}
            </h3>

            <p className="mb-4 leading-relaxed" style={{ fontSize: "13px", color: "var(--color-ucw-text-muted)" }}>
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
                        color: selected ? "var(--color-ucw-dark)" : "var(--color-ucw-text-muted)",
                    }}
                >
                    {isCash ? "Pay on-site" : "Secure Pakasir payment"}
                </span>

                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={selected ? "var(--color-ucw-dark)" : "var(--color-ucw-text-muted)"} strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </div>
        </button>
    );
}

export function SelectedPaymentSummary({ selected }: { selected: PaymentChoice }) {
    const title = selected ? getPaymentMethodTitle(selected) : "No method selected";
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
            <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: "var(--color-ucw-text-muted)" }}>
                Payment method
            </p>

            {selected ? (
                <div
                    className="flex items-center gap-3 p-4 rounded-2xl"
                    style={{ background: "var(--color-ucw-bg-warm)", border: "1px solid var(--color-ucw-border)" }}
                >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-ucw-dark)" }}>
                        {selected === "cash" ? <CashIcon active small /> : <OnlineIcon active small />}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm" style={{ color: "var(--color-ucw-dark)" }}>
                            {title}
                        </p>

                        <p className="text-xs mt-0.5 truncate" style={{ color: "var(--color-ucw-text-muted)" }}>
                            {subtitle}
                        </p>
                    </div>

                    <span className="text-[9px] font-bold px-2.5 py-1 rounded-full text-white shrink-0" style={{ backgroundColor: "var(--color-ucw-dark)" }}>
                        SELECTED
                    </span>
                </div>
            ) : (
                <div
                    className="p-4 rounded-2xl"
                    style={{ background: "var(--color-ucw-border)", border: "1px dashed var(--color-ucw-border-dark)" }}
                >
                    <p className="text-sm" style={{ color: "var(--color-ucw-text-muted)" }}>
                        No method selected yet
                    </p>
                </div>
            )}
        </div>
    );
}

export function TotalCard({ total, compact = false }: { total: number; compact?: boolean }) {
    return (
        <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid var(--color-ucw-border)" }}>
            <p
                className="font-semibold uppercase tracking-[0.12em] mb-1"
                style={{ fontSize: "10px", color: "var(--color-ucw-text-muted)" }}
            >
                TOTAL PAYMENT
            </p>

            <p className="font-black leading-tight" style={{ fontSize: compact ? "24px" : "30px", color: "var(--color-ucw-dark)" }}>
                {formatIDR(total)}
            </p>

            <p className="mt-1" style={{ fontSize: "11px", color: "var(--color-ucw-text-muted)" }}>
                Based on selected menu items.
            </p>
        </div>
    );
}

export function ConfirmPaymentButton({
    selected,
    onConfirm,
    isLoading = false,
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
                backgroundColor: isLoading || !selected ? "var(--color-ucw-border)" : "var(--color-ucw-dark)",
                color: isLoading || !selected ? "var(--color-ucw-text-muted)" : "white",
                boxShadow: selected && !isLoading ? "0 4px 20px rgba(45,26,14,0.25)" : "none",
                cursor: selected && !isLoading ? "pointer" : "not-allowed",
            }}
        >
            {isLoading
                ? "Processing..."
                : selected === "qris"
                  ? "Create QRIS Payment"
                  : selected === "bri_va"
                    ? "Create BRI VA Payment"
                    : selected === "cash"
                      ? "Continue with Cash"
                      : "Select Payment Method"}

            {!isLoading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            )}
        </button>
    );
}

export function PaymentError({ message }: { message: string }) {
    return (
        <div
            className="rounded-2xl px-4 py-3 mb-4"
            style={{ backgroundColor: "var(--color-ucw-amber-bg)", border: "1px solid var(--color-ucw-amber)" }}
        >
            <p className="font-semibold" style={{ fontSize: "12px", color: "#92620A" }}>
                {message}
            </p>
        </div>
    );
}

function getPaymentMethodTitle(type: ConcretePaymentChoice) {
    if (type === "cash") return "Cash at Cashier";
    if (type === "bri_va") return getPaymentMethodLabel("bri_va_pakasir");
    return getPaymentMethodLabel("qris_pakasir");
}

function SelectedPill() {
    return (
        <span className="px-3 py-1 rounded-full font-bold tracking-wider text-white" style={{ fontSize: "9px", backgroundColor: "var(--color-ucw-dark)" }}>
            SELECTED
        </span>
    );
}

function OnlineIcon({ active, small = false }: { active: boolean; small?: boolean }) {
    return (
        <svg width={small ? "16" : "22"} height={small ? "16" : "22"} viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "var(--color-ucw-dark)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M16 12h.01" strokeWidth="2.5" />
            <path d="M2 10h20" />
        </svg>
    );
}

function CashIcon({ active, small = false }: { active: boolean; small?: boolean }) {
    return (
        <svg width={small ? "16" : "22"} height={small ? "16" : "22"} viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "var(--color-ucw-dark)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
                <div key={label} className="h-8 px-2.5 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--color-ucw-bg-warm)" }}>
                    <span className="font-bold" style={{ fontSize: "9px", color: "var(--color-ucw-dark)" }}>
                        {label}
                    </span>
                </div>
            ))}
        </div>
    );
}

function CashMethodInfo() {
    return (
        <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "var(--color-ucw-bg-warm)" }}>
            <p style={{ fontSize: "12px", color: "var(--color-ucw-text-muted)" }}>
                Please prepare exact cash or pay at the cashier counter.
            </p>
        </div>
    );
}
