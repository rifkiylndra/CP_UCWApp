<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasColumn('menus', 'estimated_time')) {
            Schema::table('menus', function (Blueprint $table) {
                $table->integer('estimated_time')->default(15)->after('price');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('menus', 'estimated_time')) {
            Schema::table('menus', function (Blueprint $table) {
                $table->dropColumn('estimated_time');
            });
        }
    }
};
