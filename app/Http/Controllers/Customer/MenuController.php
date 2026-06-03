<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Menu;
use App\Models\Table;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    /**
     * Display menu page for QR ordering
     */
    public function index(Request $request)
    {
        $tableId = $request->query('table_id');
        $table = null;

        if ($tableId) {
            $table = Table::find($tableId);
        }

        $categories = Category::query()
            ->orderBy('name')
            ->get();

        $menuItems = Menu::with('category')
            ->where('is_available', true)
            ->get()
            ->map(function ($menu) {
                return [
                    'id' => (string)$menu->id,
                    'category_id' => $menu->category_id,
                    'name' => $menu->name,
                    'subtitle' => $menu->description ?? '',
                    'description' => $menu->description ?? '',
                    'price' => (float)$menu->price,
                    'estimated_time' => (int) $menu->estimated_time,
                    'category_name' => $menu->category?->name,
                    'imageUrl' => $menu->image_url,
                    'isAvailable' => (bool)$menu->is_available,
                    'isPopular' => false,
                ];
            });

        $formattedCategories = $categories->map(function ($cat) {
            return [
                'key' => (string) $cat->id,
                'label' => $cat->name,
            ];
        });

        $formattedCategories->prepend(['key' => 'all', 'label' => 'All']);

        return Inertia::render('Customer/Menu', [
            'menuItems' => $menuItems,
            'serverCategories' => $formattedCategories,
            'tableId' => $tableId ?? 'T01',
            'tableNumber' => $table ? $table->table_number : '05',
        ]);
    }

    /**
     * Get menu items by category
     */
    public function getByCategory($categoryId)
    {
        $menus = Menu::with('category')
            ->where('category_id', $categoryId)
            ->where('is_available', true)
            ->get()
            ->map(function ($menu) {
                return [
                    'id' => (string) $menu->id,
                    'category_id' => $menu->category_id,
                    'name' => $menu->name,
                    'subtitle' => $menu->description ?? '',
                    'description' => $menu->description ?? '',
                    'price' => (float) $menu->price,
                    'estimated_time' => (int) $menu->estimated_time,
                    'category_name' => $menu->category?->name,
                    'imageUrl' => $menu->image_url,
                    'isAvailable' => (bool) $menu->is_available,
                    'isPopular' => false,
                ];
            });

        return response()->json($menus);
    }

    /**
     * Search menu items
     */
    public function search(Request $request)
    {
        $query = $request->query('q');
        
        $menus = Menu::where('is_available', true)
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%");
            })
            ->get();

        return response()->json($menus);
    }

    /**
     * Get menu item details
     */
    public function show($id)
    {
        $menu = Menu::with('category')->findOrFail($id);
        
        return response()->json($menu);
    }
}
