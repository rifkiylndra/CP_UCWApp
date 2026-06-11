import { useEffect } from "react";
import axios from "axios";
import type {
    CustomerPaymentStatusResponse,
    OrderStatus,
    PaymentMethod,
    PaymentStatus,
} from "@/types/customer";

interface UseOrderStatusPollingOptions {
    orderRef: string;
    onOrderStatus: (status: OrderStatus) => void;
    onPaymentStatus: (status: PaymentStatus) => void;
    onPaymentMethod: (method: PaymentMethod) => void;
    onCreatedAt: (createdAt: string) => void;
    onUpdatedAt: (updatedAt: string) => void;
    onEstimatedServeTime: (estimatedServeTime: number) => void;
    onStatusError: (message: string) => void;
}

export function useOrderStatusPolling({
    orderRef,
    onOrderStatus,
    onPaymentStatus,
    onPaymentMethod,
    onCreatedAt,
    onUpdatedAt,
    onEstimatedServeTime,
    onStatusError,
}: UseOrderStatusPollingOptions) {
    useEffect(() => {
        if (!orderRef || orderRef === "-") return;

        let cancelled = false;
        let failedPolls = 0;

        async function pollStatus() {
            try {
                const res = await axios.get<CustomerPaymentStatusResponse>(
                    `/customer/order/${encodeURIComponent(orderRef)}/payment/status`,
                );
                if (cancelled) return;

                const nextOrderStatus = res.data.orderStatus ?? res.data.order_status;
                const nextPaymentStatus = res.data.paymentStatus ?? res.data.payment_status;
                const nextPaymentMethod = res.data.paymentMethod ?? res.data.payment_method;
                const nextCreatedAt = res.data.createdAt ?? res.data.created_at;
                const nextUpdatedAt = res.data.updatedAt ?? res.data.updated_at;
                const nextEstimatedServeTime =
                    res.data.estimatedServeTime ?? res.data.estimated_serve_time;

                if (nextOrderStatus) onOrderStatus(nextOrderStatus);
                if (nextPaymentStatus) onPaymentStatus(nextPaymentStatus);
                if (nextPaymentMethod) onPaymentMethod(nextPaymentMethod);
                if (nextCreatedAt) onCreatedAt(nextCreatedAt);
                if (nextUpdatedAt) onUpdatedAt(nextUpdatedAt);
                if (nextEstimatedServeTime) onEstimatedServeTime(nextEstimatedServeTime);

                failedPolls = 0;
                onStatusError("");
            } catch {
                if (!cancelled) {
                    failedPolls += 1;

                    if (failedPolls >= 3) {
                        onStatusError("Could not refresh order status. We will retry shortly.");
                    }
                }
            }
        }

        const interval = window.setInterval(pollStatus, 3000);
        pollStatus();

        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, [
        orderRef,
        onOrderStatus,
        onPaymentStatus,
        onPaymentMethod,
        onCreatedAt,
        onUpdatedAt,
        onEstimatedServeTime,
        onStatusError,
    ]);
}
