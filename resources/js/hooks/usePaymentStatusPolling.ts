import { useEffect } from "react";
import axios from "axios";
import type { CustomerPaymentStatusResponse, PaymentStatus } from "@/types/customer";

interface UsePaymentStatusPollingOptions {
    orderRef: string;
    currentPaymentStatus: PaymentStatus;
    intervalMs?: number;
    onStatusChange: (status: PaymentStatus) => void;
    onPaid: () => void;
    onMessageChange: (message: string) => void;
}

export function usePaymentStatusPolling({
    orderRef,
    currentPaymentStatus,
    intervalMs = 7000,
    onStatusChange,
    onPaid,
    onMessageChange,
}: UsePaymentStatusPollingOptions) {
    useEffect(() => {
        if (!orderRef || orderRef === "-") return;

        let cancelled = false;

        async function pollPaymentStatus() {
            try {
                const res = await axios.get<CustomerPaymentStatusResponse>(
                    `/customer/order/${encodeURIComponent(orderRef)}/payment/status`,
                );

                if (cancelled) return;

                const nextPaymentStatus = res.data.paymentStatus ?? res.data.payment_status;

                if (nextPaymentStatus) {
                    onStatusChange(nextPaymentStatus);
                }

                if (nextPaymentStatus === "paid") {
                    onPaid();
                    return;
                }

                if (nextPaymentStatus === "expired") {
                    onMessageChange("Payment has expired. Please create a new payment.");
                    return;
                }

                if (nextPaymentStatus === "failed") {
                    onMessageChange("Payment failed. Please create a new payment.");
                    return;
                }

                onMessageChange("Waiting for Pakasir payment confirmation.");
            } catch {
                if (!cancelled && currentPaymentStatus === "unpaid") {
                    onMessageChange("Still waiting for payment confirmation. We will retry shortly.");
                }
            }
        }

        pollPaymentStatus();
        const interval = window.setInterval(pollPaymentStatus, intervalMs);

        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, [
        orderRef,
        currentPaymentStatus,
        intervalMs,
        onStatusChange,
        onPaid,
        onMessageChange,
    ]);
}
