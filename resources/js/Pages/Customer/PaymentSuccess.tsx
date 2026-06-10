import { Head, Link } from "@inertiajs/react";
import CustomerLayout from "@/Components/Layout/CustomerLayout";

interface Props {
    order: {
        id: number;
        order_ref?: string;
    };
}

export default function PaymentSuccess({ order }: Props) {
    const orderRef = order.order_ref || String(order.id);

    return (
        <CustomerLayout hideTopBar>
            <Head title="Payment Success - UCW" />
            <div className="flex min-h-svh items-center justify-center bg-[#F5F3F0] px-5 text-[#2D1A0E]">
                <section className="w-full max-w-md rounded-2xl border border-[#E8E2DB] bg-white p-6 text-center shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5E735B]">
                        Payment Received
                    </p>
                    <h1 className="mt-3 text-2xl font-black">Thank you</h1>
                    <p className="mt-2 text-sm text-[#8B7B6B]">
                        Your payment was processed for order #{orderRef}.
                    </p>
                    <Link
                        href={route("customer.order.status", { order: orderRef })}
                        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#2D1A0E] px-5 text-sm font-bold text-white"
                    >
                        View Order Status
                    </Link>
                </section>
            </div>
        </CustomerLayout>
    );
}
