import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import type { AdminUser } from "@/types/admin";
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
  transactions?: any;
  metrics?: {
    totalSales: number;
    totalSalesChange: string;
    averageDailySales: number;
    averageDailySalesChange: string;
  };
  selectedMonth?: string;
}

export default function Finances({
  auth,
  transactions,
  metrics,
  selectedMonth = "2023-10",
}: FinancesProps) {
  const [month, setMonth] = useState(selectedMonth);

  const fallbackTransactions = {
    data: [
      {
        id: 1,
        date: "Oct 24, 14:32",
        order_id: "#ORD-9021-X",
        customer_name: "Marcus Holloway",
        amount: 24500,
        payment_method: "Apple Pay",
        status: "completed",
        customer_avatar: "https://i.pravatar.cc/100?img=13",
      },
      {
        id: 2,
        date: "Oct 24, 12:10",
        order_id: "#ORD-8820-B",
        customer_name: "Elena Rodriguez",
        amount: 12000,
        payment_method: "Cash",
        status: "completed",
        customer_avatar: "https://i.pravatar.cc/100?img=32",
      },
      {
        id: 3,
        date: "Oct 24, 11:45",
        order_id: "#ORD-8715-L",
        customer_name: "Jordan Smith",
        amount: 115000,
        payment_method: "Wire Transfer",
        status: "completed",
        customer_avatar: "https://i.pravatar.cc/100?img=11",
      },
    ],
    from: 1,
    to: 3,
    total: 248,
    links: [],
  };

  const currentTransactions = transactions || fallbackTransactions;

  const currentMetrics = metrics || {
    totalSales: 12840000,
    totalSalesChange: "+12.5%",
    averageDailySales: 414193,
    averageDailySalesChange: "+4.8%",
  };

  const handleMonthChange = (value: string) => {
    setMonth(value);

    try {
      router.get(
        route("admin.finances" as any),
        { month: value },
        {
          preserveState: true,
          preserveScroll: true,
        }
      );
    } catch {
      console.log("Month changed:", value);
    }
  };

  const handleExport = () => {
    try {
      window.location.href = route("admin.finances.export" as any, {
        month,
      });
    } catch {
      console.log("Export CSV for month:", month);
    }
  };

  return (
    <AdminLayout auth={auth} title="Finances" currentRoute="admin.finances">
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
                onChange={(e) => handleMonthChange(e.target.value)}
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

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mb-12 lg:gap-6">
          <MetricCard
            title="Total Penjualan"
            value={`Rp ${Number(currentMetrics.totalSales).toLocaleString(
              "id-ID"
            )}`}
            footer={currentMetrics.totalSalesChange}
            desc="dibanding bulan lalu"
          />

          <MetricCard
            title="Rata-rata Penjualan Harian"
            value={`Rp ${Number(
              currentMetrics.averageDailySales
            ).toLocaleString("id-ID")}`}
            footer={currentMetrics.averageDailySalesChange}
            desc="dalam bulan ini"
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
                {currentTransactions.data.map((tx: any) => (
                  <TransactionRow key={tx.id || tx.order_id} tx={tx} />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 lg:hidden">
            {currentTransactions.data.map((tx: any) => (
              <TransactionCard key={tx.id || tx.order_id} tx={tx} />
            ))}
          </div>

          <PaginationFooter data={currentTransactions} />
        </div>
      </section>
    </AdminLayout>
  );
}

function TransactionRow({ tx }: { tx: any }) {
  const Icon = getPaymentIcon(tx.payment_method);

  return (
    <div className="grid min-h-[78px] grid-cols-[130px_150px_1.3fr_150px_180px_150px] items-center bg-white px-4">
      <p className="text-[14px] font-extrabold">{tx.date}</p>

      <p className="text-[14px] font-medium text-[#5A4A47]">
        {tx.order_id}
      </p>

      <div className="flex items-center gap-4">
        <img
          src={tx.customer_avatar || "https://i.pravatar.cc/100?img=13"}
          alt={tx.customer_name}
          className="h-9 w-9 rounded-full object-cover"
        />
        <p className="text-[14px] font-medium">{tx.customer_name}</p>
      </div>

      <p className="text-[14px] font-extrabold">
        Rp {Number(tx.amount).toLocaleString("id-ID")}
      </p>

      <div className="flex items-center gap-2 text-[14px] font-medium text-[#5A4A47]">
        <Icon size={16} />
        <span>{tx.payment_method}</span>
      </div>

      <StatusBadge status={tx.status} />
    </div>
  );
}

function TransactionCard({ tx }: { tx: any }) {
  const Icon = getPaymentIcon(tx.payment_method);

  return (
    <div className="rounded-[20px] bg-white p-4 shadow-[0_10px_28px_rgba(39,19,16,0.04)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8B807D]">
            {tx.order_id}
          </p>
          <h3 className="mt-1 text-[20px] font-extrabold tracking-[-0.5px]">
            Rp {Number(tx.amount).toLocaleString("id-ID")}
          </h3>
        </div>

        <StatusBadge status={tx.status} />
      </div>

      <div className="mb-4 flex items-center gap-3">
        <img
          src={tx.customer_avatar || "https://i.pravatar.cc/100?img=13"}
          alt={tx.customer_name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-extrabold">
            {tx.customer_name}
          </p>
          <p className="text-[12px] font-medium text-[#5A4A47]">{tx.date}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#F0ECEA] pt-4">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#5A4A47]">
          <Icon size={16} />
          <span>{tx.payment_method}</span>
        </div>
      </div>
    </div>
  );
}

function getPaymentIcon(method: string) {
  const lower = method?.toLowerCase() || "";

  if (lower.includes("cash")) return Banknote;
  if (lower.includes("wire") || lower.includes("transfer")) return Landmark;

  return CreditCard;
}

function StatusBadge({ status }: { status: string }) {
  const isCompleted = status === "completed" || status === "paid";

  return (
    <span
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

function PaginationFooter({ data }: { data: any }) {
  if (!data) return null;

  const hasLaravelLinks = Array.isArray(data.links) && data.links.length > 0;

  return (
    <div className="mt-6 flex items-center justify-between gap-4 px-1 md:mt-10 md:px-4">
      <p className="text-[12px] font-medium text-[#5A4A47] md:text-[13px]">
        Showing {data.from || 0}–{data.to || 0} of {data.total || 0} transactions
      </p>

      <div className="flex items-center gap-2 md:gap-3">
        {hasLaravelLinks ? (
          data.links.map((link: any, index: number) => {
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
                  <span dangerouslySetInnerHTML={{ __html: label }} />
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
                  <span dangerouslySetInnerHTML={{ __html: label }} />
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
        <span className="text-[11px] font-medium text-[#6F625F]">{desc}</span>
      </div>
    </div>
  );
}