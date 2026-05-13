<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use App\Services\AiService;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function __construct(private AiService $aiService)
    {
    }

    /**
     * Display analytics dashboard
     */
    public function index()
    {
        $totalOrders = Order::count();
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total_price');
        $averageRating = Review::avg('rating');
        $sentimentSummary = $this->aiService->getSentimentSummary();
        $popularMenus = $this->aiService->getPopularMenus();

        return Inertia::render('Admin/Analytics', [
            'totalOrders' => $totalOrders,
            'totalRevenue' => $totalRevenue,
            'averageRating' => $averageRating,
            'sentimentSummary' => $sentimentSummary,
            'popularMenus' => $popularMenus,
        ]);
    }

    /**
     * Get revenue report
     */
    public function revenueReport()
    {
        $report = Order::where('payment_status', 'paid')
            ->selectRaw('DATE(created_at) as date, SUM(total_price) as revenue, COUNT(*) as orders')
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->limit(30)
            ->get();

        return response()->json(['data' => $report]);
    }

    /**
     * Get order statistics
     */
    public function orderStats()
    {
        $stats = [
            'pending' => Order::where('order_status', 'pending')->count(),
            'processing' => Order::where('order_status', 'processing')->count(),
            'completed' => Order::where('order_status', 'completed')->count(),
            'cancelled' => Order::where('order_status', 'cancelled')->count(),
        ];

        return response()->json(['data' => $stats]);
    }
}
