<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_PREPARING = 'preparing';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_READY = 'ready';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

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

    public static function normalizeStatusForStorage(string $status): string
    {
        return $status === self::STATUS_PROCESSING ? self::STATUS_PREPARING : $status;
    }

    public static function customerStatus(?string $status): ?string
    {
        return $status === self::STATUS_PROCESSING ? self::STATUS_PREPARING : $status;
    }

    public static function staffColumnStatus(?string $status): string
    {
        if (in_array($status, [self::STATUS_PENDING, self::STATUS_CONFIRMED], true)) {
            return 'incoming';
        }

        if (in_array($status, [self::STATUS_PROCESSING, self::STATUS_PREPARING, self::STATUS_READY], true)) {
            return 'processing';
        }

        return $status ?? self::STATUS_PENDING;
    }

    public static function activeQueueStatuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_CONFIRMED,
            self::STATUS_PROCESSING,
            self::STATUS_PREPARING,
        ];
    }

    public static function staffProcessingStatuses(): array
    {
        return [
            self::STATUS_PROCESSING,
            self::STATUS_PREPARING,
            self::STATUS_READY,
        ];
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
