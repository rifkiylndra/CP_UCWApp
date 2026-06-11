<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public API routes
Route::middleware('api')->group(function () {
    // Health check
    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toDateTimeString(),
            'service' => 'UCW API',
            'version' => '1.0.0',
        ]);
    });
    
    // Menu API (public)
    Route::prefix('menu')->group(function () {
        Route::get('/', [\App\Http\Controllers\Customer\MenuController::class, 'index']);
        Route::get('/category/{category}', [\App\Http\Controllers\Customer\MenuController::class, 'getByCategory']);
        Route::get('/search', [\App\Http\Controllers\Customer\MenuController::class, 'search']);
        Route::get('/{menu}', [\App\Http\Controllers\Customer\MenuController::class, 'show']);
    });
    
    // Order API (public for QR ordering)
    Route::prefix('order')->group(function () {
        Route::post('/', [\App\Http\Controllers\Customer\OrderController::class, 'store'])->middleware('throttle:30,1');
        Route::get('/{order}', [\App\Http\Controllers\Customer\OrderController::class, 'show']);
        Route::get('/table/{table}/orders', [\App\Http\Controllers\Customer\OrderController::class, 'getTableOrders']);
    });
    
    // Payment callback (Midtrans)
    Route::post('/payment/callback', [\App\Http\Controllers\Customer\PaymentController::class, 'callback']);
    Route::post('/webhooks/pakasir', [\App\Http\Controllers\Customer\PaymentController::class, 'pakasirWebhook'])
        ->middleware('throttle:120,1');

    $environment = config('app.env');
    $pakasirSimulationRouteEnabled = in_array($environment, ['local', 'testing'], true)
        || ($environment !== 'production' && config('services.pakasir.mode') === 'sandbox');

    if ($pakasirSimulationRouteEnabled) {
        Route::post('/dev/pakasir/payments/{order}/simulate', [\App\Http\Controllers\Customer\PaymentController::class, 'simulatePakasirPayment'])
            ->middleware('throttle:30,1')
            ->name('api.dev.pakasir.payments.simulate');
    }
    
    // Review API
    Route::prefix('review')->group(function () {
        Route::post('/order/{order}', [\App\Http\Controllers\Customer\ReviewController::class, 'store']);
        Route::get('/order/{order}', [\App\Http\Controllers\Customer\ReviewController::class, 'getOrderReviews']);
        Route::get('/recent', [\App\Http\Controllers\Customer\ReviewController::class, 'getRecentReviews']);
        Route::get('/statistics', [\App\Http\Controllers\Customer\ReviewController::class, 'getStatistics']);
    });
    
    // System settings (public)
    Route::get('/settings/system', [\App\Http\Controllers\Admin\SystemConfigController::class, 'getSettings']);
});

// Protected API routes (require authentication)
Route::middleware(['auth:sanctum', 'api'])->group(function () {
    // User info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Staff API
    Route::middleware('role:staff')->prefix('staff')->group(function () {
        Route::get('/orders/status/{status}', [\App\Http\Controllers\Staff\DashboardController::class, 'getOrdersByStatus']);
        Route::put('/order/{order}/status', [\App\Http\Controllers\Staff\DashboardController::class, 'updateOrderStatus']);
        Route::get('/order/{order}', [\App\Http\Controllers\Staff\DashboardController::class, 'getOrderDetails']);
        Route::get('/orders/today', [\App\Http\Controllers\Staff\DashboardController::class, 'getTodayOrders']);
        Route::get('/statistics', [\App\Http\Controllers\Staff\DashboardController::class, 'getStatistics']);
        
        // Payment management
        Route::post('/order/{order}/verify-cash', [\App\Http\Controllers\Staff\PaymentController::class, 'verifyCashPayment']);
        Route::get('/payments/today', [\App\Http\Controllers\Staff\PaymentController::class, 'getTodayPayments']);
        Route::get('/payments/statistics', [\App\Http\Controllers\Staff\PaymentController::class, 'getPaymentStatistics']);
    });
    
    // Admin API
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // Dashboard statistics
        Route::get('/statistics/orders-chart', [\App\Http\Controllers\Admin\DashboardController::class, 'getOrdersChartData']);
        Route::get('/statistics/revenue', [\App\Http\Controllers\Admin\DashboardController::class, 'getRevenueStatistics']);
        
        // AI Analytics
        Route::get('/analytics/popular-menus', [\App\Http\Controllers\Admin\AnalyticsController::class, 'getPopularMenus']);
        Route::post('/analytics/analyze-sentiment', [\App\Http\Controllers\Admin\AnalyticsController::class, 'analyzeSentiment']);
        Route::get('/analytics/sentiment-summary', [\App\Http\Controllers\Admin\AnalyticsController::class, 'getSentimentSummaryData']);
        Route::get('/analytics/model-performance', [\App\Http\Controllers\Admin\AnalyticsController::class, 'getModelPerformance']);
        
        // System Configuration
        Route::get('/settings/all', [\App\Http\Controllers\Admin\SystemConfigController::class, 'getAll']);
        Route::get('/settings/{key}', [\App\Http\Controllers\Admin\SystemConfigController::class, 'get']);
        Route::put('/settings/{key}', [\App\Http\Controllers\Admin\SystemConfigController::class, 'update']);
        Route::put('/settings', [\App\Http\Controllers\Admin\SystemConfigController::class, 'updateMultiple']);
        Route::get('/settings/payment', [\App\Http\Controllers\Admin\SystemConfigController::class, 'getPaymentSettings']);
        Route::put('/settings/payment', [\App\Http\Controllers\Admin\SystemConfigController::class, 'updatePaymentSettings']);
    });
});
