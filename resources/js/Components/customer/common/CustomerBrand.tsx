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
                className="flex items-center justify-center mb-5 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.18)]"
                style={{
                    width: logoSize,
                    height: logoSize,
                    borderRadius: '50%',
                    background: dark ? '#2A1712' : '#ffffff',
                    border: dark
                        ? '2px solid rgba(42,23,18,0.2)'
                        : '2px solid rgba(255,255,255,0.4)',
                }}
            >
                <img 
                    src="/assets/images/logo.png" 
                    alt="UCW Logo" 
                    className="h-full w-full object-cover" 
                />
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