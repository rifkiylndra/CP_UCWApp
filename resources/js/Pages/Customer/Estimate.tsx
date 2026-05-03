import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Components/Layout/CustomerLayout';

interface Props { tableId: string; }

export default function Estimate({ tableId }: Props) {
    const estimatedMins = 12; // from server in real app

    return (
        <>
            <Head title="Preparation Time" />
            <CustomerLayout
                showBack
                backHref={route('customer.order-type', { tableId })}
                title="Almost There"
                step={3}
            >
                <div className="flex flex-col flex-1 px-5 pb-32">
                    {/* ── Hero Estimate Card ── */}
                    <div className="mt-6 p-6 rounded-3xl flex flex-col items-center text-center"
                        style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                        {/* Animated clock icon */}
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <p className="text-white/50 text-[11px] uppercase tracking-widest mb-2">Estimated prep time</p>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-[64px] font-black text-white leading-none">{estimatedMins}</span>
                            <span className="text-[20px] font-medium text-white/60">mins</span>
                        </div>
                        <p className="text-white/50 text-[13px]">Your barista is ready to craft your order.</p>
                    </div>

                    {/* ── Order Summary ── */}
                    <div className="mt-5 p-5 rounded-2xl" style={{ backgroundColor: 'white', border: '1px solid var(--color-ucw-border)' }}>
                        <h3 className="text-[12px] uppercase tracking-widest font-semibold mb-4"
                            style={{ color: 'var(--color-ucw-text-muted)' }}>
                            Order Summary
                        </h3>
                        <div className="flex flex-col gap-3">
                            {[
                                { name: 'Single Origin Flat White', qty: 1, price: 42000 },
                                { name: 'Honey Oat Latte',          qty: 2, price: 96000 },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold"
                                            style={{ backgroundColor: 'var(--color-ucw-bg)', color: 'var(--color-ucw-text-muted)' }}>
                                            {item.qty}
                                        </span>
                                        <span className="text-[13px]" style={{ color: 'var(--color-ucw-text)' }}>{item.name}</span>
                                    </div>
                                    <span className="text-[13px] font-semibold" style={{ color: 'var(--color-ucw-text)' }}>
                                        Rp {item.price.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="h-px my-4" style={{ backgroundColor: 'var(--color-ucw-border)' }} />
                        <div className="flex justify-between">
                            <span className="text-[14px] font-bold" style={{ color: 'var(--color-ucw-text)' }}>Total</span>
                            <span className="text-[14px] font-black" style={{ color: 'var(--color-ucw-dark)' }}>Rp 143.000</span>
                        </div>
                    </div>

                    {/* ── Info chips ── */}
                    <div className="flex gap-3 mt-4">
                        {[
                            { icon: '📍', text: 'Table T01' },
                            { icon: '🪑', text: 'Dine-in' },
                        ].map((chip, i) => (
                            <div key={i} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px]"
                                style={{ backgroundColor: 'var(--color-ucw-border)', color: 'var(--color-ucw-text-muted)' }}>
                                <span>{chip.icon}</span>
                                <span>{chip.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Fixed Footer ── */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                    style={{ background: 'linear-gradient(to top, var(--color-ucw-bg) 70%, transparent)' }}>
                    <Link
                        href={route('customer.payment', { tableId })}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-semibold transition-transform active:scale-[0.98]"
                        style={{ backgroundColor: 'var(--color-ucw-dark)', color: 'white' }}
                    >
                        Choose Payment
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </CustomerLayout>
        </>
    );
}
