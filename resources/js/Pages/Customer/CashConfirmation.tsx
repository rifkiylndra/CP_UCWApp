import { Head, Link, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import TopBar from '@/Components/customer/TopBar';
import BottomNav from '@/Components/customer/BottomNav';

interface Props {
    tableId:      string;
    orderId?:     string;
    orderRef?:    string;
    total?:       number;
    orderTime?:   string;
    tableNumber?: string;
    cartCount?:   number;
}

function formatIDR(n: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR',
        minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(n);
}

function nowTime() {
    return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function CashConfirmation({
    tableId,
    orderId     = 'ORD-8829',
    orderRef    = 'UCW-88291',
    total       = 425000,
    orderTime   = nowTime(),
    tableNumber = '01',
    cartCount   = 0,
}: Props) {
    return (
        <>
            <Head title="Cash Payment — UCW" />
            <CustomerLayout hideTopBar>

                {/* ══════════════════════════════════════════════
                    MOBILE
                ══════════════════════════════════════════════ */}
                <div className="md:hidden flex flex-col flex-1" style={{ backgroundColor: 'var(--color-ucw-bg)' }}>
                    <TopBar tableId={tableId} cartCount={cartCount} />

                    <div className="flex flex-col flex-1 pb-36">
                        <HeroSection total={total} />

                        <div className="px-5 mb-3">
                            <IdentifyCard />
                        </div>
                        <div className="px-5 mb-4">
                            <OrderDetailsCard orderRef={orderRef} orderTime={orderTime} total={total} />
                        </div>

                        <AssistanceNote className="px-5 mb-4 text-center" />

                        <div className="px-5">
                            <div className="rounded-2xl overflow-hidden" style={{ height: '180px' }}>
                                <img
                                    src="/images/Unand_Co-Workspace_Interior.png"
                                    alt="Unand Co-Workspace"
                                    className="w-full h-full object-cover"
                                    style={{ filter: 'brightness(0.85)' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fixed bottom */}
                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40"
                        style={{ backgroundColor: 'var(--color-ucw-bg)' }}
                    >
                        <div className="px-5 pt-3 pb-2">
                            <TrackButton tableId={tableId} orderId={orderId} />
                        </div>
                        <BottomNav tableId={tableId} active="orders" cartCount={cartCount} />
                    </div>
                </div>

                {/* ══════════════════════════════════════════════
                    DESKTOP — two columns
                ══════════════════════════════════════════════ */}
                <div className="hidden md:flex min-h-svh" style={{ backgroundColor: '#E8E1D8' }}>

                    {/* Left: main content */}
                    <main className="flex-1 overflow-y-auto flex flex-col">

                        {/* Top bar */}
                        <div
                            className="sticky top-0 z-30 flex items-center justify-between px-10 py-5"
                            style={{ background: 'var(--color-ucw-bg)', borderBottom: '1px solid var(--color-ucw-border)' }}
                        >
                            <div className="flex items-center gap-2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round">
                                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                                    <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                                </svg>
                                <span className="font-bold text-sm tracking-[0.04em]" style={{ color: 'var(--color-ucw-dark)' }}>UNAND CO-WORKSPACE</span>
                            </div>
                            {/* Nav tabs */}
                            <div className="flex items-center gap-1">
                                {[
                                    { label: 'Menu',   href: route('customer.menu',  { tableId }), active: false },
                                    { label: 'Orders', href: route('customer.status', { tableId, orderId }), active: true },
                                ].map(tab => (
                                    <Link key={tab.label} href={tab.href}
                                        className="px-4 h-8 rounded-full text-sm font-semibold flex items-center"
                                        style={tab.active ? { backgroundColor: 'var(--color-ucw-dark)', color: 'white' } : { color: 'var(--color-ucw-text-muted)' }}
                                    >{tab.label}</Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 max-w-2xl mx-auto w-full px-10 py-10">
                            <HeroSection total={total} desktop />

                            {/* Two cards side by side */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <IdentifyCard />
                                <OrderDetailsCard orderRef={orderRef} orderTime={orderTime} total={total} />
                            </div>

                            <AssistanceNote className="mb-6 text-center" />

                            <div className="rounded-2xl overflow-hidden" style={{ height: '200px' }}>
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
                            <h2 className="font-black text-xl mb-0.5" style={{ color: 'var(--color-ucw-dark)' }}>Cash Payment</h2>
                            <p className="text-xs" style={{ color: 'var(--color-ucw-text-muted)' }}>Please pay at the counter</p>
                        </div>

                        <div className="flex-1 px-8 py-6 flex flex-col gap-5">
                            {/* Status indicator */}
                            <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'var(--color-ucw-amber-bg)', border: '1px solid var(--color-ucw-amber)' }}>
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#92620A' }} />
                                <p className="font-bold uppercase tracking-[0.12em]" style={{ fontSize: '10px', color: '#92620A' }}>
                                    WAITING FOR PAYMENT VERIFICATION
                                </p>
                            </div>

                            {/* Order summary */}
                            <div className="rounded-2xl p-5" style={{ background: 'var(--color-ucw-dark)' }}>
                                <p className="font-semibold uppercase tracking-[0.12em] mb-1" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)' }}>AMOUNT DUE</p>
                                <p className="font-black mb-1" style={{ fontSize: '30px', color: 'white' }}>{formatIDR(total)}</p>
                                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>Order #{orderRef}</p>
                            </div>

                            {/* Steps */}
                            <div className="flex flex-col gap-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--color-ucw-text-muted)' }}>What to do</p>
                                {[
                                    { step: '1', text: 'Go to the main counter' },
                                    { step: '2', text: `Show your Order ID: #${orderRef}` },
                                    { step: '3', text: `Pay ${formatIDR(total)} to the cashier` },
                                ].map(s => (
                                    <div key={s.step} className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs text-white" style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                                            {s.step}
                                        </div>
                                        <p className="text-sm" style={{ color: 'var(--color-ucw-text-muted)' }}>{s.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="px-8 pb-8">
                            <TrackButton tableId={tableId} orderId={orderId} />
                        </div>
                    </aside>
                </div>

            </CustomerLayout>
        </>
    );
}

/* ─── Sub-components ─── */

function HeroSection({ total, desktop = false }: { total: number; desktop?: boolean }) {
    return (
        <div className={`flex flex-col items-center text-center ${desktop ? 'pb-8' : 'px-5 pt-6 pb-6'}`}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: 'var(--color-ucw-green-bg)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-green-text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"/>
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M6 12h.01M18 12h.01" strokeWidth="2.5"/>
                </svg>
            </div>
            <h1 className="font-black leading-[1.1] tracking-tight mb-2" style={{ fontSize: desktop ? '28px' : '26px', color: 'var(--color-ucw-dark)' }}>
                Please proceed to the<br />cashier to pay
            </h1>
            <p className="font-black" style={{ fontSize: '32px', color: 'var(--color-ucw-dark)' }}>
                {formatIDR(total)}
            </p>
            {!desktop && (
                <div className="mt-4 px-4 py-2 rounded-full" style={{ backgroundColor: 'var(--color-ucw-amber-bg)', border: '1px solid var(--color-ucw-amber)' }}>
                    <p className="font-bold uppercase tracking-[0.14em]" style={{ fontSize: '10px', color: '#92620A' }}>
                        WAITING FOR PAYMENT VERIFICATION
                    </p>
                </div>
            )}
        </div>
    );
}

function IdentifyCard() {
    return (
        <div className="rounded-2xl p-5 relative overflow-hidden h-full" style={{ backgroundColor: 'white', border: '1px solid var(--color-ucw-border)' }}>
            <p className="font-semibold uppercase tracking-[0.14em] mb-2" style={{ fontSize: '10px', color: 'var(--color-ucw-text-muted)' }}>STEP 01</p>
            <h3 className="font-black mb-2" style={{ fontSize: '18px', color: 'var(--color-ucw-dark)' }}>Identify Your Order</h3>
            <p className="leading-relaxed" style={{ fontSize: '13px', color: 'var(--color-ucw-text-muted)', maxWidth: '75%' }}>
                Present your Order ID or mobile screen to the barista at the counter.
            </p>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/>
                    <rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/>
                </svg>
            </div>
        </div>
    );
}

function OrderDetailsCard({ orderRef, orderTime, total }: { orderRef: string; orderTime: string; total: number }) {
    return (
        <div className="rounded-2xl p-5" style={{ backgroundColor: 'white', border: '1px solid var(--color-ucw-border)' }}>
            <p className="font-semibold uppercase tracking-[0.14em] mb-4" style={{ fontSize: '10px', color: 'var(--color-ucw-text-muted)' }}>ORDER DETAILS</p>
            <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: '13px', color: 'var(--color-ucw-text-muted)' }}>Order ID</span>
                <span className="font-bold" style={{ fontSize: '14px', color: 'var(--color-ucw-dark)' }}>#{orderRef}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
                <span style={{ fontSize: '13px', color: 'var(--color-ucw-text-muted)' }}>Time</span>
                <span className="font-semibold" style={{ fontSize: '14px', color: 'var(--color-ucw-text)' }}>{orderTime}</span>
            </div>
            <div style={{ height: '1px', backgroundColor: 'var(--color-ucw-border)', marginBottom: '16px' }} />
            <div className="flex items-center justify-between">
                <span className="font-bold" style={{ fontSize: '15px', color: 'var(--color-ucw-text)' }}>Total Amount</span>
                <span className="font-black" style={{ fontSize: '17px', color: 'var(--color-ucw-dark)' }}>{formatIDR(total)}</span>
            </div>
        </div>
    );
}

function AssistanceNote({ className = '' }: { className?: string }) {
    return (
        <div className={className}>
            <p className="font-semibold mb-1" style={{ fontSize: '13px', color: 'var(--color-ucw-text)' }}>Need assistance?</p>
            <p style={{ fontSize: '12px', color: 'var(--color-ucw-text-muted)', lineHeight: '1.6' }}>
                Our staff is ready to help you at the main counter.<br />
                Average verification time: ~2 mins
            </p>
        </div>
    );
}

function TrackButton({ tableId, orderId }: { tableId: string; orderId: string }) {
    return (
        <button
            onClick={() => router.visit(route('customer.status', { tableId, orderId }))}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl font-bold transition-all active:scale-[0.98] text-white"
            style={{ height: '50px', fontSize: '14px', backgroundColor: 'var(--color-ucw-dark)', boxShadow: '0 4px 16px rgba(45,26,14,0.2)' }}
        >
            Track My Order
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        </button>
    );
}