import { useEffect, useState } from "react";
import type { KanbanOrder } from "@/types/staff";
import { X, Clock, Printer, Smartphone, AlertTriangle, CheckCircle, Sparkles } from "lucide-react";
import { firstImageUrl, MENU_IMAGE_PLACEHOLDER, useFallbackImage } from "@/lib/images";
import { printViaBluetooth, printViaBrowser } from "@/lib/thermalPrinter";

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
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [pendingAction, setPendingAction] = useState<{ action: () => void; message: string } | null>(null);
    const [printStatus, setPrintStatus] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    // Escape key listener to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Service Countdown Logic
    useEffect(() => {
        if (!order || !isOpen || order.status === "completed") {
            setTimeLeft(0);
            return;
        }

        const getRemainingSecs = () => {
            const placedTime = new Date(order.placedAt || order.createdAt || new Date()).getTime();
            const avgWaitMins = order.avgWaitMins || 15;
            const targetTime = placedTime + avgWaitMins * 60 * 1000;
            return Math.floor((targetTime - Date.now()) / 1000);
        };

        setTimeLeft(getRemainingSecs());

        const timer = setInterval(() => {
            setTimeLeft(getRemainingSecs());
        }, 1000);

        return () => clearInterval(timer);
    }, [order, isOpen]);

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

    const formatCountdown = (secs: number) => {
        const absoluteSecs = Math.abs(secs);
        const m = String(Math.floor(absoluteSecs / 60)).padStart(2, "0");
        const s = String(absoluteSecs % 60).padStart(2, "0");
        if (secs < 0) {
            return `Late: -${m}:${s}`;
        }
        return `${m}:${s}`;
    };

    const handleMainAction = () => {
        if (!order.isPaid) {
            setPendingAction({
                action: () => {
                    onClose();
                    onOpenPaymentModal();
                    setPendingAction(null);
                },
                message: `Apakah Anda yakin ingin memverifikasi pembayaran tunai untuk order #${order.orderId} senilai Rp ${formatRupiah(order.totalAmount)}?`
            });
            return;
        }

        if (order.status === "incoming") {
            setPendingAction({
                action: () => {
                    onUpdateStatus(order.id, "processing");
                    onClose();
                    setPendingAction(null);
                },
                message: `Apakah Anda yakin ingin mulai memproses pesanan #${order.orderId} (Meja ${order.tableLabel})?`
            });
            return;
        }

        if (order.status === "processing") {
            setPendingAction({
                action: () => {
                    onUpdateStatus(order.id, "completed");
                    onClose();
                    setPendingAction(null);
                },
                message: `Apakah Anda yakin ingin menyelesaikan pesanan #${order.orderId}? Pesanan akan dipindahkan ke daftar Completed.`
            });
        }
    };

    const getActionLabel = () => {
        if (!order.isPaid) return "Verify Cash Payment";
        if (order.status === "incoming") return "Start Processing";
        if (order.status === "processing") return "Mark as Done";
        return "";
    };

    const actionLabel = getActionLabel();

    const handlePrintBluetooth = async () => {
        setPrintStatus({ message: "Menghubungkan printer...", type: "info" });
        try {
            await printViaBluetooth(order);
            setPrintStatus({ message: "Berhasil cetak via Bluetooth!", type: "success" });
            setTimeout(() => setPrintStatus(null), 3000);
        } catch (error: any) {
            console.error("Bluetooth printing failed:", error);
            setPrintStatus({ message: error.message || "Gagal mencetak. Gunakan Print Browser.", type: "error" });
        }
    };

    const handlePrintBrowser = () => {
        try {
            printViaBrowser(order);
            setPrintStatus({ message: "Membuka print dialog browser...", type: "success" });
            setTimeout(() => setPrintStatus(null), 3000);
        } catch (error: any) {
            setPrintStatus({ message: "Gagal mencetak via Browser.", type: "error" });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center font-['Manrope'] lg:items-center lg:p-6">
            <div
                className="absolute inset-0 bg-black/55 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[30px] bg-white shadow-2xl lg:h-[620px] lg:max-w-[900px] lg:flex-row lg:rounded-[30px]">
                
                {/* Confirmation overlay card */}
                {pendingAction && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                        <div className="w-full max-w-[350px] rounded-[26px] bg-white p-6 shadow-2xl border border-[#ECE8E4] text-center animate-in fade-in zoom-in-95 duration-200">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FDF2F2] text-[#B91C1C] mb-4">
                                <AlertTriangle size={24} />
                            </div>
                            <h4 className="text-[17px] font-black text-[#271310] mb-2">Konfirmasi Tindakan</h4>
                            <p className="text-[13px] font-semibold text-[#8A7B77] leading-relaxed mb-6">
                                {pendingAction.message}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setPendingAction(null)}
                                    className="flex-1 py-3.5 rounded-xl border border-[#ECE8E4] text-[12.5px] font-extrabold text-[#5A4A47] hover:bg-[#F9F9F8] transition active:scale-[0.97]"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={pendingAction.action}
                                    className="flex-1 py-3.5 rounded-xl bg-[#271310] text-[12.5px] font-extrabold text-white hover:bg-[#3D2521] transition active:scale-[0.97]"
                                >
                                    Lanjutkan
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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

                        {/* Customization Details */}
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

                        {/* Real-time Countdown Timer */}
                        {order.status !== "completed" && (
                            <div className={`mb-5 rounded-[18px] p-4 lg:p-5 flex items-center justify-between border ${timeLeft < 0 ? "bg-[#FFF5F5] border-[#FFE2E2] text-[#B91C1C]" : "bg-[#F7F9F6] border-[#EEF2ED] text-[#2E422D]"}`}>
                                <div>
                                    <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8A7B77]">
                                        Sisa Waktu Pelayanan
                                    </p>
                                    <p className="text-[15px] font-black flex items-center gap-1.5">
                                        <Clock size={16} className={timeLeft < 0 ? "animate-pulse" : ""} />
                                        <span>{formatCountdown(timeLeft)}</span>
                                    </p>
                                </div>
                                {timeLeft < 0 ? (
                                    <span className="text-[9px] font-black bg-red-100 text-[#B91C1C] px-2.5 py-1 rounded-md uppercase tracking-wider">
                                        Terlambat
                                    </span>
                                ) : (
                                    <span className="text-[9px] font-black bg-green-100 text-[#4F654D] px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                                        <Sparkles size={10} />
                                        On Time
                                    </span>
                                )}
                            </div>
                        )}

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
                                                {item.notes && (
                                                    <p className="mt-1 text-[11px] font-bold italic text-amber-700">
                                                        * {item.notes}
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
                        
                        {/* Print Receipt Section */}
                        <div className="mb-4">
                            {printStatus && (
                                <p className={[
                                    "mb-2.5 text-center text-[11px] font-extrabold",
                                    printStatus.type === "success" ? "text-green-600" : printStatus.type === "error" ? "text-red-600" : "text-[#271310]/70"
                                ].join(" ")}>
                                    {printStatus.message}
                                </p>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handlePrintBluetooth}
                                    className="flex h-12 items-center justify-center gap-2 rounded-[16px] bg-[#271310]/5 text-[12.5px] font-black text-[#271310] hover:bg-[#271310]/10 transition active:scale-[0.98] lg:h-[50px]"
                                    title="Cetak struk secara langsung via Bluetooth (thermal 58mm)"
                                >
                                    <Smartphone size={15} strokeWidth={2.5} />
                                    <span>Print Bluetooth</span>
                                </button>
                                <button
                                    onClick={handlePrintBrowser}
                                    className="flex h-12 items-center justify-center gap-2 rounded-[16px] bg-[#271310]/5 text-[12.5px] font-black text-[#271310] hover:bg-[#271310]/10 transition active:scale-[0.98] lg:h-[50px]"
                                    title="Cetak struk menggunakan browser print / PDF"
                                >
                                    <Printer size={15} strokeWidth={2.5} />
                                    <span>Print PDF/Web</span>
                                </button>
                            </div>
                        </div>

                        {/* Main Status Actions */}
                        {actionLabel && (
                            <button
                                onClick={handleMainAction}
                                className={[
                                    "mb-4 h-13 w-full rounded-[18px] py-4 text-[15px] font-extrabold text-white transition active:scale-[0.98]",
                                    order.status === "processing" && order.isPaid
                                        ? "bg-[#5E735B] hover:bg-[#4E614B]"
                                        : "bg-[#271310] hover:bg-[#3B201B]",
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
