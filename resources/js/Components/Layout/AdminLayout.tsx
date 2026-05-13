import { ReactNode } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
    currentRoute?: string;
    auth?: {
        user?: {
            name: string;
            username: string;
            role: string;
        };
    };
}

export default function AdminLayout({ children, title = 'Admin', currentRoute = '', auth }: AdminLayoutProps) {
    const { post } = useForm();

    const handleLogout = () => {
        post(route('admin.logout'));
    };

    const menuItems = [
        { label: 'Overview', route: 'admin.overview', icon: '📊' },
        { label: 'Analytics', route: 'admin.analytics', icon: '📈' },
        { label: 'Menu', route: 'admin.menu', icon: '📋' },
        { label: 'Staff', route: 'admin.staff', icon: '👥' },
        { label: 'Reports', route: 'admin.reports', icon: '📄' },
    ];

    return (
        <>
            <Head title={`${title} - Admin`} />
            <div className="min-h-screen bg-[#F5F3F0]">
                {/* Header */}
                <div className="bg-white border-b" style={{ borderColor: '#E8E2DB' }}>
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#2D1A0E] flex items-center justify-center text-white font-black text-lg">
                                UC
                            </div>
                            <div>
                                <h1 className="text-[16px] font-black text-[#1A1208]">UNAND Co-Workspace</h1>
                                <p className="text-[10px] text-[#8B7B6B] uppercase font-bold">Admin Panel</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[14px] font-bold text-[#1A1208]">{auth?.user?.name || 'Admin'}</p>
                                <p className="text-[12px] text-[#8B7B6B]">{auth?.user?.role || 'Administrator'}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg text-[13px] font-bold text-white transition-all"
                                style={{ backgroundColor: '#2D1A0E' }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex">
                    {/* Sidebar */}
                    <div className="w-64 bg-white border-r min-h-screen" style={{ borderColor: '#E8E2DB' }}>
                        <nav className="p-6 space-y-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.route}
                                    href={route(item.route)}
                                    className={`block px-4 py-3 rounded-lg text-[14px] font-bold transition-all ${
                                        currentRoute === item.route
                                            ? 'bg-[#2D1A0E] text-white'
                                            : 'text-[#1A1208] hover:bg-[#F5F3F0]'
                                    }`}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-8">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
