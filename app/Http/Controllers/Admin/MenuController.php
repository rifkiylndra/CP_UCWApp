<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $query = Menu::with('category')->orderBy('id', 'desc');
        
        // Coba kita ambil kategori juga untuk dropdown filter
        $categories = Category::all();
        
        // Paginasi 10 item per halaman
        $menus = $query->paginate(10);
        
        return Inertia::render('Admin/Menu/Index', [
            'menus' => $menus,
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        if ($request->has('is_available')) {
            $request->merge(['is_available' => filter_var($request->is_available, FILTER_VALIDATE_BOOLEAN)]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_available' => 'boolean',
            'image' => 'nullable|image|max:10240' // max 10MB
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menus', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        Menu::create($validated);

        return redirect()->back()->with('success', 'Menu created successfully');
    }

    public function update(Request $request, Menu $menu)
    {
        if ($request->has('is_available')) {
            $request->merge(['is_available' => filter_var($request->is_available, FILTER_VALIDATE_BOOLEAN)]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_available' => 'boolean',
            'image' => 'nullable|image|max:10240'
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($menu->image && str_contains($menu->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $menu->image);
                Storage::disk('public')->delete($oldPath);
            }
            
            $path = $request->file('image')->store('menus', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $menu->update($validated);

        return redirect()->back()->with('success', 'Menu updated successfully');
    }

    public function destroy(Menu $menu)
    {
        if ($menu->image && str_contains($menu->image, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $menu->image);
            Storage::disk('public')->delete($oldPath);
        }
        
        $menu->delete();

        return redirect()->back()->with('success', 'Menu deleted successfully');
    }
}
