import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import TopBar from '@/Components/customer/TopBar';
import type { OrderType } from '@/types/customer';

interface Props {
    tableId:      string;
    tableNumber?: string;
    cartCount?:   number;
}

export default function OrderTypePage({ tableId, tableNumber = '01', cartCount = 0 }: Props) {
    const [selected, setSelected]   = useState<OrderType | null>(null);
    const [name, setName]           = useState('');
    const [nameError, setNameError] = useState('');

    function handleConfirm() {
        if (!selected) return;
        if (selected === 'takeaway' && !name.trim()) {
            setNameError('Please enter your name.');
            return;
        }
        setNameError('');
        router.visit(route('customer.estimate', { tableId }));
    }

    return (
        <>
            <Head title="Order Details — UCW" />
            <CustomerLayout hideTopBar>

                {/* ══════════════════════════════════════════════
                    MOBILE layout
                ══════════════════════════════════════════════ */}
                <div className="md:hidden flex flex-col flex-1" style={{ backgroundColor: 'var(--color-ucw-bg)' }}>
                    <TopBar tableId={tableId} cartCount={cartCount} />

                    <div className="flex flex-col flex-1 px-5 pb-36">
                        <PageHeading />

                        <div className="flex flex-col gap-3">
                            <DineInCard
                                selected={selected === 'dine-in'}
                                tableNumber={tableNumber}
                                onSelect={() => setSelected('dine-in')}
                            />
                            <TakeawayCard
                                selected={selected === 'takeaway'}
                                name={name}
                                nameError={nameError}
                                onSelect={() => { setSelected('takeaway'); setNameError(''); }}
                                onNameChange={v => { setName(v); setNameError(''); }}
                            />
                        </div>

                        <InteriorPhoto className="mt-5" />
                    </div>

                    {/* Fixed bottom CTA */}
                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                        style={{ background: 'linear-gradient(to top, var(--color-ucw-bg) 65%, transparent)' }}
                    >
                        <ConfirmButton selected={selected} onConfirm={handleConfirm} />
                    </div>
                </div>

                {/* ══════════════════════════════════════════════
                    DESKTOP layout — two columns
                ══════════════════════════════════════════════ */}
                <div className="hidden md:flex min-h-svh" style={{ backgroundColor: '#E8E1D8' }}>

                    {/* ── Left: main content ── */}
                    <main className="flex-1 overflow-y-auto flex flex-col">

                        {/* Desktop top bar */}
                        <div
                            className="sticky top-0 z-30 flex items-center justify-between px-10 py-5"
                            style={{ background: 'var(--color-ucw-bg)', borderBottom: '1px solid var(--color-ucw-border)' }}
                        >
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route('customer.cart', { tableId })}
                                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                                    style={{ backgroundColor: 'var(--color-ucw-border)' }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                </Link>
                                <div className="flex items-center gap-2">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                                        <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
                                    </svg>
                                    <span className="font-bold text-sm tracking-[0.04em]" style={{ color: 'var(--color-ucw-dark)' }}>UNAND CO-WORKSPACE</span>
                                </div>
                            </div>

                            {/* Step indicator */}
                            <div className="flex items-center gap-2">
                                {['Cart', 'Order Details', 'Confirm'].map((step, i) => (
                                    <div key={step} className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <div
                                                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                                                style={{
                                                    backgroundColor: i === 1 ? 'var(--color-ucw-dark)' : 'var(--color-ucw-border)',
                                                    color:           i === 1 ? 'white' : 'var(--color-ucw-text-muted)',
                                                }}
                                            >{i + 1}</div>
                                            <span className="text-xs font-medium" style={{ color: i === 1 ? 'var(--color-ucw-dark)' : 'var(--color-ucw-text-muted)' }}>
                                                {step}
                                            </span>
                                        </div>
                                        {i < 2 && <div className="w-6 h-px" style={{ backgroundColor: 'var(--color-ucw-border)' }} />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Content area — two cards side by side */}
                        <div className="flex-1 max-w-3xl mx-auto w-full px-10 py-10">
                            <PageHeading desktop />

                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <DineInCard
                                    selected={selected === 'dine-in'}
                                    tableNumber={tableNumber}
                                    onSelect={() => setSelected('dine-in')}
                                    desktop
                                />
                                <TakeawayCard
                                    selected={selected === 'takeaway'}
                                    name={name}
                                    nameError={nameError}
                                    onSelect={() => { setSelected('takeaway'); setNameError(''); }}
                                    onNameChange={v => { setName(v); setNameError(''); }}
                                    desktop
                                />
                            </div>

                            <InteriorPhoto className="mt-6" tall />
                        </div>
                    </main>

                    {/* ── Right: summary panel ── */}
                    <aside
                        className="w-[320px] shrink-0 sticky top-0 h-svh overflow-y-auto flex flex-col"
                        style={{ background: 'var(--color-ucw-bg)', borderLeft: '1px solid var(--color-ucw-border)' }}
                    >
                        <div className="px-8 pt-8 pb-5" style={{ borderBottom: '1px solid var(--color-ucw-border)' }}>
                            <h2 className="font-black text-xl mb-0.5" style={{ color: 'var(--color-ucw-dark)' }}>Order Details</h2>
                            <p className="text-xs" style={{ color: 'var(--color-ucw-text-muted)' }}>Step 2 of 3 — Choose how you'll receive your order</p>
                        </div>

                        <div className="flex-1 px-8 py-6 flex flex-col gap-5">
                            {/* Selection status */}
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--color-ucw-text-muted)' }}>Your choice</p>
                                {selected ? (
                                    <div
                                        className="flex items-center gap-3 p-4 rounded-2xl"
                                        style={{ background: 'var(--color-ucw-bg-warm)', border: '1px solid var(--color-ucw-border)' }}
                                    >
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                                            {selected === 'dine-in' ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="3" width="18" height="10" rx="2" /><path d="M8 13v8M16 13v8M5 21h14" />
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm" style={{ color: 'var(--color-ucw-dark)' }}>
                                                {selected === 'dine-in' ? 'Dine-in' : 'Takeaway'}
                                            </p>
                                            <p className="text-xs mt-0.5" style={{ color: 'var(--color-ucw-text-muted)' }}>
                                                {selected === 'dine-in' ? `Table ${tableNumber}` : name ? `Name: ${name}` : 'Enter your name'}
                                            </p>
                                        </div>
                                        <span className="ml-auto text-[9px] font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                                            SELECTED
                                        </span>
                                    </div>
                                ) : (
                                    <div
                                        className="flex items-center gap-3 p-4 rounded-2xl"
                                        style={{ background: 'var(--color-ucw-border)', border: '1px dashed var(--color-ucw-border-dark)' }}
                                    >
                                        <p className="text-sm" style={{ color: 'var(--color-ucw-text-muted)' }}>No option selected yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Info tips */}
                            <div className="flex flex-col gap-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--color-ucw-text-muted)' }}>What to expect</p>
                                {[
                                    { icon: '⏱', text: 'Estimated wait: 5–10 minutes' },
                                    { icon: '📍', text: 'Order delivered to your table' },
                                    { icon: '🔔', text: "We'll notify you when it's ready" },
                                ].map(tip => (
                                    <div key={tip.text} className="flex items-center gap-3">
                                        <span className="text-base">{tip.icon}</span>
                                        <span className="text-xs" style={{ color: 'var(--color-ucw-text-muted)' }}>{tip.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="px-8 pb-8">
                            <ConfirmButton selected={selected} onConfirm={handleConfirm} />
                            <Link
                                href={route('customer.cart', { tableId })}
                                className="w-full flex items-center justify-center mt-3 h-10 text-sm font-medium"
                                style={{ color: 'var(--color-ucw-text-muted)' }}
                            >
                                ← Back to cart
                            </Link>
                        </div>
                    </aside>
                </div>

            </CustomerLayout>
        </>
    );
}

/* ─── Shared sub-components ─── */

function PageHeading({ desktop = false }: { desktop?: boolean }) {
    return (
        <div className={desktop ? 'mb-2' : 'pt-4 pb-6'}>
            <p className="font-semibold uppercase tracking-[0.15em] mb-2" style={{ fontSize: '10px', color: 'var(--color-ucw-text-muted)' }}>
                ORDER DETAILS
            </p>
            <h1
                className="font-black leading-[1.1] tracking-tight"
                style={{ fontSize: desktop ? '32px' : '30px', color: 'var(--color-ucw-dark)' }}
            >
                How would you like<br />to enjoy your coffee?
            </h1>
        </div>
    );
}

function DineInCard({
    selected, tableNumber, onSelect, desktop = false,
}: {
    selected:    boolean;
    tableNumber: string;
    onSelect:    () => void;
    desktop?:    boolean;
}) {
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
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-ucw-bg-warm)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="10" rx="2" /><path d="M8 13v8M16 13v8M5 21h14" />
                    </svg>
                </div>
                {selected && <SelectedPill />}
            </div>

            <h3 className="font-black mb-1" style={{ fontSize: '19px', color: selected ? 'var(--color-ucw-dark)' : 'var(--color-ucw-text)' }}>
                Dine-in
            </h3>
            <p className="leading-relaxed mb-4" style={{ fontSize: '13px', color: 'var(--color-ucw-text-muted)' }}>
                Enjoy your drink in our curated creative space.
            </p>

            <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--color-ucw-bg-warm)' }}>
                <span className="font-semibold uppercase tracking-[0.12em]" style={{ fontSize: '10px', color: 'var(--color-ucw-text-muted)' }}>YOUR SPOT</span>
                <span className="font-black" style={{ fontSize: '15px', color: 'var(--color-ucw-dark)' }}>Table {tableNumber}</span>
            </div>
        </button>
    );
}

function TakeawayCard({
    selected, name, nameError, onSelect, onNameChange, desktop = false,
}: {
    selected:      boolean;
    name:          string;
    nameError:     string;
    onSelect:      () => void;
    onNameChange:  (v: string) => void;
    desktop?:      boolean;
}) {
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
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-ucw-bg-warm)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                </div>
                {selected && <SelectedPill />}
            </div>

            <h3 className="font-black mb-1" style={{ fontSize: '19px', color: selected ? 'var(--color-ucw-dark)' : 'var(--color-ucw-text)' }}>
                Takeaway
            </h3>
            <p className="leading-relaxed mb-4" style={{ fontSize: '13px', color: 'var(--color-ucw-text-muted)' }}>
                Perfect for those on the move or working remotely.
            </p>

            {selected && (
                <div onClick={e => e.stopPropagation()} className="flex flex-col gap-1.5">
                    <label className="font-semibold uppercase tracking-[0.12em]" style={{ fontSize: '10px', color: 'var(--color-ucw-text-muted)' }}>
                        YOUR NAME
                    </label>
                    <input
                        type="text"
                        placeholder="Enter name for order"
                        value={name}
                        onChange={e => onNameChange(e.target.value)}
                        autoFocus
                        className="w-full h-12 px-4 rounded-xl outline-none transition-colors"
                        style={{
                            fontSize:        '14px',
                            backgroundColor: 'var(--color-ucw-bg-warm)',
                            border:          `1.5px solid ${nameError ? 'var(--color-ucw-red)' : 'var(--color-ucw-border)'}`,
                            color:           'var(--color-ucw-text)',
                        }}
                    />
                    {nameError && (
                        <p style={{ fontSize: '11px', color: 'var(--color-ucw-red)' }}>{nameError}</p>
                    )}
                </div>
            )}
        </button>
    );
}

function SelectedPill() {
    return (
        <span
            className="px-3 py-1 rounded-full font-bold tracking-wider text-white"
            style={{ fontSize: '9px', backgroundColor: 'var(--color-ucw-dark)' }}
        >
            SELECTED
        </span>
    );
}

function InteriorPhoto({ className = '', tall = false }: { className?: string; tall?: boolean }) {
    return (
        <div className={`rounded-3xl overflow-hidden ${className}`} style={{ height: tall ? '200px' : '160px' }}>
            <img
                src="/images/Unand_Co-Workspace_Interior.png"
                alt="Unand Co-Workspace Interior"
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(30%)' }}
            />
        </div>
    );
}

function ConfirmButton({ selected, onConfirm }: { selected: OrderType | null; onConfirm: () => void }) {
    return (
        <button
            onClick={onConfirm}
            disabled={!selected}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl font-bold transition-all active:scale-[0.98]"
            style={{
                height:          '54px',
                fontSize:        '15px',
                backgroundColor: selected ? 'var(--color-ucw-dark)' : 'var(--color-ucw-border)',
                color:           selected ? 'white' : 'var(--color-ucw-text-muted)',
                boxShadow:       selected ? '0 4px 20px rgba(45,26,14,0.25)' : 'none',
                cursor:          selected ? 'pointer' : 'not-allowed',
            }}
        >
            Confirm Details
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </button>
    );
}