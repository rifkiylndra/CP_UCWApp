<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->integer('rating')->nullable()->default(null)->change();
            $table->text('comment')->nullable()->change();
        });
    }

    public function down(): void
    {
        DB::table('reviews')->whereNull('rating')->update(['rating' => 5]);

        Schema::table('reviews', function (Blueprint $table) {
            $table->integer('rating')->default(5)->nullable(false)->change();
            $table->text('comment')->nullable()->change();
        });
    }
};
