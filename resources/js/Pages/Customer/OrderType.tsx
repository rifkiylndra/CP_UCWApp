import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import CustomerLayout from "@/Components/Layout/CustomerLayout";
import TopBar from "@/Components/customer/navigation/TopBar";
import CustomerDesktopHeader from "@/Components/customer/common/CustomerDesktopHeader";
import CheckoutSteps from "@/Components/customer/common/CheckoutSteps";
import OrderTypeActions from "@/Components/customer/order-type/OrderTypeActions";
import {
    DineInCard as OrderTypeDineInCard,
    TakeawayCard as OrderTypeTakeawayCard,
} from "@/Components/customer/order-type/OrderTypeCard";
import OrderTypeExpectationTips from "@/Components/customer/order-type/ExpectationTips";
import SelectedOrderTypeSummary from "@/Components/customer/order-type/SelectedOrderTypeSummary";
import { useCart } from "@/hooks/useCart";

interface Props {
    tableId: string;
    tableNumber?: string;
    cartCount?: number;
}

export default function OrderTypePage({
    tableId,
    tableNumber: initialTableNumber = "",
}: Props) {
    const {
        orderType,
        setOrderType,
        customerName,
        setCustomerName,
        tableNumber,
        setTableNumber,
    } = useCart();
    const [nameError, setNameError] = useState("");
    const [tableNumberError, setTableNumberError] = useState("");

    const displayTableNumber = tableNumber || initialTableNumber;

    const selected = orderType === 'takeaway' ? 'takeaway' : (orderType === 'dine_in' ? 'dine-in' : null);

    function handleConfirm() {
        if (!selected) return;

        if (selected === "dine-in" && !tableNumber.trim()) {
            setTableNumberError("Please enter your table number.");
            return;
        }

        if (selected === "takeaway" && !customerName.trim()) {
            setNameError("Please enter your name.");
            return;
        }

        setNameError("");
        setTableNumberError("");
        router.visit(route("customer.estimate"));
    }

    return (
        <>
            <Head title="Order Details — UCW" />

            <CustomerLayout hideTopBar>
                {/* MOBILE */}
                <div
                    className="md:hidden min-h-svh flex flex-col"
                    style={{ backgroundColor: "var(--color-ucw-bg)" }}
                >
                    <TopBar
                        tableId={tableId}
                        title="Order Details"
                        subtitle={displayTableNumber ? `Table ${displayTableNumber} • Dine In` : "Choose order type"}
                        showBack
                        backHref={route("customer.cart")}
                    />

                    <div className="flex flex-col flex-1 px-5 pb-36">
                        <div className="pt-4 pb-6">
                            <CheckoutSteps activeStep={2} />
                            <PageHeading />
                        </div>

                        <div className="flex flex-col gap-3">
                            <OrderTypeDineInCard
                                selected={selected === "dine-in"}
                                tableNumber={tableNumber}
                                tableNumberError={tableNumberError}
                                onSelect={() => {
                                    setOrderType("dine_in");
                                    setNameError("");
                                    setTableNumberError("");
                                }}
                                onTableNumberChange={(value) => {
                                    setTableNumber(value);
                                    setTableNumberError("");
                                }}
                            />

                            <OrderTypeTakeawayCard
                                selected={selected === "takeaway"}
                                name={customerName}
                                nameError={nameError}
                                onSelect={() => {
                                    setOrderType("takeaway");
                                    setNameError("");
                                    setTableNumberError("");
                                }}
                                onNameChange={(value) => {
                                    setCustomerName(value);
                                    setNameError("");
                                }}
                            />
                        </div>

                        
                    </div>

                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-8 pt-4 z-50"
                        style={{
                            background:
                                "linear-gradient(to top, var(--color-ucw-bg) 65%, transparent)",
                        }}
                    >
                        <OrderTypeActions
                            selected={selected}
                            onConfirm={handleConfirm}
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
                            title="Order Details"
                            subtitle={displayTableNumber ? `Table ${displayTableNumber} • Choose order type` : "Choose order type"}
                            backHref={route("customer.cart")}
                            active="cart"
                        />

                        <div className="flex-1 max-w-4xl mx-auto w-full px-8 lg:px-10 py-8">
                            <CheckoutSteps activeStep={2} />

                            <div className="mt-8">
                                <PageHeading desktop />
                            </div>

                            <div className="grid grid-cols-2 gap-5 mt-6">
                                <OrderTypeDineInCard
                                    selected={selected === "dine-in"}
                                    tableNumber={tableNumber}
                                    tableNumberError={tableNumberError}
                                    onSelect={() => {
                                        setOrderType("dine_in");
                                        setNameError("");
                                        setTableNumberError("");
                                    }}
                                    onTableNumberChange={(value) => {
                                        setTableNumber(value);
                                        setTableNumberError("");
                                    }}
                                    desktop
                                />

                                <OrderTypeTakeawayCard
                                    selected={selected === "takeaway"}
                                    name={customerName}
                                    nameError={nameError}
                                    onSelect={() => {
                                        setOrderType("takeaway");
                                        setNameError("");
                                        setTableNumberError("");
                                    }}
                                    onNameChange={(value) => {
                                        setCustomerName(value);
                                        setNameError("");
                                    }}
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
                                Order Details
                            </h2>

                            <p
                                className="text-xs leading-relaxed"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                Step 2 of 3 — Choose how you would like to receive
                                your order.
                            </p>
                        </div>

                        <div className="flex-1 px-8 py-6 flex flex-col gap-5">
                            <SelectedOrderTypeSummary
                                selected={selected as 'dine-in' | 'takeaway' | null}
                                tableNumber={displayTableNumber}
                                name={customerName}
                            />

                            <OrderTypeExpectationTips selected={selected as 'dine-in' | 'takeaway' | null} />
                        </div>

                        <div className="px-8 pb-8">
                            <OrderTypeActions
                                selected={selected}
                                onConfirm={handleConfirm}
                            />

                            <Link
                                href={route("customer.cart")}
                                className="w-full flex items-center justify-center mt-3 h-10 text-sm font-medium"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                ← Back to cart
                            </Link>
                        </div>
                    </aside>
                </div>
            </CustomerLayout>
        </>
    );
}

function PageHeading({ desktop = false }: { desktop?: boolean }) {
    return (
        <div>
            <p
                className="font-semibold uppercase tracking-[0.15em] mb-2"
                style={{
                    fontSize: "10px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                ORDER DETAILS
            </p>

            <h1
                className="font-black leading-[1.1] tracking-tight"
                style={{
                    fontSize: desktop ? "34px" : "30px",
                    color: "var(--color-ucw-dark)",
                }}
            >
                How would you like
                <br />
                to enjoy your coffee?
            </h1>

            <p
                className="mt-3 leading-relaxed max-w-[440px]"
                style={{
                    fontSize: desktop ? "14px" : "13px",
                    color: "var(--color-ucw-text-muted)",
                }}
            >
                Choose dine-in if you want your order delivered to the table, or
                takeaway if you prefer to pick it up by name.
            </p>
        </div>
    );
}
