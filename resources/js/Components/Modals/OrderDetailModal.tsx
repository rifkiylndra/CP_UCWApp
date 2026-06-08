import { useEffect } from "react";
import type { KanbanOrder } from "@/types/staff";
import { X } from "lucide-react";
import { firstImageUrl, MENU_IMAGE_PLACEHOLDER, useFallbackImage } from "@/lib/images";

interface Props {
    order: KanbanOrder | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdateStatus: (orderId: string, status: KanbanOrder["status"]) => void;
    onOpenPaymentModal: () => void;
}

export default function OrderDetailModal({
    order,
    isOpen,
    onClose,
    onUpdateStatus,
    onOpenPaymentModal,
}: Props) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !order) return null;

    const primaryItem = order.items[0];
    const primaryImageUrl = firstImageUrl(
        primaryItem?.menuItem.imageUrl,
        primaryItem?.menuItem.image_url,
        primaryItem?.menuItem.image,
    );
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat("id-ID").format(value);

    const handleMainAction = () => {
        if (!order.isPaid) {
            onClose();
            onOpenPaymentModal();
            return;
        }

        if (order.status === "incoming") {
            onUpdateStatus(order.id, "processing");
            onClose();
            return;
        }

        if (order.status === "processing") {
            onUpdateStatus(order.id, "completed");
            onClose();
        }
    };

    const getActionLabel = () => {
        if (!order.isPaid) return "Verify Cash Payment";
        if (order.status === "incoming") return "Start Processing";
        if (order.status === "processing") return "Mark as Done";
        return "";
    };

    const actionLabel = getActionLabel();

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center font-['Manrope'] lg:items-center lg:p-6">
            <div
                className="absolute inset-0 bg-black/55 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[30px] bg-white shadow-2xl lg:h-[620px] lg:max-w-[900px] lg:flex-row lg:rounded-[30px]">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#271310] shadow-sm transition hover:bg-white lg:right-6 lg:top-6"
                >
                    <X size={20} />
                </button>

                {/* Image Area */}
                <div className="relative h-[240px] shrink-0 overflow-hidden bg-[#271310] lg:h-full lg:w-[43%]">
                    {primaryImageUrl ? (
                        <img
                            src={primaryImageUrl}
                            alt={primaryItem.menuItem.name}
                            className="h-full w-full object-cover"
                            onError={useFallbackImage}
                        />
                    ) : (
                        <img
                            src={MENU_IMAGE_PLACEHOLDER}
                            alt="Menu placeholder"
                            className="h-full w-full object-cover"
                        />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#271310] via-[#271310]/45 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-8">
                        {order.isPriority && (
                            <span className="mb-3 inline-flex rounded-full bg-[#DCEED8] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#4F654D]">
                                Priority Order
                            </span>
                        )}

                        <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.04em] text-white lg:text-[36px]">
                            {primaryItem?.menuItem.name || "Custom Order"}
                        </h2>

                        <p className="mt-2 text-[13px] font-medium text-white/70 lg:text-[14px]">
                            Order #{order.orderId} • {order.placedAt || "Just now"}
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex min-h-0 flex-1 flex-col bg-white">
                    <div className="flex-1 overflow-y-auto p-5 pb-28 lg:p-10 lg:pb-6">
                        <div className="mb-6 flex items-start justify-between gap-4 lg:mb-8">
                            <div className="flex items-center gap-3 lg:gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-[#F4F4F3] text-[18px] font-extrabold text-[#271310] lg:h-[52px] lg:w-[52px]">
                                    {order.customerAvatar ? (
                                        <img
                                            src={order.customerAvatar}
                                            alt="Customer"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        (order.customerName || "T").charAt(0).toUpperCase()
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-[18px] font-extrabold leading-tight text-[#271310] lg:text-[20px]">
                                        {order.customerName || `Table ${order.tableLabel}`}
                                    </h3>
                                    <p className="mt-1 text-[12px] font-semibold text-[#8A7B77]">
                                        {order.customerBadge || "Customer Order"}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <span
                                    className={[
                                        "inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold uppercase",
                                        order.isPaid
                                            ? "bg-[#DCEED8] text-[#4F654D]"
                                            : "bg-[#FFD9D6] text-[#C62828]",
                                    ].join(" ")}
                                >
                                    {order.isPaid ? "Paid" : "Unpaid"}
                                </span>

                                <p className="mt-2 text-[22px] font-extrabold tracking-[-0.04em] text-[#271310] lg:text-[26px]">
                                    Rp {formatRupiah(order.totalAmount)}
                                </p>
                            </div>
                        </div>

                        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4">
                            <InfoBox
                                label="Milk Choice"
                                value={primaryItem?.milkChoice || "Default"}
                            />
                            <InfoBox
                                label="Sweetener"
                                value={primaryItem?.sweetener || "Default"}
                            />
                        </div>

                        {order.specialRequest && (
                            <div className="relative mb-5 overflow-hidden rounded-[18px] bg-[#FFF8E8] p-4 lg:p-5">
                                <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#D99A2B]" />
                                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8A7B77]">
                                    Special Request
                                </p>
                                <p className="text-[13px] font-semibold italic leading-relaxed text-[#271310] lg:text-[14px]">
                                    “{order.specialRequest}”
                                </p>
                            </div>
                        )}

                        <div className="rounded-[20px] border border-[#ECE8E4] bg-[#F9F9F8] p-4">
                            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#8A7B77]">
                                Order Items
                            </p>

                            <div className="flex flex-col gap-3">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start justify-between gap-3"
                                    >
                                        <div className="flex gap-2">
                                            <span className="min-w-[24px] text-[14px] font-extrabold text-[#271310]">
                                                {item.quantity}×
                                            </span>
                                            <div>
                                                <p className="text-[14px] font-bold text-[#271310]">
                                                    {item.menuItem.name}
                                                </p>
                                                {(item.milkChoice || item.sweetener) && (
                                                    <p className="mt-0.5 text-[12px] font-medium text-[#8A7B77]">
                                                        {[item.milkChoice, item.sweetener]
                                                            .filter(Boolean)
                                                            .join(", ")}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sticky Footer */}
                    <div className="sticky bottom-0 border-t border-[#ECE8E4] bg-white p-5 lg:p-6 lg:px-10">
                        {actionLabel && (
                            <button
                                onClick={handleMainAction}
                                className={[
                                    "mb-4 h-13 w-full rounded-[18px] py-4 text-[15px] font-extrabold text-white transition active:scale-[0.98]",
                                    order.status === "processing" && order.isPaid
                                        ? "bg-[#5E735B]"
                                        : "bg-[#271310]",
                                ].join(" ")}
                            >
                                {actionLabel}
                            </button>
                        )}

                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.12em] text-[#8A7B77]">
                            <span>Avg. Wait: {order.avgWaitMins || 8} mins</span>
                            <span>{totalItems} items</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-[18px] bg-[#F4F4F3] p-4 lg:p-5">
            <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8A7B77]">
                {label}
            </p>
            <p className="text-[14px] font-bold text-[#271310]">{value}</p>
        </div>
    );
}
