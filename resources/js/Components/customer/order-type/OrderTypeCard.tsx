type OrderTypeChoice = "dine-in" | "takeaway";

interface DineInCardProps {
    selected: boolean;
    tableNumber: string;
    tableNumberError: string;
    onSelect: () => void;
    onTableNumberChange: (value: string) => void;
    desktop?: boolean;
}

interface TakeawayCardProps {
    selected: boolean;
    name: string;
    nameError: string;
    onSelect: () => void;
    onNameChange: (value: string) => void;
    desktop?: boolean;
}

export function DineInCard({
    selected,
    tableNumber,
    tableNumberError,
    onSelect,
    onTableNumberChange,
    desktop = false,
}: DineInCardProps) {
    return (
        <button
            onClick={onSelect}
            className="w-full rounded-3xl p-5 text-left transition-all duration-200"
            style={{
                backgroundColor: "white",
                border: `1.5px solid ${
                    selected ? "var(--color-ucw-dark)" : "var(--color-ucw-border)"
                }`,
                boxShadow: selected ? "0 14px 35px rgba(45,26,14,0.10)" : "none",
                minHeight: desktop ? "260px" : "auto",
            }}
        >
            <div className="flex items-start justify-between mb-4">
                <OptionIcon type="dine-in" />
                {selected && <SelectedPill />}
            </div>

            <h3
                className="font-black mb-1"
                style={{
                    fontSize: "19px",
                    color: selected
                        ? "var(--color-ucw-dark)"
                        : "var(--color-ucw-text)",
                }}
            >
                Dine-in
            </h3>

            <p
                className="leading-relaxed mb-4"
                style={{
                    fontSize: "13px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                Enjoy your drink in our curated creative space.
            </p>

            {selected ? (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-col gap-1.5"
                >
                    <label
                        className="font-semibold uppercase tracking-[0.12em]"
                        style={{
                            fontSize: "10px",
                            color: "var(--color-ucw-text-muted)",
                        }}
                    >
                        TABLE NUMBER
                    </label>

                    <input
                        type="text"
                        placeholder="Enter table number"
                        value={tableNumber}
                        onChange={(e) => onTableNumberChange(e.target.value)}
                        autoFocus
                        className="w-full h-12 px-4 rounded-xl outline-none transition-colors"
                        style={{
                            fontSize: "14px",
                            backgroundColor: "var(--color-ucw-bg-warm)",
                            border: `1.5px solid ${
                                tableNumberError
                                    ? "var(--color-ucw-red)"
                                    : "var(--color-ucw-border)"
                            }`,
                            color: "var(--color-ucw-text)",
                        }}
                    />

                    {tableNumberError && (
                        <p
                            style={{
                                fontSize: "11px",
                                color: "var(--color-ucw-red)",
                            }}
                        >
                            {tableNumberError}
                        </p>
                    )}
                </div>
            ) : (
                <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ backgroundColor: "var(--color-ucw-bg-warm)" }}
                >
                    <span
                        className="font-semibold uppercase tracking-[0.12em]"
                        style={{
                            fontSize: "10px",
                            color: "var(--color-ucw-text-muted)",
                        }}
                    >
                        YOUR SPOT
                    </span>

                    <span
                        className="font-black"
                        style={{
                            fontSize: "15px",
                            color: "var(--color-ucw-dark)",
                        }}
                    >
                        Table {tableNumber || "-"}
                    </span>
                </div>
            )}
        </button>
    );
}

export function TakeawayCard({
    selected,
    name,
    nameError,
    onSelect,
    onNameChange,
    desktop = false,
}: TakeawayCardProps) {
    return (
        <button
            onClick={onSelect}
            className="w-full rounded-3xl p-5 text-left transition-all duration-200"
            style={{
                backgroundColor: "white",
                border: `1.5px solid ${
                    selected ? "var(--color-ucw-dark)" : "var(--color-ucw-border)"
                }`,
                boxShadow: selected ? "0 14px 35px rgba(45,26,14,0.10)" : "none",
                minHeight: desktop ? "260px" : "auto",
            }}
        >
            <div className="flex items-start justify-between mb-4">
                <OptionIcon type="takeaway" />
                {selected && <SelectedPill />}
            </div>

            <h3
                className="font-black mb-1"
                style={{
                    fontSize: "19px",
                    color: selected
                        ? "var(--color-ucw-dark)"
                        : "var(--color-ucw-text)",
                }}
            >
                Takeaway
            </h3>

            <p
                className="leading-relaxed mb-4"
                style={{
                    fontSize: "13px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                Perfect if you are on the move or prefer pickup.
            </p>

            {selected ? (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-col gap-1.5"
                >
                    <label
                        className="font-semibold uppercase tracking-[0.12em]"
                        style={{
                            fontSize: "10px",
                            color: "var(--color-ucw-text-muted)",
                        }}
                    >
                        YOUR NAME
                    </label>

                    <input
                        type="text"
                        placeholder="Enter name for order"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        autoFocus
                        className="w-full h-12 px-4 rounded-xl outline-none transition-colors"
                        style={{
                            fontSize: "14px",
                            backgroundColor: "var(--color-ucw-bg-warm)",
                            border: `1.5px solid ${
                                nameError
                                    ? "var(--color-ucw-red)"
                                    : "var(--color-ucw-border)"
                            }`,
                            color: "var(--color-ucw-text)",
                        }}
                    />

                    {nameError && (
                        <p
                            style={{
                                fontSize: "11px",
                                color: "var(--color-ucw-red)",
                            }}
                        >
                            {nameError}
                        </p>
                    )}
                </div>
            ) : (
                <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ backgroundColor: "var(--color-ucw-bg-warm)" }}
                >
                    <span
                        className="font-semibold uppercase tracking-[0.12em]"
                        style={{
                            fontSize: "10px",
                            color: "var(--color-ucw-text-muted)",
                        }}
                    >
                        PICKUP BY
                    </span>

                    <span
                        className="font-black"
                        style={{
                            fontSize: "15px",
                            color: "var(--color-ucw-dark)",
                        }}
                    >
                        Name
                    </span>
                </div>
            )}
        </button>
    );
}

function OptionIcon({ type }: { type: OrderTypeChoice }) {
    return (
        <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--color-ucw-bg-warm)" }}
        >
            {type === "dine-in" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="10" rx="2" />
                    <path d="M8 13v8M16 13v8M5 21h14" />
                </svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
            )}
        </div>
    );
}

function SelectedPill() {
    return (
        <span
            className="px-3 py-1 rounded-full font-bold tracking-wider text-white"
            style={{
                fontSize: "9px",
                backgroundColor: "var(--color-ucw-dark)",
            }}
        >
            SELECTED
        </span>
    );
}
