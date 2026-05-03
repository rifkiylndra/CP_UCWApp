import { Link, router } from '@inertiajs/react';
import type { StaffUser } from '@/types/staff';
import { route } from 'ziggy-js';

interface Props {
    user: StaffUser;
    currentRoute: string;
}

export default function StaffSidebar({ user, currentRoute }: Props) {
    const handleLogout = () => {
        router.post(route('staff.logout'));
    };

    return (
        <aside className="w-[256px] h-screen fixed left-0 top-0 flex flex-col z-30"
            style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
            
            {/* ── Logo & Station Info ── */}
            <div className="p-8 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                            <line x1="6" y1="1" x2="6" y2="4"></line>
                            <line x1="10" y1="1" x2="10" y2="4"></line>
                            <line x1="14" y1="1" x2="14" y2="4"></line>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-white font-black tracking-wide text-[16px]">UCW POS</h1>
                        <p className="text-white/50 text-[11px] font-semibold tracking-wider uppercase">
                            {user.brewStation || 'Brew Station 1'}
                        </p>
                    </div>
                </div>

                <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Current Shift</p>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-white text-[13px] font-medium">
                            {user.shiftInfo || '06:00 - 14:00'}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Navigation Menu ── */}
            <div className="flex-1 flex flex-col gap-2 p-4 mt-2">
                <p className="px-4 text-white/30 text-[10px] uppercase tracking-widest font-bold mb-1">
                    Operational
                </p>

                {/* Nav: Live Order */}
                <Link
                    href={route('staff.dashboard')}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
                    style={{
                        backgroundColor: currentRoute === 'dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ color: currentRoute === 'dashboard' ? 'white' : 'rgba(255,255,255,0.5)' }}
                        className="group-hover:text-white transition-colors">
                        <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                        <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                        <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                        <rect x="3" y="16" width="7" height="5" rx="1"></rect>
                    </svg>
                    <span className="text-[14px] font-semibold tracking-wide"
                        style={{ color: currentRoute === 'dashboard' ? 'white' : 'rgba(255,255,255,0.5)' }}>
                        Live Orders
                    </span>
                </Link>

                {/* Nav: Transactions */}
                <Link
                    href={route('staff.transactions')}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
                    style={{
                        backgroundColor: currentRoute === 'transactions' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ color: currentRoute === 'transactions' ? 'white' : 'rgba(255,255,255,0.5)' }}
                        className="group-hover:text-white transition-colors">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    <span className="text-[14px] font-semibold tracking-wide"
                        style={{ color: currentRoute === 'transactions' ? 'white' : 'rgba(255,255,255,0.5)' }}>
                        Transactions
                    </span>
                </Link>
            </div>

            {/* ── Footer Actions ── */}
            <div className="p-4 border-t border-white/10">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl transition-colors hover:bg-white/10 group"
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="text-white/50 group-hover:text-white transition-colors">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span className="text-[14px] font-semibold text-white/70 group-hover:text-white transition-colors">
                        Clock Out
                    </span>
                </button>
            </div>
        </aside>
    );
}
