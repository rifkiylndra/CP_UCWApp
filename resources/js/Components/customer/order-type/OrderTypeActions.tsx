type OrderTypeChoice = "dine-in" | "takeaway" | null;

interface OrderTypeActionsProps {
    selected: OrderTypeChoice;
    onConfirm: () => void;
}

export default function OrderTypeActions({
    selected,
    onConfirm,
}: OrderTypeActionsProps) {
    return (
        <button
            onClick={onConfirm}
            disabled={!selected}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl font-bold transition-all active:scale-[0.98]"
            style={{
                height: "54px",
                fontSize: "15px",
                backgroundColor: selected
                    ? "var(--color-ucw-dark)"
                    : "var(--color-ucw-border)",
                color: selected ? "white" : "var(--color-ucw-text-muted)",
                boxShadow: selected
                    ? "0 4px 20px rgba(45,26,14,0.25)"
                    : "none",
                cursor: selected ? "pointer" : "not-allowed",
            }}
        >
            Confirm Details

            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </button>
    );
}
