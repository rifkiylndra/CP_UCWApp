import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Order {
    id: number;
    customer_name: string;
    order_status: string;
    payment_status: string;
    total_price: number;
    created_at: string;
}

interface Props {
    pendingOrders: Order[];
    processingOrders: Order[];
    completedOrders: Order[];
}

export default function StaffDashboard({ pendingOrders = [], processingOrders = [], completedOrders = [] }: Props) {
    const { post } = useForm();
    const [activeTab, setActiveTab] = useState<'pending' | 'processing' | 'completed'>('pending');

    const handleLogout = () => {
        post(route('staff.logout'));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'unpaid':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatIDR = (amount: number) => {
        return `Rp ${amount.toLocaleString('id-ID')}`;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const orders = {
        pending: pendingOrders,
        processing: processingOrders,
        completed: completedOrders,
    };

    const currentOrders = orders[activeTab];

    return (
        <>
            <Head title="Staff Dashboard" />
            <div className="min-h-screen bg-slate-900">
                {/* Header */}
                <div className="bg-slate-800 border-b border-slate-700 p-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Staff Dashboard</h1>
                            <p className="text-slate-400 mt-1">Manage orders in real-time</p>
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
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                            <p className="text-slate-400 text-sm mb-2">Pending Orders</p>
                            <p className="text-3xl font-bold text-yellow-400">{pendingOrders.length}</p>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                            <p className="text-slate-400 text-sm mb-2">Processing</p>
                            <p className="text-3xl font-bold text-blue-400">{processingOrders.length}</p>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                            <p className="text-slate-400 text-sm mb-2">Completed</p>
                            <p className="text-3xl font-bold text-green-400">{completedOrders.length}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-6 border-b border-slate-700">
                        {(['pending', 'processing', 'completed'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 font-medium transition border-b-2 ${
                                    activeTab === tab
                                        ? 'border-amber-500 text-amber-400'
                                        : 'border-transparent text-slate-400 hover:text-slate-300'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Orders List */}
                    <div className="space-y-4">
                        {currentOrders.length === 0 ? (
                            <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
                                <p className="text-slate-400">No orders in this category</p>
                            </div>
                        ) : (
                            currentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">
                                                Order #{order.id}
                                            </h3>
                                            <p className="text-slate-400 text-sm mt-1">
                                                {order.customer_name || 'Guest'} • {formatDate(order.created_at)}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                                                {order.order_status}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                                                {order.payment_status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                                        <span className="text-slate-400">Total:</span>
                                        <span className="text-xl font-bold text-amber-400">
                                            {formatIDR(order.total_price)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
