<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ==================== PUBLIC ROUTES ====================
// Root redirect ke landing page customer (Sesuai Frontend)
Route::get('/', fn () => redirect()->route('customer.landing'))->name('welcome');

// ==================== AUTHENTICATION (UNIVERSAL) ====================
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// ==================== STAFF ROUTES ====================
Route::middleware(['auth', 'role:staff'])->prefix('staff')->name('staff.')->group(function () {
    // Staff Dashboard
    Route::get('/dashboard', [\App\Http\Controllers\Staff\DashboardController::class, 'index'])->name('dashboard');
    
    // Staff Transactions
    Route::get('/transactions', [\App\Http\Controllers\Staff\DashboardController::class, 'transactions'])->name('transactions');
    Route::get('/transactions/export', [\App\Http\Controllers\Staff\DashboardController::class, 'exportTransactions'])->name('transactions.export');
    
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
    
    // Rute Inertia Tambahan dari Frontend
    Route::get('/live-order', [\App\Http\Controllers\Admin\DashboardController::class, 'liveOrder'])->name('live-order');
    Route::get('/ai-analytics', [\App\Http\Controllers\Admin\AnalyticsController::class, 'index'])->name('analytics-page');
    // Menu Management
    Route::get('/menu', [\App\Http\Controllers\Admin\MenuController::class, 'index'])->name('menu');
    Route::post('/menu', [\App\Http\Controllers\Admin\MenuController::class, 'store'])->name('menu.store');
    Route::post('/menu/{menu}', [\App\Http\Controllers\Admin\MenuController::class, 'update'])->name('menu.update');
    Route::delete('/menu/{menu}', [\App\Http\Controllers\Admin\MenuController::class, 'destroy'])->name('menu.destroy');
    Route::get('/menu-categories', [\App\Http\Controllers\Admin\CategoryController::class, 'index'])->name('menu-categories.index');
    Route::post('/menu-categories', [\App\Http\Controllers\Admin\CategoryController::class, 'store'])->name('menu-categories.store');
    Route::put('/menu-categories/{category}', [\App\Http\Controllers\Admin\CategoryController::class, 'update'])->name('menu-categories.update');
    Route::delete('/menu-categories/{category}', [\App\Http\Controllers\Admin\CategoryController::class, 'destroy'])->name('menu-categories.destroy');
    
    // Staff Management
    Route::get('/staff', [\App\Http\Controllers\Admin\StaffController::class, 'index'])->name('staff');
    Route::get('/staff/export', [\App\Http\Controllers\Admin\StaffController::class, 'export'])->name('staff.export');
    Route::post('/staff', [\App\Http\Controllers\Admin\StaffController::class, 'store'])->name('staff.store');
    Route::put('/staff/{staff}', [\App\Http\Controllers\Admin\StaffController::class, 'update'])->name('staff.update');
    Route::delete('/staff/{staff}', [\App\Http\Controllers\Admin\StaffController::class, 'destroy'])->name('staff.destroy');
    
    Route::get('/finances', [\App\Http\Controllers\Admin\FinanceController::class, 'index'])->name('finances-page');
    Route::get('/finances/export', [\App\Http\Controllers\Admin\FinanceController::class, 'export'])->name('finances.export');

    // Statistics and charts
    Route::get('/statistics/orders-chart', [\App\Http\Controllers\Admin\DashboardController::class, 'getOrdersChartData'])->name('statistics.ordersChart');
    Route::get('/statistics/revenue', [\App\Http\Controllers\Admin\DashboardController::class, 'getRevenueStatistics'])->name('statistics.revenue');
    
    // AI Analytics API
    Route::prefix('analytics')->name('analytics.')->group(function () {
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
});

// ==================== CUSTOMER ROUTES ====================
Route::prefix('customer')->name('customer.')->group(function () {
    // Landing page
    Route::get('/', fn (\Illuminate\Http\Request $request) => Inertia::render('Customer/Landing', [
        'tableId' => $request->query('tableId', '')
    ]))->name('landing');
    Route::get('/landing', fn () => redirect()->route('customer.landing'));
    
    // Menu page (accessed via QR code)
    Route::get('/menu', [\App\Http\Controllers\Customer\MenuController::class, 'index'])->name('menu');
    
    // Cart page
    Route::get('/cart', [\App\Http\Controllers\Customer\OrderController::class, 'cart'])->name('cart');
    
    // Create order
    Route::post('/order', [\App\Http\Controllers\Customer\OrderController::class, 'store'])->name('order.store');
    
    // Order status tracking
    Route::get('/order/{order}/status', [\App\Http\Controllers\Customer\OrderController::class, 'status'])->name('order.status');
    Route::get('/status/{order}', [\App\Http\Controllers\Customer\OrderController::class, 'status'])->name('status');
    
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
    Route::post('/order/{order}/payments/pakasir', [\App\Http\Controllers\Customer\PaymentController::class, 'createPakasirPaymentByOrder'])->name('payment.pakasir.order');
    Route::post('/{tableId}/orders/{order}/payments/pakasir', [\App\Http\Controllers\Customer\PaymentController::class, 'createPakasirPayment'])->name('payment.pakasir');
    Route::get('/order/{order}/payment/success', [\App\Http\Controllers\Customer\PaymentController::class, 'success'])->name('payment.success');
    Route::get('/order/{order}/payment/error', [\App\Http\Controllers\Customer\PaymentController::class, 'error'])->name('payment.error');
    Route::get('/order/{order}/payment/status', [\App\Http\Controllers\Customer\PaymentController::class, 'checkStatus'])->name('payment.status');
    Route::get('/order/{order}/payment/cash', function (\Illuminate\Http\Request $request, string $order) {
        $model = ctype_digit($order)
            ? \App\Models\Order::with(['table', 'payments'])->findOrFail($order)
            : \App\Models\Order::with(['table', 'payments'])->where('order_ref', $order)->firstOrFail();

        if (ctype_digit($order)) {
            return redirect()->route('customer.payment.cash', ['order' => $model->order_ref]);
        }

        $payment = $model->payments()->latest()->first();

        return Inertia::render('Customer/CashConfirmation', [
            'tableId' => $request->query('tableId', $model->table_id ?? ''),
            'tableNumber' => $model->table?->table_number ?? '',
            'orderId' => (string) $model->id,
            'orderRef' => $model->order_ref,
            'total' => $model->total_price,
            'paymentMethod' => $model->payment_method,
            'paymentStatus' => $model->payment_status ?? $payment?->payment_status,
        ]);
    })->name('payment.cash');
    Route::get('/order/{order}/payment/online', function (\Illuminate\Http\Request $request, string $order) {
        $model = ctype_digit($order)
            ? \App\Models\Order::with(['table', 'payments'])->findOrFail($order)
            : \App\Models\Order::with(['table', 'payments'])->where('order_ref', $order)->firstOrFail();

        if (ctype_digit($order)) {
            return redirect()->route('customer.payment.online', ['order' => $model->order_ref]);
        }

        $payment = $model->payments()->latest()->first();

        return Inertia::render('Customer/OnlinePayment', [
            'tableId' => $request->query('tableId', $model->table_id ?? ''),
            'tableNumber' => $model->table?->table_number ?? '',
            'orderId' => (string) $model->id,
            'orderRef' => $model->order_ref,
            'total' => $model->total_price,
            'paymentMethod' => $model->payment_method ?? $payment?->payment_method,
            'paymentStatus' => $model->payment_status ?? $payment?->payment_status,
            'pakasirMethod' => match ($payment?->payment_method ?? $model?->payment_method) {
                'qris_pakasir' => 'qris',
                'bri_va_pakasir' => 'bri_va',
                default => null,
            },
            'paymentNumber' => $payment?->payment_number,
            'totalPayment' => $payment?->total_payment,
            'expiredAt' => $payment?->expired_at?->toIso8601String(),
        ]);
    })->name('payment.online');
    
    // Midtrans callback (public endpoint)
    Route::post('/payment/callback', [\App\Http\Controllers\Customer\PaymentController::class, 'callback'])->name('payment.callback');
    
    // Review
    Route::get('/order/{order}/review', [\App\Http\Controllers\Customer\ReviewController::class, 'create'])->name('review.create');
    Route::post('/order/{order}/complete-transaction', [\App\Http\Controllers\Customer\ReviewController::class, 'store'])->name('review.store');
    Route::get('/order/{order}/reviews', [\App\Http\Controllers\Customer\ReviewController::class, 'getOrderReviews'])->name('review.list');
    Route::get('/reviews/recent', [\App\Http\Controllers\Customer\ReviewController::class, 'getRecentReviews'])->name('review.recent');
    Route::get('/reviews/statistics', [\App\Http\Controllers\Customer\ReviewController::class, 'getStatistics'])->name('review.statistics');
    
    // Additional Customer Flow Routes (Inertia Direct Renders for Static Views)
    Route::get('/order-type', fn (\Illuminate\Http\Request $request) => Inertia::render('Customer/OrderType', [
        'tableId' => $request->query('tableId', '')
    ]))->name('order-type');
    
    Route::get('/estimate', fn (\Illuminate\Http\Request $request) => Inertia::render('Customer/Estimate', [
        'tableId' => $request->query('tableId', '')
    ]))->name('estimate');
    
    Route::get('/payment/cash', function (\Illuminate\Http\Request $request) {
        $orderKey = $request->query('orderRef') ?? $request->query('order') ?? $request->query('orderId');
        $order = $orderKey
            ? (ctype_digit((string) $orderKey)
                ? \App\Models\Order::find($orderKey)
                : \App\Models\Order::where('order_ref', $orderKey)->first())
            : null;

        return $order
            ? redirect()->route('customer.payment.cash', ['order' => $order->order_ref])
            : redirect()->route('customer.cart');
    });
    
    Route::get('/payment/online', function (\Illuminate\Http\Request $request) {
        $orderKey = $request->query('orderRef') ?? $request->query('order') ?? $request->query('orderId');
        $order = $orderKey
            ? (ctype_digit((string) $orderKey)
                ? \App\Models\Order::find($orderKey)
                : \App\Models\Order::where('order_ref', $orderKey)->first())
            : null;

        return $order
            ? redirect()->route('customer.payment.online', ['order' => $order->order_ref])
            : redirect()->route('customer.cart');
    });
    
    Route::get('/order/{order}/feedback', function (\Illuminate\Http\Request $request, string $order) {
        $model = ctype_digit($order)
            ? \App\Models\Order::with('table')->findOrFail($order)
            : \App\Models\Order::with('table')->where('order_ref', $order)->firstOrFail();

        if (ctype_digit($order)) {
            return redirect()->route('customer.feedback', ['order' => $model->order_ref]);
        }

        if ($model->order_status !== 'completed') {
            return redirect()->route('customer.order.status', ['order' => $model->order_ref]);
        }

        return Inertia::render('Customer/Feedback', [
            'tableId' => $request->query('tableId', $model->table_id ?? ''),
            'tableNumber' => $model->table?->table_number ?? '',
            'orderId' => (string) $model->id,
            'orderRef' => $model->order_ref,
            'orderStatus' => $model->order_status,
            'visitTime' => $model->created_at->format('h:i A'),
        ]);
    })->name('feedback');
    
    // AI Estimation Proxy for Customer
    Route::post('/api/estimate', [\App\Http\Controllers\Customer\OrderController::class, 'getEstimatedTime'])->name('api.estimate');

    // Backward-compatible redirects for old tableId-based customer URLs.
    Route::get('/{tableId}', fn () => redirect()->route('customer.landing'));
    Route::get('/{tableId}/menu', fn () => redirect()->route('customer.menu'));
    Route::get('/{tableId}/cart', fn () => redirect()->route('customer.cart'));
    Route::get('/{tableId}/order-type', fn () => redirect()->route('customer.order-type'));
    Route::get('/{tableId}/estimate', fn () => redirect()->route('customer.estimate'));
    Route::get('/{tableId}/payment', function (\Illuminate\Http\Request $request) {
        $orderId = $request->query('order') ?? $request->query('orderId');

        return $orderId
            ? redirect()->route('customer.payment', ['order' => $orderId])
            : redirect()->route('customer.cart');
    });
    Route::get('/{tableId}/payment/online', function (\Illuminate\Http\Request $request) {
        $orderKey = $request->query('orderRef') ?? $request->query('order') ?? $request->query('orderId');
        $order = $orderKey
            ? (ctype_digit((string) $orderKey)
                ? \App\Models\Order::find($orderKey)
                : \App\Models\Order::where('order_ref', $orderKey)->first())
            : null;

        return $order
            ? redirect()->route('customer.payment.online', ['order' => $order->order_ref])
            : redirect()->route('customer.cart');
    });
    Route::get('/{tableId}/payment/cash', function (\Illuminate\Http\Request $request) {
        $orderKey = $request->query('orderRef') ?? $request->query('order') ?? $request->query('orderId');
        $order = $orderKey
            ? (ctype_digit((string) $orderKey)
                ? \App\Models\Order::find($orderKey)
                : \App\Models\Order::where('order_ref', $orderKey)->first())
            : null;

        return $order
            ? redirect()->route('customer.payment.cash', ['order' => $order->order_ref])
            : redirect()->route('customer.cart');
    });
});

// Fallback route (optional)
Route::fallback(fn () => redirect('/'));
