<?php

namespace Tests\Unit;

use App\Models\Order;
use App\Models\Table;
use App\Models\Menu;
use App\Models\Category;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $orderService;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->orderService = new OrderService();
        
        // Create test data
        $category = Category::create(['name' => 'Coffee', 'description' => 'Coffee drinks']);
        
        Menu::create([
            'category_id' => $category->id,
            'name' => 'Espresso',
            'description' => 'Strong coffee',
            'price' => 20000,
            'is_available' => true,
        ]);
        
        Menu::create([
            'category_id' => $category->id,
            'name' => 'Latte',
            'description' => 'Coffee with milk',
            'price' => 25000,
            'is_available' => true,
        ]);
    }

    /** @test */
    public function it_can_create_order()
    {
        $table = Table::create([
            'table_number' => 'T01',
            'qr_code' => 'qr-t01',
            'status' => 'available',
        ]);
        
        $orderData = [
            'table_id' => $table->id,
            'customer_name' => 'John Doe',
            'order_type' => 'dine_in',
        ];
        
        $orderItems = [
            [
                'menu_id' => 1,
                'quantity' => 2,
                'price' => 20000,
            ],
            [
                'menu_id' => 2,
                'quantity' => 1,
                'price' => 25000,
            ],
        ];
        
        $order = $this->orderService->createOrder($orderData, $orderItems);
        
        $this->assertInstanceOf(Order::class, $order);
        $this->assertEquals('pending', $order->order_status);
        $this->assertEquals('unpaid', $order->payment_status);
        $this->assertEquals(65000, $order->total_price); // (2 * 20000) + (1 * 25000)
        
        // Check table status updated
        $table->refresh();
        $this->assertEquals('occupied', $table->status);
        
        // Check order details created
        $this->assertCount(2, $order->orderDetails);
        $this->assertEquals('Espresso', $order->orderDetails[0]->menu_name);
        $this->assertEquals(20000, (float) $order->orderDetails[0]->unit_price);
    }

    /** @test */
    public function it_can_create_dine_in_order_from_table_number()
    {
        $table = Table::create([
            'table_number' => '07',
            'qr_code' => 'qr-t07',
            'status' => 'available',
        ]);

        $order = $this->orderService->createOrder([
            'table_number' => '07',
            'customer_name' => null,
            'order_type' => 'dine_in',
        ], [
            [
                'menu_id' => 1,
                'quantity' => 1,
                'price' => 1,
            ],
        ]);

        $this->assertEquals($table->id, $order->table_id);
        $this->assertEquals(20000, $order->total_price);
    }

    /** @test */
    public function it_can_update_order_status()
    {
        $order = Order::factory()->create(['order_status' => 'pending']);
        
        $updatedOrder = $this->orderService->updateOrderStatus($order->id, 'processing');
        
        $this->assertEquals('preparing', $updatedOrder->order_status);
    }

    /** @test */
    public function it_frees_table_when_dine_in_order_completed()
    {
        $table = Table::create([
            'table_number' => 'T02',
            'qr_code' => 'qr-t02',
            'status' => 'occupied',
        ]);
        
        $order = Order::factory()->dineIn()->create([
            'table_id' => $table->id,
            'order_status' => 'processing',
        ]);
        
        $this->orderService->updateOrderStatus($order->id, 'completed');
        
        $table->refresh();
        $this->assertEquals('available', $table->status);
    }

    /** @test */
    public function it_can_get_orders_by_status()
    {
        Order::factory()->count(3)->pending()->create();
        Order::factory()->count(2)->processing()->create();
        Order::factory()->count(1)->completed()->create();
        
        $pendingOrders = $this->orderService->getOrdersByStatus('pending');
        $processingOrders = $this->orderService->getOrdersByStatus('processing');
        $completedOrders = $this->orderService->getOrdersByStatus('completed');
        
        $this->assertCount(3, $pendingOrders);
        $this->assertCount(2, $processingOrders);
        $this->assertCount(1, $completedOrders);
    }

    /** @test */
    public function it_can_get_order_statistics()
    {
        // Create test orders
        Order::factory()->count(5)->pending()->create();
        Order::factory()->count(3)->processing()->create();
        Order::factory()->count(2)->completed()->create(['total_price' => 50000]);
        
        $statistics = $this->orderService->getOrderStatistics();
        
        $this->assertArrayHasKey('total_orders_today', $statistics);
        $this->assertArrayHasKey('pending_orders', $statistics);
        $this->assertArrayHasKey('processing_orders', $statistics);
        $this->assertArrayHasKey('completed_orders_today', $statistics);
        $this->assertArrayHasKey('revenue_today', $statistics);
        
        $this->assertEquals(10, $statistics['total_orders_today']);
        $this->assertEquals(5, $statistics['pending_orders']);
        $this->assertEquals(3, $statistics['processing_orders']);
        $this->assertEquals(2, $statistics['completed_orders_today']);
        $this->assertEquals(100000, $statistics['revenue_today']); // 2 * 50000
    }

    /** @test */
    public function it_calculates_estimated_serve_time_correctly()
    {
        $orderItems = [
            ['quantity' => 2],
            ['quantity' => 1],
        ];
        
        // Base time (5) + (3 items * 3 minutes) = 14 minutes
        $estimatedTime = $this->invokePrivateMethod($this->orderService, 'calculateEstimatedServeTime', [$orderItems]);
        
        $this->assertEquals(14, $estimatedTime);
    }

    /** @test */
    public function it_caps_estimated_serve_time_at_60_minutes()
    {
        $orderItems = array_fill(0, 20, ['quantity' => 5]); // 100 items
        
        // Base time (5) + (100 items * 3 minutes) = 305, but capped at 60
        $estimatedTime = $this->invokePrivateMethod($this->orderService, 'calculateEstimatedServeTime', [$orderItems]);
        
        $this->assertEquals(60, $estimatedTime);
    }

    /**
     * Helper method to invoke private methods
     */
    private function invokePrivateMethod($object, $methodName, array $parameters = [])
    {
        $reflection = new \ReflectionClass(get_class($object));
        $method = $reflection->getMethod($methodName);
        $method->setAccessible(true);
        
        return $method->invokeArgs($object, $parameters);
    }
}
