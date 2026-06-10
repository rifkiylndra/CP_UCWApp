<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\CreateOrderRequest;
use App\Models\Order;
use App\Models\Table;
use App\Services\CustomerOrderAccessService;
use App\Services\OrderService;
use App\Services\AiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected $orderService;
    protected $aiService;
    protected $orderAccess;

    public function __construct(OrderService $orderService, AiService $aiService, CustomerOrderAccessService $orderAccess)
    {
        $this->orderService = $orderService;
        $this->aiService = $aiService;
        $this->orderAccess = $orderAccess;
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
                $currentQueue = Order::whereIn('order_status', Order::activeQueueStatuses())->count();
                $estimation = $this->aiService->getServingTimeEstimation([
                    'items' => $orderItems,
                    'current_queue' => $currentQueue,
                ]);
                $orderData['estimated_serve_time'] = $estimation['estimated_max_time'];
            } catch (\Exception $e) {
                // Fallback to OrderService base calculation if AI fails
            }

            $order = $this->orderService->createOrder($orderData, $orderItems);
            $this->orderAccess->grant($request, $order);
            
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
    public function status(Request $request, $orderRef)
    {
        if ($redirect = $this->redirectNumericOrderToRef($request, $orderRef, 'customer.status')) {
            return $redirect;
        }

        $order = $this->findCustomerOrder($request, $orderRef, ['table', 'orderDetails.menu', 'payments']);
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
            'orderStatus' => Order::customerStatus($order->order_status),
            'pakasirMethod' => $this->pakasirMethodFromPaymentMethod($latestPayment?->payment_method ?? $order->payment_method),
            'paymentNumber' => $latestPayment?->payment_number,
            'totalPayment' => $latestPayment?->total_payment,
            'expiredAt' => $latestPayment?->expired_at?->toIso8601String(),
            'items' => $order->orderDetails->map(function ($detail) {
                return [
                    'id' => (string) $detail->id,
                    'menuId' => (string) $detail->menu_id,
                    'name' => $detail->menu_name ?? $detail->menu?->name,
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
    public function show(Request $request, $orderRef)
    {
        $order = $this->findCustomerOrder($request, $orderRef, ['table', 'orderDetails.menu', 'payments']);

        return response()->json($order);
    }

    /**
     * Get active orders for table
     */
    public function getTableOrders(Request $request, $tableId)
    {
        $orders = Order::with(['orderDetails.menu'])
            ->where('table_id', $tableId)
            ->whereIn('order_status', Order::activeQueueStatuses())
            ->orderBy('created_at', 'desc')
            ->get()
            ->filter(fn (Order $order) => $this->orderAccess->canAccess($request, $order))
            ->values();

        return response()->json($orders);
    }

    /**
     * Cancel order
     */
    public function cancel(Request $request, $orderRef)
    {
        $order = $this->findCustomerOrder($request, $orderRef);
        
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
        $currentQueue = Order::whereIn('order_status', Order::activeQueueStatuses())->count();

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

    private function findCustomerOrder(Request $request, string $orderRef, array $with = []): Order
    {
        $order = Order::with($with)->where('order_ref', $orderRef)->firstOrFail();

        $this->orderAccess->abortUnlessCanAccess($request, $order);

        return $order;
    }

    private function redirectNumericOrderToRef(Request $request, string $orderRef, string $route)
    {
        if (!ctype_digit($orderRef)) {
            return null;
        }

        $order = Order::find($orderRef);

        if ($order) {
            $this->orderAccess->abortUnlessCanAccess($request, $order);
        }

        return $order
            ? redirect()->route($route, ['order' => $order->order_ref])
            : null;
    }
}
