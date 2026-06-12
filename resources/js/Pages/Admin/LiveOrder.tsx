import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import OrderSearchInput from "@/Components/ui/OrderSearchInput";
import OrderDetailModal from "@/Components/Modals/OrderDetailModal";
import CashPaymentModal from "@/Components/Modals/CashPaymentModal";
import OrderKanbanBoard from "@/Components/shared/order-kanban/OrderKanbanBoard";
import {
  countKanbanOrders,
  filterOrdersByQuery,
  flattenKanbanOrders,
  type KanbanOrderGroups,
} from "@/lib/orderKanban";
import type { AdminUser } from "@/types/admin";
import type { KanbanOrder, KanbanColumn } from "@/types/staff";

interface LiveOrderProps {
  auth: { user: AdminUser };
  orders?: KanbanOrderGroups;
}

export default function LiveOrder({ auth, orders: initialOrders }: LiveOrderProps) {
  const [orders, setOrders] = useState(initialOrders || {
    incoming: [],
    processing: [],
    completed: []
  });
  const [selectedOrder, setSelectedOrder] = useState<KanbanOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const allOrders = flattenKanbanOrders(orders);
  const filteredOrders = useMemo(
    () => filterOrdersByQuery(orders, searchQuery),
    [orders, searchQuery],
  );
  const filteredTotal = countKanbanOrders(filteredOrders);

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

    const updatedOrder = {
      ...order,
      status: newStatus,
      updatedAt: newStatus === "processing" ? new Date().toISOString() : order.updatedAt,
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

    try {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        await axios.put(`/staff/order/${orderId}/status`, { status: newStatus }, {
            headers: {
                'X-CSRF-TOKEN': token || ''
            }
        });
    } catch (error) {
        console.error("Failed to update order status:", error);
    }
  };

  const handleConfirmPayment = async (orderId: string, amount: number) => {
    const order = allOrders.find((item) => item.id === orderId);
    if (!order) return;

    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      await axios.post(`/staff/payments/order/${orderId}/verify-cash`, {
          amount_received: amount
      }, {
          headers: {
              'X-CSRF-TOKEN': token || ''
          }
      });

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
      
    } catch (error) {
      console.error('Payment verification failed', error);
      alert("Gagal memverifikasi pembayaran.");
    }
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

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mb-6">
          <OrderSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            resultCount={filteredTotal}
            totalCount={allOrders.length}
          />
        </div>

        <OrderKanbanBoard
          orders={filteredOrders}
          onViewDetail={handleViewDetail}
          onVerifyPayment={handleVerifyPayment}
          onUpdateStatus={handleUpdateStatus}
          heightClassName="lg:h-[calc(100vh-176px)]"
          roundedClassName="rounded-[22px] lg:rounded-[26px]"
        />
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

      <style>{`
        .styled-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
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
    </AdminLayout>
  );
}
