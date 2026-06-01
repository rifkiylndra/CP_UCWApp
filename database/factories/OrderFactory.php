<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Table;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $orderTypes = ['dine_in', 'takeaway'];
        $orderStatuses = ['pending', 'processing', 'completed', 'cancelled'];
        $paymentStatuses = ['unpaid', 'paid'];
        
        return [
            'table_id' => Table::factory(),
            'customer_name' => $this->faker->name(),
            'order_type' => $this->faker->randomElement($orderTypes),
            'order_status' => $this->faker->randomElement($orderStatuses),
            'payment_status' => $this->faker->randomElement($paymentStatuses),
            'estimated_serve_time' => $this->faker->numberBetween(5, 30),
            'total_price' => $this->faker->randomFloat(2, 20000, 200000),
        ];
    }

    public function dineIn(): static
    {
        return $this->state(fn (array $attributes) => [
            'order_type' => 'dine_in',
        ]);
    }

    public function takeaway(): static
    {
        return $this->state(fn (array $attributes) => [
            'order_type' => 'takeaway',
            'table_id' => null,
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
        ]);
    }

    public function processing(): static
    {
        return $this->state(fn (array $attributes) => [
            'order_status' => 'processing',
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'order_status' => 'completed',
            'payment_status' => 'paid',
        ]);
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => 'paid',
        ]);
    }
}