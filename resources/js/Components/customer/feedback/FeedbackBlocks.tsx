import { useState } from "react";

const COFFEE_PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='220' viewBox='0 0 400 220'%3E%3Crect width='400' height='220' fill='%23C8A882'/%3E%3Cellipse cx='200' cy='110' rx='70' ry='42' fill='%23A07850' opacity='0.6'/%3E%3C/svg%3E";

export function FeedbackHero({ desktop = false }: { desktop?: boolean }) {
    return (
        <div
            className="relative rounded-[30px] overflow-hidden"
            style={{ height: desktop ? "260px" : "200px" }}
        >
            <img
                src={COFFEE_PLACEHOLDER}
                alt="Coffee"
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.68)" }}
            />

            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(to bottom, rgba(20,12,6,0.05), rgba(20,12,6,0.50))",
                }}
            />

            <div className="absolute left-7 right-7 bottom-7">
                <p
                    className="font-bold uppercase tracking-[0.24em] mb-2 text-white"
                    style={{ fontSize: "11px" }}
                >
                    THANK YOU FOR VISITING
                </p>

                <h1
                    className="font-black leading-tight text-white"
                    style={{ fontSize: desktop ? "34px" : "30px" }}
                >
                    How was your
                    <br />
                    brew today?
                </h1>
            </div>
        </div>
    );
}



export function StarRating({
    value,
    onChange,
    desktop = false,
}: {
    value: number;
    onChange: (value: number) => void;
    desktop?: boolean;
}) {
    const [hovered, setHovered] = useState(0);

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= (hovered || value);

                    return (
                        <button
                            key={star}
                            onClick={() => onChange(star)}
                            onMouseEnter={() => setHovered(star)}
                            onMouseLeave={() => setHovered(0)}
                            className="transition-transform active:scale-90 hover:scale-110"
                            aria-label={`Rate ${star} star`}
                        >
                            <span
                                style={{
                                    fontSize: desktop ? "42px" : "36px",
                                    lineHeight: 1,
                                    color: filled
                                        ? "var(--color-ucw-dark)"
                                        : "#D8CBC7",
                                    transition: "color 0.15s",
                                }}
                            >
                                ★
                            </span>
                        </button>
                    );
                })}
            </div>

            <p
                className="font-semibold tracking-widest uppercase"
                style={{
                    fontSize: "11px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                {value > 0 ? `${value}.0 / 5.0 Rating` : "0.0 / 5.0 Rating"}
            </p>
        </div>
    );
}



export function FeedbackTextarea({
    value,
    onChange,
    className = "",
}: {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}) {
    return (
        <div className={className}>
            <label
                className="block font-bold uppercase tracking-[0.16em] mb-4"
                style={{
                    fontSize: "12px",
                    color: "var(--color-ucw-dark)",
                }}
            >
                Your thoughts (optional)
            </label>

            <div className="relative">
                <textarea
                    rows={5}
                    placeholder="Share your thoughts (optional)"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full resize-none rounded-[24px] px-6 py-6 outline-none leading-relaxed"
                    style={{
                        minHeight: "168px",
                        backgroundColor: "white",
                        border: "1px solid var(--color-ucw-border)",
                        color: "var(--color-ucw-text)",
                        fontSize: "15px",
                    }}
                />

                <svg
                    className="absolute right-6 bottom-6 opacity-30"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-ucw-text-muted)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
            </div>
        </div>
    );
}



export function InfoCard({
    label,
    value,
    subValue,
    type,
}: {
    label: string;
    value: string;
    subValue: string;
    type: "order" | "time";
}) {
    const isTime = type === "time";

    return (
        <div
            className="rounded-[22px] px-5 py-5"
            style={{
                backgroundColor: isTime ? "#D8ECD2" : "white",
                border: isTime ? "none" : "1px solid var(--color-ucw-border)",
                boxShadow: "0 18px 40px rgba(0,0,0,0.04)",
            }}
        >
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isTime ? "#5E715A" : "var(--color-ucw-text-muted)"}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {isTime ? (
                    <>
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                    </>
                ) : (
                    <>
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <rect x="4" y="4" width="16" height="18" rx="2" />
                        <path d="M8 10h8" />
                        <path d="M8 14h6" />
                        <path d="M8 18h4" />
                    </>
                )}
            </svg>

            <p
                className="font-bold uppercase tracking-[0.14em] mt-5 mb-2"
                style={{
                    fontSize: "10px",
                    color: isTime ? "#7D8F78" : "var(--color-ucw-text-muted)",
                }}
            >
                {label}
            </p>

            <p
                className="font-black leading-snug break-words"
                style={{
                    fontSize: "16px",
                    color: isTime ? "#5B6E56" : "var(--color-ucw-dark)",
                }}
            >
                {value}
                <br />
                {subValue}
            </p>
        </div>
    );
}



export function SubmitSection({
    hasFeedback,
    onSubmit,
    onReturnHome,
    isSubmitting = false,
    className = "",
}: {
    hasFeedback: boolean;
    onSubmit: () => void;
    onReturnHome: () => void;
    isSubmitting?: boolean;
    className?: string;
}) {
    return (
        <div className={className}>
            <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="w-full rounded-full font-bold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                    height: "62px",
                    fontSize: "16px",
                    backgroundColor: "var(--color-ucw-dark)",
                    boxShadow: "0 16px 30px rgba(45,26,14,0.22)",
                }}
            >
                {isSubmitting ? "Submitting..." : hasFeedback ? "Submit Feedback" : "Skip Feedback"}
            </button>

            <p
                className="text-center mt-4 leading-relaxed"
                style={{
                    fontSize: "11px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                Feedback is optional. You can continue without leaving a rating or
                comment.
            </p>

            <button
                onClick={onReturnHome}
                className="w-full mt-4 h-10 font-semibold uppercase tracking-[0.12em]"
                style={{
                    fontSize: "11px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                Return Home
            </button>
        </div>
    );
}



export function FeedbackError({ message }: { message: string }) {
    return (
        <div
            className="mt-5 rounded-2xl px-4 py-3"
            style={{
                backgroundColor: "var(--color-ucw-amber-bg)",
                border: "1px solid var(--color-ucw-amber)",
            }}
        >
            <p
                className="font-semibold"
                style={{ fontSize: "12px", color: "#92620A" }}
            >
                {message}
            </p>
        </div>
    );
}



export function ThankYouScreen({ onReturnHome }: { onReturnHome: () => void }) {
    return (
        <div
            className="min-h-svh flex items-center justify-center px-6"
            style={{ backgroundColor: "var(--color-ucw-bg)" }}
        >
            <div
                className="w-full max-w-[420px] rounded-[32px] px-8 py-10 text-center"
                style={{
                    backgroundColor: "white",
                    border: "1px solid var(--color-ucw-border)",
                    boxShadow: "0 24px 70px rgba(45,26,14,0.12)",
                }}
            >
                <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{
                        backgroundColor: "var(--color-ucw-green-bg)",
                    }}
                >
                    <span style={{ fontSize: 44 }}>🙏</span>
                </div>

                <h1
                    className="font-black tracking-tight mb-3"
                    style={{
                        fontSize: "30px",
                        color: "var(--color-ucw-dark)",
                    }}
                >
                    Thank you!
                </h1>

                <p
                    className="leading-relaxed mx-auto"
                    style={{
                        fontSize: "14px",
                        color: "var(--color-ucw-text-muted)",
                        maxWidth: "280px",
                    }}
                >
                    Your feedback helps us craft a better experience for every
                    guest.
                </p>

                <button
                    onClick={onReturnHome}
                    className="w-full mt-7 h-12 rounded-2xl font-bold text-white"
                    style={{ backgroundColor: "var(--color-ucw-dark)" }}
                >
                    Return Home
                </button>

                <p
                    className="mt-4"
                    style={{
                        fontSize: "11px",
                        color: "var(--color-ucw-text-muted)",
                    }}
                >
                    Redirecting automatically...
                </p>
            </div>
        </div>
    );
}
