<?php

namespace App\Services;

use App\Events\PaymentStatusUpdated;
use App\Models\Order;
use Illuminate\Support\Facades\Http;

class PaymentService
{
    /**
     * Update payment status
     */
    public function updatePaymentStatus(Order $order, string $status): Order
    {
        $order->update(['payment_status' => $status]);

        // Broadcast event
        event(new PaymentStatusUpdated($order));

        return $order;
    }

    /**
     * Verify cash payment
     */
    public function verifyCashPayment(Order $order): Order
    {
        return $this->updatePaymentStatus($order, 'paid');
    }

    /**
     * Create Midtrans payment token
     */
    public function createMidtransToken(Order $order): array
    {
        $serverKey = config('services.midtrans.server_key');
        $clientKey = config('services.midtrans.client_key');

        $payload = [
            'transaction_details' => [
                'order_id' => 'ORDER-' . $order->id . '-' . time(),
                'gross_amount' => (int) $order->total_price,
            ],
            'customer_details' => [
                'first_name' => $order->customer_name ?? 'Customer',
                'email' => 'customer@ucw.app',
            ],
            'item_details' => $order->orderDetails->map(function ($detail) {
                return [
                    'id' => $detail->menu_id,
                    'price' => (int) $detail->menu->price,
                    'quantity' => $detail->quantity,
                    'name' => $detail->menu->name,
                ];
            })->toArray(),
        ];

        $response = Http::withBasicAuth($serverKey, '')
            ->post('https://app.sandbox.midtrans.com/snap/v1/transactions', $payload);

        return [
            'token' => $response->json('token'),
            'redirect_url' => $response->json('redirect_url'),
        ];
    }

    /**
     * Verify Midtrans payment
     */
    public function verifyMidtransPayment(string $transactionId): array
    {
        $serverKey = config('services.midtrans.server_key');

        $response = Http::withBasicAuth($serverKey, '')
            ->get("https://app.sandbox.midtrans.com/snap/v1/transactions/{$transactionId}/status");

        return $response->json();
    }
}
