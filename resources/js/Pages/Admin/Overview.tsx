import { Head, Link } from '@inertiajs/react';

export default function Overview({ auth, statistics }: any) {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Head title="Admin Dashboard Overview" />
            
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    
                    <div className="flex gap-4 items-center">
                        <span className="font-medium text-gray-700">Halo, {auth.user.name} (Admin)</span>
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button"
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Logout
                        </Link>
                    </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700 mb-6">
                    ✅ Otentikasi Multi-Role Anda berhasil! Anda saat ini berada di rute yang dilindungi Middleware Admin.
                </div>

                <h2 className="text-lg font-semibold mb-4">Statistik Singkat</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border rounded shadow-sm">
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="text-xl font-bold">{statistics?.total_orders || 0}</p>
                    </div>
                    <div className="p-4 border rounded shadow-sm">
                        <p className="text-sm text-gray-500">Total Revenue</p>
                        <p className="text-xl font-bold">Rp {statistics?.total_revenue || 0}</p>
                    </div>
                    <div className="p-4 border rounded shadow-sm">
                        <p className="text-sm text-gray-500">Total Staff</p>
                        <p className="text-xl font-bold">{statistics?.total_staff || 0}</p>
                    </div>
                    <div className="p-4 border rounded shadow-sm">
                        <p className="text-sm text-gray-500">Menu Items</p>
                        <p className="text-xl font-bold">{statistics?.total_menu_items || 0}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
