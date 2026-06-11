import { Head, Link } from "@inertiajs/react";
import CustomerLayout from "@/Components/Layout/CustomerLayout";
import TopBar from "@/Components/customer/navigation/TopBar";
import BottomNav from "@/Components/customer/navigation/BottomNav";
import CustomerDesktopHeader from "@/Components/customer/common/CustomerDesktopHeader";
import CheckoutSteps from "@/Components/customer/common/CheckoutSteps";
import {
    AddMoreLink,
    CartEmptyState,
    CartItemList,
    CartSummaryCard,
    CheckoutButton,
    MiniCartItemList,
} from "@/Components/customer/cart/CartBlocks";
import { useCart } from "@/hooks/useCart";

interface Props {
    tableId: string;
    tableNumber?: string;
}

export default function Cart({ tableId, tableNumber = "" }: Props) {
    const { items, subtotal, total, totalItems, adjustQuantity, updateNotes, tableNumber: storedTableNumber } = useCart();
    const displayTableNumber = storedTableNumber || tableNumber;
    const subtitle = displayTableNumber ? `Table ${displayTableNumber} • Dine In` : "Review your items";

    // adjust() and updateNotes() are now handled by useCart()

    if (items.length === 0) {
        return (
            <>
                <Head title="Your Cart — UCW" />

                <CustomerLayout hideTopBar>
                    <div className="md:hidden min-h-svh flex flex-col">
                        <TopBar
                            tableId={tableId}
                            title="Review Order"
                            subtitle={subtitle}
                            showBack
                            backHref={route("customer.menu")}
                        />

                        <CartEmptyState tableId={tableId} />

                        <div
                            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40"
                            style={{ backgroundColor: "var(--color-ucw-bg)" }}
                        >
                            <BottomNav tableId={tableId} active="cart" cartCount={0} />
                        </div>
                    </div>

                    <div
                        className="hidden md:flex h-svh max-h-svh overflow-hidden"
                        style={{ backgroundColor: "#E8E1D8" }}
                    >
                        <main className="flex-1 flex flex-col">
                            <CustomerDesktopHeader
                                tableId={tableId}
                                title="Review Order"
                                subtitle={subtitle}
                                backHref={route("customer.menu")}
                                active="cart"
                            />

                            <CartEmptyState tableId={tableId} desktop />
                        </main>
                    </div>
                </CustomerLayout>
            </>
        );
    }

    return (
        <>
            <Head title="Your Cart — UCW" />

            <CustomerLayout hideTopBar>
                {/* MOBILE */}
                <div
                    className="md:hidden min-h-svh flex flex-col"
                    style={{ backgroundColor: "var(--color-ucw-bg)" }}
                >
                    <TopBar
                        tableId={tableId}
                        title="Review Order"
                        subtitle={subtitle}
                        showBack
                        backHref={route("customer.menu")}
                    />

                    <div className="flex flex-col flex-1 pb-52">
                        <div className="px-5 pt-4 pb-3">
                            <CheckoutSteps activeStep={1} />

                            <h1
                                className="font-black text-2xl leading-tight mt-6"
                                style={{ color: "var(--color-ucw-dark)" }}
                            >
                                Review your selection
                            </h1>

                            <p
                                className="mt-1 font-semibold uppercase tracking-[0.14em]"
                                style={{
                                    fontSize: "10px",
                                    color: "var(--color-ucw-text-muted)",
                                }}
                            >
                                YOUR MORNING RITUAL, CURATED
                            </p>
                        </div>

                        <div className="flex flex-col px-5">
                            <CartItemList
                                items={items}
                                onAdjust={adjustQuantity}
                                onUpdateNotes={updateNotes}
                            />
                        </div>

                        <AddMoreLink tableId={tableId} className="mx-5 mt-2" />

                        <CartSummaryCard
                            subtotal={subtotal}
                            total={total}
                            className="mx-5 mt-6"
                        />
                    </div>

                    <div
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40"
                        style={{ backgroundColor: "var(--color-ucw-bg)" }}
                    >
                        <div className="px-5 pt-4 pb-2">
                            <CheckoutButton tableId={tableId} />
                        </div>

                        <BottomNav
                            tableId={tableId}
                            active="cart"
                            cartCount={totalItems}
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
                            title="Review Order"
                            subtitle={subtitle}
                            backHref={route("customer.menu")}
                            active="cart"
                        />

                        <div className="flex-1 w-full max-w-3xl mx-auto px-8 lg:px-10 py-8">
                            <CheckoutSteps activeStep={1} />

                            <div className="mt-8 mb-8">
                                <h1
                                    className="font-black leading-tight mb-1"
                                    style={{
                                        fontSize: "30px",
                                        color: "var(--color-ucw-dark)",
                                    }}
                                >
                                    Review your selection
                                </h1>

                                <p
                                    className="font-semibold uppercase tracking-[0.14em]"
                                    style={{
                                        fontSize: "10px",
                                        color: "var(--color-ucw-text-muted)",
                                    }}
                                >
                                    YOUR MORNING RITUAL, CURATED
                                </p>
                            </div>

                            <div
                                className="rounded-[28px] px-6"
                                style={{
                                    backgroundColor: "var(--color-ucw-bg)",
                                    border: "1px solid var(--color-ucw-border)",
                                }}
                            >
                                <CartItemList
                                    items={items}
                                    onAdjust={adjustQuantity}
                                    onUpdateNotes={updateNotes}
                                    desktop
                                />
                            </div>

                            <AddMoreLink tableId={tableId} className="mt-5" />
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
                                Order Summary
                            </h2>

                            <p
                                className="text-xs"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                {displayTableNumber ? `Table ${displayTableNumber} · ` : ""}{totalItems} item
                                {totalItems !== 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4">
                            <MiniCartItemList items={items} />
                        </div>

                        <div
                            className="px-8 pb-8"
                            style={{
                                borderTop: "1px solid var(--color-ucw-border)",
                                paddingTop: "20px",
                            }}
                        >
                            <CartSummaryCard subtotal={subtotal} total={total} compact />

                            <div className="mt-6">
                                <CheckoutButton tableId={tableId} />
                            </div>

                            <Link
                                href={route("customer.menu")}
                                className="w-full flex items-center justify-center mt-3 h-10 rounded-xl text-sm font-medium transition-opacity active:opacity-60"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                ← Continue shopping
                            </Link>
                        </div>
                    </aside>
                </div>
            </CustomerLayout>
        </>
    );
}
