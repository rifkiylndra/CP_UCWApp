<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderDetailResource extends JsonResource
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
            'menu_id' => $this->menu_id,
            'menu_name' => $this->menu_name ?? $this->menu?->name ?? 'Deleted menu',
            'menu_price' => $this->unit_price ?? $this->menu?->price,
            'menu_price_formatted' => 'Rp ' . number_format((float) ($this->unit_price ?? $this->menu?->price ?? 0), 0, ',', '.'),
            'quantity' => $this->quantity,
            'note' => $this->note,
            'subtotal' => $this->subtotal,
            'subtotal_formatted' => 'Rp ' . number_format($this->subtotal, 0, ',', '.'),
        ];
    }
}
