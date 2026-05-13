<?php

namespace Database\Seeders;

use App\Models\SystemConfig;
use Illuminate\Database\Seeder;

class SystemConfigSeeder extends Seeder
{
    public function run(): void
    {
        $configs = [
            ['key' => 'payment_methods', 'value' => 'cash,midtrans'],
            ['key' => 'default_serve_time', 'value' => '15'],
            ['key' => 'notification_enabled', 'value' => 'true'],
            ['key' => 'ai_service_enabled', 'value' => 'true'],
        ];

        foreach ($configs as $config) {
            SystemConfig::create($config);
        }
    }
}
