<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Table;
use App\Events\NewOrderPlaced;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderService
{
    /**
     * Create a new order with order details
     * 
     * @param array $orderData
     * @param array $orderItems
     * @return Order
     * @throws \Exception
     */
    public function createOrder(array $orderData, array $orderItems): Order
    {
        return DB::transaction(function () use ($orderData, $orderItems) {
            // Calculate total price
            $totalPrice = 0;
            foreach ($orderItems as $item) {
                $totalPrice += $item['price'] * $item['quantity'];
            }

            // Create order
            $order = Order::create([
                'table_id' => $orderData['table_id'] ?? null,
                'customer_name' => $orderData['customer_name'] ?? null,
                'order_type' => $orderData['order_type'],
                'order_status' => 'pending',
                'payment_status' => 'unpaid',
                'total_price' => $totalPrice,
                'estimated_serve_time' => $this->calculateEstimatedServeTime($orderItems),
            ]);

            // Create order details
            foreach ($orderItems as $item) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'menu_id' => $item['menu_id'],
                    'quantity' => $item['quantity'],
                    'note' => $item['note'] ?? null,
                    'subtotal' => $item['price'] * $item['quantity'],
                ]);
            }

            // Update table status if dine-in
            if ($order->order_type === 'dine_in' && $order->table_id) {
                Table::where('id', $order->table_id)->update(['status' => 'occupied']);
            }

            // Trigger event
            event(new NewOrderPlaced($order));

            Log::info('Order created', ['order_id' => $order->id, 'total_price' => $totalPrice]);

            return $order;
        });
    }

    /**
     * Update order status
     * 
     * @param int $orderId
     * @param string $status
     * @return Order
     * @throws \Exception
     */
    public function updateOrderStatus(int $orderId, string $status): Order
    {
        $order = Order::findOrFail($orderId);
        
        $order->update(['order_status' => $status]);
        
        // If order is completed and was dine-in, free the table
        if ($status === 'completed' && $order->order_type === 'dine_in' && $order->table_id) {
            Table::where('id', $order->table_id)->update(['status' => 'available']);
        }

        // Trigger event
        event(new \App\Events\OrderStatusUpdated($order));

        Log::info('Order status updated', ['order_id' => $orderId, 'status' => $status]);

        return $order;
    }

    /**
     * Calculate estimated serve time based on order items
     * 
     * @param array $orderItems
     * @return int Estimated time in minutes
     */
    private function calculateEstimatedServeTime(array $orderItems): int
    {
        // Base preparation time
        $baseTime = 5;
        
        // Time per item (simplified calculation)
        $timePerItem = 3;
        
        // Complexity factor (based on quantity)
        $totalItems = array_sum(array_column($orderItems, 'quantity'));
        
        $estimatedTime = $baseTime + ($totalItems * $timePerItem);
        
        // Cap at 60 minutes
        return min($estimatedTime, 60);
    }

    /**
     * Get orders by status for staff dashboard
     * 
     * @param string $status
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getOrdersByStatus(string $status)
    {
        return Order::with(['table', 'orderDetails.menu'])
            ->where('order_status', $status)
            ->orderBy('created_at', 'asc')
            ->get();
    }

    /**
     * Get order statistics for admin dashboard
     * 
     * @return array
     */
    public function getOrderStatistics(): array
    {
        $today = now()->startOfDay();
        
        return [
            'total_orders_today' => Order::whereDate('created_at', $today)->count(),
            'pending_orders' => Order::where('order_status', 'pending')->count(),
            'processing_orders' => Order::where('order_status', 'processing')->count(),
            'completed_orders_today' => Order::where('order_status', 'completed')
                ->whereDate('created_at', $today)
                ->count(),
            'revenue_today' => Order::where('order_status', 'completed')
                ->whereDate('created_at', $today)
                ->sum('total_price'),
        ];
    }
}