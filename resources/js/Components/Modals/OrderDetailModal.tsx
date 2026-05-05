import { useEffect } from 'react';
import type { KanbanOrder } from '@/types/staff';

interface Props {
    order: KanbanOrder | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdateStatus: (orderId: string, status: KanbanOrder['status']) => void;
    onOpenPaymentModal: () => void;
}

export default function OrderDetailModal({ order, isOpen, onClose, onUpdateStatus, onOpenPaymentModal }: Props) {
    // Escape key listener untuk menutup modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !order) return null;

    // Ambil item utama (item pertama) untuk display gambar besar
    const primaryItem = order.items[0];

    const renderActionButtons = () => {
        if (!order.isPaid) {
            return (
                <button
                    onClick={() => { onClose(); onOpenPaymentModal(); }}
                    className="w-full py-4 rounded-[14px] text-[15px] font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    style={{ backgroundColor: 'var(--color-ucw-dark)' }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle></svg>
                    Verify Cash Payment
                </button>
            );
        }

        if (order.status === 'incoming') {
            return (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onUpdateStatus(order.id, 'processing')}
                        className="flex-1 py-4 rounded-[14px] text-[13px] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        style={{ backgroundColor: '#E8F2E8', color: '#2E5A2E' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Accept Order
                    </button>
                    <button
                        onClick={() => onUpdateStatus(order.id, 'processing')}
                        className="flex-1 py-4 rounded-[14px] text-[13px] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        style={{ backgroundColor: '#F3F4F6', color: 'var(--color-ucw-dark)' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        Start Processing
                    </button>
                </div>
            );
        }

        if (order.status === 'processing') {
            return (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onUpdateStatus(order.id, 'completed')}
                        className="flex-1 py-4 rounded-[14px] text-[13px] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        style={{ backgroundColor: '#F3F4F6', color: 'var(--color-ucw-dark)' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Mark as Done
                    </button>
                    <button
                        onClick={() => { /* Cancel */ }}
                        className="flex-1 py-4 rounded-[14px] text-[13px] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        style={{ backgroundColor: 'white', border: '1px solid #FCA5A5', color: '#EF4444' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                        Cancel Order
                    </button>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-[860px] h-[600px] bg-white rounded-[28px] overflow-hidden shadow-2xl flex"
                style={{ border: '1px solid var(--color-ucw-border)' }}>
                
                {/* ── KIRI: Image & Main Item Info (45% width) ── */}
                <div className="w-[45%] relative flex flex-col justify-end p-8"
                    style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                    
                    {/* Background Image (Cover penuh) */}
                    <div className="absolute inset-0 z-0">
                        {primaryItem?.menuItem.imageUrl ? (
                            <img src={primaryItem.menuItem.imageUrl} alt={primaryItem.menuItem.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        )}
                    </div>
                    {/* Gradient Overlay dari bawah untuk tulisan */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208] via-[#1A1208]/40 to-transparent z-10" />

                    <div className="relative z-20">
                        {order.isPriority && (
                            <div className="inline-block px-3 py-1 rounded-full mb-4"
                                style={{ backgroundColor: '#E8F2E8', color: '#2E5A2E' }}>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Priority Order</span>
                            </div>
                        )}

                        <h2 className="text-[36px] font-black text-white leading-[1.1] tracking-tight mb-3">
                            {primaryItem?.menuItem.name || 'Custom Order'}
                        </h2>

                        <p className="text-[14px] text-white/70 font-medium">
                            Order #{order.orderId} • Placed {order.placedAt || 'Just now'}
                        </p>
                    </div>
                </div>

                {/* ── KANAN: Detail & Actions (55% width) ── */}
                <div className="w-[55%] flex flex-col bg-white h-full relative">
                    
                    {/* Close button top right */}
                    <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 bg-black/5 rounded-full flex items-center justify-center transition-colors hover:bg-black/10 text-gray-500 z-10">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    {/* Content Scrollable */}
                    <div className="flex-1 overflow-y-auto p-10 pt-12 flex flex-col">
                        
                        {/* Header: Customer Info & Price */}
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-[52px] h-[52px] rounded-[16px] overflow-hidden flex items-center justify-center font-bold text-[20px]"
                                    style={{ backgroundColor: '#F3F4F6', color: 'var(--color-ucw-dark)' }}>
                                    {order.customerAvatar ? (
                                        <img src={order.customerAvatar} alt="Customer" className="w-full h-full object-cover" />
                                    ) : (
                                        (order.customerName || 'T').charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-[20px] font-bold leading-tight" style={{ color: 'var(--color-ucw-text)' }}>
                                        {order.customerName || `Table ${order.tableLabel}`}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-1 text-[12px] font-semibold" style={{ color: 'var(--color-ucw-text-muted)' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                                        {order.customerBadge || 'Gold Member • 124 pts'}
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-1 ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {order.isPaid ? 'PAID' : 'UNPAID'}
                                </div>
                                <h4 className="text-[26px] font-black leading-none" style={{ color: 'var(--color-ucw-dark)' }}>
                                    Rp {order.totalAmount.toLocaleString('id-ID')}
                                </h4>
                            </div>
                        </div>

                        {/* Customization Bento */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="p-5 rounded-[16px]" style={{ backgroundColor: '#F9FAFB' }}>
                                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--color-ucw-text-muted)' }}>Milk Choice</p>
                                <p className="text-[14px] font-bold" style={{ color: 'var(--color-ucw-dark)' }}>
                                    {primaryItem?.milkChoice || 'House-made Oat Milk'}
                                </p>
                            </div>
                            <div className="p-5 rounded-[16px]" style={{ backgroundColor: '#F9FAFB' }}>
                                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--color-ucw-text-muted)' }}>Sweetener</p>
                                <p className="text-[14px] font-bold" style={{ color: 'var(--color-ucw-dark)' }}>
                                    {primaryItem?.sweetener || '1 Pump Vanilla Bean'}
                                </p>
                            </div>
                        </div>

                        {/* Special Request */}
                        {(order.specialRequest || true) && (
                            <div className="p-5 rounded-[16px] relative overflow-hidden" style={{ backgroundColor: '#FFFDF5' }}>
                                {/* Left border indicator */}
                                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: '#FBBF24' }}></div>
                                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-ucw-text-muted)' }}>
                                    Special Request
                                </p>
                                <p className="text-[14px] italic font-medium leading-relaxed" style={{ color: 'var(--color-ucw-dark)' }}>
                                    "{order.specialRequest || "Extra hot please, it's for a walk to the gallery. No lid if possible!"}"
                                </p>
                            </div>
                        )}

                    </div>

                    {/* Footer Actions */}
                    <div className="px-10 pb-8 pt-4 bg-white mt-auto">
                        <div className="mb-6">
                            {renderActionButtons()}
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-ucw-text-muted)' }}>
                            <span className="flex items-center gap-1.5">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                Avg. Wait: {order.avgWaitMins || '8'} mins
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                {order.items.reduce((acc, item) => acc + item.quantity, 0)} Items in Order
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
