<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\UpdateOrderStatusRequest;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Display staff dashboard
     */
    public function index()
    {
        $incomingOrders = Order::with(['table', 'orderDetails.menu'])
            ->whereIn('order_status', ['pending', 'confirmed'])
            ->orderBy('created_at', 'asc')
            ->get();

        $orders = [
            'incoming' => $this->transformOrders($incomingOrders),
            'processing' => $this->transformOrders($this->orderService->getOrdersByStatus('processing')),
            'completed' => $this->transformOrders($this->orderService->getOrdersByStatus('completed')),
        ];

        return Inertia::render('Staff/Dashboard', [
            'orders' => $orders,
            'statistics' => $this->orderService->getOrderStatistics(),
        ]);
    }

    /**
     * Display staff transactions history
     */
    public function transactions()
    {
        $today = now()->startOfDay();
        
        $orders = Order::with(['payments'])
            ->whereDate('created_at', $today)
            ->orderBy('created_at', 'desc')
            ->get();

        $transactions = $orders->map(function ($order) {
            $paymentMethod = $order->payments->first()?->payment_method ?? 'cash';
            
            return [
                'id' => (string)$order->id,
                'orderId' => $order->order_ref,
                'customerName' => $order->customer_name ?? 'Walk-in Customer',
                'time' => $order->created_at->format('H:i'),
                'totalPrice' => (float)$order->total_price,
                'paymentMethod' => ucfirst($paymentMethod),
                'status' => $order->order_status,
            ];
        });

        $cashTotal = $orders->filter(function ($order) {
            $method = $order->payments->first()?->payment_method ?? 'cash';
            return strtolower($method) === 'cash' && $order->order_status === 'completed';
        })->sum('total_price');

        $digitalTotal = $orders->filter(function ($order) {
            $method = $order->payments->first()?->payment_method ?? 'cash';
            return strtolower($method) !== 'cash' && $order->order_status === 'completed';
        })->sum('total_price');

        $summary = [
            'cashTotal' => $cashTotal,
            'digitalTotal' => $digitalTotal,
            'totalRevenue' => $cashTotal + $digitalTotal,
            'totalOrders' => $orders->count(),
        ];

        return Inertia::render('Staff/Transactions', [
            'transactions' => $transactions,
            'summary' => $summary,
            'date' => now()->format('d M Y'),
        ]);
    }

    /**
     * Transform orders to Kanban format
     */
    private function transformOrders($orders)
    {
        return $orders->map(function ($order) {
            return [
                'id' => (string)$order->id,
                'orderId' => $order->order_ref,
                'tableLabel' => $order->order_type === 'dine_in' 
                    ? ($order->table?->table_number ?? 'N/A')
                    : ($order->customer_name ?? 'Takeaway'),
                'orderType' => $order->order_type === 'dine_in' ? 'dine-in' : 'takeaway',
                'items' => $order->orderDetails->map(function ($detail) {
                    $menu = $detail->menu;

                    return [
                        'id' => (string)$detail->id,
                        'menuItem' => [
                            'id' => (string) ($menu?->id ?? $detail->menu_id ?? $detail->id),
                            'name' => $detail->menu_name ?? $menu?->name ?? 'Deleted menu',
                            'price' => (float) ($detail->unit_price ?? $menu?->price ?? 0),
                            'image' => $menu?->image,
                            'image_url' => $menu?->image_url,
                            'imageUrl' => $menu?->image_url,
                        ],
                        'quantity' => $detail->quantity,
                        'notes' => $detail->note,
                    ];
                })->toArray(),
                'totalAmount' => $order->total_price,
                'paymentMethod' => $order->payment_method ?? 'cash',
                'isPaid' => $order->payment_status === 'paid',
                'status' => Order::staffColumnStatus($order->order_status),
                'placedAt' => $order->created_at->format('H:i'),
                'customerName' => $order->customer_name,
                'isPriority' => false,
                'estimatedServeTime' => $order->estimated_serve_time,
                'createdAt' => $order->created_at?->toIso8601String(),
                'updatedAt' => $order->updated_at?->toIso8601String(),
            ];
        })->toArray();
    }

    /**
     * Get orders by status (API)
     */
    public function getOrdersByStatus($status)
    {
        $orders = $this->orderService->getOrdersByStatus($status);
        
        return response()->json($orders);
    }

    /**
     * Update order status
     */
    public function updateOrderStatus(UpdateOrderStatusRequest $request, $orderId)
    {
        try {
            $status = $request->status === 'incoming' ? 'pending' : $request->status;
            $order = $this->orderService->updateOrderStatus($orderId, $status);
            
            return response()->json([
                'success' => true,
                'message' => 'Status pesanan berhasil diperbarui',
                'order' => $order,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui status: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get order details
     */
    public function getOrderDetails($orderId)
    {
        $order = Order::with(['table', 'orderDetails.menu', 'payments'])
            ->findOrFail($orderId);

        return response()->json($order);
    }

    /**
     * Get today's orders
     */
    public function getTodayOrders()
    {
        $today = now()->startOfDay();
        
        $orders = Order::with(['table', 'orderDetails.menu'])
            ->whereDate('created_at', $today)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Get order statistics
     */
    public function getStatistics()
    {
        $statistics = $this->orderService->getOrderStatistics();
        
        return response()->json($statistics);
    }
    /**
     * Export today's transactions to CSV
     */
    public function exportTransactions()
    {
        $today = now()->startOfDay();
        
        $orders = Order::with(['payments'])
            ->whereDate('created_at', $today)
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = "daily_transactions_" . now()->format('Y-m-d') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['Time', 'Order ID', 'Customer Name', 'Total Price', 'Payment Method', 'Status'];

        $callback = function () use ($orders, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($orders as $order) {
                $paymentMethod = $order->payments->first()?->payment_method ?? 'cash';
                fputcsv($file, [
                    $order->created_at->format('H:i'),
                    $order->order_ref,
                    $order->customer_name ?? 'Walk-in Customer',
                    $order->total_price,
                    ucfirst($paymentMethod),
                    ucfirst($order->order_status)
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
