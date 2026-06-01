<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiService
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.ai.base_url', 'http://localhost:8000');
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
            $response = Http::timeout(10)->post($this->baseUrl . '/api/estimation/predict', [
                'order_items' => $orderData['items'] ?? [],
                'current_queue' => $orderData['current_queue'] ?? 0,
                'time_of_day' => now()->format('H'),
            ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'estimated_time' => $response->json('estimated_time'),
                    'confidence' => $response->json('confidence'),
                    'model_performance' => $response->json('model_performance'),
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
                return [
                    'success' => true,
                    'menus' => $response->json('menus'),
                    'trend_analysis' => $response->json('trend_analysis'),
                ];
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
                'text' => $reviewText,
            ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'sentiment' => $response->json('sentiment'),
                    'confidence' => $response->json('confidence'),
                    'keywords' => $response->json('keywords'),
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
                    'summary' => $response->json('summary'),
                    'distribution' => $response->json('distribution'),
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