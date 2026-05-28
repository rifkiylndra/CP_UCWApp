import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import StaffLayout from "@/Layouts/StaffLayout";
import KanbanCard from "@/Components/UI/KanbanCard";
import OrderDetailModal from "@/Components/Modals/OrderDetailModal";
import CashPaymentModal from "@/Components/Modals/CashPaymentModal";
import type { StaffUser, KanbanOrder, KanbanColumn } from "@/types/staff";

interface Props {
    auth: { user: StaffUser };
    orders: {
        incoming: KanbanOrder[];
        processing: KanbanOrder[];
        completed: KanbanOrder[];
    };
}

export default function Dashboard({ auth, orders: initialOrders }: Props) {
    const [orders, setOrders] = useState(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState<KanbanOrder | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        if (initialOrders) setOrders(initialOrders);
    }, [initialOrders]);

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

    const handleUpdateStatus = (orderId: string, newStatus: KanbanColumn) => {
        const order = allOrders.find((item) => item.id === orderId);
        if (!order) return;

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
                return {
                    ...cleaned,
                    incoming: [updatedOrder, ...cleaned.incoming],
                };
            }

            if (newStatus === "processing") {
                return {
                    ...cleaned,
                    processing: [updatedOrder, ...cleaned.processing],
                };
            }

            return {
                ...cleaned,
                completed: [updatedOrder, ...cleaned.completed],
            };
        });
    };

    const handleConfirmPayment = (orderId: string) => {
        const order = allOrders.find((item) => item.id === orderId);
        if (!order) return;

        const updatedOrder = {
            ...order,
            isPaid: true,
            status: "processing" as KanbanColumn,
        };

        setOrders((prev) => ({
            incoming: prev.incoming.filter((item) => item.id !== orderId),
            processing: [
                updatedOrder,
                ...prev.processing.filter((item) => item.id !== orderId),
            ],
            completed: prev.completed.filter((item) => item.id !== orderId),
        }));
    };

    return (
        <StaffLayout auth={auth} title="Orders Dashboard" currentRoute="dashboard">
            <Head title="Staff Dashboard" />

            <div className="font-['Manrope']">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <p className="mb-2 text-[12px] font-extrabold uppercase tracking-[0.35em] text-[#5E735B]">
                            Operations
                        </p>
                        <h1 className="text-[34px] font-extrabold tracking-[-0.04em] text-[#271310]">
                            Orders Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-[#ECE8E4] bg-white px-5 py-3">
                            <span className="h-2 w-2 rounded-full bg-[#C62828]" />
                            <span className="text-[14px] font-bold text-[#271310]">
                                {orders.incoming.length} Pending
                            </span>
                        </div>

                        <div className="flex items-center gap-2 rounded-full border border-[#ECE8E4] bg-white px-5 py-3">
                            <span className="h-2 w-2 rounded-full bg-[#5E735B]" />
                            <span className="text-[14px] font-bold text-[#271310]">
                                {orders.completed.length} Completed
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid h-[calc(100vh-190px)] grid-cols-3 gap-7">
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
                "flex flex-col overflow-hidden rounded-[30px] bg-[#F4F4F3]",
                dashed
                    ? "border border-dashed border-[#E6DED8]"
                    : "border border-[#ECE8E4]",
            ].join(" ")}
        >
            <div className="flex items-center justify-between border-b border-[#ECE8E4] px-6 py-5">
                <div className="flex items-center gap-3">
                    <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-[#271310]">
                        {title}
                    </h2>

                    {rightLabel && (
                        <span className="text-[11px] font-bold text-[#5A4A47]">
                            {rightLabel}
                        </span>
                    )}
                </div>

                <div
                    className="flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[12px] font-bold text-white"
                    style={{ backgroundColor: color }}
                >
                    {count}
                </div>
            </div>

            <div className="styled-scrollbar flex flex-1 flex-col gap-5 overflow-y-auto p-5">
                {children}
            </div>
        </section>
    );
}