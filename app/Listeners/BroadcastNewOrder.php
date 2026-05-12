<?php

namespace App\Listeners;

use App\Events\NewOrderPlaced;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class BroadcastNewOrder
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(NewOrderPlaced $event): void
    {
        // Event sudah broadcast otomatis karena implements ShouldBroadcast
        // Listener ini bisa digunakan untuk logging atau notifikasi lainnya
        \Illuminate\Support\Facades\Log::info('New order broadcasted', [
            'order_id' => $event->order->id,
            'channel' => 'staff-orders'
        ]);
    }
}