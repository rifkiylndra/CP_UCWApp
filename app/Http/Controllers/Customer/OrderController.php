<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\CreateOrderRequest;
use App\Models\Order;
use App\Models\Table;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Display cart page
     */
    public function cart(Request $request)
    {
        $tableId = $request->query('table_id');
        $table = null;
        
        if ($tableId) {
            $table = Table::find($tableId);
        }

        return Inertia::render('Customer/Cart', [
            'table' => $table,
        ]);
    }

    /**
     * Create new order
     */
    public function store(CreateOrderRequest $request)
    {
        try {
            $orderData = $request->validated();
            $orderItems = $request->input('items', []);
            
            $order = $this->orderService->createOrder($orderData, $orderItems);
            
            return response()->json([
                'success' => true,
                'order_id' => $order->id,
                'message' => 'Pesanan berhasil dibuat',
                'redirect_url' => route('customer.payment', ['order' => $order->id])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat pesanan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display order status page
     */
    public function status($orderId)
    {
        $order = Order::with(['table', 'orderDetails.menu', 'payments'])
            ->findOrFail($orderId);

        return Inertia::render('Customer/OrderStatus', [
            'order' => $order,
        ]);
    }

    /**
     * Get order details
     */
    public function show($orderId)
    {
        $order = Order::with(['table', 'orderDetails.menu', 'payments'])
            ->findOrFail($orderId);

        return response()->json($order);
    }

    /**
     * Get active orders for table
     */
    public function getTableOrders($tableId)
    {
        $orders = Order::with(['orderDetails.menu'])
            ->where('table_id', $tableId)
            ->whereIn('order_status', ['pending', 'processing'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Cancel order
     */
    public function cancel($orderId)
    {
        $order = Order::findOrFail($orderId);
        
        // Only allow cancellation if order is still pending
        if ($order->order_status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak dapat dibatalkan karena sudah diproses'
            ], 400);
        }

        $order->update(['order_status' => 'cancelled']);
        
        // Free table if dine-in
        if ($order->order_type === 'dine_in' && $order->table_id) {
            Table::where('id', $order->table_id)->update(['status' => 'available']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dibatalkan'
        ]);
    }
}