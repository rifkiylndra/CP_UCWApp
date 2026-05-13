<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Kopi', 'description' => 'Berbagai jenis kopi premium'],
            ['name' => 'Teh', 'description' => 'Teh segar dan herbal'],
            ['name' => 'Makanan Ringan', 'description' => 'Snack dan pastry'],
            ['name' => 'Minuman Dingin', 'description' => 'Minuman segar dan es'],
            ['name' => 'Dessert', 'description' => 'Kue dan dessert lezat'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
