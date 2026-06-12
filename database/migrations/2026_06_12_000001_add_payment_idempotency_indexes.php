<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const PROVIDER_REFERENCE_INDEX = 'payments_provider_reference_method_unique';
    private const MIDTRANS_TRANSACTION_INDEX = 'payments_midtrans_transaction_method_unique';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Nullable columns remain safe: PostgreSQL and SQLite allow multiple NULL values in unique indexes.
            $table->unique(['provider', 'provider_reference', 'payment_method'], self::PROVIDER_REFERENCE_INDEX);
            $table->unique(['midtrans_transaction_id', 'payment_method'], self::MIDTRANS_TRANSACTION_INDEX);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropUnique(self::PROVIDER_REFERENCE_INDEX);
            $table->dropUnique(self::MIDTRANS_TRANSACTION_INDEX);
        });
    }
};
