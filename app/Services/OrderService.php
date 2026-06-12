<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Menu;
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
            $preparedItems = $this->prepareOrderItems($orderItems);
            $totalPrice = array_sum(array_column($preparedItems, 'subtotal'));
            $tableId = $orderData['table_id'] ?? null;

            if (!$tableId && !empty($orderData['table_number'])) {
                $tableId = $this->findTableIdByNumber((string) $orderData['table_number']);
            }

            // Create order
            $order = Order::create([
                'order_ref' => Order::generateOrderRef(),
                'table_id' => $tableId,
                'customer_name' => $orderData['customer_name'] ?? null,
                'order_type' => $orderData['order_type'],
                'order_status' => 'pending',
                'payment_status' => 'unpaid',
                'total_price' => $totalPrice,
                'estimated_serve_time' => $orderData['estimated_serve_time'] ?? $this->calculateEstimatedServeTime($preparedItems),
            ]);

            // Create order details
            foreach ($preparedItems as $item) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'menu_id' => $item['menu_id'],
                    'menu_name' => $item['menu_name'],
                    'unit_price' => $item['unit_price'],
                    'quantity' => $item['quantity'],
                    'note' => $item['note'] ?? null,
                    'subtotal' => $item['subtotal'],
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

    private function prepareOrderItems(array $orderItems): array
    {
        $menuIds = collect($orderItems)->pluck('menu_id')->unique()->values();
        $menus = Menu::whereIn('id', $menuIds)
            ->where('is_available', true)
            ->get()
            ->keyBy('id');

        return collect($orderItems)->map(function ($item) use ($menus) {
            $menu = $menus->get($item['menu_id']);

            if (!$menu) {
                throw new \InvalidArgumentException('Menu tidak tersedia atau tidak ditemukan');
            }

            $quantity = (int) $item['quantity'];
            $price = (float) $menu->price;

            return [
                'menu_id' => $menu->id,
                'menu_name' => $menu->name,
                'unit_price' => $price,
                'quantity' => $quantity,
                'note' => $item['note'] ?? null,
                'subtotal' => $price * $quantity,
            ];
        })->all();
    }

    private function findTableIdByNumber(string $tableNumber): ?int
    {
        foreach ($this->tableNumberCandidates($tableNumber) as $candidate) {
            $tableId = Table::where('table_number', $candidate)->value('id');

            if ($tableId) {
                return (int) $tableId;
            }
        }

        return null;
    }

    private function tableNumberCandidates(string $value): array
    {
        $raw = trim($value);
        $upper = strtoupper($raw);
        $digits = preg_replace('/\D/', '', $upper);
        $candidates = [$raw, $upper];

        if ($digits !== '') {
            $number = (string) ((int) $digits);
            $padded = str_pad($number, 2, '0', STR_PAD_LEFT);

            $candidates = array_merge($candidates, [
                $number,
                $padded,
                'T' . $number,
                'T' . $padded,
            ]);
        }

        return array_values(array_unique(array_filter($candidates, fn ($item) => $item !== '')));
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
        $normalizedStatus = Order::normalizeStatusForStorage($status);
        
        $order->update(['order_status' => $normalizedStatus]);
        
        // If order is completed and was dine-in, free the table
        if ($normalizedStatus === 'completed' && $order->order_type === 'dine_in' && $order->table_id) {
            Table::where('id', $order->table_id)->update(['status' => 'available']);
        }

        // Trigger event
        event(new \App\Events\OrderStatusUpdated($order));

        Log::info('Order status updated', ['order_id' => $orderId, 'status' => $normalizedStatus]);

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
        $statuses = match ($status) {
            'processing' => Order::staffProcessingStatuses(),
            default => [$status],
        };

        return Order::with(['table', 'orderDetails.menu'])
            ->whereIn('order_status', $statuses)
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
            'processing_orders' => Order::whereIn('order_status', Order::staffProcessingStatuses())->count(),
            'completed_orders_today' => Order::where('order_status', 'completed')
                ->whereDate('created_at', $today)
                ->count(),
            'revenue_today' => Order::where('order_status', 'completed')
                ->where('payment_status', 'paid')
                ->whereDate('created_at', $today)
                ->sum('total_price'),
        ];
    }
}
