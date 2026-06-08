import React from "react";
import { router } from "@inertiajs/react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import type { AdminUser } from "@/types/admin";
import {
  ClipboardList,
  Banknote,
  Timer,
  Coffee,
} from "lucide-react";

interface OverviewProps {
  auth: { user: AdminUser };
  statistics?: any;
  topMenus?: any;
  salesTrend?: any[];
  chartMode?: "daily" | "weekly";
  peakHours?: any[];
}

export default function Overview({
  auth,
  statistics,
  topMenus = [],
  salesTrend = [],
  chartMode = "weekly",
  peakHours = [],
}: OverviewProps) {
  const maxRevenue = Math.max(
    ...salesTrend.map((item: any) => Number(item.revenue) || 0),
    0
  );
  const hasSalesData = salesTrend.some(
    (item: any) => Number(item.revenue) > 0 || Number(item.count) > 0
  );
  const chartGridClass =
    chartMode === "daily"
      ? "grid-cols-5 sm:grid-cols-10"
      : "grid-cols-5";

  const handleModeChange = (mode: "daily" | "weekly") => {
    router.get(
      route("admin.overview" as any),
      { mode },
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      }
    );
  };

  return (
    <AdminLayout auth={auth} title="Overview" currentRoute="admin.overview">
      <section className="font-['Manrope'] text-[#271310]">
        {/* Header */}
        <div className="mb-7 md:mb-11">
          <h1 className="text-[28px] font-extrabold tracking-[-1px] md:text-[34px] md:tracking-[-1.4px]">
            Morning Overview
          </h1>
          <p className="mt-2 max-w-[750px] text-[15px] leading-relaxed text-[#8B807D]">
            The aroma of freshly roasted beans meets digital precision.
            Here's how your workspace is brewing today.
          </p>
        </div>

        {/* Top Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mb-12 lg:grid-cols-3 lg:gap-8">
          <div className="rounded-[14px] bg-white p-5 shadow-[0_10px_34px_rgba(39,19,16,0.04)] md:rounded-[10px] md:p-8">
            <div className="mb-7 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#EEF5ED] text-[#516B58]">
                <ClipboardList size={22} />
              </div>
              <span className="text-[12px] font-extrabold tracking-[0.16em] text-[#496247]">
                Live Orders
              </span>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B0A7A4]">
              Total Orders
            </p>
            <h2 className="mt-1 text-[36px] font-extrabold tracking-[-1px]">
              {statistics?.total_orders ?? 0}
            </h2>
          </div>

          <div className="rounded-[14px] bg-white p-5 shadow-[0_10px_34px_rgba(39,19,16,0.04)] md:rounded-[10px] md:p-8">
            <div className="mb-7 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#FFF3DD] text-[#8C651C]">
                <Banknote size={22} />
              </div>
              <span className="text-[12px] font-extrabold tracking-[0.16em] text-[#8C651C]">
                Earnings
              </span>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B0A7A4]">
              Total Revenue
            </p>
            <h2 className="mt-1 text-[36px] font-extrabold tracking-[-1px]">
              Rp {Number(statistics?.total_revenue || 0).toLocaleString('id-ID')}
            </h2>
          </div>

          <div className="rounded-[14px] bg-[#301713] p-5 text-white shadow-[0_22px_36px_rgba(39,19,16,0.16)] md:rounded-[10px] md:p-8">
            <div className="mb-7 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/10 text-white/70">
                <Timer size={22} />
              </div>
              <span className="mt-1 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-[#86A47D]" />
                Live Status
              </span>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
              Active Queue (Pending)
            </p>
            <div className="mt-1 flex items-end gap-2">
              <h2 className="text-[36px] font-extrabold tracking-[-1px]">{statistics?.pending_orders ?? 0}</h2>
              <span className="mb-2 text-[15px] font-medium text-white/45">
                Orders
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_300px]">
          {/* Left */}
          <div className="space-y-12">
            <div className="min-h-[430px] rounded-[14px] border border-[#ECE8E6] bg-[#FAFAF9] p-5 md:min-h-[520px] md:rounded-[10px] md:p-8">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-[20px] font-extrabold">
                    {chartMode === "daily" ? "Daily Sales Trend" : "Weekly Sales Trend"}
                  </h3>
                  <p className="mt-1 text-[13px] font-medium text-[#8B807D]">
                    {chartMode === "daily"
                      ? "Revenue per operating hour from 09:00 to 18:00"
                      : "Revenue per active weekday from Monday to Friday"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleModeChange("daily")}
                    className={[
                      "rounded-full px-5 py-2 text-[11px] font-extrabold transition",
                      chartMode === "daily"
                        ? "bg-[#301713] text-white"
                        : "bg-white text-[#271310]",
                    ].join(" ")}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => handleModeChange("weekly")}
                    className={[
                      "rounded-full px-5 py-2 text-[11px] font-extrabold transition",
                      chartMode === "weekly"
                        ? "bg-[#301713] text-white"
                        : "bg-white text-[#271310]",
                    ].join(" ")}
                  >
                    Weekly
                  </button>
                </div>
              </div>

              <div className="flex h-[300px] flex-col justify-end md:h-[360px]">
                {hasSalesData ? (
                  <>
                    <div
                      className={`mb-7 grid ${chartGridClass} items-end gap-3 sm:gap-4 md:gap-5`}
                    >
                      {salesTrend.map((item: any) => {
                        const revenue = Number(item.revenue) || 0;
                        const height = maxRevenue > 0 ? Math.max((revenue / maxRevenue) * 100, 6) : 6;

                        return (
                          <div key={item.label} className="flex min-w-0 flex-col items-center gap-3">
                            <span className="text-center text-[10px] font-extrabold text-[#5A4A47]">
                              {formatCompactCurrency(revenue)}
                            </span>
                            <div className="flex h-[190px] items-end md:h-[240px]">
                              <span
                                className="w-4 rounded-full bg-[#301713] md:w-5"
                                style={{ height: `${height}%` }}
                                title={`${item.label}: ${formatCurrency(revenue)} (${item.count} orders)`}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-[#8B807D]">
                              {item.count} trx
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div
                      className={`grid ${chartGridClass} border-t border-[#E8E3E1] pt-2 text-center text-[10px] font-bold uppercase text-[#B0A7A4]`}
                    >
                      {salesTrend.map((item: any) => (
                        <span key={item.label} className="truncate px-1">
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center rounded-[18px] border border-dashed border-[#DED7D3] bg-white/70 px-6 text-center">
                    <Coffee size={34} className="mb-3 text-[#8B807D]" />
                    <h4 className="text-[16px] font-extrabold text-[#271310]">
                      No paid sales yet
                    </h4>
                    <p className="mt-2 max-w-[330px] text-[13px] font-medium leading-relaxed text-[#8B807D]">
                      Chart akan terisi saat ada order completed dengan payment
                      status paid pada periode ini.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-8">
            <div className="rounded-[10px] bg-[#DDEED8] p-6">
              <h3 className="mb-6 text-[14px] font-extrabold uppercase tracking-[0.16em]">
                Peak Roasting Hours
              </h3>

              {peakHours.length > 0 ? (
                <div className="space-y-6">
                  {peakHours.map((item: any) => (
                    <div key={item.label}>
                      <div className="mb-3 flex justify-between gap-3 text-[12px] font-extrabold text-[#4F654C]">
                        <span>{item.label}</span>
                        <span>{item.order_count} orders</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#BCD2B7]">
                        <div
                          className="h-full rounded-full bg-[#53654F]"
                          style={{ width: `${item.capacity_percentage || 0}%` }}
                        />
                      </div>
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6F806B]">
                        {item.capacity_percentage || 0}% relative density
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] font-semibold leading-relaxed text-[#4F654C]">
                  Belum ada transaksi completed dan paid untuk menghitung jam
                  tersibuk.
                </p>
              )}
            </div>

            <div className="rounded-[10px] bg-white p-6 shadow-[0_10px_34px_rgba(39,19,16,0.04)]">
              <h3 className="mb-6 text-[14px] font-extrabold uppercase tracking-[0.12em]">
                Hottest Sellers
              </h3>

              <div className="space-y-5">
                {topMenus.slice(0, 3).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#F3EEE8] text-[13px] font-extrabold text-[#271310]">
                      #{idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-extrabold">
                        {item.name}
                      </p>
                      <p className="text-[9px] font-bold text-[#A69D9A]">
                        {item.total_sold} SOLD
                      </p>
                    </div>
                    <p className="text-[11px] font-extrabold text-[#50634B]">
                      Rp {Number(item.total_revenue).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>

              <button className="mt-7 h-10 w-full rounded-[7px] border border-[#ECE8E6] text-[11px] font-extrabold uppercase tracking-[0.12em] transition hover:bg-[#F9F9F8]">
                View Full Inventory
              </button>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

function formatCurrency(value: number) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function formatCompactCurrency(value: number) {
  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(1)}jt`;
  }

  if (value >= 1000) {
    return `Rp ${Math.round(value / 1000)}rb`;
  }

  return formatCurrency(value);
}
