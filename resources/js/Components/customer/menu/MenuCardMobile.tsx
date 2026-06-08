import type { MenuItem } from '@/types/customer';
import { formatIDR } from '@/lib/currency';
import { firstImageUrl, MENU_IMAGE_PLACEHOLDER, useFallbackImage } from '@/lib/images';

interface Props {
    item: MenuItem;
    qty: number;
    onAdd: () => void;
    onRemove: () => void;
    isLast: boolean;
    placeholder: string;
}

export default function MenuCardMobile({
    item,
    qty,
    onAdd,
    onRemove,
    isLast,
    placeholder,
}: Props) {
    const imageSrc = firstImageUrl(item.imageUrl, item.image_url, item.image);

    return (
        <div>
            <div className="px-5 pt-5">
                <div
                    className="w-full rounded-2xl overflow-hidden mb-4 relative"
                    style={{
                        aspectRatio: '16/10',
                        backgroundColor: 'var(--color-ucw-border)',
                        opacity: item.isAvailable ? 1 : 0.55,
                    }}
                >
                    <img
                        src={imageSrc || placeholder || MENU_IMAGE_PLACEHOLDER}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={useFallbackImage}
                    />

                    {item.isPopular && item.isAvailable && (
                        <div
                            className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white"
                            style={{ backgroundColor: 'var(--color-ucw-dark)' }}
                        >
                            Popular
                        </div>
                    )}

                    {!item.isAvailable && (
                        <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(245,243,240,0.6)' }}
                        >
                            <span
                                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                                style={{
                                    backgroundColor: 'white',
                                    color: 'var(--color-ucw-text-muted)',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                }}
                            >
                                Sold out
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3
                        className="font-bold leading-tight flex-1"
                        style={{
                            fontSize: '17px',
                            color: item.isAvailable
                                ? 'var(--color-ucw-text)'
                                : 'var(--color-ucw-text-muted)',
                        }}
                    >
                        {item.name}
                    </h3>

                    <span
                        className="font-bold shrink-0"
                        style={{ fontSize: '16px', color: 'var(--color-ucw-dark)' }}
                    >
                        {formatIDR(item.price)}
                    </span>
                </div>

                <p
                    className="leading-relaxed mb-1"
                    style={{
                        fontSize: '12.5px',
                        color: 'var(--color-ucw-text-muted)',
                        lineHeight: '1.6',
                    }}
                >
                    {item.description}
                </p>

                <p
                    className="uppercase tracking-wider mb-3"
                    style={{
                        fontSize: '10px',
                        color: 'var(--color-ucw-text-light)',
                        fontWeight: 600,
                    }}
                >
                    {item.subtitle}
                </p>

                {item.isAvailable &&
                    (qty > 0 ? (
                        <div className="flex items-center gap-3 mb-1">
                            <button
                                onClick={onRemove}
                                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg transition-transform active:scale-90"
                                style={{
                                    backgroundColor: 'var(--color-ucw-border)',
                                    color: 'var(--color-ucw-dark)',
                                }}
                            >
                                −
                            </button>

                            <span
                                className="font-bold text-base w-6 text-center"
                                style={{ color: 'var(--color-ucw-dark)' }}
                            >
                                {qty}
                            </span>

                            <button
                                onClick={onAdd}
                                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg transition-transform active:scale-90 text-white"
                                style={{ backgroundColor: 'var(--color-ucw-dark)' }}
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onAdd}
                            className="w-full h-11 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
                            style={{
                                backgroundColor: 'var(--color-ucw-bg-warm)',
                                color: 'var(--color-ucw-dark)',
                                border: '1px solid var(--color-ucw-border-dark)',
                            }}
                        >
                            Add to Cart
                        </button>
                    ))}
            </div>

            {!isLast && (
                <div
                    className="mt-5"
                    style={{
                        height: '1px',
                        backgroundColor: 'var(--color-ucw-border)',
                    }}
                />
            )}
        </div>
    );
}
