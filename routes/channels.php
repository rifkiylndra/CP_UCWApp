<?php

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Public channels for staff
Broadcast::channel('staff-orders', function ($user) {
    return $user && ($user->isStaff() || $user->isAdmin());
});

Broadcast::channel('staff-payments', function ($user) {
    return $user && ($user->isStaff() || $user->isAdmin());
});

// Private channel for order updates (accessible by staff/admin and the customer via session)
Broadcast::channel('order.{orderId}', function ($user, $orderId) {
    $order = Order::find($orderId);
    
    if (!$order) {
        return false;
    }
    
    // Staff and admin can access all orders
    if ($user && ($user->isStaff() || $user->isAdmin())) {
        return true;
    }
    
    // Customer can access their own order via session
    // In a real implementation, you would check session or token
    return true; // Simplified for now
});

// Admin analytics channel
Broadcast::channel('admin-analytics', function ($user) {
    return $user && $user->isAdmin();
});
