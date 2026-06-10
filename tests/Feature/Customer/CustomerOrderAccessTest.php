<?php

namespace Tests\Feature\Customer;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Order;
use App\Models\Table;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CustomerOrderAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'broadcasting.default' => 'null',
            'broadcasting.connections.reverb.key' => 'test-reverb-key',
            'broadcasting.connections.reverb.secret' => 'test-reverb-secret',
        ]);
    }

    public function test_customer_cannot_access_order_without_session_access(): void
    {
        $order = Order::factory()->pending()->create();

        $this->get("/customer/order/{$order->order_ref}/status")->assertForbidden();
        $this->getJson("/customer/order/{$order->order_ref}/payment/status")->assertForbidden();
        $this->postJson("/customer/order/{$order->order_ref}/cancel")->assertForbidden();
        $this->get("/customer/order/{$order->order_ref}/review")->assertForbidden();
        $this->postJson("/customer/order/{$order->order_ref}/complete-transaction", [
            'rating' => 5,
            'comment' => 'Great coffee and service.',
        ])->assertForbidden();
    }

    public function test_customer_can_access_order_created_in_current_session(): void
    {
        $menu = $this->createMenu(20000);
        $table = Table::create([
            'table_number' => '07',
            'qr_code' => 'qr-07',
            'status' => 'available',
        ]);

        $response = $this->postJson('/customer/order', [
            'table_number' => '07',
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

        $response->assertOk()->assertJsonPath('success', true);

        $orderRef = $response->json('order_ref');
        $this->assertDatabaseHas('orders', [
            'table_id' => $table->id,
            'order_ref' => $orderRef,
        ]);

        $this->get("/customer/order/{$orderRef}/status")->assertOk();
        $this->getJson("/customer/order/{$orderRef}/payment/status")->assertOk();
    }

    public function test_customer_can_access_review_for_owned_completed_order(): void
    {
        $order = Order::factory()->completed()->create();

        $this->withCustomerOrderAccess($order)
            ->get("/customer/order/{$order->order_ref}/review")
            ->assertOk();
    }

    public function test_staff_and_admin_can_access_customer_order_status(): void
    {
        $order = Order::factory()->pending()->create();
        $staff = $this->createUser('staff');
        $admin = $this->createUser('admin');

        $this->actingAs($staff)
            ->get("/customer/order/{$order->order_ref}/status")
            ->assertOk();

        $this->actingAs($admin)
            ->get("/customer/order/{$order->order_ref}/status")
            ->assertOk();
    }

    public function test_private_order_channel_rejects_customer_without_session_access(): void
    {
        $order = Order::factory()->pending()->create();

        $this->postJson('/realtime/auth', [
            'channel_name' => "private-order.{$order->id}",
            'socket_id' => '123.456',
        ])->assertForbidden();
    }

    public function test_private_order_channel_allows_customer_with_session_access(): void
    {
        $order = Order::factory()->pending()->create();
        $channelName = "private-order.{$order->id}";
        $socketId = '123.456';

        $response = $this->withCustomerOrderAccess($order)->postJson('/realtime/auth', [
            'channel_name' => $channelName,
            'socket_id' => $socketId,
        ]);

        $response->assertOk()
            ->assertJsonPath(
                'auth',
                'test-reverb-key:' . hash_hmac('sha256', $socketId . ':' . $channelName, 'test-reverb-secret')
            );
    }

    public function test_private_staff_channels_reject_unauthorized_customer_and_allow_staff(): void
    {
        config(['broadcasting.default' => 'reverb']);

        $this->postJson('/realtime/auth', [
            'channel_name' => 'private-staff-orders',
            'socket_id' => '123.456',
        ])->assertForbidden();

        $this->postJson('/realtime/auth', [
            'channel_name' => 'private-staff-payments',
            'socket_id' => '123.456',
        ])->assertForbidden();

        $staff = $this->createUser('staff');

        $this->actingAs($staff)->postJson('/realtime/auth', [
            'channel_name' => 'private-staff-orders',
            'socket_id' => '123.456',
        ])->assertOk()->assertJsonStructure(['auth']);

        $this->actingAs($staff)->postJson('/realtime/auth', [
            'channel_name' => 'private-staff-payments',
            'socket_id' => '123.456',
        ])->assertOk()->assertJsonStructure(['auth']);
    }

    private function createMenu(int $price): Menu
    {
        $category = Category::create(['name' => 'Coffee']);

        return Menu::create([
            'category_id' => $category->id,
            'name' => 'Americano',
            'description' => 'Black coffee',
            'price' => $price,
            'is_available' => true,
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
}
