import { useEffect, useState } from "react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import KanbanCard from "@/Components/UI/KanbanCard";
import OrderDetailModal from "@/Components/Modals/OrderDetailModal";
import CashPaymentModal from "@/Components/Modals/CashPaymentModal";
import type { AdminUser } from "@/types/admin";
import type { KanbanOrder, KanbanColumn } from "@/types/staff";

interface LiveOrderProps {
  auth: { user: AdminUser };
  orders?: {
    incoming: KanbanOrder[];
    processing: KanbanOrder[];
    completed: KanbanOrder[];
  };
}

export default function LiveOrder({ auth, orders: initialOrders }: LiveOrderProps) {
  const fallbackOrders = {
    incoming: [
      {
        id: "1",
        orderId: "8821",
        customerName: "Sarah",
        tableLabel: "04",
        orderType: "dine-in",
        status: "incoming",
        isPaid: false,
        paymentMethod: "cash",
        totalAmount: 85000,
        placedAt: "Just now",
        specialRequest: "No cilantro on the avocado tartine please.",
        items: [
          {
            id: "item-1",
            quantity: 1,
            milkChoice: "Oat Milk",
            sweetener: "Less Sugar",
            menuItem: {
              name: "Oat Milk Flat White",
              imageUrl:
                "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=800&auto=format&fit=crop",
            },
          },
          {
            id: "item-2",
            quantity: 1,
            menuItem: {
              name: "Avocado Tartine",
              imageUrl: "",
            },
          },
        ],
      },
    ] as KanbanOrder[],
    processing: [
      {
        id: "2",
        orderId: "8819",
        customerName: "Marcus",
        tableLabel: "12",
        orderType: "dine-in",
        status: "processing",
        isPaid: true,
        paymentMethod: "qris",
        totalAmount: 72000,
        placedAt: "8 mins ago",
        items: [
          {
            id: "item-3",
            quantity: 1,
            milkChoice: "Default",
            sweetener: "Normal",
            menuItem: {
              name: "Seasonal Espresso Macchiato",
              imageUrl:
                "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?q=80&w=800&auto=format&fit=crop",
            },
          },
          {
            id: "item-4",
            quantity: 1,
            menuItem: {
              name: "Pain au Chocolat",
              imageUrl: "",
            },
          },
        ],
      },
    ] as KanbanOrder[],
    completed: [
      {
        id: "3",
        orderId: "8815",
        customerName: "Elena",
        tableLabel: "02",
        orderType: "dine-in",
        status: "completed",
        isPaid: true,
        paymentMethod: "qris",
        totalAmount: 58000,
        placedAt: "20 mins ago",
        items: [
          {
            id: "item-5",
            quantity: 1,
            menuItem: {
              name: "V60 Pour Over",
              imageUrl:
                "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop",
            },
          },
          {
            id: "item-6",
            quantity: 1,
            menuItem: {
              name: "French Toast",
              imageUrl: "",
            },
          },
        ],
      },
    ] as KanbanOrder[],
  };

  const [orders, setOrders] = useState(initialOrders || fallbackOrders);
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
    <AdminLayout auth={auth} title="Live Order" currentRoute="admin.live-order">
      <section className="font-['Manrope'] text-[#271310]">
        <div className="mb-6 flex flex-col gap-5 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.32em] text-[#5E735B] lg:text-[12px]">
              Operations
            </p>
            <h1 className="text-[30px] font-extrabold tracking-[-0.05em] lg:text-[34px]">
              Orders Dashboard
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:flex lg:items-center">
            <div className="flex items-center justify-center gap-2 rounded-full border border-[#ECE8E4] bg-white px-4 py-3 lg:px-5">
              <span className="h-2 w-2 rounded-full bg-[#C62828]" />
              <span className="text-[13px] font-bold lg:text-[14px]">
                {orders.incoming.length} Pending
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 rounded-full border border-[#ECE8E4] bg-white px-4 py-3 lg:px-5">
              <span className="h-2 w-2 rounded-full bg-[#5E735B]" />
              <span className="text-[13px] font-bold lg:text-[14px]">
                {orders.completed.length} Completed
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:grid lg:h-[calc(100vh-190px)] lg:grid-cols-3 lg:gap-7">
          <OrderColumn title="Incoming" count={orders.incoming.length} color="#C62828">
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

          <OrderColumn title="Processing" count={orders.processing.length} color="#D99A2B">
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
      </section>

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
    </AdminLayout>
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
        "flex flex-col rounded-[22px] bg-[#F4F4F3] lg:max-h-full lg:overflow-hidden lg:rounded-[26px]",
        dashed
          ? "border border-dashed border-[#E6DED8]"
          : "border border-[#ECE8E4]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between border-b border-[#ECE8E4] px-5 py-4 lg:px-6 lg:py-5">
        <div className="flex items-center gap-3">
          <h2 className="text-[16px] font-extrabold tracking-[-0.02em] lg:text-[17px]">
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