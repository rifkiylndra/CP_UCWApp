import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import CustomerLayout from '@/Components/Layout/CustomerLayout';
import type { OrderType } from '@/types/customer';

interface Props { tableId: string; }

const OPTIONS: { type: OrderType; icon: string; label: string; sublabel: string }[] = [
    { type: 'dine-in',  icon: '🪑', label: 'Dine In',   sublabel: 'Enjoy your brew right here at the table.' },
    { type: 'takeaway', icon: '🛍️', label: 'Takeaway',  sublabel: 'We\'ll pack it fresh for you on the go.' },
];

export default function OrderType({ tableId }: Props) {
    const [selected, setSelected] = useState<OrderType | null>(null);

    function handleContinue() {
        if (!selected) return;
        router.visit(route('customer.estimate', { tableId }));
    }

    return (
        <>
            <Head title="Order Type" />
            <CustomerLayout
                showBack
                backHref={route('customer.cart', { tableId })}
                title="Order Type"
                step={2}
            >
                <div className="flex flex-col flex-1 px-5 pt-8 pb-32">
                    <div className="mb-8">
                        <h2 className="text-[26px] font-black tracking-tight mb-2" style={{ color: 'var(--color-ucw-text)' }}>
                            How would you like your order?
                        </h2>
                        <p className="text-[14px]" style={{ color: 'var(--color-ucw-text-muted)' }}>
                            Select your preference below.
                        </p>
                    </div>

                    {/* Options */}
                    <div className="flex flex-col gap-4">
                        {OPTIONS.map(opt => {
                            const isSelected = selected === opt.type;
                            return (
                                <button
                                    key={opt.type}
                                    onClick={() => setSelected(opt.type)}
                                    className="w-full flex items-center gap-5 p-5 rounded-2xl text-left transition-all duration-200"
                                    style={{
                                        backgroundColor: isSelected ? 'var(--color-ucw-dark)' : 'white',
                                        border: `2px solid ${isSelected ? 'var(--color-ucw-dark)' : 'var(--color-ucw-border)'}`,
                                    }}
                                >
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-none"
                                        style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.15)' : 'var(--color-ucw-bg)' }}>
                                        {opt.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-[17px] font-bold mb-0.5"
                                            style={{ color: isSelected ? 'white' : 'var(--color-ucw-text)' }}>
                                            {opt.label}
                                        </h3>
                                        <p className="text-[13px] leading-relaxed"
                                            style={{ color: isSelected ? 'rgba(255,255,255,0.6)' : 'var(--color-ucw-text-muted)' }}>
                                            {opt.sublabel}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <div className="ml-auto flex-none w-6 h-6 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: 'white' }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Fixed Footer ── */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                    style={{ background: 'linear-gradient(to top, var(--color-ucw-bg) 70%, transparent)' }}>
                    <button
                        onClick={handleContinue}
                        disabled={!selected}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-semibold transition-all"
                        style={{
                            backgroundColor: selected ? 'var(--color-ucw-dark)' : 'var(--color-ucw-border)',
                            color: selected ? 'white' : 'var(--color-ucw-text-muted)',
                        }}
                    >
                        Continue
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </CustomerLayout>
        </>
    );
}
