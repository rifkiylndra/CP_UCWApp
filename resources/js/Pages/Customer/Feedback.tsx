import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import CustomerLayout from '@/Components/Layout/CustomerLayout';

interface Props {
    tableId: string;
    orderId: string;
}

const ASPECTS = [
    { key: 'overall', label: 'Overall Experience' },
    { key: 'service', label: 'Service Speed' },
    { key: 'quality', label: 'Coffee Quality' },
    { key: 'ambiance', label: 'Ambiance' },
] as const;

function StarRow({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    return (
        <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    onClick={() => onChange(star)}
                    className="text-[28px] transition-transform active:scale-90"
                    style={{ opacity: star <= value ? 1 : 0.25 }}
                >
                    ★
                </button>
            ))}
        </div>
    );
}

export default function Feedback({ tableId, orderId }: Props) {
    const [ratings, setRatings] = useState({ overall: 0, service: 0, quality: 0, ambiance: 0 });
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    function handleRating(key: keyof typeof ratings, val: number) {
        setRatings(prev => ({ ...prev, [key]: val }));
    }

    function handleSubmit() {
        // POST to API in production
        setSubmitted(true);
        setTimeout(() => router.visit(route('customer.landing', { tableId })), 2500);
    }

    const avgRating = ratings.overall;

    if (submitted) {
        return (
            <>
                <Head title="Thank You!" />
                <CustomerLayout hideTopBar>
                    <div className="flex flex-col flex-1 items-center justify-center px-8 text-center">
                        <div className="text-6xl mb-6">🙏</div>
                        <h1 className="text-[28px] font-black tracking-tight mb-3" style={{ color: 'var(--color-ucw-text)' }}>
                            Thank you!
                        </h1>
                        <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-ucw-text-muted)' }}>
                            Your feedback helps us craft a better experience for every guest.
                        </p>
                        <div className="mt-8 flex items-center gap-2 text-[13px]" style={{ color: 'var(--color-ucw-text-muted)' }}>
                            <div className="w-4 h-4 border-2 rounded-full border-current animate-spin border-t-transparent" />
                            Redirecting...
                        </div>
                    </div>
                </CustomerLayout>
            </>
        );
    }

    return (
        <>
            <Head title="Share Feedback" />
            <CustomerLayout
                showBack
                backHref={route('customer.ready', { tableId, orderId })}
                title="Your Feedback"
            >
                <div className="flex flex-col flex-1 px-5 pt-4 pb-36">
                    <h2 className="text-[24px] font-black tracking-tight mb-1" style={{ color: 'var(--color-ucw-text)' }}>
                        How was your experience?
                    </h2>
                    <p className="text-[13px] mb-6" style={{ color: 'var(--color-ucw-text-muted)' }}>
                        Order #{orderId} · {avgRating > 0 ? `${avgRating}/5 ★` : 'Rate your visit'}
                    </p>

                    {/* Rating sections */}
                    <div className="flex flex-col gap-5 mb-6">
                        {ASPECTS.map(aspect => (
                            <div key={aspect.key} className="p-4 rounded-2xl"
                                style={{ backgroundColor: 'white', border: '1px solid var(--color-ucw-border)' }}>
                                <p className="text-[13px] font-semibold mb-3" style={{ color: 'var(--color-ucw-text)' }}>
                                    {aspect.label}
                                </p>
                                <StarRow
                                    value={ratings[aspect.key]}
                                    onChange={val => handleRating(aspect.key, val)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Written comment */}
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: 'white', border: '1px solid var(--color-ucw-border)' }}>
                        <p className="text-[13px] font-semibold mb-3" style={{ color: 'var(--color-ucw-text)' }}>
                            Tell us more (optional)
                        </p>
                        <textarea
                            rows={4}
                            placeholder="What did you love? What could we improve?"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            className="w-full text-[13px] resize-none rounded-xl p-3 outline-none"
                            style={{
                                backgroundColor: 'var(--color-ucw-bg)',
                                border: '1px solid var(--color-ucw-border)',
                                color: 'var(--color-ucw-text)',
                            }}
                        />
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                    style={{ background: 'linear-gradient(to top, var(--color-ucw-bg) 70%, transparent)' }}>
                    <button
                        onClick={handleSubmit}
                        disabled={ratings.overall === 0}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-semibold transition-all active:scale-[0.98]"
                        style={{
                            backgroundColor: ratings.overall > 0 ? 'var(--color-ucw-dark)' : 'var(--color-ucw-border)',
                            color: ratings.overall > 0 ? 'white' : 'var(--color-ucw-text-muted)',
                        }}
                    >
                        Submit Feedback
                    </button>
                </div>
            </CustomerLayout>
        </>
    );
}
