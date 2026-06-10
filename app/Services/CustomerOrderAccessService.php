<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CustomerOrderAccessService
{
    private const SESSION_KEY = 'customer_order_access';

    public function grant(Request $request, Order $order): ?string
    {
        if (!$request->hasSession()) {
            return null;
        }

        $token = Str::random(40);
        $orders = $request->session()->get(self::SESSION_KEY, []);
        $orders[$order->order_ref] = [
            'id' => $order->id,
            'token' => $token,
        ];

        $request->session()->put(self::SESSION_KEY, $orders);

        return $token;
    }

    public function canAccess(Request $request, Order $order): bool
    {
        $user = $request->user();

        if ($user && ($user->isStaff() || $user->isAdmin())) {
            return true;
        }

        if (!$request->hasSession()) {
            return false;
        }

        $access = $request->session()->get(self::SESSION_KEY . '.' . $order->order_ref);

        return is_array($access)
            && (int) ($access['id'] ?? 0) === (int) $order->id
            && !empty($access['token']);
    }

    public function abortUnlessCanAccess(Request $request, Order $order): void
    {
        abort_unless($this->canAccess($request, $order), 403, 'You do not have access to this order.');
    }
}
