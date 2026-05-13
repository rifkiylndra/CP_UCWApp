<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display reports page
     */
    public function index()
    {
        return Inertia::render('Admin/Finance');
    }

    /**
     * Get daily sales report
     */
    public function dailySales()
    {
        $sales = Order::where('payment_status', 'paid')
            ->selectRaw('DATE(created_at) as date, SUM(total_price) as total, COUNT(*) as orders')
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json(['data' => $sales]);
    }

    /**
     * Get payment method report
     */
    public function paymentMethods()
    {
        // This would need a payment_method column in orders table
        // For now, returning placeholder
        return response()->json([
            'data' => [
                ['method' => 'Cash', 'total' => 0],
                ['method' => 'Midtrans', 'total' => 0],
            ],
        ]);
    }

    /**
     * Get customer feedback report
     */
    public function customerFeedback()
    {
        $reviews = Review::with('order')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json(['data' => $reviews]);
    }
}
