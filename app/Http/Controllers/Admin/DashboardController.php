<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Menu;
use App\Models\Category;
use App\Services\OrderService;
use Carbon\Carbon;
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
    public function overview(Request $request)
    {
        $mode = $request->input('mode', 'weekly');
        if (!in_array($mode, ['daily', 'weekly'], true)) {
            $mode = 'weekly';
        }

        $statistics = $this->getDashboardStatistics();
        
        return Inertia::render('Admin/Overview', [
            'statistics' => $statistics,
            'recentOrders' => $this->getRecentOrders(),
            'topMenus' => $this->getTopMenus(),
            'salesTrend' => $this->getSalesTrend($mode),
            'chartMode' => $mode,
            'peakHours' => $this->getPeakHours(),
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
            'total_revenue' => $this->completedPaidOrdersQuery()->sum('total_price'),
            'total_customers' => Order::distinct('customer_name')->count('customer_name'),
            'total_staff' => User::where('role', 'staff')->where('is_active', true)->count(),
            'total_menu_items' => Menu::count(),
            'available_menu_items' => Menu::where('is_available', true)->count(),
            
            'today_orders' => Order::whereDate('created_at', $today)->count(),
            'today_revenue' => $this->completedPaidOrdersQuery()
                ->whereDate('created_at', $today)
                ->sum('total_price'),
            
            'month_orders' => Order::whereDate('created_at', '>=', $thisMonth)->count(),
            'month_revenue' => $this->completedPaidOrdersQuery()
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
            ->join('orders', 'order_details.order_id', '=', 'orders.id')
            ->where('orders.order_status', 'completed')
            ->where('orders.payment_status', 'paid')
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
        $mode = $request->input('mode', 'weekly');
        if (!in_array($mode, ['daily', 'weekly'], true)) {
            $mode = 'weekly';
        }

        return response()->json($this->getSalesTrend($mode));
    }

    /**
     * Get revenue statistics
     */
    public function getRevenueStatistics()
    {
        $today = now()->startOfDay();
        $yesterday = now()->subDay()->startOfDay();
        
        $todayRevenue = $this->completedPaidOrdersQuery()
            ->whereDate('created_at', $today)
            ->sum('total_price');
            
        $yesterdayRevenue = $this->completedPaidOrdersQuery()
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

    private function completedPaidOrdersQuery()
    {
        return Order::query()
            ->where('order_status', 'completed')
            ->where('payment_status', 'paid');
    }

    private function getSalesTrend(string $mode): array
    {
        return $mode === 'daily'
            ? $this->getDailySalesTrend()
            : $this->getWeeklySalesTrend();
    }

    private function getWeeklySalesTrend(): array
    {
        $timezone = config('app.timezone', 'Asia/Jakarta');
        $startDate = Carbon::now($timezone)->startOfWeek(Carbon::MONDAY)->startOfDay();
        $endDate = (clone $startDate)->addDays(4)->endOfDay();
        $orders = $this->completedPaidOrdersQuery()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get(['id', 'total_price', 'created_at']);

        $labels = [
            1 => 'Mon',
            2 => 'Tue',
            3 => 'Wed',
            4 => 'Thu',
            5 => 'Fri',
        ];

        return collect($labels)->map(function (string $label, int $day) use ($orders, $timezone) {
            $ordersForDay = $orders->filter(
                fn (Order $order) => $order->created_at->copy()->timezone($timezone)->isoWeekday() === $day
            );

            return [
                'label' => $label,
                'date' => Carbon::now($timezone)
                    ->startOfWeek(Carbon::MONDAY)
                    ->addDays($day - 1)
                    ->toDateString(),
                'count' => $ordersForDay->count(),
                'revenue' => (float) $ordersForDay->sum('total_price'),
            ];
        })->values()->all();
    }

    private function getDailySalesTrend(): array
    {
        $timezone = config('app.timezone', 'Asia/Jakarta');
        $today = Carbon::now($timezone);
        $orders = $this->completedPaidOrdersQuery()
            ->whereBetween('created_at', [$today->copy()->startOfDay(), $today->copy()->endOfDay()])
            ->get(['id', 'total_price', 'created_at']);

        return collect(range(9, 18))->map(function (int $hour) use ($orders, $timezone) {
            $ordersForHour = $orders->filter(
                fn (Order $order) => (int) $order->created_at->copy()->timezone($timezone)->format('H') === $hour
            );

            return [
                'label' => sprintf('%02d:00', $hour),
                'hour' => $hour,
                'count' => $ordersForHour->count(),
                'revenue' => (float) $ordersForHour->sum('total_price'),
            ];
        })->values()->all();
    }

    private function getPeakHours(): array
    {
        $timezone = config('app.timezone', 'Asia/Jakarta');
        $startDate = Carbon::now($timezone)->startOfWeek(Carbon::MONDAY)->startOfDay();
        $endDate = Carbon::now($timezone)->endOfWeek(Carbon::FRIDAY)->endOfDay();
        $orders = $this->completedPaidOrdersQuery()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get(['id', 'created_at']);

        $grouped = $orders
            ->groupBy(fn (Order $order) => (int) $order->created_at->copy()->timezone($timezone)->format('H'))
            ->map(fn ($group, int $hour) => [
                'hour' => $hour,
                'label' => sprintf('%02d:00 - %02d:00', $hour, $hour + 1),
                'order_count' => $group->count(),
            ])
            ->sortByDesc('order_count')
            ->take(3)
            ->values();

        $maxCount = max(1, (int) $grouped->max('order_count'));

        return $grouped
            ->map(fn (array $item) => [
                ...$item,
                'capacity_percentage' => (int) round(($item['order_count'] / $maxCount) * 100),
            ])
            ->all();
    }
}
