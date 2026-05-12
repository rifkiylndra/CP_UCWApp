<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        // Coffee
        Menu::create(['category_id' => 1, 'name' => 'Americano', 'description' => 'Espresso + air panas', 'price' => 25000, 'image' => 'menus/americano.jpg', 'is_available' => true]);
        Menu::create(['category_id' => 1, 'name' => 'Cappuccino', 'description' => 'Espresso + susu + foam', 'price' => 28000, 'image' => 'menus/cappuccino.jpg', 'is_available' => true]);
        Menu::create(['category_id' => 1, 'name' => 'Latte', 'description' => 'Espresso + susu steamed', 'price' => 30000, 'image' => 'menus/latte.jpg', 'is_available' => true]);

        // Non-Coffee
        Menu::create(['category_id' => 2, 'name' => 'Matcha Latte', 'description' => 'Matcha premium + susu', 'price' => 32000, 'image' => 'menus/matcha.jpg', 'is_available' => true]);
        Menu::create(['category_id' => 2, 'name' => 'Thai Tea', 'description' => 'Thai tea dengan susu', 'price' => 22000, 'image' => 'menus/thaitea.jpg', 'is_available' => true]);

        // Food
        Menu::create(['category_id' => 3, 'name' => 'Nasi Goreng', 'description' => 'Nasi goreng spesial', 'price' => 35000, 'image' => 'menus/nasgor.jpg', 'is_available' => true]);
        Menu::create(['category_id' => 3, 'name' => 'Chicken Katsu', 'description' => 'Ayam katsu dengan nasi', 'price' => 38000, 'image' => 'menus/katsu.jpg', 'is_available' => true]);

        // Snack
        Menu::create(['category_id' => 4, 'name' => 'Croissant', 'description' => 'Croissant butter', 'price' => 18000, 'image' => 'menus/croissant.jpg', 'is_available' => true]);
        Menu::create(['category_id' => 4, 'name' => 'Cheese Cake', 'description' => 'Slice cheese cake', 'price' => 25000, 'image' => 'menus/cheesecake.jpg', 'is_available' => true]);
    }
}