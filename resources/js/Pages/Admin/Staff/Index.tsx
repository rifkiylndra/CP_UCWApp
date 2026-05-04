import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import Pagination from '@/Components/UI/Pagination';
import type { AdminUser } from '@/types/admin';
import AddStaffModal from '@/Components/Modals/AddStaffModal';

interface StaffMember {
    id: string;
    userId: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    registeredAt: string;
    isActive: boolean;
}

interface StaffIndexProps {
    auth: { user: AdminUser };
    staffList?: StaffMember[];
    stats?: {
        totalStaff: number;
        totalStaffChange: string;
        onDuty: number;
        baristaOfMonth: { name: string; rating: number; avatar?: string };
    };
    pagination?: {
        currentPage: number;
        totalItems: number;
        perPage: number;
    };
}

export default function StaffIndex({ auth, staffList, stats, pagination }: StaffIndexProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // ── Fallback Dummy Data ──
    const defaultStats = stats || {
        totalStaff: 24,
        totalStaffChange: '+2 this month',
        onDuty: 8,
        baristaOfMonth: { 
            name: 'Julian Thorne', 
            rating: 98.5, 
            avatar: 'https://i.pravatar.cc/150?img=11' 
        }
    };

    const defaultStaff = staffList || [
        { id: '1', userId: 'USR-014', name: 'Julian Thorne', email: 'julian@ucw.app', role: 'Head Barista', registeredAt: '12 Aug 2025', isActive: true, avatar: 'https://i.pravatar.cc/150?img=11' },
        { id: '2', userId: 'USR-021', name: 'Sarah Connor', email: 'sarah@ucw.app', role: 'Cashier', registeredAt: '05 Sep 2025', isActive: true, avatar: 'https://i.pravatar.cc/150?img=5' },
        { id: '3', userId: 'USR-033', name: 'Mike Ross', email: 'mike@ucw.app', role: 'Roaster', registeredAt: '21 Oct 2025', isActive: false, avatar: 'https://i.pravatar.cc/150?img=8' },
        { id: '4', userId: 'USR-042', name: 'Jane Doe', email: 'jane@ucw.app', role: 'Barista', registeredAt: '03 Nov 2025', isActive: true, avatar: 'https://i.pravatar.cc/150?img=9' },
    ] as StaffMember[];

    const defaultPagination = pagination || {
        currentPage: 1,
        totalItems: 24,
        perPage: 10,
    };

    return (
        <AdminLayout auth={auth} title="Staff Directory" currentRoute="admin.staff">
            
            {/* ── Header Section ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[32px] font-black tracking-tight text-[#1A1208] leading-tight">DIRECTORY</h1>
                    <p className="text-[#8B7B6B] font-bold text-[13px] tracking-widest uppercase mt-1">Staff Management</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3.5 rounded-[14px] bg-[#1A1208] text-white hover:bg-black transition-all active:scale-95 shadow-md shadow-[#1A1208]/20"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span className="text-[13px] font-bold tracking-wide">Add New Staff</span>
                    </button>
                </div>
            </div>

            {/* ── Bento Stats (3 Cards) ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                
                {/* Total Staff */}
                <div className="bg-white rounded-[24px] p-7 border shadow-sm flex flex-col justify-between" style={{ borderColor: '#E8E2DB' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#F5F3F0] flex items-center justify-center text-[#1A1208]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                        <h3 className="text-[14px] font-bold text-[#8B7B6B]">Total Staff</h3>
                    </div>
                    <div>
                        <h2 className="text-[42px] font-black text-[#1A1208] leading-none mb-2">{defaultStats.totalStaff}</h2>
                        <span className="text-[13px] font-bold text-[#4CAF50]">{defaultStats.totalStaffChange}</span>
                    </div>
                </div>

                {/* On Duty */}
                <div className="bg-white rounded-[24px] p-7 border shadow-sm flex flex-col justify-between" style={{ borderColor: '#E8E2DB' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#E8F2E8] flex items-center justify-center text-[#2E5A2E]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                        <h3 className="text-[14px] font-bold text-[#8B7B6B]">Currently On Duty</h3>
                    </div>
                    <div className="flex items-end gap-3">
                        <h2 className="text-[42px] font-black text-[#1A1208] leading-none mb-1">{defaultStats.onDuty < 10 ? `0${defaultStats.onDuty}` : defaultStats.onDuty}</h2>
                        <div className="flex items-center gap-1.5 mb-2 px-3 py-1 rounded-full bg-[#E8F2E8] border border-[#CDE3CD]">
                            <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse"></span>
                            <span className="text-[10px] font-bold text-[#2E5A2E] tracking-widest uppercase">Live Active</span>
                        </div>
                    </div>
                </div>

                {/* Barista of the Month */}
                <div className="bg-[#2D1A0E] text-white rounded-[24px] p-7 shadow-xl relative overflow-hidden flex flex-col justify-between">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#C8A96E] mb-6 relative z-10">Barista of the Month</h3>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-2 border-[#C8A96E] overflow-hidden bg-white shadow-[0_0_15px_rgba(200,169,110,0.3)]">
                            {defaultStats.baristaOfMonth.avatar ? (
                                <img src={defaultStats.baristaOfMonth.avatar} alt="Barista of the month" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#1A1208] font-bold text-xl">{defaultStats.baristaOfMonth.name.charAt(0)}</div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-[18px] font-black leading-tight mb-1">{defaultStats.baristaOfMonth.name}</h2>
                            <div className="flex items-center gap-1">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#C8A96E" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                <span className="text-[13px] font-bold text-[#C8A96E]">{defaultStats.baristaOfMonth.rating}% Rating</span>
                            </div>
                        </div>
                    </div>
                    {/* Decorative pattern */}
                    <svg className="absolute right-[-20px] top-[-20px] w-40 h-40 text-white/[0.03] pointer-events-none" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="50" /></svg>
                </div>

            </div>

            {/* ── Staff Table ── */}
            <div className="bg-white rounded-[24px] border border-[#E8E2DB] shadow-sm mb-8 overflow-hidden">
                <div className="p-6 border-b border-[#E8E2DB] flex items-center justify-between">
                    <h2 className="text-[18px] font-black tracking-tight text-[#1A1208]">Team Members</h2>
                    
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F3F0]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8B7B6B]"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Search staff..." className="bg-transparent border-none p-0 text-[13px] font-medium text-[#1A1208] placeholder-[#8B7B6B] focus:ring-0 w-[150px]" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-[#F5F3F0]/50">
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B]">User ID</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B]">Staff Member</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B]">Role</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B]">Registration Date</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B] text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {defaultStaff.map((staff) => (
                                <tr key={staff.id} className={`border-b border-[#E8E2DB] hover:bg-[#F5F3F0]/50 transition-colors ${!staff.isActive ? 'opacity-60' : ''}`}>
                                    <td className="py-4 px-6 text-[13px] font-bold text-[#1A1208]">#{staff.userId}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#E8E2DB] flex items-center justify-center text-[13px] font-bold text-[#1A1208] overflow-hidden border border-[#E8E2DB]">
                                                {staff.avatar ? (
                                                    <img src={staff.avatar} alt={staff.name} className={`w-full h-full object-cover ${!staff.isActive ? 'grayscale' : ''}`} />
                                                ) : (
                                                    staff.name.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-[14px] font-bold text-[#1A1208]">{staff.name}</span>
                                                    {!staff.isActive && (
                                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-[#F5F3F0] text-[#8B7B6B]">Inactive</span>
                                                    )}
                                                </div>
                                                <span className="text-[12px] font-medium text-[#8B7B6B]">{staff.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-widest uppercase border"
                                            style={{ 
                                                backgroundColor: staff.role.includes('Barista') ? '#FDF8F3' : '#F5F3F0',
                                                borderColor: staff.role.includes('Barista') ? '#F2DFCE' : '#E8E2DB',
                                                color: staff.role.includes('Barista') ? '#B45309' : '#1A1208'
                                            }}
                                        >
                                            {staff.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-[13px] font-medium text-[#1A1208]">
                                        {staff.registeredAt}
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

            {/* ── AI Promo Card ── */}
            <div className="bg-gradient-to-r from-[#2D1A0E] to-[#1A1208] rounded-[24px] p-8 shadow-xl flex items-center justify-between overflow-hidden relative">
                {/* Visual decoration */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#C8A96E]/20 to-transparent pointer-events-none"></div>
                <svg className="absolute right-[-40px] top-[-40px] w-64 h-64 text-[#C8A96E] opacity-10 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                
                <div className="relative z-10 flex gap-5 items-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#C8A96E]/20 border border-[#C8A96E]/30 flex items-center justify-center text-[#C8A96E]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    </div>
                    <div>
                        <h3 className="text-white text-[20px] font-black tracking-tight mb-1">Analyze Shift Performance with AI Insights</h3>
                        <p className="text-white/70 text-[14px] font-medium">Discover which staff combinations yield the highest revenue and fastest completion times.</p>
                    </div>
                </div>
                
                <Link 
                    // href={route('admin.analytics')} // Akan diaktifkan nanti
                    href="#"
                    className="relative z-10 bg-[#C8A96E] text-[#1A1208] px-6 py-3.5 rounded-[14px] font-bold text-[13px] tracking-wide hover:bg-[#D4B986] transition-colors shadow-lg shadow-[#C8A96E]/20 whitespace-nowrap flex items-center gap-2"
                >
                    Launch Analytics
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>
            </div>

            {/* Modal placeholder */}
            <AddStaffModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

        </AdminLayout>
    );
}
