<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Table;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PakasirPaymentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.payment_gateway' => 'pakasir',
            'services.pakasir.project' => 'ucw-sandbox',
            'services.pakasir.api_key' => 'test-pakasir-key',
            'services.pakasir.mode' => 'sandbox',
            'services.pakasir.base_url' => 'https://app.pakasir.com',
        ]);
    }

    public function test_create_order_calculates_total_from_database_not_frontend(): void
    {
        $menu = $this->createMenu(20000);
        $table = Table::create([
            'table_number' => 'T01',
            'qr_code' => 'qr-t01',
            'status' => 'available',
        ]);

        $order = app(OrderService::class)->createOrder([
            'table_id' => $table->id,
            'order_type' => 'dine_in',
        ], [
            [
                'menu_id' => $menu->id,
                'quantity' => 2,
                'price' => 1,
            ],
        ]);

        $this->assertSame(40000.0, (float) $order->total_price);
        $this->assertSame(40000.0, (float) $order->orderDetails()->first()->subtotal);
        $this->assertNotEmpty($order->order_ref);
    }

    public function test_customer_can_create_dine_in_order_with_table_number(): void
    {
        $menu = $this->createMenu(20000);
        $table = Table::create([
            'table_number' => '05',
            'qr_code' => 'qr-05',
            'status' => 'available',
        ]);

        $response = $this->postJson('/customer/order', [
            'table_number' => '05',
            'customer_name' => null,
            'order_type' => 'dine_in',
            'items' => [
                [
                    'menu_id' => $menu->id,
                    'quantity' => 2,
                    'note' => 'less sugar',
                    'price' => 1,
                ],
            ],
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('total', 40000);

        $orderRef = $response->json('order_ref');
        $this->assertNotEmpty($orderRef);
        $this->assertStringContainsString("/customer/order/{$orderRef}/payment", $response->json('redirect_url'));

        $this->assertDatabaseHas('orders', [
            'table_id' => $table->id,
            'order_type' => 'dine_in',
            'payment_status' => 'unpaid',
            'order_status' => 'pending',
            'total_price' => 40000,
        ]);
    }

    public function test_customer_table_number_input_is_normalized_for_padded_tables(): void
    {
        $menu = $this->createMenu(20000);
        $table = Table::create([
            'table_number' => '05',
            'qr_code' => 'qr-05',
            'status' => 'available',
        ]);

        $response = $this->postJson('/customer/order', [
            'table_number' => '5',
            'customer_name' => null,
            'order_type' => 'dine_in',
            'items' => [
                [
                    'menu_id' => $menu->id,
                    'quantity' => 1,
                    'note' => null,
                ],
            ],
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('orders', [
            'table_id' => $table->id,
            'order_type' => 'dine_in',
            'total_price' => 20000,
        ]);
    }

    public function test_customer_table_number_input_is_normalized_for_prefixed_tables(): void
    {
        $menu = $this->createMenu(20000);
        $table = Table::create([
            'table_number' => 'T05',
            'qr_code' => 'qr-t05',
            'status' => 'available',
        ]);

        $response = $this->postJson('/customer/order', [
            'table_number' => '5',
            'customer_name' => null,
            'order_type' => 'dine_in',
            'items' => [
                [
                    'menu_id' => $menu->id,
                    'quantity' => 1,
                    'note' => null,
                ],
            ],
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('orders', [
            'table_id' => $table->id,
            'order_type' => 'dine_in',
            'total_price' => 20000,
        ]);
    }

    public function test_customer_dine_in_order_without_table_number_is_rejected(): void
    {
        $menu = $this->createMenu(20000);

        $this->postJson('/customer/order', [
            'order_type' => 'dine_in',
            'items' => [
                [
                    'menu_id' => $menu->id,
                    'quantity' => 1,
                    'note' => null,
                ],
            ],
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['table_number']);
    }

    public function test_customer_takeaway_order_without_customer_name_is_rejected(): void
    {
        $menu = $this->createMenu(20000);

        $this->postJson('/customer/order', [
            'table_number' => null,
            'order_type' => 'takeaway',
            'items' => [
                [
                    'menu_id' => $menu->id,
                    'quantity' => 1,
                    'note' => null,
                ],
            ],
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['customer_name']);
    }

    public function test_customer_create_order_ignores_frontend_price(): void
    {
        $menu = $this->createMenu(25000);

        $response = $this->postJson('/customer/order', [
            'table_number' => null,
            'customer_name' => 'Reynard',
            'order_type' => 'takeaway',
            'items' => [
                [
                    'menu_id' => $menu->id,
                    'quantity' => 2,
                    'note' => null,
                    'price' => 1,
                ],
            ],
        ]);

        $response->assertOk()
            ->assertJsonPath('total', 50000);
    }

    public function test_create_qris_pakasir_transaction(): void
    {
        $order = $this->createOrderWithTable(22000);

        Http::fake([
            'https://app.pakasir.com/api/transactioncreate/qris' => Http::response([
                'payment' => $this->pakasirPaymentPayload($order, 'qris', 'QR-STRING'),
            ]),
        ]);

        $response = $this->postJson("/customer/order/{$order->order_ref}/payments/pakasir", [
            'method' => 'qris',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('paymentMethod', 'qris_pakasir')
            ->assertJsonPath('paymentNumber', 'QR-STRING');

        $this->assertDatabaseHas('payments', [
            'order_id' => $order->id,
            'provider' => 'pakasir',
            'payment_method' => 'qris_pakasir',
            'payment_status' => 'unpaid',
            'payment_number' => 'QR-STRING',
        ]);

        Http::assertSent(fn ($request) => $request['api_key'] === 'test-pakasir-key'
            && $request['amount'] === 22000
            && $request['order_id'] === $order->order_ref);
    }

    public function test_create_bri_va_pakasir_transaction(): void
    {
        $order = $this->createOrderWithTable(33000);

        Http::fake([
            'https://app.pakasir.com/api/transactioncreate/bri_va' => Http::response([
                'payment' => $this->pakasirPaymentPayload($order, 'bri_va', '88880123456789'),
            ]),
        ]);

        $response = $this->postJson("/customer/order/{$order->order_ref}/payments/pakasir", [
            'method' => 'bri_va',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('paymentMethod', 'bri_va_pakasir')
            ->assertJsonPath('paymentNumber', '88880123456789');

        $this->assertDatabaseHas('payments', [
            'order_id' => $order->id,
            'provider' => 'pakasir',
            'payment_method' => 'bri_va_pakasir',
            'payment_status' => 'unpaid',
        ]);
    }

    public function test_webhook_valid_qris_completed_marks_payment_paid(): void
    {
        $order = $this->createOrderWithPayment('qris_pakasir', 22000);

        Http::fake([
            'https://app.pakasir.com/api/transactiondetail*' => Http::response(['status' => 'completed']),
        ]);

        $response = $this->postJson('/api/webhooks/pakasir', [
            'amount' => 22000,
            'order_id' => $order->order_ref,
            'project' => 'ucw-sandbox',
            'status' => 'completed',
            'payment_method' => 'qris',
            'completed_at' => '2026-06-06T08:07:02.819+07:00',
        ]);

        $response->assertOk()->assertJsonPath('payment_status', 'paid');
        $this->assertDatabaseHas('payments', [
            'order_id' => $order->id,
            'payment_method' => 'qris_pakasir',
            'payment_status' => 'paid',
        ]);
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'payment_status' => 'paid',
            'order_status' => 'confirmed',
        ]);
    }

    public function test_duplicate_webhook_is_idempotent_and_does_not_reprocess_payment(): void
    {
        $order = $this->createOrderWithPayment('qris_pakasir', 22000);
        $payload = [
            'amount' => 22000,
            'order_id' => $order->order_ref,
            'project' => 'ucw-sandbox',
            'status' => 'completed',
            'payment_method' => 'qris',
            'completed_at' => '2026-06-06T08:07:02.819+07:00',
        ];

        Http::fake([
            'https://app.pakasir.com/api/transactiondetail*' => Http::response(['status' => 'completed']),
        ]);

        $this->postJson('/api/webhooks/pakasir', $payload)
            ->assertOk()
            ->assertJsonPath('payment_status', 'paid');

        $this->postJson('/api/webhooks/pakasir', $payload)
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('idempotent', true);

        $this->assertSame(1, Payment::where('order_id', $order->id)->count());
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'payment_status' => 'paid',
            'order_status' => 'confirmed',
        ]);
        Http::assertSentCount(1);
    }

    public function test_webhook_valid_bri_va_completed_marks_payment_paid(): void
    {
        $order = $this->createOrderWithPayment('bri_va_pakasir', 44000);

        Http::fake([
            'https://app.pakasir.com/api/transactiondetail*' => Http::response(['status' => 'completed']),
        ]);

        $response = $this->postJson('/api/webhooks/pakasir', [
            'amount' => 44000,
            'order_id' => $order->order_ref,
            'project' => 'ucw-sandbox',
            'status' => 'completed',
            'payment_method' => 'bri_va',
            'completed_at' => '2026-06-06T08:07:02.819+07:00',
        ]);

        $response->assertOk()->assertJsonPath('payment_status', 'paid');
        $this->assertDatabaseHas('payments', [
            'order_id' => $order->id,
            'payment_method' => 'bri_va_pakasir',
            'payment_status' => 'paid',
        ]);
    }

    public function test_webhook_invalid_amount_is_rejected(): void
    {
        $order = $this->createOrderWithPayment('qris_pakasir', 22000);

        $response = $this->postJson('/api/webhooks/pakasir', [
            'amount' => 21000,
            'order_id' => $order->order_ref,
            'project' => 'ucw-sandbox',
            'status' => 'completed',
            'payment_method' => 'qris',
        ]);

        $response->assertStatus(422);
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'payment_status' => 'unpaid',
        ]);
        $this->assertDatabaseHas('payments', [
            'order_id' => $order->id,
            'payment_status' => 'unpaid',
        ]);
    }

    public function test_webhook_invalid_project_is_rejected(): void
    {
        $order = $this->createOrderWithPayment('qris_pakasir', 22000);

        $response = $this->postJson('/api/webhooks/pakasir', [
            'amount' => 22000,
            'order_id' => $order->order_ref,
            'project' => 'wrong-project',
            'status' => 'completed',
            'payment_method' => 'qris',
        ]);

        $response->assertStatus(422);
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'payment_status' => 'unpaid',
        ]);
    }

    public function test_webhook_invalid_order_id_is_rejected(): void
    {
        $response = $this->postJson('/api/webhooks/pakasir', [
            'amount' => 22000,
            'order_id' => 'UNKNOWN',
            'project' => 'ucw-sandbox',
            'status' => 'completed',
            'payment_method' => 'qris',
        ]);

        $response->assertStatus(404);
    }

    public function test_cash_payment_waits_for_staff_verification(): void
    {
        $order = $this->createOrderWithTable(22000);

        $response = $this->postJson("/customer/order/{$order->order_ref}/payment/process", [
            'payment_method' => 'cash',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('payment_status', 'waiting_verification');

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'payment_method' => 'cash',
            'payment_status' => 'waiting_verification',
        ]);
    }

    public function test_customer_payment_status_endpoint_returns_complete_customer_contract(): void
    {
        $order = $this->createOrderWithPayment('qris_pakasir', 22000);

        $this->getJson("/customer/order/{$order->order_ref}/payment/status")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('orderRef', $order->order_ref)
            ->assertJsonPath('paymentStatus', 'unpaid')
            ->assertJsonPath('orderStatus', 'pending')
            ->assertJsonStructure([
                'orderRef',
                'paymentStatus',
                'orderStatus',
                'estimatedServeTime',
                'createdAt',
                'items',
                'tableNumber',
                'order_ref',
                'payment_status',
                'order_status',
                'estimated_serve_time',
                'created_at',
                'table_number',
            ]);
    }

    public function test_create_pakasir_payment_returns_clear_message_when_credentials_missing(): void
    {
        config([
            'services.pakasir.project' => null,
            'services.pakasir.api_key' => null,
        ]);

        $order = $this->createOrderWithTable(22000);

        $response = $this->postJson("/customer/order/{$order->order_ref}/payments/pakasir", [
            'method' => 'qris',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Pakasir credential is not configured.');
    }

    public function test_create_pakasir_payment_returns_clear_message_when_pakasir_rejects_credentials(): void
    {
        $order = $this->createOrderWithTable(22000);

        Http::fake([
            'https://app.pakasir.com/api/transactioncreate/qris' => Http::response([
                'message' => 'invalid api key or project',
            ], 401),
        ]);

        $response = $this->postJson("/customer/order/{$order->order_ref}/payments/pakasir", [
            'method' => 'qris',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Pakasir rejected the transaction. Check project slug and API key.');
    }

    public function test_customer_numeric_payment_url_redirects_to_order_ref(): void
    {
        $order = $this->createOrderWithTable(22000);

        $this->get("/customer/order/{$order->id}/payment")
            ->assertRedirect(route('customer.payment', ['order' => $order->order_ref]));
    }

    public function test_simulation_route_is_available_in_sandbox(): void
    {
        $order = $this->createOrderWithPayment('qris_pakasir', 22000);

        Http::fake([
            'https://app.pakasir.com/api/paymentsimulation' => Http::response(['status' => 'ok']),
            'https://app.pakasir.com/api/transactiondetail*' => Http::response(['status' => 'completed']),
        ]);

        $this->postJson("/api/dev/pakasir/payments/{$order->order_ref}/simulate")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('simulation.success', true)
            ->assertJsonPath('payment_status', 'paid')
            ->assertJsonPath('order_status', 'confirmed');

        $this->assertDatabaseHas('payments', [
            'order_id' => $order->id,
            'payment_method' => 'qris_pakasir',
            'payment_status' => 'paid',
        ]);
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'payment_status' => 'paid',
            'order_status' => 'confirmed',
        ]);
    }

    public function test_simulation_route_is_blocked_in_production(): void
    {
        $this->app->detectEnvironment(fn () => 'production');
        config(['services.pakasir.mode' => 'sandbox']);
        $order = $this->createOrderWithTable(22000);

        $this->postJson("/api/dev/pakasir/payments/{$order->order_ref}/simulate")
            ->assertForbidden();
    }

    private function createMenu(int $price): Menu
    {
        $category = Category::create([
            'name' => 'Coffee',
            'description' => 'Coffee drinks',
        ]);

        return Menu::create([
            'category_id' => $category->id,
            'name' => 'Latte',
            'description' => 'Coffee with milk',
            'price' => $price,
            'is_available' => true,
        ]);
    }

    private function createOrderWithTable(int $amount): Order
    {
        $table = Table::create([
            'table_number' => 'T' . str_pad((string) (Table::count() + 1), 2, '0', STR_PAD_LEFT),
            'qr_code' => 'qr-' . uniqid(),
            'status' => 'available',
        ]);

        return Order::create([
            'table_id' => $table->id,
            'order_type' => 'dine_in',
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'total_price' => $amount,
        ]);
    }

    private function createOrderWithPayment(string $paymentMethod, int $amount): Order
    {
        $order = $this->createOrderWithTable($amount);

        Payment::create([
            'order_id' => $order->id,
            'provider' => 'pakasir',
            'provider_reference' => $order->order_ref,
            'payment_method' => $paymentMethod,
            'payment_status' => 'unpaid',
            'amount' => $amount,
            'total_payment' => $amount,
            'payment_number' => 'PAYMENT-NUMBER',
        ]);

        $order->update([
            'payment_method' => $paymentMethod,
        ]);

        return $order;
    }

    private function pakasirPaymentPayload(Order $order, string $method, string $paymentNumber): array
    {
        return [
            'project' => 'ucw-sandbox',
            'order_id' => $order->order_ref,
            'amount' => (int) $order->total_price,
            'fee' => 1003,
            'total_payment' => (int) $order->total_price + 1003,
            'payment_method' => $method,
            'payment_number' => $paymentNumber,
            'expired_at' => '2026-06-06T01:18:49.678622Z',
        ];
    }
}
