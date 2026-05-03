import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Components/Layout/CustomerLayout';
import type { OrderStatus } from '@/types/customer';

interface Props {
    tableId: string;
    orderId: string;
}

const STATUS_STEPS: { status: OrderStatus; label: string; sublabel: string; emoji: string }[] = [
    { status: 'pending',   label: 'Order Received',   sublabel: 'Your order has been placed',           emoji: '✓' },
    { status: 'confirmed', label: 'Payment Confirmed', sublabel: 'Your payment is verified',             emoji: '💳' },
    { status: 'preparing', label: 'Being Prepared',    sublabel: 'Your barista is crafting your brew',   emoji: '☕' },
    { status: 'ready',     label: 'Ready for Pickup',  sublabel: 'Come grab your order!',               emoji: '🎉' },
];

// Simulate progression (in production: Laravel Echo)
const DEMO_PROGRESSION: OrderStatus[] = ['pending', 'confirmed', 'preparing'];

export default function OrderStatus({ tableId, orderId }: Props) {
    const [currentStatus, setCurrentStatus] = useState<OrderStatus>('pending');
    const [stepIndex, setStepIndex] = useState(0);

    // Simulate real-time updates (replace with Echo in production)
    useEffect(() => {
        const intervals = DEMO_PROGRESSION.map((status, i) =>
            setTimeout(() => {
                setCurrentStatus(status);
                setStepIndex(i);
            }, i * 3000)
        );

        /* ── Laravel Echo Integration ──
        window.Echo.channel(`order.${orderId}`)
            .listen('OrderStatusUpdated', (e: { status: OrderStatus }) => {
                setCurrentStatus(e.status);
                setStepIndex(STATUS_STEPS.findIndex(s => s.status === e.status));
            });
        */

        return () => intervals.forEach(clearTimeout);
    }, [orderId]);

    const activeIdx = STATUS_STEPS.findIndex(s => s.status === currentStatus);

    return (
        <>
            <Head title="Order Status" />
            <CustomerLayout title="Order Status" step={6}>
                <div className="flex flex-col flex-1 px-5 pt-6 pb-24">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-[24px] font-black tracking-tight" style={{ color: 'var(--color-ucw-text)' }}>
                                Tracking your order
                            </h2>
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                                style={{ backgroundColor: 'var(--color-ucw-green-bg)', color: 'var(--color-ucw-green-text)' }}>
                                ● LIVE
                            </span>
                        </div>
                        <p className="text-[13px]" style={{ color: 'var(--color-ucw-text-muted)' }}>
                            Order #{orderId} · Table {tableId}
                        </p>
                    </div>

                    {/* ── Status Steps ── */}
                    <div className="flex flex-col gap-0 mb-6">
                        {STATUS_STEPS.map((step, i) => {
                            const isDone    = i < activeIdx;
                            const isActive  = i === activeIdx;
                            const isPending = i > activeIdx;

                            return (
                                <div key={step.status} className="flex gap-4">
                                    {/* Left: line + dot */}
                                    <div className="flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[16px] flex-none transition-all duration-500`}
                                            style={{
                                                backgroundColor: isDone ? 'var(--color-ucw-green)' : isActive ? 'var(--color-ucw-dark)' : 'var(--color-ucw-border)',
                                                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                            }}>
                                            {isDone
                                                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                : <span style={{ color: isPending ? 'var(--color-ucw-text-muted)' : 'white' }}>{step.emoji}</span>
                                            }
                                        </div>
                                        {i < STATUS_STEPS.length - 1 && (
                                            <div className="w-0.5 flex-1 my-1 min-h-[24px] transition-all duration-500"
                                                style={{ backgroundColor: isDone ? 'var(--color-ucw-green)' : 'var(--color-ucw-border)' }} />
                                        )}
                                    </div>

                                    {/* Right: text */}
                                    <div className="pb-6 pt-1">
                                        <p className={`text-[14px] font-semibold leading-tight`}
                                            style={{ color: isPending ? 'var(--color-ucw-text-muted)' : 'var(--color-ucw-text)' }}>
                                            {step.label}
                                            {isActive && (
                                                <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
                                                    style={{ backgroundColor: 'var(--color-ucw-dark)', color: 'white' }}>
                                                    ● Now
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-[12px] mt-0.5"
                                            style={{ color: 'var(--color-ucw-text-muted)' }}>
                                            {step.sublabel}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Estimated wait ── */}
                    <div className="p-4 rounded-2xl flex items-center gap-4"
                        style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-none"
                            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white/50 text-[11px] uppercase tracking-wider">Est. wait time</p>
                            <p className="text-white text-[22px] font-black">~8 mins</p>
                        </div>
                    </div>
                </div>

                {/* Footer: link to "Ready" page (Echo will trigger in production) */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                    style={{ background: 'linear-gradient(to top, var(--color-ucw-bg) 70%, transparent)' }}>
                    <Link
                        href={route('customer.ready', { tableId, orderId })}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[14px] font-medium"
                        style={{ border: '1.5px solid var(--color-ucw-border-dark)', color: 'var(--color-ucw-text-muted)' }}
                    >
                        Simulate: Order Ready →
                    </Link>
                </div>
            </CustomerLayout>
        </>
    );
}
