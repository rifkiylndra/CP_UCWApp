import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Components/Layout/CustomerLayout';

interface Props { tableId: string; }

export default function CashConfirmation({ tableId }: Props) {
    return (
        <>
            <Head title="Cash Payment" />
            <CustomerLayout
                showBack
                backHref={route('customer.payment', { tableId })}
                title="Pay with Cash"
                step={5}
            >
                <div className="flex flex-col flex-1 px-5 pt-6 pb-32">
                    {/* Amount Dark Card */}
                    <div className="p-6 rounded-3xl text-center mb-6"
                        style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                        <p className="text-white/50 text-[11px] uppercase tracking-widest mb-3">Amount to Pay</p>
                        <p className="text-white text-[48px] font-black leading-none mb-2">Rp 143.000</p>
                        <p className="text-white/40 text-[13px]">at the counter</p>
                    </div>

                    {/* Instructions */}
                    <div className="p-5 rounded-2xl mb-5"
                        style={{ backgroundColor: 'white', border: '1px solid var(--color-ucw-border)' }}>
                        <h3 className="text-[12px] uppercase tracking-widest font-semibold mb-4"
                            style={{ color: 'var(--color-ucw-text-muted)' }}>
                            Instructions
                        </h3>
                        {[
                            { step: '01', text: 'Go to the counter and show this screen to the cashier.' },
                            { step: '02', text: 'Your barista will prepare your order after payment is verified.' },
                            { step: '03', text: 'Wait for the notification — we\'ll call your table number.' },
                        ].map(s => (
                            <div key={s.step} className="flex gap-4 mb-4 last:mb-0">
                                <span className="text-[11px] font-black w-7 flex-none"
                                    style={{ color: 'var(--color-ucw-text-muted)' }}>{s.step}</span>
                                <p className="text-[13px] leading-relaxed"
                                    style={{ color: 'var(--color-ucw-text)' }}>{s.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Order ref */}
                    <div className="flex items-center justify-between p-4 rounded-xl"
                        style={{ backgroundColor: 'var(--color-ucw-bg-warm)', border: '1px dashed var(--color-ucw-border-dark)' }}>
                        <div>
                            <p className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-ucw-text-muted)' }}>Order Ref</p>
                            <p className="text-[18px] font-black" style={{ color: 'var(--color-ucw-dark)' }}>#ORD-8829</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-ucw-text-muted)' }}>Table</p>
                            <p className="text-[18px] font-black" style={{ color: 'var(--color-ucw-dark)' }}>{tableId}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                    style={{ background: 'linear-gradient(to top, var(--color-ucw-bg) 70%, transparent)' }}>
                    <Link
                        href={route('customer.status', { tableId, orderId: 'ORD-8829' })}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-semibold active:scale-[0.98] transition-transform"
                        style={{ backgroundColor: 'var(--color-ucw-dark)', color: 'white' }}
                    >
                        Verify & Track Order
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </CustomerLayout>
        </>
    );
}
