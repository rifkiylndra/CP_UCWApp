<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMenuRequest;
use App\Http\Requests\Admin\UpdateMenuRequest;
use App\Models\Menu;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $query = Menu::with('category')->orderBy('id', 'desc');

        $categories = Category::query()
            ->withCount('menus')
            ->orderBy('name')
            ->get();

        $menus = $query->paginate(10);

        return Inertia::render('Admin/Menu/Index', [
            'menus' => $menus,
            'categories' => $categories,
        ]);
    }

    public function store(StoreMenuRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menus', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        Menu::create($validated);

        return redirect()->back()->with('success', 'Menu created successfully');
    }

    public function update(UpdateMenuRequest $request, Menu $menu)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
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
