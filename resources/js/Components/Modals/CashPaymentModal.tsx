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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-[480px] bg-white rounded-[24px] overflow-hidden shadow-2xl flex flex-col"
                style={{ border: '1px solid var(--color-ucw-border)' }}>
                
                {/* ── Header ── */}
                <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-ucw-border)' }}>
                    <div>
                        <h3 className="text-[18px] font-black tracking-tight" style={{ color: 'var(--color-ucw-dark)' }}>
                            Cash Payment
                        </h3>
                        <p className="text-[12px] font-medium" style={{ color: 'var(--color-ucw-text-muted)' }}>
                            Verify payment for Order #{order.orderId}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/5 text-gray-400 hover:text-gray-600">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* ── Main Content ── */}
                <div className="p-6 flex flex-col gap-6">
                    
                    {/* Amount to Pay (Besar, Bold) */}
                    <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                        <p className="text-white/50 text-[11px] font-bold uppercase tracking-widest mb-1">Total Amount</p>
                        <h2 className="text-white text-[42px] font-black leading-none">
                            Rp {totalAmount.toLocaleString('id-ID')}
                        </h2>
                    </div>

                    {/* Amount Received Input */}
                    <div>
                        <label className="block text-[12px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-ucw-text-muted)' }}>
                            Amount Received
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] font-black" style={{ color: 'var(--color-ucw-text-muted)' }}>
                                Rp
                            </span>
                            <input
                                type="number"
                                value={amountReceived}
                                onChange={(e) => setAmountReceived(e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="0"
                                className="w-full pl-12 pr-4 py-4 rounded-xl text-[20px] font-black outline-none transition-all"
                                style={{ 
                                    backgroundColor: 'var(--color-ucw-bg-warm)', 
                                    border: `2px solid ${isSufficient ? 'var(--color-ucw-green)' : 'var(--color-ucw-border-dark)'}`,
                                    color: 'var(--color-ucw-text)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Quick Nominal Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                        <button onClick={() => applyQuickNominal(totalAmount)} className="py-2.5 rounded-lg text-[13px] font-bold transition-all hover:bg-black/5" style={{ border: '1.5px solid var(--color-ucw-border-dark)', color: 'var(--color-ucw-text)' }}>
                            Exact Amount
                        </button>
                        <button onClick={() => applyQuickNominal(50000)} className="py-2.5 rounded-lg text-[13px] font-bold transition-all hover:bg-black/5" style={{ border: '1.5px solid var(--color-ucw-border-dark)', color: 'var(--color-ucw-text)' }}>
                            50.000
                        </button>
                        <button onClick={() => applyQuickNominal(100000)} className="py-2.5 rounded-lg text-[13px] font-bold transition-all hover:bg-black/5" style={{ border: '1.5px solid var(--color-ucw-border-dark)', color: 'var(--color-ucw-text)' }}>
                            100.000
                        </button>
                    </div>

                    {/* Change Calculation */}
                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--color-ucw-bg-warm)', border: '1px dashed var(--color-ucw-border-dark)' }}>
                        <span className="text-[13px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-ucw-text-muted)' }}>Change</span>
                        <span className="text-[24px] font-black" style={{ color: isSufficient ? 'var(--color-ucw-green)' : 'var(--color-ucw-text)' }}>
                            Rp {change.toLocaleString('id-ID')}
                        </span>
                    </div>

                </div>

                {/* ── Footer Actions ── */}
                <div className="p-6 pt-0 flex flex-col gap-3 mt-auto">
                    <button
                        onClick={() => { onClose(); onMarkPaid(order.id); }}
                        disabled={!isSufficient}
                        className="w-full py-4 rounded-xl text-[14px] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: 'var(--color-ucw-green)' }}
                    >
                        Mark as Paid & Print Receipt
                    </button>
                    <button
                        onClick={() => { onClose(); onPaymentFailed(order.id); }}
                        className="w-full py-3.5 rounded-xl text-[13px] font-bold transition-all hover:bg-red-50"
                        style={{ border: '1.5px solid var(--color-ucw-red)', color: 'var(--color-ucw-red)' }}
                    >
                        Payment Failed / Cancel
                    </button>
                    
                    {/* Security Note */}
                    <p className="text-center text-[10px] uppercase tracking-widest font-bold mt-2" style={{ color: 'var(--color-ucw-text-muted)' }}>
                        🔒 Cashier responsibility active
                    </p>
                </div>

            </div>
        </div>
    );
}
