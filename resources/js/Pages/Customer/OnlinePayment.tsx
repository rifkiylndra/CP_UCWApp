import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Components/Layout/CustomerLayout';

interface Props { tableId: string; }

export default function OnlinePayment({ tableId }: Props) {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) { setIsExpired(true); clearInterval(timer); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const secs = String(timeLeft % 60).padStart(2, '0');
    const percent = (timeLeft / 300) * 100;

    return (
        <>
            <Head title="QRIS Payment" />
            <CustomerLayout
                showBack
                backHref={route('customer.payment', { tableId })}
                title="Scan to Pay"
                step={5}
            >
                <div className="flex flex-col flex-1 items-center px-5 pt-6 pb-32">
                    {/* Amount */}
                    <div className="w-full p-5 rounded-2xl text-center mb-6"
                        style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                        <p className="text-white/50 text-[11px] uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="text-white text-[36px] font-black">Rp 143.000</p>
                    </div>

                    {/* QRIS Code placeholder */}
                    <div className="w-full p-6 rounded-2xl mb-5 flex flex-col items-center"
                        style={{ backgroundColor: 'white', border: '1px solid var(--color-ucw-border)' }}>
                        {/* Simulated QR grid */}
                        <div className="w-[200px] h-[200px] rounded-xl overflow-hidden mb-4 relative"
                            style={{ border: '3px solid var(--color-ucw-dark)' }}>
                            <div className="w-full h-full grid grid-cols-10 grid-rows-10 gap-[2px] p-2">
                                {Array.from({ length: 100 }).map((_, i) => (
                                    <div key={i} className="rounded-[1px]"
                                        style={{ backgroundColor: Math.random() > 0.5 ? 'var(--color-ucw-dark)' : 'transparent' }} />
                                ))}
                            </div>
                            {/* Center logo */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <p className="text-[12px] font-semibold mb-0.5" style={{ color: 'var(--color-ucw-text)' }}>QRIS · UCW Coffee</p>
                        <p className="text-[11px]" style={{ color: 'var(--color-ucw-text-muted)' }}>Scan with GoPay, OVO, Dana, or your bank app</p>
                    </div>

                    {/* Timer */}
                    <div className="w-full p-4 rounded-2xl" style={{ backgroundColor: isExpired ? 'var(--color-ucw-red-bg)' : 'var(--color-ucw-bg-warm)', border: '1px solid var(--color-ucw-border)' }}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[12px] font-medium" style={{ color: isExpired ? 'var(--color-ucw-red-text)' : 'var(--color-ucw-text-muted)' }}>
                                {isExpired ? 'QR Code expired' : 'Expires in'}
                            </span>
                            <span className="text-[18px] font-black tabular-nums"
                                style={{ color: isExpired ? 'var(--color-ucw-red)' : 'var(--color-ucw-dark)' }}>
                                {mins}:{secs}
                            </span>
                        </div>
                        {/* Progress bar */}
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-ucw-border)' }}>
                            <div className="h-full rounded-full transition-all duration-1000"
                                style={{ width: `${percent}%`, backgroundColor: isExpired ? 'var(--color-ucw-red)' : 'var(--color-ucw-dark)' }} />
                        </div>
                    </div>

                    {/* After scan note */}
                    <p className="text-center text-[12px] mt-4" style={{ color: 'var(--color-ucw-text-muted)' }}>
                        After payment, your order will be confirmed automatically.
                    </p>
                </div>

                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                    style={{ background: 'linear-gradient(to top, var(--color-ucw-bg) 70%, transparent)' }}>
                    {/* Simulate success — in production, handled via Echo event */}
                    <Link
                        href={route('customer.status', { tableId, orderId: 'ORD-8829' })}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-semibold active:scale-[0.98] transition-transform"
                        style={{ backgroundColor: 'var(--color-ucw-dark)', color: 'white' }}
                    >
                        Simulate Payment Success
                    </Link>
                </div>
            </CustomerLayout>
        </>
    );
}
