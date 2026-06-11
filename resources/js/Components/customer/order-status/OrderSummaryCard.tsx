import { getOrderStatusLabel, getPaymentStatusLabel } from "@/lib/status";
import type { OrderStatus, PaymentStatus } from "@/types/customer";

interface OrderSummaryCardProps {
    orderRef: string;
    tableNumber: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
}

export default function OrderSummaryCard({
    orderRef,
    tableNumber,
    status,
    paymentStatus,
}: OrderSummaryCardProps) {
    return (
        <div
            className="rounded-2xl p-5"
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
            <DetailRow label="Status" value={getOrderStatusLabel(status)} strong />
            <DetailRow label="Payment" value={getPaymentStatusLabel(paymentStatus)} />
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
