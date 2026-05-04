import React from 'react';
import type { AdminUser } from '@/types/admin';

interface TopBarProps {
    user: AdminUser;
    title?: string;
}

export default function TopBar({ user, title }: TopBarProps) {
    return (
        <header className="flex items-center justify-between px-8 py-6 flex-shrink-0 relative z-10">
            
            {/* ── Kiri: Title & Search Bar ── */}
            <div className="flex items-center gap-10 flex-1">
                {title && (
                    <h2 className="text-[24px] font-black tracking-tight" style={{ color: '#1A1208' }}>
                        {title}
                    </h2>
                )}
                
                <div className="relative max-w-md w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search anything (press '/' to focus)" 
                        className="w-full pl-11 pr-4 py-3 rounded-[14px] text-[13px] font-medium outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-[#2D1A0E]/10 border"
                        style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E2DB', color: '#1A1208' }}
                    />
                </div>
            </div>

            {/* ── Kanan: Icons & Profile ── */}
            <div className="flex items-center gap-6">
                
                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Settings Icon */}
                    <button className="w-[44px] h-[44px] rounded-full flex items-center justify-center bg-white border transition-colors hover:shadow-sm"
                        style={{ borderColor: '#E8E2DB', color: '#8B7B6B' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-[#1A1208] transition-colors"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </button>

                    {/* Notification Icon */}
                    <button className="w-[44px] h-[44px] rounded-full flex items-center justify-center bg-white border transition-colors hover:shadow-sm relative"
                        style={{ borderColor: '#E8E2DB', color: '#8B7B6B' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-[#1A1208] transition-colors"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        <span className="absolute top-2.5 right-3 w-[9px] h-[9px] rounded-full bg-[#FF5252] border-[2px] border-white"></span>
                    </button>
                </div>

                <div className="h-8 w-px" style={{ backgroundColor: '#E8E2DB' }}></div>

                {/* Profile Pill */}
                <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-4 rounded-full bg-white border transition-all hover:shadow-sm group"
                    style={{ borderColor: '#E8E2DB' }}>
                    <div className="w-[38px] h-[38px] rounded-full bg-[#F5F3F0] flex items-center justify-center text-[#2D1A0E] font-bold overflow-hidden">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="flex flex-col pr-1">
                        <span className="text-[13px] font-bold leading-none mb-1 group-hover:text-black transition-colors" style={{ color: '#1A1208' }}>
                            {user.name}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-widest leading-none" style={{ color: '#8B7B6B' }}>
                            {user.role}
                        </span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#8B7B6B' }} className="ml-1 transition-transform group-hover:translate-y-0.5">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>

            </div>
        </header>
    );
}
