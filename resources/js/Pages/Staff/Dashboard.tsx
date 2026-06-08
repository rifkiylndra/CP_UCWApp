import { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import StaffLayout from "@/Components/Layout/StaffLayout";
import KanbanCard from "@/Components/UI/KanbanCard";
import OrderDetailModal from "@/Components/Modals/OrderDetailModal";
import CashPaymentModal from "@/Components/Modals/CashPaymentModal";
import type { StaffUser, KanbanOrder, KanbanColumn } from "@/types/staff";
import axios from "axios";

interface Props {
    auth: { user: StaffUser };
    orders: {
        incoming: any[];
        processing: any[];
        completed: any[];
    };
}

export default function Dashboard({ auth, orders: initialOrders }: Props) {
    const [orders, setOrders] = useState(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState<KanbanOrder | null>(
        null,
    );
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        if (initialOrders) setOrders(initialOrders);
    }, [initialOrders]);

    // Real-time polling
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['orders'], preserveScroll: true, preserveState: true });
        }, 10000); // Polling setiap 10 detik
        return () => clearInterval(interval);
    }, []);

    const allOrders = [
        ...orders.incoming,
        ...orders.processing,
        ...orders.completed,
    ];

    const handleViewDetail = (order: KanbanOrder) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

    const handleVerifyPayment = (orderId: string) => {
        const order = allOrders.find((item) => item.id === orderId);
        if (!order) return;

        setSelectedOrder(order);
        setIsPaymentModalOpen(true);
    };

    const handleUpdateStatus = async (orderId: string, newStatus: KanbanColumn) => {
        const order = allOrders.find((item) => item.id === orderId);
        if (!order) return;

        // Optimistic update
        const updatedOrder = {
            ...order,
            status: newStatus,
        };

        setOrders((prev) => {
            const cleaned = {
                incoming: prev.incoming.filter((item) => item.id !== orderId),
                processing: prev.processing.filter((item) => item.id !== orderId),
                completed: prev.completed.filter((item) => item.id !== orderId),
            };

            if (newStatus === "incoming") {
                return { ...cleaned, incoming: [updatedOrder, ...cleaned.incoming] };
            }
            if (newStatus === "processing") {
                return { ...cleaned, processing: [updatedOrder, ...cleaned.processing] };
            }
            return { ...cleaned, completed: [updatedOrder, ...cleaned.completed] };
        });

        try {
            await axios.put(`/staff/order/${orderId}/status`, { status: newStatus });
        } catch (error) {
            console.error("Failed to update order status:", error);
            alert("Gagal mengubah status pesanan. Pastikan koneksi internet stabil.");
            // Ideally we revert the state here or refresh the page
            window.location.reload();
        }
    };

    const handleConfirmPayment = async (orderId: string, amount: number) => {
        const order = allOrders.find((item) => item.id === orderId);
        if (!order) return;

        try {
            await axios.post(`/staff/payments/order/${orderId}/verify-cash`, {
                amount_received: amount
            });
            
            // Update UI state to Processing (since it's paid, it moves to kitchen/processing)
            const updatedOrder = {
                ...order,
                isPaid: true,
                status: "incoming" as KanbanColumn,
            };

            setOrders((prev) => ({
                incoming: prev.incoming.map((item) => (item.id === orderId ? updatedOrder : item)),
                processing: prev.processing,
                completed: prev.completed,
            }));
            
            alert("Pembayaran berhasil diverifikasi!");
            
        } catch (error: any) {
            console.error('Payment verification failed', error);
            alert(error.response?.data?.message || "Gagal memverifikasi pembayaran.");
        }
    };

    return (
        <StaffLayout
            auth={auth}
            title="Orders Dashboard"
            currentRoute="dashboard"
        >
            <Head title="Staff Dashboard" />

            <div className="font-['Manrope']">
                <div className="mb-6 flex flex-col gap-5 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.32em] text-[#5E735B] lg:text-[12px]">
                            Operations
                        </p>
                        <h1 className="text-[30px] font-extrabold tracking-[-0.05em] text-[#271310] lg:text-[34px]">
                            Orders Dashboard
                        </h1>
                    </div>

                    <div className="grid grid-cols-2 gap-3 lg:flex lg:items-center">
                        <div className="flex items-center justify-center gap-2 rounded-full border border-[#ECE8E4] bg-white px-4 py-3 lg:px-5">
                            <span className="h-2 w-2 rounded-full bg-[#C62828]" />
                            <span className="text-[13px] font-bold text-[#271310] lg:text-[14px]">
                                {orders.incoming.length} Pending
                            </span>
                        </div>

                        <div className="flex items-center justify-center gap-2 rounded-full border border-[#ECE8E4] bg-white px-4 py-3 lg:px-5">
                            <span className="h-2 w-2 rounded-full bg-[#5E735B]" />
                            <span className="text-[13px] font-bold text-[#271310] lg:text-[14px]">
                                {orders.completed.length} Completed
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-5 lg:grid lg:h-[calc(100vh-190px)] lg:grid-cols-3 lg:gap-7">
                    <OrderColumn
                        title="Incoming"
                        count={orders.incoming.length}
                        color="#C62828"
                    >
                        {orders.incoming.map((order) => (
                            <KanbanCard
                                key={order.id}
                                order={order}
                                columnType="incoming"
                                onViewDetail={handleViewDetail}
                                onVerifyPayment={handleVerifyPayment}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        ))}
                    </OrderColumn>

                    <OrderColumn
                        title="Processing"
                        count={orders.processing.length}
                        color="#D99A2B"
                    >
                        {orders.processing.map((order) => (
                            <KanbanCard
                                key={order.id}
                                order={order}
                                columnType="processing"
                                onViewDetail={handleViewDetail}
                                onVerifyPayment={handleVerifyPayment}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        ))}
                    </OrderColumn>

                    <OrderColumn
                        title="Completed"
                        count={orders.completed.length}
                        color="#5E735B"
                        rightLabel="Today"
                        dashed
                    >
                        {orders.completed.map((order) => (
                            <KanbanCard
                                key={order.id}
                                order={order}
                                columnType="completed"
                                onViewDetail={handleViewDetail}
                                readOnly
                            />
                        ))}
                    </OrderColumn>
                </div>
            </div>

            <OrderDetailModal
                order={selectedOrder}
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedOrder(null);
                }}
                onUpdateStatus={handleUpdateStatus}
                onOpenPaymentModal={() => {
                    setIsDetailModalOpen(false);
                    setIsPaymentModalOpen(true);
                }}
            />

            <CashPaymentModal
                order={selectedOrder}
                isOpen={isPaymentModalOpen}
                onClose={() => {
                    setIsPaymentModalOpen(false);
                    setSelectedOrder(null);
                }}
                onConfirmPayment={handleConfirmPayment}
            />

            <style>{`
                .styled-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }

                .styled-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }

                .styled-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(39, 19, 16, 0.12);
                    border-radius: 999px;
                }

                .styled-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(39, 19, 16, 0.22);
                }
            `}</style>
        </StaffLayout>
    );
}

interface OrderColumnProps {
    title: string;
    count: number;
    color: string;
    children: React.ReactNode;
    rightLabel?: string;
    dashed?: boolean;
}

function OrderColumn({
    title,
    count,
    color,
    children,
    rightLabel,
    dashed = false,
}: OrderColumnProps) {
    return (
        <section
            className={[
                "flex flex-col rounded-[26px] bg-[#F4F4F3] lg:max-h-full lg:overflow-hidden lg:rounded-[30px]",
                dashed
                    ? "border border-dashed border-[#E6DED8]"
                    : "border border-[#ECE8E4]",
            ].join(" ")}
        >
            <div className="flex items-center justify-between border-b border-[#ECE8E4] px-5 py-4 lg:px-6 lg:py-5">
                <div className="flex items-center gap-3">
                    <h2 className="text-[16px] font-extrabold tracking-[-0.02em] text-[#271310] lg:text-[17px]">
                        {title}
                    </h2>

                    {rightLabel && (
                        <span className="text-[11px] font-bold text-[#5A4A47]">
                            {rightLabel}
                        </span>
                    )}
                </div>

                <div
                    className="flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[11px] font-bold text-white lg:h-8 lg:min-w-8 lg:text-[12px]"
                    style={{ backgroundColor: color }}
                >
                    {count}
                </div>
            </div>

            <div className="styled-scrollbar flex flex-col gap-4 overflow-visible p-4 lg:flex-1 lg:gap-5 lg:overflow-y-auto lg:p-5">
                {children}
            </div>
        </section>
    );
}
