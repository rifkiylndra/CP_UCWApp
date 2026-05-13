<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuResource;
use App\Models\Category;
use App\Models\Menu;
use Inertia\Inertia;

class MenuController extends Controller
{
    /**
     * Display menu page
     */
    public function index()
    {
        $categories = Category::with('menus')->get();
        $menus = Menu::where('is_available', true)->get();

        return Inertia::render('Customer/Menu', [
            'categories' => $categories,
            'menus' => MenuResource::collection($menus),
        ]);
    }

    /**
     * Get menus by category
     */
    public function getByCategory(Category $category)
    {
        $menus = $category->menus()->where('is_available', true)->get();

        return response()->json([
            'data' => MenuResource::collection($menus),
        ]);
    }

    /**
     * Get menu detail
     */
    public function show(Menu $menu)
    {
        return response()->json([
            'data' => new MenuResource($menu),
        ]);
    }
}
