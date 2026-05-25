import React from "react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import type { AdminUser } from "@/types/admin";

interface AIAnalyticsProps {
  auth: { user: AdminUser };
}

export default function AIAnalytics({ auth }: AIAnalyticsProps) {
  const menu = [
    ["Single Origin Flat White", 84],
    ["Honey Oat Latte", 76],
    ["Cascara Tonic", 62],
    ["Artisan Pastry Selection", 48],
  ];

  const reviews = [
    {
      name: "Marcus Thorne",
      status: "Highly Satisfied",
      text: "The estimated wait time was perfectly accurate. The AI seems to have mastered the morning rush logic here.",
      time: "Today, 09:42 AM",
      img: "https://i.pravatar.cc/100?img=12",
    },
    {
      name: "Elena Rossi",
      status: "Optimized",
      text: "Menu recommendations were spot on based on the weather. Cascara Tonic was refreshing.",
      time: "Today, 11:15 AM",
      img: "https://i.pravatar.cc/100?img=47",
    },
    {
      name: "Julian Chen",
      status: "Neutral",
      text: "The workspace was a bit busy, but the digital check-in helped.",
      time: "Today, 12:08 PM",
      img: "https://i.pravatar.cc/100?img=11",
    },
  ];

  return (
    <AdminLayout auth={auth} title="AI Analytics" currentRoute="admin.analytics">
      <section className="font-['Manrope'] text-[#271310]">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[42px] font-extrabold tracking-[-2px]">
              AI Analytics Hub
            </h1>
            <p className="mt-3 max-w-[650px] text-[16px] leading-relaxed text-[#5A4A47]">
              Predictive intelligence for your barista operations. Using
              Weighted Moving Averages and NLP sentiment analysis.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="rounded-[10px] bg-white px-8 py-4 text-center shadow-[0_10px_28px_rgba(39,19,16,0.04)]">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8B807D]">
                Model Confidence
              </p>
              <h2 className="mt-1 text-[24px] font-extrabold">98.4%</h2>
            </div>

            <div className="rounded-[10px] bg-[#301713] px-8 py-4 text-center text-white">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/50">
                Active Forecasts
              </p>
              <h2 className="mt-1 text-[24px] font-extrabold">2,142</h2>
            </div>
          </div>
        </div>

        {/* Top */}
        <div className="mb-8 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_300px]">
          <div className="min-h-[360px] rounded-[28px] bg-white p-8">
            <div className="mb-8 flex justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.32em] text-[#5D725A]">
                  Performance Architecture
                </p>
                <h2 className="mt-3 text-[24px] font-extrabold">
                  Efficiency Tracker
                </h2>
              </div>

              <div className="flex gap-5 text-[11px] font-semibold text-[#6F625F]">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border border-[#8B807D] bg-[#D8D1CE]" />
                  Actual
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#60765D]" />
                  AI Estimated
                </span>
              </div>
            </div>

            <div className="flex h-[250px] flex-col justify-end">
              <div className="relative h-[190px]">
                <div className="absolute left-0 top-[55%] h-[3px] w-full rounded-full bg-[#E8E3E1]" />
                <div className="absolute left-[8%] top-[45%] h-[3px] w-[78%] rotate-[-8deg] rounded-full bg-[#60765D]" />
                <div className="absolute left-[12%] top-[60%] h-[3px] w-[72%] rotate-[5deg] rounded-full bg-[#301713]" />
              </div>

              <div className="grid grid-cols-6 text-center text-[10px] font-semibold text-[#A69D9A]">
                {["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"].map(
                  (item) => (
                    <span key={item}>{item}</span>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-[#FAFAF9] p-8">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.32em] text-[#8B807D]">
              Menu Velocity (WMA)
            </p>
            <h2 className="mt-3 text-[23px] font-extrabold">
              Popular Ranking
            </h2>

            <div className="mt-8 space-y-6">
              {menu.map(([name, value]) => (
                <div key={name as string}>
                  <div className="mb-2 flex justify-between text-[11px] font-extrabold uppercase">
                    <span>{name}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#EEEAE8]">
                    <div
                      className="h-full rounded-full bg-[#301713]"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 border-b border-[#271310] text-[11px] font-extrabold uppercase">
              Export Demand Dataset
            </button>
          </div>
        </div>

        {/* Middle */}
        <div className="mb-10 grid grid-cols-1 gap-8 xl:grid-cols-[360px_1fr]">
          <div className="rounded-[28px] bg-white p-8 shadow-[0_10px_30px_rgba(39,19,16,0.04)]">
            <h2 className="text-[24px] font-extrabold">
              Sentiment Polarity{" "}
              <span className="text-[12px] text-[#60765D]">↗ +12% vs LY</span>
            </h2>

            <div className="mx-auto mt-12 flex h-[190px] w-[190px] items-center justify-center rounded-full border-[16px] border-[#F2EFEE]">
              <div className="text-center">
                <h3 className="text-[34px] font-extrabold">4.8</h3>
                <p className="text-[10px] font-bold uppercase text-[#A69D9A]">
                  Avg Index
                </p>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="rounded-[12px] bg-[#F3F8F1] py-5 text-center">
                <p className="text-[10px] font-extrabold uppercase text-[#60765D]">
                  Positive
                </p>
                <h3 className="text-[22px] font-extrabold text-[#60765D]">
                  92%
                </h3>
              </div>
              <div className="rounded-[12px] bg-[#FFF6F6] py-5 text-center">
                <p className="text-[10px] font-extrabold uppercase text-[#B91C1C]">
                  Critical
                </p>
                <h3 className="text-[22px] font-extrabold text-[#B91C1C]">
                  2.4%
                </h3>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-8 shadow-[0_10px_30px_rgba(39,19,16,0.04)]">
            <h2 className="mb-7 text-[24px] font-extrabold">
              Recent AI Context Reviews
            </h2>

            <div className="space-y-5">
              {reviews.map((item) => (
                <div
                  key={item.name}
                  className="border-l-4 border-[#60765D] rounded-[14px] bg-[#F5F4F3] p-5"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="mb-2 flex justify-between">
                        <p className="text-[12px] font-extrabold uppercase">
                          {item.name}
                        </p>
                        <span className="rounded-full bg-[#E4E9E1] px-3 py-1 text-[9px] font-extrabold uppercase text-[#60765D]">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[13px] italic leading-relaxed text-[#5A4A47]">
                        "{item.text}"
                      </p>
                      <p className="mt-3 text-[10px] font-bold uppercase text-[#A69D9A]">
                        {item.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[300px_1fr]">
          <div className="rounded-[34px] bg-[#301713] p-10 text-white">
            <h2 className="text-[32px] font-extrabold leading-tight">
              Barista AI <br /> Assist
            </h2>
            <p className="mt-6 text-[14px] leading-relaxed text-white/55">
              System suggests increasing staff for the 08:00 - 10:00 window
              tomorrow based on local event data.
            </p>

            <button className="mt-16 h-14 w-full rounded-[14px] bg-white/85 text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#301713]">
              Auto-Schedule Review
            </button>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-[34px] bg-[#301713] p-12 text-white">
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop"
              alt="Coffee"
              className="absolute inset-0 h-full w-full object-cover opacity-45 grayscale"
            />
            <div className="relative z-10 flex h-full flex-col justify-end">
              <p className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.45em]">
                Upcoming Peak
              </p>
              <h2 className="text-[34px] font-extrabold">
                Friday Rush Prediction
              </h2>
              <p className="mt-4 max-w-[650px] text-[15px] leading-relaxed text-white/75">
                Expect a 24% increase in artisan pastry demand between 09:00 and
                11:00 AM. Pre-heat secondary oven by 08:30.
              </p>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}