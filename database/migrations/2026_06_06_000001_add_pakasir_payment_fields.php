<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'order_ref')) {
                $table->string('order_ref')->nullable()->after('id');
            }

            if (!Schema::hasColumn('orders', 'payment_method')) {
                $table->string('payment_method')->nullable()->after('payment_status');
            }
        });

        DB::table('orders')
            ->whereNull('order_ref')
            ->orderBy('id')
            ->each(function ($order) {
                DB::table('orders')
                    ->where('id', $order->id)
                    ->update(['order_ref' => $this->generateOrderRef()]);
            });

        Schema::table('orders', function (Blueprint $table) {
            $table->unique('order_ref');
            
            if (DB::connection()->getDriverName() === 'pgsql') {
                DB::statement('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_order_status_check');
                DB::statement('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check');
            }
            
            $table->string('order_status', 32)->default('pending')->change();
            $table->string('payment_status', 32)->default('unpaid')->change();
        });

        Schema::table('payments', function (Blueprint $table) {
            if (!Schema::hasColumn('payments', 'provider')) {
                $table->string('provider')->nullable()->after('order_id');
            }

            if (!Schema::hasColumn('payments', 'provider_reference')) {
                $table->string('provider_reference')->nullable()->after('provider');
            }

            if (!Schema::hasColumn('payments', 'payment_number')) {
                $table->text('payment_number')->nullable()->after('midtrans_transaction_id');
            }

            if (!Schema::hasColumn('payments', 'fee')) {
                $table->decimal('fee', 12, 2)->nullable()->after('amount');
            }

            if (!Schema::hasColumn('payments', 'total_payment')) {
                $table->decimal('total_payment', 12, 2)->nullable()->after('fee');
            }

            if (!Schema::hasColumn('payments', 'expired_at')) {
                $table->timestamp('expired_at')->nullable()->after('payment_number');
            }

            if (!Schema::hasColumn('payments', 'completed_at')) {
                $table->timestamp('completed_at')->nullable()->after('paid_at');
            }

            if (!Schema::hasColumn('payments', 'raw_response')) {
                $table->json('raw_response')->nullable()->after('completed_at');
            }

            if (!Schema::hasColumn('payments', 'raw_webhook')) {
                $table->json('raw_webhook')->nullable()->after('raw_response');
            }
        });

        Schema::table('payments', function (Blueprint $table) {
            // Drop enum constraint for PostgreSQL before changing column type
            if (DB::connection()->getDriverName() === 'pgsql') {
                DB::statement('ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_payment_status_check');
            }
            $table->string('payment_status', 32)->default('unpaid')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn([
                'provider',
                'provider_reference',
                'payment_number',
                'fee',
                'total_payment',
                'expired_at',
                'completed_at',
                'raw_response',
                'raw_webhook',
            ]);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropUnique(['order_ref']);
            $table->dropColumn(['order_ref', 'payment_method']);
        });
    }

    private function generateOrderRef(): string
    {
        do {
            $ref = 'UCW-' . now()->format('Ymd') . '-' . Str::upper(Str::random(6));
        } while (DB::table('orders')->where('order_ref', $ref)->exists());

        return $ref;
    }
};
