<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderDetailResource;
use App\Models\Order;
use App\Services\OrderService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(private OrderService $orderService)
    {
    }

    /**
     * Display staff dashboard
     */
    public function index()
    {
        $pendingOrders = $this->orderService->getPendingOrders();
        $processingOrders = $this->orderService->getOrdersByStatus('processing');
        $completedOrders = $this->orderService->getOrdersByStatus('completed');

        return Inertia::render('Staff/Dashboard', [
            'pendingOrders' => OrderDetailResource::collection($pendingOrders),
            'processingOrders' => OrderDetailResource::collection($processingOrders),
            'completedOrders' => OrderDetailResource::collection($completedOrders),
        ]);
    }

    /**
     * Get orders by status (for realtime updates)
     */
    public function getOrdersByStatus(string $status)
    {
        $orders = $this->orderService->getOrdersByStatus($status);

        return response()->json([
            'data' => OrderDetailResource::collection($orders),
        ]);
    }
}
