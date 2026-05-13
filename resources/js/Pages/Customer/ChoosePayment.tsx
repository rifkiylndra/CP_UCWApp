import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import TopBar from '@/Components/customer/TopBar';

interface Props {
    tableId:    string;
    cartCount?: number;
    total?:     number;
}

type PaymentGroup = 'online' | 'cash' | null;

function formatIDR(n: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR',
        minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(n);
}

export default function ChoosePayment({ tableId, cartCount = 0, total = 145000 }: Props) {
    const [selected, setSelected] = useState<PaymentGroup>(null);

    function handleConfirm() {
        if (!selected) return;
        if (selected === 'online') router.visit(route('customer.payment.online', { tableId }));
        else                       router.visit(route('customer.payment.cash',   { tableId }));
    }

    return (
        <>
            <Head title="Choose Payment — UCW" />
            <CustomerLayout hideTopBar>

                {/* ══════════════════════════════════════════════
                    MOBILE
                ══════════════════════════════════════════════ */}
                <div className="md:hidden flex flex-col flex-1" style={{ backgroundColor: 'var(--color-ucw-bg)' }}>
                    <TopBar tableId={tableId} cartCount={cartCount} />

                    <div className="flex flex-col flex-1 px-5 pb-36">
                        <PageHeading />

                        <div className="flex flex-col gap-3 mb-6">
                            <OnlineCard selected={selected === 'online'} onSelect={() => setSelected('online')} />
                            <CashCard   selected={selected === 'cash'}   onSelect={() => setSelected('cash')}   />
                        </div>

                        <TotalCard total={total} />
                        <TrustBlurb className="mt-4" />
                    </div>

                    {/* Fixed bottom */}
                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50"
                        style={{ backgroundColor: 'var(--color-ucw-bg)' }}
                    >
                        {selected && (
                            <div className="px-5 pt-4 pb-2">
                                <ConfirmBtn selected={selected} onConfirm={handleConfirm} />
                            </div>
                        )}
                        <div className="flex items-center justify-center gap-2 py-4 border-t" style={{ borderColor: 'var(--color-ucw-border)' }}>
                            <Link
                                href={route('customer.estimate', { tableId })}
                                className="flex items-center gap-1.5 transition-opacity active:opacity-60"
                                style={{ fontSize: '11px', color: 'var(--color-ucw-text-muted)' }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
                                <span className="font-semibold uppercase tracking-[0.1em]">REVIEW ORDER</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════
                    DESKTOP — two columns
                ══════════════════════════════════════════════ */}
                <div className="hidden md:flex min-h-svh" style={{ backgroundColor: '#E8E1D8' }}>

                    {/* Left */}
                    <main className="flex-1 overflow-y-auto flex flex-col">
                        <DesktopTopBar tableId={tableId} activeStep={2} />

                        <div className="flex-1 max-w-2xl mx-auto w-full px-10 py-10">
                            <PageHeading desktop />

                            {/* Cards — 2 col grid */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <OnlineCard selected={selected === 'online'} onSelect={() => setSelected('online')} desktop />
                                <CashCard   selected={selected === 'cash'}   onSelect={() => setSelected('cash')}   desktop />
                            </div>

                            <TrustBlurb />
                        </div>
                    </main>

                    {/* Right summary */}
                    <aside
                        className="w-[320px] shrink-0 sticky top-0 h-svh overflow-y-auto flex flex-col"
                        style={{ background: 'var(--color-ucw-bg)', borderLeft: '1px solid var(--color-ucw-border)' }}
                    >
                        <div className="px-8 pt-8 pb-5" style={{ borderBottom: '1px solid var(--color-ucw-border)' }}>
                            <h2 className="font-black text-xl mb-0.5" style={{ color: 'var(--color-ucw-dark)' }}>Payment</h2>
                            <p className="text-xs" style={{ color: 'var(--color-ucw-text-muted)' }}>Step 3 of 3 — Choose how to pay</p>
                        </div>

                        <div className="flex-1 px-8 py-6 flex flex-col gap-5">
                            {/* Selection status */}
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--color-ucw-text-muted)' }}>Payment method</p>
                                {selected ? (
                                    <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'var(--color-ucw-bg-warm)', border: '1px solid var(--color-ucw-border)' }}>
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                                            {selected === 'online' ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 12h.01" strokeWidth="2.5"/><path d="M2 10h20"/></svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01" strokeWidth="2.5"/></svg>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm" style={{ color: 'var(--color-ucw-dark)' }}>
                                                {selected === 'online' ? 'Online Payment' : 'Cash at Cashier'}
                                            </p>
                                            <p className="text-xs mt-0.5" style={{ color: 'var(--color-ucw-text-muted)' }}>
                                                {selected === 'online' ? 'QRIS / E-Wallet / Transfer' : 'Pay on-site'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-2xl" style={{ background: 'var(--color-ucw-border)', border: '1px dashed var(--color-ucw-border-dark)' }}>
                                        <p className="text-sm" style={{ color: 'var(--color-ucw-text-muted)' }}>No method selected yet</p>
                                    </div>
                                )}
                            </div>

                            <TotalCard total={total} compact />
                        </div>

                        <div className="px-8 pb-8 flex flex-col gap-3">
                            <ConfirmBtn selected={selected} onConfirm={handleConfirm} />
                            <Link
                                href={route('customer.estimate', { tableId })}
                                className="w-full flex items-center justify-center h-10 text-sm font-medium"
                                style={{ color: 'var(--color-ucw-text-muted)' }}
                            >
                                ← Review Order
                            </Link>
                        </div>
                    </aside>
                </div>

            </CustomerLayout>
        </>
    );
}

/* ─── Sub-components ─── */

function PageHeading({ desktop = false }: { desktop?: boolean }) {
    return (
        <div className={desktop ? 'mb-6' : 'pt-2 pb-6'}>
            <p className="font-semibold uppercase tracking-[0.15em] mb-2" style={{ fontSize: '10px', color: 'var(--color-ucw-text-muted)' }}>
                CHECKOUT JOURNEY
            </p>
            <h1 className="font-black leading-[1.08] tracking-tight mb-3" style={{ fontSize: desktop ? '34px' : '32px', color: 'var(--color-ucw-dark)' }}>
                Choose how you'd<br />like to pay.
            </h1>
            <p className="leading-relaxed" style={{ fontSize: '13.5px', color: 'var(--color-ucw-text-muted)' }}>
                Select a payment method to finalize your booking at the workspace.
            </p>
        </div>
    );
}

function OnlineCard({ selected, onSelect, desktop = false }: { selected: boolean; onSelect: () => void; desktop?: boolean }) {
    return (
        <button
            onClick={onSelect}
            className="w-full rounded-3xl p-5 text-left transition-all duration-200"
            style={{
                backgroundColor: 'white',
                border:    `1.5px solid ${selected ? 'var(--color-ucw-dark)' : 'var(--color-ucw-border)'}`,
                boxShadow: selected ? '0 4px 20px rgba(45,26,14,0.10)' : 'none',
            }}
        >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: selected ? 'var(--color-ucw-dark)' : 'var(--color-ucw-bg-warm)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={selected ? 'white' : 'var(--color-ucw-dark)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 12h.01" strokeWidth="2.5"/><path d="M2 10h20"/>
                </svg>
            </div>
            <h3 className="font-black mb-1" style={{ fontSize: '20px', color: 'var(--color-ucw-dark)' }}>Online Payment</h3>
            <p className="mb-4" style={{ fontSize: '13px', color: 'var(--color-ucw-text-muted)' }}>E-Wallet / Bank Transfer / QRIS</p>

            <div className="flex items-center gap-2 mb-5">
                {[
                    <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/></>,
                    <><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
                    <><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></>,
                ].map((paths, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-ucw-bg-warm)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round">{paths}</svg>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-1.5">
                <span className="font-bold uppercase tracking-[0.1em]" style={{ fontSize: '11px', color: selected ? 'var(--color-ucw-dark)' : 'var(--color-ucw-text-muted)' }}>PROCEED TO SECURE GATE</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={selected ? 'var(--color-ucw-dark)' : 'var(--color-ucw-text-muted)'} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
        </button>
    );
}

function CashCard({ selected, onSelect, desktop = false }: { selected: boolean; onSelect: () => void; desktop?: boolean }) {
    return (
        <button
            onClick={onSelect}
            className="w-full rounded-3xl p-5 text-left transition-all duration-200"
            style={{
                backgroundColor: 'white',
                border:    `1.5px solid ${selected ? 'var(--color-ucw-dark)' : 'var(--color-ucw-border)'}`,
                boxShadow: selected ? '0 4px 20px rgba(45,26,14,0.10)' : 'none',
            }}
        >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: selected ? 'var(--color-ucw-dark)' : 'var(--color-ucw-bg-warm)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={selected ? 'white' : 'var(--color-ucw-dark)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01" strokeWidth="2.5"/>
                </svg>
            </div>
            <h3 className="font-black mb-1" style={{ fontSize: '20px', color: 'var(--color-ucw-dark)' }}>Cash at Cashier</h3>
            <p className="mb-4" style={{ fontSize: '13px', color: 'var(--color-ucw-text-muted)' }}>Pay directly at the front desk upon arrival.</p>

            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-ucw-bg-warm)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
            </div>

            <div className="flex items-center gap-1.5">
                <span className="font-bold uppercase tracking-[0.1em]" style={{ fontSize: '11px', color: selected ? 'var(--color-ucw-dark)' : 'var(--color-ucw-text-muted)' }}>PAY ON-SITE</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={selected ? 'var(--color-ucw-dark)' : 'var(--color-ucw-text-muted)'} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
        </button>
    );
}

function TotalCard({ total, compact = false }: { total: number; compact?: boolean }) {
    return (
        <div className="rounded-2xl p-5" style={{ backgroundColor: 'white', border: '1px solid var(--color-ucw-border)' }}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-semibold uppercase tracking-[0.12em] mb-1" style={{ fontSize: '10px', color: 'var(--color-ucw-text-muted)' }}>ESTIMATED TOTAL</p>
                    <p className="font-black leading-tight" style={{ fontSize: compact ? '22px' : '28px', color: 'var(--color-ucw-dark)' }}>{formatIDR(total)}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold" style={{ fontSize: '13px', color: 'var(--color-ucw-text)' }}>Coffee & Desk<br />Access</p>
                    <p style={{ fontSize: '11px', color: 'var(--color-ucw-text-muted)' }}>Incl. Tax (11%)</p>
                </div>
            </div>
        </div>
    );
}

function TrustBlurb({ className = '' }: { className?: string }) {
    return (
        <div className={`flex gap-3 items-start px-1 ${className}`}>
            <svg className="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-text-muted)" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <p className="leading-relaxed" style={{ fontSize: '12px', color: 'var(--color-ucw-text-muted)' }}>
                Your transaction is protected. By selecting a payment method, you agree to our terms of service and the workspace's house rules regarding booking cancellations.
            </p>
        </div>
    );
}

function ConfirmBtn({ selected, onConfirm }: { selected: PaymentGroup; onConfirm: () => void }) {
    return (
        <button
            onClick={onConfirm}
            disabled={!selected}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl font-bold transition-all active:scale-[0.98] text-white"
            style={{
                height:          '54px',
                fontSize:        '15px',
                backgroundColor: selected ? 'var(--color-ucw-dark)' : 'var(--color-ucw-border)',
                color:           selected ? 'white' : 'var(--color-ucw-text-muted)',
                boxShadow:       selected ? '0 4px 20px rgba(45,26,14,0.25)' : 'none',
                cursor:          selected ? 'pointer' : 'not-allowed',
            }}
        >
            {selected === 'online' ? 'Proceed to Secure Gate' : selected === 'cash' ? 'Pay On-Site' : 'Select a Method'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
    );
}

function DesktopTopBar({ tableId, activeStep }: { tableId: string; activeStep: number }) {
    const steps = ['Cart', 'Order Details', 'Payment'];
    return (
        <div className="sticky top-0 z-30 flex items-center justify-between px-10 py-5" style={{ background: 'var(--color-ucw-bg)', borderBottom: '1px solid var(--color-ucw-border)' }}>
            <div className="flex items-center gap-3">
                <Link href={route('customer.estimate', { tableId })} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-ucw-border)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                </Link>
                <div className="flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                        <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                    </svg>
                    <span className="font-bold text-sm tracking-[0.04em]" style={{ color: 'var(--color-ucw-dark)' }}>UNAND CO-WORKSPACE</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {steps.map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                                style={{ backgroundColor: i < activeStep ? 'var(--color-ucw-dark)' : i === activeStep ? 'var(--color-ucw-dark)' : 'var(--color-ucw-border)', color: i <= activeStep ? 'white' : 'var(--color-ucw-text-muted)' }}>
                                {i < activeStep ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> : i + 1}
                            </div>
                            <span className="text-xs font-medium" style={{ color: i === activeStep ? 'var(--color-ucw-dark)' : 'var(--color-ucw-text-muted)' }}>{step}</span>
                        </div>
                        {i < steps.length - 1 && <div className="w-6 h-px" style={{ backgroundColor: i < activeStep ? 'var(--color-ucw-dark)' : 'var(--color-ucw-border)' }} />}
                    </div>
                ))}
            </div>
        </div>
    );
}