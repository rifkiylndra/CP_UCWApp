<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $sourceDir = base_path('docs/menu-ucw/gambar-menu');
        $destDir = storage_path('app/public/menus');

        if (!File::exists($destDir)) {
            File::makeDirectory($destDir, 0755, true);
        }

        // Scan source directory for image files and build lowercase index to keep casing exact
        $imageFiles = [];
        if (File::exists($sourceDir)) {
            $files = File::files($sourceDir);
            foreach ($files as $file) {
                $filename = $file->getFilename();
                $imageFiles[strtolower(pathinfo($filename, PATHINFO_FILENAME))] = $filename;
                // Copy file to public storage
                File::copy($file->getRealPath(), $destDir . '/' . $filename);
            }
        }

        // Clear old menus safely (Cascade set null will trigger on onDelete)
        Menu::query()->delete();

        // Read and parse the CSV
        $csvPath = base_path('docs/menu-ucw/menu-ucw.csv');
        if (!File::exists($csvPath)) {
            return;
        }

        if (($handle = fopen($csvPath, 'r')) !== false) {
            // Skip header
            fgetcsv($handle);

            while (($row = fgetcsv($handle, 1000, ',')) !== false) {
                if (count($row) < 6) {
                    continue;
                }

                $menuName = trim($row[1]);
                $priceRaw = trim($row[2]);
                $prepTime = (int) trim($row[3]);
                $description = trim($row[4]);
                $systemCategory = trim($row[5]);

                if (empty($menuName)) {
                    continue;
                }

                // Map system category to database Category model
                $categoryName = match($systemCategory) {
                    'coffe' => 'Coffee',
                    'non-coffe' => 'Non-Coffee',
                    'food' => 'Food',
                    'snack' => 'Snack',
                    default => 'Snack'
                };

                $category = Category::where('name', $categoryName)->first();
                $categoryId = $category ? $category->id : 4;

                // Clean price separator: e.g. "20.000" -> 20000
                $price = (float) str_replace(['.', ','], '', $priceRaw);

                // Map image with exact filename casing
                $imagePath = null;
                $normalizedMenuName = strtolower($menuName);
                if (isset($imageFiles[$normalizedMenuName])) {
                    $imagePath = 'menus/' . $imageFiles[$normalizedMenuName];
                }

                Menu::create([
                    'category_id' => $categoryId,
                    'name' => $menuName,
                    'description' => $description,
                    'price' => $price,
                    'estimated_time' => $prepTime,
                    'image' => $imagePath,
                    'is_available' => true,
                ]);
            }
            fclose($handle);
        }
    }
}