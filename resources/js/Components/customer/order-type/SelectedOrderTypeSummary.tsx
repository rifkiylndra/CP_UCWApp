type OrderTypeChoice = "dine-in" | "takeaway" | null;

interface SelectedOrderTypeSummaryProps {
    selected: OrderTypeChoice;
    tableNumber: string;
    name: string;
}

export default function SelectedOrderTypeSummary({
    selected,
    tableNumber,
    name,
}: SelectedOrderTypeSummaryProps) {
    return (
        <div>
            <p
                className="text-xs font-semibold uppercase tracking-[0.12em] mb-3"
                style={{ color: "var(--color-ucw-text-muted)" }}
            >
                Your choice
            </p>

            {selected ? (
                <div
                    className="flex items-center gap-3 p-4 rounded-2xl"
                    style={{
                        background: "var(--color-ucw-bg-warm)",
                        border: "1px solid var(--color-ucw-border)",
                    }}
                >
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: "var(--color-ucw-dark)" }}
                    >
                        {selected === "dine-in" ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="10" rx="2" />
                                <path d="M8 13v8M16 13v8M5 21h14" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p
                            className="font-bold text-sm"
                            style={{ color: "var(--color-ucw-dark)" }}
                        >
                            {selected === "dine-in" ? "Dine-in" : "Takeaway"}
                        </p>

                        <p
                            className="text-xs mt-0.5 truncate"
                            style={{ color: "var(--color-ucw-text-muted)" }}
                        >
                            {selected === "dine-in"
                                ? tableNumber
                                  ? `Table ${tableNumber}`
                                  : "Enter table number"
                                : name
                                  ? `Name: ${name}`
                                  : "Enter your name"}
                        </p>
                    </div>

                    <span
                        className="text-[9px] font-bold px-2.5 py-1 rounded-full text-white shrink-0"
                        style={{ backgroundColor: "var(--color-ucw-dark)" }}
                    >
                        SELECTED
                    </span>
                </div>
            ) : (
                <div
                    className="flex items-center gap-3 p-4 rounded-2xl"
                    style={{
                        background: "var(--color-ucw-border)",
                        border: "1px dashed var(--color-ucw-border-dark)",
                    }}
                >
                    <p
                        className="text-sm"
                        style={{ color: "var(--color-ucw-text-muted)" }}
                    >
                        No option selected yet
                    </p>
                </div>
            )}
        </div>
    );
}
