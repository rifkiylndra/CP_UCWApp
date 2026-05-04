import React from 'react';
import { Link } from '@inertiajs/react';
import type { AdminUser } from '@/types/admin';

interface SidebarProps {
    user: AdminUser;
    currentRoute: string;
}

export default function Sidebar({ user, currentRoute }: SidebarProps) {
    // Helper aman untuk generate route tanpa crash jika belum terdaftar di web.php
    const getSafeRoute = (routeName: string) => {
        try {
            return route(routeName as any);
        } catch (e) {
            return '#';
        }
    };

    const navItems = [
        {
            name: 'Overview',
            route: 'admin.overview',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        },
        {
            name: 'Live Order',
            route: 'admin.live-order',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        },
        {
            name: 'AI Analytics',
            route: 'admin.analytics',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        },
        {
            name: 'Menu Management',
            route: 'admin.menu',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        },
        {
            name: 'Staff Directory',
            route: 'admin.staff',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        },
        {
            name: 'Finances',
            route: 'admin.finances',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        }
    ];

    return (
        <aside className="w-[256px] h-full flex flex-col flex-shrink-0 relative" style={{ backgroundColor: '#2D1A0E' }}>
            
            {/* ── Brand Logo & Name ── */}
            <div className="px-6 py-8 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#2D1A0E] font-black text-[15px] shadow-sm">
                    UC
                </div>
                <div className="leading-tight">
                    <h1 className="text-white text-[15px] font-black tracking-tight">UNAND</h1>
                    <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest mt-0.5">Co-Workspace</p>
                </div>
            </div>

            {/* ── User Info ── */}
            <div className="px-6 pb-6 mb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold overflow-hidden">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <h2 className="text-white text-[13px] font-bold truncate">{user.name}</h2>
                        <span className="text-white/50 text-[10px] uppercase tracking-widest font-bold truncate block">
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Navigation Menu ── */}
            <nav className="flex-1 px-4 overflow-y-auto styled-scrollbar flex flex-col gap-1.5 pb-6">
                <p className="px-3 mb-2 mt-2 text-[10px] uppercase font-bold tracking-widest text-white/30">
                    Main Menu
                </p>
                
                {navItems.map((item) => {
                    const isActive = currentRoute === item.route;
                    return (
                        <Link
                            key={item.route}
                            // Menggunakan helper aman
                            href={getSafeRoute(item.route)}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-[12px] transition-all text-[13px] font-bold ${
                                isActive 
                                    ? 'bg-white/10 text-white' 
                                    : 'text-white/40 hover:bg-white/5 hover:text-white/80'
                            }`}
                        >
                            <span className={`${isActive ? 'text-white' : 'text-white/30'}`}>
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* ── Optional Settings / Footer ── */}
            <div className="p-4 mt-auto">
                <button
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[12px] transition-all text-[13px] font-bold text-white/40 hover:bg-white/5 hover:text-white/80`}
                >
                    <span className="text-white/30">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </span>
                    Settings
                </button>
            </div>
            
        </aside>
    );
}
