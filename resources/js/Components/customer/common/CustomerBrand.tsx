interface CustomerBrandProps {
    dark?: boolean;
    align?: 'center' | 'left';
    logoSize?: number;
    iconSize?: number;
    showText?: boolean;
}

export default function CustomerBrand({
    dark = false,
    align = 'center',
    logoSize = 56,
    iconSize = 24,
    showText = true,
}: CustomerBrandProps) {
    return (
        <div className={align === 'center' ? 'flex flex-col items-center' : 'flex flex-col items-start'}>
            <div
                className="flex items-center justify-center mb-5"
                style={{
                    width: logoSize,
                    height: logoSize,
                    borderRadius: logoSize * 0.29,
                    background: dark
                        ? 'rgba(20,16,10,0.08)'
                        : 'rgba(255,255,255,0.14)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: dark
                        ? '1px solid rgba(20,16,10,0.12)'
                        : '1px solid rgba(255,255,255,0.22)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                }}
            >
                <svg
                    width={iconSize}
                    height={iconSize}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={dark ? 'var(--color-ucw-dark)' : 'white'}
                    strokeWidth="1.65"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1="6" y1="1" x2="6" y2="4" />
                    <line x1="10" y1="1" x2="10" y2="4" />
                    <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
            </div>

            {showText && (
                <p
                    className={`font-black tracking-[0.07em] leading-[1.15] ${
                        align === 'center' ? 'text-center' : 'text-left'
                    }`}
                    style={{
                        fontSize: '21px',
                        color: dark ? 'var(--color-ucw-dark)' : 'white',
                        textShadow: dark ? 'none' : '0 2px 16px rgba(0,0,0,0.45)',
                    }}
                >
                    UNAND<br />CO-WORKSPACE
                </p>
            )}
        </div>
    );
}