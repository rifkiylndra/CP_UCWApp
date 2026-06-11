import { Head, Link, router } from "@inertiajs/react";
import CustomerLayout from "@/Components/Layout/CustomerLayout";
import TopBar from "@/Components/customer/navigation/TopBar";
import BottomNav from "@/Components/customer/navigation/BottomNav";
import CustomerDesktopHeader from "@/Components/customer/common/CustomerDesktopHeader";
import {
    CashAmountDueCard,
    CashAssistanceNote,
    CashConfirmationHeader,
    CashIdentifyCard,
    CashInstructionCard,
    CashPaymentSummary,
    CashStatusCard,
    CashTrackButton,
} from "@/Components/customer/payment/CashConfirmationBlocks";
import { formatIDR } from "@/lib/formatters";
import type { PaymentStatus } from "@/types/customer";

interface Props {
    tableId: string;
    orderId?: string;
    orderRef?: string;
    total?: number;
    orderTime?: string;
    tableNumber?: string;
    cartCount?: number;
    paymentStatus?: PaymentStatus;
}

function readStoredPayment(orderId?: string) {
    if (!orderId || typeof window === "undefined") return {};

    try {
        return JSON.parse(sessionStorage.getItem(`ucw-payment-${orderId}`) || "{}");
    } catch {
        return {};
    }
}

import { useEffect } from "react";

function nowTime() {
    return new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function CashConfirmation({
    tableId,
    orderId,
    orderRef,
    total,
    orderTime = nowTime(),
    tableNumber = "",
    cartCount = 0,
    paymentStatus = "waiting_verification",
}: Props) {
    const stored = readStoredPayment(orderId);
    const resolvedOrderId = String(orderId || stored.orderId || "");
    const resolvedOrderRef = orderRef || stored.orderRef || "-";
    const resolvedTotal = total ?? stored.total ?? stored.total_price ?? 0;
    const resolvedPaymentStatus = paymentStatus || stored.payment_status || "waiting_verification";

    useEffect(() => {
        if (resolvedPaymentStatus === "paid") {
            router.visit(route("customer.status", { order: resolvedOrderRef }));
            return;
        }

        if (!resolvedOrderId || typeof window === "undefined") return;

        const echo = (window as any).Echo;
        if (echo) {
            const channel = echo.private(`order.${resolvedOrderId}`);
            channel.listen('.payment.status.updated', (e: { payment_status?: PaymentStatus }) => {
                if (e.payment_status === "paid") {
                    router.visit(route("customer.status", { order: resolvedOrderRef }));
                }
            });
            channel.listen('.order.status.updated', (e: { order_status?: string }) => {
                if (e.order_status === "processing" || e.order_status === "completed") {
                    router.visit(route("customer.status", { order: resolvedOrderRef }));
                }
            });

            return () => {
                channel.stopListening('.payment.status.updated');
                channel.stopListening('.order.status.updated');
                echo.leave(`order.${resolvedOrderId}`);
            };
        }
    }, [resolvedOrderId, resolvedOrderRef, resolvedPaymentStatus]);

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['paymentStatus'] });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="Cash Payment — UCW" />

            <CustomerLayout hideTopBar>
                {/* MOBILE */}
                <div
                    className="md:hidden min-h-svh flex flex-col"
                    style={{ backgroundColor: "var(--color-ucw-bg)" }}
                >
                    <TopBar
                        tableId={tableId}
                        title="Cash Payment"
                        subtitle={tableNumber ? `Table ${tableNumber} • ${formatIDR(resolvedTotal)}` : formatIDR(resolvedTotal)}
                        showBack
                        backHref={route("customer.payment", { order: resolvedOrderRef })}
                    />

                    <div className="flex flex-col flex-1 px-5 pb-36">
                        <CashConfirmationHeader total={resolvedTotal} orderRef={resolvedOrderRef} />

                        <div className="flex flex-col gap-3 mt-6">
                            <CashIdentifyCard orderRef={resolvedOrderRef} />
                            <CashPaymentSummary
                                orderRef={resolvedOrderRef}
                                orderTime={orderTime}
                                total={resolvedTotal}
                                tableNumber={tableNumber}
                            />
                        </div>

                        <CashInstructionCard
                            orderRef={resolvedOrderRef}
                            total={resolvedTotal}
                            className="mt-7"
                        />

                        <CashAssistanceNote className="mt-7 text-center" />

                        <div
                            className="rounded-3xl overflow-hidden mt-6"
                            style={{ height: "170px" }}
                        >
                            
                        </div>
                    </div>

                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40"
                        style={{ backgroundColor: "var(--color-ucw-bg)" }}
                    >
                        <div className="px-5 pt-4 pb-2">
                            <CashTrackButton orderRef={resolvedOrderRef} />
                        </div>

                        <BottomNav
                            tableId={tableId}
                            active="track"
                            cartCount={cartCount}
                        />
                    </div>
                </div>

                {/* DESKTOP */}
                <div
                    className="hidden md:flex h-svh max-h-svh overflow-hidden"
                    style={{ backgroundColor: "#E8E1D8" }}
                >
                    <main className="flex-1 overflow-y-auto flex flex-col">
                        <CustomerDesktopHeader
                            tableId={tableId}
                            title="Cash Payment"
                            subtitle={tableNumber ? `Table ${tableNumber} • Pay at cashier` : "Pay at cashier"}
                            backHref={route("customer.payment", { order: resolvedOrderRef })}
                            active="track"
                        />

                        <div className="flex-1 max-w-4xl mx-auto w-full px-8 lg:px-10 py-8">
                            <CashConfirmationHeader total={resolvedTotal} orderRef={resolvedOrderRef} desktop />

                            <div className="grid grid-cols-2 gap-5 mt-7">
                                <CashIdentifyCard orderRef={resolvedOrderRef} desktop />
                                <CashPaymentSummary
                                    orderRef={resolvedOrderRef}
                                    orderTime={orderTime}
                                    total={resolvedTotal}
                                    tableNumber={tableNumber}
                                    desktop
                                />
                            </div>

                            
                        </div>
                    </main>

                    <aside
                        className="w-[360px] shrink-0 sticky top-0 h-svh overflow-y-auto flex flex-col"
                        style={{
                            background: "var(--color-ucw-bg)",
                            borderLeft: "1px solid var(--color-ucw-border)",
                        }}
                    >
                        <div
                            className="px-8 pt-8 pb-5"
                            style={{
                                borderBottom: "1px solid var(--color-ucw-border)",
                            }}
                        >
                            <h2
                                className="font-black text-xl mb-0.5"
                                style={{ color: "var(--color-ucw-dark)" }}
                            >
                                Cash Payment
                            </h2>

                            <p
                                className="text-xs leading-relaxed"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                Please complete your payment at the cashier counter.
                            </p>
                        </div>

                        <div className="flex-1 px-8 py-6 flex flex-col gap-5">
                            <CashStatusCard status={resolvedPaymentStatus} />
                            <CashAmountDueCard
                                total={resolvedTotal}
                                orderRef={resolvedOrderRef}
                            />

                            <CashInstructionCard
                                orderRef={resolvedOrderRef}
                                total={resolvedTotal}
                                compact
                            />

                            <CashAssistanceNote />
                        </div>

                        <div className="px-8 pb-8">
                            <CashTrackButton orderRef={resolvedOrderRef} />

                            <Link
                                href={route("customer.payment", { order: resolvedOrderRef })}
                                className="w-full flex items-center justify-center mt-3 h-10 text-sm font-medium"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                ← Change payment method
                            </Link>
                        </div>
                    </aside>
                </div>
            </CustomerLayout>
        </>
    );
}
