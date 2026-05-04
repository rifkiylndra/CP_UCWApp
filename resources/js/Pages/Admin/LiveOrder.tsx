import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import KanbanCard from '@/Components/UI/KanbanCard';
import type { AdminUser } from '@/types/admin';
import type { KanbanOrder } from '@/types/staff';

interface LiveOrderProps {
    auth: { user: AdminUser };
    orders?: {
        incoming: KanbanOrder[];
        processing: KanbanOrder[];
        completed: KanbanOrder[];
    };
    dateRange?: { from: string; to: string };
}

export default function LiveOrder({ auth, orders, dateRange }: LiveOrderProps) {
    // Fallback data dummy jika belum ada data dari backend
    const [liveOrders, setLiveOrders] = useState({
        incoming: orders?.incoming || [
            { 
                id: '1', 
                orderId: 'ORD-001', 
                customerName: 'Budi Santoso', 
                tableLabel: 'Table 12', 
                orderType: 'dine-in', 
                status: 'incoming', 
                isPaid: false, 
                paymentMethod: 'cash', 
                totalAmount: 85000, 
                items: [{ id: 'item1', quantity: 2, menuItem: { name: 'Oat Milk Latte' } as any }], 
                placedAt: new Date().toISOString() 
            }
        ] as KanbanOrder[],
        processing: orders?.processing || [
            { 
                id: '2', 
                orderId: 'ORD-002', 
                customerName: 'Siska Amelia', 
                tableLabel: 'Table 04', 
                orderType: 'dine-in', 
                status: 'processing', 
                isPaid: true, 
                paymentMethod: 'qris', 
                totalAmount: 45000, 
                items: [{ id: 'item2', quantity: 1, menuItem: { name: 'V60 Pour Over' } as any }], 
                placedAt: new Date(Date.now() - 600000).toISOString() 
            }
        ] as KanbanOrder[],
        completed: orders?.completed || [] as KanbanOrder[]
    });

    // ── Realtime Listener Laravel Echo (Read-only) ──
    useEffect(() => {
        // Mencegah error jika Echo belum didefinisikan (window.Echo)
        if (typeof window !== 'undefined' && (window as any).Echo) {
            const channel = (window as any).Echo.channel('staff-orders');

            channel.listen('NewOrderPlaced', (e: { order: KanbanOrder }) => {
                setLiveOrders(prev => ({
                    ...prev,
                    incoming: [e.order, ...prev.incoming]
                }));
            });

            channel.listen('OrderStatusUpdated', (e: { order: KanbanOrder }) => {
                setLiveOrders(prev => {
                    // Hapus order dari semua kolom terlebih dahulu
                    const filteredIncoming = prev.incoming.filter(o => o.id !== e.order.id);
                    const filteredProcessing = prev.processing.filter(o => o.id !== e.order.id);
                    const filteredCompleted = prev.completed.filter(o => o.id !== e.order.id);

                    // Tambahkan ke kolom yang baru sesuai status
                    if (e.order.status === 'incoming' || (e.order.status as any) === 'pending') {
                        filteredIncoming.unshift(e.order);
                    } else if (e.order.status === 'processing') {
                        filteredProcessing.unshift(e.order);
                    } else if (e.order.status === 'completed') {
                        filteredCompleted.unshift(e.order);
                    }

                    return {
                        incoming: filteredIncoming,
                        processing: filteredProcessing,
                        completed: filteredCompleted
                    };
                });
            });

            return () => (window as any).Echo.leave('staff-orders');
        }
    }, []);

    return (
        <AdminLayout auth={auth} title="Live Order" currentRoute="admin.live-order">
            
            {/* ── Header Section ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-[32px] font-black tracking-tight text-[#1A1208]">Live Order</h1>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] text-[10px] font-bold tracking-widest uppercase border border-[#FDE68A]">
                            {liveOrders.incoming.length} Pending
                        </span>
                        <span className="px-3 py-1 rounded-full bg-[#E8F2E8] text-[#2E5A2E] text-[10px] font-bold tracking-widest uppercase border border-[#CDE3CD]">
                            {liveOrders.completed.length} Completed
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Date Range Picker Placeholder */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-[14px] bg-white border cursor-pointer hover:bg-[#F5F3F0] transition-colors"
                         style={{ borderColor: '#E8E2DB' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8B7B6B]"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span className="text-[13px] font-bold text-[#1A1208]">
                            {dateRange ? `${dateRange.from} - ${dateRange.to}` : 'Today (Realtime)'}
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#8B7B6B] ml-2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                    
                    {/* Export CSV Button */}
                    <button className="flex items-center gap-2 px-5 py-3 rounded-[14px] bg-[#2D1A0E] text-white hover:bg-black transition-all active:scale-95 shadow-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        <span className="text-[13px] font-bold tracking-wide">Export CSV</span>
                    </button>
                </div>
            </div>

            {/* ── Kanban Board Columns ── */}
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-220px)] min-h-[600px] overflow-hidden">
                
                {/* Column: INCOMING (Pending) */}
                <div className="flex-1 flex flex-col bg-white rounded-[24px] p-5 border shadow-sm flex-shrink-0 lg:min-w-[340px]" style={{ borderColor: '#E8E2DB' }}>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-[14px] font-black tracking-tight text-[#1A1208]">INCOMING QUEUE</h3>
                        <span className="w-6 h-6 rounded-full bg-[#F5F3F0] flex items-center justify-center text-[11px] font-bold text-[#8B7B6B]">
                            {liveOrders.incoming.length}
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto styled-scrollbar flex flex-col gap-4 pr-1">
                        {liveOrders.incoming.map(order => (
                            <KanbanCard key={order.id} order={order} readOnly={true} />
                        ))}
                        {liveOrders.incoming.length === 0 && (
                            <div className="flex-1 flex items-center justify-center text-[#8B7B6B] text-[12px] font-bold tracking-widest uppercase opacity-50 border-2 border-dashed border-[#E8E2DB] rounded-[16px]">
                                No Incoming Orders
                            </div>
                        )}
                    </div>
                </div>

                {/* Column: IN PROGRESS (Processing) */}
                <div className="flex-1 flex flex-col bg-white rounded-[24px] p-5 border shadow-sm flex-shrink-0 lg:min-w-[340px]" style={{ borderColor: '#E8E2DB' }}>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-[14px] font-black tracking-tight text-[#1A1208]">IN PROGRESS</h3>
                        <span className="w-6 h-6 rounded-full bg-[#F5F3F0] flex items-center justify-center text-[11px] font-bold text-[#8B7B6B]">
                            {liveOrders.processing.length}
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto styled-scrollbar flex flex-col gap-4 pr-1">
                        {liveOrders.processing.map(order => (
                            <KanbanCard key={order.id} order={order} readOnly={true} />
                        ))}
                        {liveOrders.processing.length === 0 && (
                            <div className="flex-1 flex items-center justify-center text-[#8B7B6B] text-[12px] font-bold tracking-widest uppercase opacity-50 border-2 border-dashed border-[#E8E2DB] rounded-[16px]">
                                No Active Orders
                            </div>
                        )}
                    </div>
                </div>

                {/* Column: COMPLETED (Done) */}
                <div className="flex-1 flex flex-col bg-white rounded-[24px] p-5 border shadow-sm flex-shrink-0 lg:min-w-[340px]" style={{ borderColor: '#E8E2DB' }}>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-[14px] font-black tracking-tight text-[#1A1208]">COMPLETED TODAY</h3>
                        <span className="w-6 h-6 rounded-full bg-[#F5F3F0] flex items-center justify-center text-[11px] font-bold text-[#8B7B6B]">
                            {liveOrders.completed.length}
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto styled-scrollbar flex flex-col gap-4 pr-1 opacity-70 hover:opacity-100 transition-opacity">
                        {liveOrders.completed.map(order => (
                            <KanbanCard key={order.id} order={order} readOnly={true} />
                        ))}
                        {liveOrders.completed.length === 0 && (
                            <div className="flex-1 flex items-center justify-center text-[#8B7B6B] text-[12px] font-bold tracking-widest uppercase opacity-50 border-2 border-dashed border-[#E8E2DB] rounded-[16px]">
                                No Completed Orders
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
