import type { MenuItem } from '@/types/customer';
import { formatIDR } from '@/lib/currency';
import { firstImageUrl, MENU_IMAGE_PLACEHOLDER, useFallbackImage } from '@/lib/images';

interface Props {
    item: MenuItem;
    qty: number;
    onAdd: () => void;
    onRemove: () => void;
    placeholder: string;
}

export default function MenuCardDesktop({
    item,
    qty,
    onAdd,
    onRemove,
    placeholder,
}: Props) {
    const imageSrc = firstImageUrl(item.imageUrl, item.image_url, item.image);

    return (
        <div
            className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5"
            style={{
                background: 'var(--color-ucw-bg)',
                border: '1px solid var(--color-ucw-border)',
            }}
        >
            <div
                className="relative"
                style={{
                    aspectRatio: '4/3',
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
                        className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider text-white"
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
                            className="px-3 py-1 rounded-full text-xs font-semibold"
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

            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3
                        className="font-bold leading-tight flex-1"
                        style={{
                            fontSize: '14px',
                            color: item.isAvailable
                                ? 'var(--color-ucw-text)'
                                : 'var(--color-ucw-text-muted)',
                        }}
                    >
                        {item.name}
                    </h3>

                    <span
                        className="font-bold shrink-0 text-sm"
                        style={{ color: 'var(--color-ucw-dark)' }}
                    >
                        {formatIDR(item.price)}
                    </span>
                </div>

                <p
                    className="text-xs leading-relaxed mb-1"
                    style={{
                        color: 'var(--color-ucw-text-muted)',
                        lineHeight: '1.55',
                    }}
                >
                    {item.description}
                </p>

                <p
                    className="uppercase tracking-wider mb-3"
                    style={{
                        fontSize: '9px',
                        color: 'var(--color-ucw-text-light)',
                        fontWeight: 600,
                    }}
                >
                    {item.subtitle}
                </p>

                <div className="mt-auto">
                    {item.isAvailable &&
                        (qty > 0 ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={onRemove}
                                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-transform active:scale-90"
                                    style={{
                                        backgroundColor: 'var(--color-ucw-border)',
                                        color: 'var(--color-ucw-dark)',
                                        fontSize: '16px',
                                    }}
                                >
                                    −
                                </button>

                                <span
                                    className="font-bold text-sm w-5 text-center"
                                    style={{ color: 'var(--color-ucw-dark)' }}
                                >
                                    {qty}
                                </span>

                                <button
                                    onClick={onAdd}
                                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-transform active:scale-90"
                                    style={{
                                        backgroundColor: 'var(--color-ucw-dark)',
                                        fontSize: '16px',
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={onAdd}
                                className="w-full h-9 rounded-xl font-semibold text-xs transition-all active:scale-[0.97]"
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
            </div>
        </div>
    );
}
