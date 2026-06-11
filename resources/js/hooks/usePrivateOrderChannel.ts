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
}

interface PaymentStatusEvent {
    payment_status?: PaymentStatus;
}

interface UsePrivateOrderChannelOptions {
    orderId: string;
    onOrderStatus: (status: OrderStatus) => void;
    onPaymentStatus: (status: PaymentStatus) => void;
}

export function usePrivateOrderChannel({
    orderId,
    onOrderStatus,
    onPaymentStatus,
}: UsePrivateOrderChannelOptions) {
    useEffect(() => {
        const echo = (window as Window & { Echo?: EchoClient }).Echo;
        if (echo) {
            echo.private(`order.${orderId}`)
                .listen(".order.status.updated", (event) => {
                    if ("order_status" in event && event.order_status) {
                        onOrderStatus(event.order_status);
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
    }, [orderId, onOrderStatus, onPaymentStatus]);
}
