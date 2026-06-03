<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Category::query()
                ->withCount('menus')
                ->orderBy('name')
                ->get()
        );
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        Category::create($request->validated());

        return redirect()->back()->with('success', 'Category created successfully');
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $category->update($request->validated());

        return redirect()->back()->with('success', 'Category updated successfully');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->menus()->exists()) {
            return redirect()
                ->back()
                ->withErrors([
                    'category' => 'Category cannot be deleted because it is still used by one or more menus.',
                ]);
        }

        $category->delete();

        return redirect()->back()->with('success', 'Category deleted successfully');
    }
}
