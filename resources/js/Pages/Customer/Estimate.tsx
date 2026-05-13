import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import TopBar from '@/Components/customer/TopBar';

interface OrderItem {
    id:       string;
    name:     string;
    subtitle: string;
    price:    number;
    quantity: number;
    imageUrl: string;
}

interface Props {
    tableId:          string;
    cartCount?:       number;
    estimatedMinMin?: number;
    estimatedMinMax?: number;
    items?:           OrderItem[];
}

const PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23E8E2DB'/%3E%3C/svg%3E";

const DEMO_ITEMS: OrderItem[] = [
    { id: '1', name: 'Signature Oat Latte',  subtitle: '12OZ • EXTRA HOT • OAT MILK',       price: 65000, quantity: 1, imageUrl: '' },
    { id: '2', name: 'Double Espresso',       subtitle: 'DOUBLE SHOT • ETHIOPIAN ROAST',     price: 40000, quantity: 1, imageUrl: '' },
];

function formatIDR(n: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR',
        minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(n);
}

export default function Estimate({
    tableId,
    cartCount       = 0,
    estimatedMinMin = 10,
    estimatedMinMax = 15,
    items           = DEMO_ITEMS,
}: Props) {
    const subtotal   = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const serviceFee = Math.round(subtotal * 0.08);
    const total      = subtotal + serviceFee;

    return (
        <>
            <Head title="Order Confirmation — UCW" />
            <CustomerLayout hideTopBar>

                {/* ══════════════════════════════════════════════
                    MOBILE layout
                ══════════════════════════════════════════════ */}
                <div className="md:hidden flex flex-col flex-1" style={{ backgroundColor: 'var(--color-ucw-bg)' }}>
                    <TopBar tableId={tableId} cartCount={cartCount} />

                    <div className="flex flex-col flex-1 px-5 pb-36">
                        <PageHeading />
                        <EstimationCard minMin={estimatedMinMin} minMax={estimatedMinMax} />
                        <SelectionList items={items} tableId={tableId} className="mb-1" />
                        <PriceSummary subtotal={subtotal} serviceFee={serviceFee} total={total} className="mt-6" />
                    </div>

                    {/* Fixed bottom CTA */}
                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                        style={{ background: 'linear-gradient(to top, var(--color-ucw-bg) 65%, transparent)' }}
                    >
                        <PaymentButton tableId={tableId} />
                        <TrustNote />
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
                                    href={route('customer.order-type', { tableId })}
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
                                {['Cart', 'Order Details', 'Confirmation'].map((step, i) => (
                                    <div key={step} className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <div
                                                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                                                style={{
                                                    backgroundColor: i < 2 ? 'var(--color-ucw-dark)' : 'var(--color-ucw-border)',
                                                    color:           i < 2 ? 'white' : 'var(--color-ucw-text-muted)',
                                                }}
                                            >
                                                {i < 2 ? (
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                ) : i + 1}
                                            </div>
                                            <span className="text-xs font-medium" style={{ color: i === 2 ? 'var(--color-ucw-dark)' : 'var(--color-ucw-text-muted)' }}>
                                                {step}
                                            </span>
                                        </div>
                                        {i < 2 && <div className="w-6 h-px" style={{ backgroundColor: 'var(--color-ucw-dark)' }} />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main content */}
                        <div className="flex-1 max-w-2xl mx-auto w-full px-10 py-10">
                            <PageHeading desktop />

                            {/* Estimation card — full width on left */}
                            <EstimationCard minMin={estimatedMinMin} minMax={estimatedMinMax} desktop />

                            {/* Selection list */}
                            <SelectionList items={items} tableId={tableId} className="mt-6" desktop />
                        </div>
                    </main>

                    {/* ── Right: order summary panel ── */}
                    <aside
                        className="w-[320px] shrink-0 sticky top-0 h-svh overflow-y-auto flex flex-col"
                        style={{ background: 'var(--color-ucw-bg)', borderLeft: '1px solid var(--color-ucw-border)' }}
                    >
                        <div className="px-8 pt-8 pb-5" style={{ borderBottom: '1px solid var(--color-ucw-border)' }}>
                            <h2 className="font-black text-xl mb-0.5" style={{ color: 'var(--color-ucw-dark)' }}>Order Summary</h2>
                            <p className="text-xs" style={{ color: 'var(--color-ucw-text-muted)' }}>
                                {items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''} · Ready in {estimatedMinMin}–{estimatedMinMax} min
                            </p>
                        </div>

                        {/* Mini item list */}
                        <div className="flex-1 overflow-y-auto px-8 py-5 flex flex-col gap-4">
                            {items.map(item => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div
                                        className="w-11 h-11 rounded-xl overflow-hidden shrink-0"
                                        style={{ backgroundColor: 'var(--color-ucw-border)' }}
                                    >
                                        <img
                                            src={item.imageUrl || PLACEHOLDER} alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm leading-tight truncate" style={{ color: 'var(--color-ucw-dark)' }}>{item.name}</p>
                                        <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--color-ucw-text-muted)' }}>
                                            {item.subtitle}
                                        </p>
                                    </div>
                                    <span className="font-bold text-sm shrink-0" style={{ color: 'var(--color-ucw-dark)' }}>
                                        {formatIDR(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Price + CTA */}
                        <div className="px-8 pb-8" style={{ borderTop: '1px solid var(--color-ucw-border)', paddingTop: '20px' }}>
                            <PriceSummary subtotal={subtotal} serviceFee={serviceFee} total={total} compact />
                            <div className="mt-6">
                                <PaymentButton tableId={tableId} />
                                <TrustNote />
                            </div>
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
        <div className={desktop ? 'mb-6' : 'pt-2 pb-5'}>
            <p className="font-semibold uppercase tracking-[0.15em] mb-2" style={{ fontSize: '10px', color: 'var(--color-ucw-text-muted)' }}>
                ORDER CONFIRMATION
            </p>
            <h1
                className="font-black leading-[1.1] tracking-tight"
                style={{ fontSize: desktop ? '36px' : '32px', color: 'var(--color-ucw-dark)' }}
            >
                Review your<br />morning ritual.
            </h1>
        </div>
    );
}

function EstimationCard({
    minMin, minMax, desktop = false,
}: {
    minMin:   number;
    minMax:   number;
    desktop?: boolean;
}) {
    return (
        <div
            className={`rounded-3xl p-5 ${desktop ? '' : 'mb-5'}`}
            style={{ backgroundColor: 'var(--color-ucw-dark)' }}
        >
            {/* Badge */}
            <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>
                <span className="font-semibold uppercase tracking-[0.14em]" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>
                    LIVE AI ESTIMATION
                </span>
            </div>

            {/* Time display */}
            <p className="mb-1" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
                AI Estimated Serve Time:
            </p>
            <div className="flex items-baseline gap-2 mb-4">
                <span className="font-black leading-none" style={{ fontSize: desktop ? '60px' : '52px', color: 'white' }}>
                    {minMin}–{minMax}
                </span>
                <span className="font-semibold" style={{ fontSize: '20px', color: 'rgba(255,255,255,0.55)' }}>
                    minutes
                </span>
            </div>

            {/* Info box */}
            <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex gap-2.5">
                    <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="leading-relaxed" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
                        Calculated based on current kitchen queue and your specific
                        beverage complexity. Our baristas are currently at peak efficiency.
                    </p>
                </div>
            </div>
        </div>
    );
}

function SelectionList({
    items, tableId, className = '', desktop = false,
}: {
    items:     OrderItem[];
    tableId:   string;
    className?: string;
    desktop?:  boolean;
}) {
    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold" style={{ fontSize: '16px', color: 'var(--color-ucw-dark)' }}>
                    Your Selection
                </h2>
                <Link
                    href={route('customer.cart', { tableId })}
                    className="font-semibold transition-opacity active:opacity-60"
                    style={{ fontSize: '13px', color: 'var(--color-ucw-text-muted)' }}
                >
                    Edit Basket
                </Link>
            </div>

            <div className="flex flex-col gap-4">
                {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                        <div
                            className="w-14 h-14 rounded-xl overflow-hidden shrink-0"
                            style={{ backgroundColor: 'var(--color-ucw-border)' }}
                        >
                            <img
                                src={item.imageUrl || PLACEHOLDER} alt={item.name}
                                className="w-full h-full object-cover"
                                onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-bold leading-tight" style={{ fontSize: '14px', color: 'var(--color-ucw-text)' }}>
                                    {item.name}
                                </h3>
                                <span className="font-bold shrink-0" style={{ fontSize: '14px', color: 'var(--color-ucw-dark)' }}>
                                    {formatIDR(item.price * item.quantity)}
                                </span>
                            </div>
                            <p className="mt-0.5 uppercase tracking-wider" style={{ fontSize: '10px', color: 'var(--color-ucw-text-muted)' }}>
                                {item.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PriceSummary({
    subtotal, serviceFee, total, className = '', compact = false,
}: {
    subtotal:   number;
    serviceFee: number;
    total:      number;
    className?: string;
    compact?:   boolean;
}) {
    return (
        <div className={className} style={compact ? {} : { borderTop: '1px solid var(--color-ucw-border)', paddingTop: '20px' }}>
            {compact && <div style={{ height: '1px', backgroundColor: 'var(--color-ucw-border)', marginBottom: '16px' }} />}

            <div className="flex items-center justify-between mb-3">
                <span className="font-semibold uppercase tracking-[0.12em]" style={{ fontSize: '11px', color: 'var(--color-ucw-text-muted)' }}>SUBTOTAL</span>
                <span className="font-semibold" style={{ fontSize: '14px', color: 'var(--color-ucw-text)' }}>{formatIDR(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between mb-5">
                <span className="font-semibold uppercase tracking-[0.12em]" style={{ fontSize: '11px', color: 'var(--color-ucw-text-muted)' }}>SERVICE FEE</span>
                <span className="font-semibold" style={{ fontSize: '14px', color: 'var(--color-ucw-text)' }}>{formatIDR(serviceFee)}</span>
            </div>
            <div className="flex items-center justify-between" style={compact ? {} : {}}>
                <span className="font-black" style={{ fontSize: compact ? '15px' : '18px', color: 'var(--color-ucw-text)' }}>Total</span>
                <span className="font-black" style={{ fontSize: compact ? '18px' : '24px', color: 'var(--color-ucw-dark)' }}>{formatIDR(total)}</span>
            </div>
        </div>
    );
}

function PaymentButton({ tableId }: { tableId: string }) {
    return (
        <Link
            href={route('customer.payment', { tableId })}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl font-bold transition-all active:scale-[0.98] text-white"
            style={{
                height:          '54px',
                fontSize:        '15px',
                backgroundColor: 'var(--color-ucw-dark)',
                boxShadow:       '0 4px 20px rgba(45,26,14,0.25)',
            }}
        >
            Continue to Payment
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </Link>
    );
}

function TrustNote() {
    return (
        <p className="text-center mt-2.5 uppercase tracking-[0.14em]" style={{ fontSize: '9px', color: 'var(--color-ucw-text-muted)' }}>
            SECURE CHECKOUT BY OJK
        </p>
    );
}