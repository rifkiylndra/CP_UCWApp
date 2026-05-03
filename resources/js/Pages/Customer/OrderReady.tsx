import { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Components/Layout/CustomerLayout';

interface Props {
    tableId: string;
    orderId: string;
}

export default function OrderReady({ tableId, orderId }: Props) {
    const hasAnimated = useRef(false);

    useEffect(() => {
        // Haptic feedback on native PWA
        if ('vibrate' in navigator && !hasAnimated.current) {
            navigator.vibrate([100, 50, 100]);
            hasAnimated.current = true;
        }
    }, []);

    return (
        <>
            <Head title="Your Brew is Ready!" />
            <CustomerLayout hideTopBar>
                <div className="flex flex-col flex-1 px-5 pt-safe-top pt-12 pb-10">
                    {/* ── Celebration header ── */}
                    <div className="flex flex-col items-center text-center mb-8">
                        {/* Animated icon */}
                        <div className="w-28 h-28 rounded-full flex items-center justify-center mb-6"
                            style={{
                                backgroundColor: 'var(--color-ucw-dark)',
                                boxShadow: '0 0 0 12px rgba(45,26,14,0.08), 0 0 0 24px rgba(45,26,14,0.04)',
                                animation: 'pulse 2s ease-in-out infinite',
                            }}>
                            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                                <line x1="6" y1="1" x2="6" y2="4" />
                                <line x1="10" y1="1" x2="10" y2="4" />
                                <line x1="14" y1="1" x2="14" y2="4" />
                            </svg>
                        </div>

                        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3"
                            style={{ color: 'var(--color-ucw-text-muted)' }}>
                            Order #{orderId}
                        </p>
                        <h1 className="text-[32px] font-black tracking-tight mb-3 leading-tight"
                            style={{ color: 'var(--color-ucw-text)' }}>
                            Your brew<br />is ready! ☕
                        </h1>
                        <p className="text-[15px] leading-relaxed"
                            style={{ color: 'var(--color-ucw-text-muted)' }}>
                            Head over to the counter —<br />your artisan coffee awaits.
                        </p>
                    </div>

                    {/* ── Order card ── */}
                    <div className="p-5 rounded-2xl mb-5"
                        style={{ backgroundColor: 'white', border: '1px solid var(--color-ucw-border)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[12px] uppercase tracking-widest font-semibold"
                                style={{ color: 'var(--color-ucw-text-muted)' }}>Your Order</span>
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                                style={{ backgroundColor: 'var(--color-ucw-green-bg)', color: 'var(--color-ucw-green-text)' }}>
                                ✓ Ready
                            </span>
                        </div>
                        {['Single Origin Flat White × 1', 'Honey Oat Latte × 2'].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 py-2.5"
                                style={{ borderTop: i > 0 ? '1px solid var(--color-ucw-border)' : 'none' }}>
                                <div className="w-2 h-2 rounded-full flex-none" style={{ backgroundColor: 'var(--color-ucw-green)' }} />
                                <span className="text-[14px]" style={{ color: 'var(--color-ucw-text)' }}>{item}</span>
                            </div>
                        ))}
                    </div>

                    {/* ── Barista note ── */}
                    <div className="p-4 rounded-2xl mb-auto"
                        style={{ backgroundColor: 'var(--color-ucw-bg-warm)', border: '1px solid var(--color-ucw-border)' }}>
                        <div className="flex gap-3 items-start">
                            <span className="text-xl">✨</span>
                            <div>
                                <p className="text-[13px] font-semibold mb-0.5" style={{ color: 'var(--color-ucw-text)' }}>
                                    From your barista
                                </p>
                                <p className="text-[12px] leading-relaxed italic" style={{ color: 'var(--color-ucw-text-muted)' }}>
                                    "Crafted with Ethiopian Yirgacheffe beans, roasted this morning. Enjoy every sip!"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── CTA ── */}
                    <div className="mt-8 flex flex-col gap-3">
                        <Link
                            href={route('customer.feedback', { tableId, orderId })}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-semibold active:scale-[0.98] transition-transform"
                            style={{ backgroundColor: 'var(--color-ucw-dark)', color: 'white' }}
                        >
                            Share Your Experience ✦
                        </Link>
                        <Link
                            href={route('customer.menu', { tableId })}
                            className="w-full flex items-center justify-center py-3 rounded-2xl text-[14px] font-medium"
                            style={{ color: 'var(--color-ucw-text-muted)', border: '1px solid var(--color-ucw-border)' }}
                        >
                            Order Again
                        </Link>
                    </div>
                </div>

                <style>{`
                    @keyframes pulse {
                        0%, 100% { box-shadow: 0 0 0 12px rgba(45,26,14,0.08), 0 0 0 24px rgba(45,26,14,0.04); }
                        50% { box-shadow: 0 0 0 16px rgba(45,26,14,0.12), 0 0 0 32px rgba(45,26,14,0.06); }
                    }
                `}</style>
            </CustomerLayout>
        </>
    );
}
