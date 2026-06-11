import { Head } from "@inertiajs/react";
import StaffLayout from "@/Components/Layout/StaffLayout";
import type { StaffUser, DailyTransaction } from "@/types/staff";
import DataToolbar from "@/Components/admin/DataToolbar";
import { formatIDR } from "@/lib/formatters";
import { getPaymentMethodLabel, getPaymentStatusLabel } from "@/lib/status";
import { ReactNode, useState } from "react";
import {
    Banknote,
    CreditCard,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface Props {
    auth: { user: StaffUser };
    transactions: DailyTransaction[];
    summary: {
        cashTotal: number;
        digitalTotal: number;

        totalRevenue: number;
        totalOrders: number;
    };
    date: string;
}

export default function Transactions({
    auth,
    transactions,
    summary,
    date,
}: Props) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTransactions = transactions.filter((trx) => {
        const query = searchQuery.toLowerCase();
        return (
            trx.orderId.toLowerCase().includes(query) ||
            trx.customerName.toLowerCase().includes(query)
        );
    });

    return (
        <StaffLayout
            auth={auth}
            title="Transaction History"
            currentRoute="transactions"
        >
            <Head title="Transaction History" />

            <div className="font-['Manrope'] text-[#271310]">
                <div className="mb-6 flex flex-col gap-5 lg:mb-7 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.32em] text-[#5A4A47] lg:text-[12px]">
                            Archive
                        </p>
                        <h1 className="text-[30px] font-extrabold leading-none tracking-[-0.05em] text-[#271310] lg:text-[34px]">
                            Daily Transactions
                        </h1>
                        <p className="mt-3 text-[14px] font-medium text-[#5A4A47] lg:text-[15px]">
                            Reviewing activity for {date}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 overflow-hidden rounded-[18px] bg-[#F4F4F3] lg:flex">
                        <div className="px-4 py-3 lg:px-5">
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#5A4A47]">
                                Today's Revenue
                            </p>
                            <p className="mt-1 text-[18px] font-extrabold tracking-[-0.03em] text-[#271310] lg:text-[20px]">
                                {formatIDR(summary.totalRevenue)}
                            </p>
                        </div>

                        <div className="hidden my-3 w-px bg-[#DED8D2] lg:block" />

                        <div className="px-4 py-3 text-right lg:px-5">
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#5A4A47]">
                                Orders
                            </p>
                            <p className="mt-1 text-[20px] font-extrabold tracking-[-0.03em] text-[#271310] lg:text-[22px]">
                                {summary.totalOrders}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-3 lg:mb-7 lg:gap-4">
    <SummaryCard
        icon={<Banknote size={20} />}
        label="Cash Transactions"
        value={formatIDR(summary.cashTotal)}
        variant="light"
    />

    <SummaryCard
        icon={<CreditCard size={20} />}
        label="Digital Payments"
        value={formatIDR(summary.digitalTotal)}
        variant="green"
    />
</div>

                <section className="rounded-[26px] bg-[#F4F4F3] p-4 lg:rounded-[30px] lg:p-6">
                    <DataToolbar
                        searchValue={searchQuery}
                        searchPlaceholder="Search order ID or customer..."
                        onSearchChange={setSearchQuery}
                        exportHref="/staff/transactions/export"
                        exportLabel="Export CSV"
                        className="mb-5 flex flex-col gap-3 lg:mb-6 lg:flex-row lg:items-center lg:justify-between"
                        controlsClassName="flex flex-col gap-3 sm:flex-row sm:items-center lg:w-full lg:justify-between"
                        exportClassName="flex h-11 items-center justify-center gap-2 rounded-[14px] bg-white px-4 text-[13px] font-extrabold text-[#271310] transition hover:bg-[#E7E7E6] lg:bg-transparent lg:hover:bg-white"
                    />

                    {/* Desktop Table */}
                    <div className="hidden overflow-hidden rounded-[22px] lg:block">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#E3DDD8]">
                                    <TableHead>Time</TableHead>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer / Table</TableHead>
                                    <TableHead>Total Price</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead align="right">Status</TableHead>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredTransactions.map((trx) => (
                                    <tr
                                        key={trx.id}
                                        className="border-b border-[#E9E5E1] transition hover:bg-white/60"
                                    >
                                        <TableCell className="text-[#5A4A47]">
                                            {trx.time}
                                        </TableCell>

                                        <TableCell className="font-extrabold text-[#271310]">
                                            #{trx.orderId}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar transaction={trx} />
                                                <span className="font-semibold text-[#271310]">
                                                    {trx.customerName}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="font-extrabold text-[#271310]">
                                            {formatIDR(trx.totalPrice)}
                                        </TableCell>

                                        <TableCell className="text-[#5A4A47]">
                                            {getPaymentMethodLabel(trx.paymentMethod)}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <StatusBadge status={trx.status} />
                                        </TableCell>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="flex flex-col gap-3 lg:hidden">
                        {filteredTransactions.map((trx) => (
                            <TransactionMobileCard
                                key={trx.id}
                                trx={trx}
                            />
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-4">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#5A4A47] lg:text-[11px]">
                            Showing {filteredTransactions.length} of{" "}
                            {summary.totalOrders} transactions
                        </p>

                        <div className="flex items-center gap-2">
                            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#271310] transition hover:bg-[#E7E7E6]">
                                <ChevronLeft size={17} />
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#271310] text-white transition hover:opacity-90">
                                <ChevronRight size={17} />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </StaffLayout>
    );
}

function SummaryCard({
    icon,
    label,
    value,
    variant,
}: {
    icon: ReactNode;
    label: string;
    value: string;
    variant: "light" | "green" | "dark";
}) {
    const styles = {
        light: "bg-white text-[#271310]",
        green: "bg-[#DCEED8] text-[#271310]",
        dark: "bg-[#271310] text-white",
    };

    const muted = variant === "dark" ? "text-white/60" : "text-[#5A4A47]";
    const iconBg = variant === "dark" ? "bg-white/10" : "bg-[#F4F4F3]";

    return (
        <div
            className={`rounded-[22px] p-4 shadow-[0_2px_12px_rgba(39,19,16,0.04)] lg:p-5 ${styles[variant]}`}
        >
            {/* Icon pill */}
            <div className={`mb-4 inline-flex rounded-[10px] p-2 ${iconBg}`}>
                {icon}
            </div>

            <p className={`mb-1 text-[10px] font-extrabold uppercase tracking-[0.1em] lg:text-[11px] ${muted}`}>
                {label}
            </p>

            <p className="text-[18px] font-extrabold tracking-[-0.04em] leading-tight lg:text-[22px]">
                {value}
            </p>
        </div>
    );
}

function TableHead({
    children,
    align = "left",
}: {
    children: ReactNode;
    align?: "left" | "right";
}) {
    return (
        <th
            className={`pb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#5A4A47] ${
                align === "right" ? "text-right" : "text-left"
            }`}
        >
            {children}
        </th>
    );
}

function TableCell({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return <td className={`py-4 text-[14px] ${className}`}>{children}</td>;
}

function Avatar({ transaction }: { transaction: DailyTransaction }) {
    if (transaction.customerAvatar) {
        return (
            <img
                src={transaction.customerAvatar}
                alt={transaction.customerName}
                className="h-8 w-8 rounded-[9px] object-cover"
            />
        );
    }

    const initial =
        transaction.customerInitial ||
        transaction.customerName
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#E7E7E6] text-[12px] font-extrabold text-[#271310]">
            {initial}
        </div>
    );
}

function TransactionMobileCard({
    trx,
}: {
    trx: DailyTransaction;
}) {
    return (
        <article className="rounded-[20px] bg-white p-4 shadow-[0_3px_14px_rgba(39,19,16,0.04)]">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <p className="text-[12px] font-extrabold uppercase tracking-[0.05em] text-[#8A7B77]">
                        #{trx.orderId}
                    </p>
                    <p className="mt-1 text-[16px] font-extrabold text-[#271310]">
                        {trx.customerName}
                    </p>
                </div>

                <StatusBadge status={trx.status} />
            </div>

            <div className="flex items-center justify-between border-t border-[#ECE8E4] pt-4">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8A7B77]">
                        Payment
                    </p>
                    <p className="mt-1 text-[13px] font-bold text-[#5A4A47]">
                        {getPaymentMethodLabel(trx.paymentMethod)} • {trx.time}
                    </p>
                </div>

                <p className="text-right text-[17px] font-extrabold tracking-[-0.03em] text-[#271310]">
                    {formatIDR(trx.totalPrice)}
                </p>
            </div>
        </article>
    );
}

function StatusBadge({ status }: { status: DailyTransaction["status"] | string }) {
    const label = getPaymentStatusLabel(status);

    if (status === "refunded") {
        return (
            <span className="inline-flex rounded-full bg-[#FFD9D6] px-3 py-1 text-[10px] font-extrabold uppercase text-[#C62828]">
                {label}
            </span>
        );
    }

    if (status === "pending") {
        return (
            <span className="inline-flex rounded-full bg-[#FFF0C7] px-3 py-1 text-[10px] font-extrabold uppercase text-[#A46A00]">
                {label}
            </span>
        );
    }

    if (status === "processing") {
        return (
            <span className="inline-flex rounded-full bg-[#E3F2FD] px-3 py-1 text-[10px] font-extrabold uppercase text-[#1565C0]">
                {label}
            </span>
        );
    }

    if (status === "cancelled") {
        return (
            <span className="inline-flex rounded-full bg-[#EEEEEE] px-3 py-1 text-[10px] font-extrabold uppercase text-[#616161]">
                {label}
            </span>
        );
    }

    return (
        <span className="inline-flex rounded-full bg-[#DCEED8] px-3 py-1 text-[10px] font-extrabold uppercase text-[#4F654D]">
            {label}
        </span>
    );
}
