import React from "react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import type { AdminUser } from "@/types/admin";

interface AIAnalyticsProps {
    auth: { user: AdminUser };
    popularMenus?: any;
    sentimentSummary?: any;
    aiServiceStatus?: any;
}

export default function AIAnalytics({
    auth,
    popularMenus,
    sentimentSummary,
    aiServiceStatus,
}: AIAnalyticsProps) {
    const aiMenus = popularMenus?.menus || [];

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
        <AdminLayout
            auth={auth}
            title="AI Analytics"
            currentRoute="admin.analytics"
        >
            <section className="font-['Manrope'] text-[#271310]">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-5 xl:mb-10 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                        <h1 className="text-[28px] font-extrabold tracking-[-1px] sm:text-[34px] xl:text-[42px] xl:tracking-[-2px]">
                            AI Analytics Hub
                        </h1>
                        <p className="mt-3 max-w-[650px] text-[14px] leading-relaxed text-[#5A4A47] sm:text-[15px] xl:text-[16px]">
                            Predictive intelligence for your barista operations.
                            Using Weighted Moving Averages and NLP sentiment
                            analysis.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 xl:flex xl:gap-4">
                        <div className="rounded-[14px] bg-white px-4 py-4 text-center shadow-[0_10px_28px_rgba(39,19,16,0.04)] sm:px-6 xl:px-8">
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8B807D]">
                                AI Link Status
                            </p>
                            <h2
                                className={`mt-1 text-[18px] font-extrabold ${aiServiceStatus?.status === "online"
                                    ? "text-[#60765D]"
                                    : "text-[#B91C1C]"
                                    }`}
                            >
                                {aiServiceStatus?.status === "online"
                                    ? "Online"
                                    : "Offline"}
                            </h2>
                        </div>

                        <div className="rounded-[10px] bg-[#301713] px-8 py-4 text-center text-white">
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/50">
                                Active Forecasts
                            </p>
                            <h2 className="mt-1 text-[24px] font-extrabold">
                                2,142
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Top */}
                <div className="mb-8 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_300px]">
                    <div className="min-h-[300px] rounded-[20px] bg-white p-5 sm:p-6 xl:min-h-[360px] xl:rounded-[28px] xl:p-8">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between">
                            <div>
                                <p className="text-[10px] font-extrabold uppercase tracking-[0.32em] text-[#5D725A]">
                                    Performance Architecture
                                </p>
                                <h2 className="mt-3 text-[24px] font-extrabold">
                                    Efficiency Tracker
                                </h2>
                            </div>

                            <div className="flex flex-wrap gap-4 text-[11px] font-semibold text-[#6F625F]">
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
                                {[
                                    "08:00",
                                    "10:00",
                                    "12:00",
                                    "14:00",
                                    "16:00",
                                    "18:00",
                                ].map((item) => (
                                    <span key={item}>{item}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[20px] bg-[#FAFAF9] p-5 sm:p-6 xl:rounded-[28px] xl:p-8">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.32em] text-[#8B807D]">
                            Menu Velocity (WMA)
                        </p>
                        <h2 className="mt-3 text-[23px] font-extrabold">
                            Popular Ranking
                        </h2>

                        <div className="mt-8 space-y-6">
                            {aiMenus.length > 0 ? (
                                aiMenus.map((item: any, idx: number) => {
                                    const name = item.nama || item.name || "Unknown Menu";
                                    const value = item.persentase || Math.min(100, (item.total_sold || 0) * 2);

                                    return (
                                        <div key={idx}>
                                            <div className="mb-2 flex justify-between text-[11px] font-extrabold uppercase">
                                                <span className="max-w-[180px] truncate">
                                                    {name}
                                                </span>
                                                <span>{value}%</span>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-[#EEEAE8]">
                                                <div
                                                    className="h-full rounded-full bg-[#301713]"
                                                    style={{ width: `${value}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-[12px] font-medium text-[#A69D9A]">
                                    Belum ada data WMA populer.
                                </p>
                            )}
                        </div>

                        <button className="mt-8 border-b border-[#271310] text-[11px] font-extrabold uppercase">
                            Export Demand Dataset
                        </button>
                    </div>
                </div>

                {/* Middle */}
                <div className="mb-10 grid grid-cols-1 gap-8 xl:grid-cols-[360px_1fr]">
                    <div className="rounded-[20px] bg-white p-5 sm:p-6 xl:rounded-[28px] xl:p-8 shadow-[0_10px_30px_rgba(39,19,16,0.04)]">
                        <h2 className="text-[24px] font-extrabold">
                            Sentiment Polarity{" "}
                            <span className="text-[12px] text-[#60765D]">
                                ↗ +12% vs LY
                            </span>
                        </h2>

                        <div className="mx-auto mt-8 flex h-[160px] w-[160px] sm:h-[190px] sm:w-[190px] items-center justify-center rounded-full border-[16px] border-[#F2EFEE]">
                            <div className="text-center">
                                <h3 className="text-[28px] font-extrabold sm:text-[34px]">
                                    4.8
                                </h3>
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
                                    {sentimentSummary?.summary?.positive_percentage || 0}%
                                </h3>
                            </div>
                            <div className="rounded-[12px] bg-[#FFF6F6] py-5 text-center">
                                <p className="text-[10px] font-extrabold uppercase text-[#B91C1C]">
                                    Critical
                                </p>
                                <h3 className="text-[22px] font-extrabold text-[#B91C1C]">
                                    {sentimentSummary?.summary?.negative_percentage || 0}%
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
                                    <div className="flex flex-col gap-4 sm:flex-row">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="rounded-[24px] bg-[#301713] p-6 text-white xl:rounded-[34px] xl:p-10">
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
            </section>
        </AdminLayout>
    );
}
