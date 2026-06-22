<?php

namespace App\Jobs;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * ReconcileExpiredPayments
 *
 * Job ini dijalankan secara terjadwal (misal: setiap 15 menit) untuk:
 * 1. Menemukan payment Pakasir yang berstatus 'unpaid' dan sudah melewati expired_at.
 * 2. Mengubah payment_status menjadi 'expired'.
 * 3. Mengubah order.payment_status menjadi 'expired' jika belum ada payment lain yang 'paid'.
 * 4. Mencatat semua perubahan ke log untuk audit.
 */
class ReconcileExpiredPayments implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Jumlah maksimal percobaan ulang jika job gagal.
     */
    public int $tries = 3;

    /**
     * Batas timeout eksekusi job (detik).
     */
    public int $timeout = 120;

    public function handle(): void
    {
        Log::info('ReconcileExpiredPayments: Starting reconciliation job.');

        $expiredPayments = Payment::where('provider', 'pakasir')
            ->where('payment_status', 'unpaid')
            ->whereNotNull('expired_at')
            ->where('expired_at', '<', now())
            ->with('order')
            ->get();

        if ($expiredPayments->isEmpty()) {
            Log::info('ReconcileExpiredPayments: No expired payments found.');
            return;
        }

        Log::info('ReconcileExpiredPayments: Found expired payments.', [
            'count' => $expiredPayments->count(),
        ]);

        $expiredPayments->each(function (Payment $payment) {
            $this->processExpiredPayment($payment);
        });

        Log::info('ReconcileExpiredPayments: Reconciliation job completed.');
    }

    private function processExpiredPayment(Payment $payment): void
    {
        try {
            DB::transaction(function () use ($payment) {
                // Update status payment menjadi 'expired'
                $payment->update(['payment_status' => 'expired']);

                $order = $payment->order;

                if (!$order) {
                    Log::warning('ReconcileExpiredPayments: Payment has no related order.', [
                        'payment_id' => $payment->id,
                    ]);
                    return;
                }

                // Hanya update order jika belum ada payment lain yang 'paid'
                $hasPaidPayment = $order->payments()
                    ->where('id', '!=', $payment->id)
                    ->where('payment_status', 'paid')
                    ->exists();

                if (!$hasPaidPayment && $order->payment_status === 'unpaid') {
                    $order->update(['payment_status' => 'expired']);
                }

                Log::info('ReconcileExpiredPayments: Payment marked as expired.', [
                    'payment_id'      => $payment->id,
                    'order_id'        => $order->id,
                    'order_ref'       => $order->order_ref,
                    'payment_method'  => $payment->payment_method,
                    'expired_at'      => $payment->expired_at,
                    'order_status_updated' => !$hasPaidPayment && $order->payment_status === 'expired',
                ]);
            });
        } catch (\Throwable $e) {
            Log::error('ReconcileExpiredPayments: Failed to process expired payment.', [
                'payment_id' => $payment->id,
                'error'      => $e->getMessage(),
            ]);
        }
    }
}
