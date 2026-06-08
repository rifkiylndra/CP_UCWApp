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
        $selectedMonth = $this->selectedMonth($request);
        [$startDate, $endDate] = $this->monthRange($selectedMonth);

        // Previous month for growth calculation
        $prevStartDate = clone $startDate;
        $prevStartDate->subMonth()->startOfMonth();
        $prevEndDate = clone $prevStartDate;
        $prevEndDate->endOfMonth();

        // 1. Calculate Metrics
        // Current month sales
        $currentQuery = $this->completedPaidOrdersForMonth($startDate, $endDate);
        $currentSales = (float) $currentQuery->sum('total_price');
        $transactionCount = (clone $currentQuery)->count();
        $averageOrderValue = $transactionCount > 0 ? round($currentSales / $transactionCount) : 0;

        // Previous month sales
        $prevQuery = $this->completedPaidOrdersForMonth($prevStartDate, $prevEndDate);
        $prevSales = (float) $prevQuery->sum('total_price');
        $prevTransactionCount = (clone $prevQuery)->count();
        $prevAverageOrderValue = $prevTransactionCount > 0 ? round($prevSales / $prevTransactionCount) : 0;

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

        $transactionChangeRaw = $prevTransactionCount > 0 ? (($transactionCount - $prevTransactionCount) / $prevTransactionCount) * 100 : 0;
        $transactionCountChange = ($transactionChangeRaw >= 0 ? '+' : '') . number_format($transactionChangeRaw, 1) . '%';

        $averageOrderValueChangeRaw = $prevAverageOrderValue > 0 ? (($averageOrderValue - $prevAverageOrderValue) / $prevAverageOrderValue) * 100 : 0;
        $averageOrderValueChange = ($averageOrderValueChangeRaw >= 0 ? '+' : '') . number_format($averageOrderValueChangeRaw, 1) . '%';

        $metrics = [
            'totalSales' => $currentSales,
            'totalSalesChange' => $totalSalesChange,
            'averageDailySales' => round($currentAvgDaily),
            'averageDailySalesChange' => $averageDailySalesChange,
            'transactionCount' => $transactionCount,
            'transactionCountChange' => $transactionCountChange,
            'averageOrderValue' => $averageOrderValue,
            'averageOrderValueChange' => $averageOrderValueChange,
        ];

        // 2. Fetch Transactions (Paginated)
        $orders = $this->completedPaidOrdersForMonth($startDate, $endDate)
            ->with([
                'table',
                'payments' => fn ($query) => $query
                    ->orderByDesc('paid_at')
                    ->orderByDesc('completed_at')
                    ->orderByDesc('created_at'),
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($order) {
                $paidPayment = $order->payments->firstWhere('payment_status', 'paid') ?? $order->payments->first();
                $paymentMethod = $paidPayment?->payment_method ?? $order->payment_method ?? 'cash';
                return [
                    'id' => $order->id,
                    'date' => $order->created_at->timezone(config('app.timezone', 'Asia/Jakarta'))->format('M d, H:i'),
                    'order_id' => $order->order_ref ?? '#ORD-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                    'customer_name' => $this->customerLabel($order),
                    'amount' => $order->total_price,
                    'payment_method' => $this->formatPaymentMethod($paymentMethod),
                    'status' => $order->payment_status,
                ];
            })
            ->withQueryString();

        return Inertia::render('Admin/Finances', [
            'transactions' => $orders,
            'metrics' => $metrics,
            'selectedMonth' => $selectedMonth,
        ]);
    }

    public function export(Request $request)
    {
        $selectedMonth = $this->selectedMonth($request);
        [$startDate, $endDate] = $this->monthRange($selectedMonth);

        $orders = $this->completedPaidOrdersForMonth($startDate, $endDate)
            ->with([
                'table',
                'payments' => fn ($query) => $query
                    ->orderByDesc('paid_at')
                    ->orderByDesc('completed_at')
                    ->orderByDesc('created_at'),
            ])
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
                $paidPayment = $order->payments->firstWhere('payment_status', 'paid') ?? $order->payments->first();
                $paymentMethod = $paidPayment?->payment_method ?? $order->payment_method ?? 'cash';
                fputcsv($file, [
                    $order->created_at->timezone(config('app.timezone', 'Asia/Jakarta'))->format('M d, Y H:i'),
                    $order->order_ref ?? '#ORD-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                    $this->customerLabel($order),
                    $order->total_price,
                    $this->formatPaymentMethod($paymentMethod),
                    $order->payment_status
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function selectedMonth(Request $request): string
    {
        $validated = $request->validate([
            'month' => ['nullable', 'date_format:Y-m'],
            'year' => ['nullable', 'integer', 'min:2000', 'max:2100'],
        ]);

        if (!empty($validated['month'])) {
            return $validated['month'];
        }

        if (!empty($validated['year'])) {
            return Carbon::create((int) $validated['year'], now()->month, 1)->format('Y-m');
        }

        return now()->format('Y-m');
    }

    private function monthRange(string $selectedMonth): array
    {
        $startDate = Carbon::createFromFormat('Y-m', $selectedMonth, config('app.timezone', 'Asia/Jakarta'))->startOfMonth();
        $endDate = (clone $startDate)->endOfMonth();

        return [$startDate, $endDate];
    }

    private function completedPaidOrdersForMonth(Carbon $startDate, Carbon $endDate)
    {
        return Order::query()
            ->where('order_status', 'completed')
            ->where('payment_status', 'paid')
            ->whereBetween('created_at', [$startDate, $endDate]);
    }

    private function customerLabel(Order $order): string
    {
        if (!empty($order->customer_name)) {
            return $order->customer_name;
        }

        if ($order->table?->table_number) {
            return 'Table ' . $order->table->table_number;
        }

        if ($order->order_type) {
            return ucwords(str_replace('_', ' ', $order->order_type));
        }

        return 'Guest';
    }

    private function formatPaymentMethod(?string $method): string
    {
        return ucwords(str_replace('_', ' ', $method ?: 'cash'));
    }
}
