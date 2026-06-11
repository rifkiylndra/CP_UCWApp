<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Events\OrderStatusUpdated;
use App\Events\PaymentStatusUpdated;
use App\Services\CustomerOrderAccessService;
use App\Services\PakasirService;
use App\Services\PaymentService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected $paymentService;
    protected $pakasirService;
    protected $orderAccess;

    public function __construct(
        PaymentService $paymentService,
        PakasirService $pakasirService,
        CustomerOrderAccessService $orderAccess
    )
    {
        $this->paymentService = $paymentService;
        $this->pakasirService = $pakasirService;
        $this->orderAccess = $orderAccess;
    }

    /**
     * Display payment page
     */
    public function index(Request $request, $orderRef)
    {
        if ($redirect = $this->redirectNumericOrderToRef($request, $orderRef, 'customer.payment')) {
            return $redirect;
        }

        $order = $this->findCustomerOrder($request, $orderRef, ['table', 'orderDetails.menu', 'payments']);
        $latestPayment = $order->payments()->latest()->first();
        
        return Inertia::render('Customer/ChoosePayment', [
            'order' => $order,
            'tableId' => $order->table_id ?? '',
            'tableNumber' => $order->table ? $order->table->table_number : '',
            'total' => $order->total_price,
            'orderId' => $order->id,
            'orderRef' => $order->order_ref,
            'paymentMethod' => $order->payment_method,
            'paymentStatus' => $order->payment_status,
            'orderStatus' => Order::customerStatus($order->order_status),
            'pakasirMethod' => $this->pakasirMethodFromPaymentMethod($latestPayment?->payment_method ?? $order->payment_method),
            'paymentNumber' => $latestPayment?->payment_number,
            'totalPayment' => $latestPayment?->total_payment,
            'expiredAt' => $latestPayment?->expired_at?->toIso8601String(),
            'items' => $this->formatItems($order),
        ]);
    }

    /**
     * Process payment
     */
    public function process(Request $request, $orderRef)
    {
        $request->validate([
            'payment_method' => 'required|in:cash,midtrans,qris,ewallet,qris_pakasir,bri_va,bri_va_pakasir',
            'amount_received' => 'nullable|numeric|min:0',
        ]);

        $order = $this->findCustomerOrder($request, $orderRef, ['table', 'payments']);
        
        if ($order->payment_status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan sudah dibayar',
            ], 400);
        }

        switch ($request->payment_method) {
            case 'cash':
                $result = $this->paymentService->createCashPayment($order);
                break;

            case 'midtrans':
                // Midtrans is kept for future migration, but production currently uses Pakasir.
                if (!$this->gatewayIs('midtrans')) {
                    $result = [
                        'success' => false,
                        'message' => 'Midtrans gateway is not active.',
                    ];
                    break;
                }

                $result = $this->paymentService->createSnapTransaction($order);
                break;

            case 'qris':
            case 'qris_pakasir':
                $result = $this->createPakasirPaymentForOrder($order, 'qris');
                break;

            case 'bri_va':
            case 'bri_va_pakasir':
                $result = $this->createPakasirPaymentForOrder($order, 'bri_va');
                break;
                
            default:
                $result = [
                    'success' => false,
                    'message' => 'Metode pembayaran belum tersedia',
                ];
        }

        return response()->json($result);
    }

    public function createPakasirPayment(Request $request, $tableId, $orderRef)
    {
        if (!$this->gatewayIs('pakasir')) {
            return response()->json([
                'success' => false,
                'message' => 'Pakasir gateway is not active.',
            ], 403);
        }

        $request->validate([
            'method' => 'required|in:qris,bri_va',
        ]);

        $order = $this->resolveCustomerOrder($request, $orderRef, ['table', 'payments']);

        if (!$this->orderMatchesTable($order, (string) $tableId)) {
            return response()->json([
                'success' => false,
                'message' => 'Order tidak sesuai dengan meja',
            ], 403);
        }

        if ($order->payment_status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan sudah dibayar',
            ], 400);
        }

        return response()->json($this->createPakasirPaymentForOrder($order, $request->method));
    }

    public function createPakasirPaymentByOrder(Request $request, $orderRef)
    {
        if (!$this->gatewayIs('pakasir')) {
            return response()->json([
                'success' => false,
                'message' => 'Pakasir gateway is not active.',
            ], 403);
        }

        $request->validate([
            'method' => 'required|in:qris,bri_va',
        ]);

        $order = $this->resolveCustomerOrder($request, $orderRef, ['table', 'payments']);

        if ($order->payment_status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan sudah dibayar',
            ], 400);
        }

        return response()->json($this->createPakasirPaymentForOrder($order, $request->method));
    }

    public function pakasirWebhook(Request $request)
    {
        $payload = $request->all();

        $order = Order::with(['payments'])->where('order_ref', $payload['order_id'] ?? null)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order tidak ditemukan',
            ], 404);
        }

        if (!$this->pakasirService->validateWebhook($payload, $order)) {
            return response()->json([
                'success' => false,
                'message' => 'Payload webhook Pakasir tidak valid',
            ], 422);
        }

        $paymentMethod = $this->pakasirService->paymentMethodForPakasirMethod($payload['payment_method']);
        $existingPaidPayment = $order->payments()
            ->where('provider', 'pakasir')
            ->where('payment_method', $paymentMethod)
            ->where('payment_status', 'paid')
            ->latest()
            ->first();

        if ($existingPaidPayment && $order->payment_status === 'paid') {
            return response()->json([
                'success' => true,
                'message' => 'Webhook Pakasir sudah pernah diproses',
                'order_id' => $order->id,
                'order_ref' => $order->order_ref,
                'payment_status' => $order->payment_status,
                'order_status' => Order::customerStatus($order->order_status),
                'idempotent' => true,
            ]);
        }

        $detail = $this->pakasirService->getTransactionDetail($order);

        if (!$detail['success'] || !$this->transactionDetailIsCompleted($detail['data'] ?? [])) {
            return response()->json([
                'success' => false,
                'message' => 'Detail transaksi Pakasir belum valid completed',
            ], 422);
        }

        $completedAt = isset($payload['completed_at']) ? Carbon::parse($payload['completed_at']) : now();
        $rawWebhook = $this->safePakasirWebhookPayload($payload);

        DB::transaction(function () use ($order, $rawWebhook, $paymentMethod, $completedAt) {
            $payment = $order->payments()
                ->where('provider', 'pakasir')
                ->where('payment_method', $paymentMethod)
                ->latest()
                ->first();

            if (!$payment) {
                $payment = new Payment([
                    'order_id' => $order->id,
                    'provider' => 'pakasir',
                    'provider_reference' => $order->order_ref,
                    'payment_method' => $paymentMethod,
                    'amount' => $order->total_price,
                ]);
            }

            $payment->fill([
                'payment_status' => 'paid',
                'raw_webhook' => $rawWebhook,
                'paid_at' => $completedAt,
                'completed_at' => $completedAt,
            ])->save();

            $currentOrderStatus = Order::normalizeStatusForStorage($order->order_status);
            $nextOrderStatus = in_array($currentOrderStatus, ['preparing', 'ready', 'completed', 'cancelled'], true)
                ? $currentOrderStatus
                : 'confirmed';

            $order->update([
                'payment_method' => $paymentMethod,
                'payment_status' => 'paid',
                'order_status' => $nextOrderStatus,
            ]);
        });

        $order->refresh();
        event(new PaymentStatusUpdated($order));
        event(new OrderStatusUpdated($order));

        return response()->json([
            'success' => true,
            'message' => 'Webhook Pakasir berhasil diproses',
            'order_id' => $order->id,
            'order_ref' => $order->order_ref,
            'payment_status' => $order->payment_status,
            'order_status' => Order::customerStatus($order->order_status),
        ]);
    }

    public function simulatePakasirPayment(string $orderRef)
    {
        $simulationAllowed = app()->environment(['local', 'testing'])
            || (!app()->environment('production') && config('services.pakasir.mode') === 'sandbox');

        if (!$simulationAllowed) {
            return response()->json([
                'success' => false,
                'message' => 'Pakasir payment simulation is only available in local or sandbox mode.',
            ], 403);
        }

        $order = Order::with('payments')->where('order_ref', $orderRef)->firstOrFail();
        $simulation = $this->pakasirService->simulatePayment($order);

        if (!$simulation['success']) {
            return response()->json([
                'success' => false,
                'message' => $simulation['message'] ?? 'Pakasir payment simulation failed.',
                'payment_status' => $order->payment_status,
                'order_status' => Order::customerStatus($order->order_status),
                'simulation' => $simulation,
            ], 422);
        }

        $detail = $this->pakasirService->getTransactionDetail($order);
        $markedPaid = false;

        if ($detail['success'] && $this->transactionDetailIsCompleted($detail['data'] ?? [])) {
            $this->markPakasirSimulationPaid($order, $simulation, $detail);
            $markedPaid = true;
        }

        $order->refresh();

        if ($markedPaid) {
            event(new PaymentStatusUpdated($order));
            event(new OrderStatusUpdated($order));
        }

        return response()->json([
            'success' => true,
            'message' => $markedPaid
                ? 'Pakasir sandbox payment simulation completed and local payment status was updated.'
                : 'Pakasir sandbox payment simulation was sent, but transaction detail is not completed yet.',
            'payment_status' => $order->payment_status,
            'order_status' => Order::customerStatus($order->order_status),
            'simulation' => $simulation,
            'detail' => $detail,
        ]);
    }

    /**
     * Handle Midtrans callback
     */
    public function callback(Request $request)
    {
        // Midtrans is retained as a legacy/future gateway. Ignore callbacks unless explicitly active.
        if (!$this->gatewayIs('midtrans')) {
            return response()->json([
                'status' => 'IGNORED',
                'message' => 'Midtrans gateway is not active.',
            ], 403);
        }

        $notification = $request->all();
        
        Log::info('Midtrans callback received', $notification);
        
        $result = $this->paymentService->handleNotification($notification);
        
        if ($result) {
            return response()->json(['status' => 'OK']);
        }
        
        return response()->json(['status' => 'ERROR'], 500);
    }

    /**
     * Display payment success page
     */
    public function success(Request $request, $orderRef)
    {
        if ($redirect = $this->redirectNumericOrderToRef($request, $orderRef, 'customer.payment.success')) {
            return $redirect;
        }

        $order = $this->findCustomerOrder($request, $orderRef, ['orderDetails.menu']);
        
        return Inertia::render('Customer/PaymentSuccess', [
            'order' => $order,
        ]);
    }

    /**
     * Display payment error page
     */
    public function error(Request $request, $orderRef)
    {
        if ($redirect = $this->redirectNumericOrderToRef($request, $orderRef, 'customer.payment.error')) {
            return $redirect;
        }

        $order = $this->findCustomerOrder($request, $orderRef);
        
        return Inertia::render('Customer/PaymentError', [
            'order' => $order,
        ]);
    }

    /**
     * Check payment status
     */
    public function checkStatus(Request $request, $orderRef)
    {
        $order = $this->findCustomerOrder($request, $orderRef, ['table', 'orderDetails.menu', 'payments']);
        
        $latestPayment = $order->payments()->latest()->first();
        
        if ($this->gatewayIs('midtrans') && $latestPayment && $latestPayment->payment_method === 'midtrans') {
            $verification = $this->paymentService->verifyPayment($latestPayment);
        }

        $items = $this->formatItems($order);
        
        return response()->json([
            'success' => true,
            'order_id' => $order->id,
            'order_ref' => $order->order_ref,
            'payment_status' => $order->payment_status,
            'payment_method' => $order->payment_method,
            'order_status' => Order::customerStatus($order->order_status),
            'total_price' => $order->total_price,
            'estimated_serve_time' => $order->estimated_serve_time,
            'created_at' => $order->created_at?->toIso8601String(),
            'updated_at' => $order->updated_at?->toIso8601String(),
            'table_number' => $order->table?->table_number,
            'items' => $items,
            'payments' => $order->payments->map(fn (Payment $payment) => $this->formatPublicPayment($payment))->values(),
            'orderId' => $order->id,
            'orderRef' => $order->order_ref,
            'paymentStatus' => $order->payment_status,
            'paymentMethod' => $order->payment_method,
            'orderStatus' => Order::customerStatus($order->order_status),
            'total' => (float) $order->total_price,
            'estimatedServeTime' => $order->estimated_serve_time,
            'createdAt' => $order->created_at?->toIso8601String(),
            'updatedAt' => $order->updated_at?->toIso8601String(),
            'tableNumber' => $order->table?->table_number,
        ]);
    }

    private function createPakasirPaymentForOrder(Order $order, string $method): array
    {
        if (!$this->gatewayIs('pakasir')) {
            return [
                'success' => false,
                'message' => 'Pakasir gateway is not active.',
            ];
        }

        if ((float) $order->total_price <= 0) {
            return [
                'success' => false,
                'message' => 'Total pesanan tidak valid',
            ];
        }

        $result = $this->pakasirService->createTransaction($order, $method);

        if (!$result['success']) {
            return $result;
        }

        $paymentData = $result['payment'] ?? [];
        $paymentMethod = $this->pakasirService->paymentMethodForPakasirMethod($method);

        $payment = DB::transaction(function () use ($order, $paymentData, $paymentMethod, $result) {
            $payment = Payment::create([
                'order_id' => $order->id,
                'provider' => 'pakasir',
                'provider_reference' => $paymentData['order_id'] ?? $order->order_ref,
                'payment_method' => $paymentMethod,
                'payment_status' => 'unpaid',
                'amount' => $paymentData['amount'] ?? $order->total_price,
                'fee' => $paymentData['fee'] ?? null,
                'total_payment' => $paymentData['total_payment'] ?? ($paymentData['amount'] ?? $order->total_price),
                'payment_number' => $paymentData['payment_number'] ?? null,
                'expired_at' => isset($paymentData['expired_at']) ? Carbon::parse($paymentData['expired_at']) : null,
                'raw_response' => $result['raw'] ?? null,
            ]);

            $order->update([
                'payment_method' => $paymentMethod,
                'payment_status' => 'unpaid',
            ]);

            return $payment;
        });

        return [
            'success' => true,
            'orderId' => $order->id,
            'orderRef' => $order->order_ref,
            'total' => (float) $order->total_price,
            'paymentMethod' => $payment->payment_method,
            'paymentStatus' => $payment->payment_status,
            'pakasirMethod' => $method,
            'paymentNumber' => $payment->payment_number,
            'totalPayment' => $payment->total_payment ? (float) $payment->total_payment : null,
            'expiredAt' => $payment->expired_at?->toIso8601String(),
            'payment_id' => $payment->id,
        ];
    }

    private function formatPublicPayment(Payment $payment): array
    {
        return [
            'id' => $payment->id,
            'provider' => $payment->provider,
            'payment_method' => $payment->payment_method,
            'payment_status' => $payment->payment_status,
            'amount' => (float) $payment->amount,
            'fee' => $payment->fee !== null ? (float) $payment->fee : null,
            'total_payment' => $payment->total_payment !== null ? (float) $payment->total_payment : null,
            'payment_number' => $payment->payment_number,
            'expired_at' => $payment->expired_at?->toIso8601String(),
            'paid_at' => $payment->paid_at?->toIso8601String(),
            'completed_at' => $payment->completed_at?->toIso8601String(),
            'created_at' => $payment->created_at?->toIso8601String(),
        ];
    }

    private function findCustomerOrder(Request $request, string $orderRef, array $with = []): Order
    {
        $order = Order::with($with)->where('order_ref', $orderRef)->firstOrFail();

        $this->orderAccess->abortUnlessCanAccess($request, $order);

        return $order;
    }

    private function resolveCustomerOrder(Request $request, string $orderRef, array $with = []): Order
    {
        $query = Order::with($with);

        $order = ctype_digit($orderRef)
            ? $query->findOrFail($orderRef)
            : $query->where('order_ref', $orderRef)->firstOrFail();

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

    private function orderMatchesTable(Order $order, string $tableId): bool
    {
        if (!$order->table_id) {
            return true;
        }

        return (string) $order->table_id === $tableId
            || (string) $order->table?->table_number === $tableId
            || 'T' . str_pad((string) $order->table_id, 2, '0', STR_PAD_LEFT) === $tableId;
    }

    private function transactionDetailIsCompleted(array $detail): bool
    {
        $candidates = [
            data_get($detail, 'status'),
            data_get($detail, 'payment.status'),
            data_get($detail, 'transaction.status'),
            data_get($detail, 'data.status'),
            data_get($detail, 'data.payment.status'),
        ];

        return in_array('completed', array_filter($candidates), true);
    }

    private function gatewayIs(string $gateway): bool
    {
        return strtolower((string) config('services.payment_gateway', 'pakasir')) === $gateway;
    }

    private function safePakasirWebhookPayload(array $payload): array
    {
        return collect($payload)
            ->only(['project', 'order_id', 'amount', 'status', 'payment_method', 'completed_at'])
            ->all();
    }

    private function markPakasirSimulationPaid(Order $order, array $simulation, array $detail): void
    {
        DB::transaction(function () use ($order, $simulation, $detail) {
            $payment = $order->payments()
                ->where('provider', 'pakasir')
                ->latest()
                ->first();

            if (!$payment) {
                $payment = new Payment([
                    'order_id' => $order->id,
                    'provider' => 'pakasir',
                    'provider_reference' => $order->order_ref,
                    'payment_method' => $order->payment_method,
                    'amount' => $order->total_price,
                    'total_payment' => $order->total_price,
                ]);
            }

            $paidAt = now();

            $payment->fill([
                'payment_status' => 'paid',
                'paid_at' => $paidAt,
                'completed_at' => $paidAt,
                'raw_webhook' => [
                    'source' => 'dev_pakasir_payment_simulation',
                    'simulation' => $simulation['data'] ?? $simulation,
                    'detail' => $detail['data'] ?? $detail,
                ],
            ])->save();

            $currentOrderStatus = Order::normalizeStatusForStorage($order->order_status);
            $nextOrderStatus = in_array($currentOrderStatus, ['preparing', 'ready', 'completed', 'cancelled'], true)
                ? $currentOrderStatus
                : 'confirmed';

            $order->update([
                'payment_method' => $payment->payment_method,
                'payment_status' => 'paid',
                'order_status' => $nextOrderStatus,
            ]);
        });
    }

    private function pakasirMethodFromPaymentMethod(?string $paymentMethod): ?string
    {
        return match ($paymentMethod) {
            'qris_pakasir' => 'qris',
            'bri_va_pakasir' => 'bri_va',
            default => null,
        };
    }

    private function formatItems(Order $order): array
    {
        return $order->orderDetails->map(function ($detail) {
            return [
                'id' => (string) $detail->id,
                'menuId' => (string) $detail->menu_id,
                'name' => $detail->menu_name ?? $detail->menu?->name,
                'quantity' => $detail->quantity,
                'note' => $detail->note,
                'subtotal' => (float) $detail->subtotal,
            ];
        })->toArray();
    }
}
