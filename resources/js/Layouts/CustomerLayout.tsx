import { ReactNode } from 'react';
import { Link } from '@inertiajs/react';

interface CustomerLayoutProps {
    children:     ReactNode;
    showBack?:    boolean;
    backHref?:    string;
    title?:       string;
    hideTopBar?:  boolean;
    step?:        number;
    totalSteps?:  number;
}

export default function CustomerLayout({
    children,
    showBack    = false,
    backHref    = '#',
    title,
    hideTopBar  = false,
    step,
    totalSteps  = 6,
}: CustomerLayoutProps) {
    return (
        /*
         * Root wrapper:
         * - Mobile  → centers content, caps at 480px (original behaviour)
         * - Desktop → full-width, no centering cap (md:max-w-none md:block)
         */
        <div
            className="min-h-screen flex flex-col md:block"
            style={{ backgroundColor: 'var(--color-ucw-bg)' }}
        >
            {/* ── Inner shell ──
                Mobile  : centered column, max 480px
                Desktop : full width — pages handle their own internal layout
            */}
            <div className="w-full max-w-[480px] mx-auto flex flex-col min-h-screen md:max-w-none md:mx-0 md:flex md:flex-col relative">

                {/* ── Top Bar (mobile only — desktop pages build their own header) ── */}
                {!hideTopBar && (
                    <header className="flex items-center px-5 pt-4 pb-3 relative z-20 md:hidden">
                        {showBack && (
                            <Link
                                href={backHref}
                                className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
                                style={{ backgroundColor: 'var(--color-ucw-border)' }}
                            >
                                <svg
                                    width="18" height="18" viewBox="0 0 24 24"
                                    fill="none" stroke="var(--color-ucw-text)"
                                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </Link>
                        )}

                        {title && (
                            <h1
                                className="flex-1 text-center text-[15px] font-semibold tracking-tight"
                                style={{ color: 'var(--color-ucw-text)' }}
                            >
                                {title}
                            </h1>
                        )}

                        {/* Spacer keeps title centered when back button is shown */}
                        {showBack && <div className="w-9" />}
                    </header>
                )}

                {/* ── Progress Bar ── */}
                {step !== undefined && (
                    <div className="px-5 pb-3 md:hidden">
                        <div
                            className="h-1 rounded-full overflow-hidden"
                            style={{ backgroundColor: 'var(--color-ucw-border)' }}
                        >
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width:           `${(step / totalSteps) * 100}%`,
                                    backgroundColor: 'var(--color-ucw-dark)',
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* ── Page Content ── */}
                <main className="flex-1 flex flex-col">
                    {children}
                </main>

                {/* ── Bottom Safe Area (mobile only) ── */}
                <div className="pb-4 md:pb-0" />
            </div>
        </div>
    );
}