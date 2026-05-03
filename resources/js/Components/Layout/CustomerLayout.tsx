import { ReactNode } from 'react';
import { Link } from '@inertiajs/react';

interface CustomerLayoutProps {
    children: ReactNode;
    /** Show back arrow in top-left */
    showBack?: boolean;
    backHref?: string;
    /** Title shown in top bar */
    title?: string;
    /** Hide the top bar entirely (for Landing page) */
    hideTopBar?: boolean;
    /** Step progress (1-based, out of totalSteps) */
    step?: number;
    totalSteps?: number;
}

export default function CustomerLayout({
    children,
    showBack = false,
    backHref = '#',
    title,
    hideTopBar = false,
    step,
    totalSteps = 6,
}: CustomerLayoutProps) {
    return (
        <div className="min-h-screen flex justify-center" style={{ backgroundColor: 'var(--color-ucw-bg)' }}>
            {/* Mobile container — max-w matches ~390px phone */}
            <div className="w-full max-w-[480px] flex flex-col min-h-screen relative">

                {/* ── Top Bar ── */}
                {!hideTopBar && (
                    <header className="flex items-center px-5 pt-safe-top pt-4 pb-3 relative z-20">
                        {showBack && (
                            <Link
                                href={backHref}
                                className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
                                style={{ backgroundColor: 'var(--color-ucw-border)' }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </Link>
                        )}

                        {title && (
                            <h1 className="flex-1 text-center text-[15px] font-semibold tracking-tight"
                                style={{ color: 'var(--color-ucw-text)' }}>
                                {title}
                            </h1>
                        )}

                        {/* Placeholder so title stays centered when back button shown */}
                        {showBack && <div className="w-9" />}
                    </header>
                )}

                {/* ── Progress Bar ── */}
                {step !== undefined && (
                    <div className="px-5 pb-3">
                        <div className="h-1 rounded-full overflow-hidden"
                            style={{ backgroundColor: 'var(--color-ucw-border)' }}>
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${(step / totalSteps) * 100}%`,
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

                {/* ── Bottom Safe Area ── */}
                <div className="pb-safe-bottom pb-4" />
            </div>
        </div>
    );
}
