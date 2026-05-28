import { Head } from "@inertiajs/react";
import StaffLayout from "@/Layouts/StaffLayout";
import type { StaffUser, DailyTransaction } from "@/types/staff";
import {
    Banknote,
    CreditCard,
    Download,
    Filter,
    Search,
    Star,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface Props {
    auth: { user: StaffUser };
    transactions: DailyTransaction[];
    summary: {
        cashTotal: number;
        digitalTotal: number;
        loyaltyPoints: number;
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
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(value);

    return (
        <StaffLayout
            auth={auth}
            title="Transaction History"
            currentRoute="transactions"
        >
            <Head title="Transaction History" />

            <div className="font-['Manrope'] text-[#271310]">
                <div className="mb-10 flex items-start justify-between">
                    <div>
                        <p className="mb-2 text-[12px] font-extrabold uppercase tracking-[0.35em] text-[#5A4A47]">
                            Archive
                        </p>
                        <h1 className="text-[38px] font-extrabold leading-none tracking-[-0.05em] text-[#271310]">
                            Daily Transactions
                        </h1>
                        <p className="mt-4 text-[17px] font-medium text-[#5A4A47]">
                            Reviewing activity for {date}
                        </p>
                    </div>

                    <div className="flex overflow-hidden rounded-[18px] bg-[#F4F4F3]">
                        <div className="px-5 py-4">
                            <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#5A4A47]">
                                Today's Revenue
                            </p>
                            <p className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-[#271310]">
                                {formatCurrency(summary.totalRevenue)}
                            </p>
                        </div>

                        <div className="my-4 w-px bg-[#DED8D2]" />

                        <div className="px-5 py-4 text-right">
                            <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#5A4A47]">
                                Orders
                            </p>
                            <p className="mt-1 text-[24px] font-extrabold tracking-[-0.03em] text-[#271310]">
                                {summary.totalOrders}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-14 grid grid-cols-3 gap-6">
                    <SummaryCard
                        icon={<Banknote size={23} />}
                        label="Cash Transactions"
                        value={formatCurrency(summary.cashTotal)}
                        variant="light"
                    />

                    <SummaryCard
                        icon={<CreditCard size={23} />}
                        label="Digital Payments"
                        value={formatCurrency(summary.digitalTotal)}
                        variant="green"
                    />

                    <SummaryCard
                        icon={<Star size={23} fill="currentColor" />}
                        label="Loyalty Points Issued"
                        value={`${summary.loyaltyPoints.toLocaleString("id-ID")} pts`}
                        variant="dark"
                    />
                </div>

                <section className="rounded-[34px] bg-[#F4F4F3] p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative w-[260px]">
                                <Search
                                    size={17}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A4A47]"
                                />
                                <input
                                    type="text"
                                    placeholder="Search order ID or customer..."
                                    className="h-11 w-full rounded-[14px] border-none bg-white pl-11 pr-4 text-[14px] font-medium text-[#271310] outline-none placeholder:text-[#9A8F8B]"
                                />
                            </div>

                            <button className="flex h-11 items-center gap-2 rounded-[14px] bg-[#E7E7E6] px-5 text-[14px] font-extrabold text-[#271310] transition hover:bg-[#DDDDDC]">
                                <Filter size={16} />
                                Filter
                            </button>
                        </div>

                        <button className="flex h-11 items-center gap-2 rounded-[14px] px-4 text-[14px] font-extrabold text-[#271310] transition hover:bg-white">
                            <Download size={16} />
                            Export CSV
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-[24px]">
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
                                {transactions.map((trx) => (
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
                                            {formatCurrency(trx.totalPrice)}
                                        </TableCell>

                                        <TableCell className="text-[#5A4A47]">
                                            {trx.paymentMethod}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <StatusBadge status={trx.status} />
                                        </TableCell>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#5A4A47]">
                            Showing {transactions.length} of{" "}
                            {summary.totalOrders} transactions
                        </p>

                        <div className="flex items-center gap-2">
                            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#271310] transition hover:bg-[#E7E7E6]">
                                <ChevronLeft size={18} />
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#271310] text-white transition hover:opacity-90">
                                <ChevronRight size={18} />
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
    icon: React.ReactNode;
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

    return (
        <div className={`rounded-[26px] p-7 shadow-[0_2px_12px_rgba(39,19,16,0.03)] ${styles[variant]}`}>
            <div className="mb-8">{icon}</div>
            <p className={`mb-2 text-[14px] font-extrabold uppercase tracking-[0.08em] ${muted}`}>
                {label}
            </p>
            <p className="text-[28px] font-extrabold tracking-[-0.04em]">
                {value}
            </p>
        </div>
    );
}

function TableHead({
    children,
    align = "left",
}: {
    children: React.ReactNode;
    align?: "left" | "right";
}) {
    return (
        <th
            className={`pb-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#5A4A47] ${
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
    children: React.ReactNode;
    className?: string;
}) {
    return <td className={`py-5 text-[15px] ${className}`}>{children}</td>;
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

function StatusBadge({ status }: { status: DailyTransaction["status"] }) {
    if (status === "refunded") {
        return (
            <span className="inline-flex rounded-full bg-[#FFD9D6] px-4 py-1 text-[11px] font-extrabold uppercase text-[#C62828]">
                Refunded
            </span>
        );
    }

    if (status === "pending") {
        return (
            <span className="inline-flex rounded-full bg-[#FFF0C7] px-4 py-1 text-[11px] font-extrabold uppercase text-[#A46A00]">
                Pending
            </span>
        );
    }

    return (
        <span className="inline-flex rounded-full bg-[#DCEED8] px-4 py-1 text-[11px] font-extrabold uppercase text-[#4F654D]">
            Completed
        </span>
    );
}