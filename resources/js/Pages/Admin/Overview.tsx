import React from 'react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import StatCard from '@/Components/UI/StatCard';
import type { AdminUser } from '@/types/admin';

interface OverviewProps {
    auth: { user: AdminUser };
    stats?: {
        totalOrders: number;
        totalOrdersChange: string;
        dailyRevenue: number;
        dailyRevenueChange: string;
        activeQueue: number;
    };
    hotSellers?: { name: string; revenue: number }[];
    activeStaff?: { name: string; role: string; avatar?: string }[];
}

export default function Overview({ auth, stats, hotSellers, activeStaff }: OverviewProps) {
    // Dummy fallback data just in case props are not passed yet from backend
    const defaultStats = stats || {
        totalOrders: 142,
        totalOrdersChange: '+12% Today',
        dailyRevenue: 4250000,
        dailyRevenueChange: '+5.4% Today',
        activeQueue: 18
    };

    const defaultHotSellers = hotSellers || [
        { name: 'Oat Milk Latte', revenue: 1250000 },
        { name: 'V60 Pour Over', revenue: 980000 },
        { name: 'Matcha Espresso', revenue: 750000 },
        { name: 'Almond Croissant', revenue: 540000 },
    ];

    const defaultActiveStaff = activeStaff || [
        { name: 'Julian Thorne', role: 'Head Barista', avatar: 'https://i.pravatar.cc/150?img=11' },
        { name: 'Sarah Connor', role: 'Cashier', avatar: 'https://i.pravatar.cc/150?img=5' },
        { name: 'Mike Ross', role: 'Roaster', avatar: 'https://i.pravatar.cc/150?img=8' },
        { name: 'Jane Doe', role: 'Barista', avatar: 'https://i.pravatar.cc/150?img=9' },
    ];

    return (
        <AdminLayout auth={auth} title="Overview" currentRoute="admin.overview">

            {/* ── Greeting Section ── */}
            <div className="mb-8">
                <h1 className="text-[32px] font-black tracking-tight text-[#1A1208]">Morning Overview</h1>
                <p className="text-[#8B7B6B] font-medium text-[15px] mt-1">
                    The aroma of freshly-roasted beans meets digital precision.
                </p>
            </div>

            {/* ── Summary StatCards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    label="Total Orders"
                    value={defaultStats.totalOrders}
                    change={defaultStats.totalOrdersChange}
                    changeType="up"
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    }
                />
                <StatCard
                    label="Daily Revenue"
                    value={`Rp ${defaultStats.dailyRevenue.toLocaleString('id-ID')}`}
                    change={defaultStats.dailyRevenueChange}
                    changeType="up"
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    }
                />
                <StatCard
                    label="Active Queue"
                    value={defaultStats.activeQueue}
                    badge="LIVE STATUS"
                    badgeColor="bg-[#E8F2E8] text-[#2E5A2E]"
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    }
                />
            </div>

            {/* ── Charts & Metrics ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* KIRI: Weekly Sales Trends (2 cols) */}
                <div className="lg:col-span-2 bg-white rounded-[24px] p-8 border shadow-sm flex flex-col" style={{ borderColor: '#E8E2DB' }}>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[18px] font-black tracking-tight text-[#1A1208]">Weekly Sales Trends</h3>
                        {/* Toggle */}
                        <div className="flex p-1.5 bg-[#F5F3F0] rounded-xl border" style={{ borderColor: '#E8E2DB' }}>
                            <button className="px-5 py-2 rounded-lg bg-white shadow-sm text-[12px] font-bold text-[#1A1208] transition-all">Weekly</button>
                            <button className="px-5 py-2 rounded-lg text-[12px] font-bold text-[#8B7B6B] hover:text-[#1A1208] transition-all">Daily</button>
                        </div>
                    </div>
                    {/* Placeholder Chart */}
                    <div className="flex-1 bg-gradient-to-b from-[#F5F3F0] to-white rounded-2xl border border-dashed flex flex-col items-center justify-center min-h-[300px]" style={{ borderColor: '#E8E2DB' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#8B7B6B] opacity-40 mb-3"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                        <p className="text-[#8B7B6B] font-bold uppercase tracking-widest text-[12px]">Line Chart Area</p>
                        <p className="text-[#8B7B6B]/60 font-medium text-[12px] mt-1">Recharts will be implemented here</p>
                    </div>
                </div>

                {/* KANAN: Peak Hours & Hottest Sellers (1 col) */}
                <div className="flex flex-col gap-6">
                    {/* Peak Roasting Hours */}
                    <div className="bg-white rounded-[24px] p-7 border shadow-sm" style={{ borderColor: '#E8E2DB' }}>
                        <h3 className="text-[12px] font-bold uppercase tracking-widest mb-6" style={{ color: '#8B7B6B' }}>Peak Roasting Hours</h3>
                        <div className="flex items-end gap-2.5 h-[100px]">
                            <div className="flex-1 bg-[#F5F3F0] rounded-t-lg h-[40%] hover:bg-[#E8E2DB] transition-colors cursor-pointer"></div>
                            <div className="flex-1 bg-[#F5F3F0] rounded-t-lg h-[65%] hover:bg-[#E8E2DB] transition-colors cursor-pointer"></div>
                            <div className="flex-1 bg-[#2D1A0E] rounded-t-lg h-[100%] shadow-md cursor-pointer relative group">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1208] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Peak: 142</div>
                            </div>
                            <div className="flex-1 bg-[#F5F3F0] rounded-t-lg h-[80%] hover:bg-[#E8E2DB] transition-colors cursor-pointer"></div>
                            <div className="flex-1 bg-[#F5F3F0] rounded-t-lg h-[45%] hover:bg-[#E8E2DB] transition-colors cursor-pointer"></div>
                        </div>
                        <div className="flex justify-between mt-3 text-[11px] font-bold" style={{ color: '#8B7B6B' }}>
                            <span>08:00</span>
                            <span>12:00</span>
                            <span>16:00</span>
                        </div>
                    </div>

                    {/* Hottest Sellers */}
                    <div className="bg-white rounded-[24px] p-7 border shadow-sm flex-1" style={{ borderColor: '#E8E2DB' }}>
                        <h3 className="text-[12px] font-bold uppercase tracking-widest mb-6" style={{ color: '#8B7B6B' }}>Hottest Sellers</h3>
                        <div className="flex flex-col gap-5">
                            {defaultHotSellers.map((seller, idx) => (
                                <div key={idx} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-[#F5F3F0] flex items-center justify-center text-[12px] font-black group-hover:bg-[#2D1A0E] group-hover:text-white transition-colors" style={{ color: '#1A1208' }}>
                                            {idx + 1}
                                        </div>
                                        <span className="font-bold text-[14px]" style={{ color: '#1A1208' }}>{seller.name}</span>
                                    </div>
                                    <span className="font-bold text-[13px] text-[#4CAF50]">
                                        Rp {(seller.revenue / 1000).toFixed(0)}k
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom Section ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Loyalty Insights */}
                <div className="bg-[#2D1A0E] text-white rounded-[24px] p-8 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                    <h3 className="text-[12px] font-bold uppercase tracking-widest text-white/50 mb-2 relative z-10">Loyalty Insights</h3>
                    <div className="relative z-10 mt-auto">
                        <h2 className="text-[54px] font-black leading-none mb-1">24</h2>
                        <p className="text-[14px] font-medium text-white/80 pr-10">New Loyalty Members joined today.</p>
                        {/* Avatar stack */}
                        <div className="flex items-center mt-6">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#2D1A0E] bg-[#F5F3F0] -ml-3 first:ml-0 flex items-center justify-center text-[#1A1208] font-bold text-[12px] overflow-hidden shadow-sm">
                                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-full h-full object-cover" alt="Member" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-[#2D1A0E] bg-white -ml-3 flex items-center justify-center text-[#1A1208] font-bold text-[11px] shadow-sm">
                                +20
                            </div>
                        </div>
                    </div>

                    {/* Decorative pattern */}
                    <svg className="absolute right-[-40px] bottom-[-40px] w-64 h-64 text-white/[0.03] pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
                        <circle cx="50" cy="50" r="50" />
                    </svg>
                </div>

                {/* Active Staff */}
                <div className="lg:col-span-2 bg-white rounded-[24px] p-8 border shadow-sm" style={{ borderColor: '#E8E2DB' }}>
                    <h3 className="text-[12px] font-bold uppercase tracking-widest mb-6" style={{ color: '#8B7B6B' }}>Active Staff Activity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {defaultActiveStaff.map((staff, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 rounded-[16px] hover:bg-[#F5F3F0] transition-colors border border-transparent hover:border-[#E8E2DB] cursor-pointer group">
                                <div className="w-12 h-12 rounded-full bg-[#F5F3F0] overflow-hidden border border-[#E8E2DB] group-hover:border-[#2D1A0E]/20 transition-colors">
                                    {staff.avatar ? (
                                        <img src={staff.avatar} className="w-full h-full object-cover" alt={staff.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#1A1208] font-bold text-[14px]">{staff.name.charAt(0)}</div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-bold leading-tight mb-0.5" style={{ color: '#1A1208' }}>{staff.name}</h4>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]"></span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#8B7B6B' }}>{staff.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
