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

        $categories = Category::with(['menus' => function($query) {
            $query->where('is_available', true);
        }])->get();

        $menuItems = Menu::with('category')
            ->where('is_available', true)
            ->get()
            ->map(function ($menu) {
                return [
                    'id' => (string)$menu->id,
                    'name' => $menu->name,
                    'subtitle' => $menu->description ?? '',
                    'description' => $menu->description ?? '',
                    'price' => (float)$menu->price,
                    'category' => $menu->category ? strtolower($menu->category->name) : 'all',
                    'imageUrl' => $menu->image_url,
                    'isAvailable' => (bool)$menu->is_available,
                    'isPopular' => false,
                ];
            });

        $formattedCategories = $categories->map(function ($cat) {
            return [
                'key' => strtolower($cat->name),
                'label' => $cat->name
            ];
        });

        // Add 'all' category at the beginning
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
        $menus = Menu::where('category_id', $categoryId)
            ->where('is_available', true)
            ->get();

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