<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Display payment page
     */
    public function index($orderId)
    {
        $order = Order::with(['orderDetails.menu'])->findOrFail($orderId);
        
        return Inertia::render('Customer/Payment', [
            'order' => $order,
        ]);
    }

    /**
     * Process payment
     */
    public function process(Request $request, $orderId)
    {
        $request->validate([
            'payment_method' => 'required|in:cash,midtrans,qris,ewallet',
            'amount_received' => 'required_if:payment_method,cash|numeric|min:0',
        ]);

        $order = Order::findOrFail($orderId);
        
        if ($order->payment_status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan sudah dibayar',
            ], 400);
        }

        switch ($request->payment_method) {
            case 'cash':
                $result = $this->paymentService->processCashPayment(
                    $order, 
                    (float) $request->amount_received
                );
                break;
                
            case 'midtrans':
                $result = $this->paymentService->createSnapTransaction(
                    $order,
                    $request->only(['name', 'email', 'phone'])
                );
                break;
                
            default:
                $result = [
                    'success' => false,
                    'message' => 'Metode pembayaran belum tersedia',
                ];
        }

        return response()->json($result);
    }

    /**
     * Handle Midtrans callback
     */
    public function callback(Request $request)
    {
        $notification = $request->all();
        
        Log::info('Midtrans callback received', $notification);
        
        $result = $this->paymentService->handleNotification($notification);
        
        if ($result) {
            return response()->json(['status' => 'OK']);
        }
        
        return response()->json(['status' => 'ERROR'], 500);
    }

    /**
     * Display payment success page
     */
    public function success($orderId)
    {
        $order = Order::with(['orderDetails.menu'])->findOrFail($orderId);
        
        return Inertia::render('Customer/PaymentSuccess', [
            'order' => $order,
        ]);
    }

    /**
     * Display payment error page
     */
    public function error($orderId)
    {
        $order = Order::findOrFail($orderId);
        
        return Inertia::render('Customer/PaymentError', [
            'order' => $order,
        ]);
    }

    /**
     * Check payment status
     */
    public function checkStatus($orderId)
    {
        $order = Order::with(['payments'])->findOrFail($orderId);
        
        $latestPayment = $order->payments()->latest()->first();
        
        if ($latestPayment && $latestPayment->payment_method === 'midtrans') {
            $verification = $this->paymentService->verifyPayment($latestPayment);
        }
        
        return response()->json([
            'order_id' => $order->id,
            'payment_status' => $order->payment_status,
            'total_price' => $order->total_price,
            'payments' => $order->payments,
        ]);
    }
}