import { Link } from '@inertiajs/react';

interface LandingContentCardProps {
    tableId: string;
    isOpen: boolean;
    desktop?: boolean;
}

export default function LandingContentCard({
    tableId,
    isOpen,
    desktop = false,
}: LandingContentCardProps) {
    return (
        <>
            <h1
                className="font-black leading-[1.08] tracking-tight mb-3"
                style={{
                    fontSize: desktop
                        ? 'clamp(1.6rem, 2.6vw, 2rem)'
                        : 'clamp(23px, 7vw, 27px)',
                    color: 'var(--color-ucw-dark)',
                }}
            >
                Crafted Coffee &amp;<br />Curated Focus.
            </h1>

            <p
                className="mb-5"
                style={{
                    fontSize: desktop ? '13.5px' : '13px',
                    color: 'var(--color-ucw-text-muted)',
                    lineHeight: '1.55',
                }}
            >
                Experience the art of specialty brewing in a space designed for
                modern makers and creative minds.
            </p>

            {isOpen ? (
                <Link
                    href={route('customer.menu', { tableId })}
                    className="w-full min-h-[54px] h-[54px] shrink-0 flex items-center justify-center gap-2.5 rounded-[14px] font-bold tracking-[0.07em] whitespace-nowrap transition-all duration-150 active:scale-[0.97] mb-5"
                    style={{
                        fontSize: '13px',
                        lineHeight: '13px',
                        backgroundColor: 'var(--color-ucw-dark)',
                        color: 'white',
                        boxShadow: '0 6px 24px rgba(45,26,14,0.32)',
                    }}
                >
                    START ORDER
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </Link>
            ) : (
                <div
                    className="w-full min-h-[54px] h-[54px] shrink-0 flex items-center justify-center rounded-[14px] font-bold tracking-[0.07em] whitespace-nowrap mb-5"
                    style={{
                        fontSize: '13px',
                        lineHeight: '13px',
                        backgroundColor: 'var(--color-ucw-border)',
                        color: 'var(--color-ucw-text-muted)',
                    }}
                >
                    CURRENTLY CLOSED
                </div>
            )}

            <div className="flex items-center justify-center gap-4">
                <span style={{ fontSize: '12px', color: 'var(--color-ucw-text-muted)' }}>
                    Padang, Indonesia
                </span>

                <div
                    className="w-[3px] h-[3px] rounded-full"
                    style={{ backgroundColor: 'var(--color-ucw-border-dark)' }}
                />

                <span
                    className="flex items-center gap-1.5"
                    style={{
                        fontSize: '12px',
                        color: isOpen
                            ? 'var(--color-ucw-green-text)'
                            : 'var(--color-ucw-red-text)',
                    }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                            backgroundColor: isOpen
                                ? 'var(--color-ucw-green)'
                                : 'var(--color-ucw-red)',
                        }}
                    />
                    {isOpen ? 'Open Now' : 'Closed'}
                </span>
            </div>
        </>
    );
}