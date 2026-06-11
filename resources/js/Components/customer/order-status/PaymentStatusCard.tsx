import { getPaymentStatusLabel } from "@/lib/status";
import type { PaymentStatus } from "@/types/customer";

interface PaymentStatusCardProps {
    status: PaymentStatus;
    onPayAgain: () => void;
    isCreatingPayment: boolean;
    errorMessage?: string;
    className?: string;
}

export default function PaymentStatusCard({
    status,
    onPayAgain,
    isCreatingPayment,
    errorMessage,
    className = "",
}: PaymentStatusCardProps) {
    const isProblem = status === "expired" || status === "failed";

    return (
        <div
            className={`rounded-3xl p-5 ${className}`}
            style={{
                backgroundColor: "white",
                border: "1px solid var(--color-ucw-border)",
            }}
        >
            <p
                className="font-semibold uppercase tracking-[0.14em] mb-2"
                style={{ fontSize: "10px", color: "var(--color-ucw-text-muted)" }}
            >
                PAYMENT STATUS
            </p>

            <p
                className="font-black"
                style={{ fontSize: "18px", color: "var(--color-ucw-dark)" }}
            >
                {getPaymentStatusLabel(status)}
            </p>

            {errorMessage && (
                <p
                    className="mt-2 leading-relaxed"
                    style={{ fontSize: "12px", color: "#92620A" }}
                >
                    {errorMessage}
                </p>
            )}

            {isProblem && (
                <button
                    onClick={onPayAgain}
                    disabled={isCreatingPayment}
                    className="mt-4 w-full h-11 rounded-xl font-bold text-white transition-all active:scale-[0.98]"
                    style={{ backgroundColor: "var(--color-ucw-dark)" }}
                >
                    {isCreatingPayment ? "Creating Payment..." : "Pay Again"}
                </button>
            )}
        </div>
    );
}
