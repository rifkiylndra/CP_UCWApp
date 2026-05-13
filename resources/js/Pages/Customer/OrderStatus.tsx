import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import BottomNav from '@/Components/customer/BottomNav';
import type { OrderStatus } from '@/types/customer';

interface OrderItem {
    id:       string;
    name:     string;
    subtitle: string;
    imageUrl: string;
}

interface Props {
    tableId:        string;
    orderId:        string;
    orderRef?:      string;
    cartCount?:     number;
    initialStatus?: OrderStatus;
    estimatedSecs?: number;
    items?:         OrderItem[];
}

const PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23E8E2DB'/%3E%3C/svg%3E";

const DEMO_ITEMS: OrderItem[] = [
    { id: '1', name: 'Hand-Crafted Latte', subtitle: '12OZ • OAT MILK • SINGLE ORIGIN', imageUrl: '' },
];

type StepStatus = 'done' | 'active' | 'pending';

const STEPS: { key: OrderStatus; label: string; sublabel: string }[] = [
    { key: 'pending',   label: 'Waiting',    sublabel: 'Order received'              },
    { key: 'preparing', label: 'Processing', sublabel: 'Grinding and brewing now...' },
    { key: 'ready',     label: 'Done',       sublabel: 'Ready for pickup at counter' },
];

function stepStatus(stepKey: OrderStatus, current: OrderStatus): StepStatus {
    const order: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];
    const stepIdx    = order.indexOf(stepKey === 'confirmed' ? 'pending' : stepKey);
    const currentIdx = order.indexOf(current);
    if (currentIdx > stepIdx) return 'done';
    if (current === stepKey
        || (stepKey === 'pending'   && (current === 'pending' || current === 'confirmed'))
        || (stepKey === 'preparing' && current === 'preparing')
        || (stepKey === 'ready'     && current === 'ready'))
        return 'active';
    return 'pending';
}

function formatCountdown(secs: number) {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
}

export default function OrderStatusPage({
    tableId,
    orderId,
    orderRef      = 'EB-94021',
    cartCount     = 0,
    initialStatus = 'preparing',
    estimatedSecs = 525,
    items         = DEMO_ITEMS,
}: Props) {
    const [status, setStatus]     = useState<OrderStatus>(initialStatus);
    const [timeLeft, setTimeLeft] = useState(estimatedSecs);
    const [receivedAt]            = useState(() =>
        new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    );

    useEffect(() => {
        if (timeLeft <= 0) return;
        const t = setInterval(() => setTimeLeft(p => Math.max(0, p - 1)), 1000);
        return () => clearInterval(t);
    }, [timeLeft]);

    const isReady = status === 'ready' || status === 'completed';

    return (
        <>
            <Head title="Order Status — UCW" />
            <CustomerLayout hideTopBar>

                {/* ══════════════════════════════════════════════
                    MOBILE
                ══════════════════════════════════════════════ */}
                <div className="md:hidden flex flex-col flex-1" style={{ backgroundColor: 'var(--color-ucw-bg)' }}>
                    {/* Custom header */}
                    <div className="flex items-center justify-between px-5 pt-4 pb-3" style={{ backgroundColor: 'var(--color-ucw-bg)' }}>
                        <button
                            onClick={() => router.visit(route('customer.menu', { tableId }))}
                            className="flex items-center gap-2 transition-opacity active:opacity-60"
                            style={{ color: 'var(--color-ucw-text-muted)' }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                            <span className="font-semibold uppercase tracking-[0.12em]" style={{ fontSize: '10px' }}>THE EDITORIAL BARISTA</span>
                        </button>
                        <button
                            onClick={() => router.visit(route('customer.cart', { tableId }))}
                            className="relative w-9 h-9 flex items-center justify-center rounded-full"
                            style={{ backgroundColor: 'var(--color-ucw-border)' }}
                        >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="2" strokeLinecap="round">
                                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 1.99-1.77L23 6H6"/>
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col flex-1 px-5 pb-36">
                        <TimerSection isReady={isReady} timeLeft={timeLeft} />
                        <StatusCard isReady={isReady} className="mb-4" />
                        <StatusSteps status={status} receivedAt={receivedAt} className="mb-4" />
                        <ItemList items={items} className="mb-3" />
                        <OrderIdRow orderRef={orderRef} />
                        <ContactBarista className="mt-4 text-center" />

                        {process.env.NODE_ENV === 'development' && (
                            <button
                                onClick={() => router.visit(route('customer.ready', { tableId, orderId }))}
                                className="mt-6 w-full py-3 rounded-xl text-sm font-medium transition-opacity active:opacity-60"
                                style={{ border: '1.5px dashed var(--color-ucw-border-dark)', color: 'var(--color-ucw-text-muted)' }}
                            >
                                [Dev] Simulate: Order Ready →
                            </button>
                        )}
                    </div>

                    {/* Fixed bottom nav */}
                    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40" style={{ backgroundColor: 'var(--color-ucw-bg)' }}>
                        <BottomNav tableId={tableId} active="orders" cartCount={cartCount} />
                    </div>
                </div>

                {/* ══════════════════════════════════════════════
                    DESKTOP — two columns
                ══════════════════════════════════════════════ */}
                <div className="hidden md:flex min-h-svh" style={{ backgroundColor: '#E8E1D8' }}>

                    {/* Left: status tracking */}
                    <main className="flex-1 overflow-y-auto flex flex-col">
                        {/* Top bar */}
                        <div className="sticky top-0 z-30 flex items-center justify-between px-10 py-5" style={{ background: 'var(--color-ucw-bg)', borderBottom: '1px solid var(--color-ucw-border)' }}>
                            <button
                                onClick={() => router.visit(route('customer.menu', { tableId }))}
                                className="flex items-center gap-2 transition-opacity active:opacity-60"
                                style={{ color: 'var(--color-ucw-text-muted)' }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                                <div className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round">
                                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                                        <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                                    </svg>
                                    <span className="font-bold text-sm tracking-[0.04em]" style={{ color: 'var(--color-ucw-dark)' }}>UNAND CO-WORKSPACE</span>
                                </div>
                            </button>
                            <span className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--color-ucw-text-muted)' }}>Live Order Tracking</span>
                        </div>

                        <div className="flex-1 max-w-2xl mx-auto w-full px-10 py-10">
                            <TimerSection isReady={isReady} timeLeft={timeLeft} desktop />
                            <StatusCard isReady={isReady} className="mb-5" />
                            <StatusSteps status={status} receivedAt={receivedAt} className="mb-5" />
                            <ItemList items={items} className="mb-4" />
                            <ContactBarista />

                            {process.env.NODE_ENV === 'development' && (
                                <button
                                    onClick={() => router.visit(route('customer.ready', { tableId, orderId }))}
                                    className="mt-6 w-full py-3 rounded-xl text-sm font-medium"
                                    style={{ border: '1.5px dashed var(--color-ucw-border-dark)', color: 'var(--color-ucw-text-muted)' }}
                                >
                                    [Dev] Simulate: Order Ready →
                                </button>
                            )}
                        </div>
                    </main>

                    {/* Right: order summary panel */}
                    <aside
                        className="w-[300px] shrink-0 sticky top-0 h-svh overflow-y-auto flex flex-col"
                        style={{ background: 'var(--color-ucw-bg)', borderLeft: '1px solid var(--color-ucw-border)' }}
                    >
                        <div className="px-8 pt-8 pb-5" style={{ borderBottom: '1px solid var(--color-ucw-border)' }}>
                            <h2 className="font-black text-xl mb-0.5" style={{ color: 'var(--color-ucw-dark)' }}>Order Tracking</h2>
                            <p className="text-xs" style={{ color: 'var(--color-ucw-text-muted)' }}>#{orderRef}</p>
                        </div>

                        <div className="flex-1 px-8 py-6 flex flex-col gap-5">
                            {/* Live status pill */}
                            <div
                                className="flex items-center gap-2 px-4 py-3 rounded-xl"
                                style={{ background: isReady ? 'var(--color-ucw-green-bg)' : 'var(--color-ucw-bg-warm)', border: `1px solid ${isReady ? 'var(--color-ucw-green)' : 'var(--color-ucw-border)'}` }}
                            >
                                <span className="relative flex h-2 w-2">
                                    {!isReady && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: 'var(--color-ucw-dark)' }} />}
                                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: isReady ? 'var(--color-ucw-green)' : 'var(--color-ucw-dark)' }} />
                                </span>
                                <span className="font-bold text-xs uppercase tracking-[0.1em]" style={{ color: isReady ? 'var(--color-ucw-green-text)' : 'var(--color-ucw-dark)' }}>
                                    {isReady ? 'Ready for pickup!' : 'Preparing your order'}
                                </span>
                            </div>

                            {/* Countdown large */}
                            <div className="rounded-2xl p-5 flex flex-col items-center" style={{ background: 'var(--color-ucw-dark)' }}>
                                <p className="font-semibold uppercase tracking-[0.14em] mb-1" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)' }}>ESTIMATED WAIT</p>
                                <p className="font-black tabular-nums" style={{ fontSize: '42px', color: 'white', lineHeight: 1 }}>
                                    {isReady ? '00:00' : formatCountdown(timeLeft)}
                                </p>
                            </div>

                            {/* Steps summary (compact) */}
                            <div className="flex flex-col gap-2">
                                {STEPS.map(step => {
                                    const ss = stepStatus(step.key, status);
                                    return (
                                        <div key={step.key} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: ss === 'done' ? 'var(--color-ucw-green-bg)' : ss === 'active' ? 'var(--color-ucw-dark)' : 'var(--color-ucw-border)' }}>
                                                {ss === 'done' ? (
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-green-text)" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                ) : ss === 'active' ? (
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                                                ) : (
                                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-ucw-text-muted)' }} />
                                                )}
                                            </div>
                                            <span className="text-sm font-medium" style={{ color: ss === 'active' ? 'var(--color-ucw-dark)' : 'var(--color-ucw-text-muted)' }}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Order ID */}
                            <OrderIdRow orderRef={orderRef} compact />
                        </div>
                    </aside>
                </div>

            </CustomerLayout>
        </>
    );
}

/* ─── Sub-components ─── */

function TimerSection({ isReady, timeLeft, desktop = false }: { isReady: boolean; timeLeft: number; desktop?: boolean }) {
    return (
        <div className={`flex flex-col items-center ${desktop ? 'pt-0 pb-8' : 'pt-4 pb-6'}`}>
            <div className="relative mb-5">
                <div className="w-28 h-28 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-ucw-border)' }}>
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'white' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                            <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                        </svg>
                    </div>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30px] h-1 rounded-full" style={{ backgroundColor: 'var(--color-ucw-dark)' }} />
            </div>
            <p className="font-black tabular-nums leading-none mb-1" style={{ fontSize: desktop ? '52px' : '48px', color: 'var(--color-ucw-dark)' }}>
                {isReady ? '00:00' : formatCountdown(timeLeft)}
            </p>
            <p className="font-semibold uppercase tracking-[0.16em]" style={{ fontSize: '10px', color: 'var(--color-ucw-text-muted)' }}>
                ESTIMATED WAIT TIME
            </p>
        </div>
    );
}

function StatusCard({ isReady, className = '' }: { isReady: boolean; className?: string }) {
    return (
        <div className={`rounded-2xl p-5 text-center ${className}`} style={{ backgroundColor: 'white', border: '1px solid var(--color-ucw-border)' }}>
            <h3 className="font-black mb-2" style={{ fontSize: '18px', color: 'var(--color-ucw-dark)' }}>
                {isReady ? 'Your order is ready! 🎉' : 'Our baristas are crafting your brew'}
            </h3>
            <p className="leading-relaxed" style={{ fontSize: '13px', color: 'var(--color-ucw-text-muted)' }}>
                {isReady
                    ? 'Please collect your order at the counter.'
                    : "We're precisely timing the extraction of your Ethiopia Yirgacheffe pour-over for the perfect profile."}
            </p>
        </div>
    );
}

function StatusSteps({ status, receivedAt, className = '' }: { status: OrderStatus; receivedAt: string; className?: string }) {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {STEPS.map(step => {
                const ss       = stepStatus(step.key, status);
                const isDone   = ss === 'done';
                const isActive = ss === 'active';
                return (
                    <div
                        key={step.key}
                        className="flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-500"
                        style={{
                            backgroundColor: isActive ? 'var(--color-ucw-dark)' : 'white',
                            border:          isActive ? 'none' : '1px solid var(--color-ucw-border)',
                        }}
                    >
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500"
                            style={{ backgroundColor: isDone ? 'var(--color-ucw-green-bg)' : isActive ? 'rgba(255,255,255,0.15)' : 'var(--color-ucw-border)' }}
                        >
                            {isDone ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-green-text)" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            ) : isActive ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-text-muted)" strokeWidth="2" strokeLinecap="round">
                                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
                                </svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-bold leading-tight" style={{
                                fontSize:      '14px',
                                color:         isActive ? 'white' : 'var(--color-ucw-text-muted)',
                                textTransform: isActive ? 'uppercase' : 'none',
                                letterSpacing: isActive ? '0.06em' : 'normal',
                            }}>
                                {step.label}
                            </p>
                            <p style={{ fontSize: '12px', color: isActive ? 'rgba(255,255,255,0.55)' : 'var(--color-ucw-text-muted)' }}>
                                {step.key === 'pending' ? `Order received at ${receivedAt}` : step.sublabel}
                            </p>
                        </div>
                        {isActive && (
                            <div className="flex gap-1 shrink-0">
                                {[0, 1, 2].map(i => (
                                    <span key={i} className="w-1.5 h-1.5 rounded-full" style={{
                                        backgroundColor: 'rgba(255,255,255,0.5)',
                                        animation: `pulse-soft 1.4s ease-in-out ${i * 0.2}s infinite`,
                                    }} />
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function ItemList({ items, className = '' }: { items: OrderItem[]; className?: string }) {
    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 rounded-2xl p-4" style={{ backgroundColor: 'white', border: '1px solid var(--color-ucw-border)' }}>
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: 'var(--color-ucw-border)' }}>
                        <img
                            src={item.imageUrl || PLACEHOLDER} alt={item.name}
                            className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold" style={{ fontSize: '15px', color: 'var(--color-ucw-dark)' }}>{item.name}</p>
                        <p className="uppercase tracking-wider mt-0.5" style={{ fontSize: '10px', color: 'var(--color-ucw-text-muted)' }}>{item.subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function OrderIdRow({ orderRef, compact = false }: { orderRef: string; compact?: boolean }) {
    return (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--color-ucw-bg-warm)' }}>
            <div>
                <p className="font-semibold uppercase tracking-[0.12em] mb-0.5" style={{ fontSize: '9px', color: 'var(--color-ucw-text-muted)' }}>ORDER ID</p>
                <p className="font-black" style={{ fontSize: '14px', color: 'var(--color-ucw-dark)' }}>#{orderRef}</p>
            </div>
            {!compact && (
                <button className="flex items-center gap-1.5 font-semibold transition-opacity active:opacity-60" style={{ fontSize: '13px', color: 'var(--color-ucw-dark)' }}>
                    View Receipt
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                </button>
            )}
        </div>
    );
}

function ContactBarista({ className = '' }: { className?: string }) {
    return (
        <div className={className}>
            <p className="mb-2" style={{ fontSize: '13px', color: 'var(--color-ucw-text-muted)' }}>Need to adjust your order?</p>
            <button className="font-bold uppercase tracking-[0.12em] transition-opacity active:opacity-60" style={{ fontSize: '11px', color: 'var(--color-ucw-dark)' }}>
                CONTACT THE BARISTA
            </button>
        </div>
    );
}