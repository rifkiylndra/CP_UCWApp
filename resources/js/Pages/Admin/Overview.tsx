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
}

export default function Overview({ auth }: OverviewProps) {
  const sellers = [
    {
      name: "Double Espresso",
      sold: "482 SOLD",
      revenue: "+$2,410",
      img: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?q=80&w=120&auto=format&fit=crop",
    },
    {
      name: "Oat Milk Latte",
      sold: "312 SOLD",
      revenue: "+$1,872",
      img: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=120&auto=format&fit=crop",
    },
    {
      name: "Matcha Ceremonial",
      sold: "188 SOLD",
      revenue: "+$1,316",
      img: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=120&auto=format&fit=crop",
    },
  ];

  const staff = [
    {
      name: "Elena Gilbert",
      role: "Head Barista",
      img: "https://i.pravatar.cc/100?img=47",
    },
    {
      name: "Markus Thorne",
      role: "Brew Specialist",
      img: "https://i.pravatar.cc/100?img=12",
    },
    {
      name: "Sasha Lee",
      role: "Service Lead",
      img: "https://i.pravatar.cc/100?img=32",
    },
  ];

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
                +12% Today
              </span>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B0A7A4]">
              Total Orders
            </p>
            <h2 className="mt-1 text-[36px] font-extrabold tracking-[-1px]">
              1,248
            </h2>
          </div>

          <div className="rounded-[14px] bg-white p-5 shadow-[0_10px_34px_rgba(39,19,16,0.04)] md:rounded-[10px] md:p-8">
            <div className="mb-7 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#FFF3DD] text-[#8C651C]">
                <Banknote size={22} />
              </div>
              <span className="text-[12px] font-extrabold tracking-[0.16em] text-[#8C651C]">
                +4.2% Today
              </span>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B0A7A4]">
              Daily Revenue
            </p>
            <h2 className="mt-1 text-[36px] font-extrabold tracking-[-1px]">
              $14,520
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
              Active Queue
            </p>
            <div className="mt-1 flex items-end gap-2">
              <h2 className="text-[36px] font-extrabold tracking-[-1px]">18</h2>
              <span className="mb-2 text-[15px] font-medium text-white/45">
                Mins
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
                  {[34, 52, 44, 66, 90, 58, 42].map((height, index) => (
                    <div key={index} className="flex flex-col items-center gap-5">
                      <div className="flex h-[210px] items-end gap-1.5 md:h-[250px] md:gap-2">
                        <span
                          className="w-3 rounded-full bg-[#DDEED8]"
                          style={{ height: `${height}%` }}
                        />
                        <span
                          className="w-3 rounded-full bg-[#301713]"
                          style={{ height: `${Math.max(height - 18, 24)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 border-t border-[#E8E3E1] pt-2 text-center text-[10px] font-bold uppercase text-[#B0A7A4]">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <span
                        key={day}
                        className={day === "Fri" ? "text-[#271310]" : ""}
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

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr] lg:gap-8">
              <div className="rounded-[10px] bg-[#4A2A24] p-6 text-white">
                <p className="mb-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/40">
                  Loyalty Insights
                </p>
                <h3 className="text-[18px] font-semibold leading-snug">
                  24 new members joined the editorial lounge this morning.
                </h3>
              </div>

              <div className="rounded-[10px] border border-[#ECE8E6] bg-[#FAFAF9] p-7">
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-[15px] font-extrabold uppercase tracking-[0.12em]">
                    Active Staff Activity
                  </h3>
                  <p className="text-[12px] font-medium text-[#B0A7A4]">
                    Current Shift: 06:00 - 14:00
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  {staff.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-4 rounded-[10px] bg-white p-4"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-[13px] font-extrabold">
                          {item.name}
                        </p>
                        <p className="text-[10px] font-semibold text-[#8B807D]">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  ))}
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
                {sellers.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-10 w-10 rounded-[8px] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-extrabold">
                        {item.name}
                      </p>
                      <p className="text-[9px] font-bold text-[#A69D9A]">
                        {item.sold}
                      </p>
                    </div>
                    <p className="text-[11px] font-extrabold text-[#50634B]">
                      {item.revenue}
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

        {/* Floating Bottom Status */}
        <div className="pointer-events-none fixed bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-7 rounded-full bg-white px-8 py-4 shadow-[0_18px_45px_rgba(39,19,16,0.10)] lg:flex">
          <span className="flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.16em]">
            <span className="h-3 w-3 rounded-full bg-[#5D7B5A]" />
            System Online
          </span>
          <span className="h-6 w-px bg-[#E8E3E1]" />
          <Printer size={18} />
          <RefreshCw size={18} />
          <Headphones size={18} />
        </div>
      </section>
    </AdminLayout>
  );
}