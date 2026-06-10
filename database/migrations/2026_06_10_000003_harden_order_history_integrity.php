<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_details', function (Blueprint $table) {
            if (!Schema::hasColumn('order_details', 'menu_name')) {
                $table->string('menu_name')->nullable();
            }

            if (!Schema::hasColumn('order_details', 'unit_price')) {
                $table->decimal('unit_price', 12, 2)->nullable();
            }
        });

        $this->backfillOrderDetailSnapshots();
        $this->makeOrderDetailMenuNullableWithSetNull();
        $this->addReviewUniqueConstraint();

        Schema::table('orders', function (Blueprint $table) {
            $table->index(['order_status', 'created_at'], 'orders_status_created_idx');
            $table->index(['payment_status', 'order_status', 'created_at'], 'orders_payment_status_created_idx');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->index(['payment_status', 'payment_method', 'created_at'], 'payments_status_method_created_idx');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex('payments_status_method_created_idx');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('orders_status_created_idx');
            $table->dropIndex('orders_payment_status_created_idx');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropUnique('reviews_order_id_unique');
        });

        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('order_details', function (Blueprint $table) {
                $table->dropForeign(['menu_id']);
                $table->foreign('menu_id')->references('id')->on('menus')->cascadeOnDelete();
            });
        }

        Schema::table('order_details', function (Blueprint $table) {
            $table->dropColumn(['menu_name', 'unit_price']);
        });
    }

    private function backfillOrderDetailSnapshots(): void
    {
        DB::table('order_details')
            ->leftJoin('menus', 'order_details.menu_id', '=', 'menus.id')
            ->select([
                'order_details.id',
                'order_details.quantity',
                'order_details.subtotal',
                'menus.name as current_menu_name',
                'menus.price as current_menu_price',
            ])
            ->orderBy('order_details.id')
            ->each(function ($detail): void {
                $quantity = max(1, (int) $detail->quantity);

                DB::table('order_details')
                    ->where('id', $detail->id)
                    ->update([
                        'menu_name' => $detail->current_menu_name ?? 'Deleted menu',
                        'unit_price' => $detail->current_menu_price ?? ((float) $detail->subtotal / $quantity),
                    ]);
            });
    }

    private function makeOrderDetailMenuNullableWithSetNull(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('order_details', function (Blueprint $table) {
                $table->dropForeign(['menu_id']);
            });
        }

        Schema::table('order_details', function (Blueprint $table) {
            $table->foreignId('menu_id')->nullable()->change();
        });

        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('order_details', function (Blueprint $table) {
                $table->foreign('menu_id')->references('id')->on('menus')->nullOnDelete();
            });
        }
    }

    private function addReviewUniqueConstraint(): void
    {
        $hasDuplicateReviews = DB::table('reviews')
            ->select('order_id')
            ->whereNotNull('order_id')
            ->groupBy('order_id')
            ->havingRaw('COUNT(*) > 1')
            ->exists();

        if ($hasDuplicateReviews) {
            throw new RuntimeException('Cannot add reviews.order_id unique constraint while duplicate reviews exist.');
        }

        Schema::table('reviews', function (Blueprint $table) {
            $table->unique('order_id', 'reviews_order_id_unique');
        });
    }
};
