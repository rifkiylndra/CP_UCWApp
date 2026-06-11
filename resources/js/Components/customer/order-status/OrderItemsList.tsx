import { MENU_IMAGE_PLACEHOLDER, useFallbackImage } from "@/lib/images";

export interface OrderStatusItem {
    id: string;
    name: string;
    subtitle: string;
    imageUrl: string;
}

interface OrderItemsListProps {
    items: OrderStatusItem[];
    className?: string;
    desktop?: boolean;
}

export default function OrderItemsList({
    items,
    className = "",
    desktop = false,
}: OrderItemsListProps) {
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
                            src={item.imageUrl || MENU_IMAGE_PLACEHOLDER}
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
