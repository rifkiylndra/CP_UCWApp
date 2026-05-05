import { Head } from "@inertiajs/react";
import StaffLayout from "@/Layouts/StaffLayout";
import type { StaffUser, DailyTransaction } from "@/types/staff";

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
    return (
        <StaffLayout
            auth={auth}
            title="Transactions History"
            currentRoute="transactions"
        >
            <Head title="Transactions | Staff Dashboard" />

            {/* ── Page Header ── */}
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2
                        className="text-[12px] font-black uppercase tracking-widest mb-1"
                        style={{ color: "var(--color-ucw-text-muted)" }}
                    >
                        Archive / Daily Transactions
                    </h2>
                    <p
                        className="text-[24px] font-black tracking-tight"
                        style={{ color: "var(--color-ucw-dark)" }}
                    >
                        Reviewing activity for {date}
                    </p>
                </div>
                <div className="text-right">
                    <p
                        className="text-[12px] font-bold uppercase tracking-widest mb-1"
                        style={{ color: "var(--color-ucw-text-muted)" }}
                    >
                        Today's Revenue
                    </p>
                    <div className="flex items-center justify-end gap-3">
                        <span
                            className="text-[28px] font-black leading-none"
                            style={{ color: "var(--color-ucw-text)" }}
                        >
                            Rp {summary.totalRevenue.toLocaleString("id-ID")}
                        </span>
                        <span
                            className="text-[12px] font-bold px-3 py-1 rounded bg-black/5"
                            style={{ color: "var(--color-ucw-text-muted)" }}
                        >
                            {summary.totalOrders} ORDERS
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Summary Stats Cards ── */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                {/* Cash Transactions */}
                <div
                    className="p-6 rounded-2xl bg-white flex items-center gap-5"
                    style={{ border: "1px solid var(--color-ucw-border)" }}
                >
                    <div
                        className="w-14 h-14 rounded-full flex items-center justify-center flex-none"
                        style={{
                            backgroundColor: "var(--color-ucw-bg-warm)",
                            color: "var(--color-ucw-dark)",
                        }}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <rect
                                x="2"
                                y="6"
                                width="20"
                                height="12"
                                rx="2"
                            ></rect>
                            <circle cx="12" cy="12" r="2"></circle>
                            <path d="M6 12h.01M18 12h.01"></path>
                        </svg>
                    </div>
                    <div>
                        <p
                            className="text-[11px] font-bold uppercase tracking-widest mb-1"
                            style={{ color: "var(--color-ucw-text-muted)" }}
                        >
                            Cash Transactions
                        </p>
                        <p
                            className="text-[20px] font-black"
                            style={{ color: "var(--color-ucw-dark)" }}
                        >
                            Rp {summary.cashTotal.toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>

                {/* Digital Payments */}
                <div
                    className="p-6 rounded-2xl bg-white flex items-center gap-5"
                    style={{ border: "1px solid var(--color-ucw-border)" }}
                >
                    <div
                        className="w-14 h-14 rounded-full flex items-center justify-center flex-none"
                        style={{
                            backgroundColor: "var(--color-ucw-bg-warm)",
                            color: "var(--color-ucw-dark)",
                        }}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <rect
                                x="5"
                                y="2"
                                width="14"
                                height="20"
                                rx="2"
                                ry="2"
                            ></rect>
                            <line x1="12" y1="18" x2="12.01" y2="18"></line>
                        </svg>
                    </div>
                    <div>
                        <p
                            className="text-[11px] font-bold uppercase tracking-widest mb-1"
                            style={{ color: "var(--color-ucw-text-muted)" }}
                        >
                            Digital Payments
                        </p>
                        <p
                            className="text-[20px] font-black"
                            style={{ color: "var(--color-ucw-dark)" }}
                        >
                            Rp {summary.digitalTotal.toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>

                {/* Loyalty Points */}
                <div
                    className="p-6 rounded-2xl flex items-center gap-5"
                    style={{
                        backgroundColor: "var(--color-ucw-dark)",
                        color: "white",
                    }}
                >
                    <div
                        className="w-14 h-14 rounded-full flex items-center justify-center flex-none"
                        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest mb-1 opacity-60">
                            Loyalty Points Issued
                        </p>
                        <p className="text-[20px] font-black">
                            {summary.loyaltyPoints.toLocaleString("id-ID")} pts
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Table Toolbar ── */}
            <div className="flex items-center justify-between mb-4">
                <div className="relative w-[320px]">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search order ID or customer..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13px] outline-none"
                        style={{ border: "1px solid var(--color-ucw-border)" }}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:bg-black/5"
                        style={{ border: "1px solid var(--color-ucw-border)" }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                        </svg>
                        Filter
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:bg-black/5"
                        style={{ border: "1px solid var(--color-ucw-border)" }}
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            {/* ── Transactions Table ── */}
            <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: "1px solid var(--color-ucw-border)" }}
            >
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/5">
                            <th
                                className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                Time
                            </th>
                            <th
                                className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                Order ID
                            </th>
                            <th
                                className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                Customer / Table
                            </th>
                            <th
                                className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                Total Price
                            </th>
                            <th
                                className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                Payment
                            </th>
                            <th
                                className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest"
                                style={{ color: "var(--color-ucw-text-muted)" }}
                            >
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((trx, i) => (
                            <tr
                                key={trx.id}
                                className="transition-colors hover:bg-black/5"
                                style={{
                                    borderTop:
                                        "1px solid var(--color-ucw-border)",
                                }}
                            >
                                <td
                                    className="px-6 py-4 text-[13px] font-medium"
                                    style={{ color: "var(--color-ucw-text)" }}
                                >
                                    {trx.time}
                                </td>
                                <td
                                    className="px-6 py-4 text-[13px] font-black uppercase tracking-wider"
                                    style={{ color: "var(--color-ucw-dark)" }}
                                >
                                    #{trx.orderId}
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden flex-none"
                                            style={{
                                                backgroundColor:
                                                    "var(--color-ucw-bg-warm)",
                                                borderColor:
                                                    "var(--color-ucw-border)",
                                                color: "var(--color-ucw-dark)",
                                            }}
                                        >
                                            {trx.customerAvatar ? (
                                                <img
                                                    src={trx.customerAvatar}
                                                    alt="Customer"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-[12px] font-bold">
                                                    {trx.customerInitial ||
                                                        trx.customerName
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p
                                                className="text-[13px] font-bold"
                                                style={{
                                                    color: "var(--color-ucw-text)",
                                                }}
                                            >
                                                {trx.customerName}
                                            </p>
                                            <span
                                                className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded mt-0.5 inline-block"
                                                style={{
                                                    backgroundColor:
                                                        "var(--color-ucw-border-dark)",
                                                    color: "var(--color-ucw-text-muted)",
                                                }}
                                            >
                                                {trx.customerName
                                                    .toLowerCase()
                                                    .includes("table")
                                                    ? "TC"
                                                    : "WK"}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td
                                    className="px-6 py-4 text-[14px] font-bold"
                                    style={{ color: "var(--color-ucw-text)" }}
                                >
                                    Rp {trx.totalPrice.toLocaleString("id-ID")}
                                </td>

                                <td className="px-6 py-4">
                                    <span
                                        className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
                                        style={{
                                            backgroundColor:
                                                "var(--color-ucw-bg-warm)",
                                            color: "var(--color-ucw-text-muted)",
                                        }}
                                    >
                                        {trx.paymentMethod}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    {trx.status === "completed" && (
                                        <span
                                            className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
                                            style={{
                                                backgroundColor:
                                                    "var(--color-ucw-green-bg)",
                                                color: "var(--color-ucw-green-text)",
                                            }}
                                        >
                                            COMPLETED
                                        </span>
                                    )}
                                    {trx.status === "refunded" && (
                                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-red-100 text-red-700">
                                            REFUNDED
                                        </span>
                                    )}
                                    {trx.status === "pending" && (
                                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-yellow-100 text-yellow-700">
                                            PENDING
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination / Footer Info */}
            <div className="flex items-center justify-between mt-4 mb-8 px-2">
                <p
                    className="text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: "var(--color-ucw-text-muted)" }}
                >
                    Showing {transactions.length} of {summary.totalOrders}{" "}
                    Transactions
                </p>
                <div className="flex items-center gap-1">
                    <button className="w-8 h-8 rounded flex items-center justify-center opacity-50 cursor-not-allowed">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <button className="w-8 h-8 rounded flex items-center justify-center bg-black/5 font-bold text-[13px]">
                        1
                    </button>
                    <button className="w-8 h-8 rounded flex items-center justify-center font-bold text-[13px] hover:bg-black/5">
                        2
                    </button>
                    <button className="w-8 h-8 rounded flex items-center justify-center font-bold text-[13px] hover:bg-black/5">
                        3
                    </button>
                    <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-black/5">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </StaffLayout>
    );
}
