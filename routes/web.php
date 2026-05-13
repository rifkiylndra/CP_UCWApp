<?php

use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\MenuController as AdminMenuController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Customer\MenuController;
use App\Http\Controllers\Customer\OrderController;
use App\Http\Controllers\Customer\ReviewController;
use App\Http\Controllers\Staff\AuthController as StaffAuthController;
use App\Http\Controllers\Staff\DashboardController;
use App\Http\Controllers\Staff\OrderController as StaffOrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes — UCW App (Unand Co-Workspace)
|--------------------------------------------------------------------------
*/

/* ── Customer App Routes (No Auth Required) ── */
Route::prefix('order')->name('customer.')->group(function () {
    Route::get('/{tableId}', fn (string $tableId) =>
        Inertia::render('Customer/Landing', ['tableId' => $tableId])
    )->name('landing');

    Route::get('/{tableId}/menu', [MenuController::class, 'index'])->name('menu');

    Route::get('/{tableId}/cart', fn (string $tableId) =>
        Inertia::render('Customer/Cart', ['tableId' => $tableId])
    )->name('cart');

    Route::get('/{tableId}/order-type', fn (string $tableId) =>
        Inertia::render('Customer/OrderType', ['tableId' => $tableId])
    )->name('order-type');

    Route::get('/{tableId}/estimate', fn (string $tableId) =>
        Inertia::render('Customer/Estimate', ['tableId' => $tableId])
    )->name('estimate');

    Route::get('/{tableId}/payment', fn (string $tableId) =>
        Inertia::render('Customer/ChoosePayment', ['tableId' => $tableId])
    )->name('payment');

    Route::get('/{tableId}/payment/online', fn (string $tableId) =>
        Inertia::render('Customer/OnlinePayment', ['tableId' => $tableId])
    )->name('payment.online');

    Route::get('/{tableId}/payment/cash', fn (string $tableId) =>
        Inertia::render('Customer/CashConfirmation', ['tableId' => $tableId])
    )->name('payment.cash');

    Route::get('/{tableId}/status/{orderId}', [OrderController::class, 'orderStatus'])->name('status');

    Route::get('/{tableId}/ready/{orderId}', fn (string $tableId, string $orderId) =>
        Inertia::render('Customer/OrderReady', ['tableId' => $tableId, 'orderId' => $orderId])
    )->name('ready');

    Route::get('/{tableId}/feedback/{orderId}', fn (string $tableId, string $orderId) =>
        Inertia::render('Customer/Feedback', ['tableId' => $tableId, 'orderId' => $orderId])
    )->name('feedback');
});

/* ── Staff Authentication Routes ── */
Route::prefix('staff')->name('staff.')->group(function () {
    Route::get('/login', [StaffAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [StaffAuthController::class, 'login'])->name('login.post');

    Route::middleware(['auth', 'role:staff'])->group(function () {
        Route::post('/logout', [StaffAuthController::class, 'logout'])->name('logout');
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/transactions', fn () => Inertia::render('Staff/Transactions'))->name('transactions');

        // Order management
        Route::put('/orders/{order}/status/{status}', [StaffOrderController::class, 'updateStatus'])->name('orders.update-status');
        Route::get('/orders/{order}', [StaffOrderController::class, 'show'])->name('orders.show');
    });
});

/* ── Admin Authentication Routes ── */
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.post');

    Route::middleware(['auth', 'role:admin'])->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
        Route::get('/overview', fn () => Inertia::render('Admin/Overview'))->name('overview');
        Route::get('/live-order', fn () => Inertia::render('Admin/LiveOrder'))->name('live-order');

        // Analytics
        Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');
        Route::get('/analytics/revenue', [AnalyticsController::class, 'revenueReport'])->name('analytics.revenue');
        Route::get('/analytics/orders', [AnalyticsController::class, 'orderStats'])->name('analytics.orders');

        // Menu management
        Route::get('/menu', [AdminMenuController::class, 'index'])->name('menu');
        Route::post('/menu', [AdminMenuController::class, 'store'])->name('menu.store');
        Route::put('/menu/{menu}', [AdminMenuController::class, 'update'])->name('menu.update');
        Route::delete('/menu/{menu}', [AdminMenuController::class, 'destroy'])->name('menu.destroy');

        // Staff management
        Route::get('/staff', [StaffController::class, 'index'])->name('staff');
        Route::post('/staff', [StaffController::class, 'store'])->name('staff.store');
        Route::put('/staff/{staff}', [StaffController::class, 'update'])->name('staff.update');
        Route::delete('/staff/{staff}', [StaffController::class, 'destroy'])->name('staff.destroy');

        // Reports
        Route::get('/reports', [ReportController::class, 'index'])->name('reports');
        Route::get('/reports/daily-sales', [ReportController::class, 'dailySales'])->name('reports.daily-sales');
        Route::get('/reports/payment-methods', [ReportController::class, 'paymentMethods'])->name('reports.payment-methods');
        Route::get('/reports/feedback', [ReportController::class, 'customerFeedback'])->name('reports.feedback');
    });
});

/* ── API Routes (for AJAX/Fetch) ── */
Route::prefix('api')->name('api.')->group(function () {
    // Customer API
    Route::prefix('customer')->name('customer.')->group(function () {
        Route::get('/menus', [MenuController::class, 'index'])->name('menus');
        Route::get('/menus/{menu}', [MenuController::class, 'show'])->name('menus.show');
        Route::get('/categories/{category}/menus', [MenuController::class, 'getByCategory'])->name('categories.menus');
        Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
        Route::post('/orders/{order}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    });

    // Staff API
    Route::prefix('staff')->middleware(['auth', 'role:staff'])->name('staff.')->group(function () {
        Route::get('/orders/status/{status}', [DashboardController::class, 'getOrdersByStatus'])->name('orders.by-status');
    });

    // Admin API
    Route::prefix('admin')->middleware(['auth', 'role:admin'])->name('admin.')->group(function () {
        Route::get('/analytics/revenue', [AnalyticsController::class, 'revenueReport'])->name('analytics.revenue');
        Route::get('/analytics/orders', [AnalyticsController::class, 'orderStats'])->name('analytics.orders');
    });
});

/* ── Root redirect ── */
Route::get('/', fn () => redirect()->route('customer.landing', ['tableId' => 'T01']));
