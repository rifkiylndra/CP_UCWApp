import { useState, useEffect } from 'react';
import type { KanbanOrder } from '@/types/staff';

interface Props {
    order: KanbanOrder | null;
    isOpen: boolean;
    onClose: () => void;
    onMarkPaid: (orderId: string) => void;
    onPaymentFailed: (orderId: string) => void;
}

export default function CashPaymentModal({ order, isOpen, onClose, onMarkPaid, onPaymentFailed }: Props) {
    const [amountReceived, setAmountReceived] = useState<number | ''>('');

    // Escape key listener untuk menutup modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Reset state saat modal dibuka/ditutup
    useEffect(() => {
        if (isOpen) setAmountReceived('');
    }, [isOpen, order]);

    if (!isOpen || !order) return null;

    const totalAmount = order.totalAmount;
    const receivedValue = typeof amountReceived === 'number' ? amountReceived : 0;
    const change = receivedValue >= totalAmount ? receivedValue - totalAmount : 0;
    const isSufficient = receivedValue >= totalAmount;

    // Quick Nominal Helper
    const applyQuickNominal = (amount: number) => {
        setAmountReceived(amount);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-[420px] bg-white rounded-[28px] overflow-hidden shadow-2xl flex flex-col p-8"
                style={{ border: '1px solid var(--color-ucw-border)' }}>
                
                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--color-ucw-text-muted)' }}>
                        Cash Verification
                    </span>
                    <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--color-ucw-bg-warm)', color: 'var(--color-ucw-text-muted)' }}>
                        #{order.orderId}
                    </span>
                </div>
                
                <h2 className="text-[28px] font-black tracking-tight mb-6" style={{ color: 'var(--color-ucw-dark)' }}>
                    Payment Portal
                </h2>

                {/* ── Total Amount Card (Dark Brown) ── */}
                <div className="rounded-[20px] text-center p-8 mb-6 shadow-md" style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                    <p className="text-white/60 text-[12px] font-bold uppercase tracking-widest mb-2">
                        Total Amount Due
                    </p>
                    <div className="flex items-center justify-center gap-1">
                        <span className="text-white/60 text-[24px] font-bold">Rp</span>
                        <h3 className="text-white text-[48px] font-black leading-none tracking-tighter">
                            {totalAmount.toLocaleString('id-ID')}
                        </h3>
                    </div>
                </div>

                {/* ── Quick Nominal Buttons ── */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <button 
                        onClick={() => applyQuickNominal(50000)}
                        className={`py-3 rounded-[12px] text-[13px] font-bold flex flex-col items-center justify-center transition-all ${amountReceived === 50000 ? 'bg-black/5' : 'hover:bg-black/5'}`}
                        style={{ border: '1px solid var(--color-ucw-border)' }}
                    >
                        <span className="text-[10px] uppercase tracking-widest opacity-50 mb-0.5">Cash</span>
                        <span style={{ color: 'var(--color-ucw-dark)' }}>50.000</span>
                    </button>
                    <button 
                        onClick={() => applyQuickNominal(100000)}
                        className={`py-3 rounded-[12px] text-[13px] font-bold flex flex-col items-center justify-center transition-all ${amountReceived === 100000 ? 'bg-black/5' : 'hover:bg-black/5'}`}
                        style={{ border: '1px solid var(--color-ucw-border)' }}
                    >
                        <span className="text-[10px] uppercase tracking-widest opacity-50 mb-0.5">Cash</span>
                        <span style={{ color: 'var(--color-ucw-dark)' }}>100.000</span>
                    </button>
                    <button 
                        onClick={() => applyQuickNominal(totalAmount)}
                        className={`py-3 rounded-[12px] text-[13px] font-bold flex flex-col items-center justify-center transition-all ${amountReceived === totalAmount ? 'bg-black/5' : 'hover:bg-black/5'}`}
                        style={{ border: '1px solid var(--color-ucw-border)' }}
                    >
                        <span className="text-[10px] uppercase tracking-widest opacity-50 mb-0.5">Exact</span>
                        <span style={{ color: 'var(--color-ucw-dark)' }}>{totalAmount.toLocaleString('id-ID')}</span>
                    </button>
                </div>

                {/* ── Suggested Change (Light Greenish Box) ── */}
                <div className="flex items-center justify-between p-5 rounded-[16px] mb-8" 
                    style={{ backgroundColor: '#F3F6F3', border: '1px solid #E2E8E2' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center" style={{ color: 'var(--color-ucw-text-muted)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--color-ucw-text-muted)' }}>Suggested Change</p>
                            <p className="text-[18px] font-black" style={{ color: 'var(--color-ucw-dark)' }}>
                                Rp {change.toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>
                    {isSufficient && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ border: '2px solid var(--color-ucw-dark)', color: 'var(--color-ucw-dark)' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                    )}
                </div>

                {/* ── Main Actions ── */}
                <button
                    onClick={() => { onClose(); onMarkPaid(order.id); }}
                    disabled={!isSufficient}
                    className="w-full py-4 rounded-[14px] text-[15px] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                    style={{ backgroundColor: 'var(--color-ucw-dark)' }}
                >
                    Mark as Paid
                </button>
                
                <div className="flex items-center gap-3 mb-6">
                    <button
                        className="flex-1 py-3.5 rounded-[14px] text-[13px] font-bold transition-all active:scale-[0.98]"
                        style={{ backgroundColor: '#E8F2E8', color: '#2E5A2E' }} // Pale green from image
                    >
                        Verify Payment
                    </button>
                    <button
                        onClick={() => { onClose(); onPaymentFailed(order.id); }}
                        className="flex-1 py-3.5 rounded-[14px] text-[13px] font-bold transition-all active:scale-[0.98]"
                        style={{ backgroundColor: '#FCE8E8', color: '#C0392B' }} // Pale red from image
                    >
                        Payment Failed
                    </button>
                </div>
                
                {/* ── Footer ── */}
                <div className="flex items-center justify-center gap-2 pt-4 border-t" style={{ borderColor: 'var(--color-ucw-border)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-ucw-text-muted)' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    <span className="text-[10px] font-semibold" style={{ color: 'var(--color-ucw-text-muted)' }}>
                        Secure transaction log active for Barista #04
                    </span>
                </div>
            </div>
        </div>
    );
}
