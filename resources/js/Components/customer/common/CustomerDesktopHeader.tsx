import { Link } from '@inertiajs/react';

interface Props {
    backHref?: string;
    title?: string;
    subtitle?: string;
    active?: 'menu' | 'cart' | 'details' | 'payment' | 'track';
    tableId: string;
}

export default function CustomerDesktopHeader({
    backHref,
    title = 'UNAND CO-WORKSPACE',
    subtitle,
    active = 'menu',
    tableId,
}: Props) {
    const tabs = [
        { key: 'menu', label: 'Menu', href: route('customer.menu', { tableId }) },
        { key: 'cart', label: 'Cart', href: route('customer.cart', { tableId }) },
        { key: 'track', label: 'Track', href: '#' },
    ];

    return (
        <div
            className="sticky top-0 z-30 flex items-center justify-between px-8 lg:px-10 py-5"
            style={{
                background: 'var(--color-ucw-bg)',
                borderBottom: '1px solid var(--color-ucw-border)',
            }}
        >
            <div className="flex items-center gap-3 min-w-0">
                {backHref && (
                    <Link
                        href={backHref}
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-opacity active:opacity-60"
                        style={{ backgroundColor: 'var(--color-ucw-border)' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </Link>
                )}

                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-ucw-border)' }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-ucw-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                        <line x1="6" y1="1" x2="6" y2="4" />
                        <line x1="10" y1="1" x2="10" y2="4" />
                        <line x1="14" y1="1" x2="14" y2="4" />
                    </svg>
                </div>

                <div className="min-w-0">
                    <p className="font-black text-sm truncate" style={{ color: 'var(--color-ucw-dark)' }}>
                        {title}
                    </p>
                    {subtitle && (
                        <p className="text-xs truncate" style={{ color: 'var(--color-ucw-text-muted)' }}>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1">
                {tabs.map((tab) => {
                    const isActive = active === tab.key;

                    return (
                        <Link
                            key={tab.key}
                            href={tab.href}
                            className="px-4 h-8 rounded-full text-sm font-semibold flex items-center transition-all"
                            style={
                                isActive
                                    ? {
                                          backgroundColor: 'var(--color-ucw-dark)',
                                          color: 'white',
                                      }
                                    : {
                                          color: 'var(--color-ucw-text-muted)',
                                      }
                            }
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}