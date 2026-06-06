<?php

namespace Database\Factories;

use App\Models\Table;
use Illuminate\Database\Eloquent\Factories\Factory;

class TableFactory extends Factory
{
    protected $model = Table::class;

    public function definition(): array
    {
        $tableNumber = 'T' . $this->faker->unique()->numberBetween(1, 99);

        return [
            'table_number' => $tableNumber,
            'qr_code' => 'qr-' . strtolower($tableNumber) . '-' . $this->faker->unique()->bothify('????##'),
            'status' => 'available',
        ];
    }
}
