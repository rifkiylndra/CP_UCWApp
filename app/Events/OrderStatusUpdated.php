<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $orderId;
    public $status;

    /**
     * Create a new event instance.
     */
    public function __construct(string $orderId, string $status)
    {
        $this->orderId = $orderId;
        $this->status = $status;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('order.' . $this->orderId),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'orderId' => $this->orderId,
            'status' => $this->status,
            'message' => 'Status pesanan diubah menjadi: ' . $this->status
        ];
    }
}
