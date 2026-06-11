import { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import CustomerLayout from "@/Components/Layout/CustomerLayout";
import TopBar from "@/Components/customer/navigation/TopBar";
import CustomerDesktopHeader from "@/Components/customer/common/CustomerDesktopHeader";
import CheckoutSteps from "@/Components/customer/common/CheckoutSteps";
import {
    EstimateHeader,
    EstimateInfoCard,
    EstimateOrderError,
    EstimateOrderSummary,
    EstimatePaymentButton,
    EstimatePriceSummary,
    EstimateResultCard,
    EstimateTrustNote,
    MiniEstimateItemList,
} from "@/Components/customer/estimate/EstimateBlocks";
import { useCart } from "@/hooks/useCart";

interface Props {
    tableId: string;
    tableNumber?: string;
}

export default function Estimate({
    tableId,
    tableNumber: initialTableNumber = "",
}: Props) {
    const {
        items,
        subtotal,
        total,
        totalItems,
        customerName,
        orderType,
        tableNumber,
    } = useCart();
    
    const [estimatedMinMin, setEstimatedMinMin] = useState<number>(10);
    const [estimatedMinMax, setEstimatedMinMax] = useState<number>(15);
    const [isLoadingEstimate, setIsLoadingEstimate] = useState(true);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const displayTableNumber = tableNumber || initialTableNumber;

    const handleCreateOrder = async () => {
        if (isCreatingOrder) return;
        setIsCreatingOrder(true);
        setErrorMessage("");

        try {
            const payload = {
                table_number: orderType === "dine_in" ? tableNumber.trim() : null,
                customer_name: customerName.trim() || null,
                order_type: orderType || 'dine_in',
                items: items.map(i => ({
                    menu_id: Number(i.menuId || i.id),
                    quantity: i.quantity,
                    note: i.notes?.trim() || null
                }))
            };
            
            const res = await axios.post('/customer/order', payload);
            if (res.data.success && res.data.redirect_url) {
                sessionStorage.setItem(`ucw-order-${res.data.order_id}`, JSON.stringify(res.data));
                window.location.href = res.data.redirect_url;
            } else {
                setErrorMessage(res.data.message || "Order could not be created.");
                setIsCreatingOrder(false);
            }
        } catch (error) {
            console.error("Order error", error);
            if (axios.isAxiosError(error)) {
                const errors = error.response?.data?.errors;
                const firstError = errors ? Object.values(errors).flat()[0] : null;
                setErrorMessage(
                    String(firstError || error.response?.data?.message || "Order could not be created. Please check your details.")
                );
            } else {
                setErrorMessage("Order could not be created. Please try again.");
            }
            setIsCreatingOrder(false);
        }
    };

    useEffect(() => {
        if (items.length === 0) return;
        
        axios.post('/customer/api/estimate', {
            items: items.map(i => ({ menu_id: Number(i.menuId || i.id), quantity: i.quantity }))
        })
        .then(res => {
            if (res.data) {
                setEstimatedMinMin(res.data.estimated_min_time || 10);
                setEstimatedMinMax(res.data.estimated_max_time || 15);
            }
        })
        .catch(err => console.error("Failed to fetch estimate", err))
        .finally(() => setIsLoadingEstimate(false));
    }, [items]);

    return (
        <>
            <Head title="Order Confirmation — UCW" />

            <CustomerLayout hideTopBar>
                {/* MOBILE */}
                <div
                    className="md:hidden min-h-svh flex flex-col"
                    style={{ backgroundColor: "var(--color-ucw-bg)" }}
                >
                    <TopBar
                        tableId={tableId}
                        title="Confirm Order"
                        subtitle={`${orderType === "takeaway" ? "Takeaway" : displayTableNumber ? `Table ${displayTableNumber}` : "Dine In"} • ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
                        showBack
                        backHref={route("customer.order-type")}
                    />

                    <div className="flex flex-col flex-1 px-5 pb-36">
                        <div className="pt-4 pb-6">
                            <CheckoutSteps activeStep={3} />
                            <EstimateHeader />
                        </div>

                        <EstimateResultCard
                            minMin={estimatedMinMin}
                            minMax={estimatedMinMax}
                            isLoading={isLoadingEstimate}
                        />

                        <EstimateOrderSummary
                            items={items}
                            className="mt-6"
                        />

                        <EstimatePriceSummary
                            subtotal={subtotal}
                            total={total}
                            className="mt-6"
                        />
                    </div>

                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                        style={{
                            background:
                                "linear-gradient(to top, var(--color-ucw-bg) 65%, transparent)",
                        }}
                    >
                        {errorMessage && <EstimateOrderError message={errorMessage} />}
                        <EstimatePaymentButton onClick={handleCreateOrder} isLoading={isCreatingOrder} />
                        <EstimateTrustNote />
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
                            title="Confirm Order"
                            subtitle={`${orderType === "takeaway" ? "Takeaway" : displayTableNumber ? `Table ${displayTableNumber}` : "Dine In"} • Review estimate`}
                            backHref={route("customer.order-type")}
                            active="cart"
                        />

                        <div className="flex-1 max-w-4xl mx-auto w-full px-8 lg:px-10 py-8">
                            <CheckoutSteps activeStep={3} />

                            <div className="mt-8">
                                <EstimateHeader desktop />
                            </div>

                            <div className="mt-7 max-w-xl">
                                <EstimateResultCard
                                    minMin={estimatedMinMin}
                                    minMax={estimatedMinMax}
                                    isLoading={isLoadingEstimate}
                                    desktop
                                />
                                <EstimateInfoCard />
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
                                borderBottom:
                                    "1px solid var(--color-ucw-border)",
                            }}
                        >
                            <h2
                                className="font-black text-xl mb-0.5"
                                style={{ color: "var(--color-ucw-dark)" }}
                            >
                                Payment Summary
                            </h2>

                            <p
                                className="text-xs leading-relaxed"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                Ready in {estimatedMinMin}–{estimatedMinMax}{" "}
                                minutes. Review your total before payment.
                            </p>
                        </div>

                        <div className="flex-1 px-8 py-6">
                            <MiniEstimateItemList items={items} />
                        </div>

                        <div
                            className="px-8 pb-8"
                            style={{
                                borderTop: "1px solid var(--color-ucw-border)",
                                paddingTop: "20px",
                            }}
                        >
                            <EstimatePriceSummary
                                subtotal={subtotal}
                                total={total}
                                compact
                            />

                            <div className="mt-6">
                                <EstimatePaymentButton onClick={handleCreateOrder} isLoading={isCreatingOrder} />
                                {errorMessage && <EstimateOrderError message={errorMessage} />}
                                <EstimateTrustNote />
                            </div>

                            <Link
                                href={route("customer.cart")}
                                className="w-full flex items-center justify-center mt-3 h-10 text-sm font-medium"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                ← Edit basket
                            </Link>
                        </div>
                    </aside>
                </div>
            </CustomerLayout>
        </>
    );
}
