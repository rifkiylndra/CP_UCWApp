interface ReadyOrderPopupProps {
    onDismiss: () => void;
    onFeedback: () => void;
}

export default function ReadyOrderPopup({
    onDismiss,
    onFeedback,
}: ReadyOrderPopupProps) {
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
