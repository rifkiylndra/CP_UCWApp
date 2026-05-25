import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import TopBar from '@/Components/customer/TopBar';


interface Props {
    tableId: string;
    orderId: string;
}

const COFFEE_PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23C8A882'/%3E%3Cellipse cx='200' cy='100' rx='60' ry='40' fill='%23A07850' opacity='0.6'/%3E%3C/svg%3E";

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex flex-col items-center gap-3">
            <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map(star => {
                    const filled = star <= (hovered || value);
                    return (
                        <button
                            key={star}
                            onClick={() => onChange(star)}
                            onMouseEnter={() => setHovered(star)}
                            onMouseLeave={() => setHovered(0)}
                            className="transition-transform active:scale-90 hover:scale-110"
                            style={{ fontSize: 40 }}
                            aria-label={`Rate ${star} star`}
                        >
                            <span style={{ color: filled ? '#B8860B' : '#D4C9BC', transition: 'color 0.15s' }}>★</span>
                        </button>
                    );
                })}
            </div>
            <p className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: 'var(--color-ucw-text-muted)' }}>
                {value > 0 ? `${value}.0 / 5.0 Rating` : '0.0 / 5.0 Rating'}
            </p>
        </div>
    );
}

function VibeSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    return (
        <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: 'var(--color-ucw-text-muted)' }}>
                Describe the Vibe
            </p>
            <div className="flex items-center gap-3">
                <span className="text-[12px] font-semibold tracking-wider uppercase w-14 text-left" style={{ color: 'var(--color-ucw-text-muted)' }}>Quiet</span>
                <div className="relative flex-1 h-[2px] rounded-full" style={{ backgroundColor: 'var(--color-ucw-border-dark)' }}>
                    <div className="absolute top-0 left-0 h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: 'var(--color-ucw-dark)' }} />
                    <input
                        type="range" min={0} max={100} value={value}
                        onChange={e => onChange(Number(e.target.value))}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                        style={{ margin: 0 }}
                    />
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full shadow-md transition-all"
                        style={{ left: `calc(${value}% - 12px)`, backgroundColor: 'var(--color-ucw-dark)', pointerEvents: 'none' }}
                    />
                </div>
                <span className="text-[12px] font-semibold tracking-wider uppercase w-14 text-right" style={{ color: 'var(--color-ucw-text-muted)' }}>Lively</span>
            </div>
        </div>
    );
}

export default function Feedback({ tableId, orderId }: Props) {
    const [rating, setRating]       = useState(0);
    const [comment, setComment]     = useState('');
    const [vibe, setVibe]           = useState(80);
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit() {
        setSubmitted(true);
        setTimeout(() => router.visit(route('customer.landing', { tableId })), 2500);
    }

    function handleReturnHome() {
        router.visit(route('customer.landing', { tableId }));
    }

    /* ── Thank you screen ── */
    if (submitted) {
        return (
            <>
                <Head title="Thank You!" />
                <CustomerLayout hideTopBar>
                    <div className="flex flex-col flex-1 items-center justify-center px-8 text-center gap-4">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-ucw-bg-warm)' }}>
                            <span style={{ fontSize: 44 }}>🙏</span>
                        </div>
                        <h1 className="text-[28px] font-black tracking-tight" style={{ color: 'var(--color-ucw-text)' }}>Thank you!</h1>
                        <p className="text-[14px] leading-relaxed max-w-[260px]" style={{ color: 'var(--color-ucw-text-muted)' }}>
                            Your feedback helps us craft a better experience for every guest.
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-[13px]" style={{ color: 'var(--color-ucw-text-muted)' }}>
                            <div className="w-4 h-4 border-2 rounded-full border-current animate-spin border-t-transparent" />
                            Redirecting to home...
                        </div>
                    </div>
                </CustomerLayout>
            </>
        );
    }

    /* ── Form content — shared between layouts ── */
    const FormContent = ({ compact = false }: { compact?: boolean }) => (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold tracking-widest uppercase pl-1" style={{ color: 'var(--color-ucw-text-muted)' }}>
                    How was your experience?
                </label>
                <textarea
                    rows={compact ? 4 : 5}
                    placeholder="Tell us about the roast, the service, or the atmosphere..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    className="w-full text-[14px] resize-none rounded-2xl p-4 outline-none leading-relaxed"
                    style={{ backgroundColor: 'var(--color-ucw-bg-warm)', border: '1px solid var(--color-ucw-border)', color: 'var(--color-ucw-text)' }}
                />
            </div>

            <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--color-ucw-bg-warm)', border: '1px solid var(--color-ucw-border)' }}>
                <VibeSlider value={vibe} onChange={setVibe} />
            </div>

            <button
                onClick={handleSubmit}
                disabled={rating === 0}
                className="w-full py-4 rounded-2xl text-[15px] font-semibold tracking-wide transition-all active:scale-[0.98]"
                style={{
                    backgroundColor: rating > 0 ? 'var(--color-ucw-dark)' : 'var(--color-ucw-border-dark)',
                    color:           rating > 0 ? 'white' : 'var(--color-ucw-text-muted)',
                    cursor:          rating > 0 ? 'pointer' : 'not-allowed',
                }}
            >
                Submit Feedback
            </button>

            <button
                onClick={handleReturnHome}
                className="text-[11px] font-semibold tracking-widest uppercase text-center w-full pb-1"
                style={{ color: 'var(--color-ucw-text-muted)' }}
            >
                Return Home
            </button>
        </div>
    );

    return (
        <>
            <Head title="Share Feedback — UCW" />
            <CustomerLayout hideTopBar>

                {/* ══════════════════════════════════════════════
                    MOBILE
                ══════════════════════════════════════════════ */}
                <div className="md:hidden min-h-svh flex flex-col" style={{ backgroundColor: '#FAF9F7' }}>
    {/* Header */}
    <div className="flex items-center justify-between px-6 pt-5 pb-5">
        <button
            onClick={() => router.visit(route('customer.menu', { tableId }))}
            className="w-8 h-8 flex items-center justify-center"
            style={{ color: 'var(--color-ucw-dark)' }}
        >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
        </button>

        <h1 className="font-black text-base" style={{ color: 'var(--color-ucw-dark)' }}>
            UNAND CO-WORKSPACE
        </h1>

        <button
            onClick={() => router.visit(route('customer.cart', { tableId }))}
            className="w-8 h-8 flex items-center justify-center"
            style={{ color: 'var(--color-ucw-dark)' }}
        >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
        </button>
    </div>

    <div className="flex-1 px-6 pb-8">
        {/* Hero image */}
        <div className="relative rounded-[30px] overflow-hidden mt-8" style={{ height: '193px' }}>
            <img
                // src="/images/feedback-coffee.png"
                src={COFFEE_PLACEHOLDER}
                alt="Coffee"
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.68)' }}
            />

            <div className="absolute inset-0" style={{
                background: 'linear-gradient(to bottom, rgba(20,12,6,0.05), rgba(20,12,6,0.42))',
            }} />

            <div className="absolute left-8 right-8 bottom-8">
                <p className="font-bold uppercase tracking-[0.26em] mb-2 text-white" style={{ fontSize: '12px' }}>
                    THANK YOU FOR VISITING
                </p>

                <h2 className="font-black leading-tight text-white" style={{ fontSize: '30px' }}>
                    How was your brew today?
                </h2>
            </div>
        </div>

        {/* Rating */}
        <div className="mt-12 text-center">
            <p className="font-bold mb-5" style={{ fontSize: '16px', color: 'var(--color-ucw-text-muted)' }}>
                Rate your experience
            </p>

            <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= rating;

                    return (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="transition-transform active:scale-90"
                            aria-label={`Rate ${star} star`}
                        >
                            <span
                                style={{
                                    fontSize: '36px',
                                    lineHeight: 1,
                                    color: filled ? 'var(--color-ucw-dark)' : '#D8CBC7',
                                }}
                            >
                                ★
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Thoughts */}
        <div className="mt-12">
            <label
                className="block font-bold uppercase tracking-[0.18em] mb-5"
                style={{ fontSize: '14px', color: 'var(--color-ucw-dark)' }}
            >
                YOUR THOUGHTS
            </label>

            <div className="relative">
                <textarea
                    rows={5}
                    placeholder="Tell us about the atmosphere, the coffee, or the workspace..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full resize-none rounded-[24px] px-6 py-6 outline-none leading-relaxed"
                    style={{
                        minHeight: '168px',
                        backgroundColor: '#F5F4F3',
                        color: 'var(--color-ucw-text)',
                        fontSize: '16px',
                    }}
                />

                <svg
                    className="absolute right-6 bottom-6 opacity-30"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-ucw-text-muted)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
            </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-4 mt-12">
            <div
                className="rounded-[22px] px-6 py-6"
                style={{
                    backgroundColor: 'white',
                    boxShadow: '0 18px 40px rgba(0,0,0,0.04)',
                }}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect x="4" y="4" width="16" height="18" rx="2" />
                    <path d="M8 10h8" />
                    <path d="M8 14h6" />
                    <path d="M8 18h4" />
                </svg>

                <p className="font-bold uppercase tracking-[0.14em] mt-5 mb-2" style={{ fontSize: '10px', color: 'var(--color-ucw-text-muted)' }}>
                    ORDER #2931
                </p>

                <p className="font-black leading-snug" style={{ fontSize: '16px', color: 'var(--color-ucw-dark)' }}>
                    Espresso &<br />Desk A4
                </p>
            </div>

            <div
                className="rounded-[22px] px-6 py-6"
                style={{ backgroundColor: '#D8ECD2' }}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5E715A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                </svg>

                <p className="font-bold uppercase tracking-[0.14em] mt-5 mb-2" style={{ fontSize: '10px', color: '#7D8F78' }}>
                    VISIT TIME
                </p>

                <p className="font-black leading-snug" style={{ fontSize: '16px', color: '#5B6E56' }}>
                    10:45 AM<br />Today
                </p>
            </div>
        </div>
    </div>

    {/* Fixed bottom submit */}
    {/* Submit section */}
<div className="mt-12 pb-8">
    <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className="w-full rounded-full font-bold text-white transition-all active:scale-[0.98]"
        style={{
            height: '68px',
            fontSize: '17px',
            backgroundColor: rating > 0 ? 'var(--color-ucw-dark)' : '#CFC5C0',
            boxShadow: rating > 0 ? '0 16px 30px rgba(45,26,14,0.22)' : 'none',
            cursor: rating > 0 ? 'pointer' : 'not-allowed',
        }}
    >
        Submit Feedback
    </button>

    <p
        className="text-center mt-5 leading-relaxed"
        style={{ fontSize: '11px', color: 'var(--color-ucw-text-muted)' }}
    >
        By submitting, you help us refine the Unand<br />
        experience. We may reach out to you via your<br />
        registered email.
    </p>
</div>


</div>

                {/* ══════════════════════════════════════════════
                    DESKTOP — two columns
                ══════════════════════════════════════════════ */}
                <div className="hidden md:flex min-h-svh" style={{ backgroundColor: '#E8E1D8' }}>

                    {/* Left: hero + decoration */}
                    <div className="flex-1 relative flex flex-col overflow-hidden">
                        {/* Background photo */}
                        <img
                            src={COFFEE_PLACEHOLDER}
                            alt="Coffee"
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ filter: 'brightness(0.7) saturate(0.8)' }}
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(20,12,6,0.15) 0%, rgba(20,12,6,0.55) 60%, rgba(20,12,6,0.92) 100%)' }} />

                        {/* Content over photo */}
                        <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-12 text-center">
                            <HeroCircle light />
                            <h1 className="text-[38px] font-black tracking-tight leading-tight mt-6 mb-3 text-white">
                                How was your<br />ritual?
                            </h1>
                            <p className="text-[15px] leading-relaxed max-w-[300px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                                Every drop matters to us. Share your honest experience with us.
                            </p>

                            {/* Large star rating */}
                            <div className="mt-8">
                                <StarRating value={rating} onChange={setRating} />
                            </div>
                        </div>

                        {/* Bottom tagline */}
                        <p className="relative z-10 text-center pb-10 tracking-[0.22em] uppercase" style={{ fontFamily: 'monospace', fontSize: '8.5px', color: 'rgba(255,255,255,0.3)' }}>
                            CRAFTED WITH CARE · UNAND CO-WORKSPACE
                        </p>
                    </div>

                    {/* Right: form panel */}
                    <div
                        className="w-[400px] shrink-0 overflow-y-auto flex flex-col"
                        style={{ background: 'var(--color-ucw-bg)', borderLeft: '1px solid var(--color-ucw-border)' }}
                    >
                        {/* Panel header */}
                        <div className="px-8 pt-8 pb-6" style={{ borderBottom: '1px solid var(--color-ucw-border)' }}>
                            <div className="flex items-center gap-2 mb-4">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round">
                                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                                    <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                                </svg>
                                <span className="font-bold text-xs tracking-[0.04em]" style={{ color: 'var(--color-ucw-dark)' }}>UNAND CO-WORKSPACE</span>
                            </div>
                            <h2 className="font-black text-2xl leading-tight" style={{ color: 'var(--color-ucw-dark)' }}>Share your<br />feedback</h2>
                            <p className="text-sm mt-2" style={{ color: 'var(--color-ucw-text-muted)' }}>
                                {rating > 0 ? `You've rated us ${rating}.0 / 5.0 ★` : 'Select a star rating on the left to begin.'}
                            </p>
                        </div>

                        <div className="flex-1 px-8 py-6">
                            <FormContent compact />
                        </div>
                    </div>
                </div>

            </CustomerLayout>
        </>
    );
}

function HeroCircle({ light = false }: { light?: boolean }) {
    return (
        <div
            className="w-28 h-28 rounded-full flex items-center justify-center"
            style={{ backgroundColor: light ? 'rgba(255,255,255,0.15)' : 'var(--color-ucw-bg-warm)' }}
        >
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                <path
                    d="M26 44C26 44 6 32 6 18C6 13.029 10.029 9 15 9C18.8 9 22.1 11.3 24 14.7C25.9 11.3 29.2 9 33 9C37.971 9 42 13.029 42 18C42 32 26 44 26 44Z"
                    fill={light ? 'rgba(255,255,255,0.85)' : '#3D2A1A'}
                />
            </svg>
        </div>
    );
}