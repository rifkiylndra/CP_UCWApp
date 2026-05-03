import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import CustomerLayout from '@/Components/Layout/CustomerLayout';
import type { PaymentMethod } from '@/types/customer';

interface Props { tableId: string; }

const PAYMENT_OPTIONS: { method: PaymentMethod; label: string; icon: string; sublabel: string; route: string }[] = [
    { method: 'qris',    label: 'QRIS',      icon: '📱', sublabel: 'Scan with any e-wallet app',   route: 'payment.online' },
    { method: 'gopay',   label: 'GoPay',     icon: '🟢', sublabel: 'Pay via GoJek app',             route: 'payment.online' },
    { method: 'ovo',     label: 'OVO',       icon: '🟣', sublabel: 'Pay via OVO app',              route: 'payment.online' },
    { method: 'card',    label: 'Debit/Credit Card', icon: '💳', sublabel: 'Visa, Mastercard accepted', route: 'payment.online' },
    { method: 'cash',    label: 'Cash',      icon: '💵', sublabel: 'Pay at the counter',           route: 'payment.cash' },
];

export default function ChoosePayment({ tableId }: Props) {
    const [selected, setSelected] = useState<PaymentMethod | null>(null);

    function handleContinue() {
        if (!selected) return;
        const opt = PAYMENT_OPTIONS.find(o => o.method === selected)!;
        router.visit(route(`customer.${opt.route}`, { tableId }));
    }

    return (
        <>
            <Head title="Payment" />
            <CustomerLayout
                showBack
                backHref={route('customer.estimate', { tableId })}
                title="Choose Payment"
                step={4}
            >
                <div className="flex flex-col flex-1 px-5 pt-6 pb-36">
                    <h2 className="text-[22px] font-black tracking-tight mb-1" style={{ color: 'var(--color-ucw-text)' }}>
                        How would you<br />like to pay?
                    </h2>
                    <p className="text-[13px] mb-6" style={{ color: 'var(--color-ucw-text-muted)' }}>
                        Total: <strong style={{ color: 'var(--color-ucw-dark)' }}>Rp 143.000</strong>
                    </p>

                    {/* Payment options */}
                    <div className="flex flex-col gap-3">
                        {PAYMENT_OPTIONS.map(opt => {
                            const isSelected = selected === opt.method;
                            return (
                                <button
                                    key={opt.method}
                                    onClick={() => setSelected(opt.method)}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200"
                                    style={{
                                        backgroundColor: isSelected ? 'var(--color-ucw-dark)' : 'white',
                                        border: `2px solid ${isSelected ? 'var(--color-ucw-dark)' : 'var(--color-ucw-border)'}`,
                                    }}
                                >
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-none"
                                        style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.15)' : 'var(--color-ucw-bg)' }}>
                                        {opt.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[14px] font-semibold"
                                            style={{ color: isSelected ? 'white' : 'var(--color-ucw-text)' }}>
                                            {opt.label}
                                        </p>
                                        <p className="text-[12px]"
                                            style={{ color: isSelected ? 'rgba(255,255,255,0.55)' : 'var(--color-ucw-text-muted)' }}>
                                            {opt.sublabel}
                                        </p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-none transition-all`}
                                        style={{
                                            borderColor: isSelected ? 'white' : 'var(--color-ucw-border-dark)',
                                            backgroundColor: isSelected ? 'white' : 'transparent',
                                        }}>
                                        {isSelected && (
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-ucw-dark)' }} />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                    style={{ background: 'linear-gradient(to top, var(--color-ucw-bg) 70%, transparent)' }}>
                    <button
                        onClick={handleContinue}
                        disabled={!selected}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-semibold transition-all active:scale-[0.98]"
                        style={{
                            backgroundColor: selected ? 'var(--color-ucw-dark)' : 'var(--color-ucw-border)',
                            color: selected ? 'white' : 'var(--color-ucw-text-muted)',
                        }}
                    >
                        Confirm Payment
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </CustomerLayout>
        </>
    );
}
