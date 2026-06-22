<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\RefundPaymentRequest;
use App\Http\Requests\Staff\VerifyCashPaymentRequest;
use App\Models\Order;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Verify cash payment
     */
    public function verifyCashPayment(VerifyCashPaymentRequest $request, $orderId)
    {

        $order = Order::findOrFail($orderId);
        
        if ($order->payment_status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan sudah dibayar',
            ], 400);
        }

        $result = $this->paymentService->verifyCashPayment(
            $order, 
            (float) $request->amount_received
        );

        return response()->json($result);
    }

    /**
     * Get payment details
     */
    public function getPaymentDetails($paymentId)
    {
        $payment = Payment::with(['order.orderDetails.menu'])->findOrFail($paymentId);
        
        return response()->json($payment);
    }

    /**
     * Get today's payments
     */
    public function getTodayPayments()
    {
        $today = now()->startOfDay();
        
        $payments = Payment::with(['order.orderDetails.menu'])
            ->whereDate('created_at', $today)
            ->where('payment_status', 'paid')
            ->orderBy('paid_at', 'desc')
            ->get();

        $summary = [
            'total_payments' => $payments->count(),
            'total_amount' => $payments->sum('amount'),
            'by_method' => $payments->groupBy('payment_method')->map(function ($group) {
                return [
                    'count' => $group->count(),
                    'amount' => $group->sum('amount'),
                ];
            }),
        ];

        return response()->json([
            'payments' => $payments,
            'summary' => $summary,
        ]);
    }

    /**
     * Get payment statistics
     */
    public function getPaymentStatistics(Request $request)
    {
        $period = $request->input('period', 'today'); // today, week, month
        
        $startDate = match($period) {
            'week' => now()->startOfWeek(),
            'month' => now()->startOfMonth(),
            default => now()->startOfDay(),
        };
        
        $payments = Payment::where('payment_status', 'paid')
            ->where('created_at', '>=', $startDate)
            ->get();
        
        $statistics = [
            'total_revenue' => $payments->sum('amount'),
            'total_transactions' => $payments->count(),
            'average_transaction' => $payments->count() > 0 
                ? $payments->sum('amount') / $payments->count() 
                : 0,
            'payment_methods' => $payments->groupBy('payment_method')->map(function ($group) {
                return [
                    'count' => $group->count(),
                    'percentage' => $payments->count() > 0 
                        ? round(($group->count() / $payments->count()) * 100, 2) 
                        : 0,
                    'amount' => $group->sum('amount'),
                ];
            }),
        ];
        
        return response()->json($statistics);
    }

    /**
     * Refund payment
     */
    public function refundPayment(RefundPaymentRequest $request, $paymentId)
    {

        $payment = Payment::with('order')->findOrFail($paymentId);
        
        if ($payment->payment_status !== 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya pembayaran yang sudah dibayar yang dapat direfund',
            ], 400);
        }

        if ($request->refund_amount > $payment->amount) {
            return response()->json([
                'success' => false,
                'message' => 'Jumlah refund tidak boleh melebihi jumlah pembayaran',
            ], 400);
        }

        // For Midtrans payments, we would call Midtrans API
        // For cash payments, we just update the record
        if ($payment->payment_method === 'midtrans') {
            // TODO: Implement Midtrans refund API
            return response()->json([
                'success' => false,
                'message' => 'Refund untuk pembayaran Midtrans belum tersedia',
            ], 400);
        }

        // Update payment status for cash refund
        $payment->update([
            'payment_status' => 'refunded',
        ]);

        // Update order payment status
        $payment->order->update([
            'payment_status' => 'refunded',
        ]);

        Log::info('Payment refunded', [
            'payment_id' => $payment->id,
            'order_id' => $payment->order->id,
            'refund_amount' => $request->refund_amount,
            'reason' => $request->reason,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Refund berhasil diproses',
            'refund_amount' => $request->refund_amount,
        ]);
    }
}
