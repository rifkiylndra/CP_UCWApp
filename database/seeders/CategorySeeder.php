<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::create(['name' => 'Coffee', 'description' => 'Minuman kopi']);
        Category::create(['name' => 'Non-Coffee', 'description' => 'Minuman non-kopi']);
        Category::create(['name' => 'Food', 'description' => 'Makanan berat']);
        Category::create(['name' => 'Snack', 'description' => 'Camilan']);
    }
}