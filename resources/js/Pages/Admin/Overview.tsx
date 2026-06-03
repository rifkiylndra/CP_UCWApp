import React from "react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import type { AdminUser } from "@/types/admin";
import {
  ClipboardList,
  Banknote,
  Timer,
  Coffee,
  RefreshCw,
  Printer,
  Headphones,
} from "lucide-react";

interface OverviewProps {
  auth: { user: AdminUser };
  statistics?: any;
  topMenus?: any;
  weeklySales?: any;
}

export default function Overview({ auth, statistics, topMenus = [], weeklySales = [] }: OverviewProps) {
  // Chart Calculation
  const maxRevenue = weeklySales.length > 0 ? Math.max(...weeklySales.map((s: any) => parseFloat(s.revenue) || 0)) : 100;

  const chartDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  });

  const chartHeights = chartDays.map(dayStr => {
    const saleInfo = weeklySales.find((s: any) => {
      const d = new Date(s.date);
      return d.toLocaleDateString('en-US', { weekday: 'short' }) === dayStr;
    });
    return saleInfo ? Math.max(((parseFloat(saleInfo.revenue) || 0) / (maxRevenue || 1)) * 100, 5) : 5;
  });

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
              {statistics?.total_orders ?? "1,248"}
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
              Rp {statistics?.total_revenue?.toLocaleString('id-ID') ?? "14,520"}
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
              <h2 className="text-[36px] font-extrabold tracking-[-1px]">{statistics?.pending_orders ?? "18"}</h2>
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
                    Weekly Sales Trends
                  </h3>
                  <p className="mt-1 text-[13px] font-medium text-[#8B807D]">
                    Volume tracking across peaks and lulls
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="rounded-full bg-white px-5 py-2 text-[11px] font-extrabold">
                    Daily
                  </button>
                  <button className="rounded-full bg-[#301713] px-5 py-2 text-[11px] font-extrabold text-white">
                    Weekly
                  </button>
                </div>
              </div>

              <div className="flex h-[300px] flex-col justify-end md:h-[360px]">
                <div className="mb-9 grid grid-cols-7 items-end gap-3 sm:gap-5 md:gap-8">
                  {chartHeights.map((height, index) => (
                    <div key={index} className="flex flex-col items-center gap-5">
                      <div className="flex h-[210px] items-end gap-1.5 md:h-[250px] md:gap-2">
                        <span
                          className="w-3 rounded-full bg-[#DDEED8]"
                          style={{ height: `${height}%` }}
                        />
                        <span
                          className="w-3 rounded-full bg-[#301713]"
                          style={{ height: `${Math.max(height - 18, 5)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 border-t border-[#E8E3E1] pt-2 text-center text-[10px] font-bold uppercase text-[#B0A7A4]">
                  {chartDays.map(
                    (day) => (
                      <span
                        key={day}
                        className={day === chartDays[6] ? "text-[#271310]" : ""}
                      >
                        {day}
                      </span>
                    )
                  )}
                </div>

                <div className="mt-10 flex items-center gap-8 text-[12px] font-semibold text-[#6F625F]">
                  <span className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-[#301713]" />
                    Selected Period
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-[#DDEED8]" />
                    Previous Period
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-8">
            <div className="rounded-[10px] bg-[#DDEED8] p-6">
              <h3 className="mb-6 text-[14px] font-extrabold uppercase tracking-[0.16em]">
                Peak Roasting Hours
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="mb-3 flex justify-between text-[12px] font-extrabold text-[#4F654C]">
                    <span>08:00 - 10:00 AM</span>
                    <span>88% Capacity</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#BCD2B7]">
                    <div className="h-full w-[88%] rounded-full bg-[#53654F]" />
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex justify-between text-[12px] font-extrabold text-[#4F654C]">
                    <span>02:00 - 04:00 PM</span>
                    <span>62% Capacity</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#BCD2B7]">
                    <div className="h-full w-[62%] rounded-full bg-[#53654F]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[10px] bg-white p-6 shadow-[0_10px_34px_rgba(39,19,16,0.04)]">
              <h3 className="mb-6 text-[14px] font-extrabold uppercase tracking-[0.12em]">
                Hottest Sellers
              </h3>

              <div className="space-y-5">
                {topMenus.slice(0, 3).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src={`https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?q=80&w=120&auto=format&fit=crop&random=${idx}`}
                      alt={item.name}
                      className="h-10 w-10 rounded-[8px] object-cover"
                    />
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
