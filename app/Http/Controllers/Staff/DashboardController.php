<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
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
        $orders = [
            'incoming' => $this->transformOrders($this->orderService->getOrdersByStatus('pending')),
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
                'orderId' => 'ORD-' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
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
                'orderId' => 'ORD-' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
                'tableLabel' => $order->order_type === 'dine_in' 
                    ? 'Table ' . ($order->table?->table_number ?? 'N/A')
                    : ($order->customer_name ?? 'Takeaway'),
                'orderType' => $order->order_type === 'dine_in' ? 'dine-in' : 'takeaway',
                'items' => $order->orderDetails->map(function ($detail) {
                    return [
                        'id' => (string)$detail->id,
                        'menuItem' => [
                            'id' => (string)$detail->menu->id,
                            'name' => $detail->menu->name,
                            'price' => $detail->menu->price,
                        ],
                        'quantity' => $detail->quantity,
                        'notes' => $detail->note,
                    ];
                })->toArray(),
                'totalAmount' => $order->total_price,
                'paymentMethod' => 'cash', // Default, bisa diupdate dari Payment model
                'isPaid' => $order->payment_status === 'paid',
                'status' => $order->order_status === 'pending' ? 'incoming' : $order->order_status,
                'placedAt' => $order->created_at->format('H:i'),
                'customerName' => $order->customer_name,
                'isPriority' => false, // Bisa ditambahkan logic priority di masa depan
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
    public function updateOrderStatus(Request $request, $orderId)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,processing,preparing,ready,completed,cancelled',
        ]);

        try {
            $order = $this->orderService->updateOrderStatus($orderId, $request->status);
            
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
                    '#ORD-' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
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
