import { useEffect } from "react";
import type { OrderStatus, PaymentStatus } from "@/types/customer";

interface EchoChannel {
    listen: (event: string, callback: (event: OrderStatusEvent | PaymentStatusEvent) => void) => EchoChannel;
}

interface EchoClient {
    private: (channel: string) => EchoChannel;
    leave: (channel: string) => void;
}

interface OrderStatusEvent {
    order_status?: OrderStatus;
    updated_at?: string;
    estimated_serve_time?: number;
}

interface PaymentStatusEvent {
    payment_status?: PaymentStatus;
}

interface UsePrivateOrderChannelOptions {
    orderId: string;
    onOrderStatus: (status: OrderStatus) => void;
    onPaymentStatus: (status: PaymentStatus) => void;
    onUpdatedAt?: (updatedAt: string) => void;
    onEstimatedServeTime?: (estimatedServeTime: number) => void;
}

export function usePrivateOrderChannel({
    orderId,
    onOrderStatus,
    onPaymentStatus,
    onUpdatedAt,
    onEstimatedServeTime,
}: UsePrivateOrderChannelOptions) {
    useEffect(() => {
        const echo = (window as Window & { Echo?: EchoClient }).Echo;
        if (echo) {
            echo.private(`order.${orderId}`)
                .listen(".order.status.updated", (event: OrderStatusEvent) => {
                    if (event.order_status) {
                        onOrderStatus(event.order_status);
                    }
                    if (event.updated_at && onUpdatedAt) {
                        onUpdatedAt(event.updated_at);
                    }
                    if (event.estimated_serve_time && onEstimatedServeTime) {
                        onEstimatedServeTime(event.estimated_serve_time);
                    }
                })
                .listen(".payment.status.updated", (event) => {
                    if ("payment_status" in event && event.payment_status) {
                        onPaymentStatus(event.payment_status);
                    }
                });
        }

        return () => {
            if (echo) {
                echo.leave(`order.${orderId}`);
            }
        };
    }, [orderId, onOrderStatus, onPaymentStatus, onUpdatedAt, onEstimatedServeTime]);
}
