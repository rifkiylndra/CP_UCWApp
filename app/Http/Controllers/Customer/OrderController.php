<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\CreateOrderRequest;
use App\Models\Order;
use App\Models\Table;
use App\Services\OrderService;
use App\Services\AiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected $orderService;
    protected $aiService;

    public function __construct(OrderService $orderService, AiService $aiService)
    {
        $this->orderService = $orderService;
        $this->aiService = $aiService;
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
            'tableId' => $table?->id ?? '',
            'tableNumber' => $table?->table_number ?? '',
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
            
            try {
                $currentQueue = Order::whereIn('order_status', ['pending', 'processing'])->count();
                $estimation = $this->aiService->getServingTimeEstimation([
                    'items' => $orderItems,
                    'current_queue' => $currentQueue,
                ]);
                $orderData['estimated_serve_time'] = $estimation['estimated_max_time'];
            } catch (\Exception $e) {
                // Fallback to OrderService base calculation if AI fails
            }

            $order = $this->orderService->createOrder($orderData, $orderItems);
            
            return response()->json([
                'success' => true,
                'order_id' => $order->id,
                'order_ref' => $order->order_ref,
                'total' => (float) $order->total_price,
                'message' => 'Pesanan berhasil dibuat',
                'redirect_url' => route('customer.payment', ['order' => $order->order_ref])
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
    public function status($orderRef)
    {
        if ($redirect = $this->redirectNumericOrderToRef($orderRef, 'customer.status')) {
            return $redirect;
        }

        $order = $this->findCustomerOrder($orderRef, ['table', 'orderDetails.menu', 'payments']);
        $latestPayment = $order->payments()->latest()->first();

        return Inertia::render('Customer/OrderStatus', [
            'order' => $order,
            'tableId' => $order->table_id ?? '',
            'tableNumber' => $order->table?->table_number ?? '',
            'orderId' => (string) $order->id,
            'orderRef' => $order->order_ref,
            'total' => $order->total_price,
            'createdAt' => $order->created_at?->toIso8601String(),
            'updatedAt' => $order->updated_at?->toIso8601String(),
            'estimatedServeTime' => $order->estimated_serve_time,
            'paymentMethod' => $order->payment_method,
            'paymentStatus' => $order->payment_status,
            'orderStatus' => $order->order_status,
            'pakasirMethod' => $this->pakasirMethodFromPaymentMethod($latestPayment?->payment_method ?? $order->payment_method),
            'paymentNumber' => $latestPayment?->payment_number,
            'totalPayment' => $latestPayment?->total_payment,
            'expiredAt' => $latestPayment?->expired_at?->toIso8601String(),
            'items' => $order->orderDetails->map(function ($detail) {
                return [
                    'id' => (string) $detail->id,
                    'menuId' => (string) $detail->menu_id,
                    'name' => $detail->menu?->name,
                    'quantity' => $detail->quantity,
                    'note' => $detail->note,
                    'subtotal' => (float) $detail->subtotal,
                ];
            })->toArray(),
        ]);
    }

    /**
     * Get order details
     */
    public function show($orderRef)
    {
        $order = $this->findCustomerOrder($orderRef, ['table', 'orderDetails.menu', 'payments']);

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
    public function cancel($orderRef)
    {
        $order = $this->findCustomerOrder($orderRef);
        
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

    /**
     * Get estimated serve time from AI
     */
    public function getEstimatedTime(Request $request)
    {
        $items = $request->input('items', []);
        
        // Count active queue
        $currentQueue = Order::whereIn('order_status', ['pending', 'processing'])->count();

        // Normally we would map items to the required structure for AiService
        // But for proxy, just pass them
        try {
            $estimation = $this->aiService->getServingTimeEstimation([
                'items' => $items,
                'current_queue' => $currentQueue,
            ]);

            return response()->json($estimation);
        } catch (\Exception $e) {
            // Fallback estimation
            return response()->json([
                'estimated_min_time' => 10,
                'estimated_max_time' => 15,
                'queue_position' => $currentQueue + 1,
                'is_fallback' => true
            ]);
        }
    }

    private function pakasirMethodFromPaymentMethod(?string $paymentMethod): ?string
    {
        return match ($paymentMethod) {
            'qris_pakasir' => 'qris',
            'bri_va_pakasir' => 'bri_va',
            default => null,
        };
    }

    private function findCustomerOrder(string $orderRef, array $with = []): Order
    {
        return Order::with($with)->where('order_ref', $orderRef)->firstOrFail();
    }

    private function redirectNumericOrderToRef(string $orderRef, string $route)
    {
        if (!ctype_digit($orderRef)) {
            return null;
        }

        $order = Order::find($orderRef);

        return $order
            ? redirect()->route($route, ['order' => $order->order_ref])
            : null;
    }
}
