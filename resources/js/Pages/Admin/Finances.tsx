import React from 'react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import StatCard from '@/Components/UI/StatCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import Pagination from '@/Components/UI/Pagination';
import type { AdminUser } from '@/types/admin';

interface AdminTransaction {
    id: string;
    date: string;
    orderId: string;
    customerName: string;
    customerAvatar?: string;
    amount: number;
    paymentMethod: string;
    status: 'paid' | 'unpaid' | 'completed' | 'processing' | 'pending' | 'refunded';
}

interface FinancesProps {
    auth: { user: AdminUser };
    metrics?: {
        totalNetSales: number;
        totalNetSalesChange: string;
        averageTicket: number;
        averageTicketChange: string;
        activeSubscriptions: number;
        activeSubscriptionsChange: string;
        refundRate: number;
        refundRateChange: string;
    };
    transactions?: AdminTransaction[];
    pagination?: {
        currentPage: number;
        totalItems: number;
        perPage: number;
    };
    dateRange?: { from: string; to: string };
}

export default function Finances({ auth, metrics, transactions, pagination, dateRange }: FinancesProps) {
    // ── Fallback Dummy Data ──
    const defaultMetrics = metrics || {
        totalNetSales: 42500000,
        totalNetSalesChange: '+12% vs last month',
        averageTicket: 48500,
        averageTicketChange: '+2.5% vs last month',
        activeSubscriptions: 124,
        activeSubscriptionsChange: '+8 this month',
        refundRate: 1.2,
        refundRateChange: '-0.3% vs last month',
    };

    const defaultTransactions = transactions || [
        { id: '1', date: '24 Oct 2026, 14:32', orderId: 'ORD-001', customerName: 'Budi Santoso', amount: 85000, paymentMethod: 'QRIS', status: 'completed' },
        { id: '2', date: '24 Oct 2026, 14:15', orderId: 'ORD-002', customerName: 'Sarah Connor', amount: 45000, paymentMethod: 'Cash', status: 'paid' },
        { id: '3', date: '24 Oct 2026, 13:50', orderId: 'ORD-003', customerName: 'Mike Ross', amount: 125000, paymentMethod: 'Credit Card', status: 'completed' },
        { id: '4', date: '24 Oct 2026, 13:42', orderId: 'ORD-004', customerName: 'Jane Doe', amount: 35000, paymentMethod: 'QRIS', status: 'refunded' },
        { id: '5', date: '24 Oct 2026, 13:30', orderId: 'ORD-005', customerName: 'Guest 012', amount: 65000, paymentMethod: 'Cash', status: 'completed' },
    ] as AdminTransaction[];

    const defaultPagination = pagination || {
        currentPage: 1,
        totalItems: 45,
        perPage: 5,
    };

    return (
        <AdminLayout auth={auth} title="Financial Reports" currentRoute="admin.finances">
            
            {/* ── Header Section ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[32px] font-black tracking-tight text-[#1A1208] leading-tight">FINANCIAL CENTER</h1>
                    <p className="text-[#8B7B6B] font-bold text-[13px] tracking-widest uppercase mt-1">Revenue Reporting</p>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Date Range Picker */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-[14px] bg-white border cursor-pointer hover:bg-[#F5F3F0] transition-colors"
                         style={{ borderColor: '#E8E2DB' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8B7B6B]"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span className="text-[13px] font-bold text-[#1A1208]">
                            {dateRange ? `${dateRange.from} - ${dateRange.to}` : 'Oct 1 - Oct 31, 2026'}
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#8B7B6B] ml-2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                    
                    {/* Export CSV Button */}
                    <button className="flex items-center gap-2 px-5 py-3 rounded-[14px] bg-[#2D1A0E] text-white hover:bg-black transition-all active:scale-95 shadow-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        <span className="text-[13px] font-bold tracking-wide">Export CSV</span>
                    </button>
                </div>
            </div>

            {/* ── Key Metrics (StatCards) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    label="Total Net Sales"
                    value={`Rp ${(defaultMetrics.totalNetSales / 1000000).toFixed(1)}M`}
                    change={defaultMetrics.totalNetSalesChange}
                    changeType="up"
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    }
                />
                <StatCard 
                    label="Average Ticket"
                    value={`Rp ${(defaultMetrics.averageTicket / 1000).toFixed(1)}k`}
                    change={defaultMetrics.averageTicketChange}
                    changeType="up"
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    }
                />
                <StatCard 
                    label="Active Subscriptions"
                    value={defaultMetrics.activeSubscriptions}
                    change={defaultMetrics.activeSubscriptionsChange}
                    changeType="up"
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                    }
                />
                <StatCard 
                    label="Refund Rate"
                    value={`${defaultMetrics.refundRate}%`}
                    change={defaultMetrics.refundRateChange}
                    changeType="down" // Refund rate turun = hijau/baik, tapi di StatCard kita sesuaikan
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><polyline points="19 9 14 14 10 10 3 17"></polyline></svg>
                    }
                />
            </div>

            {/* ── Recent Transactions Table ── */}
            <div className="bg-white rounded-[24px] border border-[#E8E2DB] shadow-sm mb-8 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-[#E8E2DB] flex items-center justify-between">
                    <h2 className="text-[18px] font-black tracking-tight text-[#1A1208]">Recent Transactions</h2>
                    
                    {/* Search / Filter Mini Placeholder */}
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-2 rounded-lg bg-[#F5F3F0] flex items-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8B7B6B]"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="text" placeholder="Search orders..." className="bg-transparent border-none p-0 text-[12px] font-medium text-[#1A1208] placeholder-[#8B7B6B] focus:ring-0 w-[120px]" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F5F3F0]/50">
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B] whitespace-nowrap">Date</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B] whitespace-nowrap">Order ID</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B] whitespace-nowrap">Customer</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B] whitespace-nowrap">Amount</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B] whitespace-nowrap">Method</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B] whitespace-nowrap">Status</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B] text-center whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {defaultTransactions.map((tx, idx) => (
                                <tr key={tx.id} className="border-b border-[#E8E2DB] hover:bg-[#F5F3F0]/50 transition-colors">
                                    <td className="py-4 px-6 text-[13px] font-medium text-[#1A1208] whitespace-nowrap">{tx.date}</td>
                                    <td className="py-4 px-6 text-[13px] font-bold text-[#1A1208] whitespace-nowrap">#{tx.orderId}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#E8E2DB] flex items-center justify-center text-[12px] font-bold text-[#1A1208] overflow-hidden">
                                                {tx.customerAvatar ? (
                                                    <img src={tx.customerAvatar} alt={tx.customerName} className="w-full h-full object-cover" />
                                                ) : (
                                                    tx.customerName.charAt(0)
                                                )}
                                            </div>
                                            <span className="text-[13px] font-bold text-[#1A1208] whitespace-nowrap">{tx.customerName}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-[13px] font-bold text-[#4CAF50] whitespace-nowrap">
                                        Rp {tx.amount.toLocaleString('id-ID')}
                                    </td>
                                    <td className="py-4 px-6 text-[13px] font-medium text-[#1A1208] whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {tx.paymentMethod === 'QRIS' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                                            {tx.paymentMethod === 'Cash' && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
                                            {tx.paymentMethod === 'Credit Card' && <span className="w-2 h-2 rounded-full bg-purple-500"></span>}
                                            {tx.paymentMethod}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <StatusBadge status={tx.status} />
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button className="p-2 rounded-lg hover:bg-[#E8E2DB] text-[#8B7B6B] transition-colors">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="p-4 border-t border-[#E8E2DB]">
                    <Pagination 
                        currentPage={defaultPagination.currentPage}
                        totalItems={defaultPagination.totalItems}
                        perPage={defaultPagination.perPage}
                        onPageChange={() => {}}
                    />
                </div>
            </div>

            {/* ── Bottom Editorial Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1 */}
                <div className="relative rounded-[24px] overflow-hidden group cursor-pointer h-[180px]">
                    <div className="absolute inset-0 bg-[#2D1A0E]">
                        <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80" alt="Financial Insights" className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208] to-transparent opacity-80"></div>
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <h3 className="text-white text-[20px] font-black tracking-tight mb-1">Financial Insights</h3>
                        <p className="text-white/80 text-[13px] font-medium">Deep dive into this quarter's revenue distribution and cost analysis.</p>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="relative rounded-[24px] overflow-hidden group cursor-pointer h-[180px]">
                    <div className="absolute inset-0 bg-[#2D1A0E]">
                        <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80" alt="Tax Season" className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208] to-transparent opacity-80"></div>
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <h3 className="text-white text-[20px] font-black tracking-tight mb-1">Tax Season Readiness</h3>
                        <p className="text-white/80 text-[13px] font-medium">Automated tax reports and compliance checks for peace of mind.</p>
                    </div>
                </div>
            </div>

        </AdminLayout>
    );
}
