<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\StaffAuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ==================== PUBLIC ROUTES ====================
// Halaman Landing / Welcome (bisa diganti nanti)
Route::get('/', fn () => Inertia::render('Welcome'))->name('welcome');

// ==================== AUTHENTICATION (UNIVERSAL) ====================
Route::get('/login', [\App\Http\Controllers\AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout'])->name('logout');

// ==================== STAFF ROUTES ====================
Route::middleware(['auth', 'role:staff'])->prefix('staff')->name('staff.')->group(function () {
    // Staff Dashboard
    Route::get('/dashboard', [\App\Http\Controllers\Staff\DashboardController::class, 'index'])->name('dashboard');
    
    // Staff Transactions
    Route::get('/transactions', fn () => Inertia::render('Staff/Transactions'))->name('transactions');
    
    // Order management
    Route::get('/orders/status/{status}', [\App\Http\Controllers\Staff\DashboardController::class, 'getOrdersByStatus'])->name('orders.byStatus');
    Route::put('/order/{order}/status', [\App\Http\Controllers\Staff\DashboardController::class, 'updateOrderStatus'])->name('order.updateStatus');
    Route::get('/order/{order}', [\App\Http\Controllers\Staff\DashboardController::class, 'getOrderDetails'])->name('order.details');
    
    // Today's orders
    Route::get('/orders/today', [\App\Http\Controllers\Staff\DashboardController::class, 'getTodayOrders'])->name('orders.today');
    
    // Statistics
    Route::get('/statistics', [\App\Http\Controllers\Staff\DashboardController::class, 'getStatistics'])->name('statistics');
    
    // Payment management
    Route::prefix('payments')->name('payments.')->group(function () {
        Route::post('/order/{order}/verify-cash', [\App\Http\Controllers\Staff\PaymentController::class, 'verifyCashPayment'])->name('verifyCash');
        Route::get('/{payment}', [\App\Http\Controllers\Staff\PaymentController::class, 'getPaymentDetails'])->name('details');
        Route::get('/today', [\App\Http\Controllers\Staff\PaymentController::class, 'getTodayPayments'])->name('today');
        Route::get('/statistics', [\App\Http\Controllers\Staff\PaymentController::class, 'getPaymentStatistics'])->name('statistics');
        Route::post('/{payment}/refund', [\App\Http\Controllers\Staff\PaymentController::class, 'refundPayment'])->name('refund');
    });
});

// ==================== ADMIN ROUTES ====================
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Admin Dashboard
    Route::get('/overview', [\App\Http\Controllers\Admin\DashboardController::class, 'overview'])->name('overview');
    
    // Statistics and charts
    Route::get('/statistics/orders-chart', [\App\Http\Controllers\Admin\DashboardController::class, 'getOrdersChartData'])->name('statistics.ordersChart');
    Route::get('/statistics/revenue', [\App\Http\Controllers\Admin\DashboardController::class, 'getRevenueStatistics'])->name('statistics.revenue');
    
    // AI Analytics
    Route::prefix('analytics')->name('analytics.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\AnalyticsController::class, 'index'])->name('index');
        Route::get('/serving-time', [\App\Http\Controllers\Admin\AnalyticsController::class, 'getServingTimeEstimation'])->name('servingTime');
        Route::get('/popular-menus', [\App\Http\Controllers\Admin\AnalyticsController::class, 'getPopularMenus'])->name('popularMenus');
        Route::post('/analyze-sentiment', [\App\Http\Controllers\Admin\AnalyticsController::class, 'analyzeSentiment'])->name('analyzeSentiment');
        Route::get('/sentiment-summary', [\App\Http\Controllers\Admin\AnalyticsController::class, 'getSentimentSummaryData'])->name('sentimentSummary');
        Route::get('/model-performance', [\App\Http\Controllers\Admin\AnalyticsController::class, 'getModelPerformance'])->name('modelPerformance');
    });
    
    // System Configuration
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\SystemConfigController::class, 'index'])->name('index');
        Route::get('/all', [\App\Http\Controllers\Admin\SystemConfigController::class, 'getAll'])->name('all');
        Route::get('/{key}', [\App\Http\Controllers\Admin\SystemConfigController::class, 'get'])->name('get');
        Route::put('/{key}', [\App\Http\Controllers\Admin\SystemConfigController::class, 'update'])->name('update');
        Route::put('/', [\App\Http\Controllers\Admin\SystemConfigController::class, 'updateMultiple'])->name('updateMultiple');
        Route::get('/system/settings', [\App\Http\Controllers\Admin\SystemConfigController::class, 'getSettings'])->name('system');
        Route::get('/payment/settings', [\App\Http\Controllers\Admin\SystemConfigController::class, 'getPaymentSettings'])->name('payment');
        Route::put('/payment/settings', [\App\Http\Controllers\Admin\SystemConfigController::class, 'updatePaymentSettings'])->name('updatePayment');
    });
    
    // Admin routes lainnya akan ditambahkan di sini
});

// ==================== CUSTOMER ROUTES ====================
Route::prefix('customer')->name('customer.')->group(function () {
    // Menu page (accessed via QR code)
    Route::get('/menu', [\App\Http\Controllers\Customer\MenuController::class, 'index'])->name('menu');
    
    // Cart page
    Route::get('/cart', [\App\Http\Controllers\Customer\OrderController::class, 'cart'])->name('cart');
    
    // Create order
    Route::post('/order', [\App\Http\Controllers\Customer\OrderController::class, 'store'])->name('order.store');
    
    // Order status tracking
    Route::get('/order/{order}/status', [\App\Http\Controllers\Customer\OrderController::class, 'status'])->name('order.status');
    
    // Get order details (API)
    Route::get('/order/{order}', [\App\Http\Controllers\Customer\OrderController::class, 'show'])->name('order.show');
    
    // Cancel order
    Route::post('/order/{order}/cancel', [\App\Http\Controllers\Customer\OrderController::class, 'cancel'])->name('order.cancel');
    
    // Get table orders
    Route::get('/table/{table}/orders', [\App\Http\Controllers\Customer\OrderController::class, 'getTableOrders'])->name('table.orders');
    
    // Menu API endpoints
    Route::get('/menu/category/{category}', [\App\Http\Controllers\Customer\MenuController::class, 'getByCategory'])->name('menu.byCategory');
    Route::get('/menu/search', [\App\Http\Controllers\Customer\MenuController::class, 'search'])->name('menu.search');
    Route::get('/menu/{menu}', [\App\Http\Controllers\Customer\MenuController::class, 'show'])->name('menu.show');
    
    // Payment
    Route::get('/order/{order}/payment', [\App\Http\Controllers\Customer\PaymentController::class, 'index'])->name('payment');
    Route::post('/order/{order}/payment/process', [\App\Http\Controllers\Customer\PaymentController::class, 'process'])->name('payment.process');
    Route::get('/order/{order}/payment/success', [\App\Http\Controllers\Customer\PaymentController::class, 'success'])->name('payment.success');
    Route::get('/order/{order}/payment/error', [\App\Http\Controllers\Customer\PaymentController::class, 'error'])->name('payment.error');
    Route::get('/order/{order}/payment/status', [\App\Http\Controllers\Customer\PaymentController::class, 'checkStatus'])->name('payment.status');
    
    // Midtrans callback (public endpoint)
    Route::post('/payment/callback', [\App\Http\Controllers\Customer\PaymentController::class, 'callback'])->name('payment.callback');
    
    // Review
    Route::get('/order/{order}/review', [\App\Http\Controllers\Customer\ReviewController::class, 'create'])->name('review.create');
    Route::post('/order/{order}/review', [\App\Http\Controllers\Customer\ReviewController::class, 'store'])->name('review.store');
    Route::get('/order/{order}/reviews', [\App\Http\Controllers\Customer\ReviewController::class, 'getOrderReviews'])->name('review.list');
    Route::get('/reviews/recent', [\App\Http\Controllers\Customer\ReviewController::class, 'getRecentReviews'])->name('review.recent');
    Route::get('/reviews/statistics', [\App\Http\Controllers\Customer\ReviewController::class, 'getStatistics'])->name('review.statistics');
});

// Fallback route (optional)
Route::fallback(fn () => redirect('/'));