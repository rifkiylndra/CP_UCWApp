<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Menu;
use App\Models\Category;
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
     * Display admin overview dashboard
     */
    public function overview()
    {
        $statistics = $this->getDashboardStatistics();
        
        $endDate = now();
        $startDate = now()->subDays(6);
        $weeklySales = Order::whereBetween('created_at', [$startDate->startOfDay(), $endDate->endOfDay()])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(total_price) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        
        return Inertia::render('Admin/Overview', [
            'statistics' => $statistics,
            'recentOrders' => $this->getRecentOrders(),
            'topMenus' => $this->getTopMenus(),
            'weeklySales' => $weeklySales,
        ]);
    }

    /**
     * Display live order dashboard for admin
     */
    public function liveOrder()
    {
        $incomingOrders = \App\Models\Order::with(['table', 'orderDetails.menu'])
            ->whereIn('order_status', ['pending', 'confirmed'])
            ->orderBy('created_at', 'asc')
            ->get();

        $orders = [
            'incoming' => $this->transformOrders($incomingOrders),
            'processing' => $this->transformOrders($this->orderService->getOrdersByStatus('processing')),
            'completed' => $this->transformOrders($this->orderService->getOrdersByStatus('completed')),
        ];

        return Inertia::render('Admin/LiveOrder', [
            'orders' => $orders,
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
                'paymentMethod' => $order->payment_method ?? 'cash',
                'isPaid' => $order->payment_status === 'paid',
                'status' => in_array($order->order_status, ['pending', 'confirmed']) ? 'incoming' : $order->order_status,
                'placedAt' => $order->created_at->format('H:i'),
                'customerName' => $order->customer_name,
                'isPriority' => false,
            ];
        })->toArray();
    }

    /**
     * Get dashboard statistics
     */
    private function getDashboardStatistics(): array
    {
        $today = now()->startOfDay();
        $thisMonth = now()->startOfMonth();
        
        return [
            'total_orders' => Order::count(),
            'total_revenue' => Order::where('order_status', 'completed')->sum('total_price'),
            'total_customers' => Order::distinct('customer_name')->count('customer_name'),
            'total_staff' => User::where('role', 'staff')->where('is_active', true)->count(),
            'total_menu_items' => Menu::count(),
            'available_menu_items' => Menu::where('is_available', true)->count(),
            
            'today_orders' => Order::whereDate('created_at', $today)->count(),
            'today_revenue' => Order::where('order_status', 'completed')
                ->whereDate('created_at', $today)
                ->sum('total_price'),
            
            'month_orders' => Order::whereDate('created_at', '>=', $thisMonth)->count(),
            'month_revenue' => Order::where('order_status', 'completed')
                ->whereDate('created_at', '>=', $thisMonth)
                ->sum('total_price'),
            
            'pending_orders' => Order::where('order_status', 'pending')->count(),
            'processing_orders' => Order::where('order_status', 'processing')->count(),
        ];
    }

    /**
     * Get recent orders
     */
    private function getRecentOrders()
    {
        return Order::with(['table', 'orderDetails.menu'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
    }

    /**
     * Get top selling menus
     */
    private function getTopMenus()
    {
        return \DB::table('order_details')
            ->join('menus', 'order_details.menu_id', '=', 'menus.id')
            ->select(
                'menus.id',
                'menus.name',
                'menus.price',
                \DB::raw('SUM(order_details.quantity) as total_sold'),
                \DB::raw('SUM(order_details.subtotal) as total_revenue')
            )
            ->groupBy('menus.id', 'menus.name', 'menus.price')
            ->orderBy('total_sold', 'desc')
            ->limit(10)
            ->get();
    }

    /**
     * Get orders statistics for chart
     */
    public function getOrdersChartData(Request $request)
    {
        $days = $request->input('days', 7);
        $endDate = now();
        $startDate = now()->subDays($days);
        
        $ordersByDay = Order::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(total_price) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        
        return response()->json($ordersByDay);
    }

    /**
     * Get revenue statistics
     */
    public function getRevenueStatistics()
    {
        $today = now()->startOfDay();
        $yesterday = now()->subDay()->startOfDay();
        
        $todayRevenue = Order::where('order_status', 'completed')
            ->whereDate('created_at', $today)
            ->sum('total_price');
            
        $yesterdayRevenue = Order::where('order_status', 'completed')
            ->whereDate('created_at', $yesterday)
            ->sum('total_price');
        
        $revenueChange = $yesterdayRevenue > 0 
            ? (($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100 
            : 0;
        
        return response()->json([
            'today' => $todayRevenue,
            'yesterday' => $yesterdayRevenue,
            'change_percentage' => round($revenueChange, 2),
        ]);
    }
}