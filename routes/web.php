<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes — UCW App (Unand Co-Workspace)
|--------------------------------------------------------------------------
*/

/* ── Customer App Routes ── */
Route::prefix('order')->name('customer.')->group(function () {
    Route::get('/{tableId}', fn (string $tableId) =>
        Inertia::render('Customer/Landing', ['tableId' => $tableId])
    )->name('landing');

    Route::get('/{tableId}/menu', fn (string $tableId) =>
        Inertia::render('Customer/Menu', ['tableId' => $tableId])
    )->name('menu');

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

    Route::get('/{tableId}/status/{orderId}', fn (string $tableId, string $orderId) =>
        Inertia::render('Customer/OrderStatus', ['tableId' => $tableId, 'orderId' => $orderId])
    )->name('status');

    Route::get('/{tableId}/ready/{orderId}', fn (string $tableId, string $orderId) =>
        Inertia::render('Customer/OrderReady', ['tableId' => $tableId, 'orderId' => $orderId])
    )->name('ready');

    Route::get('/{tableId}/feedback/{orderId}', fn (string $tableId, string $orderId) =>
        Inertia::render('Customer/Feedback', ['tableId' => $tableId, 'orderId' => $orderId])
    )->name('feedback');
});

/* ── Staff Dashboard Routes ── */
Route::prefix('staff')->name('staff.')->group(function () {
    Route::get('/login', fn () => Inertia::render('Staff/Login'))->name('login');
    Route::get('/dashboard', fn () => Inertia::render('Staff/Dashboard'))->name('dashboard');
    Route::get('/transactions', fn () => Inertia::render('Staff/Transactions'))->name('transactions');
});

/* ── Admin Dashboard Routes ── */
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', fn () => Inertia::render('Admin/Login'))->name('login');
    Route::get('/overview', fn () => Inertia::render('Admin/Overview'))->name('overview');
    Route::get('/live-order', fn () => Inertia::render('Admin/LiveOrder'))->name('live-order');
    Route::get('/ai-analytics', fn () => Inertia::render('Admin/AIAnalytics'))->name('ai-analytics');
    Route::get('/menu', fn () => Inertia::render('Admin/Menu/Index'))->name('menu');
    Route::get('/staff', fn () => Inertia::render('Admin/Staff/Index'))->name('staff');
    Route::get('/finances', fn () => Inertia::render('Admin/Finances'))->name('finances');
});

/* ── Root redirect ── */
Route::get('/', fn () => redirect()->route('customer.landing', ['tableId' => 'T01']));