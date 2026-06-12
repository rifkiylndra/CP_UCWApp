<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class StaffDashboardController extends Controller
{
    // Legacy prototype controller with static demo data.
    // Active staff routes use App\Http\Controllers\Staff\DashboardController.
    // Keep until a separate cleanup confirms no external references depend on it.

    /**
     * Tampilkan halaman utama Staff Dashboard (Kanban Live Orders).
     */
    public function index()
    {
        return Inertia::render('Staff/Dashboard', [
            // Dummy auth user agar UI staff layout tidak error
            'auth' => [
                'user' => [
                    'id' => '1',
                    'name' => 'Sarah Johnson',
                    'username' => 'staff',
                    'role' => 'head-barista',
                    'position' => 'HEAD BARISTA',
                    'shiftInfo' => '06:00 - 14:00',
                    'brewStation' => 'Brew Station 1'
                ]
            ],
            // Kirim data dummy ke komponen React agar bisa test Modal dan Kanban
            'orders' => [
                'incoming'   => [
                    [
                        'id' => '1',
                        'orderId' => 'ORD-1042',
                        'tableLabel' => '04',
                        'orderType' => 'dine-in',
                        'items' => [
                            [
                                'id' => 'i1',
                                'menuItem' => [
                                    'id' => 'm1',
                                    'name' => 'Caramel Macchiato',
                                    'price' => 35000,
                                    'imageUrl' => null
                                ],
                                'quantity' => 2,
                                'milkChoice' => 'Oat Milk',
                                'sweetener' => 'Less Sugar'
                            ],
                            [
                                'id' => 'i2',
                                'menuItem' => [
                                    'id' => 'm2',
                                    'name' => 'Butter Croissant',
                                    'price' => 20000,
                                ],
                                'quantity' => 1,
                            ]
                        ],
                        'totalAmount' => 90000,
                        'paymentMethod' => 'CASH',
                        'isPaid' => false, // Supaya bisa test CashPaymentModal
                        'status' => 'incoming',
                        'placedAt' => '10:42 AM',
                        'customerName' => 'Budi Santoso',
                        'customerBadge' => 'New Customer',
                        'specialRequest' => 'Kopinya jangan terlalu panas ya mas.',
                        'isPriority' => false
                    ]
                ],
                'processing' => [
                    [
                        'id' => '2',
                        'orderId' => 'ORD-1041',
                        'tableLabel' => 'Sarah',
                        'orderType' => 'takeaway',
                        'items' => [
                            [
                                'id' => 'i3',
                                'menuItem' => [
                                    'id' => 'm3',
                                    'name' => 'Iced Matcha Latte',
                                    'price' => 28000,
                                ],
                                'quantity' => 1,
                            ]
                        ],
                        'totalAmount' => 28000,
                        'paymentMethod' => 'QRIS',
                        'isPaid' => true,
                        'status' => 'processing',
                        'placedAt' => '10:35 AM',
                        'avgWaitMins' => 12,
                        'customerName' => 'Sarah',
                        'isPriority' => true
                    ]
                ],
                'completed'  => [],
            ]
        ]);
    }

    /**
     * Tampilkan halaman Riwayat Transaksi Harian.
     */
    public function transactions()
    {
        return Inertia::render('Staff/Transactions', [
            // Dummy auth user agar UI staff layout tidak error
            'auth' => [
                'user' => [
                    'id' => '1',
                    'name' => 'Sarah Johnson',
                    'username' => 'staff',
                    'role' => 'head-barista',
                    'position' => 'HEAD BARISTA',
                    'shiftInfo' => '06:00 - 14:00',
                    'brewStation' => 'Brew Station 1'
                ]
            ],
            'transactions' => [], // Array kosong untuk tabel transaksi
            'summary' => [
                'cashTotal'     => 0,
                'digitalTotal'  => 0,
                'loyaltyPoints' => 0,
                'totalRevenue'  => 0,
                'totalOrders'   => 0,
            ],
            'date' => now()->format('F d, Y'),
        ]);
    }
}
