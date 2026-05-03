import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';
import KanbanCard from '@/Components/UI/KanbanCard';
import type { StaffUser, KanbanOrder, KanbanColumn } from '@/types/staff';

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
    
    // Modal states
    const [selectedOrder, setSelectedOrder] = useState<KanbanOrder | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        // Fallback untuk antisipasi jika data initial belum siap dari backend
        if (initialOrders) setOrders(initialOrders);
    }, [initialOrders]);

    useEffect(() => {
        // Abaikan jika Echo belum siap (untuk dev environment local tanpa Reverb)
        if (typeof window === 'undefined' || !window.Echo) return;

        const channel = window.Echo.channel('staff-orders');

        channel.listen('NewOrderPlaced', (e: { order: KanbanOrder }) => {
            setOrders(prev => ({
                ...prev,
                incoming: [e.order, ...prev.incoming]
            }));
        });

        channel.listen('OrderStatusUpdated', (e: { order: KanbanOrder }) => {
            setOrders(prev => {
                // Hapus order dari semua kolom terlebih dahulu
                const removeFromAll = (currOrders: typeof prev) => ({
                    incoming: currOrders.incoming.filter(o => o.id !== e.order.id),
                    processing: currOrders.processing.filter(o => o.id !== e.order.id),
                    completed: currOrders.completed.filter(o => o.id !== e.order.id),
                });
                
                const cleaned = removeFromAll(prev);
                
                // Tambahkan kembali ke kolom yang sesuai dengan status terbaru
                if (e.order.status === 'incoming') {
                    return { ...cleaned, incoming: [e.order, ...cleaned.incoming] };
                }
                if (e.order.status === 'processing') {
                    return { ...cleaned, processing: [e.order, ...cleaned.processing] };
                }
                return { ...cleaned, completed: [e.order, ...cleaned.completed] };
            });
        });

        return () => {
            window.Echo.leaveChannel('staff-orders');
        };
    }, []);

    // Handlers
    const handleViewDetail = (order: KanbanOrder) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

    const handleVerifyPayment = (orderId: string) => {
        const order = [...orders.incoming, ...orders.processing, ...orders.completed].find(o => o.id === orderId);
        if (order) {
            setSelectedOrder(order);
            setIsPaymentModalOpen(true);
        }
    };

    const handleUpdateStatus = (orderId: string, newStatus: KanbanColumn) => {
        // Optimistic UI update
        // In real app, make API call: router.put(route('staff.order.update', orderId), { status: newStatus })
        console.log(`Update Order ${orderId} status to: ${newStatus}`);
        
        const order = [...orders.incoming, ...orders.processing, ...orders.completed].find(o => o.id === orderId);
        if (!order) return;

        const updatedOrder = { ...order, status: newStatus };

        setOrders(prev => {
            const cleaned = {
                incoming: prev.incoming.filter(o => o.id !== orderId),
                processing: prev.processing.filter(o => o.id !== orderId),
                completed: prev.completed.filter(o => o.id !== orderId),
            };
            
            if (newStatus === 'incoming') return { ...cleaned, incoming: [updatedOrder, ...cleaned.incoming] };
            if (newStatus === 'processing') return { ...cleaned, processing: [updatedOrder, ...cleaned.processing] };
            return { ...cleaned, completed: [updatedOrder, ...cleaned.completed] };
        });
    };

    return (
        <StaffLayout auth={auth} title="Orders Dashboard" currentRoute="dashboard">
            <Head title="Staff Dashboard" />

            {/* ── Page Header Stats ── */}
            <div className="flex items-center gap-4 mb-8">
                <div className="px-4 py-2 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'white', border: '1px solid var(--color-ucw-border)' }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-ucw-dark)' }} />
                    <span className="text-[13px] font-bold" style={{ color: 'var(--color-ucw-text)' }}>
                        {orders?.incoming?.length || 0} Pending
                    </span>
                </div>
                <div className="px-4 py-2 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'white', border: '1px solid var(--color-ucw-border)' }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-ucw-green)' }} />
                    <span className="text-[13px] font-bold" style={{ color: 'var(--color-ucw-text)' }}>
                        {orders?.completed?.length || 0} Completed
                    </span>
                </div>
            </div>

            {/* ── Kanban Board ── */}
            <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                
                {/* COLUMN: INCOMING */}
                <div className="flex flex-col bg-black/5 rounded-2xl p-4 overflow-hidden border" style={{ borderColor: 'var(--color-ucw-border)' }}>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-[14px] font-black tracking-wide" style={{ color: 'var(--color-ucw-text)' }}>
                            INCOMING
                        </h3>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                            style={{ backgroundColor: 'var(--color-ucw-red)' }}>
                            {orders?.incoming?.length || 0}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 pb-4 styled-scrollbar">
                        {orders?.incoming?.map(order => (
                            <KanbanCard 
                                key={order.id} 
                                order={order} 
                                columnType="incoming"
                                onViewDetail={handleViewDetail}
                                onVerifyPayment={handleVerifyPayment}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        ))}
                    </div>
                </div>

                {/* COLUMN: PROCESSING */}
                <div className="flex flex-col bg-black/5 rounded-2xl p-4 overflow-hidden border" style={{ borderColor: 'var(--color-ucw-border)' }}>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-[14px] font-black tracking-wide" style={{ color: 'var(--color-ucw-text)' }}>
                            PROCESSING
                        </h3>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                            style={{ backgroundColor: '#F59E0B' }}> {/* Orange/Yellow indicator */}
                            {orders?.processing?.length || 0}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 pb-4 styled-scrollbar">
                        {orders?.processing?.map(order => (
                            <KanbanCard 
                                key={order.id} 
                                order={order} 
                                columnType="processing"
                                onViewDetail={handleViewDetail}
                                onVerifyPayment={handleVerifyPayment}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        ))}
                    </div>
                </div>

                {/* COLUMN: COMPLETED */}
                <div className="flex flex-col bg-black/5 rounded-2xl p-4 overflow-hidden border" style={{ borderColor: 'var(--color-ucw-border)' }}>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-[14px] font-black tracking-wide" style={{ color: 'var(--color-ucw-text)' }}>
                                COMPLETED
                            </h3>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white" style={{ color: 'var(--color-ucw-text-muted)' }}>
                                Today
                            </span>
                        </div>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                            style={{ backgroundColor: 'var(--color-ucw-green)' }}>
                            {orders?.completed?.length || 0}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 pb-4 styled-scrollbar">
                        {orders?.completed?.map(order => (
                            <KanbanCard 
                                key={order.id} 
                                order={order} 
                                columnType="completed"
                                onViewDetail={handleViewDetail}
                                onVerifyPayment={handleVerifyPayment}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        ))}
                    </div>
                </div>

            </div>

            {/* ── Placeholders for Modals (akan dibuat di FILE 3) ── */}
            {isDetailModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl text-center shadow-xl">
                        <h3 className="font-bold text-xl mb-4">Order Detail Modal Placeholder</h3>
                        <p className="text-gray-500 mb-6">Detail untuk order #{selectedOrder?.orderId}</p>
                        <button onClick={() => setIsDetailModalOpen(false)} className="px-6 py-2 bg-black text-white rounded-xl">
                            Close
                        </button>
                    </div>
                </div>
            )}
            
            <style>{`
                /* Styling custom scrollbar untuk list kanban agar rapi */
                .styled-scrollbar::-webkit-scrollbar { width: 4px; }
                .styled-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .styled-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
                .styled-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
            `}</style>
        </StaffLayout>
    );
}
