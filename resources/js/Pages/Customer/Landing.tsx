import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

interface Props {
    tableId:      string;
    tableNumber?: string;
    isOpen?:      boolean;
}

export default function Landing({ tableId, tableNumber, isOpen = true }: Props) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            <Head title="Welcome — UCW" />
            <CustomerLayout hideTopBar>

                {/* ─── Mobile layout: full-screen bg + bottom card ─── */}
                <div className="md:hidden relative flex flex-col min-h-svh overflow-hidden">

                    {/* Background */}
                    <div className="absolute inset-0">
                        <img
                            src="/images/Unand_Co-Workspace_Interior.png"
                            alt="Unand Co-Workspace Interior"
                            className="w-full h-full object-cover object-center"
                            draggable={false}
                        />
                        <div className="absolute inset-0" style={{
                            background: 'linear-gradient(to bottom, rgba(20,12,6,0.22) 0%, rgba(20,12,6,0.12) 25%, rgba(20,12,6,0.45) 55%, rgba(20,12,6,0.90) 75%, rgba(20,12,6,0.97) 100%)',
                        }} />
                        <div className="absolute inset-0" style={{
                            background: 'radial-gradient(ellipse at center, transparent 35%, rgba(20,12,6,0.38) 100%)',
                        }} />
                    </div>

                    {/* Foreground */}
                    <div className="relative z-10 flex flex-col flex-1 px-6 select-none">

                        {/* Brand — top */}
                        <div
                            className="pt-14 flex flex-col items-center"
                            style={{
                                opacity:    visible ? 1 : 0,
                                transform:  visible ? 'translateY(0)' : 'translateY(-14px)',
                                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                            }}
                        >
                            <LogoPill dark={false} size={62} iconSize={28} />
                            <BrandName dark={false} />
                        </div>

                        <div className="flex-1" />

                        {/* Bottom card */}
                        <div
                            style={{
                                opacity:    visible ? 1 : 0,
                                transform:  visible ? 'translateY(0)' : 'translateY(28px)',
                                transition: 'opacity 0.65s ease-out 0.1s, transform 0.65s ease-out 0.1s',
                            }}
                        >
                            <div
                                className="rounded-t-[28px] px-6 pt-7 pb-12"
                                style={{
                                    background:          'rgba(250,247,242,0.97)',
                                    backdropFilter:      'blur(24px)',
                                    WebkitBackdropFilter:'blur(24px)',
                                    boxShadow:           '0 -12px 48px rgba(0,0,0,0.28)',
                                }}
                            >
                                <BottomCardContent tableId={tableId} isOpen={isOpen} />
                            </div>
                        </div>
                    </div>

                    {/* Footer tagline */}
                    <div
                        className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-20"
                        style={{ opacity: visible ? 0.28 : 0, transition: 'opacity 0.8s ease-out 0.35s' }}
                    >
                        <p className="text-white tracking-[0.24em] uppercase" style={{ fontSize: '8.5px' }}>
                            SCAN • ORDER • FOCUS • CREATE
                        </p>
                    </div>
                </div>

                {/* ─── Desktop layout: two columns ─── */}
                <div className="hidden md:flex min-h-svh">

                    {/* Left — background image + brand */}
                    <div className="relative flex-1 flex flex-col overflow-hidden">
                        <img
                            src="/images/Unand_Co-Workspace_Interior.png"
                            alt="Unand Co-Workspace Interior"
                            className="absolute inset-0 w-full h-full object-cover object-center"
                            draggable={false}
                        />
                        <div className="absolute inset-0" style={{
                            background: 'linear-gradient(to bottom, rgba(20,12,6,0.28) 0%, rgba(20,12,6,0.10) 30%, rgba(20,12,6,0.55) 70%, rgba(20,12,6,0.88) 100%)',
                        }} />
                        <div className="absolute inset-0" style={{
                            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(20,12,6,0.40) 100%)',
                        }} />

                        {/* Brand top-left */}
                        <div
                            className="relative z-10 pt-10 pl-12 flex flex-col items-start"
                            style={{
                                opacity:    visible ? 1 : 0,
                                transform:  visible ? 'translateY(0)' : 'translateY(-14px)',
                                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                            }}
                        >
                            <LogoPill dark={false} size={56} iconSize={24} />
                            <BrandName dark={false} align="left" />
                        </div>

                        {/* Bottom-left ambient */}
                        <div
                            className="absolute bottom-10 left-12 z-10"
                            style={{ opacity: visible ? 0.32 : 0, transition: 'opacity 0.8s ease-out 0.4s' }}
                        >
                            <p className="text-white tracking-[0.22em] uppercase" style={{ fontFamily: 'monospace', fontSize: '8.5px' }}>
                                SCAN · ORDER · FOCUS · CREATE
                            </p>
                        </div>
                    </div>

                    {/* Right — glass panel */}
                    <div
                        className="w-[420px] shrink-0 flex flex-col justify-center px-10 py-12"
                        style={{
                            background:          'rgba(250,247,242,0.97)',
                            backdropFilter:      'blur(32px)',
                            WebkitBackdropFilter:'blur(32px)',
                            borderLeft:          '1px solid rgba(255,255,255,0.25)',
                            boxShadow:           '-24px 0 64px rgba(0,0,0,0.22)',
                        }}
                    >
                        {/* Small logo + brand in panel */}
                        <div className="flex items-center gap-3 mb-8">
                            <LogoPill dark size={44} iconSize={18} />
                            <span className="font-black tracking-[0.06em] text-sm leading-tight" style={{ color: 'var(--color-ucw-dark)' }}>
                                UNAND<br />CO-WORKSPACE
                            </span>
                        </div>

                        {/* Table chip */}
                        {tableNumber && (
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 self-start"
                                style={{
                                    background: 'rgba(20,16,10,0.06)',
                                    border:     '1px solid rgba(20,16,10,0.10)',
                                    fontSize:   '11px',
                                    color:      'var(--color-ucw-text-muted)',
                                }}
                            >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                                Table <span className="font-bold ml-1" style={{ color: 'var(--color-ucw-dark)' }}>{tableNumber}</span>
                            </div>
                        )}

                        <BottomCardContent tableId={tableId} isOpen={isOpen} desktop />

                        {/* Feature list */}
                        <div
                            className="mt-8 pt-8 flex flex-col gap-3"
                            style={{ borderTop: '1px solid var(--color-ucw-border)' }}
                        >
                            {[
                                { icon: '☕', text: 'Specialty coffee sourced from local highlands' },
                                { icon: '⚡', text: 'High-speed Wi-Fi & dedicated workspaces' },
                                { icon: '👥', text: 'Private meeting rooms available' },
                            ].map(f => (
                                <div key={f.text} className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 text-sm"
                                        style={{ background: 'rgba(20,16,10,0.05)', border: '1px solid rgba(20,16,10,0.09)' }}
                                    >
                                        {f.icon}
                                    </div>
                                    <span style={{ fontSize: '13px', color: 'var(--color-ucw-text-muted)' }}>{f.text}</span>
                                </div>
                            ))}
                        </div>

                        <p className="mt-8 tracking-[0.2em] uppercase" style={{ fontFamily: 'monospace', fontSize: '8.5px', color: 'var(--color-ucw-text-muted)' }}>
                            SCAN · ORDER · FOCUS · CREATE
                        </p>
                    </div>
                </div>

            </CustomerLayout>
        </>
    );
}

/* ─── Shared sub-components ─── */

function LogoPill({ dark, size, iconSize }: { dark: boolean; size: number; iconSize: number }) {
    return (
        <div
            className="flex items-center justify-center mb-5 rounded-[18px]"
            style={{
                width:               size,
                height:              size,
                borderRadius:        size * 0.29,
                background:          dark ? 'rgba(20,16,10,0.08)' : 'rgba(255,255,255,0.14)',
                backdropFilter:      'blur(16px)',
                WebkitBackdropFilter:'blur(16px)',
                border:              dark ? '1px solid rgba(20,16,10,0.12)' : '1px solid rgba(255,255,255,0.22)',
                boxShadow:           '0 4px 24px rgba(0,0,0,0.18)',
            }}
        >
            <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none"
                stroke={dark ? 'var(--color-ucw-dark)' : 'white'}
                strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
        </div>
    );
}

function BrandName({ dark = false, align = 'center' }: { dark?: boolean; align?: 'center' | 'left' }) {
    return (
        <p
            className={`font-black tracking-[0.07em] leading-[1.15] ${align === 'center' ? 'text-center' : 'text-left'}`}
            style={{
                fontSize:   '21px',
                color:      dark ? 'var(--color-ucw-dark)' : 'white',
                textShadow: dark ? 'none' : '0 2px 16px rgba(0,0,0,0.45)',
            }}
        >
            UNAND<br />CO-WORKSPACE
        </p>
    );
}

function BottomCardContent({
    tableId,
    isOpen,
    desktop = false,
}: {
    tableId: string;
    isOpen:  boolean;
    desktop?: boolean;
}) {
    return (
        <>
            <p
                className="font-semibold uppercase tracking-[0.17em] mb-3"
                style={{ fontSize: '9.5px', color: 'var(--color-ucw-text-muted)' }}
            >
                WELCOME TO YOUR MORNING RITUAL
            </p>

            <h1
                className="font-black leading-[1.08] tracking-tight mb-3"
                style={{ fontSize: desktop ? '2rem' : '27px', color: 'var(--color-ucw-dark)' }}
            >
                Crafted Coffee &amp;<br />Curated Focus.
            </h1>

            <p
                className="leading-relaxed mb-7"
                style={{ fontSize: '13.5px', color: 'var(--color-ucw-text-muted)', lineHeight: '1.68' }}
            >
                Experience the art of specialty brewing in a space designed for
                modern makers and creative minds.
            </p>

            {/* CTA */}
            {isOpen ? (
                <Link
                    href={route('customer.menu', { tableId })}
                    className="w-full flex items-center justify-center gap-2.5 rounded-[14px] font-bold tracking-[0.07em] transition-all duration-150 active:scale-[0.97] mb-5"
                    style={{
                        height:          '54px',
                        fontSize:        '13px',
                        backgroundColor: 'var(--color-ucw-dark)',
                        color:           'white',
                        boxShadow:       '0 6px 24px rgba(45,26,14,0.32)',
                    }}
                >
                    START ORDER
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </Link>
            ) : (
                <div
                    className="w-full flex items-center justify-center rounded-[14px] font-bold tracking-[0.07em] mb-5"
                    style={{
                        height:          '54px',
                        fontSize:        '13px',
                        backgroundColor: 'var(--color-ucw-border)',
                        color:           'var(--color-ucw-text-muted)',
                    }}
                >
                    CURRENTLY CLOSED
                </div>
            )}

            {/* Meta row */}
            <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5" style={{ fontSize: '12px', color: 'var(--color-ucw-text-muted)' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    Padang, Indonesia
                </div>

                <div className="w-[3px] h-[3px] rounded-full" style={{ backgroundColor: 'var(--color-ucw-border-dark)' }} />

                <div
                    className="flex items-center gap-1.5"
                    style={{ fontSize: '12px', color: isOpen ? 'var(--color-ucw-green-text)' : 'var(--color-ucw-red-text)' }}
                >
                    <span className="relative flex h-1.5 w-1.5">
                        {isOpen && (
                            <span
                                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                                style={{ backgroundColor: 'var(--color-ucw-green)' }}
                            />
                        )}
                        <span
                            className="relative inline-flex rounded-full h-1.5 w-1.5"
                            style={{ backgroundColor: isOpen ? 'var(--color-ucw-green)' : 'var(--color-ucw-red)' }}
                        />
                    </span>
                    {isOpen ? 'Open Now' : 'Closed'}
                </div>

                {desktop && (
                    <>
                        <div className="w-[3px] h-[3px] rounded-full" style={{ backgroundColor: 'var(--color-ucw-border-dark)' }} />
                        <div className="flex items-center gap-1.5" style={{ fontSize: '12px', color: 'var(--color-ucw-text-muted)' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                            </svg>
                            07.00 – 22.00
                        </div>
                    </>
                )}
            </div>
        </>
    );
}