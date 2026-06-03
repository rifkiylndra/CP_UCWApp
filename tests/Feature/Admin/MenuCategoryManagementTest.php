<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Menu;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class MenuCategoryManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function createAdmin(): User
    {
        return User::create([
            'name' => 'Admin User',
            'username' => 'adminuser',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);
    }

    public function test_admin_can_create_and_update_category(): void
    {
        $admin = $this->createAdmin();

        $this->actingAs($admin)
            ->post(route('admin.menu-categories.store'), [
                'name' => 'Manual Brew',
            ])
            ->assertRedirect();

        $category = Category::where('name', 'Manual Brew')->first();

        $this->assertNotNull($category);

        $this->actingAs($admin)
            ->put(route('admin.menu-categories.update', $category), [
                'name' => 'Manual Brew Bar',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Manual Brew Bar',
        ]);
    }

    public function test_admin_cannot_delete_category_that_is_still_used_by_menu(): void
    {
        $admin = $this->createAdmin();

        $category = Category::create([
            'name' => 'Coffee',
        ]);

        Menu::create([
            'category_id' => $category->id,
            'name' => 'Americano',
            'description' => 'Black coffee',
            'price' => 25000,
            'estimated_time' => 15,
            'is_available' => true,
        ]);

        $this->actingAs($admin)
            ->delete(route('admin.menu-categories.destroy', $category))
            ->assertSessionHasErrors('category');

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
        ]);
    }

    public function test_admin_can_store_menu_with_estimated_time(): void
    {
        $admin = $this->createAdmin();

        $category = Category::create([
            'name' => 'Tea',
        ]);

        $this->actingAs($admin)
            ->post(route('admin.menu.store'), [
                'name' => 'Chamomile Tea',
                'description' => 'Warm and floral',
                'price' => 22000,
                'estimated_time' => 7,
                'category_id' => $category->id,
                'is_available' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('menus', [
            'name' => 'Chamomile Tea',
            'category_id' => $category->id,
            'estimated_time' => 7,
        ]);
    }
}
