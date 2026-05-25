import React from "react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import type { AdminUser } from "@/types/admin";
import {
  Hourglass,
  Flame,
  CheckCircle2,
  Calendar,
  Download,
  ReceiptText,
} from "lucide-react";

interface LiveOrderProps {
  auth: { user: AdminUser };
}

export default function LiveOrder({ auth }: LiveOrderProps) {
  return (
    <AdminLayout auth={auth} title="Live Order" currentRoute="admin.live-order">
      <section className="font-['Manrope'] text-[#271310]">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#53664F]">
              Operations
            </p>
            <h1 className="text-[32px] font-extrabold tracking-[-1.2px]">
              Orders Dashboard
            </h1>
          </div>

          <div className="flex flex-col items-start gap-5 sm:items-end">
            <div className="flex rounded-full bg-[#F8F8F7] p-1 text-[14px] font-bold">
              <span className="flex items-center gap-2 rounded-full px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#C8151D]" />
                12 Pending
              </span>
              <span className="flex items-center gap-2 rounded-full px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#5A7256]" />
                8 Completed
              </span>
            </div>

            <div className="flex rounded-full bg-[#F8F8F7] p-2">
              <button className="flex h-8 items-center gap-2 rounded-full bg-white px-4 text-[13px] font-semibold shadow-sm">
                <Calendar size={15} />
                Oct 01, 2023 - Oct 31, 2023
              </button>
              <button className="ml-3 flex h-8 items-center gap-2 rounded-full bg-[#DDEED8] px-5 text-[13px] font-extrabold text-[#53664F]">
                <Download size={14} />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Board */}
        <div className="grid min-h-[660px] grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Incoming */}
          <OrderColumn
            title="Incoming"
            count={5}
            icon={<Hourglass size={22} />}
            borderStyle="border-transparent"
          >
            <OrderCard
              accent="#C8151D"
              orderId="#ORD-8821"
              title="Table 04"
              badge="UNPAID"
              badgeClass="bg-[#FFDADA] text-[#C8151D]"
              items={[
                ["1 × Oat Milk Flat White", "L"],
                ["1 × Avocado Tartine", "S"],
              ]}
              note='"No cilantro on the avocado tartine please."'
              action="VERIFY PAYMENT"
            />

            <OrderCard
              accent="#C9D1C6"
              orderId="#ORD-8825"
              title="Takeaway: Sarah"
              badge="PAID"
              badgeClass="bg-[#DDEED8] text-[#53664F]"
              items={[["2 × Ethiopian Pour Over", "12oz"]]}
            />
          </OrderColumn>

          {/* Processing */}
          <OrderColumn
            title="Processing"
            count={3}
            icon={<Flame size={22} />}
            borderStyle="border-transparent"
          >
            <OrderCard
              accent="#E9BF68"
              orderId="#ORD-8819"
              title="Table 12"
              badge="PAID"
              badgeClass="bg-[#DDEED8] text-[#53664F]"
              items={[
                ["1 × Seasonal Espresso Macchiato", "S"],
                ["1 × Pain au Chocolat", "—"],
              ]}
              processing
            />
          </OrderColumn>

          {/* Completed */}
          <OrderColumn
            title="Completed"
            countText="Today"
            icon={<CheckCircle2 size={23} />}
            dashed
            borderStyle="border-[#EFEAE7]"
          >
            <CompletedCard
              orderId="#ORD-8815"
              title="Table 02"
              desc="V60 Pour Over, French Toast"
            />
            <CompletedCard
              orderId="#ORD-8812"
              title="Takeaway: Marcus"
              desc="Iced Americano"
            />
          </OrderColumn>
        </div>
      </section>
    </AdminLayout>
  );
}

function OrderColumn({
  title,
  count,
  countText,
  icon,
  dashed = false,
  borderStyle,
  children,
}: {
  title: string;
  count?: number;
  countText?: string;
  icon: React.ReactNode;
  dashed?: boolean;
  borderStyle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        "overflow-hidden rounded-[14px] bg-[#FAFAF9]",
        dashed ? "border border-dashed" : "border",
        borderStyle,
      ].join(" ")}
    >
      <div className="flex h-[64px] items-center justify-between border-b border-[#EFEAE7] px-6">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-[16px] font-extrabold uppercase tracking-[0.04em]">
            {title}
          </h2>
        </div>

        {count !== undefined ? (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#301713] px-2 text-[11px] font-extrabold text-white">
            {count}
          </span>
        ) : (
          <span className="text-[11px] font-extrabold text-[#5A4A47]">
            {countText}
          </span>
        )}
      </div>

      <div className="space-y-5 p-5">{children}</div>
    </div>
  );
}

function OrderCard({
  accent,
  orderId,
  title,
  badge,
  badgeClass,
  items,
  note,
  action,
  processing = false,
}: {
  accent: string;
  orderId: string;
  title: string;
  badge: string;
  badgeClass: string;
  items: [string, string][];
  note?: string;
  action?: string;
  processing?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-[14px] bg-white p-6 shadow-[0_10px_26px_rgba(39,19,16,0.06)]">
      <span
        className="absolute left-0 top-0 h-full w-1"
        style={{ backgroundColor: accent }}
      />

      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-[11px] font-extrabold text-[#6F625F]">{orderId}</p>
          <h3 className="text-[20px] font-extrabold leading-tight">{title}</h3>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${badgeClass}`}
        >
          {badge}
        </span>
      </div>

      <div className="space-y-3">
        {items.map(([name, size]) => (
          <div
            key={name}
            className="flex justify-between gap-4 text-[14px] font-semibold text-[#5A4A47]"
          >
            <span>{name}</span>
            <span className="font-extrabold text-[#271310]">{size}</span>
          </div>
        ))}
      </div>

      {note && (
        <div className="mt-5 flex gap-3 rounded-[10px] bg-[#F4F4F3] p-4 text-[12px] font-medium leading-relaxed text-[#6F625F]">
          <ReceiptText size={15} className="mt-0.5 shrink-0" />
          <span>{note}</span>
        </div>
      )}

      {action && (
        <button className="mt-5 h-11 w-full rounded-[10px] bg-[#351C17] text-[12px] font-extrabold tracking-[0.12em] text-white shadow-[0_10px_22px_rgba(39,19,16,0.16)]">
          {action}
        </button>
      )}

      {processing && (
        <div className="mt-6 grid grid-cols-[1fr_1.5fr] gap-3">
          <button className="h-10 rounded-[10px] border border-[#D9C8C3] text-[12px] font-extrabold text-[#5A4A47]">
            MOVE BACK
          </button>
          <button className="h-10 rounded-[10px] bg-[#53664F] text-[12px] font-extrabold text-white">
            COMPLETE
          </button>
        </div>
      )}
    </div>
  );
}

function CompletedCard({
  orderId,
  title,
  desc,
}: {
  orderId: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-[14px] bg-white p-6 shadow-[0_10px_26px_rgba(39,19,16,0.04)]">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[11px] font-extrabold text-[#9D9290]">{orderId}</p>
        <span className="flex items-center gap-1 text-[10px] font-semibold text-[#8B9A86]">
          <CheckCircle2 size={13} />
          Handed Over
        </span>
      </div>
      <h3 className="text-[18px] font-extrabold text-[#6A5F5C]">{title}</h3>
      <p className="mt-2 text-[13px] font-medium italic text-[#9D9290]">
        {desc}
      </p>
    </div>
  );
}