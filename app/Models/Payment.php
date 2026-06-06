<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id', 'provider', 'provider_reference', 'payment_method', 'payment_status',
        'amount', 'fee', 'total_payment', 'midtrans_transaction_id', 'payment_number',
        'expired_at', 'paid_at', 'completed_at', 'raw_response', 'raw_webhook'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'fee' => 'decimal:2',
        'total_payment' => 'decimal:2',
        'expired_at' => 'datetime',
        'paid_at' => 'datetime',
        'completed_at' => 'datetime',
        'raw_response' => 'array',
        'raw_webhook' => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
