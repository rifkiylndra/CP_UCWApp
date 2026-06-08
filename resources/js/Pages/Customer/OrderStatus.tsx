import { useEffect, useState } from "react";
import axios from "axios";
import { Head, router } from "@inertiajs/react";
import CustomerLayout from "@/Components/Layout/CustomerLayout";
import TopBar from "@/Components/customer/navigation/TopBar";
import BottomNav from "@/Components/customer/navigation/BottomNav";
import CustomerDesktopHeader from "@/Components/customer/common/CustomerDesktopHeader";
import { firstImageUrl, MENU_IMAGE_PLACEHOLDER, useFallbackImage } from "@/lib/images";
import type { CustomerPaymentStatusResponse, Order as BackendOrder, OrderStatus, PaymentMethod, PaymentStatus, PakasirPaymentResponse } from "@/types/customer";

interface OrderItem {
    id: string;
    name: string;
    subtitle: string;
    imageUrl: string;
}

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

const PLACEHOLDER = MENU_IMAGE_PLACEHOLDER;

type StepStatus = "done" | "active" | "pending";

const STEPS: { key: OrderStatus; label: string; sublabel: string }[] = [
    { key: "pending", label: "Waiting", sublabel: "Order received" },
    {
        key: "preparing",
        label: "Processing",
        sublabel: "Grinding and brewing now...",
    },
    {
        key: "ready",
        label: "Ready",
        sublabel: "Ready for pickup at counter",
    },
];

function stepStatus(stepKey: OrderStatus, current: OrderStatus): StepStatus {
    const normalizedCurrent = current === "processing" ? "preparing" : current;
    const order: OrderStatus[] = [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "completed",
    ];

    const stepIdx = order.indexOf(stepKey === "confirmed" ? "pending" : stepKey);
    const currentIdx = order.indexOf(normalizedCurrent);

    if (currentIdx > stepIdx) return "done";

    if (
        normalizedCurrent === stepKey ||
        (stepKey === "pending" &&
            (normalizedCurrent === "pending" || normalizedCurrent === "confirmed")) ||
        (stepKey === "preparing" && normalizedCurrent === "preparing") ||
        (stepKey === "ready" && normalizedCurrent === "ready")
    ) {
        return "active";
    }

    return "pending";
}

function formatCountdown(secs: number) {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
}

function remainingSeconds(status: OrderStatus, startTime?: string | null, estimatedServeTime?: number | null) {
    if (status === "ready" || status === "completed" || status === "cancelled") {
        return 0;
    }

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
        remainingSeconds(defaultStatus, createdAt || order?.created_at, estimatedServeTime || order?.estimated_serve_time || 15),
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

    useEffect(() => {
        // Echo Realtime Listeners
        const echo = (window as any).Echo;
        if (echo) {
            echo.channel(`order.${resolvedOrderId}`)
                .listen('.order.status.updated', (e: { order_status?: OrderStatus }) => {
                    if (e.order_status) {
                        setStatus(e.order_status);
                    }
                })
                .listen('.payment.status.updated', (e: { payment_status?: PaymentStatus }) => {
                    if (e.payment_status) {
                        setCurrentPaymentStatus(e.payment_status);
                    }
                });
        }

        return () => {
            if (echo) {
                echo.leave(`order.${resolvedOrderId}`);
            }
        };
    }, [resolvedOrderId]);

    useEffect(() => {
        if (!resolvedOrderRef || resolvedOrderRef === "-") return;

        let cancelled = false;
        let failedPolls = 0;

        async function pollStatus() {
            try {
                const res = await axios.get<CustomerPaymentStatusResponse>(
                    `/customer/order/${encodeURIComponent(resolvedOrderRef)}/payment/status`,
                );
                if (cancelled) return;

                const nextOrderStatus = res.data.orderStatus ?? res.data.order_status;
                const nextPaymentStatus = res.data.paymentStatus ?? res.data.payment_status;
                const nextPaymentMethod = res.data.paymentMethod ?? res.data.payment_method;
                const nextCreatedAt = res.data.createdAt ?? res.data.created_at;
                const nextUpdatedAt = res.data.updatedAt ?? res.data.updated_at;
                const nextEstimatedServeTime = res.data.estimatedServeTime ?? res.data.estimated_serve_time;

                if (nextOrderStatus) setStatus(nextOrderStatus);
                if (nextPaymentStatus) setCurrentPaymentStatus(nextPaymentStatus);
                if (nextPaymentMethod) setCurrentPaymentMethod(nextPaymentMethod);
                if (nextCreatedAt) setCurrentCreatedAt(nextCreatedAt);
                if (nextUpdatedAt) setCurrentUpdatedAt(nextUpdatedAt);
                if (nextEstimatedServeTime) setCurrentEstimatedServeTime(nextEstimatedServeTime);

                failedPolls = 0;
                setStatusError("");
            } catch {
                if (!cancelled) {
                    failedPolls += 1;

                    if (failedPolls >= 3) {
                        setStatusError("Could not refresh order status. We will retry shortly.");
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
    }, [resolvedOrderRef]);

    useEffect(() => {
        if (status === "ready" || status === "completed" || status === "cancelled") {
            setTimeLeft(0);
            return;
        }

        const tick = () => {
            setTimeLeft(remainingSeconds(status, currentCreatedAt, currentEstimatedServeTime));
        };

        tick();
        const timer = window.setInterval(tick, 1000);

        return () => window.clearInterval(timer);
    }, [status, currentCreatedAt, currentEstimatedServeTime]);

    useEffect(() => {
        if (status === "ready" || status === "completed") {
            setShowReadyPopup(true);

            if ("vibrate" in navigator) {
                navigator.vibrate([100, 60, 100, 60, 200]);
            }
        }
    }, [status]);

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
                        <TimerSection isReady={isReady} timeLeft={timeLeft} />

                        <StatusCard isReady={isReady} className="mb-4" />
                        <PaymentStatusCard
                            status={currentPaymentStatus}
                            onPayAgain={handlePayAgain}
                            isCreatingPayment={isCreatingPayment}
                            errorMessage={statusError}
                            className="mb-4"
                        />

                        <StatusSteps
                            status={status}
                            receivedAt={receivedAt}
                            className="mb-4"
                        />

                        <ItemList items={displayItems} className="mb-3" />

                        <OrderIdRow
                            orderRef={resolvedOrderRef}
                            tableNumber={tableNumber}
                        />

                        <ContactBarista className="mt-4 text-center" />

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
                                <TimerPanel
                                    isReady={isReady}
                                    timeLeft={timeLeft}
                                    status={status}
                                />

                                <div className="flex flex-col gap-5">
                                    <StatusCard isReady={isReady} />
                                    <PaymentStatusCard
                                        status={currentPaymentStatus}
                                        onPayAgain={handlePayAgain}
                                        isCreatingPayment={isCreatingPayment}
                                        errorMessage={statusError}
                                    />
                                    <StatusSteps
                                        status={status}
                                        receivedAt={receivedAt}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-[1fr_0.85fr] gap-6 mt-6">
                                <ItemList items={displayItems} desktop />

                                <ContactBaristaCard />
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

                            

                            <OrderSummaryDetails
                                orderRef={resolvedOrderRef}
                                tableNumber={tableNumber}
                                status={status}
                                paymentStatus={currentPaymentStatus}
                            />

                            <MiniStepList status={status} />

                            <OrderIdRow
                                orderRef={resolvedOrderRef}
                                tableNumber={tableNumber}
                                compact
                            />
                        </div>
                    </aside>
                </div>

                {showReadyPopup && (
                    <OrderReadyPopup
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

function TimerSection({
    isReady,
    timeLeft,
    desktop = false,
}: {
    isReady: boolean;
    timeLeft: number;
    desktop?: boolean;
}) {
    return (
        <div
            className={`flex flex-col items-center ${
                desktop ? "pt-0 pb-8" : "pt-4 pb-6"
            }`}
        >
            <div className="relative mb-5">
                <CoffeeIconCircle />
            </div>

            <p
                className="font-black tabular-nums leading-none mb-1"
                style={{
                    fontSize: desktop ? "52px" : "48px",
                    color: "var(--color-ucw-dark)",
                }}
            >
                {isReady ? "00:00" : formatCountdown(timeLeft)}
            </p>

            <p
                className="font-semibold uppercase tracking-[0.16em]"
                style={{
                    fontSize: "10px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                ESTIMATED WAIT TIME
            </p>
        </div>
    );
}

function TimerPanel({
    isReady,
    timeLeft,
    status,
}: {
    isReady: boolean;
    timeLeft: number;
    status: OrderStatus;
}) {
    return (
        <div
            className="rounded-[32px] p-7 flex flex-col items-center justify-center text-center"
            style={{
                backgroundColor: "var(--color-ucw-bg)",
                border: "1px solid var(--color-ucw-border)",
            }}
        >
            <CoffeeIconCircle />

            <p
                className="font-black tabular-nums leading-none mt-6 mb-2"
                style={{
                    fontSize: "58px",
                    color: "var(--color-ucw-dark)",
                }}
            >
                {isReady ? "00:00" : formatCountdown(timeLeft)}
            </p>

            <p
                className="font-semibold uppercase tracking-[0.16em]"
                style={{
                    fontSize: "10px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                {isReady ? "READY NOW" : "ESTIMATED WAIT"}
            </p>

            <div className="mt-5">
                <LiveStatusBadge isReady={isReady} compact />
            </div>
        </div>
    );
}

function CoffeeIconCircle() {
    return (
        <div
            className="w-28 h-28 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--color-ucw-border)" }}
        >
            <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "white" }}
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-ucw-dark)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1="6" y1="1" x2="6" y2="4" />
                    <line x1="10" y1="1" x2="10" y2="4" />
                    <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
            </div>

            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[30px] h-1 rounded-full"
                style={{ backgroundColor: "var(--color-ucw-dark)" }}
            />
        </div>
    );
}

function StatusCard({
    isReady,
    className = "",
}: {
    isReady: boolean;
    className?: string;
}) {
    return (
        <div
            className={`rounded-3xl p-5 text-center ${className}`}
            style={{
                backgroundColor: "white",
                border: "1px solid var(--color-ucw-border)",
            }}
        >
            <h3
                className="font-black mb-2"
                style={{ fontSize: "18px", color: "var(--color-ucw-dark)" }}
            >
                {isReady
                    ? "Your order is ready! 🎉"
                    : "Our baristas are crafting your brew"}
            </h3>

            <p
                className="leading-relaxed"
                style={{
                    fontSize: "13px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                {isReady
                    ? "Please collect your order at the pickup counter."
                    : "We're precisely timing your order for the perfect serving experience."}
            </p>
        </div>
    );
}

function PaymentStatusCard({
    status,
    onPayAgain,
    isCreatingPayment,
    errorMessage,
    className = "",
}: {
    status: PaymentStatus;
    onPayAgain: () => void;
    isCreatingPayment: boolean;
    errorMessage?: string;
    className?: string;
}) {
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
                {formatPaymentStatus(status)}
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

function StatusSteps({
    status,
    receivedAt,
    className = "",
}: {
    status: OrderStatus;
    receivedAt: string;
    className?: string;
}) {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {STEPS.map((step) => {
                const ss = stepStatus(step.key, status);
                const isDone = ss === "done";
                const isActive = ss === "active";

                return (
                    <div
                        key={step.key}
                        className="flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-500"
                        style={{
                            backgroundColor: isActive
                                ? "var(--color-ucw-dark)"
                                : "white",
                            border: isActive
                                ? "none"
                                : "1px solid var(--color-ucw-border)",
                        }}
                    >
                        <StepIcon isDone={isDone} isActive={isActive} />

                        <div className="flex-1">
                            <p
                                className="font-bold leading-tight"
                                style={{
                                    fontSize: "14px",
                                    color: isActive
                                        ? "white"
                                        : "var(--color-ucw-text-muted)",
                                    textTransform: isActive
                                        ? "uppercase"
                                        : "none",
                                    letterSpacing: isActive
                                        ? "0.06em"
                                        : "normal",
                                }}
                            >
                                {step.label}
                            </p>

                            <p
                                style={{
                                    fontSize: "12px",
                                    color: isActive
                                        ? "rgba(255,255,255,0.55)"
                                        : "var(--color-ucw-text-muted)",
                                }}
                            >
                                {step.key === "pending"
                                    ? `Order received at ${receivedAt}`
                                    : step.sublabel}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function StepIcon({
    isDone,
    isActive,
}: {
    isDone: boolean;
    isActive: boolean;
}) {
    return (
        <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500"
            style={{
                backgroundColor: isDone
                    ? "var(--color-ucw-green-bg)"
                    : isActive
                      ? "rgba(255,255,255,0.15)"
                      : "var(--color-ucw-border)",
            }}
        >
            {isDone ? (
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-ucw-green-text)"
                    strokeWidth="3"
                    strokeLinecap="round"
                >
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            ) : isActive ? (
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="white"
                    stroke="none"
                >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
            ) : (
                <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "var(--color-ucw-text-muted)" }}
                />
            )}
        </div>
    );
}

function ItemList({
    items,
    className = "",
    desktop = false,
}: {
    items: OrderItem[];
    className?: string;
    desktop?: boolean;
}) {
    return (
        <div
            className={`flex flex-col gap-3 ${desktop ? "rounded-3xl p-5" : ""} ${className}`}
            style={
                desktop
                    ? {
                          backgroundColor: "white",
                          border: "1px solid var(--color-ucw-border)",
                      }
                    : {}
            }
        >
            {desktop && (
                <p
                    className="font-semibold uppercase tracking-[0.14em]"
                    style={{
                        fontSize: "10px",
                        color: "var(--color-ucw-text-muted)",
                    }}
                >
                    ORDERED ITEMS
                </p>
            )}

            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl p-4"
                    style={{
                        backgroundColor: desktop
                            ? "var(--color-ucw-bg-warm)"
                            : "white",
                        border: "1px solid var(--color-ucw-border)",
                    }}
                >
                    <div
                        className="w-14 h-14 rounded-xl overflow-hidden shrink-0"
                        style={{ backgroundColor: "var(--color-ucw-border)" }}
                    >
                        <img
                            src={item.imageUrl || PLACEHOLDER}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={useFallbackImage}
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p
                            className="font-bold truncate"
                            style={{
                                fontSize: "15px",
                                color: "var(--color-ucw-dark)",
                            }}
                        >
                            {item.name}
                        </p>

                        <p
                            className="uppercase tracking-wider mt-0.5 truncate"
                            style={{
                                fontSize: "10px",
                                color: "var(--color-ucw-text-muted)",
                            }}
                        >
                            {item.subtitle}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ContactBarista({ className = "" }: { className?: string }) {
    return (
        <div className={className}>
            <p
                className="mb-2"
                style={{
                    fontSize: "13px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                Need to adjust your order?
            </p>

            <button
                className="font-bold uppercase tracking-[0.12em] transition-opacity active:opacity-60"
                style={{ fontSize: "11px", color: "var(--color-ucw-dark)" }}
            >
                CONTACT THE BARISTA
            </button>
        </div>
    );
}

function ContactBaristaCard() {
    return (
        <div
            className="rounded-3xl p-5 flex flex-col justify-between"
            style={{
                backgroundColor: "white",
                border: "1px solid var(--color-ucw-border)",
            }}
        >
            <div>
                <p
                    className="font-semibold uppercase tracking-[0.14em] mb-2"
                    style={{
                        fontSize: "10px",
                        color: "var(--color-ucw-text-muted)",
                    }}
                >
                    NEED HELP?
                </p>

                <h3
                    className="font-black mb-2"
                    style={{ fontSize: "18px", color: "var(--color-ucw-dark)" }}
                >
                    Contact the barista
                </h3>

                <p
                    className="leading-relaxed"
                    style={{
                        fontSize: "13px",
                        color: "var(--color-ucw-text-muted)",
                    }}
                >
                    Ask staff if you need to change notes or confirm pickup.
                </p>
            </div>

            <button
                className="mt-5 w-full h-11 rounded-xl font-bold"
                style={{
                    backgroundColor: "var(--color-ucw-bg-warm)",
                    color: "var(--color-ucw-dark)",
                    border: "1px solid var(--color-ucw-border)",
                }}
            >
                Contact Staff
            </button>
        </div>
    );
}

function LiveStatusBadge({
    isReady,
    compact = false,
}: {
    isReady: boolean;
    compact?: boolean;
}) {
    return (
        <div
            className={`flex items-center gap-2 rounded-xl ${
                compact ? "px-3 py-2" : "px-4 py-3"
            }`}
            style={{
                background: isReady
                    ? "var(--color-ucw-green-bg)"
                    : "var(--color-ucw-bg-warm)",
                border: `1px solid ${
                    isReady ? "var(--color-ucw-green)" : "var(--color-ucw-border)"
                }`,
            }}
        >
            <span className="relative flex h-2 w-2">
                {!isReady && (
                    <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                        style={{ backgroundColor: "var(--color-ucw-dark)" }}
                    />
                )}

                <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{
                        backgroundColor: isReady
                            ? "var(--color-ucw-green)"
                            : "var(--color-ucw-dark)",
                    }}
                />
            </span>

            <span
                className="font-bold uppercase tracking-[0.1em]"
                style={{
                    fontSize: compact ? "10px" : "12px",
                    color: isReady
                        ? "var(--color-ucw-green-text)"
                        : "var(--color-ucw-dark)",
                }}
            >
                {isReady ? "Ready for pickup" : "Preparing your order"}
            </span>
        </div>
    );
}

function OrderSummaryDetails({
    orderRef,
    tableNumber,
    status,
    paymentStatus,
}: {
    orderRef: string;
    tableNumber: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
}) {
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
            <DetailRow label="Status" value={formatStatus(status)} strong />
            <DetailRow label="Payment" value={formatPaymentStatus(paymentStatus)} />
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

function MiniStepList({ status }: { status: OrderStatus }) {
    return (
        <div className="flex flex-col gap-2">
            <p
                className="font-semibold uppercase tracking-[0.14em] mb-1"
                style={{
                    fontSize: "10px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                PROGRESS
            </p>

            {STEPS.map((step) => {
                const ss = stepStatus(step.key, status);

                return (
                    <div key={step.key} className="flex items-center gap-3">
                        <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                            style={{
                                backgroundColor:
                                    ss === "done"
                                        ? "var(--color-ucw-green-bg)"
                                        : ss === "active"
                                          ? "var(--color-ucw-dark)"
                                          : "var(--color-ucw-border)",
                            }}
                        >
                            {ss === "done" ? (
                                <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="var(--color-ucw-green-text)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : ss === "active" ? (
                                <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="white"
                                    stroke="none"
                                >
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                            ) : (
                                <div
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{
                                        backgroundColor:
                                            "var(--color-ucw-text-muted)",
                                    }}
                                />
                            )}
                        </div>

                        <span
                            className="text-sm font-medium"
                            style={{
                                color:
                                    ss === "active"
                                        ? "var(--color-ucw-dark)"
                                        : "var(--color-ucw-text-muted)",
                            }}
                        >
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

function OrderIdRow({
    orderRef,
    tableNumber,
    compact = false,
}: {
    orderRef: string;
    tableNumber: string;
    compact?: boolean;
}) {
    return (
        <div
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ backgroundColor: "var(--color-ucw-bg-warm)" }}
        >
            <div>
                <p
                    className="font-semibold uppercase tracking-[0.12em] mb-0.5"
                    style={{
                        fontSize: "9px",
                        color: "var(--color-ucw-text-muted)",
                    }}
                >
                    ORDER ID
                </p>

                <p
                    className="font-black"
                    style={{ fontSize: "14px", color: "var(--color-ucw-dark)" }}
                >
                    #{orderRef}
                </p>
            </div>

            <div className="text-right">
                <p
                    className="font-semibold uppercase tracking-[0.12em] mb-0.5"
                    style={{
                        fontSize: "9px",
                        color: "var(--color-ucw-text-muted)",
                    }}
                >
                    {tableNumber ? "TABLE" : "TYPE"}
                </p>

                <p
                    className="font-black"
                    style={{ fontSize: "14px", color: "var(--color-ucw-dark)" }}
                >
                    {tableNumber || "Takeaway"}
                </p>
            </div>
        </div>
    );
}

function OrderReadyPopup({
    onDismiss,
    onFeedback,
}: {
    onDismiss: () => void;
    onFeedback: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: "rgba(20, 16, 14, 0.30)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                }}
                onClick={onDismiss}
            />

            <div
                className="relative w-full max-w-[420px] md:max-w-[520px] rounded-[32px] px-6 md:px-10 pt-8 md:pt-12 pb-8 md:pb-10 text-center max-h-[90vh] overflow-y-auto"
                style={{
                    backgroundColor: "white",
                    boxShadow: "0 28px 80px rgba(0,0,0,0.28)",
                }}
            >
                <div className="relative mx-auto mb-7 w-[92px] h-[92px] md:w-[104px] md:h-[104px]">
                    <div
                        className="w-full h-full rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "var(--color-ucw-green-bg)" }}
                    >
                        <svg
                            width="46"
                            height="46"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--color-ucw-dark)"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M5 4h14" />
                            <path d="M7 4v15a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4" />
                            <path d="M9 4v5h6V4" />
                            <path d="M9 14a3 3 0 0 0 6 0v-3H9v3z" />
                        </svg>
                    </div>

                    <div
                        className="absolute right-0 bottom-1 w-9 h-9 rounded-full flex items-center justify-center"
                        style={{
                            backgroundColor: "var(--color-ucw-dark)",
                            boxShadow: "0 8px 18px rgba(45,26,14,0.24)",
                        }}
                    >
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                </div>

                <h2
                    className="font-black leading-tight mb-4"
                    style={{
                        fontSize: "clamp(24px, 4vw, 32px)",
                        color: "var(--color-ucw-dark)",
                    }}
                >
                    Your order is ready!
                </h2>

                <p
                    className="leading-relaxed mb-8 md:mb-9 mx-auto"
                    style={{
                        fontSize: "15px",
                        color: "var(--color-ucw-text-muted)",
                        maxWidth: "360px",
                    }}
                >
                    Head over to the pickup counter. Our barista is waiting with
                    your fresh brew.
                </p>

                <button
                    onClick={onFeedback}
                    className="w-full rounded-xl font-bold text-white transition-all active:scale-[0.98]"
                    style={{
                        height: "52px",
                        backgroundColor: "var(--color-ucw-dark)",
                        boxShadow: "0 12px 24px rgba(45,26,14,0.25)",
                    }}
                >
                    Give Feedback
                </button>

                <button
                    onClick={onDismiss}
                    className="mt-6 md:mt-7 font-semibold transition-opacity active:opacity-60"
                    style={{
                        fontSize: "14px",
                        color: "var(--color-ucw-text-muted)",
                    }}
                >
                    Dismiss
                </button>
            </div>
        </div>
    );
}

function formatStatus(status: OrderStatus) {
    if (status === "pending") return "Order Received";
    if (status === "confirmed") return "Order Confirmed";
    if (status === "processing") return "Preparing Your Order";
    if (status === "preparing") return "Preparing Your Order";
    if (status === "ready") return "Ready For Pickup";
    if (status === "completed") return "Completed";
    if (status === "cancelled") return "Cancelled";

    return status;
}

function formatPaymentStatus(status: PaymentStatus) {
    if (status === "unpaid") return "Waiting Payment";
    if (status === "paid") return "Payment Received";
    if (status === "expired") return "Payment Expired";
    if (status === "failed") return "Payment Failed";
    if (status === "waiting_verification") return "Waiting Verification";

    return status;
}
