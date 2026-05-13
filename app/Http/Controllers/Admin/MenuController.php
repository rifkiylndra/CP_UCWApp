<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuResource;
use App\Models\Category;
use App\Models\Menu;
use Inertia\Inertia;

class MenuController extends Controller
{
    /**
     * Display menu management page
     */
    public function index()
    {
        $menus = Menu::with('category')->paginate(15);
        $categories = Category::all();

        return Inertia::render('Admin/Menu', [
            'menus' => MenuResource::collection($menus),
            'categories' => $categories,
        ]);
    }

    /**
     * Store new menu
     */
    public function store()
    {
        $validated = request()->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|max:2048',
            'is_available' => 'boolean',
        ]);

        if (request()->hasFile('image')) {
            $validated['image'] = request()->file('image')->store('menus', 'public');
        }

        $menu = Menu::create($validated);

        return response()->json([
            'data' => new MenuResource($menu),
            'message' => 'Menu created successfully',
        ], 201);
    }

    /**
     * Update menu
     */
    public function update(Menu $menu)
    {
        $validated = request()->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|max:2048',
            'is_available' => 'boolean',
        ]);

        if (request()->hasFile('image')) {
            $validated['image'] = request()->file('image')->store('menus', 'public');
        }

        $menu->update($validated);

        return response()->json([
            'data' => new MenuResource($menu),
            'message' => 'Menu updated successfully',
        ]);
    }

    /**
     * Delete menu
     */
    public function destroy(Menu $menu)
    {
        $menu->delete();

        return response()->json(['message' => 'Menu deleted successfully']);
    }
}
