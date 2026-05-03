import { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import StaffSidebar from '@/Components/Layout/StaffSidebar';
import type { StaffUser } from '@/types/staff';

interface Props {
    children: ReactNode;
    auth: { user: StaffUser };
    title?: string;
    currentRoute?: 'dashboard' | 'transactions' | string;
}

export default function StaffLayout({ children, auth, title, currentRoute = 'dashboard' }: Props) {
    return (
        <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-ucw-bg)' }}>
            {title && <Head title={title} />}
            
            {/* ── Sidebar Component (FILE 3) ── */}
            {/* Kita import StaffSidebar sebagai komponen terpisah untuk membuat layout lebih bersih */}
            <StaffSidebar user={auth.user} currentRoute={currentRoute} />

            {/* ── Main Content Area ── */}
            <div className="flex-1 flex flex-col ml-[256px]">
                
                {/* ── Top Bar ── */}
                <header className="h-[80px] px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md"
                    style={{ 
                        backgroundColor: 'rgba(245, 243, 240, 0.9)', // Sesuai warna bg tapi sedikit transparan
                        borderBottom: '1px solid var(--color-ucw-border)' 
                    }}>
                    
                    <div>
                        <h2 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--color-ucw-text)' }}>
                            {title || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Action Icons */}
                        <div className="flex items-center gap-2">
                            <button className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
                                style={{ color: 'var(--color-ucw-text-muted)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                            </button>
                            <button className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
                                style={{ color: 'var(--color-ucw-text-muted)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                </svg>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-8" style={{ backgroundColor: 'var(--color-ucw-border)' }} />

                        {/* Profile Info */}
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-[14px] font-bold" style={{ color: 'var(--color-ucw-text)' }}>
                                    {auth.user.name}
                                </p>
                                <p className="text-[11px] font-bold tracking-widest uppercase mt-0.5" style={{ color: 'var(--color-ucw-text-muted)' }}>
                                    {auth.user.position}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full overflow-hidden flex-none border-2"
                                style={{ borderColor: 'var(--color-ucw-border)', backgroundColor: 'var(--color-ucw-bg-warm)' }}>
                                {auth.user.avatarUrl ? (
                                    <img src={auth.user.avatarUrl} alt={auth.user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-sm font-bold"
                                        style={{ color: 'var(--color-ucw-dark)' }}>
                                        {auth.user.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* ── Scrollable Main Content ── */}
                <main className="flex-1 overflow-auto bg-transparent p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
