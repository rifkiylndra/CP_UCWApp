import React, { useState, useEffect } from "react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import type { AdminUser } from "@/types/admin";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface AIReview {
    id: string;
    customerName: string;
    avatar?: string;
    status: "HIGHLY SATISFIED" | "OPTIMIZED" | "NEUTRAL" | "CRITICAL";
    text: string;
    timestamp: string;
}

interface AIAnalyticsProps {
    auth: { user: AdminUser };
    recentReviews?: AIReview[];
}

export default function AIAnalytics({ auth, recentReviews }: AIAnalyticsProps) {
    const [estimationData, setEstimationData] = useState<any>(null);
    const [popularMenuData, setPopularMenuData] = useState<any>(null);
    const [sentimentData, setSentimentData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ── Fallback Dummy Data for Initial Load & Failure ──
    const dummyEstimation = [
        { time: "08:00", actual: 12, estimated: 11 },
        { time: "10:00", actual: 18, estimated: 19 },
        { time: "12:00", actual: 25, estimated: 23 },
        { time: "14:00", actual: 20, estimated: 22 },
        { time: "16:00", actual: 15, estimated: 16 },
        { time: "18:00", actual: 10, estimated: 12 },
    ];

    const dummyPopularMenu = [
        { name: "Single Origin Flat White", progress: 84 },
        { name: "Oat Milk Latte", progress: 76 },
        { name: "Matcha Presso", progress: 62 },
        { name: "V60 Pour Over", progress: 45 },
        { name: "Almond Croissant", progress: 38 },
    ];

    const dummySentiment = [
        { name: "Positive", value: 92, color: "#4CAF50" },
        { name: "Neutral", value: 5.6, color: "#F59E0B" },
        { name: "Critical", value: 2.4, color: "#EF4444" },
    ];

    const defaultReviews =
        recentReviews ||
        ([
            {
                id: "1",
                customerName: "Alex Mercer",
                avatar: "https://i.pravatar.cc/150?img=33",
                status: "HIGHLY SATISFIED",
                text: "The estimated wait time was perfectly accurate. Got my coffee right as I approached the counter.",
                timestamp: "10 mins ago",
            },
            {
                id: "2",
                customerName: "Dana Scully",
                avatar: "https://i.pravatar.cc/150?img=47",
                status: "OPTIMIZED",
                text: "Menu recommendations were spot on based on my previous orders.",
                timestamp: "1 hour ago",
            },
            {
                id: "3",
                customerName: "Fox Mulder",
                avatar: "https://i.pravatar.cc/150?img=12",
                status: "CRITICAL",
                text: "Wait time was slightly longer than the AI prediction during the peak hour rush.",
                timestamp: "3 hours ago",
            },
            {
                id: "4",
                customerName: "Monica Reyes",
                avatar: "https://i.pravatar.cc/150?img=5",
                status: "NEUTRAL",
                text: "Standard experience. Nothing exceptionally bad or good.",
                timestamp: "Yesterday",
            },
        ] as AIReview[]);

    // ── Fetch AI Service Data via Laravel Proxy ──
    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            fetch("/api/ai/estimation/performance").catch(() => null),
            fetch("/api/ai/menu/popular").catch(() => null),
            fetch("/api/ai/sentiment/summary").catch(() => null),
        ])
            .then((responses) => {
                return Promise.all(
                    responses.map((res) => {
                        if (res && res.ok) return res.json().catch(() => null);
                        return null;
                    }),
                );
            })
            .then(([estimation, popularMenu, sentiment]) => {
                setEstimationData(estimation || dummyEstimation);
                setPopularMenuData(popularMenu || dummyPopularMenu);
                setSentimentData(sentiment || dummySentiment);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching AI data, using fallbacks.", err);
                setEstimationData(dummyEstimation);
                setPopularMenuData(dummyPopularMenu);
                setSentimentData(dummySentiment);
                setIsLoading(false);
            });
    }, []);

    const displayEstimation = estimationData || dummyEstimation;
    const displayPopular = popularMenuData || dummyPopularMenu;
    const displaySentiment = sentimentData || dummySentiment;

    return (
        <AdminLayout
            auth={auth}
            title="AI Analytics Hub"
            currentRoute="admin.analytics"
        >
            {/* ── Header Section ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[32px] font-black tracking-tight text-[#1A1208] leading-tight flex items-center gap-3">
                        AI Analytics Hub
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#C8A96E"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mt-1"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                    </h1>
                    <p className="text-[#8B7B6B] font-medium text-[14px] mt-1">
                        Machine Learning models analyzing store efficiency and
                        customer satisfaction.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-[#E8F2E8] border border-[#CDE3CD] flex items-center gap-2 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse"></span>
                        <span className="text-[11px] font-bold text-[#2E5A2E] uppercase tracking-widest">
                            Model Confidence 98.4%
                        </span>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-[#F0F5FF] border border-[#D1E1FF] flex items-center gap-2 shadow-sm">
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                        <span className="text-[11px] font-bold text-[#1E40AF] uppercase tracking-widest">
                            Active Forecasts 2,142
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Grid Top: Efficiency Tracker & Menu Velocity ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Section 1: Efficiency Tracker */}
                <div className="lg:col-span-2 bg-white rounded-[24px] p-7 border border-[#E8E2DB] shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-[18px] font-black tracking-tight text-[#1A1208]">
                                Efficiency Tracker
                            </h2>
                            <p className="text-[12px] font-medium text-[#8B7B6B]">
                                Actual Wait Time vs AI Estimated (MLR)
                            </p>
                        </div>
                        <div className="flex p-1 bg-[#F5F3F0] rounded-xl border border-[#E8E2DB]">
                            <button className="px-4 py-1.5 rounded-lg bg-white shadow-sm text-[12px] font-bold text-[#1A1208]">
                                Today
                            </button>
                            <button className="px-4 py-1.5 rounded-lg text-[12px] font-bold text-[#8B7B6B]">
                                7D
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-[300px]">
                        {isLoading ? (
                            <div className="w-full h-full bg-[#F5F3F0] animate-pulse rounded-2xl flex items-center justify-center">
                                <span className="text-[12px] font-bold text-[#8B7B6B] tracking-widest uppercase">
                                    Connecting to AI Core...
                                </span>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={displayEstimation}
                                    margin={{
                                        top: 5,
                                        right: 20,
                                        bottom: 5,
                                        left: -20,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#E8E2DB"
                                    />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: "#8B7B6B",
                                            fontSize: 11,
                                            fontWeight: "bold",
                                        }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: "#8B7B6B",
                                            fontSize: 11,
                                            fontWeight: "bold",
                                        }}
                                        dx={-10}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{
                                            borderRadius: "16px",
                                            border: "none",
                                            boxShadow:
                                                "0 8px 30px rgba(0,0,0,0.12)",
                                            padding: "12px 16px",
                                        }}
                                        labelStyle={{
                                            fontWeight: "bold",
                                            color: "#1A1208",
                                            marginBottom: "4px",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="actual"
                                        stroke="#2D1A0E"
                                        strokeWidth={4}
                                        dot={{
                                            r: 4,
                                            strokeWidth: 2,
                                            fill: "#fff",
                                        }}
                                        activeDot={{ r: 6 }}
                                        name="Actual Wait (mins)"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="estimated"
                                        stroke="#C8A96E"
                                        strokeWidth={3}
                                        strokeDasharray="6 4"
                                        dot={false}
                                        activeDot={{ r: 5, fill: "#C8A96E" }}
                                        name="AI Estimated (mins)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Section 2: Menu Velocity */}
                <div className="bg-white rounded-[24px] p-7 border border-[#E8E2DB] shadow-sm flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-[18px] font-black tracking-tight text-[#1A1208]">
                            Menu Velocity
                        </h2>
                        <p className="text-[12px] font-medium text-[#8B7B6B]">
                            Popular Ranking Forecast (WMA)
                        </p>
                    </div>

                    <div className="flex-1 flex flex-col gap-5 justify-center">
                        {isLoading
                            ? Array(5)
                                  .fill(0)
                                  .map((_, i) => (
                                      <div
                                          key={i}
                                          className="w-full h-12 bg-[#F5F3F0] animate-pulse rounded-xl"
                                      ></div>
                                  ))
                            : displayPopular.map((item: any, idx: number) => (
                                  <div
                                      key={idx}
                                      className="flex flex-col gap-2"
                                  >
                                      <div className="flex justify-between items-center text-[13px]">
                                          <span className="font-bold text-[#1A1208]">
                                              {item.name}
                                          </span>
                                          <span
                                              className="font-black"
                                              style={{
                                                  color:
                                                      idx === 0
                                                          ? "#C8A96E"
                                                          : "#1A1208",
                                              }}
                                          >
                                              {item.progress}%
                                          </span>
                                      </div>
                                      <div className="w-full h-2.5 bg-[#F5F3F0] rounded-full overflow-hidden">
                                          <div
                                              className="h-full rounded-full transition-all duration-1000 ease-out"
                                              style={{
                                                  width: `${item.progress}%`,
                                                  backgroundColor:
                                                      idx === 0
                                                          ? "#C8A96E"
                                                          : "#2D1A0E",
                                              }}
                                          ></div>
                                      </div>
                                  </div>
                              ))}
                    </div>
                </div>
            </div>

            {/* ── Grid Middle: Sentiment, AI Assist, Rush Prediction ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Section 3: Sentiment Polarity */}
                <div className="bg-white rounded-[24px] p-7 border border-[#E8E2DB] shadow-sm flex flex-col">
                    <div className="mb-2 text-center">
                        <h2 className="text-[18px] font-black tracking-tight text-[#1A1208]">
                            Sentiment Polarity
                        </h2>
                        <p className="text-[12px] font-medium text-[#8B7B6B]">
                            Naive Bayes Customer Analysis
                        </p>
                    </div>

                    <div className="relative flex-1 flex flex-col items-center justify-center min-h-[220px]">
                        {isLoading ? (
                            <div className="w-40 h-40 rounded-full border-[10px] border-[#F5F3F0] border-t-[#C8A96E] animate-spin"></div>
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={displaySentiment}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={85}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="none"
                                            cornerRadius={8}
                                        >
                                            {displaySentiment.map(
                                                (entry: any, index: number) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <RechartsTooltip
                                            contentStyle={{
                                                borderRadius: "12px",
                                                border: "none",
                                                boxShadow:
                                                    "0 4px 20px rgba(0,0,0,0.1)",
                                            }}
                                            formatter={(value) => [
                                                `${value}%`,
                                                "Share",
                                            ]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B7B6B]">
                                        AVG Index
                                    </span>
                                    <span className="text-[36px] font-black text-[#1A1208] leading-none">
                                        4.8
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex justify-center gap-4 mt-2">
                        {displaySentiment.map((s: any, idx: number) => (
                            <div
                                key={idx}
                                className="flex items-center gap-1.5"
                            >
                                <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: s.color }}
                                ></span>
                                <span className="text-[11px] font-bold text-[#8B7B6B] uppercase tracking-wider">
                                    {s.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 5 & 6 */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Section 5: Barista AI Assist */}
                    <div className="bg-[#1A1208] text-white rounded-[24px] p-8 shadow-xl flex flex-col justify-between relative overflow-hidden group">
                        <svg
                            className="absolute right-[-20px] top-[-20px] w-48 h-48 text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-700"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>

                        <div className="relative z-10 mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-[#C8A96E]/20 text-[#C8A96E] flex items-center justify-center">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                    </svg>
                                </div>
                                <h3 className="text-[14px] font-bold tracking-widest uppercase text-[#C8A96E]">
                                    Barista AI Assist
                                </h3>
                            </div>
                            <p className="text-[16px] font-medium leading-relaxed text-white/90">
                                "Consider assigning an extra barista to the
                                espresso station between 08:00 - 10:00 AM
                                tomorrow to maintain estimated wait times below
                                15 mins."
                            </p>
                        </div>

                        <button className="relative z-10 w-full py-3.5 rounded-xl bg-white text-[#1A1208] text-[13px] font-bold tracking-wide hover:bg-[#F5F3F0] transition-colors shadow-lg active:scale-[0.98]">
                            Auto-Schedule Review
                        </button>
                    </div>

                    {/* Section 6: Friday Rush Prediction */}
                    <div className="bg-white rounded-[24px] overflow-hidden shadow-sm relative group cursor-pointer border border-[#E8E2DB]">
                        <div className="absolute inset-0 bg-[#2D1A0E]">
                            <img
                                src="https://images.unsplash.com/photo-1559925393-8be0a33e50f1?w=800&q=80"
                                alt="Rush Prediction"
                                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208] via-[#1A1208]/60 to-transparent"></div>
                        <div className="absolute inset-0 p-7 flex flex-col justify-end">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#E8F2E8]/20 backdrop-blur-md border border-[#E8F2E8]/30 self-start mb-3 text-white">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-pulse"></span>
                                <span className="text-[9px] font-bold tracking-widest uppercase">
                                    High Demand Expected
                                </span>
                            </div>
                            <h3 className="text-white text-[22px] font-black tracking-tight mb-2 leading-tight">
                                Friday Rush Prediction
                            </h3>
                            <p className="text-white/80 text-[13px] font-medium leading-relaxed">
                                Forecast indicates a 34% spike in Matcha Presso
                                orders this upcoming Friday afternoon.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Section 4: Recent AI Context Reviews ── */}
            <div className="bg-white rounded-[24px] border border-[#E8E2DB] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[#E8E2DB] flex items-center justify-between">
                    <div>
                        <h2 className="text-[18px] font-black tracking-tight text-[#1A1208]">
                            Recent AI Context Reviews
                        </h2>
                        <p className="text-[12px] font-medium text-[#8B7B6B] mt-0.5">
                            Customer feedback processed and tagged by Natural
                            Language Processing.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col">
                    {defaultReviews.map((review) => (
                        <div
                            key={review.id}
                            className="flex gap-4 p-6 border-b last:border-b-0 border-[#E8E2DB] hover:bg-[#F5F3F0]/30 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#F5F3F0] flex-shrink-0 border border-[#E8E2DB] overflow-hidden">
                                {review.avatar ? (
                                    <img
                                        src={review.avatar}
                                        alt={review.customerName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#1A1208] font-bold text-[14px]">
                                        {review.customerName.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5 gap-2">
                                    <h4 className="font-bold text-[#1A1208] text-[15px]">
                                        {review.customerName}
                                    </h4>
                                    <span className="text-[11px] font-bold tracking-wider text-[#8B7B6B] uppercase">
                                        {review.timestamp}
                                    </span>
                                </div>

                                <div className="mb-2.5">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase border ${
                                            review.status === "HIGHLY SATISFIED"
                                                ? "bg-[#E8F2E8] text-[#2E5A2E] border-[#CDE3CD]"
                                                : review.status === "OPTIMIZED"
                                                  ? "bg-[#F0F5FF] text-[#1E40AF] border-[#D1E1FF]"
                                                  : review.status === "CRITICAL"
                                                    ? "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]"
                                                    : "bg-[#F5F3F0] text-[#1A1208] border-[#E8E2DB]"
                                        }`}
                                    >
                                        {review.status}
                                    </span>
                                </div>

                                <p className="text-[13.5px] text-[#4A3F35] leading-relaxed font-medium">
                                    "{review.text}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
