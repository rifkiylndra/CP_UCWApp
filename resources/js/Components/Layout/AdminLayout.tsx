import React, { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import type { AdminUser } from '@/types/admin';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface AdminLayoutProps {
    children: ReactNode;
    auth: { user: AdminUser };
    title?: string;
    currentRoute?: string;
}

export default function AdminLayout({ 
    children, 
    auth, 
    title = 'Dashboard', 
    currentRoute = 'admin.overview' 
}: AdminLayoutProps) {
    // ── Dummy fallback user jika auth.user kosong (karena login sementara di-mock) ──
    const safeUser = auth?.user || {
        name: 'Super Admin',
        role: 'System Administrator',
        avatar: ''
    };

    return (
        <div className="flex h-screen w-full bg-[#F5F3F0] overflow-hidden text-[#1A1208]">
            <Head title={`${title} — Admin UCW`} />
            
            {/* ── Wrapper 1280px ── */}
            <div className="flex w-full max-w-[1280px] mx-auto h-full overflow-hidden bg-[#F5F3F0] relative">
                
                {/* ── Fixed Sidebar (256px) ── */}
                <Sidebar user={safeUser} currentRoute={currentRoute} />

                {/* ── Main Content Area ── */}
                <div className="flex flex-col flex-1 overflow-hidden w-full relative">
                    
                    {/* Top Navigation */}
                    <TopBar user={safeUser} title={title} />
                    
                    {/* Main Scrollable Content */}
                    <main className="flex-1 overflow-y-auto p-8 styled-scrollbar relative">
                        <div className="w-full h-full">
                            {children}
                        </div>
                    </main>

                </div>
            </div>

            {/* Custom Scrollbar for Main Area */}
            <style>{`
                .styled-scrollbar::-webkit-scrollbar { width: 6px; }
                .styled-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .styled-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 6px; }
                .styled-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
            `}</style>
        </div>
    );
}
