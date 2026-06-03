<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class FinanceController extends Controller
{
    public function index(Request $request)
    {
        $selectedMonth = $request->input('month', now()->format('Y-m'));
        $startDate = Carbon::createFromFormat('Y-m', $selectedMonth)->startOfMonth();
        $endDate = clone $startDate;
        $endDate->endOfMonth();

        // Previous month for growth calculation
        $prevStartDate = clone $startDate;
        $prevStartDate->subMonth()->startOfMonth();
        $prevEndDate = clone $prevStartDate;
        $prevEndDate->endOfMonth();

        // 1. Calculate Metrics
        // Current month sales
        $currentSales = Order::where('order_status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_price');

        // Previous month sales
        $prevSales = Order::where('order_status', 'completed')
            ->whereBetween('created_at', [$prevStartDate, $prevEndDate])
            ->sum('total_price');

        // Total sales change
        $salesChangeRaw = $prevSales > 0 ? (($currentSales - $prevSales) / $prevSales) * 100 : 0;
        $totalSalesChange = ($salesChangeRaw >= 0 ? '+' : '') . number_format($salesChangeRaw, 1) . '%';

        // Average Daily Sales
        $daysInCurrentMonth = $startDate->diffInDays($endDate) + 1; // e.g. 31 days
        $currentAvgDaily = $currentSales / $daysInCurrentMonth;

        $daysInPrevMonth = $prevStartDate->diffInDays($prevEndDate) + 1;
        $prevAvgDaily = $prevSales / $daysInPrevMonth;

        $avgDailyChangeRaw = $prevAvgDaily > 0 ? (($currentAvgDaily - $prevAvgDaily) / $prevAvgDaily) * 100 : 0;
        $averageDailySalesChange = ($avgDailyChangeRaw >= 0 ? '+' : '') . number_format($avgDailyChangeRaw, 1) . '%';

        $metrics = [
            'totalSales' => $currentSales,
            'totalSalesChange' => $totalSalesChange,
            'averageDailySales' => round($currentAvgDaily),
            'averageDailySalesChange' => $averageDailySalesChange,
        ];

        // 2. Fetch Transactions (Paginated)
        $orders = Order::with('payments')
            ->where('order_status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($order) {
                $paymentMethod = $order->payments->first()?->payment_method ?? 'Cash';
                return [
                    'id' => $order->id,
                    'date' => $order->created_at->format('M d, H:i'),
                    'order_id' => '#ORD-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                    'customer_name' => $order->customer_name ?? 'Walk-in Customer',
                    'amount' => $order->total_price,
                    'payment_method' => ucfirst($paymentMethod),
                    'status' => $order->order_status,
                    // Pseudo-random avatar based on name length so it doesn't change on reload
                    'customer_avatar' => 'https://i.pravatar.cc/100?img=' . (strlen($order->customer_name ?? 'x') % 70),
                ];
            });

        return Inertia::render('Admin/Finances', [
            'transactions' => $orders,
            'metrics' => $metrics,
            'selectedMonth' => $selectedMonth,
        ]);
    }

    public function export(Request $request)
    {
        $selectedMonth = $request->input('month', now()->format('Y-m'));
        $startDate = Carbon::createFromFormat('Y-m', $selectedMonth)->startOfMonth();
        $endDate = clone $startDate;
        $endDate->endOfMonth();

        $orders = Order::with('payments')
            ->where('order_status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = "finances_report_{$selectedMonth}.csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['Date', 'Order ID', 'Customer Name', 'Amount (Rp)', 'Payment Method', 'Status'];

        $callback = function () use ($orders, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($orders as $order) {
                $paymentMethod = $order->payments->first()?->payment_method ?? 'Cash';
                fputcsv($file, [
                    $order->created_at->format('M d, Y H:i'),
                    '#ORD-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                    $order->customer_name ?? 'Walk-in Customer',
                    $order->total_price,
                    ucfirst($paymentMethod),
                    $order->order_status
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
