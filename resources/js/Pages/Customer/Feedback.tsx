import { useEffect, useState } from "react";
import {
    FeedbackError,
    FeedbackHero,
    FeedbackTextarea,
    InfoCard,
    StarRating,
    SubmitSection,
    ThankYouScreen,
} from "@/Components/customer/feedback/FeedbackBlocks";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import CustomerLayout from "@/Components/Layout/CustomerLayout";
import TopBar from "@/Components/customer/navigation/TopBar";
import CustomerDesktopHeader from "@/Components/customer/common/CustomerDesktopHeader";

interface Props {
    tableId: string;
    orderId: string;
    orderRef?: string;
    tableNumber?: string;
    visitTime?: string;
    orderStatus?: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";
}


export default function Feedback({
    tableId,
    orderId,
    orderRef = "-",
    tableNumber = "",
    visitTime = "10:45 AM",
    orderStatus,
}: Props) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (orderStatus && orderStatus !== "completed") {
            router.visit(route("customer.status", { order: orderRef }));
        }
    }, [orderStatus, orderRef]);

    async function handleSubmit() {
        setErrorMessage("");

        try {
            await axios.post(`/customer/order/${encodeURIComponent(orderRef)}/complete-transaction`, {
                rating: rating > 0 ? rating : null,
                comment: comment.trim() || null,
            });

            setSubmitted(true);

            setTimeout(() => {
                router.visit(route("customer.landing"));
            }, 2200);
        } catch (error: unknown) {
            let message = "Feedback could not be submitted. Please try again.";
            if (typeof error === "object" && error !== null && "response" in error) {
                const responseData = (error as any).response?.data;
                if (responseData?.errors && typeof responseData.errors === "object") {
                    const firstErrorKey = Object.keys(responseData.errors)[0];
                    message = responseData.errors[firstErrorKey][0];
                } else if (typeof responseData?.message === "string") {
                    message = responseData.message;
                } else {
                    message = `Server Error: ${JSON.stringify(responseData)}`;
                }
            } else if (error instanceof Error) {
                message = `Error: ${error.message}`;
            }

            setErrorMessage(message);
        }
    }

    function handleReturnHome() {
        router.visit(route("customer.landing"));
    }

    if (submitted) {
        return (
            <>
                <Head title="Thank You — UCW" />

                <CustomerLayout hideTopBar>
                    <ThankYouScreen onReturnHome={handleReturnHome} />
                </CustomerLayout>
            </>
        );
    }

    return (
        <>
            <Head title="Share Feedback — UCW" />

            <CustomerLayout hideTopBar>
                {/* MOBILE */}
                <div
                    className="md:hidden min-h-svh flex flex-col"
                    style={{ backgroundColor: "var(--color-ucw-bg)" }}
                >
                    <TopBar
                        tableId={tableId}
                        title="Feedback"
                        subtitle={`Order #${orderRef}`}
                        showBack
                        backHref={route("customer.status", {
                            order: orderRef,
                        })}
                    />

                    <div className="flex-1 px-5 pb-8">
                        <FeedbackHero />

                        <div className="mt-8">
                            <p
                                className="font-bold mb-4 text-center"
                                style={{
                                    fontSize: "16px",
                                    color: "var(--color-ucw-text-muted)",
                                }}
                            >
                                Rate your experience (optional)
                            </p>

                            <StarRating value={rating} onChange={setRating} />
                        </div>

                        <FeedbackTextarea
                            value={comment}
                            onChange={setComment}
                            className="mt-9"
                        />

                        {errorMessage && <FeedbackError message={errorMessage} />}

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <InfoCard
                                label="ORDER"
                                value={`#${orderRef}`}
                                subValue={tableNumber ? `Table ${tableNumber}` : "Takeaway"}
                                type="order"
                            />

                            <InfoCard
                                label="VISIT TIME"
                                value={visitTime}
                                subValue="Today"
                                type="time"
                            />
                        </div>

                        <SubmitSection
                            hasFeedback={rating > 0 || comment.trim().length > 0}
                            onSubmit={handleSubmit}
                            onReturnHome={handleReturnHome}
                            className="mt-9"
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
                            title="Feedback"
                            subtitle={`Order #${orderRef}`}
                            backHref={route("customer.status", {
                                order: orderRef,
                            })}
                            active="track"
                        />

                        <div className="flex-1 max-w-4xl mx-auto w-full px-8 lg:px-10 py-8">
                            <div className="grid grid-cols-[1.05fr_0.95fr] gap-6">
                                <div className="flex flex-col gap-6">
                                    <FeedbackHero desktop />

                                    <div
                                        className="rounded-3xl p-6"
                                        style={{
                                            backgroundColor: "white",
                                            border: "1px solid var(--color-ucw-border)",
                                        }}
                                    >
                                        <p
                                            className="font-semibold uppercase tracking-[0.14em] mb-4"
                                            style={{
                                                fontSize: "10px",
                                                color: "var(--color-ucw-text-muted)",
                                            }}
                                        >
                                            YOUR RATING (OPTIONAL)
                                        </p>

                                        <StarRating
                                            value={rating}
                                            onChange={setRating}
                                            desktop
                                        />
                                    </div>

                                    <FeedbackTextarea
                                        value={comment}
                                        onChange={setComment}
                                    />

                                    {errorMessage && <FeedbackError message={errorMessage} />}
                                </div>

                                <aside className="flex flex-col gap-5">
                                    <div
                                        className="rounded-3xl p-6"
                                        style={{
                                            backgroundColor: "white",
                                            border: "1px solid var(--color-ucw-border)",
                                        }}
                                    >
                                        <h2
                                            className="font-black mb-2"
                                            style={{
                                                fontSize: "22px",
                                                color: "var(--color-ucw-dark)",
                                            }}
                                        >
                                            Share your feedback
                                        </h2>

                                        <p
                                            className="leading-relaxed"
                                            style={{
                                                fontSize: "13px",
                                                color: "var(--color-ucw-text-muted)",
                                            }}
                                        >
                                            Your feedback helps us improve the
                                            coffee, service, and workspace
                                            experience for every guest. You can
                                            also skip this step.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoCard
                                            label="ORDER"
                                            value={`#${orderRef}`}
                                            subValue={tableNumber ? `Table ${tableNumber}` : "Takeaway"}
                                            type="order"
                                        />

                                        <InfoCard
                                            label="VISIT TIME"
                                            value={visitTime}
                                            subValue="Today"
                                            type="time"
                                        />
                                    </div>

                                    <SubmitSection
                                        hasFeedback={rating > 0 || comment.trim().length > 0}
                                        onSubmit={handleSubmit}
                                        onReturnHome={handleReturnHome}
                                    />
                                </aside>
                            </div>
                        </div>
                    </main>
                </div>
            </CustomerLayout>
        </>
    );
}
