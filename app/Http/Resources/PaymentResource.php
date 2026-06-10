<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            'provider' => $this->provider,
            'provider_reference' => $this->provider_reference,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'amount' => $this->amount,
            'fee' => $this->fee,
            'total_payment' => $this->total_payment,
            'payment_number' => $this->payment_number,
            'expired_at' => $this->expired_at?->toIso8601String(),
            'paid_at' => $this->paid_at?->toIso8601String(),
            'completed_at' => $this->completed_at?->toIso8601String(),
        ];
    }
}
