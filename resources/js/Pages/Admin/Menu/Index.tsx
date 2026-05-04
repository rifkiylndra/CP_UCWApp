import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import Pagination from '@/Components/UI/Pagination';
import ToggleSwitch from '@/Components/UI/ToggleSwitch';
import type { AdminUser } from '@/types/admin';

import AddMenuModal from '@/Components/Modals/AddMenuModal'; 

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface MenuItem {
    id: string;
    name: string;
    subtitle: string;
    description: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
    category: string;
}

interface MenuIndexProps {
    auth: { user: AdminUser };
    menus?: MenuItem[];
    categories?: Category[];
    stats?: {
        activeAvailability: number;
        newSeasonalItems: number;
        popularityScore: number;
    };
    pagination?: {
        currentPage: number;
        totalItems: number;
        perPage: number;
    };
}

export default function MenuIndex({ auth, menus, categories, stats, pagination }: MenuIndexProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // ── Fallback Dummy Data ──
    const defaultStats = stats || {
        activeAvailability: 84,
        newSeasonalItems: 12,
        popularityScore: 4.9,
    };

    const defaultMenus = menus || [
        { id: '1', name: 'Single Origin Espresso', subtitle: 'Ethiopia Yirgacheffe', description: 'Bright acidity with floral notes.', price: 35000, imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=200&q=80', isAvailable: true, category: 'Espresso' },
        { id: '2', name: 'Oat Milk Latte', subtitle: 'Creamy & Dairy-Free', description: 'Smooth espresso with premium oat milk.', price: 45000, imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&q=80', isAvailable: true, category: 'Milk Based' },
        { id: '3', name: 'Matcha Presso', subtitle: 'Kyoto Matcha x Espresso', description: 'Earthy matcha meets bold espresso.', price: 50000, imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=200&q=80', isAvailable: false, category: 'Fusion' },
        { id: '4', name: 'V60 Pour Over', subtitle: 'Manual Brew', description: 'Clean cup with pronounced origin flavors.', price: 40000, imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=200&q=80', isAvailable: true, category: 'Filter' },
    ] as MenuItem[];

    const defaultPagination = pagination || {
        currentPage: 1,
        totalItems: 48,
        perPage: 10,
    };

    const handleToggleAvailability = (menu: MenuItem) => {
        try {
            const toggleRoute = route('admin.menu.toggle' as any, menu.id as any);
            router.patch(toggleRoute, {
                is_available: !menu.isAvailable
            }, { preserveState: true, preserveScroll: true });
        } catch (error) {
            console.warn("Route not found. Toggle action is mocked.", menu.name, !menu.isAvailable);
        }
    };

    return (
        <AdminLayout auth={auth} title="Menu Management" currentRoute="admin.menu">
            
            {/* ── Header Section ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[32px] font-black tracking-tight text-[#1A1208] leading-tight">CURATED COLLECTION</h1>
                    <p className="text-[#8B7B6B] font-bold text-[13px] tracking-widest uppercase mt-1">Menu Management</p>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Category Filter */}
                    <div className="flex items-center gap-2 px-4 py-3 rounded-[14px] bg-white border cursor-pointer hover:bg-[#F5F3F0] transition-colors"
                         style={{ borderColor: '#E8E2DB' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8B7B6B]"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                        <span className="text-[13px] font-bold text-[#1A1208]">All Categories</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#8B7B6B] ml-2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>

                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3.5 rounded-[14px] bg-[#2D1A0E] text-white hover:bg-black transition-all active:scale-95 shadow-md shadow-[#2D1A0E]/20"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span className="text-[13px] font-bold tracking-wide">Add New Menu</span>
                    </button>
                </div>
            </div>

            {/* ── Menu Table ── */}
            <div className="bg-white rounded-[24px] border border-[#E8E2DB] shadow-sm mb-8 overflow-hidden">
                <div className="p-6 border-b border-[#E8E2DB] flex items-center justify-between">
                    <h2 className="text-[18px] font-black tracking-tight text-[#1A1208]">Active Menu List</h2>
                    
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F3F0]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8B7B6B]"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Search menu..." className="bg-transparent border-none p-0 text-[13px] font-medium text-[#1A1208] placeholder-[#8B7B6B] focus:ring-0 w-[150px]" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#F5F3F0]/50">
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B]">Visual</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B]">Menu Identity</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B]">Collection</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B]">Price Point</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B] text-center">Availability</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#8B7B6B] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {defaultMenus.map((menu) => (
                                <tr key={menu.id} className={`border-b border-[#E8E2DB] hover:bg-[#F5F3F0]/50 transition-colors ${!menu.isAvailable ? 'opacity-70 bg-gray-50/50' : ''}`}>
                                    
                                    {/* Visual */}
                                    <td className="py-4 px-6">
                                        <div className="w-14 h-14 rounded-[14px] bg-[#E8E2DB] overflow-hidden border border-[#E8E2DB]">
                                            <img src={menu.imageUrl} alt={menu.name} className={`w-full h-full object-cover ${!menu.isAvailable ? 'grayscale opacity-80' : ''}`} />
                                        </div>
                                    </td>
                                    
                                    {/* Identity */}
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[14px] font-bold text-[#1A1208]">{menu.name}</span>
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B7B6B]">{menu.subtitle}</span>
                                        </div>
                                    </td>
                                    
                                    {/* Collection */}
                                    <td className="py-4 px-6">
                                        <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase border border-[#E8E2DB] bg-white text-[#1A1208]">
                                            {menu.category}
                                        </span>
                                    </td>
                                    
                                    {/* Price */}
                                    <td className="py-4 px-6 text-[13px] font-bold text-[#4CAF50]">
                                        Rp {(menu.price / 1000).toFixed(0)}k
                                    </td>
                                    
                                    {/* Availability */}
                                    <td className="py-4 px-6">
                                        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                                            <ToggleSwitch 
                                                checked={menu.isAvailable} 
                                                onChange={() => handleToggleAvailability(menu)} 
                                            />
                                        </div>
                                    </td>
                                    
                                    {/* Actions */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-1">
                                            <button className="p-2 rounded-lg hover:bg-[#F5F3F0] text-[#8B7B6B] hover:text-[#1A1208] transition-colors group">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-red-50 text-[#8B7B6B] hover:text-red-500 transition-colors group">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </button>
                                        </div>
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

            {/* ── Bottom Bento Stats ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white rounded-[24px] p-6 border border-[#E8E2DB] shadow-sm flex items-center justify-between">
                    <div>
                        <h3 className="text-[12px] font-bold tracking-widest uppercase text-[#8B7B6B] mb-1">Active Availability</h3>
                        <div className="flex items-end gap-2">
                            <h2 className="text-[32px] font-black text-[#1A1208] leading-none">{defaultStats.activeAvailability}%</h2>
                            <span className="text-[12px] font-bold text-[#4CAF50] mb-1">Optimal</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#E8F2E8] flex items-center justify-center text-[#2E5A2E]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                </div>

                <div className="bg-[#2D1A0E] text-white rounded-[24px] p-6 shadow-md flex items-center justify-between relative overflow-hidden">
                    <svg className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-white/5 pointer-events-none" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="50" /></svg>
                    <div className="relative z-10">
                        <h3 className="text-[12px] font-bold tracking-widest uppercase text-white/50 mb-1">New Seasonal Items</h3>
                        <h2 className="text-[32px] font-black leading-none">{defaultStats.newSeasonalItems} <span className="text-[18px] font-bold text-white/70">items</span></h2>
                    </div>
                    <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#C8A96E]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 border border-[#E8E2DB] shadow-sm flex items-center justify-between">
                    <div>
                        <h3 className="text-[12px] font-bold tracking-widest uppercase text-[#8B7B6B] mb-1">Menu Popularity Score</h3>
                        <div className="flex items-center gap-2">
                            <h2 className="text-[32px] font-black text-[#1A1208] leading-none">{defaultStats.popularityScore}</h2>
                            <div className="flex">
                                {[1,2,3,4,5].map(i => (
                                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i === 5 ? "none" : "#F59E0B"} stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Modal placeholder */}
            <AddMenuModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

        </AdminLayout>
    );
}
