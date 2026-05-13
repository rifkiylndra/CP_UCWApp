<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $menus = [
            // Kopi (category_id = 1)
            ['category_id' => 1, 'name' => 'Espresso', 'description' => 'Kopi espresso murni', 'price' => 25000, 'is_available' => true],
            ['category_id' => 1, 'name' => 'Americano', 'description' => 'Espresso dengan air panas', 'price' => 30000, 'is_available' => true],
            ['category_id' => 1, 'name' => 'Cappuccino', 'description' => 'Espresso dengan susu dan busa', 'price' => 35000, 'is_available' => true],
            ['category_id' => 1, 'name' => 'Latte', 'description' => 'Espresso dengan susu steamed', 'price' => 35000, 'is_available' => true],
            ['category_id' => 1, 'name' => 'Macchiato', 'description' => 'Espresso dengan sedikit susu', 'price' => 32000, 'is_available' => true],

            // Teh (category_id = 2)
            ['category_id' => 2, 'name' => 'Teh Hitam', 'description' => 'Teh hitam premium', 'price' => 20000, 'is_available' => true],
            ['category_id' => 2, 'name' => 'Teh Hijau', 'description' => 'Teh hijau segar', 'price' => 20000, 'is_available' => true],
            ['category_id' => 2, 'name' => 'Teh Chamomile', 'description' => 'Teh herbal menenangkan', 'price' => 25000, 'is_available' => true],

            // Makanan Ringan (category_id = 3)
            ['category_id' => 3, 'name' => 'Croissant', 'description' => 'Croissant butter lembut', 'price' => 40000, 'is_available' => true],
            ['category_id' => 3, 'name' => 'Donut', 'description' => 'Donut dengan berbagai topping', 'price' => 25000, 'is_available' => true],
            ['category_id' => 3, 'name' => 'Sandwich', 'description' => 'Sandwich isi daging dan sayur', 'price' => 45000, 'is_available' => true],

            // Minuman Dingin (category_id = 4)
            ['category_id' => 4, 'name' => 'Iced Coffee', 'description' => 'Kopi dingin dengan es', 'price' => 35000, 'is_available' => true],
            ['category_id' => 4, 'name' => 'Iced Tea', 'description' => 'Teh dingin segar', 'price' => 25000, 'is_available' => true],
            ['category_id' => 4, 'name' => 'Smoothie', 'description' => 'Smoothie buah segar', 'price' => 40000, 'is_available' => true],

            // Dessert (category_id = 5)
            ['category_id' => 5, 'name' => 'Tiramisu', 'description' => 'Tiramisu klasik Italia', 'price' => 50000, 'is_available' => true],
            ['category_id' => 5, 'name' => 'Cheesecake', 'description' => 'Cheesecake creamy', 'price' => 55000, 'is_available' => true],
            ['category_id' => 5, 'name' => 'Brownies', 'description' => 'Brownies coklat lezat', 'price' => 35000, 'is_available' => true],
        ];

        foreach ($menus as $menu) {
            Menu::create($menu);
        }
    }
}
