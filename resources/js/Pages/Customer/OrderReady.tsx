import { useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import BottomNav from '@/Components/customer/BottomNav';

interface Props {
    tableId:        string;
    orderId:        string;
    orderRef?:      string;
    cartCount?:     number;
    pickupStation?: string;
    pickupDesc?:    string;
}

export default function OrderReady({
    tableId,
    orderId,
    orderRef      = 'B-842',
    cartCount     = 0,
    pickupStation = 'Pick-up Station 1',
    pickupDesc    = 'Main lobby, adjacent to the espresso bar. Look for the UCW signature sign.',
}: Props) {
    const vibrated = useRef(false);

    useEffect(() => {
        if ('vibrate' in navigator && !vibrated.current) {
            navigator.vibrate([100, 60, 100, 60, 200]);
            vibrated.current = true;
        }
    }, []);

    function handleComplete() {
        router.visit(route('customer.feedback', { tableId, orderId }));
    }

    return (
        <>
            <Head title="Your Brew is Ready! — UCW" />
            <CustomerLayout hideTopBar>

                {/* ══════════════════════════════════════════════
                    MOBILE
                ══════════════════════════════════════════════ */}
                <div className="md:hidden flex flex-col flex-1" style={{ backgroundColor: 'var(--color-ucw-bg)' }}>
                    {/* Custom header */}
                    <div className="flex items-center justify-between px-5 pt-4 pb-3" style={{ backgroundColor: 'var(--color-ucw-bg)' }}>
                        <button
                            onClick={() => router.visit(route('customer.status', { tableId, orderId }))}
                            className="flex items-center gap-2 transition-opacity active:opacity-60"
                            style={{ color: 'var(--color-ucw-text-muted)' }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                            <span className="font-semibold uppercase tracking-[0.12em]" style={{ fontSize: '10px' }}>THE EDITORIAL BARISTA</span>
                        </button>
                        <button
                            onClick={() => router.visit(route('customer.cart', { tableId }))}
                            className="w-9 h-9 flex items-center justify-center rounded-full"
                            style={{ backgroundColor: 'var(--color-ucw-border)' }}
                        >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="2" strokeLinecap="round">
                                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 1.99-1.77L23 6H6"/>
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col flex-1 px-5 pb-40">
                        <HeroSection />
                        <OrderNumberCard orderRef={orderRef} className="mb-3" />
                        <PickupCard pickupStation={pickupStation} pickupDesc={pickupDesc} className="mb-4" />
                    </div>

                    {/* Fixed bottom */}
                    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40" style={{ backgroundColor: 'var(--color-ucw-bg)' }}>
                        <div className="px-5 pt-3 pb-2">
                            <CompleteButton onComplete={handleComplete} />
                            <p className="text-center mt-2" style={{ fontSize: '11px', color: 'var(--color-ucw-text-muted)' }}>
                                Please show this screen to your barista if requested.
                            </p>
                        </div>
                        <BottomNav tableId={tableId} active="orders" cartCount={cartCount} />
                    </div>
                </div>

                {/* ══════════════════════════════════════════════
                    DESKTOP — two columns
                ══════════════════════════════════════════════ */}
                <div className="hidden md:flex min-h-svh" style={{ backgroundColor: '#E8E1D8' }}>

                    {/* Left: celebration content */}
                    <main className="flex-1 overflow-y-auto flex flex-col">
                        {/* Top bar */}
                        <div className="sticky top-0 z-30 flex items-center justify-between px-10 py-5" style={{ background: 'var(--color-ucw-bg)', borderBottom: '1px solid var(--color-ucw-border)' }}>
                            <button
                                onClick={() => router.visit(route('customer.status', { tableId, orderId }))}
                                className="flex items-center gap-2"
                                style={{ color: 'var(--color-ucw-text-muted)' }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                                <div className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round">
                                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                                        <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                                    </svg>
                                    <span className="font-bold text-sm tracking-[0.04em]" style={{ color: 'var(--color-ucw-dark)' }}>UNAND CO-WORKSPACE</span>
                                </div>
                            </button>
                            <span className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--color-ucw-text-muted)' }}>Order Ready</span>
                        </div>

                        <div className="flex-1 max-w-2xl mx-auto w-full px-10 py-10">
                            <HeroSection desktop />

                            {/* Two cards side by side */}
                            <div className="grid grid-cols-2 gap-4">
                                <OrderNumberCard orderRef={orderRef} large />
                                <PickupCard pickupStation={pickupStation} pickupDesc={pickupDesc} />
                            </div>

                            {/* Interior photo */}
                            <div className="mt-6 rounded-2xl overflow-hidden" style={{ height: '180px' }}>
                                <img
                                    src="/images/Unand_Co-Workspace_Interior.png"
                                    alt="Unand Co-Workspace"
                                    className="w-full h-full object-cover"
                                    style={{ filter: 'brightness(0.85)' }}
                                />
                            </div>
                        </div>
                    </main>

                    {/* Right: action panel */}
                    <aside
                        className="w-[300px] shrink-0 sticky top-0 h-svh overflow-y-auto flex flex-col"
                        style={{ background: 'var(--color-ucw-bg)', borderLeft: '1px solid var(--color-ucw-border)' }}
                    >
                        <div className="px-8 pt-8 pb-5" style={{ borderBottom: '1px solid var(--color-ucw-border)' }}>
                            <h2 className="font-black text-xl mb-0.5" style={{ color: 'var(--color-ucw-dark)' }}>Your Order</h2>
                            <p className="text-xs" style={{ color: 'var(--color-ucw-text-muted)' }}>#{orderRef} · Ready for pickup</p>
                        </div>

                        <div className="flex-1 px-8 py-6 flex flex-col gap-5">
                            {/* Ready status */}
                            <div className="rounded-2xl p-5 flex flex-col items-center text-center" style={{ background: 'var(--color-ucw-green-bg)', border: '1px solid var(--color-ucw-green)' }}>
                                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                                <p className="font-black text-lg leading-tight" style={{ color: 'var(--color-ucw-dark)' }}>Order is ready!</p>
                                <p className="text-xs mt-1" style={{ color: 'var(--color-ucw-green-text)' }}>Freshly brewed &amp; prepared</p>
                            </div>

                            {/* Pickup info */}
                            <div className="rounded-2xl p-4" style={{ background: 'var(--color-ucw-bg-warm)', border: '1px solid var(--color-ucw-border)' }}>
                                <p className="font-semibold uppercase tracking-[0.12em] mb-2" style={{ fontSize: '10px', color: 'var(--color-ucw-text-muted)' }}>PICKUP LOCATION</p>
                                <p className="font-bold text-sm" style={{ color: 'var(--color-ucw-dark)' }}>{pickupStation}</p>
                                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--color-ucw-text-muted)' }}>{pickupDesc}</p>
                            </div>

                            {/* What happens next */}
                            <div className="flex flex-col gap-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--color-ucw-text-muted)' }}>Next steps</p>
                                {[
                                    { n: '1', t: 'Head to the pickup station' },
                                    { n: '2', t: `Show order #${orderRef} to the barista` },
                                    { n: '3', t: 'Enjoy your brew!' },
                                ].map(s => (
                                    <div key={s.n} className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs text-white" style={{ backgroundColor: 'var(--color-ucw-dark)' }}>{s.n}</div>
                                        <p className="text-sm" style={{ color: 'var(--color-ucw-text-muted)' }}>{s.t}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="px-8 pb-8 flex flex-col gap-2">
                            <CompleteButton onComplete={handleComplete} />
                            <p className="text-center" style={{ fontSize: '11px', color: 'var(--color-ucw-text-muted)' }}>
                                Please show this screen to your barista if requested.
                            </p>
                        </div>
                    </aside>
                </div>

            </CustomerLayout>
        </>
    );
}

/* ─── Sub-components ─── */

function HeroSection({ desktop = false }: { desktop?: boolean }) {
    return (
        <div className={`flex flex-col items-center text-center ${desktop ? 'pb-8' : 'pt-8 pb-8'}`}>
            <div
                className="w-28 h-28 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: 'var(--color-ucw-green-bg)', boxShadow: '0 0 0 10px rgba(76,175,80,0.06), 0 0 0 20px rgba(76,175,80,0.03)' }}
            >
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </div>
            </div>
            <h1 className="font-black tracking-tight leading-[1.05] mb-3" style={{ fontSize: desktop ? '40px' : '36px', color: 'var(--color-ucw-dark)' }}>
                Order is ready!
            </h1>
            <p className="font-semibold uppercase tracking-[0.18em]" style={{ fontSize: '10px', color: 'var(--color-ucw-text-muted)' }}>
                FRESHLY BREWED &amp; PREPARED
            </p>
        </div>
    );
}

function OrderNumberCard({ orderRef, className = '', large = false }: { orderRef: string; className?: string; large?: boolean }) {
    return (
        <div className={`rounded-2xl p-5 text-center ${className}`} style={{ backgroundColor: 'white', border: '1px solid var(--color-ucw-border)' }}>
            <p className="font-semibold uppercase tracking-[0.14em] mb-2" style={{ fontSize: '10px', color: 'var(--color-ucw-text-muted)' }}>ORDER NUMBER</p>
            <p className="font-black tracking-tight" style={{ fontSize: large ? '36px' : '42px', color: 'var(--color-ucw-dark)' }}>#{orderRef}</p>
        </div>
    );
}

function PickupCard({ pickupStation, pickupDesc, className = '' }: { pickupStation: string; pickupDesc: string; className?: string }) {
    return (
        <div className={`flex items-start gap-4 rounded-2xl p-4 ${className}`} style={{ backgroundColor: 'white', border: '1px solid var(--color-ucw-border)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
            </div>
            <div>
                <p className="font-bold mb-1" style={{ fontSize: '15px', color: 'var(--color-ucw-dark)' }}>{pickupStation}</p>
                <p className="leading-relaxed" style={{ fontSize: '13px', color: 'var(--color-ucw-text-muted)', lineHeight: '1.6' }}>{pickupDesc}</p>
            </div>
        </div>
    );
}

function CompleteButton({ onComplete }: { onComplete: () => void }) {
    return (
        <button
            onClick={onComplete}
            className="w-full flex items-center justify-center rounded-2xl font-bold transition-all active:scale-[0.98] text-white"
            style={{ height: '56px', fontSize: '16px', backgroundColor: 'var(--color-ucw-dark)', boxShadow: '0 4px 20px rgba(45,26,14,0.25)' }}
        >
            Complete &amp; Pick Up
        </button>
    );
}