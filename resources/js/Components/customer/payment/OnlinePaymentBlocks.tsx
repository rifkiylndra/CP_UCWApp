import { Link } from "@inertiajs/react";
import QRCode from "react-qr-code";
import type { ReactNode } from "react";
import { formatIDR } from "@/lib/formatters";
import { getPaymentStatusLabel } from "@/lib/status";
import type { PaymentStatus } from "@/types/customer";

export type OnlinePaymentMethod = "qris" | "bri_va";

interface PaymentHeaderProps {
    total: number;
    orderRef: string;
    desktop?: boolean;
}

export function PaymentHeader({ total, orderRef, desktop = false }: PaymentHeaderProps) {
    return (
        <div className={desktop ? "" : "pt-5"}>
            <p
                className="font-semibold uppercase tracking-[0.15em] mb-2"
                style={{ fontSize: "10px", color: "var(--color-ucw-text-muted)" }}
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
                    style={{ fontSize: "10px", color: "var(--color-ucw-text-muted)" }}
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

                <p className="mt-2" style={{ fontSize: "12px", color: "var(--color-ucw-text-muted)" }}>
                    Order #{orderRef}
                </p>
            </div>
        </div>
    );
}

interface OnlinePaymentMethodCardProps {
    method: OnlinePaymentMethod;
    selected: boolean;
    onSelect: () => void;
    desktop?: boolean;
}

export function OnlinePaymentMethodCard({
    method,
    selected,
    onSelect,
    desktop = false,
}: OnlinePaymentMethodCardProps) {
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
                    {isQris ? <QrisIcon active={selected} /> : <BankIcon active={selected} />}
                </div>

                {selected && <SelectedPill />}
            </div>

            <h3 className="font-black mb-1" style={{ fontSize: "20px", color: "var(--color-ucw-dark)" }}>
                {isQris ? "QRIS" : "BRI Virtual Account"}
            </h3>

            <p className="leading-relaxed" style={{ fontSize: "13px", color: "var(--color-ucw-text-muted)" }}>
                {isQris
                    ? "Scan the QRIS code generated for this order."
                    : "Pay to the BRI virtual account generated for this order."}
            </p>
        </button>
    );
}

interface QrisPanelProps {
    paymentNumber: string;
    orderRef: string;
    totalPayment: number;
    expiredAt?: string | null;
}

export function QrisPanel({ paymentNumber, orderRef, totalPayment, expiredAt }: QrisPanelProps) {
    return (
        <PanelShell title="Scan QRIS" description="Scan this QRIS code and complete the exact payment amount.">
            <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: "var(--color-ucw-bg-warm)" }}>
                <div
                    className="mx-auto w-44 h-44 rounded-2xl flex items-center justify-center mb-4 p-4"
                    style={{ backgroundColor: "white" }}
                >
                    {paymentNumber ? <QRCode value={paymentNumber} size={144} /> : <QrisIcon active={false} large />}
                </div>

                <BankInfoRow label="Order" value={orderRef} />
                <BankInfoRow label="Amount" value={formatIDR(totalPayment)} important />
                <BankInfoRow label="Expires" value={formatExpiry(expiredAt)} />
            </div>
        </PanelShell>
    );
}

interface BriVaPanelProps {
    paymentNumber: string;
    orderRef: string;
    totalPayment: number;
    expiredAt?: string | null;
    copied: boolean;
    onCopy: () => void;
}

export function BriVaPanel({
    paymentNumber,
    orderRef,
    totalPayment,
    expiredAt,
    copied,
    onCopy,
}: BriVaPanelProps) {
    return (
        <PanelShell
            title="BRI Virtual Account"
            description="Transfer the exact total amount to the virtual account below."
        >
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

            <p className="mt-5 leading-relaxed" style={{ fontSize: "12px", color: "var(--color-ucw-text-muted)" }}>
                Pakasir will confirm this payment automatically after the transfer is completed.
            </p>
        </PanelShell>
    );
}

interface PanelShellProps {
    title: string;
    description: string;
    children: ReactNode;
}

function PanelShell({ title, description, children }: PanelShellProps) {
    return (
        <div
            className="rounded-3xl p-5"
            style={{ backgroundColor: "white", border: "1px solid var(--color-ucw-border)" }}
        >
            <h2 className="font-black mb-2" style={{ fontSize: "18px", color: "var(--color-ucw-dark)" }}>
                {title}
            </h2>

            <p className="leading-relaxed mb-5" style={{ fontSize: "13px", color: "var(--color-ucw-text-muted)" }}>
                {description}
            </p>

            {children}
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
                backgroundColor: important ? "var(--color-ucw-dark)" : "var(--color-ucw-bg-warm)",
            }}
        >
            <span
                className="font-semibold uppercase tracking-[0.12em]"
                style={{
                    fontSize: "10px",
                    color: important ? "rgba(255,255,255,0.55)" : "var(--color-ucw-text-muted)",
                }}
            >
                {label}
            </span>

            <span
                className="font-black text-right"
                style={{ fontSize: "14px", color: important ? "white" : "var(--color-ucw-dark)" }}
            >
                {value}
            </span>
        </div>
    );
}

export function PaymentSummaryCard({
    totalPayment,
    orderRef,
}: {
    totalPayment: number;
    orderRef: string;
}) {
    return (
        <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--color-ucw-dark)" }}>
            <p
                className="font-semibold uppercase tracking-[0.12em] mb-1"
                style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)" }}
            >
                TOTAL PAYMENT
            </p>

            <p className="font-black" style={{ fontSize: "28px", color: "white" }}>
                {formatIDR(totalPayment)}
            </p>

            <p className="mt-1" style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>
                Order #{orderRef}
            </p>
        </div>
    );
}

export function SelectedMethodSummary({ selected }: { selected: OnlinePaymentMethod }) {
    const isQris = selected === "qris";

    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: "var(--color-ucw-text-muted)" }}>
                Selected method
            </p>

            <div
                className="flex items-center gap-3 p-4 rounded-2xl"
                style={{ background: "var(--color-ucw-bg-warm)", border: "1px solid var(--color-ucw-border)" }}
            >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-ucw-dark)" }}>
                    {isQris ? <QrisIcon active small /> : <BankIcon active small />}
                </div>

                <div>
                    <p className="font-bold text-sm" style={{ color: "var(--color-ucw-dark)" }}>
                        {isQris ? "QRIS Pakasir" : "BRI Virtual Account"}
                    </p>

                    <p className="text-xs mt-0.5" style={{ color: "var(--color-ucw-text-muted)" }}>
                        {isQris ? "Scan generated QRIS" : "Use generated VA number"}
                    </p>
                </div>
            </div>
        </div>
    );
}

export function PaymentInstructions({
    method,
    compact = false,
}: {
    method: OnlinePaymentMethod;
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
                style={{ fontSize: "10px", color: "var(--color-ucw-text-muted)" }}
            >
                PAYMENT INSTRUCTIONS
            </p>

            <div className="flex flex-col gap-3">
                {steps.map((step, index) => (
                    <div key={step} className="flex gap-3">
                        <span
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-white"
                            style={{ fontSize: "10px", backgroundColor: "var(--color-ucw-dark)" }}
                        >
                            {index + 1}
                        </span>

                        <p className="leading-relaxed" style={{ fontSize: "13px", color: "var(--color-ucw-text-muted)" }}>
                            {step}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function PaymentStatusCard({
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
                title={getPaymentStatusLabel(status)}
                style={{ fontSize: "12px", color: isProblem ? "#92620A" : "var(--color-ucw-text-muted)" }}
            >
                {message}
            </p>
        </div>
    );
}

export function TrackPaymentButton({
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </button>
    );
}

export function ChangePaymentLink({ href }: { href: string }) {
    return (
        <Link
            href={href}
            className="w-full flex items-center justify-center mt-3 h-10 text-sm font-medium"
            style={{ color: "var(--color-ucw-text-muted)" }}
        >
            ← Change payment method
        </Link>
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

function SelectedPill() {
    return (
        <span
            className="px-3 py-1 rounded-full font-bold tracking-wider text-white"
            style={{ fontSize: "9px", backgroundColor: "var(--color-ucw-dark)" }}
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
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "var(--color-ucw-dark)"} strokeWidth="1.8" strokeLinecap="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="3" height="3" />
            <rect x="18" y="14" width="3" height="3" />
            <rect x="14" y="18" width="3" height="3" />
        </svg>
    );
}

function BankIcon({ active, small = false }: { active: boolean; small?: boolean }) {
    const size = small ? 16 : 22;

    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "var(--color-ucw-dark)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="22" x2="21" y2="22" />
            <line x1="6" y1="18" x2="6" y2="11" />
            <line x1="10" y1="18" x2="10" y2="11" />
            <line x1="14" y1="18" x2="14" y2="11" />
            <line x1="18" y1="18" x2="18" y2="11" />
            <polygon points="12 2 20 7 4 7" />
        </svg>
    );
}
