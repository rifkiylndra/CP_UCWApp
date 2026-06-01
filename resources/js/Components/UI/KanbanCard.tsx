import type { KanbanOrder, KanbanColumn } from "@/types/staff";

interface Props {
    order: KanbanOrder;
    columnType?: KanbanColumn;
    onViewDetail?: (order: KanbanOrder) => void;
    onVerifyPayment?: (orderId: string) => void;
    onUpdateStatus?: (orderId: string, status: KanbanColumn) => void;
    readOnly?: boolean;
}

export default function KanbanCard({
    order,
    columnType,
    onViewDetail,
    onVerifyPayment,
    onUpdateStatus,
    readOnly = false,
}: Props) {
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

    const indicatorColor =
        columnType === "incoming"
            ? "#C62828"
            : columnType === "processing"
              ? "#D99A2B"
              : "#5E735B";

    const renderActions = () => {
        if (readOnly || columnType === "completed") return null;

        if (!order.isPaid && onVerifyPayment) {
            return (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onVerifyPayment(order.id);
                    }}
                    className="mt-4 h-12 w-full rounded-[16px] bg-[#271310] text-[12px] font-extrabold tracking-[0.06em] text-white transition active:scale-[0.98] lg:h-[52px] lg:rounded-[18px] lg:text-[13px]"
                >
                    VERIFY PAYMENT
                </button>
            );
        }

        if (columnType === "incoming" && onUpdateStatus) {
            return (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onUpdateStatus(order.id, "processing");
                    }}
                    className="mt-4 h-12 w-full rounded-[16px] bg-[#271310] text-[12px] font-extrabold tracking-[0.06em] text-white transition active:scale-[0.98] lg:h-[52px] lg:rounded-[18px] lg:text-[13px]"
                >
                    START PROCESSING
                </button>
            );
        }

        if (columnType === "processing" && onUpdateStatus) {
            return (
                <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(order.id, "incoming");
                        }}
                        className="h-11 rounded-[15px] border border-[#D7CDC7] bg-white text-[11px] font-extrabold text-[#5A4A47] transition active:scale-[0.98] lg:h-12 lg:rounded-[16px] lg:text-[12px]"
                    >
                        MOVE BACK
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(order.id, "completed");
                        }}
                        className="h-11 rounded-[15px] bg-[#5E735B] text-[11px] font-extrabold text-white transition active:scale-[0.98] lg:h-12 lg:rounded-[16px] lg:text-[12px]"
                    >
                        COMPLETE
                    </button>
                </div>
            );
        }

        return null;
    };

    return (
        <article
            onClick={() => {
                if (!readOnly && onViewDetail) onViewDetail(order);
            }}
            className={[
                "relative w-full shrink-0 overflow-hidden rounded-[22px] border border-[#EEEAE7] bg-white p-4 shadow-[0_4px_18px_rgba(39,19,16,0.04)] lg:rounded-[26px] lg:p-5",
                readOnly
                    ? ""
                    : "cursor-pointer transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(39,19,16,0.08)]",
            ].join(" ")}
        >
            <div
                className="absolute bottom-0 left-0 top-0 w-[4px] rounded-l-[22px] lg:w-[5px] lg:rounded-l-[26px]"
                style={{ backgroundColor: indicatorColor }}
            />

            <div className="flex items-start justify-between gap-3 pl-1">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.04em] text-[#8A7B77] lg:text-[12px]">
                    #{order.orderId}
                </span>

                <div
                    className={[
                        "rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase lg:px-3 lg:text-[10px]",
                        order.isPaid
                            ? "bg-[#DCEED8] text-[#4F654D]"
                            : "bg-[#FFD9D6] text-[#C62828]",
                    ].join(" ")}
                >
                    {order.isPaid ? "Paid" : "Unpaid"}
                </div>
            </div>

            <h3 className="mt-1 pl-1 text-[21px] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#271310] lg:text-[24px]">
                {order.orderType === "dine-in"
                    ? `Table ${order.tableLabel}`
                    : `Takeaway: ${order.customerName || order.tableLabel}`}
            </h3>

            <div className="mt-4 flex flex-col gap-2.5 pl-1 lg:mt-5 lg:gap-3">
                {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-start gap-2">
                        <p className="min-w-[24px] text-[14px] font-bold text-[#4E403D] lg:min-w-[26px] lg:text-[15px]">
                            {item.quantity}×
                        </p>

                        <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-[14px] font-semibold text-[#4E403D] lg:text-[15px]">
                                {item.menuItem.name}
                            </p>

                            {(item.milkChoice || item.sweetener) && (
                                <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-[#8A7B77] lg:text-[12px]">
                                    {[item.milkChoice, item.sweetener]
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>
                            )}
                        </div>
                    </div>
                ))}

                {order.items.length > 3 && (
                    <p className="text-[12px] font-bold text-[#8A7B77]">
                        +{order.items.length - 3} more items
                    </p>
                )}
            </div>

            {order.specialRequest && (
                <div className="mt-4 rounded-[16px] border border-[#ECE5DF] bg-[#F7F4F1] p-3 lg:mt-5 lg:rounded-[18px] lg:p-4">
                    <p className="line-clamp-2 text-[11px] font-semibold italic leading-relaxed text-[#5A4A47] lg:text-[12px]">
                        “{order.specialRequest}”
                    </p>
                </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-3 pl-1 text-[11px] font-semibold text-[#8A7B77] lg:mt-5 lg:text-[12px]">
                <span className="line-clamp-1">{order.placedAt}</span>
                <span className="shrink-0">
                    {totalItems} item{totalItems > 1 ? "s" : ""}
                </span>
            </div>

            {renderActions()}
        </article>
    );
}