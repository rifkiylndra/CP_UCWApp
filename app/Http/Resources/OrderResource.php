<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => 'ORD-' . str_pad($this->id, 6, '0', STR_PAD_LEFT),
            'table_id' => $this->table_id,
            'table_number' => $this->table?->table_number,
            'customer_name' => $this->customer_name,
            'order_type' => $this->order_type,
            'order_type_label' => $this->order_type === 'dine_in' ? 'Dine In' : 'Takeaway',
            'order_status' => \App\Models\Order::customerStatus($this->order_status),
            'order_status_label' => $this->getStatusLabel(\App\Models\Order::customerStatus($this->order_status)),
            'payment_status' => $this->payment_status,
            'payment_status_label' => $this->payment_status === 'paid' ? 'Lunas' : 'Belum Bayar',
            'estimated_serve_time' => $this->estimated_serve_time,
            'total_price' => $this->total_price,
            'total_price_formatted' => 'Rp ' . number_format($this->total_price, 0, ',', '.'),
            'created_at' => $this->created_at->format('d/m/Y H:i'),
            'updated_at' => $this->updated_at->format('d/m/Y H:i'),
            'order_details' => OrderDetailResource::collection($this->whenLoaded('orderDetails')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
            'review' => new ReviewResource($this->whenLoaded('review')),
        ];
    }

    /**
     * Get status label in Indonesian
     */
    private function getStatusLabel($status): string
    {
        $labels = [
            'pending' => 'Menunggu',
            'confirmed' => 'Dikonfirmasi',
            'processing' => 'Diproses',
            'preparing' => 'Diproses',
            'ready' => 'Siap',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan',
        ];

        return $labels[$status] ?? $status;
    }
}
