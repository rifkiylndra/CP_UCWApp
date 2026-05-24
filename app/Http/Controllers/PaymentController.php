<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PaymentService;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Handle webhook from Midtrans.
     */
    public function webhook(Request $request)
    {
        $payload = $request->all();
        
        $success = $this->paymentService->verifyMidtransWebhook($payload);

        if ($success) {
            return response()->json(['status' => 'success', 'message' => 'Payment status updated']);
        }

        return response()->json(['status' => 'error', 'message' => 'Failed to process webhook'], 400);
    }
}
