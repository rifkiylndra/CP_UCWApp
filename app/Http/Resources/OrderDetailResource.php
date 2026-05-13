<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_name' => $this->customer_name,
            'table_id' => $this->table_id,
            'table' => $this->when($this->relationLoaded('table'), $this->table),
            'order_type' => $this->order_type,
            'order_status' => $this->order_status,
            'payment_status' => $this->payment_status,
            'estimated_serve_time' => $this->estimated_serve_time,
            'total_price' => (float) $this->total_price,
            'order_details' => OrderItemResource::collection($this->whenLoaded('orderDetails')),
            'reviews' => $this->whenLoaded('reviews'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
