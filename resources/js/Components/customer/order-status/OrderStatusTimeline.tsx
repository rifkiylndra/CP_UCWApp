import type { OrderStatus } from "@/types/customer";

type StepState = "done" | "active" | "pending";

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

interface OrderStatusTimelineProps {
    status: OrderStatus;
    receivedAt: string;
    className?: string;
}

interface MiniStepListProps {
    status: OrderStatus;
}

export default function OrderStatusTimeline({
    status,
    receivedAt,
    className = "",
}: OrderStatusTimelineProps) {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {STEPS.map((step) => {
                const current = getStepState(step.key, status);
                const isDone = current === "done";
                const isActive = current === "active";

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

export function MiniOrderStatusTimeline({ status }: MiniStepListProps) {
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
                const current = getStepState(step.key, status);

                return (
                    <div key={step.key} className="flex items-center gap-3">
                        <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                            style={{
                                backgroundColor:
                                    current === "done"
                                        ? "var(--color-ucw-green-bg)"
                                        : current === "active"
                                          ? "var(--color-ucw-dark)"
                                          : "var(--color-ucw-border)",
                            }}
                        >
                            {current === "done" ? (
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
                            ) : current === "active" ? (
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
                                    current === "active"
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

function getStepState(stepKey: OrderStatus, current: OrderStatus): StepState {
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
