import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';
import type { StaffUser } from '@/types/staff';

interface Props {
    auth: { user: StaffUser };
    orders: {
        incoming: any[];
        processing: any[];
        completed: any[];
    };
}

export default function Dashboard({ auth, orders: initialOrders }: Props) {
    const [orders, setOrders] = useState(initialOrders);

    return (
        <StaffLayout auth={auth} title="Orders Dashboard" currentRoute="dashboard">
            <Head title="Staff Dashboard" />

            <div className="p-8">
                <h1 className="text-3xl font-bold mb-4">Dashboard Test</h1>
                <p className="mb-4">Incoming: {orders?.incoming?.length || 0}</p>
                <p className="mb-4">Processing: {orders?.processing?.length || 0}</p>
                <p className="mb-4">Completed: {orders?.completed?.length || 0}</p>
                
                <div className="bg-gray-100 p-4 rounded mt-4">
                    <pre className="text-sm">{JSON.stringify(orders, null, 2)}</pre>
                </div>
            </div>
        </StaffLayout>
    );
}
