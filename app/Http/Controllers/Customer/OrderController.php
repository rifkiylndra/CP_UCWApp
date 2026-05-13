<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\CreateOrderRequest;
use App\Http\Resources\OrderDetailResource;
use App\Models\Order;
use App\Services\OrderService;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(private OrderService $orderService)
    {
    }

    /**
     * Create new order
     */
    public function store(CreateOrderRequest $request)
    {
        $order = $this->orderService->createOrder($request->validated());

        return response()->json([
            'data' => new OrderDetailResource($order),
            'message' => 'Order created successfully',
        ], 201);
    }

    /**
     * Get order status
     */
    public function show(Order $order)
    {
        $order = $this->orderService->getOrderDetail($order->id);

        return response()->json([
            'data' => new OrderDetailResource($order),
        ]);
    }

    /**
     * Get order page
     */
    public function orderStatus(Order $order)
    {
        $order = $this->orderService->getOrderDetail($order->id);

        return Inertia::render('Customer/OrderStatus', [
            'order' => new OrderDetailResource($order),
        ]);
    }
}
