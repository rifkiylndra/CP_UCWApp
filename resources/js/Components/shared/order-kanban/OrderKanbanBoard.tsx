import type { ReactNode } from "react";
import KanbanCard from "@/Components/ui/KanbanCard";
import type { KanbanColumn, KanbanOrder } from "@/types/staff";
import type { KanbanOrderGroups } from "@/lib/orderKanban";

interface OrderKanbanBoardProps {
    orders: KanbanOrderGroups;
    onViewDetail: (order: KanbanOrder) => void;
    onVerifyPayment: (orderId: string) => void;
    onUpdateStatus: (orderId: string, status: KanbanColumn) => void;
    heightClassName?: string;
    roundedClassName?: string;
}

interface OrderKanbanColumnProps {
    title: string;
    count: number;
    color: string;
    children: ReactNode;
    rightLabel?: string;
    dashed?: boolean;
    roundedClassName?: string;
}

export default function OrderKanbanBoard({
    orders,
    onViewDetail,
    onVerifyPayment,
    onUpdateStatus,
    heightClassName = "lg:h-[calc(100vh-178px)]",
    roundedClassName = "rounded-[26px] lg:rounded-[30px]",
}: OrderKanbanBoardProps) {
    return (
        <div
            className={`styled-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 ${heightClassName} lg:min-h-[76vh] lg:grid-cols-3 lg:gap-7`}
        >
            <OrderKanbanColumn
                title="Incoming"
                count={orders.incoming.length}
                color="#C62828"
                roundedClassName={roundedClassName}
            >
                {orders.incoming.map((order) => (
                    <KanbanCard
                        key={order.id}
                        order={order}
                        columnType="incoming"
                        onViewDetail={onViewDetail}
                        onVerifyPayment={onVerifyPayment}
                        onUpdateStatus={onUpdateStatus}
                    />
                ))}
            </OrderKanbanColumn>

            <OrderKanbanColumn
                title="Processing"
                count={orders.processing.length}
                color="#D99A2B"
                roundedClassName={roundedClassName}
            >
                {orders.processing.map((order) => (
                    <KanbanCard
                        key={order.id}
                        order={order}
                        columnType="processing"
                        onViewDetail={onViewDetail}
                        onVerifyPayment={onVerifyPayment}
                        onUpdateStatus={onUpdateStatus}
                    />
                ))}
            </OrderKanbanColumn>

            <OrderKanbanColumn
                title="Completed"
                count={orders.completed.length}
                color="#5E735B"
                rightLabel="Today"
                dashed
                roundedClassName={roundedClassName}
            >
                {orders.completed.map((order) => (
                    <KanbanCard
                        key={order.id}
                        order={order}
                        columnType="completed"
                        onViewDetail={onViewDetail}
                        readOnly
                    />
                ))}
            </OrderKanbanColumn>
        </div>
    );
}

function OrderKanbanColumn({
    title,
    count,
    color,
    children,
    rightLabel,
    dashed = false,
    roundedClassName = "rounded-[26px] lg:rounded-[30px]",
}: OrderKanbanColumnProps) {
    return (
        <section
            className={[
                "flex min-w-full snap-start flex-col bg-[#F4F4F3] md:min-w-0 lg:max-h-full lg:overflow-hidden",
                roundedClassName,
                dashed
                    ? "border border-dashed border-[#E6DED8]"
                    : "border border-[#ECE8E4]",
            ].join(" ")}
        >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ECE8E4] bg-[#F4F4F3] px-5 py-4 lg:px-6 lg:py-5">
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

            <div className="styled-scrollbar flex max-h-[68vh] flex-col gap-4 overflow-y-auto scroll-smooth p-4 lg:max-h-none lg:flex-1 lg:gap-5 lg:p-5">
                {children}
            </div>
        </section>
    );
}
