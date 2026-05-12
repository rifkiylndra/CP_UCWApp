<?php

namespace Database\Seeders;

use App\Models\SystemConfig;
use Illuminate\Database\Seeder;

class SystemConfigSeeder extends Seeder
{
    public function run(): void
    {
        SystemConfig::create(['key' => 'payment_methods', 'value' => 'cash,qris,ewallet,transfer']);
    }
}