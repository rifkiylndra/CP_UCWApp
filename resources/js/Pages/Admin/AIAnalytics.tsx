import React from "react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import type { AdminUser } from "@/types/admin";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

interface AIAnalyticsProps {
    auth: { user: AdminUser };
    popularMenus?: any;
    sentimentSummary?: any;
    recentReviews?: any[];
    efficiencyData?: any[];
    aiServiceStatus?: any;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-[10px] bg-[#301713] p-3 shadow-lg border border-[#5A4A47] text-white font-['Manrope'] text-left">
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">
                    Time: {label}
                </p>
                <p className="text-[12px] font-extrabold text-[#F3F8F1] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#60765D]" />
                    AI Estimate: {payload[0]?.value} mins
                </p>
                {payload[1] && (
                    <p className="text-[12px] font-extrabold text-[#EEEAE8] flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#301713]" />
                        Actual: {payload[1]?.value} mins
                    </p>
                )}
            </div>
        );
    }
    return null;
};

export default function AIAnalytics({
    auth,
    popularMenus,
    sentimentSummary,
    recentReviews,
    efficiencyData = [],
    aiServiceStatus,
}: AIAnalyticsProps) {
    const aiMenus = popularMenus?.menus || [];
    const reviews = (recentReviews || []).map((review: any) => {
        const dateObj = new Date(review.created_at);
        const timeString = dateObj.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
        const dateString = dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });

        let statusText = "Neutral";
        if (review.sentiment_label === "positive") statusText = "Highly Satisfied";
        else if (review.sentiment_label === "negative") statusText = "Needs Improvement";

        return {
            id: review.id,
            name: review.order?.customer_name || "Guest User",
            status: statusText,
            rating: review.rating || 0,
            text: review.comment || "",
            time: `${dateString}, ${timeString}`,
            img: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.order?.customer_name || 'Guest')}&background=random`,
        };
    });

    const positivePercent = sentimentSummary?.summary?.positive_percentage ?? 0;
    const neutralPercent = sentimentSummary?.summary?.neutral_percentage ?? 0;
    const negativePercent = sentimentSummary?.summary?.negative_percentage ?? 0;

    const hasSentimentData = (positivePercent + neutralPercent + negativePercent) > 0;
    const donutBg = hasSentimentData
        ? `conic-gradient(#60765D 0% ${positivePercent}%, #D8D1CE ${positivePercent}% ${positivePercent + neutralPercent}%, #B91C1C ${positivePercent + neutralPercent}% 100%)`
        : '#F2EFEE';

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

                        <div className="h-[250px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={efficiencyData}
                                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorEstimated" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#60765D" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#60765D" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#301713" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#301713" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E3E1" />
                                    <XAxis 
                                        dataKey="time" 
                                        tickLine={false} 
                                        axisLine={false}
                                        tick={{ fill: '#A69D9A', fontSize: 10, fontWeight: 600 }}
                                    />
                                    <YAxis 
                                        tickLine={false} 
                                        axisLine={false}
                                        tick={{ fill: '#A69D9A', fontSize: 10, fontWeight: 600 }}
                                        unit="m"
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="Estimated"
                                        stroke="#60765D"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorEstimated)"
                                        name="AI Estimated"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="Actual"
                                        stroke="#301713"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorActual)"
                                        name="Actual"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
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

                        <div 
                            className="mx-auto mt-8 flex h-[160px] w-[160px] sm:h-[190px] sm:w-[190px] items-center justify-center rounded-full transition-all duration-500 ease-in-out shadow-sm"
                            style={{ background: donutBg }}
                        >
                            <div className="flex h-[128px] w-[128px] sm:h-[158px] sm:w-[158px] items-center justify-center rounded-full bg-white text-center shadow-inner">
                                <div>
                                    <h3 className="text-[28px] font-extrabold sm:text-[34px]">
                                        {sentimentSummary?.summary?.average_rating || 0}
                                    </h3>
                                    <p className="text-[10px] font-bold uppercase text-[#A69D9A]">
                                        Avg Index
                                    </p>
                                </div>
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
                            {reviews.length > 0 ? (
                                reviews.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="border-l-4 border-[#60765D] rounded-[14px] bg-[#F5F4F3] p-5"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <img
                                                src={item.img}
                                                alt={item.name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="rounded-[24px] bg-[#301713] p-6 text-white xl:rounded-[34px] xl:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                    <div>
                                                        <p className="text-[12px] font-extrabold uppercase mb-2">
                                                            {item.name}
                                                        </p>
                                                        <span className="rounded-full bg-[#E4E9E1] px-3 py-1 text-[9px] font-extrabold uppercase text-[#60765D]">
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                    {item.rating > 0 && (
                                                        <div className="flex gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <svg
                                                                    key={i}
                                                                    width="16"
                                                                    height="16"
                                                                    viewBox="0 0 24 24"
                                                                    fill={i < item.rating ? "#F59E0B" : "rgba(255,255,255,0.2)"}
                                                                >
                                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-[13px] italic leading-relaxed text-[#5A4A47] mt-4">
                                                    "{item.text}"
                                                </p>
                                                <p className="mt-3 text-[10px] font-bold uppercase text-[#A69D9A]">
                                                    {item.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-[#A69D9A] font-semibold">
                                    No recent reviews yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}
