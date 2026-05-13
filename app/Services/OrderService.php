<?php

namespace App\Services;

use App\Events\NewOrderPlaced;
use App\Events\OrderStatusUpdated;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Menu;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Create a new order with order details
     */
    public function createOrder(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            // Create order
            $order = Order::create([
                'customer_name' => $data['customer_name'] ?? null,
                'table_id' => $data['table_id'],
                'order_type' => $data['order_type'] ?? 'dine-in',
                'order_status' => 'pending',
                'payment_status' => 'unpaid',
                'total_price' => 0,
            ]);

            // Create order details and calculate total
            $total = 0;
            foreach ($data['items'] as $item) {
                $menu = Menu::findOrFail($item['menu_id']);
                $subtotal = $menu->price * $item['quantity'];

                OrderDetail::create([
                    'order_id' => $order->id,
                    'menu_id' => $item['menu_id'],
                    'quantity' => $item['quantity'],
                    'note' => $item['note'] ?? null,
                    'subtotal' => $subtotal,
                ]);

                $total += $subtotal;
            }

            // Update order total
            $order->update(['total_price' => $total]);

            // Broadcast event
            event(new NewOrderPlaced($order));

            return $order->load('orderDetails.menu');
        });
    }

    /**
     * Update order status
     */
    public function updateOrderStatus(Order $order, string $status): Order
    {
        $order->update(['order_status' => $status]);

        // Broadcast event
        event(new OrderStatusUpdated($order));

        return $order;
    }

    /**
     * Get order with details
     */
    public function getOrderDetail(int $orderId): Order
    {
        return Order::with(['orderDetails.menu', 'table', 'reviews'])->findOrFail($orderId);
    }

    /**
     * Get all pending orders
     */
    public function getPendingOrders()
    {
        return Order::where('order_status', 'pending')
            ->with(['orderDetails.menu', 'table'])
            ->orderBy('created_at', 'asc')
            ->get();
    }

    /**
     * Get orders by status
     */
    public function getOrdersByStatus(string $status)
    {
        return Order::where('order_status', $status)
            ->with(['orderDetails.menu', 'table'])
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
