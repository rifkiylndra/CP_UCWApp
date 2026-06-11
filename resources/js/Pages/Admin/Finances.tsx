import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import type { AdminUser } from "@/types/admin";
import EmptyState from "@/Components/shared/EmptyState";
import { formatIDR } from "@/lib/formatters";
import { getPaymentMethodLabel, getPaymentStatusLabel } from "@/lib/status";
import type { Paginated } from "@/types/shared";
import {
    Calendar,
    Download,
    CreditCard,
    Banknote,
    Landmark,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface FinancesProps {
    auth: { user: AdminUser };
    transactions?: Paginated<FinanceTransaction>;
    metrics?: {
        totalSales: number;
        totalSalesChange: string;
        averageDailySales: number;
        averageDailySalesChange: string;
        transactionCount: number;
        transactionCountChange: string;
        averageOrderValue: number;
        averageOrderValueChange: string;
    };
    selectedMonth?: string;
}

interface FinanceTransaction {
    id?: number | string;
    date?: string;
    order_id?: string;
    customer_name?: string;
    amount?: number | string;
    payment_method?: string;
    status?: string;
}

export default function Finances({
    auth,
    transactions,
    metrics,
    selectedMonth = "2023-10",
}: FinancesProps) {
    const [month, setMonth] = useState(selectedMonth);

    const currentTransactions = transactions;
    const currentMetrics = metrics;

    const handleMonthChange = (value: string) => {
        setMonth(value);

        try {
            router.get(
                route("admin.finances-page" as any),
                { month: value },
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        } catch {}
    };

    const handleExport = () => {
        try {
            window.location.href = route("admin.finances.export" as any, {
                month,
            });
        } catch {}
    };

    return (
        <AdminLayout
            auth={auth}
            title="Finances"
            currentRoute="admin.finances-page"
        >
            <section className="font-['Manrope'] text-[#271310]">
                <div className="mb-8 flex flex-col gap-5 lg:mb-12 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#5A4A47] md:mb-3 md:text-[13px]">
                            Financial Center
                        </p>
                        <h1 className="text-[30px] font-extrabold tracking-[-1px] md:text-[38px] md:tracking-[-1.6px]">
                            Revenue Reporting
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 gap-3 rounded-[18px] bg-[#F8F8F7] p-2 sm:grid-cols-[1fr_auto]">
                        <label className="flex h-11 items-center justify-center gap-2 rounded-[12px] bg-white px-4 text-[12px] font-semibold shadow-sm md:h-10 md:px-5 md:text-[14px]">
                            <Calendar size={16} />
                            <input
                                type="month"
                                value={month}
                                onChange={(e) =>
                                    handleMonthChange(e.target.value)
                                }
                                className="border-0 bg-transparent p-0 text-[12px] font-semibold text-[#271310] focus:outline-none focus:ring-0 md:text-[14px]"
                            />
                        </label>

                        <button
                            onClick={handleExport}
                            className="flex h-11 items-center justify-center gap-2 rounded-[12px] bg-[#DDEED8] px-5 text-[12px] font-extrabold text-[#53664F] md:h-10 md:px-6 md:text-[14px]"
                        >
                            <Download size={15} />
                            Export CSV
                        </button>
                    </div>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:mb-12 lg:gap-6">
                    <MetricCard
                        title="Total Penjualan"
                        value={formatIDR(currentMetrics?.totalSales || 0)}
                        footer={currentMetrics?.totalSalesChange || "0%"}
                        desc="dibanding bulan lalu"
                    />

                    <MetricCard
                        title="Rata-rata Penjualan Harian"
                        value={formatIDR(currentMetrics?.averageDailySales || 0)}
                        footer={currentMetrics?.averageDailySalesChange || "0%"}
                        desc="dalam bulan ini"
                    />

                    <MetricCard
                        title="Jumlah Transaksi"
                        value={Number(
                            currentMetrics?.transactionCount || 0,
                        ).toLocaleString("id-ID")}
                        footer={currentMetrics?.transactionCountChange || "0%"}
                        desc="dibanding bulan lalu"
                    />

                    <MetricCard
                        title="Average Order Value"
                        value={formatIDR(currentMetrics?.averageOrderValue || 0)}
                        footer={currentMetrics?.averageOrderValueChange || "0%"}
                        desc="per transaksi paid"
                    />
                </div>

                <div className="mb-10 overflow-hidden rounded-[24px] bg-[#FAFAF9] p-4 shadow-[0_18px_45px_rgba(39,19,16,0.04)] md:mb-12 md:rounded-[34px] md:p-8">
                    <div className="mb-6 flex items-center justify-between gap-4 md:mb-10">
                        <div>
                            <h2 className="text-[20px] font-extrabold md:text-[22px]">
                                Transaction Reports
                            </h2>
                            <p className="mt-1 text-[12px] font-medium text-[#5A4A47]">
                                Data transaksi berdasarkan bulan yang dipilih.
                            </p>
                        </div>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto lg:block">
                        <div className="min-w-[900px]">
                            <div className="grid grid-cols-[130px_150px_1.3fr_150px_180px_150px] px-4 pb-5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#5A4A47]">
                                <span>Date</span>
                                <span>Order ID</span>
                                <span>Customer</span>
                                <span>Total Amount</span>
                                <span>Payment Method</span>
                                <span>Status</span>
                            </div>

                            <div className="space-y-4">
                                {currentTransactions?.data?.length > 0 ? (
                                    currentTransactions.data.map((tx) => (
                                        <TransactionRow
                                            key={tx.id || tx.order_id}
                                            tx={tx}
                                        />
                                    ))
                                ) : (
                                    <EmptyTransactions />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Cards */}
                    <div className="space-y-4 lg:hidden">
                        {currentTransactions?.data?.length > 0 ? (
                            currentTransactions.data.map((tx) => (
                                <TransactionCard
                                    key={tx.id || tx.order_id}
                                    tx={tx}
                                />
                            ))
                        ) : (
                            <EmptyTransactions />
                        )}
                    </div>

                    <PaginationFooter data={currentTransactions} />
                </div>
            </section>
        </AdminLayout>
    );
}

function TransactionRow({ tx }: { tx: FinanceTransaction }) {
    const Icon = getPaymentIcon(tx.payment_method);

    return (
        <div className="grid min-h-[78px] grid-cols-[130px_150px_1.3fr_150px_180px_150px] items-center bg-white px-4">
            <p className="text-[14px] font-extrabold">{tx.date}</p>

            <p className="text-[14px] font-medium text-[#5A4A47]">
                {tx.order_id}
            </p>

            <div className="flex items-center gap-3">
                <p className="text-[14px] font-medium">{tx.customer_name}</p>
            </div>

            <p className="text-[14px] font-extrabold">
                {formatIDR(tx.amount)}
            </p>

            <div className="flex items-center gap-2 text-[14px] font-medium text-[#5A4A47]">
                <Icon size={16} />
                <span>{getPaymentMethodLabel(tx.payment_method)}</span>
            </div>

            <StatusBadge status={tx.status} />
        </div>
    );
}

function TransactionCard({ tx }: { tx: FinanceTransaction }) {
    const Icon = getPaymentIcon(tx.payment_method);

    return (
        <div className="rounded-[20px] bg-white p-4 shadow-[0_10px_28px_rgba(39,19,16,0.04)]">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8B807D]">
                        {tx.order_id}
                    </p>
                    <h3 className="mt-1 text-[20px] font-extrabold tracking-[-0.5px]">
                        {formatIDR(tx.amount)}
                    </h3>
                </div>

                <StatusBadge status={tx.status} />
            </div>

            <div className="mb-4 flex items-center gap-3">
                <div className="min-w-0">
                    <p className="truncate text-[14px] font-extrabold">
                        {tx.customer_name}
                    </p>
                    <p className="text-[12px] font-medium text-[#5A4A47]">
                        {tx.date}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-[#F0ECEA] pt-4">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[#5A4A47]">
                    <Icon size={16} />
                    <span>{getPaymentMethodLabel(tx.payment_method)}</span>
                </div>
            </div>
        </div>
    );
}

function getPaymentIcon(method?: string | null) {
    const lower = method?.toLowerCase() || "";

    if (lower.includes("cash")) return Banknote;
    if (
        lower.includes("wire") ||
        lower.includes("transfer") ||
        lower.includes("va")
    )
        return Landmark;

    return CreditCard;
}

function EmptyTransactions() {
    return (
        <EmptyState
            title="Belum ada transaksi paid"
            message="Data akan muncul jika ada order completed dan payment status paid pada bulan yang dipilih."
        />
    );
}

function StatusBadge({ status }: { status: string }) {
    const isCompleted = status === "completed" || status === "paid";
    const label = getPaymentStatusLabel(status || "completed");

    return (
        <span
            title={label}
            className={`w-fit rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase md:px-4 md:py-2 md:text-[11px] ${
                isCompleted
                    ? "bg-[#DDEED8] text-[#53664F]"
                    : "bg-[#FFE3A7] text-[#8C651C]"
            }`}
        >
            • {status || "completed"}
        </span>
    );
}

function PaginationFooter({ data }: { data?: Paginated<FinanceTransaction> }) {
    if (!data) return null;

    const hasLaravelLinks = Array.isArray(data.links) && data.links.length > 0;

    return (
        <div className="mt-6 flex items-center justify-between gap-4 px-1 md:mt-10 md:px-4">
            <p className="text-[12px] font-medium text-[#5A4A47] md:text-[13px]">
                Showing {data.from || 0}–{data.to || 0} of {data.total || 0}{" "}
                transactions
            </p>

            <div className="flex items-center gap-2 md:gap-3">
                {hasLaravelLinks ? (
                    data.links.map((link, index: number) => {
                        let label = link.label;

                        if (String(label).includes("Previous")) {
                            label = <ChevronLeft size={17} />;
                        }

                        if (String(label).includes("Next")) {
                            label = <ChevronRight size={17} />;
                        }

                        return link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                preserveScroll
                                preserveState
                                className={`flex h-9 min-w-9 items-center justify-center rounded-[9px] px-3 text-[13px] font-extrabold ${
                                    link.active
                                        ? "bg-[#301713] text-white"
                                        : "bg-white text-[#5A4A47]"
                                }`}
                            >
                                {typeof label === "string" ? (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: label,
                                        }}
                                    />
                                ) : (
                                    label
                                )}
                            </Link>
                        ) : (
                            <span
                                key={index}
                                className="flex h-9 min-w-9 items-center justify-center rounded-[9px] bg-white/60 px-3 text-[13px] font-extrabold text-[#A69D9A]"
                            >
                                {typeof label === "string" ? (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: label,
                                        }}
                                    />
                                ) : (
                                    label
                                )}
                            </span>
                        );
                    })
                ) : (
                    <>
                        <button className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-white">
                            <ChevronLeft size={17} />
                        </button>
                        <button className="h-9 w-9 rounded-[9px] bg-[#301713] text-[13px] font-extrabold text-white">
                            1
                        </button>
                        <button className="hidden h-9 w-9 rounded-[9px] bg-white text-[13px] font-extrabold md:block">
                            2
                        </button>
                        <button className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-white">
                            <ChevronRight size={17} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function MetricCard({
    title,
    value,
    footer,
    desc,
}: {
    title: string;
    value: string;
    footer: string;
    desc: string;
}) {
    return (
        <div className="rounded-[22px] bg-white p-6 shadow-[0_12px_30px_rgba(39,19,16,0.04)] md:rounded-[24px] md:p-7">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#5A4A47] md:text-[12px]">
                {title}
            </p>

            <h2 className="mt-3 text-[27px] font-extrabold tracking-[-0.8px] md:text-[29px]">
                {value}
            </h2>

            <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#DDEED8] px-3 py-1 text-[11px] font-extrabold text-[#53664F]">
                    {footer}
                </span>
                <span className="text-[11px] font-medium text-[#6F625F]">
                    {desc}
                </span>
            </div>
        </div>
    );
}
