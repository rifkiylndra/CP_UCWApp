import type { OrderStatus, PaymentMethod, PaymentStatus } from "@/types/customer";

export type StatusVariant =
    | "default"
    | "success"
    | "warning"
    | "error"
    | "pending"
    | "preparing"
    | "ready"
    | "cancelled";

export function getOrderStatusLabel(status?: OrderStatus | string | null): string {
    const labels: Record<string, string> = {
        pending: "Order Received",
        confirmed: "Order Confirmed",
        processing: "Preparing Your Order",
        preparing: "Preparing Your Order",
        ready: "Ready For Pickup",
        completed: "Completed",
        cancelled: "Cancelled",
    };

    return labels[status || ""] || String(status || "-");
}

export function getOrderStatusVariant(status?: OrderStatus | string | null): StatusVariant {
    const variants: Record<string, StatusVariant> = {
        pending: "pending",
        confirmed: "default",
        processing: "preparing",
        preparing: "preparing",
        ready: "ready",
        completed: "success",
        cancelled: "cancelled",
    };

    return variants[status || ""] || "default";
}

export function getPaymentStatusLabel(status?: PaymentStatus | string | null): string {
    const labels: Record<string, string> = {
        unpaid: "Waiting Payment",
        waiting_verification: "Waiting Verification",
        paid: "Payment Received",
        failed: "Payment Failed",
        expired: "Payment Expired",
        completed: "Completed",
        pending: "Pending",
        processing: "Processing",
        refunded: "Refunded",
        cancelled: "Cancelled",
    };

    return labels[status || ""] || String(status || "-");
}

export function getPaymentStatusVariant(status?: PaymentStatus | string | null): StatusVariant {
    const variants: Record<string, StatusVariant> = {
        unpaid: "warning",
        waiting_verification: "pending",
        paid: "success",
        completed: "success",
        failed: "error",
        expired: "error",
        refunded: "error",
        cancelled: "cancelled",
        pending: "pending",
        processing: "preparing",
    };

    return variants[status || ""] || "default";
}

export function getPaymentMethodLabel(method?: PaymentMethod | string | null): string {
    const labels: Record<string, string> = {
        cash: "Cash",
        qris_pakasir: "QRIS Pakasir",
        bri_va_pakasir: "BRI Virtual Account",
        qris: "QRIS",
        bri_va: "BRI Virtual Account",
        midtrans: "Midtrans",
    };

    return labels[method || ""] || String(method || "-");
}
