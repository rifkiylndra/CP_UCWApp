<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Events\OrderStatusUpdated;
use App\Events\PaymentStatusUpdated;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    /**
     * Create Midtrans Snap transaction
     * 
     * @param Order $order
     * @param array $customerData
     * @return array
     */
    public function createSnapTransaction(Order $order, array $customerData = []): array
    {
        try {
            $serverKey = config('services.midtrans.server_key');
            $isProduction = config('services.midtrans.is_production', false);
            
            $baseUrl = $isProduction 
                ? 'https://app.midtrans.com/snap/v1/transactions'
                : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
            
            $transactionDetails = [
                'order_id' => 'ORDER-' . $order->id . '-' . time(),
                'gross_amount' => (int) $order->total_price,
            ];
            
            $customerDetails = [
                'first_name' => $customerData['name'] ?? $order->customer_name ?? 'Customer',
                'email' => $customerData['email'] ?? 'customer@example.com',
                'phone' => $customerData['phone'] ?? '081234567890',
            ];
            
            $itemDetails = [];
            foreach ($order->orderDetails as $detail) {
                $itemDetails[] = [
                    'id' => $detail->menu_id,
                    'price' => (int) $detail->menu->price,
                    'quantity' => $detail->quantity,
                    'name' => $detail->menu->name,
                ];
            }
            
            $payload = [
                'transaction_details' => $transactionDetails,
                'customer_details' => $customerDetails,
                'item_details' => $itemDetails,
                'callbacks' => [
                    'finish' => route('customer.payment.callback'),
                    'error' => route('customer.payment.error'),
                    'pending' => route('customer.payment.pending'),
                ],
            ];
            
            $response = Http::withBasicAuth($serverKey, '')
                ->timeout(30)
                ->post($baseUrl, $payload);
            
            if ($response->successful()) {
                $responseData = $response->json();
                
                // Create payment record
                $payment = Payment::create([
                    'order_id' => $order->id,
                    'payment_method' => 'midtrans',
                    'payment_status' => 'pending',
                    'amount' => $order->total_price,
                    'midtrans_transaction_id' => $responseData['transaction_id'] ?? $transactionDetails['order_id'],
                ]);
                
                Log::info('Midtrans transaction created', [
                    'order_id' => $order->id,
                    'transaction_id' => $payment->midtrans_transaction_id,
                    'snap_token' => $responseData['token'] ?? null,
                ]);
                
                return [
                    'success' => true,
                    'snap_token' => $responseData['token'],
                    'redirect_url' => $responseData['redirect_url'] ?? null,
                    'payment_id' => $payment->id,
                ];
            }
            
            Log::error('Midtrans API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            
            return [
                'success' => false,
                'message' => 'Failed to create payment transaction',
                'error' => $response->body(),
            ];
        } catch (\Exception $e) {
            Log::error('Midtrans service error: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Payment service error: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Handle Midtrans notification
     * 
     * @param array $notification
     * @return bool
     */
    public function handleNotification(array $notification): bool
    {
        try {
            $transactionId = $notification['transaction_id'] ?? null;
            $orderId = $this->extractOrderIdFromTransaction($notification['order_id'] ?? '');
            $transactionStatus = $notification['transaction_status'] ?? null;
            $fraudStatus = $notification['fraud_status'] ?? null;
            
            if (!$orderId || !$transactionStatus) {
                Log::warning('Invalid Midtrans notification', $notification);
                return false;
            }
            
            $payment = Payment::where('midtrans_transaction_id', $transactionId)
                ->orWhere('midtrans_transaction_id', $notification['order_id'])
                ->first();
            
            if (!$payment) {
                Log::warning('Payment not found for Midtrans notification', $notification);
                return false;
            }
            
            $order = $payment->order;
            
            // Update payment status based on notification
            $newPaymentStatus = $this->mapPaymentStatus($transactionStatus, $fraudStatus);
            $payment->update([
                'payment_status' => $newPaymentStatus,
                'paid_at' => $newPaymentStatus === 'paid' ? now() : null,
            ]);
            
            // Update order payment status
            $order->update([
                'payment_status' => $newPaymentStatus === 'paid' ? 'paid' : 'unpaid',
            ]);
            
            Log::info('Payment status updated via Midtrans notification', [
                'payment_id' => $payment->id,
                'order_id' => $order->id,
                'old_status' => $payment->getOriginal('payment_status'),
                'new_status' => $newPaymentStatus,
                'transaction_status' => $transactionStatus,
            ]);
            
            // Trigger event for payment status update
            event(new \App\Events\PaymentStatusUpdated($order));
            
            return true;
        } catch (\Exception $e) {
            Log::error('Error handling Midtrans notification: ' . $e->getMessage(), $notification);
            return false;
        }
    }

    /**
     * Create a cash payment that must be verified manually by staff.
     */
    public function createCashPayment(Order $order): array
    {
        try {
            $payment = Payment::updateOrCreate(
                [
                    'order_id' => $order->id,
                    'payment_method' => 'cash',
                    'payment_status' => 'waiting_verification',
                ],
                [
                    'provider' => 'manual',
                    'provider_reference' => $order->order_ref,
                    'amount' => $order->total_price,
                    'total_payment' => $order->total_price,
                ]
            );

            $order->update([
                'payment_method' => 'cash',
                'payment_status' => 'waiting_verification',
            ]);

            event(new PaymentStatusUpdated($order));

            Log::info('Cash payment waiting verification', [
                'order_id' => $order->id,
                'order_ref' => $order->order_ref,
                'payment_id' => $payment->id,
            ]);

            return [
                'success' => true,
                'message' => 'Pembayaran tunai menunggu verifikasi staff',
                'payment_id' => $payment->id,
                'payment_status' => 'waiting_verification',
                'order_ref' => $order->order_ref,
                'total_price' => $order->total_price,
            ];
        } catch (\Exception $e) {
            Log::error('Cash payment create error: ' . $e->getMessage());

            return [
                'success' => false,
                'message' => 'Gagal mencatat pembayaran tunai: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Verify cash payment manually by staff.
     */
    public function verifyCashPayment(Order $order, float $amountReceived): array
    {
        try {
            $change = $amountReceived - $order->total_price;
            
            if ($change < 0) {
                return [
                    'success' => false,
                    'message' => 'Jumlah pembayaran kurang dari total harga',
                    'required_amount' => $order->total_price,
                    'received_amount' => $amountReceived,
                ];
            }
            
            $payment = $order->payments()
                ->where('payment_method', 'cash')
                ->latest()
                ->first();

            if (!$payment) {
                $payment = new Payment([
                    'order_id' => $order->id,
                    'payment_method' => 'cash',
                ]);
            }

            $payment->fill([
                'provider' => 'manual',
                'provider_reference' => $order->order_ref,
                'payment_status' => 'paid',
                'amount' => $order->total_price,
                'total_payment' => $order->total_price,
                'paid_at' => now(),
                'completed_at' => now(),
            ])->save();
            
            $oldOrderStatus = $order->order_status;

            $order->update([
                'payment_method' => 'cash',
                'payment_status' => 'paid',
                'order_status' => $order->order_status === 'pending' ? 'confirmed' : $order->order_status,
            ]);

            event(new PaymentStatusUpdated($order));
            if ($oldOrderStatus !== $order->order_status) {
                event(new OrderStatusUpdated($order));
            }
            
            Log::info('Cash payment processed', [
                'order_id' => $order->id,
                'payment_id' => $payment->id,
                'total_price' => $order->total_price,
                'amount_received' => $amountReceived,
                'change' => $change,
            ]);
            
            return [
                'success' => true,
                'message' => 'Pembayaran tunai berhasil',
                'payment_id' => $payment->id,
                'total_price' => $order->total_price,
                'amount_received' => $amountReceived,
                'change' => $change,
            ];
        } catch (\Exception $e) {
            Log::error('Cash payment error: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Gagal memproses pembayaran tunai: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Backward compatible alias for older call sites.
     */
    public function processCashPayment(Order $order, float $amountReceived): array
    {
        return $this->verifyCashPayment($order, $amountReceived);
    }

    /**
     * Extract order ID from Midtrans transaction ID
     */
    private function extractOrderIdFromTransaction(string $transactionId): ?int
    {
        // Format: ORDER-{order_id}-{timestamp}
        $parts = explode('-', $transactionId);
        
        if (count($parts) >= 2 && $parts[0] === 'ORDER') {
            return (int) $parts[1];
        }
        
        return null;
    }

    /**
     * Map Midtrans status to our payment status
     */
    private function mapPaymentStatus(string $transactionStatus, ?string $fraudStatus): string
    {
        $statusMap = [
            'capture' => $fraudStatus === 'challenge' ? 'pending' : 'paid',
            'settlement' => 'paid',
            'pending' => 'pending',
            'deny' => 'failed',
            'cancel' => 'failed',
            'expire' => 'failed',
            'refund' => 'refunded',
            'partial_refund' => 'partially_refunded',
        ];
        
        return $statusMap[$transactionStatus] ?? 'pending';
    }

    /**
     * Verify payment status
     * 
     * @param Payment $payment
     * @return array
     */
    public function verifyPayment(Payment $payment): array
    {
        if ($payment->payment_method !== 'midtrans' || !$payment->midtrans_transaction_id) {
            return [
                'success' => false,
                'message' => 'Payment method not supported for verification',
            ];
        }
        
        try {
            $serverKey = config('services.midtrans.server_key');
            $isProduction = config('services.midtrans.is_production', false);
            
            $baseUrl = $isProduction 
                ? 'https://api.midtrans.com/v2'
                : 'https://api.sandbox.midtrans.com/v2';
            
            $response = Http::withBasicAuth($serverKey, '')
                ->timeout(10)
                ->get($baseUrl . '/' . $payment->midtrans_transaction_id . '/status');
            
            if ($response->successful()) {
                $statusData = $response->json();
                return $this->handleNotification($statusData);
            }
            
            return [
                'success' => false,
                'message' => 'Failed to verify payment status',
            ];
        } catch (\Exception $e) {
            Log::error('Payment verification error: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Verification error: ' . $e->getMessage(),
            ];
        }
    }
}
