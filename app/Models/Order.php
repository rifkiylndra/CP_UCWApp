<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_ref', 'table_id', 'customer_name', 'order_type', 'order_status',
        'payment_status', 'payment_method', 'estimated_serve_time', 'total_price'
    ];

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (!$order->order_ref) {
                $order->order_ref = static::generateOrderRef();
            }
        });
    }

    public static function generateOrderRef(): string
    {
        do {
            $ref = 'UCW-' . now()->format('Ymd') . '-' . Str::upper(Str::random(6));
        } while (static::where('order_ref', $ref)->exists());

        return $ref;
    }

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }
}
