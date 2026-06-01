import React from "react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import type { AdminUser } from "@/types/admin";
import {
  Calendar,
  Download,
  CreditCard,
  Banknote,
  Landmark,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface FinancesProps {
  auth: { user: AdminUser };
}

export default function Finances({ auth }: FinancesProps) {
  const transactions = [
    {
      date: "Oct 24,\n14:32",
      orderId: "#ORD-\n9021-X",
      customer: "Marcus\nHolloway",
      amount: "$24.50",
      method: "Apple Pay",
      icon: CreditCard,
      img: "https://i.pravatar.cc/100?img=13",
    },
    {
      date: "Oct 24,\n12:10",
      orderId: "#ORD-\n8820-B",
      customer: "Elena\nRodriguez",
      amount: "$12.00",
      method: "Cash",
      icon: Banknote,
      img: "https://i.pravatar.cc/100?img=32",
    },
    {
      date: "Oct 24,\n11:45",
      orderId: "#ORD-\n8715-L",
      customer: "Jordan Smith",
      amount: "$115.00",
      method: "Wire\nTransfer",
      icon: Landmark,
      img: "https://i.pravatar.cc/100?img=11",
    },
  ];

  return (
    <AdminLayout auth={auth} title="Finances" currentRoute="admin.finances">
      <section className="font-['Manrope'] text-[#271310]">
        {/* Header */}
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
            <button className="flex h-11 items-center justify-center gap-2 rounded-[12px] bg-white px-4 text-[12px] font-semibold shadow-sm md:h-10 md:px-5 md:text-[14px]">
              <Calendar size={16} />
              <span className="truncate">Oct 01, 2023 - Oct 31, 2023</span>
            </button>

            <button className="flex h-11 items-center justify-center gap-2 rounded-[12px] bg-[#DDEED8] px-5 text-[12px] font-extrabold text-[#53664F] md:h-10 md:px-6 md:text-[14px]">
              <Download size={15} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mb-12 xl:grid-cols-4 xl:gap-6">
          <MetricCard
            title="Total Net Sales"
            value="$12,840.00"
            footer="+12.5%"
            desc="vs last month"
          />
          <MetricCard
            title="Average Ticket"
            value="$18.42"
            footer="↗"
            desc="Peak performance"
          />
          <MetricCard
            title="Active Subscriptions"
            value="142"
            footer="Growing"
            desc=""
          />

          <div className="rounded-[22px] bg-[#301713] p-6 text-white shadow-[0_18px_34px_rgba(39,19,16,0.2)] md:rounded-[24px] md:p-7">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/45 md:text-[12px]">
              Refund Rate
            </p>
            <h2 className="mt-3 text-[28px] font-extrabold md:text-[30px]">
              0.42%
            </h2>
            <p className="mt-4 text-[12px] italic text-white/35 md:mt-5">
              Healthy benchmark achieved
            </p>
          </div>
        </div>

        {/* Transactions */}
        <div className="mb-10 overflow-hidden rounded-[24px] bg-[#FAFAF9] p-4 shadow-[0_18px_45px_rgba(39,19,16,0.04)] md:mb-12 md:rounded-[34px] md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4 md:mb-10">
            <h2 className="text-[20px] font-extrabold md:text-[22px]">
              Recent Transactions
            </h2>
            <button className="whitespace-nowrap text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#5A4A47] md:text-[13px]">
              View Archive →
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-[120px_130px_1.2fr_130px_160px_150px_60px] px-4 pb-5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#5A4A47]">
              <span>Date</span>
              <span>Order ID</span>
              <span>Customer</span>
              <span>Total Amount</span>
              <span>Payment Method</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            <div className="space-y-4">
              {transactions.map((tx) => (
                <TransactionRow key={tx.orderId} tx={tx} />
              ))}
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 lg:hidden">
            {transactions.map((tx) => (
              <TransactionCard key={tx.orderId} tx={tx} />
            ))}
          </div>

          <PaginationFooter />
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-8">
          <EditorialCard
            title="Financial Insights"
            desc="Your workspace performance is up 18% compared to the last quarter."
            img="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=900&auto=format&fit=crop"
          />

          <EditorialCard
            title="Tax Season Readiness"
            desc="All records are currently reconciled and ready for quarterly export."
            img="https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=900&auto=format&fit=crop"
          />
        </div>
      </section>
    </AdminLayout>
  );
}

function TransactionRow({ tx }: { tx: any }) {
  const Icon = tx.icon;

  return (
    <div className="grid min-h-[78px] grid-cols-[120px_130px_1.2fr_130px_160px_150px_60px] items-center bg-white px-4">
      <p className="whitespace-pre-line text-[15px] font-extrabold">
        {tx.date}
      </p>

      <p className="whitespace-pre-line text-[15px] font-medium text-[#5A4A47]">
        {tx.orderId}
      </p>

      <div className="flex items-center gap-4">
        <img
          src={tx.img}
          alt={tx.customer}
          className="h-9 w-9 rounded-full object-cover"
        />
        <p className="whitespace-pre-line text-[15px] font-medium">
          {tx.customer}
        </p>
      </div>

      <p className="text-[15px] font-extrabold">{tx.amount}</p>

      <div className="flex items-center gap-2 text-[15px] font-medium text-[#5A4A47]">
        <Icon size={16} />
        <span className="whitespace-pre-line">{tx.method}</span>
      </div>

      <StatusBadge />

      <button className="flex justify-center">
        <MoreVertical size={20} />
      </button>
    </div>
  );
}

function TransactionCard({ tx }: { tx: any }) {
  const Icon = tx.icon;
  const cleanDate = tx.date.replace("\n", " ");
  const cleanOrderId = tx.orderId.replace("\n", "");
  const cleanCustomer = tx.customer.replace("\n", " ");
  const cleanMethod = tx.method.replace("\n", " ");

  return (
    <div className="rounded-[20px] bg-white p-4 shadow-[0_10px_28px_rgba(39,19,16,0.04)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8B807D]">
            {cleanOrderId}
          </p>
          <h3 className="mt-1 text-[20px] font-extrabold tracking-[-0.5px]">
            {tx.amount}
          </h3>
        </div>

        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F8F7]">
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <img
          src={tx.img}
          alt={cleanCustomer}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-extrabold">{cleanCustomer}</p>
          <p className="text-[12px] font-medium text-[#5A4A47]">{cleanDate}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#F0ECEA] pt-4">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#5A4A47]">
          <Icon size={16} />
          <span>{cleanMethod}</span>
        </div>

        <StatusBadge />
      </div>
    </div>
  );
}

function StatusBadge() {
  return (
    <span className="w-fit rounded-full bg-[#DDEED8] px-3 py-1.5 text-[10px] font-extrabold uppercase text-[#53664F] md:px-4 md:py-2 md:text-[11px]">
      • Completed
    </span>
  );
}

function PaginationFooter() {
  return (
    <div className="mt-6 flex items-center justify-between gap-4 px-1 md:mt-10 md:px-4">
      <p className="text-[12px] font-medium text-[#5A4A47] md:text-[13px]">
        Showing 1–10 of 248 transactions
      </p>

      <div className="flex items-center gap-2 md:gap-3">
        <button className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-white">
          <ChevronLeft size={17} />
        </button>
        <button className="h-9 w-9 rounded-[9px] bg-[#301713] text-[13px] font-extrabold text-white">
          1
        </button>
        <button className="hidden h-9 w-9 rounded-[9px] bg-white text-[13px] font-extrabold md:block">
          2
        </button>
        <button className="hidden h-9 w-9 rounded-[9px] bg-white text-[13px] font-extrabold md:block">
          3
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-white">
          <ChevronRight size={17} />
        </button>
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
        {desc && (
          <span className="text-[11px] font-medium text-[#6F625F]">
            {desc}
          </span>
        )}
      </div>
    </div>
  );
}

function EditorialCard({
  title,
  desc,
  img,
}: {
  title: string;
  desc: string;
  img: string;
}) {
  return (
    <div className="relative h-[170px] overflow-hidden rounded-[22px] bg-[#301713] md:h-[190px] md:rounded-[28px]">
      <img
        src={img}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#301713] via-[#301713]/35 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white md:p-8">
        <h3 className="text-[22px] font-extrabold md:text-[25px]">{title}</h3>
        <p className="mt-2 max-w-[430px] text-[13px] leading-relaxed text-white/65 md:text-[15px]">
          {desc}
        </p>
      </div>
    </div>
  );
}