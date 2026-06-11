type OrderTypeChoice = "dine-in" | "takeaway" | null;

interface ExpectationTipsProps {
    selected: OrderTypeChoice;
}

export default function ExpectationTips({ selected }: ExpectationTipsProps) {
    const tips =
        selected === "takeaway"
            ? [
                  { icon: "⏱", text: "Estimated wait: 5–10 minutes" },
                  { icon: "🏷", text: "Your order will be prepared by name" },
                  { icon: "🔔", text: "We'll notify you when it is ready" },
              ]
            : [
                  { icon: "⏱", text: "Estimated wait: 5–10 minutes" },
                  { icon: "📍", text: "Order delivered to your table" },
                  { icon: "🔔", text: "We'll notify you when it is ready" },
              ];

    return (
        <div className="flex flex-col gap-3">
            <p
                className="text-xs font-semibold uppercase tracking-[0.12em]"
                style={{ color: "var(--color-ucw-text-muted)" }}
            >
                What to expect
            </p>

            {tips.map((tip) => (
                <div key={tip.text} className="flex items-center gap-3">
                    <span className="text-base">{tip.icon}</span>
                    <span
                        className="text-xs"
                        style={{ color: "var(--color-ucw-text-muted)" }}
                    >
                        {tip.text}
                    </span>
                </div>
            ))}
        </div>
    );
}
