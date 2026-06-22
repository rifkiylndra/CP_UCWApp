<?php

use App\Jobs\ReconcileExpiredPayments;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/**
 * Scheduled Jobs
 *
 * Jalankan scheduler di production dengan:
 *   php artisan schedule:work   (development)
 *   * * * * * php /path/to/artisan schedule:run >> /dev/null 2>&1  (crontab production)
 */

// Rekonsiliasi payment Pakasir yang expired — setiap 15 menit
Schedule::job(new ReconcileExpiredPayments())->everyFifteenMinutes()
    ->withoutOverlapping()
    ->onFailure(function () {
        \Illuminate\Support\Facades\Log::error('ReconcileExpiredPayments scheduled job failed.');
    });
