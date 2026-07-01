import { useEffect, useState } from "react";
import axios from "axios";
import { Head, router } from "@inertiajs/react";
import CustomerLayout from "@/Components/Layout/CustomerLayout";
import TopBar from "@/Components/customer/navigation/TopBar";
import BottomNav from "@/Components/customer/navigation/BottomNav";
import CustomerDesktopHeader from "@/Components/customer/common/CustomerDesktopHeader";
import {
    ContactBarista as OrderStatusContactBarista,
    ContactBaristaCard as OrderStatusContactBaristaCard,
    OrderIdRow as OrderStatusOrderIdRow,
} from "@/Components/customer/order-status/OrderStatusActions";
import OrderItemsList from "@/Components/customer/order-status/OrderItemsList";
import OrderPaymentStatusCard from "@/Components/customer/order-status/PaymentStatusCard";
import OrderStatusSummaryCard from "@/Components/customer/order-status/OrderSummaryCard";
import OrderStatusTimeline, {
    MiniOrderStatusTimeline,
} from "@/Components/customer/order-status/OrderStatusTimeline";
import ReadyOrderPopup from "@/Components/customer/order-status/ReadyOrderPopup";
import { firstImageUrl } from "@/lib/images";
import {
    LiveStatusBadge,
    OrderStatusMessageCard,
    OrderTimerPanel,
    OrderTimerSection,
} from "@/Components/customer/order-status/OrderTimerBlocks";
import { useOrderStatusPolling } from "@/hooks/useOrderStatusPolling";
import { usePrivateOrderChannel } from "@/hooks/usePrivateOrderChannel";
import type { Order as BackendOrder, OrderStatus, PaymentMethod, PaymentStatus, PakasirPaymentResponse } from "@/types/customer";

interface OrderDetail {
    id?: number;
    quantity?: number;
    menu: {
        id: number;
        name: string;
        description?: string | null;
        image?: string | null;
        image_url?: string | null;
    } | null;
}

interface OrderData {
    id: number;
    order_status: OrderStatus;
    payment_status?: PaymentStatus;
    payment_method?: PaymentMethod | null;
    estimated_serve_time: number;
    created_at: string;
    order_details: OrderDetail[];
}

interface Props {
    tableId: string;
    orderId: string;
    orderRef?: string;
    tableNumber?: string;
    cartCount?: number;
    order?: OrderData | BackendOrder;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod | null;
    orderStatus?: OrderStatus;
    total?: number;
    pakasirMethod?: "qris" | "bri_va" | null;
    paymentNumber?: string | null;
    totalPayment?: number | null;
    expiredAt?: string | null;
    createdAt?: string | null;
    estimatedServeTime?: number | null;
}

function remainingSeconds(
    status: OrderStatus,
    createdAt?: string | null,
    updatedAt?: string | null,
    estimatedServeTime?: number | null
) {
    if (status === "ready" || status === "completed" || status === "cancelled") {
        return 0;
    }

    if (status !== "processing" && status !== "preparing") {
        return Math.max(0, (estimatedServeTime || 15) * 60);
    }

    const startTime = updatedAt || createdAt;
    if (!startTime || !estimatedServeTime) return Math.max(0, (estimatedServeTime || 15) * 60);

    const startTimeMs = new Date(startTime).getTime();
    if (Number.isNaN(startTimeMs)) return Math.max(0, estimatedServeTime * 60);

    const estimatedEndTime = startTimeMs + estimatedServeTime * 60 * 1000;
    return Math.max(0, Math.floor((estimatedEndTime - Date.now()) / 1000));
}

export default function OrderStatusPage({
    tableId,
    orderId,
    orderRef,
    tableNumber = "",
    cartCount = 0,
    order,
    paymentStatus,
    paymentMethod,
    orderStatus,
    pakasirMethod,
    createdAt,
    updatedAt,
    estimatedServeTime,
}: Props) {
    const resolvedOrderId = String(orderId || order?.id || "");
    const resolvedOrderRef = orderRef || (order as BackendOrder | undefined)?.order_ref || "-";
    const defaultStatus = orderStatus || order?.order_status || "pending";
    const [status, setStatus] = useState<OrderStatus>(defaultStatus);
    const [currentPaymentStatus, setCurrentPaymentStatus] = useState<PaymentStatus>(
        paymentStatus || order?.payment_status || "unpaid",
    );
    const [currentPaymentMethod, setCurrentPaymentMethod] = useState<PaymentMethod | null | undefined>(
        paymentMethod || order?.payment_method,
    );
    const [statusError, setStatusError] = useState("");
    const [isCreatingPayment, setIsCreatingPayment] = useState(false);
    const [showReadyPopup, setShowReadyPopup] = useState(false);
    const [currentCreatedAt, setCurrentCreatedAt] = useState<string | null>(
        createdAt || order?.created_at || null,
    );
    const [currentUpdatedAt, setCurrentUpdatedAt] = useState<string | null>(
        updatedAt || (order as BackendOrder | undefined)?.updated_at || null,
    );
    const [currentEstimatedServeTime, setCurrentEstimatedServeTime] = useState<number>(
        estimatedServeTime || order?.estimated_serve_time || 15,
    );
    const [timeLeft, setTimeLeft] = useState(() =>
        remainingSeconds(
            defaultStatus,
            createdAt || order?.created_at,
            updatedAt || (order as BackendOrder | undefined)?.updated_at,
            estimatedServeTime || order?.estimated_serve_time || 15
        ),
    );
    
    const [receivedAt] = useState(() => {
        const initialCreatedAt = createdAt || order?.created_at;

        if (initialCreatedAt) {
            return new Date(initialCreatedAt).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
            });
        }
        return new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
    });

    // Map backend order details to items format
    const displayItems = order?.order_details?.map((d: OrderDetail) => ({
        id: String(d.menu?.id || d.id),
        name: d.menu?.name || "Menu item",
        subtitle: d.menu?.description ? `${d.menu.description.substring(0, 30)}...` : `${d.quantity || 1} item`,
        imageUrl: firstImageUrl(d.menu?.image_url, d.menu?.image),
    })) || [];

    usePrivateOrderChannel({
        orderId: resolvedOrderId,
        onOrderStatus: setStatus,
        onPaymentStatus: setCurrentPaymentStatus,
        onUpdatedAt: setCurrentUpdatedAt,
        onEstimatedServeTime: setCurrentEstimatedServeTime,
    });

    useOrderStatusPolling({
        orderRef: resolvedOrderRef,
        onOrderStatus: setStatus,
        onPaymentStatus: setCurrentPaymentStatus,
        onPaymentMethod: setCurrentPaymentMethod,
        onCreatedAt: setCurrentCreatedAt,
        onUpdatedAt: setCurrentUpdatedAt,
        onEstimatedServeTime: setCurrentEstimatedServeTime,
        onStatusError: setStatusError,
    });

    useEffect(() => {
        if (status === "ready" || status === "completed" || status === "cancelled") {
            setTimeLeft(0);
            return;
        }

        const tick = () => {
            setTimeLeft(remainingSeconds(status, currentCreatedAt, currentUpdatedAt, currentEstimatedServeTime));
        };

        tick();
        const timer = window.setInterval(tick, 1000);

        return () => window.clearInterval(timer);
    }, [status, currentCreatedAt, currentUpdatedAt, currentEstimatedServeTime]);

    // Request notification permission on mount
    useEffect(() => {
        try {
            if (typeof window !== "undefined" && "Notification" in window && typeof Notification !== "undefined") {
                if (Notification.permission === "default") {
                    Notification.requestPermission().catch(() => {});
                }
            }
        } catch (e) {
            console.warn("Notifications are not supported in this environment:", e);
        }
    }, []);

    useEffect(() => {
        if (status === "ready" || status === "completed") {
            setShowReadyPopup(true);

            // Trigger device vibration if supported
            if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                try {
                    navigator.vibrate([100, 60, 100, 60, 200]);
                } catch (e) {
                    console.warn("Vibration not allowed or supported:", e);
                }
            }

            // Play a notification sound for customer
            try {
                const audio = new Audio("/assets/audio/payment-paid.mp3");
                audio.volume = 0.8;
                audio.play().catch(err => console.log("Audio play blocked by browser autoplay policy:", err));
            } catch (audioErr) {
                console.warn("Failed to play notification audio:", audioErr);
            }

            // System push notification with try-catch protection
            try {
                if (typeof window !== "undefined" && "Notification" in window && typeof Notification !== "undefined") {
                    if (Notification.permission === "granted") {
                        // Some mobile browsers throw 'Illegal constructor' when constructing Notification in main thread.
                        // Wrapping this prevents app crashes (white screen).
                        new Notification("Pesanan Siap Diambil! ☕", {
                            body: `Pesanan #${resolvedOrderRef} Anda sudah siap. Silakan ambil di meja bar.`,
                            icon: "/assets/images/logo.png"
                        });
                    }
                }
            } catch (e) {
                console.warn("Could not display system push notification (usually not allowed in mobile main thread):", e);
            }
        }
    }, [status, resolvedOrderRef]);

    const isReady = status === "ready" || status === "completed";

    async function handlePayAgain() {
        if (!resolvedOrderId) return;

        const method = currentPaymentMethod === "bri_va_pakasir" ? "bri_va" : pakasirMethod || "qris";
        setIsCreatingPayment(true);
        setStatusError("");

        try {
            const res = await axios.post<PakasirPaymentResponse>(
                `/customer/order/${encodeURIComponent(resolvedOrderRef)}/payments/pakasir`,
                { method },
            );

            sessionStorage.setItem(`ucw-payment-${resolvedOrderId}`, JSON.stringify(res.data));
            router.visit(route("customer.payment.online", { order: resolvedOrderRef }));
        } catch (error: unknown) {
            const message =
                typeof error === "object" &&
                error !== null &&
                "response" in error &&
                typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
                    ? (error as { response: { data: { message: string } } }).response.data.message
                    : "Could not create a new payment. Please try again.";
            setStatusError(
                message,
            );
            setIsCreatingPayment(false);
        }
    }

    return (
        <>
            <Head title="Order Status — UCW" />

            <CustomerLayout hideTopBar>
                {/* MOBILE */}
                <div
                    className="md:hidden min-h-svh flex flex-col"
                    style={{ backgroundColor: "var(--color-ucw-bg)" }}
                >
                    <TopBar
                        tableId={tableId}
                        title="Order Tracking"
                        subtitle={`Order #${resolvedOrderRef}`}
                        showBack
                        backHref={route("customer.menu")}
                    />

                    <div className="flex flex-col flex-1 px-5 pb-36">
                        <OrderTimerSection isReady={isReady} timeLeft={timeLeft} />

                        <OrderStatusMessageCard isReady={isReady} className="mb-4" />
                        <OrderPaymentStatusCard
                            status={currentPaymentStatus}
                            onPayAgain={handlePayAgain}
                            isCreatingPayment={isCreatingPayment}
                            errorMessage={statusError}
                            className="mb-4"
                        />

                        <OrderStatusTimeline
                            status={status}
                            receivedAt={receivedAt}
                            className="mb-4"
                        />

                        <OrderItemsList items={displayItems} className="mb-3" />

                        <OrderStatusOrderIdRow
                            orderRef={resolvedOrderRef}
                            tableNumber={tableNumber}
                        />

                        <OrderStatusContactBarista className="mt-4 text-center" />

                        {process.env.NODE_ENV === "development" && (
                            <button
                                onClick={() => setStatus("ready")}
                                className="mt-6 w-full py-3 rounded-xl text-sm font-medium transition-opacity active:opacity-60"
                                style={{
                                    border: "1.5px dashed var(--color-ucw-border-dark)",
                                    color: "var(--color-ucw-text-muted)",
                                }}
                            >
                                [Dev] Simulate: Order Ready Popup
                            </button>
                        )}
                    </div>

                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40"
                        style={{ backgroundColor: "var(--color-ucw-bg)" }}
                    >
                        <BottomNav
                            tableId={tableId}
                            active="track"
                            cartCount={cartCount}
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
                            title="Order Tracking"
                            subtitle={`Order #${resolvedOrderRef}`}
                            backHref={route("customer.menu")}
                            active="track"
                        />

                        <div className="flex-1 max-w-4xl mx-auto w-full px-8 lg:px-10 py-8">
                            <div className="grid grid-cols-[0.9fr_1.1fr] gap-6">
                                <OrderTimerPanel
                                    isReady={isReady}
                                    timeLeft={timeLeft}
                                    status={status}
                                />

                                <div className="flex flex-col gap-5">
                                    <OrderStatusMessageCard isReady={isReady} />
                                    <OrderPaymentStatusCard
                                        status={currentPaymentStatus}
                                        onPayAgain={handlePayAgain}
                                        isCreatingPayment={isCreatingPayment}
                                        errorMessage={statusError}
                                    />
                                    <OrderStatusTimeline
                                        status={status}
                                        receivedAt={receivedAt}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-[1fr_0.85fr] gap-6 mt-6">
                                <OrderItemsList items={displayItems} desktop />

                                <OrderStatusContactBaristaCard />
                            </div>

                            {process.env.NODE_ENV === "development" && (
                                <button
                                    onClick={() => setStatus("ready")}
                                    className="mt-6 w-full py-3 rounded-xl text-sm font-medium"
                                    style={{
                                        border: "1.5px dashed var(--color-ucw-border-dark)",
                                        color: "var(--color-ucw-text-muted)",
                                    }}
                                >
                                    [Dev] Simulate: Order Ready Popup
                                </button>
                            )}
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
                                Order Summary
                            </h2>

                            <p
                                className="text-xs"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                Live order status and pickup information.
                            </p>
                        </div>

                        <div className="flex-1 px-8 py-6 flex flex-col gap-5">
                            <LiveStatusBadge isReady={isReady} />

                            

                            <OrderStatusSummaryCard
                                orderRef={resolvedOrderRef}
                                tableNumber={tableNumber}
                                status={status}
                                paymentStatus={currentPaymentStatus}
                            />

                            <MiniOrderStatusTimeline status={status} />

                            <OrderStatusOrderIdRow
                                orderRef={resolvedOrderRef}
                                tableNumber={tableNumber}
                                compact
                            />
                        </div>
                    </aside>
                </div>

                {showReadyPopup && (
                    <ReadyOrderPopup
                        onDismiss={() => setShowReadyPopup(false)}
                        onFeedback={() =>
                            router.visit(
                                route("customer.feedback", {
                                    order: resolvedOrderRef,
                                }),
                            )
                        }
                    />
                )}
            </CustomerLayout>
        </>
    );
}
