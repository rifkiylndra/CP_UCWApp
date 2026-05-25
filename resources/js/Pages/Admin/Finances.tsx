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
        <div className="mb-12 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="mb-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#5A4A47]">
              Financial Center
            </p>
            <h1 className="text-[38px] font-extrabold tracking-[-1.6px]">
              Revenue Reporting
            </h1>
          </div>

          <div className="flex rounded-[18px] bg-[#F8F8F7] p-2">
            <button className="flex h-10 items-center gap-2 rounded-[12px] bg-white px-5 text-[14px] font-semibold shadow-sm">
              <Calendar size={16} />
              Oct 01, 2023 - Oct 31, 2023
            </button>

            <button className="ml-3 flex h-10 items-center gap-2 rounded-[12px] bg-[#DDEED8] px-6 text-[14px] font-extrabold text-[#53664F]">
              <Download size={15} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
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

          <div className="rounded-[24px] bg-[#301713] p-7 text-white shadow-[0_18px_34px_rgba(39,19,16,0.2)]">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-white/45">
              Refund Rate
            </p>
            <h2 className="mt-3 text-[30px] font-extrabold">0.42%</h2>
            <p className="mt-5 text-[12px] italic text-white/35">
              Healthy benchmark achieved
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="mb-12 overflow-hidden rounded-[34px] bg-[#FAFAF9] p-8 shadow-[0_18px_45px_rgba(39,19,16,0.04)]">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-[22px] font-extrabold">Recent Transactions</h2>
            <button className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-[#5A4A47]">
              View Archive →
            </button>
          </div>

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
            {transactions.map((tx) => {
              const Icon = tx.icon;

              return (
                <div
                  key={tx.orderId}
                  className="grid min-h-[78px] grid-cols-[120px_130px_1.2fr_130px_160px_150px_60px] items-center bg-white px-4"
                >
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

                  <span className="w-fit rounded-full bg-[#DDEED8] px-4 py-2 text-[11px] font-extrabold uppercase text-[#53664F]">
                    • Completed
                  </span>

                  <button className="flex justify-center">
                    <MoreVertical size={20} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-between px-4">
            <p className="text-[13px] font-medium text-[#5A4A47]">
              Showing 1–10 of 248 transactions
            </p>

            <div className="flex items-center gap-3">
              <button className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-white">
                <ChevronLeft size={17} />
              </button>
              <button className="h-9 w-9 rounded-[9px] bg-[#301713] text-[13px] font-extrabold text-white">
                1
              </button>
              <button className="h-9 w-9 rounded-[9px] bg-white text-[13px] font-extrabold">
                2
              </button>
              <button className="h-9 w-9 rounded-[9px] bg-white text-[13px] font-extrabold">
                3
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-white">
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
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
    <div className="rounded-[24px] bg-white p-7 shadow-[0_12px_30px_rgba(39,19,16,0.04)]">
      <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#5A4A47]">
        {title}
      </p>
      <h2 className="mt-3 text-[29px] font-extrabold tracking-[-0.8px]">
        {value}
      </h2>

      <div className="mt-5 flex items-center gap-2">
        <span className="rounded-full bg-[#DDEED8] px-3 py-1 text-[11px] font-extrabold text-[#53664F]">
          {footer}
        </span>
        {desc && (
          <span className="text-[11px] font-medium text-[#6F625F]">{desc}</span>
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
    <div className="relative h-[190px] overflow-hidden rounded-[28px] bg-[#301713]">
      <img
        src={img}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#301713] via-[#301713]/35 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end p-8 text-white">
        <h3 className="text-[25px] font-extrabold">{title}</h3>
        <p className="mt-2 max-w-[430px] text-[15px] leading-relaxed text-white/65">
          {desc}
        </p>
      </div>
    </div>
  );
}