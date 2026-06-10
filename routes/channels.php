<?php

use App\Models\Order;
use App\Services\CustomerOrderAccessService;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Private staff channels.
Broadcast::channel('staff-orders', function ($user) {
    return $user && ($user->isStaff() || $user->isAdmin());
});

Broadcast::channel('staff-payments', function ($user) {
    return $user && ($user->isStaff() || $user->isAdmin());
});

// Private order updates are limited to staff/admin or the customer session that created the order.
Broadcast::channel('order.{orderId}', function ($user, $orderId) {
    $order = Order::find($orderId);
    
    if (!$order) {
        return false;
    }
    
    if ($user && ($user->isStaff() || $user->isAdmin())) {
        return true;
    }
    
    return app(CustomerOrderAccessService::class)->canAccess(request(), $order);
});

// Admin analytics channel
Broadcast::channel('admin-analytics', function ($user) {
    return $user && $user->isAdmin();
});
