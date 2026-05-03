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
                    className="w-full py-4 rounded-xl text-[14px] font-bold text-white transition-all active:scale-[0.98]"
                    style={{ backgroundColor: 'var(--color-ucw-dark)' }}
                >
                    Verify Cash Payment
                </button>
            );
        }

        if (order.status === 'incoming') {
            return (
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => onUpdateStatus(order.id, 'processing')}
                        className="w-full py-4 rounded-xl text-[14px] font-bold transition-all active:scale-[0.98]"
                        style={{ border: '2px solid var(--color-ucw-dark)', color: 'var(--color-ucw-dark)' }}
                    >
                        Accept & Start Processing
                    </button>
                    <button
                        onClick={() => { /* Handle cancel logic */ }}
                        className="w-full py-3.5 rounded-xl text-[13px] font-bold transition-all hover:bg-red-50"
                        style={{ border: '1.5px solid var(--color-ucw-red)', color: 'var(--color-ucw-red)' }}
                    >
                        Cancel Order
                    </button>
                </div>
            );
        }

        if (order.status === 'processing') {
            return (
                <button
                    onClick={() => onUpdateStatus(order.id, 'completed')}
                    className="w-full py-4 rounded-xl text-[14px] font-bold text-white transition-all active:scale-[0.98]"
                    style={{ backgroundColor: 'var(--color-ucw-green)' }}
                >
                    Mark as Done
                </button>
            );
        }

        return null;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-[900px] h-[600px] bg-white rounded-[24px] overflow-hidden shadow-2xl flex"
                style={{ border: '1px solid var(--color-ucw-border)' }}>
                
                {/* ── KIRI: Image & Main Item Info (40% width) ── */}
                <div className="w-[40%] relative flex flex-col justify-end p-8"
                    style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                    
                    {/* Placeholder Background Image (Cover) */}
                    <div className="absolute inset-0 z-0 opacity-40">
                        {primaryItem?.menuItem.imageUrl ? (
                            <img src={primaryItem.menuItem.imageUrl} alt={primaryItem.menuItem.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208] via-transparent to-transparent z-10" />

                    <div className="relative z-20">
                        {order.isPriority && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg mb-4 backdrop-blur-md"
                                style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                <span className="text-[12px]">🔥</span>
                                <span className="text-[11px] font-bold text-white uppercase tracking-wider">Priority Order</span>
                            </div>
                        )}

                        <h2 className="text-[32px] font-black text-white leading-tight tracking-tight mb-2">
                            {primaryItem?.menuItem.name || 'Custom Order'}
                            {order.items.length > 1 && (
                                <span className="text-[20px] text-white/50 font-medium ml-2">
                                    + {order.items.length - 1} items
                                </span>
                            )}
                        </h2>

                        <p className="text-[13px] font-medium text-white/70">
                            Order #{order.orderId} • Placed {order.placedAt || 'Just now'}
                        </p>
                    </div>
                </div>

                {/* ── KANAN: Detail & Actions (60% width) ── */}
                <div className="w-[60%] flex flex-col bg-white h-full">
                    
                    {/* Header: Customer Info */}
                    <div className="px-8 py-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-ucw-border)' }}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 flex items-center justify-center font-bold text-[18px]"
                                style={{ borderColor: 'var(--color-ucw-border)', backgroundColor: 'var(--color-ucw-bg-warm)', color: 'var(--color-ucw-dark)' }}>
                                {order.customerAvatar ? (
                                    <img src={order.customerAvatar} alt="Customer" className="w-full h-full object-cover" />
                                ) : (
                                    (order.customerName || 'T').charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <h3 className="text-[18px] font-bold" style={{ color: 'var(--color-ucw-text)' }}>
                                    {order.customerName || `Table ${order.tableLabel}`}
                                </h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                                        style={{ backgroundColor: '#FDE68A', color: '#92400E' }}>
                                        {order.customerBadge || 'Regular Customer'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Close button */}
                        <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-black/5 text-gray-400 hover:text-gray-600">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    {/* Content Scrollable */}
                    <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                        
                        {/* Price & Items Summary */}
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[12px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-ucw-text-muted)' }}>
                                    Total Amount
                                </p>
                                <h4 className="text-[36px] font-black leading-none" style={{ color: 'var(--color-ucw-text)' }}>
                                    Rp {order.totalAmount.toLocaleString('id-ID')}
                                </h4>
                            </div>
                            <div className="text-right">
                                <p className="text-[12px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-ucw-text-muted)' }}>
                                    Payment
                                </p>
                                <span className={`text-[14px] font-bold px-3 py-1 rounded-md uppercase tracking-wide ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {order.paymentMethod} • {order.isPaid ? 'PAID' : 'UNPAID'}
                                </span>
                            </div>
                        </div>

                        {/* Customization Bento (Jika ada) */}
                        {(primaryItem?.milkChoice || primaryItem?.sweetener) && (
                            <div className="grid grid-cols-2 gap-4">
                                {primaryItem.milkChoice && (
                                    <div className="p-4 rounded-2xl" style={{ backgroundColor: 'var(--color-ucw-bg-warm)', border: '1px solid var(--color-ucw-border)' }}>
                                        <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-ucw-text-muted)' }}>Milk Choice</p>
                                        <p className="text-[15px] font-semibold" style={{ color: 'var(--color-ucw-text)' }}>{primaryItem.milkChoice}</p>
                                    </div>
                                )}
                                {primaryItem.sweetener && (
                                    <div className="p-4 rounded-2xl" style={{ backgroundColor: 'var(--color-ucw-bg-warm)', border: '1px solid var(--color-ucw-border)' }}>
                                        <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-ucw-text-muted)' }}>Sweetener</p>
                                        <p className="text-[15px] font-semibold" style={{ color: 'var(--color-ucw-text)' }}>{primaryItem.sweetener}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Special Request */}
                        {order.specialRequest && (
                            <div className="p-5 rounded-2xl" style={{ backgroundColor: 'white', border: '1.5px dashed var(--color-ucw-border-dark)' }}>
                                <p className="text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: 'var(--color-ucw-text-muted)' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    Special Request
                                </p>
                                <p className="text-[15px] italic leading-relaxed" style={{ color: 'var(--color-ucw-dark)' }}>
                                    "{order.specialRequest}"
                                </p>
                            </div>
                        )}

                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 pt-6 border-t bg-gray-50/50" style={{ borderColor: 'var(--color-ucw-border)' }}>
                        <div className="flex items-center justify-between text-[12px] font-semibold mb-4" style={{ color: 'var(--color-ucw-text-muted)' }}>
                            <span>Total Items: {order.items.reduce((acc, item) => acc + item.quantity, 0)}</span>
                            {order.avgWaitMins && (
                                <span className="flex items-center gap-1.5">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    Avg Wait: {order.avgWaitMins} mins
                                </span>
                            )}
                        </div>

                        {renderActionButtons()}
                    </div>

                </div>
            </div>
        </div>
    );
}
