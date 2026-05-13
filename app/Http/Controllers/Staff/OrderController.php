<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderDetailResource;
use App\Models\Order;
use App\Services\OrderService;

class OrderController extends Controller
{
    public function __construct(private OrderService $orderService)
    {
    }

    /**
     * Update order status
     */
    public function updateStatus(Order $order, string $status)
    {
        $validStatuses = ['pending', 'processing', 'completed', 'cancelled'];

        if (!in_array($status, $validStatuses)) {
            return response()->json(['error' => 'Invalid status'], 422);
        }

        $order = $this->orderService->updateOrderStatus($order, $status);

        return response()->json([
            'data' => new OrderDetailResource($order),
            'message' => 'Order status updated successfully',
        ]);
    }

    /**
     * Get order detail
     */
    public function show(Order $order)
    {
        $order = $this->orderService->getOrderDetail($order->id);

        return response()->json([
            'data' => new OrderDetailResource($order),
        ]);
    }
}
