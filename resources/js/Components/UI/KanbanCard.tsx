import { useMemo } from "react";
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
    // Helper untuk merender tombol aksi berdasarkan status/kolom
    const renderActions = () => {
        if (readOnly) return null;

        if (!order.isPaid && onVerifyPayment) {
            return (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onVerifyPayment(order.id);
                    }}
                    className="w-full mt-3 py-2.5 rounded-xl text-[12px] font-bold tracking-wide text-white transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ backgroundColor: "var(--color-ucw-dark)" }}
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
                    className="w-full mt-3 py-2.5 rounded-xl text-[12px] font-bold tracking-wide transition-all active:scale-[0.98]"
                    style={{
                        border: "1.5px solid var(--color-ucw-border-dark)",
                        color: "var(--color-ucw-dark)",
                    }}
                >
                    START PROCESSING
                </button>
            );
        }

        if (columnType === "processing" && onUpdateStatus) {
            return (
                <div className="flex items-center gap-2 mt-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(order.id, "incoming");
                        }}
                        className="flex-1 py-2.5 rounded-xl text-[11px] font-bold tracking-wide transition-all active:scale-[0.98]"
                        style={{
                            border: "1.5px solid var(--color-ucw-border)",
                            color: "var(--color-ucw-text-muted)",
                        }}
                    >
                        MOVE BACK
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(order.id, "completed");
                        }}
                        className="flex-1 py-2.5 rounded-xl text-[11px] font-bold tracking-wide text-white transition-all active:scale-[0.98]"
                        style={{ backgroundColor: "var(--color-ucw-green)" }}
                    >
                        COMPLETE
                    </button>
                </div>
            );
        }

        return null;
    };

    return (
        <div
            onClick={() => {
                if (!readOnly && onViewDetail) onViewDetail(order);
            }}
            className={`p-4 rounded-2xl bg-white flex flex-col ${readOnly ? "" : "cursor-pointer transition-shadow hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)]"}`}
            style={{ border: "1px solid var(--color-ucw-border)" }}
        >
            {/* ── Header: Order ID & Payment Badge ── */}
            <div className="flex items-center justify-between mb-3">
                <span
                    className="text-[11px] font-black tracking-widest uppercase"
                    style={{ color: "var(--color-ucw-text-muted)" }}
                >
                    #{order.orderId}
                </span>

                {/* Payment Badge */}
                <div
                    className="px-2 py-0.5 rounded flex items-center gap-1.5"
                    style={{
                        backgroundColor: order.isPaid
                            ? "var(--color-ucw-green-bg)"
                            : "var(--color-ucw-red-bg)",
                        color: order.isPaid
                            ? "var(--color-ucw-green-text)"
                            : "var(--color-ucw-red-text)",
                    }}
                >
                    <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                            backgroundColor: order.isPaid
                                ? "var(--color-ucw-green)"
                                : "var(--color-ucw-red)",
                        }}
                    />
                    <span className="text-[10px] font-bold tracking-wide uppercase">
                        {order.isPaid ? "PAID" : "UNPAID"}
                    </span>
                </div>
            </div>

            {/* ── Table/Customer Info ── */}
            <h3
                className="text-[18px] font-black tracking-tight mb-3"
                style={{ color: "var(--color-ucw-dark)" }}
            >
                {order.orderType === "dine-in"
                    ? `Table ${order.tableLabel}`
                    : `TA: ${order.customerName || order.tableLabel}`}
            </h3>

            {/* ── Priority Badge (Optional) ── */}
            {order.isPriority && (
                <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md mb-3 self-start"
                    style={{
                        backgroundColor: "var(--color-ucw-dark)",
                        color: "white",
                    }}
                >
                    <span className="text-[10px]">🔥</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                        Priority Order
                    </span>
                </div>
            )}

            {/* ── Order Items Summary ── */}
            <div className="flex flex-col gap-2 mb-4">
                {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex gap-2">
                        <span
                            className="text-[13px] font-bold min-w-[20px]"
                            style={{ color: "var(--color-ucw-text-muted)" }}
                        >
                            {item.quantity}x
                        </span>
                        <div className="flex-1">
                            <p
                                className="text-[13px] font-medium leading-tight"
                                style={{ color: "var(--color-ucw-text)" }}
                            >
                                {item.menuItem.name}
                            </p>
                            {(item.milkChoice || item.sweetener) && (
                                <p
                                    className="text-[11px] mt-0.5"
                                    style={{
                                        color: "var(--color-ucw-text-muted)",
                                    }}
                                >
                                    {[item.milkChoice, item.sweetener]
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
                {order.items.length > 3 && (
                    <p
                        className="text-[12px] font-semibold mt-1"
                        style={{ color: "var(--color-ucw-text-muted)" }}
                    >
                        +{order.items.length - 3} more items
                    </p>
                )}
            </div>

            {/* ── Special Request Note ── */}
            {order.specialRequest && (
                <div
                    className="p-2.5 rounded-lg mb-2"
                    style={{
                        backgroundColor: "var(--color-ucw-bg-warm)",
                        border: "1px dashed var(--color-ucw-border-dark)",
                    }}
                >
                    <p
                        className="text-[11px] font-semibold italic text-justify leading-relaxed"
                        style={{ color: "var(--color-ucw-text-muted)" }}
                    >
                        "{order.specialRequest}"
                    </p>
                </div>
            )}

            <div className="mt-auto">
                {/* Timer/Wait time Info */}
                <div
                    className="flex items-center justify-between text-[11px] font-medium mb-1"
                    style={{ color: "var(--color-ucw-text-muted)" }}
                >
                    <span>Placed at {order.placedAt}</span>
                    {order.avgWaitMins && (
                        <span>Wait: {order.avgWaitMins}m</span>
                    )}
                </div>

                {/* ── Action Buttons ── */}
                {renderActions()}
            </div>
        </div>
    );
}
