import type { OrderStatus } from "@/types/customer";

interface TimerSectionProps {
    isReady: boolean;
    timeLeft: number;
    desktop?: boolean;
}

interface TimerPanelProps {
    isReady: boolean;
    timeLeft: number;
}

interface StatusMessageCardProps {
    isReady: boolean;
    className?: string;
}

interface LiveStatusBadgeProps {
    isReady: boolean;
    compact?: boolean;
}

export function OrderTimerSection({
    isReady,
    timeLeft,
    desktop = false,
}: TimerSectionProps) {
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

export function OrderTimerPanel({
    isReady,
    timeLeft,
}: TimerPanelProps & { status?: OrderStatus }) {
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

export function OrderStatusMessageCard({
    isReady,
    className = "",
}: StatusMessageCardProps) {
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

export function LiveStatusBadge({
    isReady,
    compact = false,
}: LiveStatusBadgeProps) {
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

function formatCountdown(secs: number) {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
}
