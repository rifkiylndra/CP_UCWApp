<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Menu;

class AiService
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.ai.base_url', 'http://127.0.0.1:8000');
    }

    /**
     * Get serving time estimation using MLR
     * 
     * @param array $orderData
     * @return array
     */
    public function getServingTimeEstimation(array $orderData): array
    {
        try {
            $jumlahKopi = 0;
            $jumlahKopiManual = 0;
            $jumlahNonKopi = 0;
            $jumlahMakanan = 0;

            if (!empty($orderData['items'])) {
                $menuIds = collect($orderData['items'])->pluck('id')->filter()->toArray();
                if (empty($menuIds)) {
                    // Fallback to menu_id if id is not provided
                    $menuIds = collect($orderData['items'])->pluck('menu_id')->filter()->toArray();
                }
                
                $menus = Menu::whereIn('id', $menuIds)->with('category')->get()->keyBy('id');

                foreach ($orderData['items'] as $item) {
                    $mId = $item['id'] ?? $item['menu_id'] ?? null;
                    $menu = $menus[$mId] ?? null;
                    
                    if ($menu) {
                        $catName = strtolower($menu->category->name ?? '');
                        $qty = $item['quantity'] ?? 1;
                        
                        if (str_contains($catName, 'manual')) {
                            $jumlahKopiManual += $qty;
                        } elseif (str_contains($catName, 'kopi') || str_contains($catName, 'coffee') || str_contains($catName, 'espresso')) {
                            $jumlahKopi += $qty;
                        } elseif (str_contains($catName, 'makanan') || str_contains($catName, 'snack') || str_contains($catName, 'food') || str_contains($catName, 'pastry')) {
                            $jumlahMakanan += $qty;
                        } else {
                            $jumlahNonKopi += $qty;
                        }
                    }
                }
            }

            $currentHour = (int) now()->format('H');
            $isPeakHour = ($currentHour >= 12 && $currentHour <= 14) || ($currentHour >= 18 && $currentHour <= 21) ? 1 : 0;

            $response = Http::timeout(10)->post($this->baseUrl . '/api/estimation/predict', [
                'jumlah_kopi' => $jumlahKopi,
                'jumlah_kopi_manual' => $jumlahKopiManual,
                'jumlah_non_kopi' => $jumlahNonKopi,
                'jumlah_makanan' => $jumlahMakanan,
                'antrian_dapur' => $orderData['current_queue'] ?? 0,
                'is_peak_hour' => $isPeakHour
            ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'estimated_time' => $response->json('estimasi_menit'),
                    'display' => $response->json('display'),
                    'confidence' => 0.85,
                    'model_performance' => null,
                ];
            }

            return [
                'success' => false,
                'estimated_time' => $this->calculateFallbackEstimation($orderData),
                'message' => 'AI service unavailable, using fallback calculation',
            ];
        } catch (\Exception $e) {
            Log::error('AI service error: ' . $e->getMessage());
            
            return [
                'success' => false,
                'estimated_time' => $this->calculateFallbackEstimation($orderData),
                'message' => 'AI service error: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Get popular menu ranking using WMA
     * 
     * @param int $limit
     * @return array
     */
    public function getPopularMenus(int $limit = 10): array
    {
        try {
            $response = Http::timeout(10)->get($this->baseUrl . '/api/menu/popular', [
                'limit' => $limit,
                'period_days' => 30,
            ]);

            if ($response->successful()) {
                // Return fallback if FastAPI fails or doesn't return exactly what frontend expects
                // Since FastAPI returns {"status": "ok", "wma_top_menus": [...]}
                $data = $response->json();
                if (isset($data['wma_top_menus'])) {
                    return [
                        'success' => true,
                        'menus' => $data['wma_top_menus'],
                        'trend_analysis' => 'WMA computed',
                    ];
                }
            }

            return $this->getFallbackPopularMenus($limit);
        } catch (\Exception $e) {
            Log::error('AI popular menus error: ' . $e->getMessage());
            
            return $this->getFallbackPopularMenus($limit);
        }
    }

    /**
     * Analyze review sentiment using Naive Bayes
     * 
     * @param string $reviewText
     * @return array
     */
    public function analyzeSentiment(string $reviewText): array
    {
        try {
            $response = Http::timeout(10)->post($this->baseUrl . '/api/sentiment/analyze', [
                'komentar' => $reviewText,
                'rating' => 5 // Default rating if none provided
            ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'sentiment' => $response->json('sentiment_label'),
                    'confidence' => $response->json('confidence'),
                    'keywords' => [],
                ];
            }

            return $this->analyzeFallbackSentiment($reviewText);
        } catch (\Exception $e) {
            Log::error('AI sentiment analysis error: ' . $e->getMessage());
            
            return $this->analyzeFallbackSentiment($reviewText);
        }
    }

    /**
     * Get sentiment summary
     * 
     * @return array
     */
    public function getSentimentSummary(): array
    {
        try {
            $response = Http::timeout(10)->get($this->baseUrl . '/api/sentiment/summary');

            if ($response->successful()) {
                return [
                    'success' => true,
                    'summary' => $response->json('summary') ?? [],
                    'distribution' => $response->json('distribution') ?? [],
                ];
            }

            return $this->getFallbackSentimentSummary();
        } catch (\Exception $e) {
            Log::error('AI sentiment summary error: ' . $e->getMessage());
            
            return $this->getFallbackSentimentSummary();
        }
    }

    /**
     * Fallback calculation for serving time
     */
    private function calculateFallbackEstimation(array $orderData): int
    {
        $baseTime = 5;
        $timePerItem = 3;
        $queuePenalty = ($orderData['current_queue'] ?? 0) * 2;
        
        $totalItems = array_sum(array_column($orderData['items'] ?? [], 'quantity'));
        
        return min($baseTime + ($totalItems * $timePerItem) + $queuePenalty, 60);
    }

    /**
     * Fallback popular menus
     */
    private function getFallbackPopularMenus(int $limit): array
    {
        $popularMenus = \DB::table('order_details')
            ->join('menus', 'order_details.menu_id', '=', 'menus.id')
            ->select(
                'menus.id',
                'menus.name',
                'menus.price',
                \DB::raw('SUM(order_details.quantity) as total_sold')
            )
            ->groupBy('menus.id', 'menus.name', 'menus.price')
            ->orderBy('total_sold', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();

        return [
            'success' => false,
            'menus' => $popularMenus,
            'message' => 'Using database fallback for popular menus',
        ];
    }

    /**
     * Fallback sentiment analysis
     */
    private function analyzeFallbackSentiment(string $text): array
    {
        // Simple keyword-based fallback
        $positiveKeywords = ['bagus', 'enak', 'cepat', 'ramah', 'puas', 'recommended'];
        $negativeKeywords = ['lambat', 'buruk', 'jelek', 'mahal', 'kecewa', 'tidak'];
        
        $textLower = strtolower($text);
        
        $positiveCount = 0;
        $negativeCount = 0;
        
        foreach ($positiveKeywords as $keyword) {
            if (str_contains($textLower, $keyword)) {
                $positiveCount++;
            }
        }
        
        foreach ($negativeKeywords as $keyword) {
            if (str_contains($textLower, $keyword)) {
                $negativeCount++;
            }
        }
        
        if ($positiveCount > $negativeCount) {
            $sentiment = 'positive';
        } elseif ($negativeCount > $positiveCount) {
            $sentiment = 'negative';
        } else {
            $sentiment = 'neutral';
        }
        
        return [
            'success' => false,
            'sentiment' => $sentiment,
            'confidence' => 0.5,
            'message' => 'Using keyword-based fallback analysis',
        ];
    }

    /**
     * Fallback sentiment summary
     */
    private function getFallbackSentimentSummary(): array
    {
        $summary = \DB::table('reviews')
            ->selectRaw('
                COUNT(*) as total_reviews,
                SUM(CASE WHEN sentiment_label = "positive" THEN 1 ELSE 0 END) as positive,
                SUM(CASE WHEN sentiment_label = "neutral" THEN 1 ELSE 0 END) as neutral,
                SUM(CASE WHEN sentiment_label = "negative" THEN 1 ELSE 0 END) as negative
            ')
            ->first();

        return [
            'success' => false,
            'summary' => [
                'total_reviews' => $summary->total_reviews ?? 0,
                'positive_percentage' => $summary->total_reviews > 0 
                    ? round(($summary->positive / $summary->total_reviews) * 100, 2) 
                    : 0,
                'neutral_percentage' => $summary->total_reviews > 0 
                    ? round(($summary->neutral / $summary->total_reviews) * 100, 2) 
                    : 0,
                'negative_percentage' => $summary->total_reviews > 0 
                    ? round(($summary->negative / $summary->total_reviews) * 100, 2) 
                    : 0,
            ],
            'message' => 'Using database fallback for sentiment summary',
        ];
    }
}
