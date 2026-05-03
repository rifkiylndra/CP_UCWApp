import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Components/Layout/CustomerLayout';

interface Props {
    tableId: string;
}

export default function Landing({ tableId }: Props) {
    return (
        <>
            <Head title="Welcome" />
            <CustomerLayout hideTopBar>
                {/* ── Hero Background ── */}
                <div className="relative flex-1 flex flex-col overflow-hidden">
                    {/* Coffee mood image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80')`,
                        }}
                    />
                    {/* Dark overlay gradient */}
                    <div className="absolute inset-0"
                        style={{ background: 'linear-gradient(to bottom, rgba(45,26,14,0.3) 0%, rgba(45,26,14,0.85) 60%, rgba(45,26,14,0.97) 100%)' }}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col flex-1 px-6 pt-16 pb-10">
                        {/* Brand */}
                        <div className="flex items-center gap-3 mb-auto">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                                    <line x1="6" y1="1" x2="6" y2="4" />
                                    <line x1="10" y1="1" x2="10" y2="4" />
                                    <line x1="14" y1="1" x2="14" y2="4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white/60 text-[11px] uppercase tracking-widest font-medium">
                                    UNAND Co-Workspace
                                </p>
                            </div>
                        </div>

                        {/* Main text */}
                        <div className="mb-10">
                            <p className="text-white/50 text-[11px] uppercase tracking-[0.2em] font-medium mb-3">
                                Editorial Barista — {tableId}
                            </p>
                            <h1 className="text-white text-[36px] font-black leading-[1.1] tracking-tight mb-4">
                                Craft your<br />perfect brew.
                            </h1>
                            <p className="text-white/60 text-[15px] leading-relaxed">
                                Artisanal coffee, thoughtfully sourced.<br />
                                Order from your table in seconds.
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col gap-3">
                            <Link
                                href={route('customer.menu', { tableId })}
                                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-semibold tracking-tight transition-transform active:scale-[0.98]"
                                style={{ backgroundColor: 'white', color: 'var(--color-ucw-dark)' }}
                            >
                                View Menu
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                            <p className="text-center text-white/40 text-[12px]">
                                Table {tableId} · Scan to order
                            </p>
                        </div>
                    </div>
                </div>
            </CustomerLayout>
        </>
    );
}
