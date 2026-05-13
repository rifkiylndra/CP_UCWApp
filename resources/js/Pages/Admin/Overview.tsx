import { Head, useForm } from '@inertiajs/react';

interface Props {
    auth?: {
        user?: {
            name: string;
            role: string;
        };
    };
}

export default function AdminOverview({ auth }: Props) {
    const { post } = useForm();

    const handleLogout = () => {
        post(route('admin.logout'));
    };

    return (
        <>
            <Head title="Admin Overview" />
            <div className="min-h-screen bg-slate-900">
                {/* Header */}
                <div className="bg-slate-800 border-b border-slate-700 p-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                            <p className="text-slate-400 mt-1">Welcome, {auth?.user?.name || 'Admin'}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto p-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                            <p className="text-slate-400 text-sm mb-2">Total Orders</p>
                            <p className="text-3xl font-bold text-blue-400">0</p>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                            <p className="text-slate-400 text-sm mb-2">Revenue Today</p>
                            <p className="text-3xl font-bold text-green-400">Rp 0</p>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                            <p className="text-slate-400 text-sm mb-2">Active Staff</p>
                            <p className="text-3xl font-bold text-amber-400">0</p>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                            <p className="text-slate-400 text-sm mb-2">Menu Items</p>
                            <p className="text-3xl font-bold text-purple-400">0</p>
                        </div>
                    </div>

                    {/* Menu Sections */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Management */}
                        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                            <h2 className="text-xl font-bold text-white mb-4">Management</h2>
                            <div className="space-y-3">
                                <a
                                    href={route('admin.menu')}
                                    className="block px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                                >
                                    📋 Menu Management
                                </a>
                                <a
                                    href={route('admin.staff')}
                                    className="block px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                                >
                                    👥 Staff Management
                                </a>
                                <a
                                    href={route('admin.reports')}
                                    className="block px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                                >
                                    📊 Reports
                                </a>
                            </div>
                        </div>

                        {/* Analytics */}
                        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                            <h2 className="text-xl font-bold text-white mb-4">Analytics</h2>
                            <div className="space-y-3">
                                <a
                                    href={route('admin.analytics')}
                                    className="block px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                                >
                                    📈 Analytics Dashboard
                                </a>
                                <a
                                    href={route('admin.live-order')}
                                    className="block px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                                >
                                    🔴 Live Orders
                                </a>
                                <div className="px-4 py-3 bg-slate-700 text-slate-400 rounded-lg opacity-50 cursor-not-allowed">
                                    ⚙️ Settings (Coming Soon)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                        <div className="text-center py-8">
                            <p className="text-slate-400">No recent activity</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
