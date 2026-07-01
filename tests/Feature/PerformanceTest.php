<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Payment;
use App\Models\Table;
use App\Models\User;
use App\Services\AiService;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PerformanceTest extends TestCase
{
    use RefreshDatabase;

    private Category $category;
    private Menu $menu;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.ai.base_url' => 'http://ai-service.test',
            'services.payment_gateway' => 'pakasir',
            'services.pakasir.project' => 'ucw-sandbox',
            'services.pakasir.api_key' => 'test-pakasir-key',
            'services.pakasir.mode' => 'sandbox',
            'services.pakasir.base_url' => 'https://app.pakasir.com',
        ]);

        // Stub AI service to avoid real HTTP calls during order creation
        Http::fake([
            'ai-service.test/*' => Http::response([
                'estimasi_menit' => 5,
                'range_min' => 3,
                'range_max' => 8,
                'display' => '5 menit',
            ]),
        ]);

        $this->category = Category::create([
            'name' => 'Coffee',
            'description' => 'Coffee drinks',
        ]);

        $this->menu = Menu::create([
            'category_id' => $this->category->id,
            'name' => 'Latte',
            'description' => 'Coffee with milk',
            'price' => 25000,
            'is_available' => true,
        ]);
    }

    // =====================================================================
    // Test 1: Response Time – Create Order Endpoint
    // =====================================================================
    public function test_create_order_response_time_is_within_threshold(): void
    {
        $table = Table::create([
            'table_number' => 'T01',
            'qr_code' => 'qr-t01',
            'status' => 'available',
        ]);

        $payload = [
            'table_number' => 'T01',
            'customer_name' => null,
            'order_type' => 'dine_in',
            'items' => [
                [
                    'menu_id' => $this->menu->id,
                    'quantity' => 2,
                    'note' => 'less sugar',
                ],
            ],
        ];

        // Warm-up: first request in a PHPUnit run incurs Laravel bootstrap,
        // route compilation, and middleware resolution overhead (~15 s).
        // The warm-up isolates actual endpoint performance.
        $this->postJson('/customer/order', $payload)->assertOk();

        // Create a fresh table for the measured request
        $table2 = Table::create([
            'table_number' => 'T02',
            'qr_code' => 'qr-t02',
            'status' => 'available',
        ]);
        $payload['table_number'] = 'T02';

        $start = microtime(true);
        $response = $this->postJson('/customer/order', $payload);
        $elapsed = (microtime(true) - $start) * 1000; // ms

        $response->assertOk()->assertJsonPath('success', true);

        // Threshold: 500 ms – This endpoint performs DB transaction, AI call
        // (mocked), event dispatch, and order_ref generation.
        $this->assertLessThan(500, $elapsed, "Create-order took {$elapsed} ms (threshold 500 ms)");

        // Expose the actual timing for reporting
        fwrite(STDERR, "\n[PERF] create_order: " . round($elapsed, 2) . " ms\n");
    }

    // =====================================================================
    // Test 2: Response Time – Payment Status Check
    // =====================================================================
    public function test_payment_status_check_response_time_is_within_threshold(): void
    {
        $order = $this->createOrderWithPayment();

        $start = microtime(true);
        $response = $this->withCustomerOrderAccess($order)
            ->getJson("/customer/order/{$order->order_ref}/payment/status");
        $elapsed = (microtime(true) - $start) * 1000;

        $response->assertOk()->assertJsonPath('success', true);

        // Threshold: 500 ms – This endpoint loads order + table + orderDetails.menu + payments
        // with eager loading. SQLite in-memory + first-run overhead can reach ~250 ms.
        $this->assertLessThan(500, $elapsed, "Payment-status took {$elapsed} ms (threshold 500 ms)");

        fwrite(STDERR, "\n[PERF] payment_status: " . round($elapsed, 2) . " ms\n");
    }

    // =====================================================================
    // Test 3: AI Fallback Response Time (ConnectionException)
    // =====================================================================
    public function test_ai_fallback_response_time_does_not_wait_for_timeout(): void
    {
        // Override the global fake – force ConnectionException immediately
        Http::fake(function () {
            throw new ConnectionException('AI service unavailable');
        });

        $start = microtime(true);
        $result = app(AiService::class)->getServingTimeEstimation([
            'items' => [],
            'current_queue' => 0,
        ]);
        $elapsed = (microtime(true) - $start) * 1000;

        $this->assertFalse($result['success']);
        $this->assertArrayHasKey('estimated_time', $result);

        // Threshold: 300 ms – Fallback should return quickly. The overhead
        // comes from Http::fake reconfiguration and Log::error call.
        $this->assertLessThan(300, $elapsed, "AI fallback took {$elapsed} ms (threshold 300 ms)");

        fwrite(STDERR, "\n[PERF] ai_fallback: " . round($elapsed, 2) . " ms\n");
    }

    // =====================================================================
    // Test 4: N+1 Query Detection on Live Order (Admin Dashboard)
    // =====================================================================
    public function test_live_order_endpoint_does_not_exhibit_n_plus_one_queries(): void
    {
        // Create 20 orders, each with 2 order details + table + payment
        $this->seedOrdersWithDetails(20, 2);

        $admin = User::create([
            'name' => 'Admin User',
            'username' => 'admin_perf_' . uniqid(),
            'email' => 'admin_perf_' . uniqid() . '@example.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        DB::enableQueryLog();

        $response = $this->actingAs($admin)->get('/admin/live-order');

        $queryLog = DB::getQueryLog();
        $queryCount = count($queryLog);

        DB::disableQueryLog();

        $response->assertOk();

        // With eager loading (Order::with(['table', 'orderDetails.menu'])),
        // we expect a bounded number of queries regardless of order count:
        //   1) orders (incoming) + 2) tables + 3) order_details + 4) menus
        //   repeated for processing & completed  ≈  ~12 base queries
        //   + session / auth / misc  ≈  ~20 max
        // An N+1 bug with 20 orders × 2 details would be 40+ queries.
        $this->assertLessThan(30, $queryCount, "Live-order executed {$queryCount} queries (threshold 30)");

        fwrite(STDERR, "\n[PERF] live_order_queries: {$queryCount}\n");
    }

    // =====================================================================
    // Test 5: Sequential Load – 10 Rapid Create-Order Requests
    // =====================================================================
    public function test_sequential_create_order_load_maintains_performance_and_data_integrity(): void
    {
        $totalRequests = 10;
        $timings = [];

        // Create enough unique tables so each dine-in order uses a different table
        $tables = [];
        for ($i = 1; $i <= $totalRequests; $i++) {
            $tables[] = Table::create([
                'table_number' => 'P' . str_pad((string) $i, 2, '0', STR_PAD_LEFT),
                'qr_code' => 'qr-perf-' . $i,
                'status' => 'available',
            ]);
        }

        $ordersBefore = Order::count();

        for ($i = 0; $i < $totalRequests; $i++) {
            $payload = [
                'table_number' => $tables[$i]->table_number,
                'customer_name' => null,
                'order_type' => 'dine_in',
                'items' => [
                    [
                        'menu_id' => $this->menu->id,
                        'quantity' => rand(1, 3),
                        'note' => "perf test #{$i}",
                    ],
                ],
            ];

            $start = microtime(true);
            $response = $this->postJson('/customer/order', $payload);
            $elapsed = (microtime(true) - $start) * 1000;

            $response->assertOk()->assertJsonPath('success', true);
            $timings[] = $elapsed;
        }

        $ordersAfter = Order::count();
        $avgTime = array_sum($timings) / count($timings);
        $maxTime = max($timings);

        // Data integrity: exactly 10 new orders
        $this->assertSame($totalRequests, $ordersAfter - $ordersBefore, 'Expected exactly 10 new orders');

        // Average response time: < 500 ms
        $this->assertLessThan(500, $avgTime, "Avg create-order time {$avgTime} ms (threshold 500 ms)");

        // No extreme degradation: max single request < 1000 ms
        $this->assertLessThan(1000, $maxTime, "Max single request {$maxTime} ms (threshold 1000 ms)");

        fwrite(STDERR, sprintf(
            "\n[PERF] sequential_load: avg=%.2f ms, max=%.2f ms, orders=%d\n",
            $avgTime,
            $maxTime,
            $ordersAfter - $ordersBefore
        ));
    }

    // =====================================================================
    // Helpers
    // =====================================================================

    private function createOrderWithPayment(): Order
    {
        $table = Table::create([
            'table_number' => 'T' . str_pad((string) (Table::count() + 1), 2, '0', STR_PAD_LEFT),
            'qr_code' => 'qr-' . uniqid(),
            'status' => 'available',
        ]);

        $order = Order::create([
            'order_ref' => Order::generateOrderRef(),
            'table_id' => $table->id,
            'order_type' => 'dine_in',
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'total_price' => 50000,
        ]);

        OrderDetail::create([
            'order_id' => $order->id,
            'menu_id' => $this->menu->id,
            'menu_name' => $this->menu->name,
            'unit_price' => $this->menu->price,
            'quantity' => 2,
            'subtotal' => $this->menu->price * 2,
        ]);

        Payment::create([
            'order_id' => $order->id,
            'provider' => 'pakasir',
            'provider_reference' => $order->order_ref,
            'payment_method' => 'qris_pakasir',
            'payment_status' => 'unpaid',
            'amount' => 50000,
            'total_payment' => 50000,
            'payment_number' => 'QR-PERF-TEST',
        ]);

        return $order;
    }

    private function seedOrdersWithDetails(int $orderCount, int $detailsPerOrder): void
    {
        $menu2 = Menu::create([
            'category_id' => $this->category->id,
            'name' => 'Cappuccino',
            'description' => 'Foamy coffee',
            'price' => 28000,
            'is_available' => true,
        ]);

        $menus = [$this->menu, $menu2];

        for ($i = 0; $i < $orderCount; $i++) {
            $table = Table::create([
                'table_number' => 'N' . str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT),
                'qr_code' => 'qr-n' . ($i + 1) . '-' . uniqid(),
                'status' => 'available',
            ]);

            $statuses = ['pending', 'confirmed', 'processing', 'completed'];
            $status = $statuses[$i % count($statuses)];

            $order = Order::create([
                'order_ref' => Order::generateOrderRef(),
                'table_id' => $table->id,
                'order_type' => 'dine_in',
                'order_status' => $status,
                'payment_status' => in_array($status, ['completed']) ? 'paid' : 'unpaid',
                'total_price' => 0,
            ]);

            $total = 0;
            for ($j = 0; $j < $detailsPerOrder; $j++) {
                $m = $menus[$j % count($menus)];
                $qty = rand(1, 3);
                $subtotal = $m->price * $qty;
                $total += $subtotal;

                OrderDetail::create([
                    'order_id' => $order->id,
                    'menu_id' => $m->id,
                    'menu_name' => $m->name,
                    'unit_price' => $m->price,
                    'quantity' => $qty,
                    'subtotal' => $subtotal,
                ]);
            }

            $order->update(['total_price' => $total]);
        }
    }

    private function withCustomerOrderAccess(Order $order): self
    {
        return $this->withSession([
            'customer_order_access' => [
                $order->order_ref => [
                    'id' => $order->id,
                    'token' => 'test-order-access-token',
                ],
            ],
        ]);
    }
}
