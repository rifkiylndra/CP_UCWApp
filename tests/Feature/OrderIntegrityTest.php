<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Order;
use App\Models\Review;
use App\Models\Table;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class OrderIntegrityTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_detail_snapshot_is_stored_when_order_is_created(): void
    {
        $menu = $this->createMenu('Manual Brew', 28000);
        $table = Table::factory()->create(['table_number' => '09']);

        $order = app(OrderService::class)->createOrder([
            'table_id' => $table->id,
            'order_type' => 'dine_in',
        ], [
            [
                'menu_id' => $menu->id,
                'quantity' => 2,
            ],
        ]);

        $detail = $order->orderDetails()->firstOrFail();

        $this->assertSame('Manual Brew', $detail->menu_name);
        $this->assertSame(28000.0, (float) $detail->unit_price);
        $this->assertSame(56000.0, (float) $detail->subtotal);
    }

    public function test_duplicate_review_is_rejected_by_database_constraint(): void
    {
        $order = Order::factory()->completed()->create();

        Review::create([
            'order_id' => $order->id,
            'rating' => 5,
            'comment' => 'Great.',
        ]);

        $this->expectException(QueryException::class);

        Review::create([
            'order_id' => $order->id,
            'rating' => 4,
            'comment' => 'Duplicate.',
        ]);
    }

    public function test_menu_delete_does_not_delete_historical_order_detail(): void
    {
        $menu = $this->createMenu('Flat White', 26000);
        $order = app(OrderService::class)->createOrder([
            'customer_name' => 'Guest',
            'order_type' => 'takeaway',
        ], [
            [
                'menu_id' => $menu->id,
                'quantity' => 1,
            ],
        ]);
        $detail = $order->orderDetails()->firstOrFail();

        $menu->delete();

        $this->assertDatabaseHas('order_details', [
            'id' => $detail->id,
            'order_id' => $order->id,
            'menu_id' => null,
            'menu_name' => 'Flat White',
        ]);
    }

    public function test_staff_processing_status_is_exposed_to_customer_as_preparing(): void
    {
        $order = Order::factory()->pending()->create();
        $staff = $this->createUser('staff');

        $this->actingAs($staff)
            ->putJson("/staff/order/{$order->id}/status", ['status' => 'processing'])
            ->assertOk()
            ->assertJsonPath('order.order_status', 'preparing');

        $this->withCustomerOrderAccess($order->fresh())
            ->getJson("/customer/order/{$order->order_ref}/payment/status")
            ->assertOk()
            ->assertJsonPath('orderStatus', 'preparing')
            ->assertJsonPath('order_status', 'preparing');
    }

    private function createMenu(string $name, int $price): Menu
    {
        $category = Category::create(['name' => 'Coffee']);

        return Menu::create([
            'category_id' => $category->id,
            'name' => $name,
            'description' => $name,
            'price' => $price,
            'is_available' => true,
        ]);
    }

    private function createUser(string $role): User
    {
        return User::create([
            'name' => ucfirst($role) . ' User',
            'username' => $role . '_' . uniqid(),
            'email' => $role . '_' . uniqid() . '@example.test',
            'password' => Hash::make('password'),
            'role' => $role,
            'is_active' => true,
        ]);
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
