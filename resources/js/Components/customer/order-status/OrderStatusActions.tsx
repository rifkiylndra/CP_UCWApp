interface ContactBaristaProps {
    className?: string;
}

interface OrderIdRowProps {
    orderRef: string;
    tableNumber: string;
    compact?: boolean;
}

export function ContactBarista({ className = "" }: ContactBaristaProps) {
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

export function ContactBaristaCard() {
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

export function OrderIdRow({
    orderRef,
    tableNumber,
}: OrderIdRowProps) {
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
